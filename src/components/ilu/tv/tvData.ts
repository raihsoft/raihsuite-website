/**
 * Data layer for the ILU Palada Challenge TV display.
 *
 * The TV engine only understands `TvSnapshot`. A source produces snapshots:
 *  - `createLiveSource()` reads the RaihSuite API (order_status, order_by_organization,
 *    organizations, advertisements) and maps it into a snapshot.
 *  - `createDemoSource()` produces sample data that changes on every call (`?demo=1`).
 *
 * Where the API has no delivery timestamps, deliveries are detected by comparing each
 * poll with the previous one (DeliveryTracker) and kept in localStorage for the day,
 * so the "Just delivered" list and the hourly chart still fill up while the TV runs.
 */
import { getILUConfig, type BackendOrderByOrganization, type BackendOrderStatus, type BackendOrganization } from '@/lib/iluService';

export interface TvClub {
  id: string;
  name: string;
  place: string;
  ordered: number;
  delivered: number;
  approved: number; // approved, waiting for delivery
  pending: number; // placed, waiting for approval
  initiated: number; // delivery initiated quantity (total_delivery_initiated)
  deliveryStatus?: string;
  lastDeliveryTime: number; // timestamp in ms of latest delivery
  lastOrderDate?: string;
}

export interface TvDelivery {
  key: string;
  clubName: string;
  place: string;
  qty: number;
  time: number;
}

export interface TvAd {
  id: string;
  title?: string;
  body?: string;
  contact?: string;
  image?: string;
  house?: boolean;
  /** Built-in animated card instead of a text or image ad. */
  kind?: 'townshop' | 'raihsoft-solutions' | 'raihsoft-services' | 'raihsoft-contact' | 'ilu-foundation';
}

export interface TvTotals {
  ordered: number;
  delivered: number;
  approved: number;
  pending: number;
  stock: number;
  orgL: number;
  indL: number;
  deliveryInitiatedCount: number;
  deliveryInitiatedLiters: number;
}

export interface TvSnapshot {
  fetchedAt: number;
  totals: TvTotals;
  clubs: TvClub[];
  latest: TvDelivery[];
  hourly: { h: number; v: number }[];
  deliveriesToday: number;
}

export interface TvSource {
  kind: 'live' | 'demo';
  pollMs: number;
  load(): Promise<TvSnapshot>;
  loadAds(): Promise<TvAd[]>;
}

export const HOURS_SHOWN = 11;

/** Our own townshop.in card, always part of the side-ad rotation. */
export const TOWNSHOP_AD: TvAd = { id: 'townshop', kind: 'townshop', title: 'townshop.in', house: true };

/** Built-in Raihsoft brand, services and contact ads based on official marketing materials. */
export const RAIHSOFT_SOLUTIONS_AD: TvAd = {
  id: 'raihsoft-solutions',
  kind: 'raihsoft-solutions',
  title: 'Enterprise Digital Solutions',
  house: true,
};

export const RAIHSOFT_SERVICES_AD: TvAd = {
  id: 'raihsoft-services',
  kind: 'raihsoft-services',
  title: 'Raihsoft Engineering Services',
  house: true,
};

export const RAIHSOFT_CONTACT_AD: TvAd = {
  id: 'raihsoft-contact',
  kind: 'raihsoft-contact',
  title: 'Contact Raihsoft',
  house: true,
};

export const ILU_FOUNDATION_AD: TvAd = {
  id: 'ilu-foundation',
  kind: 'ilu-foundation',
  title: 'ILU Foundation',
  body: 'Integrate, Love & Uplift the Differently-abled. According to the World Health Organization (WHO), there are 1 billion disabled people in the world.',
  contact: 'ILU Foundation',
  image: '/ilu/tv/ilu-foundation-ad.png',
  house: true,
};

export const RAIHSOFT_ADS: TvAd[] = [
  RAIHSOFT_SOLUTIONS_AD,
  RAIHSOFT_SERVICES_AD,
  RAIHSOFT_CONTACT_AD,
];

/** Shown when the ads table is empty or cannot be reached. */
export const HOUSE_ADS: TvAd[] = [
  ILU_FOUNDATION_AD,
  {
    id: 'house-ilu-banner',
    kind: 'ilu-foundation',
    image: '/ilu/tv/ilu-foundation-ad.png',
    title: 'ILU Foundation',
    body: 'Integration Love & Uplift The Differently-Abled',
    contact: 'ILU Foundation',
    house: true,
  },
  {
    id: 'house-thanks',
    title: 'Thank you, volunteers',
    body: 'Hundreds of hands cooked and carried today’s palada. ILU Foundation thanks every one of you.',
    contact: 'ILU Foundation',
    house: true,
  },
];

const num = (v: unknown): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : 0;
};
const str = (v: unknown): string => (v == null ? '' : String(v).trim());
/** Reads a field the shared API types do not declare (e.g. total_pending_delivery). */
const extra = (o: object, key: string): unknown => (o as Record<string, unknown>)[key];

function results<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const o = data as { results?: unknown; data?: unknown };
    if (Array.isArray(o.results)) return o.results as T[];
    if (Array.isArray(o.data)) return o.data as T[];
  }
  return [];
}

function windowHours(now = new Date()): number[] {
  const cur = now.getHours();
  return Array.from({ length: HOURS_SHOWN }, (_, i) => (cur - (HOURS_SHOWN - 1) + i + 24) % 24);
}

function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/* ------------------------------------------------------------------ */
/* Delivery tracking from poll-to-poll differences                     */
/* ------------------------------------------------------------------ */
interface TrackerState {
  day: string;
  baseline: Record<string, number>;
  hourly: Record<string, number>;
  log: TvDelivery[];
  count: number;
}

class DeliveryTracker {
  private state: TrackerState;
  constructor(private storageKey: string) {
    this.state = this.read() ?? { day: dayKey(), baseline: {}, hourly: {}, log: [], count: 0 };
  }

  private read(): TrackerState | null {
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const s = JSON.parse(raw) as TrackerState;
      return s && s.day === dayKey() ? s : null;
    } catch {
      return null;
    }
  }

  private save(): void {
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch {
      /* storage unavailable: tracking still works for this session */
    }
  }

  observe(clubs: TvClub[]): void {
    const today = dayKey();
    if (this.state.day !== today) {
      this.state = { day: today, baseline: this.state.baseline, hourly: {}, log: [], count: 0 };
    }
    const first = Object.keys(this.state.baseline).length === 0;
    const now = Date.now();
    const hour = String(new Date().getHours());
    for (const c of clubs) {
      const before = this.state.baseline[c.id];
      if (!first && before != null && c.delivered > before) {
        const qty = c.delivered - before;
        this.state.hourly[hour] = (this.state.hourly[hour] ?? 0) + qty;
        this.state.log.unshift({ key: `${c.id}:${now}`, clubName: c.name, place: c.place, qty, time: now });
        this.state.count += 1;
      }
      this.state.baseline[c.id] = c.delivered;
    }
    this.state.log = this.state.log.slice(0, 10);
    this.save();
  }

  get latest(): TvDelivery[] {
    return this.state.log;
  }
  get count(): number {
    return this.state.count;
  }
  hourly(): { h: number; v: number }[] {
    return windowHours().map((h) => ({ h, v: this.state.hourly[String(h)] ?? 0 }));
  }
}

/* ------------------------------------------------------------------ */
/* Live API source                                                     */
/* ------------------------------------------------------------------ */
type ApiOrder = NonNullable<BackendOrderByOrganization['orders']>[number] & {
  delivered_at?: string | null;
  delivery_date?: string | null;
  updated_at?: string | null;
};

function deliveredTime(o: ApiOrder): number {
  return Date.parse(str(o.delivered_at) || str(o.delivery_date) || str(o.updated_at)) || 0;
}

function mapAd(raw: Record<string, unknown>, i: number): TvAd | null {
  if (raw.is_active === false) return null;
  const now = Date.now();
  const start = Date.parse(str(raw.start_date));
  const end = Date.parse(str(raw.end_date));
  if (start && start > now) return null;
  if (end && end < now) return null;
  const image = str(raw.image) || str(raw.image_url) || str(raw.banner) || str(raw.file);
  const title = str(raw.title) || str(raw.name);
  const body = str(raw.description) || str(raw.body) || str(raw.content);
  if (!image && !title) return null;
  return {
    id: str(raw.id) || `ad-${i}`,
    title,
    body,
    contact: str(raw.contact) || str(raw.phone) || str(raw.mobile),
    image: image || undefined,
  };
}

export function createLiveSource(): TvSource {
  const tracker = new DeliveryTracker('ilu-tv-delivery-tracker-v1');

  return {
    kind: 'live',
    pollMs: 15000,

    async load(): Promise<TvSnapshot> {
      const config = await getILUConfig();
      const tenant = encodeURIComponent(String(config.TENANT_ID));
      const fundraising = encodeURIComponent(config.FUNDRAISING_CODE);
      const get = (url: string) => fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });

      const [statusRes, byOrgRes, orgsRes] = await Promise.all([
        get(`${config.ORDER_STATUS_URL}?tenant=${tenant}&fundraising=${fundraising}`),
        get(`${config.ORDER_BY_ORGANIZATION_URL}?tenant=${tenant}&fundraising=${fundraising}&limit=500&offset=0`),
        get(`${config.ORGANIZATIONS_URL}?tenant=${tenant}&limit=500&offset=0`).catch(() => null),
      ]);
      if (!statusRes.ok) throw new Error(`order_status ${statusRes.status}`);
      if (!byOrgRes.ok) throw new Error(`order_by_organization ${byOrgRes.status}`);

      const stats = (await statusRes.json()) as BackendOrderStatus;
      const byOrg = results<BackendOrderByOrganization>(await byOrgRes.json());
      const orgs = orgsRes && orgsRes.ok ? results<BackendOrganization>(await orgsRes.json().catch(() => [])) : [];
      const orgInfo = new Map(orgs.map((o) => [String(o.id), o]));

      const apiDeliveries: TvDelivery[] = [];
      let deliveryInitiatedCount = 0;
      let deliveryInitiatedLiters = 0;

      const clubs: TvClub[] = byOrg
        .map((o) => {
          const id = str(o.organization_id);
          const info = orgInfo.get(id);
          // The API's total_approved already includes delivered litres, so "ready" is
          // approved minus delivered (total_pending_delivery when the API sends it).
          const confirmed = num(o.total_approved);
          const delivered = num(o.total_delivered);
          const approved = extra(o, 'total_pending_delivery') != null ? num(extra(o, 'total_pending_delivery')) : Math.max(0, confirmed - delivered);
          const initiated = num(
            o.total_delivery_initiated ??
            extra(o, 'total_delivery_initiated') ??
            o.total_initiated
          );
          const deliveryStatus = str(
            o.delivery_status ??
            extra(o, 'delivery_status') ??
            o.status
          );
          const orders = (o.orders ?? []) as ApiOrder[];
          const name = str(o.organization_name) || str(info?.organization_name);
          const place = str(info?.place);

          let orgLastDeliveryTime = 0;
          let orgInitiatedCount = 0;

          for (const ord of orders) {
            const st = str(ord.status).toUpperCase();
            if (st === 'INITIATED') {
              orgInitiatedCount++;
            }
            if (st === 'DELIVERED') {
              const t = deliveredTime(ord);
              if (t) {
                apiDeliveries.push({ key: `${id}:${str(ord.order_number) || t}`, clubName: name, place, qty: num(ord.quantity), time: t });
                if (t > orgLastDeliveryTime) orgLastDeliveryTime = t;
              }
            }
          }

          if (initiated > 0 || deliveryStatus.toUpperCase() === 'INITIATED') {
            deliveryInitiatedCount += (orgInitiatedCount > 0 ? orgInitiatedCount : 1);
          } else if (orgInitiatedCount > 0) {
            deliveryInitiatedCount += orgInitiatedCount;
          }
          deliveryInitiatedLiters += initiated;

          if (orgLastDeliveryTime === 0) {
            orgLastDeliveryTime = Date.parse(str(o.last_ordered_at)) || 0;
          }

          const orderQty = num(o.total_order_quantity);
          const ordered = orderQty > 0 ? orderQty : Math.max(confirmed, delivered, initiated);

          return {
            id,
            name,
            place,
            ordered,
            delivered,
            approved: Math.max(0, approved - initiated),
            pending: Math.max(0, ordered - delivered - initiated),
            initiated,
            deliveryStatus,
            lastDeliveryTime: orgLastDeliveryTime,
            lastOrderDate: str(o.last_ordered_at),
          };
        })
        .filter((c) => c.id && c.name && c.ordered > 0);

      if (deliveryInitiatedLiters === 0 && num(extra(stats, 'total_delivery_initiated')) > 0) {
        deliveryInitiatedLiters = num(extra(stats, 'total_delivery_initiated'));
      }
      if (deliveryInitiatedCount === 0 && deliveryInitiatedLiters > 0) {
        deliveryInitiatedCount = clubs.filter((c) => c.initiated > 0 || c.deliveryStatus?.toUpperCase() === 'INITIATED').length || 1;
      }

      tracker.observe(clubs);

      // Backfill any tracker times if higher
      for (const c of clubs) {
        const tr = tracker.latest.find((d) => d.clubName === c.name);
        if (tr && tr.time > c.lastDeliveryTime) {
          c.lastDeliveryTime = tr.time;
        }
      }

      const clubOrdered = clubs.reduce((s, c) => s + c.ordered, 0);
      const indL = num(stats.individual_total);
      const ordered = num(stats.grand_total) || clubOrdered + indL;
      const delivered = num(stats.total_delivered);
      // Ready to deliver = approved but not yet delivered (total_approved includes delivered).
      const approved =
        extra(stats, 'total_pending_delivery') != null
          ? num(extra(stats, 'total_pending_delivery'))
          : Math.max(0, num(stats.total_approved) - delivered);

      apiDeliveries.sort((a, b) => b.time - a.time);
      const useApiTimes = apiDeliveries.length > 0;
      let hourly = tracker.hourly();
      let deliveriesToday = tracker.count;
      if (useApiTimes) {
        const hours = windowHours();
        const since = Date.now() - HOURS_SHOWN * 3600_000;
        const buckets = new Map<number, number>(hours.map((h) => [h, 0]));
        const today = dayKey();
        deliveriesToday = 0;
        for (const d of apiDeliveries) {
          if (d.time >= since) {
            const h = new Date(d.time).getHours();
            if (buckets.has(h)) buckets.set(h, (buckets.get(h) ?? 0) + d.qty);
          }
          if (dayKey(new Date(d.time)) === today) deliveriesToday += 1;
        }
        hourly = hours.map((h) => ({ h, v: buckets.get(h) ?? 0 }));
      }

      return {
        fetchedAt: Date.now(),
        totals: {
          ordered,
          delivered,
          approved,
          pending: Math.max(0, ordered - delivered - approved),
          stock: num(stats.total_stock),
          orgL: num(stats.organization_total) || clubOrdered,
          indL,
          deliveryInitiatedCount,
          deliveryInitiatedLiters,
        },
        clubs,
        latest: (useApiTimes ? apiDeliveries : tracker.latest).slice(0, 10),
        hourly,
        deliveriesToday,
      };
    },

    async loadAds(): Promise<TvAd[]> {
      const config = await getILUConfig();
      const base = process.env.NEXT_PUBLIC_ILU_TV_ADS_URL || `${config.BASE_API_URL}orders/advertisements/`;
      const sep = base.includes('?') ? '&' : '?';
      const res = await fetch(`${base}${sep}tenant=${encodeURIComponent(String(config.TENANT_ID))}&limit=100`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`ads ${res.status}`);
      const rows = results<Record<string, unknown>>(await res.json());
      return rows
        .slice()
        .sort((a, b) => num(a.sort_order ?? a.order) - num(b.sort_order ?? b.order))
        .map(mapAd)
        .filter((a): a is TvAd => a !== null);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Demo source (?demo=1): sample data that keeps moving                 */
/* ------------------------------------------------------------------ */
const DEMO_CLUBS: [string, string][] = [
  ['Friends Arts & Sports Club', 'Nadakkavu'], ['Navodaya Vayanasala', 'Chevayur'], ['Yuvadhara Club', 'Feroke'],
  ['Kairali Kala Samithi', 'Mavoor'], ['Pratheeksha Youth Club', 'Kunnamangalam'], ['Sangamam Residents Association', 'Eranhipalam'],
  ['Soorya Arts Club', 'Mukkam'], ['Brothers Club', 'Koyilandy'], ['Thanal Charitable Society', 'Vadakara'],
  ['Gramadeepam Library', 'Kakkodi'], ['Sneha Kudumbashree Unit', 'Olavanna'], ['Chaithanya Club', 'Balussery'],
  ['Udaya Arts & Sports', 'Ramanattukara'], ['Jawahar Library', 'Pantheerankavu'], ['Nanma Residents Association', 'Kovoor'],
  ['Kaithangu Charitable Trust', 'Perambra'], ['Pournami Club', 'Thamarassery'], ['Deepthi Vayanasala', 'Kodiyathur'],
  ['Kalaveedu Arts Club', 'Atholi'], ['Samskara Sahithi', 'Elathur'], ['Spandanam Youth Forum', 'Nanmanda'],
  ['Prathibha Library', 'Kunnamangalam'], ['Malabar Friends Club', 'Puthiyangadi'], ['Ekatha Residents Forum', 'Mankav'],
  ['Kaumudi Arts Club', 'Payyoli'], ['Harithasree Kudumbashree', 'Omassery'], ['Sargam Cultural Forum', 'Kuttiady'],
  ['Akshara Library', 'Narikkuni'],
];
function samplePoster(a: string, b: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 842" preserveAspectRatio="xMidYMid slice"><rect width="440" height="842" fill="${a}"/><circle cx="380" cy="120" r="220" fill="${b}" opacity=".55"/><circle cx="40" cy="700" r="260" fill="${b}" opacity=".35"/><rect x="40" y="300" width="360" height="240" rx="24" fill="#fffdf7" opacity=".92"/><text x="220" y="400" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="${a}" text-anchor="middle">PALADA SPONSOR</text><text x="220" y="450" font-family="Arial,sans-serif" font-size="18" fill="#555" text-anchor="middle">Official Campaign Partner</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
const DEMO_ADS: TvAd[] = [
  { id: 'demo-1', image: samplePoster('#0f5a4a', '#f2c14e'), title: 'Palada Challenge Partner' },
  { id: 'demo-2', title: 'Malabar Gold & Diamonds', body: 'Proud supporter of the ILU Foundation Palada Challenge 2026. Celebrating community sharing.', contact: '+91 98479 91099' },
  ...HOUSE_ADS,
  { id: 'demo-5', title: 'Townshop Grocery', body: 'Order fresh Onam delicacies, groceries and essentials straight on WhatsApp.', contact: 'townshop.in' },
];

export function createDemoSource(): TvSource {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const clubs: TvClub[] = DEMO_CLUBS.map(([name, place], i) => {
    const ordered = Math.max(60, Math.round((430 - i * 9 + (rnd() - 0.5) * 40) / 10) * 10);
    const r = rnd();
    const delivered = r < 0.34 ? ordered : r < 0.7 ? Math.round((ordered * (0.3 + rnd() * 0.5)) / 5) * 5 : 0;
    const approvedFlag = delivered > 0 || rnd() < 0.6;
    const initiatedQty = !approvedFlag || rnd() < 0.3 ? Math.round((ordered - delivered) * 0.5) : 0;
    const lastDeliveryTime = delivered > 0 ? Date.now() - (i * 14 + 3) * 60000 : 0;
    return {
      id: `demo-${i}`,
      name,
      place,
      ordered,
      delivered,
      approved: approvedFlag ? ordered - delivered : 0,
      pending: approvedFlag ? 0 : ordered - delivered,
      initiated: initiatedQty,
      lastDeliveryTime,
    };
  });
  const ind = { ordered: 2450, delivered: 1640, approved: 500 };
  let stock = 1250;
  let today = 214;
  const weights = [0.015, 0.04, 0.072, 0.106, 0.14, 0.169, 0.125, 0.09, 0.105, 0.086, 0.052];
  const startTotal = clubs.reduce((s, c) => s + c.delivered, 0) + ind.delivered;
  const hours = windowHours();
  let acc = 0;
  const hourly = hours.map((h, i) => {
    const v = i < hours.length - 1 ? Math.round(startTotal * weights[i]) : startTotal - acc;
    acc += v;
    return { h, v };
  });
  const latest: TvDelivery[] = clubs.filter((c) => c.delivered > 0).slice(0, 10).map((c, i) => ({
    key: `${c.id}:init`, clubName: c.name, place: c.place, qty: 10 + ((i * 7) % 5) * 5, time: Date.now() - (i * 3.6 + 1) * 60000,
  }));
  let calls = 0;

  const step = () => {
    if (rnd() < 0.18) {
      const p = clubs.filter((c) => c.pending > 0);
      const c = p[Math.floor(rnd() * p.length)];
      if (c) { c.approved += c.pending; c.pending = 0; }
    }
    const cand = clubs.filter((c) => c.approved > 0);
    const c = cand[Math.floor(rnd() * cand.length)];
    if (!c) return;
    const qty = Math.min(c.approved, 5 * (2 + Math.floor(rnd() * 7)));
    if (stock < qty + 50) stock += 900;
    c.delivered += qty;
    c.approved -= qty;
    c.lastDeliveryTime = Date.now();
    stock -= qty;
    today += 1;
    const cur = new Date().getHours();
    if (hourly[hourly.length - 1].h !== cur) { hourly.shift(); hourly.push({ h: cur, v: 0 }); }
    hourly[hourly.length - 1].v += qty;
    latest.unshift({ key: `${c.id}:${Date.now()}`, clubName: c.name, place: c.place, qty, time: Date.now() });
    latest.length = Math.min(latest.length, 10);
  };

  return {
    kind: 'demo',
    pollMs: 7000,
    async load() {
      if (calls++ > 0) step();
      const cO = clubs.reduce((s, c) => s + c.ordered, 0);
      const cD = clubs.reduce((s, c) => s + c.delivered, 0);
      const cA = clubs.reduce((s, c) => s + c.approved, 0);
      const ordered = cO + ind.ordered;
      const delivered = cD + ind.delivered;
      const approved = cA + ind.approved;
      const initiatedClubs = clubs.filter((c) => (c.initiated ?? 0) > 0 || c.pending > 0);
      const deliveryInitiatedCount = Math.max(12, initiatedClubs.length);
      const deliveryInitiatedLiters = clubs.reduce((s, c) => s + (c.initiated || c.pending), 0);
      return {
        fetchedAt: Date.now(),
        totals: {
          ordered,
          delivered,
          approved,
          pending: Math.max(0, ordered - delivered - approved),
          stock,
          orgL: cO,
          indL: ind.ordered,
          deliveryInitiatedCount,
          deliveryInitiatedLiters,
        },
        clubs: clubs.map((c) => ({ ...c })),
        latest: latest.slice(),
        hourly: hourly.map((h) => ({ ...h })),
        deliveriesToday: today,
      };
    },
    async loadAds() {
      return DEMO_ADS;
    },
  };
}
