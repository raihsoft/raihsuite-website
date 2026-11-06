/**
 * TV display engine: rotates the live screens with transitions, keeps the numbers live,
 * shows delivery toasts / milestone celebrations, rotates ads and plays the Raihsoft video ad.
 * It drives the static markup from markup.ts inside `root`.
 */
import type { TvAd, TvClub, TvSnapshot, TvSource } from './tvData';
import {
  HOUSE_ADS,
  RAIHSOFT_CONTACT_AD,
  RAIHSOFT_SERVICES_AD,
  RAIHSOFT_SOLUTIONS_AD,
  TOWNSHOP_AD,
} from './tvData';

export interface TvEngineOptions {
  source: TvSource;
  screenMs?: number;
  adEvery?: number;
  /** Total length of one Raihsoft ad break in ms; the two pages share it in their natural proportion. */
  adMs?: number;
}

type D = Record<string, number>;
interface Screen {
  key: string;
  name: string;
  short: string;
  ads: 1 | 2;
  available?: () => boolean;
  html: () => string;
  enter?: (el: HTMLElement) => void;
  update?: (el: HTMLElement) => void;
  leave?: (el: HTMLElement) => void;
}

const TONES = ['red', 'pink', 'orange', 'amber', 'cream'];
const TRANS = ['slide', 'cube', 'wipe', 'zoom'];
const RS_DURS = [5200, 6200, 6400, 7200, 8600, 6200, 9000];
const ZONE_COUNT_MAX = 6;

const ICON = {
  box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  check: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
  truck: 'M1 4h14v12H1zM15 9h4l4 4v3h-8zM5.5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18.5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  pot: 'M3 10h18M5 10v3a7 7 0 0 0 14 0v-3M9 6c0-1 1-1.5 1-2.5M14 6c0-1 1-1.5 1-2.5',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
};

const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch] as string);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const hourLabel = (h: number, full: boolean) => {
  const hh = h % 12 || 12;
  return full ? `${hh} ${h >= 12 ? 'PM' : 'AM'}` : String(hh);
};
const timeStr = (t: number) => new Date(t).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
const svgIcon = (d: string, size: number, color: string, sw = 2) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const N = (key: string, dec?: number) => `<span data-num="${key}"${dec ? ` data-dec="${dec}"` : ''}>0</span>`;
const hashTone = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return TONES[Math.abs(h) % TONES.length];
};

export function startTvEngine(root: HTMLElement, opts: TvEngineOptions): () => void {
  const { source } = opts;
  const SCREEN_MS = opts.screenMs ?? 18000;
  // undefined = play the Raihsoft ad once after every full rotation of the live screens
  const ADS_EVERY = opts.adEvery;
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector(sel) as T;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const intervals = new Set<ReturnType<typeof setInterval>>();
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => { timers.delete(t); fn(); }, ms);
    timers.add(t);
    return t;
  };
  const every = (fn: () => void, ms: number) => {
    const t = setInterval(fn, ms);
    intervals.add(t);
    return t;
  };
  let disposed = false;

  /* ---------------- state ---------------- */
  let S: TvSnapshot = {
    fetchedAt: 0,
    totals: { ordered: 0, delivered: 0, approved: 0, pending: 0, stock: 0, orgL: 0, indL: 0, orderCount: 0 },
    clubs: [], latest: [], hourly: [], deliveriesToday: 0,
  };
  let D: D = {};
  let zones: { name: string; o: number; d: number }[] = [];
  const withOwnAds = (list: TvAd[]) => [
    RAIHSOFT_SOLUTIONS_AD,
    TOWNSHOP_AD,
    RAIHSOFT_SERVICES_AD,
    RAIHSOFT_CONTACT_AD,
    ...list,
  ];
  let ads: TvAd[] = withOwnAds(HOUSE_ADS);
  const events: { text: string; color: string }[] = [];
  let offline = false;

  function derive() {
    const t = S.totals;
    const ordered = Math.max(1, t.ordered);
    const remaining = Math.max(0, t.ordered - t.delivered);
    zones = [];
    const zm = new Map<string, { name: string; o: number; d: number }>();
    for (const c of S.clubs) {
      if (!c.zone) continue;
      const z = zm.get(c.zone) ?? { name: c.zone, o: 0, d: 0 };
      z.o += c.ordered; z.d += c.delivered; zm.set(c.zone, z);
    }
    zones = [...zm.values()].sort((a, b) => b.o - a.o).slice(0, ZONE_COUNT_MAX);
    const maxO = Math.max(1, ...zones.map((z) => z.o));
    const hourly = S.hourly.length ? S.hourly : [{ h: new Date().getHours(), v: 0 }];
    const maxV = Math.max(...hourly.map((h) => h.v), 1);
    const step = Math.max(100, Math.ceil((maxV * 1.12) / 4 / 100) * 100);
    const hTotal = hourly.reduce((s, h) => s + h.v, 0);
    D = {
      ordered: t.ordered, delivered: t.delivered, ready: t.approved, pending: t.pending, remaining,
      pct: (t.delivered / ordered) * 100,
      pctReady: (t.approved / ordered) * 100,
      pctPending: (t.pending / ordered) * 100,
      stock: t.stock,
      stockCover: clamp((t.stock / Math.max(1, remaining)) * 100, 0, 100),
      prepared: t.delivered + t.stock,
      clubs: S.clubs.length,
      orders: t.orderCount,
      orgL: t.orgL, indL: t.indL,
      orgPct: (t.orgL / ordered) * 100, indPct: (t.indL / ordered) * 100,
      deliveriesToday: S.deliveriesToday,
      full: 100,
      hStep: step, hMax: step * 4, hTotal, hAvg: hTotal / hourly.length, hNow: hourly[hourly.length - 1].v,
    };
    zones.forEach((z, i) => {
      D[`z${i}o`] = z.o; D[`z${i}d`] = z.d; D[`z${i}p`] = (z.d / Math.max(1, z.o)) * 100; D[`z${i}t`] = (z.o / maxO) * 100;
    });
    hourly.forEach((h, i) => { D[`h${i}`] = (h.v / D.hMax) * 100; D[`hv${i}`] = h.v; });
  }

  /* ---------------- bindings ---------------- */
  type NumEl = HTMLElement & { _v?: number; _raf?: number; _to?: ReturnType<typeof setTimeout> };
  function tween(el: NumEl, from: number, to: number, dec: number, dur: number, delay: number) {
    if (el._raf) cancelAnimationFrame(el._raf);
    if (el._to) clearTimeout(el._to);
    el._v = to;
    const run = () => {
      const t0 = performance.now();
      const stepFn = (now: number) => {
        const p = clamp((now - t0) / dur, 0, 1);
        const e = 1 - Math.pow(1 - p, 3);
        const v = from + (to - from) * e;
        el.textContent = dec ? v.toFixed(dec) : fmt(v);
        if (p < 1 && !disposed) el._raf = requestAnimationFrame(stepFn);
      };
      el._raf = requestAnimationFrame(stepFn);
    };
    if (delay) { el.textContent = dec ? from.toFixed(dec) : fmt(from); el._to = setTimeout(run, delay); } else run();
  }
  const dOf = (el: Element) => parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
  function bind(scope: Element, entering: boolean) {
    scope.querySelectorAll<NumEl>('[data-num]').forEach((el) => {
      const to = D[el.dataset.num as string];
      if (to == null || Number.isNaN(to)) return;
      const dec = Number(el.dataset.dec) || 0;
      if (entering) tween(el, 0, to, dec, 1700, 450 + dOf(el) * 100);
      else if (el._v !== to) tween(el, el._v == null ? to : el._v, to, dec, 900, 0);
    });
    const apply = (el: Element, fn: () => void) => (entering ? later(fn, 450 + dOf(el) * 100) : fn());
    scope.querySelectorAll<HTMLElement>('[data-w]').forEach((el) => apply(el, () => { el.style.width = `${clamp(D[el.dataset.w as string] ?? 0, 0, 100)}%`; }));
    scope.querySelectorAll<HTMLElement>('[data-h]').forEach((el) => apply(el, () => { el.style.height = `${clamp(D[el.dataset.h as string] ?? 0, 0, 100)}%`; }));
    scope.querySelectorAll<SVGElement>('[data-ring]').forEach((el) => apply(el, () => {
      const c = Number(el.dataset.circ);
      const v = clamp(D[el.dataset.ring as string] ?? 0, 0, 100) / 100;
      el.setAttribute('stroke-dasharray', `${Math.max(0, c * v - (el.dataset.gap ? 4 : 0)).toFixed(1)} ${c}`);
      if (el.dataset.offkey) el.setAttribute('stroke-dashoffset', (-(c * clamp(D[el.dataset.offkey] ?? 0, 0, 100)) / 100).toFixed(1));
    }));
  }

  /* ---------------- ads ---------------- */
  function adHTML(ad: TvAd, tall: boolean, d: number) {
    if (ad.kind === 'townshop') return townshopAdHTML(tall, d);
    if (ad.kind === 'raihsoft-solutions') return raihsoftSolutionsAdHTML(tall, d);
    if (ad.kind === 'raihsoft-services') return raihsoftServicesAdHTML(tall, d);
    if (ad.kind === 'raihsoft-contact') return raihsoftContactAdHTML(tall, d);
    if (ad.image) {
      return `<div class="ad ad-img${tall ? ' tall' : ''}" style="--d:${d}"><img src="${esc(ad.image)}" alt="${esc(ad.title || 'Sponsor advertisement')}"><span class="ad-tag">AD</span></div>`;
    }
    return `<div class="ad ad-text tone-${hashTone(ad.id)}${tall ? ' tall' : ''}" style="--d:${d}"><div class="shine"></div><div class="rd"></div><div class="dd"></div>
      <span class="chip">${ad.house ? 'FROM ILU' : 'SPONSORED'}</span><h3>${esc(ad.title)}</h3>${ad.body ? `<p>${esc(ad.body)}</p>` : ''}<div class="sp"></div>
      ${ad.contact ? `<div class="contact">${svgIcon(ICON.phone, 24, 'currentColor')}${esc(ad.contact)}</div>` : ''}</div>`;
  }
  /** Animated card for our own product, townshop.in (pin + shopfront logo, Outfit wordmark). */
  function townshopAdHTML(tall: boolean, d: number) {
    const pin = (w: number) => `<svg class="ts-pin" width="${w}" height="${w}" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 114 C46 98 18 70 18 46 A42 42 0 0 1 102 46 C102 70 74 98 60 114 Z" fill="#fff"/><rect x="38" y="36" width="44" height="30" rx="3" fill="#2247C6"/><rect x="54" y="48" width="12" height="18" rx="2" fill="#fff"/><path class="ts-awn" d="M34 26 H86 V36 a6.5 6.5 0 0 1 -13 0 a6.5 6.5 0 0 1 -13 0 a6.5 6.5 0 0 1 -13 0 a6.5 6.5 0 0 1 -13 0 Z" fill="#FFB22E"/></svg>`;
    const chat = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.6A8.4 8.4 0 1 1 21 11.5z"/></svg>';
    const phone = tall
      ? `<div class="ts-phone" aria-hidden="true"><div class="ts-ph-top">${pin(26)}<b>Pandikkad</b></div>
          ${['Fresh vegetables', 'Bakery &amp; sweets', 'Mobile accessories'].map((n, i) => `<div class="ts-shop" style="--i:${i}"><i></i><div><b>${n}</b><span>Open now · near you</span></div></div>`).join('')}
          <div class="ts-wa">${chat}Order on WhatsApp</div></div>`
      : '';
    return `<div class="ad ad-ts${tall ? ' tall' : ''}" style="--d:${d}" aria-label="townshop.in: local shops near you">
      <div class="ts-map" aria-hidden="true"><i class="rd1"></i><i class="rd2"></i><i class="rd3"></i><i class="ring"></i></div><div class="shine" aria-hidden="true"></div>
      <span class="ts-chip">FROM RAIHSOFT</span>
      <div class="ts-brand"><span class="ts-pinwrap">${pin(tall ? 112 : 84)}<i class="ts-pulse"></i></span>
        <div class="ts-word"><b>town<em>shop</em>.in</b><small>Local shops, near you</small></div></div>
      <div class="ts-lines"><span>Discover local shops</span><span>Browse their products</span><span>Order on WhatsApp</span></div>
      ${phone}
      <div class="ts-live"><span class="ts-now"><i></i>Live now · Pandikkad</span></div>
      <div class="ts-soon"><small>Soon</small><span style="--i:0">Wandoor</span><span style="--i:1">Manjeri</span><span style="--i:2">Malappuram</span></div>
      <div class="sp"></div>
      <div class="ts-foot"><span class="ts-cta">${chat}Order on WhatsApp</span><b>townshop.in</b></div>
    </div>`;
  }
  /** Second townshop.in design for tall slots: aimed at shop owners, three looping scenes (15 s). */
  function townshopShopsHTML(d: number) {
    const pin = (w: number, body = '#2247C6', inner = '#fff') => `<svg width="${w}" height="${w}" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 114 C46 98 18 70 18 46 A42 42 0 0 1 102 46 C102 70 74 98 60 114 Z" fill="${body}"/><rect x="38" y="36" width="44" height="30" rx="3" fill="${inner}"/><rect x="54" y="48" width="12" height="18" rx="2" fill="${body}"/><path d="M34 26 H86 V36 a6.5 6.5 0 0 1 -13 0 a6.5 6.5 0 0 1 -13 0 a6.5 6.5 0 0 1 -13 0 a6.5 6.5 0 0 1 -13 0 Z" fill="#FFB22E"/></svg>`;
    const chat = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.6A8.4 8.4 0 1 1 21 11.5z"/></svg>';
    const scallops = Array.from({ length: 6 }, (_, i) => `<path d="M${40 + i * 40} 96 a20 20 0 0 0 40 0 Z" fill="${i % 2 ? '#FFFFFF' : '#FFB22E'}"/>`).join('');
    const shopfront = `<svg class="tsb-front" width="300" height="250" viewBox="0 0 320 260" aria-hidden="true">
      <g class="tsb-body"><rect x="44" y="96" width="232" height="150" rx="10" fill="#fff" stroke="#2247C6" stroke-width="5"/>
        <rect x="70" y="128" width="72" height="56" rx="6" fill="#DCE4FB"/><rect x="178" y="128" width="72" height="118" rx="6" fill="#2247C6"/>
        <circle cx="236" cy="190" r="5" fill="#FFB22E"/><rect x="30" y="242" width="260" height="10" rx="5" fill="#0E1B4D" opacity=".15"/></g>
      <g class="tsb-awn"><rect x="40" y="56" width="240" height="40" rx="6" fill="#FFB22E"/>${scallops}</g>
      <g class="tsb-sign"><line x1="92" y1="196" x2="106" y2="214" stroke="#0E1B4D" stroke-width="3"/><line x1="120" y1="196" x2="106" y2="214" stroke="#0E1B4D" stroke-width="3"/>
        <rect x="74" y="212" width="64" height="26" rx="6" fill="#0f9f6e"/><text x="106" y="230" text-anchor="middle" font-family="Outfit,sans-serif" font-size="15" font-weight="800" fill="#fff">OPEN</text></g>
    </svg>`;
    const tiles = [['Mobiles', '#2247C6'], ['Fashion', '#FF7A45'], ['Groceries', '#0f9f6e'], ['Gifts', '#FFB22E']]
      .map(([n, c], i) => `<div class="tsb-tile" style="--k:${i}"><i style="background:${c}"></i><b>${n}</b><span>In stock nearby</span></div>`).join('');
    return `<div class="ad ad-tsb tall" style="--d:${d}" aria-label="townshop.in: list your shop for free">
      <div class="tsb-dots" aria-hidden="true"></div>
      <span class="tsb-chip">FOR SHOP OWNERS</span>
      <div class="tsb-brand">${pin(64)}<b>town<em>shop</em><small>.in</small></b></div>
      <div class="tsb-stage">
        <section class="tsb-sc" style="--s:0">
          <h3 class="tsb-h"><span>Have a shop</span><span>in town?</span></h3>
          ${shopfront}
          <p class="tsb-p">List it on <b>townshop.in</b> for free.</p>
        </section>
        <section class="tsb-sc" style="--s:1">
          <h3 class="tsb-h"><span>Customers nearby</span><span>find your products</span></h3>
          <span class="tsb-near">${pin(26, '#0E1B4D')}Pandikkad · within 1 km</span>
          <div class="tsb-tiles">${tiles}</div>
        </section>
        <section class="tsb-sc" style="--s:2">
          <h3 class="tsb-h"><span>Orders come</span><span>on WhatsApp</span></h3>
          <div class="tsb-chat">
            <div class="tsb-b in" style="--k:0">Hi! Is this available today?</div>
            <div class="tsb-b out" style="--k:1">Yes, it's in stock. Come pick it up!</div>
            <div class="tsb-b in" style="--k:2">Great, ordering now</div>
            <div class="tsb-note" style="--k:3">${chat}New order on WhatsApp</div>
          </div>
        </section>
      </div>
      <div class="tsb-prog" aria-hidden="true"><i style="--s:0"></i><i style="--s:1"></i><i style="--s:2"></i></div>
      <div class="tsb-foot">
        <div><small>List your shop free</small><b>townshop.in</b></div>
        <span class="tsb-cta">${chat}Enquire on WhatsApp</span>
      </div>
    </div>`;
  }

  /** Raihsoft Ad 1: Enterprise Solutions (The Console & Architecture Hub) */
  function raihsoftSolutionsAdHTML(tall: boolean, d: number) {
    const wa = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.94-.4-4.22-1.16l-.3-.18-3.13.82.84-3.05-.2-.31a8.16 8.16 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.2-8.14 8.24z"/></svg>';

    const content = tall
      ? `<div class="rs1-banner-wrap"><img src="/ilu/tv/raihsoft-ad-banner.jpg" alt="Enterprise Solutions Illustration" class="rs1-banner-img"></div>
         <div class="rs1-metrics">
           <div class="rs1-metric-card"><h4><i class="rs-dot-live"></i>15+ Years Architecture</h4><p>Custom software precision-engineered to solve complex enterprise business challenges.</p></div>
           <div class="rs1-metric-card"><h4><i class="rs-dot-live"></i>Cloud-Ready &amp; High Scale</h4><p>Multi-tenant, AWS hybrid migrations and containerized high-performance backends.</p></div>
           <div class="rs1-metric-card"><h4><i class="rs-dot-live"></i>Integrated ERP &amp; Data</h4><p>Connect your web portals and operations directly to backend ERP workflows.</p></div>
         </div>`
      : `<div class="rs1-console">
           <div class="rs1-con-bar">
             <i style="background:#ff5f56"></i>
             <i style="background:#ffbd2e"></i>
             <i style="background:#27c93f"></i>
             <span>core-pipeline.ts</span>
           </div>
           <div class="rs1-flow">
             <div class="rs1-node"><span>App / Web</span></div>
             <div class="rs1-wire"></div>
             <div class="rs1-node" style="border-color:#5ee0e6;color:#5ee0e6"><span>Cloud / ERP</span></div>
           </div>
           <div class="rs1-tags">
             <div class="rs1-tag">Multi-Tenant</div>
             <div class="rs1-tag">Modern Backend</div>
             <div class="rs1-tag">API Systems</div>
           </div>
         </div>`;

    return `<div class="ad ad-rs ad-rs1${tall ? ' tall' : ''}" style="--d:${d}" aria-label="Raihsoft: Enterprise-Grade Digital Solutions">
      <div class="rs-cyber-grid" aria-hidden="true"></div><div class="rs-cyber-glow" aria-hidden="true"></div>
      <div class="rs-ad-top">
        <img class="rs-ad-logo" src="https://media.raihsuite.com/RS0001/web/ilu/Raihsoft%20logo.png" alt="Raihsoft">
        <span class="rs-ad-chip">ENTERPRISE</span>
      </div>
      <span class="rs-eyebrow"><i class="rs-dot-live"></i>Engineering Digital Success</span>
      <h3 class="rs-title">We Build <span class="rs-grad-blue">Enterprise-Grade</span> Digital Solutions</h3>
      <p class="rs-subtitle">From strategic vision to flawless execution, architecting resilient technology that powers business growth.</p>
      ${content}
      <div class="sp"></div>
      <div class="rs-ad-foot">
        <span class="rs-cta-wa">${wa}Talk to Engineers</span>
        <b>raihsoft.com</b>
      </div>
    </div>`;
  }

  /** Raihsoft Ad 2: 5 Core Capabilities (The Modular Service Grid) */
  function raihsoftServicesAdHTML(tall: boolean, d: number) {
    const wa = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.94-.4-4.22-1.16l-.3-.18-3.13.82.84-3.05-.2-.31a8.16 8.16 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.2-8.14 8.24z"/></svg>';
    const icCode = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>';
    const icCloud = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>';
    const icAi = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';
    const icUi = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>';
    const icShield = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';

    const content = tall
      ? `<div class="rs2-tall-deck">
           <div class="rs2-deck-item"><h4><span class="rs2-ic">${icCode}</span>Custom Enterprise Software</h4><p>Bespoke systems, multi-tenant &amp; cloud-ready apps, integrated web ecosystems, and APIs.</p></div>
           <div class="rs2-deck-item"><h4><span class="rs2-ic">${icCloud}</span>Cloud Architecture &amp; DevOps</h4><p>AWS &amp; hybrid migrations, serverless infra, DevOps automation, Docker &amp; Kubernetes.</p></div>
           <div class="rs2-deck-item"><h4><span class="rs2-ic">${icAi}</span>Data Analytics &amp; AI Engineering</h4><p>BI &amp; real-time analytics, predictive machine learning models, and process automation.</p></div>
           <div class="rs2-deck-item"><h4><span class="rs2-ic">${icUi}</span>UI/UX Engineering &amp; Design Systems</h4><p>User research, journey mapping, wireframing, and scalable digital product design systems.</p></div>
           <div class="rs2-deck-item"><h4><span class="rs2-ic">${icShield}</span>Strategic IT Consulting</h4><p>Technology stack audits, technical debt assessment, and enterprise solution planning.</p></div>
         </div>`
      : `<div class="rs2-grid">
           <div class="rs2-cell">
             <div class="rs2-cell-top"><span class="rs2-ic">${icCode}</span><span class="rs-dot-live"></span></div>
             <b>Custom Software</b>
             <small>Multi-Tenant &amp; ERP</small>
           </div>
           <div class="rs2-cell">
             <div class="rs2-cell-top"><span class="rs2-ic">${icCloud}</span><span class="rs-dot-live"></span></div>
             <b>Cloud &amp; DevOps</b>
             <small>AWS, Docker &amp; CI/CD</small>
           </div>
           <div class="rs2-cell">
             <div class="rs2-cell-top"><span class="rs2-ic">${icAi}</span><span class="rs-dot-live"></span></div>
             <b>Data &amp; AI Eng</b>
             <small>BI &amp; Machine Learning</small>
           </div>
           <div class="rs2-cell">
             <div class="rs2-cell-top"><span class="rs2-ic">${icUi}</span><span class="rs-dot-live"></span></div>
             <b>UI/UX &amp; Consulting</b>
             <small>Design systems &amp; audits</small>
           </div>
         </div>`;

    return `<div class="ad ad-rs ad-rs2${tall ? ' tall' : ''}" style="--d:${d}" aria-label="Raihsoft: Engineering Capabilities">
      <div class="rs-cyber-grid" aria-hidden="true"></div><div class="rs-cyber-glow" aria-hidden="true"></div>
      <div class="rs-ad-top">
        <img class="rs-ad-logo" src="https://media.raihsuite.com/RS0001/web/ilu/Raihsoft%20logo.png" alt="Raihsoft">
        <span class="rs-ad-chip">5 CORE SERVICES</span>
      </div>
      <span class="rs-eyebrow"><i class="rs-dot-live"></i>Full-Stack Capabilities</span>
      <h3 class="rs-title">Enterprise <span class="rs-grad-blue">Engineering</span> Expertise</h3>
      <p class="rs-subtitle">Specialized technology solutions designed for scalability, security, and continuous delivery.</p>
      ${content}
      <div class="sp"></div>
      <div class="rs-ad-foot">
        <span class="rs-cta-wa">${wa}Discuss Your Project</span>
        <b>raihsoft.com</b>
      </div>
    </div>`;
  }

  /** Raihsoft Ad 3: Direct Hotline & Location (The Cyber Contact Portal) */
  function raihsoftContactAdHTML(tall: boolean, d: number) {
    const wa = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.49 0-2.94-.4-4.22-1.16l-.3-.18-3.13.82.84-3.05-.2-.31a8.16 8.16 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.2-8.14 8.24z"/></svg>';
    const phone = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';
    const mail = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6"/></svg>';
    const pin = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>';

    const extra = tall
      ? `<div class="rs3-hq-card">
           <h4><span class="rs3-ch-ic pin" style="width:26px;height:26px">${pin}</span>Kerala Engineering Headquarters</h4>
           <p>Al Irshad Plaza, 1st Floor, Karaya, Pandikkad, Malappuram, Kerala, India - 676521</p>
           <span class="rs3-hq-badge"><i class="rs-dot-live"></i>Serving Kerala, Middle East &amp; Global Enterprises</span>
         </div>`
      : '';

    return `<div class="ad ad-rs ad-rs3${tall ? ' tall' : ''}" style="--d:${d}" aria-label="Contact Raihsoft Technologies">
      <div class="rs-cyber-grid" aria-hidden="true"></div><div class="rs-cyber-glow" aria-hidden="true"></div>
      <div class="rs-ad-top">
        <img class="rs-ad-logo" src="https://media.raihsuite.com/RS0001/web/ilu/Raihsoft%20logo.png" alt="Raihsoft">
        <span class="rs-ad-chip">DIRECT CONTACT</span>
      </div>
      <span class="rs-eyebrow"><i class="rs-dot-live"></i>Direct Architect Line</span>
      <h3 class="rs-title">Ready to Build <span class="rs-grad-blue">What's Next?</span></h3>
      <p class="rs-subtitle">Direct access to technical leadership for enterprise software and digital transformation.</p>
      <div class="rs3-channels">
        <div class="rs3-channel"><span class="rs3-ch-ic wa">${wa}</span><div><small>WhatsApp Direct</small><b>+91 9847991099</b></div><span class="rs3-badge-fast">Fast Reply</span></div>
        <div class="rs3-channel"><span class="rs3-ch-ic">${phone}</span><div><small>Direct Phone Call</small><b>+91 9847991099</b></div></div>
        <div class="rs3-channel"><span class="rs3-ch-ic">${mail}</span><div><small>Email Inquiries</small><b>contact@raihsoft.com</b></div></div>
        <div class="rs3-channel"><span class="rs3-ch-ic pin">${pin}</span><div><small>Engineering HQ</small><b>Karaya, Pandikkad, Malappuram</b></div></div>
      </div>
      ${extra}
      <div class="sp"></div>
      <div class="rs-ad-foot">
        <span class="rs-cta-wa">${wa}Message on WhatsApp</span>
        <b>raihsoft.com</b>
      </div>
    </div>`;
  }

  let tallTurn = 0;
  // Alternate between the 3 creative Raihsoft tall designs and Townshop
  const tallAd = () => {
    const turn = tallTurn++ % 4;
    if (turn === 0) return raihsoftSolutionsAdHTML(true, 0);
    if (turn === 1) return townshopShopsHTML(0);
    if (turn === 2) return raihsoftServicesAdHTML(true, 0);
    return raihsoftContactAdHTML(true, 0);
  };

  const raihsoftAds: TvAd[] = [
    RAIHSOFT_SOLUTIONS_AD,
    RAIHSOFT_SERVICES_AD,
    RAIHSOFT_CONTACT_AD,
  ];

  function getNonRaihsoftAds(): TvAd[] {
    const list = ads.filter(
      (a) => !a.kind?.startsWith('raihsoft') && !a.id.startsWith('raihsoft')
    );
    if (list.length > 0) return list;
    return [TOWNSHOP_AD, ...HOUSE_ADS];
  }

  let rsTurn = 0;
  let nonRsTurn = 0;
  let flipTwoSlot = 0;

  function getTwoSlotAds(): [TvAd, TvAd] {
    const rs = raihsoftAds[rsTurn++ % raihsoftAds.length];
    const others = getNonRaihsoftAds();
    const other = others[nonRsTurn++ % others.length];
    // Alternate Raihsoft between top slot and bottom slot for fresh dynamic visual layout
    const isRsTop = (flipTwoSlot++ % 2 === 0);
    return isRsTop ? [rs, other] : [other, rs];
  }

  const asideHTML = (slots: 1 | 2) => {
    if (slots === 1) {
      return `<aside class="aside">${tallAd()}</aside>`;
    }
    const [top, btm] = getTwoSlotAds();
    return `<aside class="aside">${adHTML(top, false, 0)}${adHTML(btm, false, 1)}</aside>`;
  };

  /* ---------------- screens ---------------- */
  const sortedClubs = () => S.clubs.slice().sort((a, b) => b.ordered - a.ordered);
  function statusOf(c: TvClub): [string, string, string, string] {
    if (c.delivered >= c.ordered) return ['Delivered', 'rgba(52,211,153,.16)', '#6ee7b7', '#34d399'];
    if (c.delivered > 0) return ['Part delivered', 'rgba(250,167,12,.16)', '#fcd34d', '#faa70c'];
    if (c.approved > 0) return ['Approved', 'rgba(243,99,31,.18)', '#ffa477', '#f3631f'];
    return ['Pending', 'rgba(230,3,136,.18)', '#ff8cc8', '#e60388'];
  }

  const SCREENS: Screen[] = [
    {
      key: 'hero', name: 'Live Delivery Progress', short: 'Delivered %', ads: 2,
      html: () => `
  <div class="main panel" style="align-items:center;gap:56px;padding:0 56px">
    <div class="fu" style="position:relative;width:600px;height:600px;flex-shrink:0">
      <svg width="600" height="600" viewBox="0 0 600 600" aria-hidden="true">
        <defs><linearGradient id="heroRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ea183c"/><stop offset=".45" stop-color="#f3631f"/><stop offset="1" stop-color="#faa70c"/></linearGradient></defs>
        <g style="transform-origin:300px 300px;animation:tv-spin 60s linear infinite"><circle cx="300" cy="300" r="292" fill="none" stroke="rgba(250,167,12,.35)" stroke-width="2" stroke-dasharray="2 12"/></g>
        <circle cx="300" cy="300" r="250" fill="none" stroke="rgba(255,253,247,.07)" stroke-width="48"/>
        <circle class="tr" data-ring="pct" data-circ="1570.8" cx="300" cy="300" r="250" fill="none" stroke="url(#heroRing)" stroke-width="48" stroke-linecap="round" stroke-dasharray="0 1570.8" transform="rotate(-90 300 300)"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">
        <span style="font-size:22px;font-weight:800;letter-spacing:6px;color:var(--muted)">DELIVERED</span>
        <span class="num gradtext" style="font-size:150px;font-weight:800;line-height:1;letter-spacing:-4px">${N('pct', 1)}%</span>
        <span style="font-size:24px;font-weight:700">${N('delivered')} <span class="muted" style="font-weight:600">of ${N('ordered')} L</span></span>
      </div>
    </div>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:28px">
      <div class="fu" style="--d:1;display:flex;flex-direction:column;gap:4px">
        <span class="eyebrow">Palada delivered so far</span>
        <span class="num" style="font-size:112px;font-weight:800;line-height:1;letter-spacing:-3px">${N('delivered')}<span class="muted" style="font-size:48px;margin-left:12px;letter-spacing:0">litres</span></span>
      </div>
      <div class="stat-grid3">
        <div class="card2 fu" style="--d:2;padding:22px 24px;display:flex;flex-direction:column;gap:8px"><span class="muted" style="font-size:16px;font-weight:700">Total ordered</span><span class="num" style="font-size:44px;font-weight:700;line-height:1">${N('ordered')} <span class="muted" style="font-size:22px">L</span></span></div>
        <div class="card2 fu" style="--d:3;padding:22px 24px;display:flex;flex-direction:column;gap:8px"><span class="muted" style="font-size:16px;font-weight:700">Still to deliver</span><span class="num" style="font-size:44px;font-weight:700;line-height:1">${N('remaining')} <span class="muted" style="font-size:22px">L</span></span></div>
        <div class="card2 fu" style="--d:4;padding:22px 24px;display:flex;flex-direction:column;gap:8px;border:1px solid rgba(250,167,12,.4)"><span style="font-size:16px;font-weight:700;color:var(--amber)">Current stock</span><span class="num" style="font-size:44px;font-weight:700;line-height:1">${N('stock')} <span class="muted" style="font-size:22px">L</span></span></div>
      </div>
      <div class="fu" style="--d:5;display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;height:28px;border-radius:999px;overflow:hidden;background:rgba(255,253,247,.07)">
          <div class="tw" data-w="pct" style="--d:5;width:0;background:var(--ok)"></div>
          <div class="tw" data-w="pctReady" style="--d:6;width:0;background:var(--amber)"></div>
          <div class="tw" data-w="pctPending" style="--d:7;width:0;background:var(--pink)"></div>
        </div>
        <div class="legend"><span><i style="background:var(--ok)"></i>Delivered ${N('delivered')} L</span><span><i style="background:var(--amber)"></i>Ready ${N('ready')} L</span><span><i style="background:var(--pink)"></i>Pending ${N('pending')} L</span></div>
      </div>
      <div class="fu muted" style="--d:6;font-size:20px;font-weight:600">Orders from <b style="color:var(--fg)">${N('clubs')} clubs</b> and <b style="color:var(--fg)">${N('indL')} L</b> from individuals</div>
    </div>
  </div>`,
    },
    {
      key: 'glance', name: 'At a Glance', short: 'At a glance', ads: 2,
      html: () => {
        const T: [string, string, string, string, string, string, string, string][] = [
          ['Total ordered', 'ordered', 'L', D.orders ? `${fmt(D.orders)} club orders` : 'All orders together', 'full', '#f3631f', 'rgba(243,99,31,.16)', ICON.box],
          ['Delivered', 'delivered', 'L', `${D.pct.toFixed(1)}% of all orders`, 'pct', '#34d399', 'rgba(52,211,153,.14)', ICON.check],
          ['Ready to deliver', 'ready', 'L', 'Approved, on the way', 'pctReady', '#faa70c', 'rgba(250,167,12,.15)', ICON.truck],
          ['Pending approval', 'pending', 'L', 'Waiting for confirmation', 'pctPending', '#ff7ab8', 'rgba(230,3,136,.18)', ICON.clock],
          ['Current stock', 'stock', 'L', 'Ready in the kitchen', 'stockCover', '#ffcf5a', 'rgba(255,207,90,.14)', ICON.pot],
          ['Clubs taking part', 'clubs', '', `plus ${fmt(D.indL)} L from individuals`, 'orgPct', '#ff5a72', 'rgba(234,24,60,.18)', ICON.users],
        ];
        return `<div class="main" style="flex-direction:column;gap:24px">
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:24px;flex:1;min-height:0">
      ${T.map((t, i) => `<div class="tile pop" style="--d:${i}">
        <div style="display:flex;align-items:center;gap:14px"><span class="ic" style="background:${t[6]}">${svgIcon(t[7], 30, t[5])}</span><span style="font-size:20px;font-weight:700;color:#e9dcdf">${t[0]}</span></div>
        <div style="flex:1"></div>
        <span class="num" style="font-size:84px;font-weight:800;line-height:1;letter-spacing:-2px">${N(t[1])}<span class="muted" style="font-size:32px;margin-left:10px;letter-spacing:0">${t[2]}</span></span>
        <span class="muted" style="font-size:18px;font-weight:600">${t[3]}</span>
        <div class="bar-track" style="margin-top:6px"><div class="tw" data-w="${t[4]}" style="--d:${i + 4};background:${t[5]}"></div></div>
      </div>`).join('')}
      </div>
      <div class="panel fu" style="--d:7;border-radius:28px;padding:24px 30px;display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="eyebrow">Who ordered</span><span class="muted" style="font-size:18px;font-weight:600">${N('ordered')} L in total</span></div>
        <div style="display:flex;height:40px;border-radius:12px;overflow:hidden;gap:4px">
          <div class="tw" data-w="orgPct" style="--d:8;width:0;background:var(--orange);display:flex;align-items:center;padding:0 16px;font-weight:800;font-size:18px;white-space:nowrap;overflow:hidden">Clubs &amp; organisations · ${N('orgL')} L</div>
          <div class="tw" data-w="indPct" style="--d:9;width:0;background:var(--pink);display:flex;align-items:center;padding:0 16px;font-weight:800;font-size:18px;white-space:nowrap;overflow:hidden">Individuals · ${N('indL')} L</div>
        </div>
      </div>
    </div>`;
      },
    },
    {
      key: 'stock', name: 'Current Stock', short: 'Current stock', ads: 1,
      html: () => `
  <div class="main panel" style="align-items:center;gap:40px;padding:0 48px">
    <div class="fu" style="width:640px;height:600px;flex-shrink:0">
      <svg width="640" height="600" viewBox="0 0 640 600" role="img" aria-label="Palada uruli showing current stock level">
        <defs>
          <clipPath id="bowlClip"><path d="M48 170 C 58 425, 185 512, 320 512 C 455 512, 582 425, 592 170 Z"/></clipPath>
          <linearGradient id="paladaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe7c0"/><stop offset="1" stop-color="#e2b46a"/></linearGradient>
          <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a3f14"/><stop offset=".5" stop-color="#d4924a"/><stop offset="1" stop-color="#7a3f14"/></linearGradient>
        </defs>
        <ellipse cx="320" cy="548" rx="170" ry="16" fill="rgba(0,0,0,.45)"/>
        <path class="steam" d="M250 120 c -14 -20 14 -36 0 -58 c -10 -16 6 -30 0 -44" fill="none" stroke="rgba(255,253,247,.45)" stroke-width="6" stroke-linecap="round"/>
        <path class="steam" style="animation-delay:1.2s" d="M320 110 c -14 -20 14 -36 0 -58 c -10 -16 6 -30 0 -44" fill="none" stroke="rgba(255,253,247,.45)" stroke-width="6" stroke-linecap="round"/>
        <path class="steam" style="animation-delay:2.4s" d="M390 120 c -14 -20 14 -36 0 -58 c -10 -16 6 -30 0 -44" fill="none" stroke="rgba(255,253,247,.45)" stroke-width="6" stroke-linecap="round"/>
        <circle cx="34" cy="196" r="26" fill="none" stroke="#a8662a" stroke-width="10"/>
        <circle cx="606" cy="196" r="26" fill="none" stroke="#a8662a" stroke-width="10"/>
        <path d="M40 170 C 50 432, 182 522, 320 522 C 458 522, 590 432, 600 170 Z" fill="url(#bronze)"/>
        <g clip-path="url(#bowlClip)">
          <rect x="0" y="150" width="640" height="400" fill="#2a120c"/>
          <g data-liquid style="transform:translateY(340px);transition:transform 2.4s cubic-bezier(.2,.8,.2,1)">
            <path class="waveB" d="M0 196 q 40 -14 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 V 700 H 0 Z" fill="#d9a55a" opacity=".7"/>
            <path class="waveA" d="M0 190 q 40 -18 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 V 700 H 0 Z" fill="url(#paladaFill)"/>
            <circle class="bubble" cx="230" cy="300" r="7" fill="#fff8ea"/>
            <circle class="bubble" style="animation-delay:.9s" cx="400" cy="320" r="5" fill="#fff8ea"/>
            <circle class="bubble" style="animation-delay:1.8s" cx="330" cy="340" r="6" fill="#fff8ea"/>
          </g>
        </g>
        <ellipse cx="320" cy="170" rx="282" ry="30" fill="none" stroke="#e3a35a" stroke-width="14"/>
      </svg>
    </div>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:26px">
      <div class="fu" style="--d:1;display:flex;flex-direction:column;gap:6px">
        <span class="eyebrow">Ready in the kitchen</span>
        <span class="num" style="font-size:130px;font-weight:800;line-height:1;letter-spacing:-3px">${N('stock')}<span class="muted" style="font-size:48px;margin-left:12px;letter-spacing:0">L</span></span>
        <span class="muted" style="font-size:22px;font-weight:600">palada in stock right now</span>
      </div>
      <div class="card2 fu" style="--d:2;padding:24px 28px;display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;justify-content:space-between;font-size:19px;font-weight:700"><span>Stock vs. still to deliver</span><span style="color:var(--amber)">covers ${N('stockCover')}%</span></div>
        <div style="height:22px;border-radius:999px;background:rgba(255,253,247,.08);overflow:hidden"><div class="tw" data-w="stockCover" style="--d:3;height:22px;width:0;border-radius:999px;background:linear-gradient(90deg,var(--orange),var(--amber))"></div></div>
        <div class="muted" style="display:flex;justify-content:space-between;font-size:17px;font-weight:600"><span>${N('stock')} L in stock</span><span>${N('remaining')} L still to deliver</span></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">
        <div class="card2 fu" style="--d:3;padding:22px 26px;display:flex;flex-direction:column;gap:6px"><span class="muted" style="font-size:16px;font-weight:700">Prepared so far</span><span class="num" style="font-size:44px;font-weight:700;line-height:1">${N('prepared')} <span class="muted" style="font-size:22px">L</span></span></div>
        <div class="card2 fu" style="--d:4;padding:22px 26px;display:flex;flex-direction:column;gap:6px"><span class="muted" style="font-size:16px;font-weight:700">Deliveries today</span><span class="num" style="font-size:44px;font-weight:700;line-height:1">${N('deliveriesToday')}</span></div>
      </div>
    </div>
  </div>`,
      enter: (el) => later(() => updateLiquid(el), 500),
      update: (el) => updateLiquid(el),
    },
    {
      key: 'clubs', name: 'Club Orders & Delivery', short: 'Clubs', ads: 2,
      available: () => S.clubs.length > 0,
      html: () => `
  <div class="main panel" style="flex-direction:column;gap:10px;padding:28px 32px">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0 8px 8px">
      <div style="display:flex;align-items:baseline;gap:16px"><span class="h2">All clubs</span><span class="muted" style="font-size:19px;font-weight:600">${fmt(S.clubs.length)} clubs · sorted by litres ordered</span></div>
      <div class="muted" style="display:flex;align-items:center;gap:12px;font-size:18px;font-weight:700">Page <span data-pg style="color:var(--fg)">1</span> of ${Math.max(1, Math.ceil(S.clubs.length / 9))}<div data-pgdots style="display:flex;gap:6px;margin-left:6px"></div></div>
    </div>
    <div class="row" style="font-size:15px;font-weight:800;letter-spacing:2px;color:var(--muted2);text-transform:uppercase"><span>#</span><span>Club</span><span style="text-align:right">Ordered</span><span style="text-align:right">Delivered</span><span>Progress</span><span>Status</span></div>
    <div data-rows style="display:flex;flex-direction:column;gap:10px;perspective:1600px"></div>
  </div>`,
      enter: (el) => {
        pageOf.set(el, 0);
        renderClubPage(el, 'enter');
        const pages = () => Math.max(1, Math.ceil(S.clubs.length / 9));
        pagers.set(el, every(() => { pageOf.set(el, ((pageOf.get(el) ?? 0) + 1) % pages()); renderClubPage(el, 'flip'); }, 6000));
      },
      update: (el) => renderClubPage(el, 'quiet'),
      leave: (el) => { const t = pagers.get(el); if (t) { clearInterval(t); intervals.delete(t); } },
    },
    {
      key: 'latest', name: 'Just Delivered', short: 'Just delivered', ads: 2,
      available: () => S.latest.length > 0,
      html: () => `
  <div class="main panel" style="flex-direction:column;gap:10px;padding:26px 32px;position:relative">
    <div style="display:flex;align-items:baseline;justify-content:space-between;padding-bottom:6px">
      <div style="display:flex;align-items:baseline;gap:16px"><span class="h2">Latest ${Math.min(10, S.latest.length)} deliveries</span><span class="muted" style="font-size:19px;font-weight:600">newest on top</span></div>
      <span class="muted" style="font-size:19px;font-weight:600">Today: <b style="color:var(--ok-fg)">${N('deliveriesToday')} deliveries</b></span>
    </div>
    <div style="position:absolute;left:194px;top:96px;bottom:40px;width:3px;border-radius:3px;background:linear-gradient(180deg,#34d399,rgba(52,211,153,.05));transform-origin:top;animation:tv-rise 1.2s ease-out both"></div>
    <div data-latest style="display:flex;flex-direction:column;gap:10px"></div>
  </div>`,
      enter: (el) => renderLatest(el, 'all'),
      update: (el) => renderLatest(el, 'first'),
    },
    {
      key: 'hourly', name: 'Deliveries by Hour', short: 'By hour', ads: 1,
      available: () => S.hourly.some((h) => h.v > 0),
      html: () => `
  <div class="main" style="flex-direction:column;gap:20px">
    <div class="panel" style="flex:1;min-height:0;padding:26px 32px 20px;display:flex;flex-direction:column;gap:18px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span class="h2">Litres delivered each hour</span>
        <div class="legend" style="font-weight:700"><span><i style="background:var(--orange)"></i>Per hour</span><span><i style="width:28px;height:4px;border-radius:2px;background:var(--fg)"></i>Running total</span><span><i style="background:repeating-linear-gradient(135deg,#faa70c 0 4px,rgba(250,167,12,.35) 4px 8px)"></i>This hour (so far)</span></div>
      </div>
      <div data-chart style="flex:1;min-height:0;display:flex;gap:14px"></div>
    </div>
    <div class="stat-grid3" style="gap:20px">
      <div class="panel fu" style="--d:9;border-radius:24px;padding:22px 26px;display:flex;flex-direction:column;gap:6px;border-color:rgba(250,167,12,.4)"><span class="eyebrow" style="font-size:16px;letter-spacing:2px">Peak hour</span><span class="num" data-peakh style="font-size:40px;font-weight:800;line-height:1.1"></span><span class="muted" style="font-size:18px;font-weight:600"><span data-peakv></span> L delivered</span></div>
      <div class="panel fu" style="--d:10;border-radius:24px;padding:22px 26px;display:flex;flex-direction:column;gap:6px"><span class="muted" style="font-size:16px;font-weight:800;letter-spacing:2px;text-transform:uppercase">Average</span><span class="num" style="font-size:40px;font-weight:800;line-height:1.1">${N('hAvg')} L <span class="muted" style="font-size:22px">/ hour</span></span><span class="muted" style="font-size:18px;font-weight:600">over the last ${S.hourly.length} hours</span></div>
      <div class="panel fu" style="--d:11;border-radius:24px;padding:22px 26px;display:flex;flex-direction:column;gap:6px"><span class="muted" style="font-size:16px;font-weight:800;letter-spacing:2px;text-transform:uppercase">This hour</span><span class="num" style="font-size:40px;font-weight:800;line-height:1.1">${N('hNow')} L</span><span class="muted" style="font-size:18px;font-weight:600">${hourLabel(S.hourly[S.hourly.length - 1]?.h ?? new Date().getHours(), true)} – now, still counting</span></div>
    </div>
  </div>`,
      enter: (el) => renderChart(el, true),
      update: (el) => renderChart(el, false),
    },
    {
      key: 'zones', name: 'Zone-wise Progress', short: 'Zones', ads: 2,
      available: () => zones.length >= 2,
      html: () => {
        const lead = zones.slice().sort((a, b) => b.d / Math.max(1, b.o) - a.d / Math.max(1, a.o))[0];
        return `<div class="main" style="gap:24px">
    <div class="panel" style="flex:1;min-width:0;padding:28px 34px;display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:baseline;justify-content:space-between"><span class="h2">Delivery by zone</span><span class="muted" style="font-size:18px;font-weight:600">bar length = litres ordered (clubs)</span></div>
      ${zones.map((z, i) => {
        const p = D[`z${i}p`];
        const fill = p >= 75 ? 'linear-gradient(90deg,#0f9f6e,#34d399)' : p >= 55 ? 'linear-gradient(90deg,#f3631f,#faa70c)' : 'linear-gradient(90deg,#ea183c,#e60388)';
        const pc = p >= 75 ? '#6ee7b7' : p >= 55 ? '#ffcf5a' : '#ff8da1';
        return `<div class="fu" style="--d:${i + 1};flex:1;display:flex;align-items:center;gap:24px">
          <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px"><span class="ellip" style="font-size:26px;font-weight:800">${esc(z.name)}</span><span class="muted" style="font-size:19px;font-weight:600;white-space:nowrap"><b style="color:var(--fg)">${N(`z${i}d`)}</b> of ${N(`z${i}o`)} L</span></div>
            <div style="height:26px;border-radius:999px;background:rgba(255,253,247,.06)"><div class="tw" data-w="z${i}t" style="--d:${i + 1};height:26px;width:0;border-radius:999px;background:rgba(243,99,31,.22);overflow:hidden"><div class="tw" data-w="z${i}p" style="--d:${i + 4};height:26px;width:0;border-radius:999px;background:${fill}"></div></div></div>
          </div>
          <span class="num" style="width:120px;text-align:right;font-size:48px;font-weight:800;color:${pc}">${N(`z${i}p`)}%</span>
        </div>`;
      }).join('')}
    </div>
    <div style="width:400px;flex-shrink:0;display:flex;flex-direction:column;gap:24px">
      <div class="panel fu" style="--d:2;padding:28px;display:flex;flex-direction:column;align-items:center;gap:18px;flex:1">
        <span class="eyebrow" style="align-self:flex-start;font-size:16px;letter-spacing:2px">Who ordered</span>
        <div style="position:relative;width:320px;height:320px">
          <svg width="320" height="320" viewBox="0 0 320 320" role="img" aria-label="Share of litres ordered by clubs and individuals">
            <circle cx="160" cy="160" r="130" fill="none" stroke="rgba(255,253,247,.07)" stroke-width="44"/>
            <circle class="tr" data-ring="orgPct" data-circ="816.8" data-gap="1" style="--d:3" cx="160" cy="160" r="130" fill="none" stroke="#f3631f" stroke-width="44" stroke-dasharray="0 816.8" transform="rotate(-90 160 160)"/>
            <circle class="tr" data-ring="indPct" data-circ="816.8" data-gap="1" data-offkey="orgPct" style="--d:12" cx="160" cy="160" r="130" fill="none" stroke="#e60388" stroke-width="44" stroke-dasharray="0 816.8" transform="rotate(-90 160 160)"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><span class="num" style="font-size:52px;font-weight:800;line-height:1">${N('ordered')}</span><span class="muted" style="font-size:18px;font-weight:700">litres ordered</span></div>
        </div>
        <div style="align-self:stretch;display:flex;flex-direction:column;gap:10px;font-size:19px;font-weight:700">
          <div style="display:flex;justify-content:space-between"><span class="legend" style="font-size:19px"><span><i style="background:var(--orange)"></i>Clubs</span></span><span>${N('orgL')} L · ${N('orgPct')}%</span></div>
          <div style="display:flex;justify-content:space-between"><span class="legend" style="font-size:19px"><span><i style="background:var(--pink)"></i>Individuals</span></span><span>${N('indL')} L · ${N('indPct')}%</span></div>
        </div>
      </div>
      <div class="fu" style="--d:4;border-radius:28px;padding:24px 28px;background:linear-gradient(135deg,#34d399,#0f9f6e);color:#062b1e;display:flex;align-items:center;gap:18px">
        ${svgIcon(ICON.trophy, 44, '#062b1e')}
        <div style="display:flex;flex-direction:column;min-width:0"><span style="font-size:15px;font-weight:800;letter-spacing:2px;text-transform:uppercase">Leading zone</span><span class="num ellip" style="font-size:32px;font-weight:800;line-height:1.1">${esc(lead.name)} · ${Math.round((lead.d / Math.max(1, lead.o)) * 100)}%</span></div>
      </div>
    </div>
  </div>`;
      },
    },
    {
      key: 'podium', name: 'Top Clubs', short: 'Top clubs', ads: 2,
      available: () => S.clubs.length >= 3,
      html: () => {
        const top = sortedClubs();
        const ini = (n: string) => n.replace(/&/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
        type Cfg = { w: number; av: number; c: string; a: number; r: number; h: number; bg: string; fs: number; fc: string };
        const col = (c: TvClub, rank: number, cfg: Cfg) => `<div style="width:${cfg.w}px;display:flex;flex-direction:column;align-items:center;gap:12px">
        ${rank === 1 ? `<svg class="pop" style="--d:${cfg.a}" width="56" height="40" viewBox="0 0 56 40" aria-hidden="true"><path d="M4 36 L8 8 L20 22 L28 4 L36 22 L48 8 L52 36 Z" fill="#faa70c" stroke="#fffdf7" stroke-width="2" stroke-linejoin="round"/></svg>` : ''}
        <span class="pop" style="--d:${cfg.a};width:${cfg.av}px;height:${cfg.av}px;border-radius:50%;background:#2a1a1f;border:${rank === 1 ? 6 : 5}px solid ${cfg.c};display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:${rank === 1 ? 40 : 34}px;font-weight:800;color:${cfg.c};${rank === 1 ? 'box-shadow:0 0 0 10px rgba(250,167,12,.15)' : ''}">${esc(ini(c.name))}</span>
        <span class="fu" style="--d:${cfg.a};font-size:${rank === 1 ? 26 : 24}px;font-weight:800;text-align:center;line-height:1.2">${esc(c.name)}</span>
        <span class="fu num" style="--d:${cfg.a};font-size:${rank === 1 ? 34 : 30}px;font-weight:800;color:${cfg.c}">${fmt(c.ordered)} L</span>
        <div class="rise" style="--d:${cfg.r};width:100%;height:${cfg.h}px;border-radius:22px 22px 0 0;background:${cfg.bg};display:flex;justify-content:center;padding-top:18px"><span class="num" style="font-size:${cfg.fs}px;font-weight:800;color:${cfg.fc};line-height:1">${rank}</span></div>
      </div>`;
        const colors = ['#ea183c', '#e60388', '#f3631f', '#faa70c', '#fffdf7', '#34d399'];
        let cf = '';
        for (let i = 0; i < 18; i++) cf += `<span class="cf" style="left:${(i * 37) % 100}%;width:${8 + (i % 3) * 4}px;background:${colors[i % 6]};animation-delay:${(-(i * 0.37) % 6).toFixed(2)}s;animation-duration:6s;opacity:.85"></span>`;
        return `<div class="main panel" style="position:relative;overflow:hidden;flex-direction:column;gap:24px;padding:28px 36px">
      ${cf}
      <div style="display:flex;align-items:baseline;justify-content:space-between;position:relative"><span class="h2">Most litres ordered</span><span class="muted" style="font-size:19px;font-weight:600">Thank you for leading the way</span></div>
      <div style="flex:1;display:flex;align-items:flex-end;justify-content:center;gap:28px;position:relative">
        ${col(top[1], 2, { w: 320, av: 96, c: '#e8dcd0', a: 10, r: 4, h: 230, bg: 'linear-gradient(180deg,#e8dcd0,#a8969b)', fs: 96, fc: '#3a2a2f' })}
        ${col(top[0], 1, { w: 340, av: 112, c: '#faa70c', a: 14, r: 8, h: 300, bg: 'linear-gradient(180deg,#faa70c,#f3631f 60%,#ea183c)', fs: 120, fc: '#fffdf7' })}
        ${col(top[2], 3, { w: 320, av: 96, c: '#f0a070', a: 7, r: 0, h: 170, bg: 'linear-gradient(180deg,#d9773a,#8a3a12)', fs: 84, fc: '#fffdf7' })}
      </div>
      ${top.length > 3 ? `<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;position:relative">
        ${top.slice(3, 8).map((c, i) => `<div class="card2 fu" style="--d:${17 + i};border-radius:18px;padding:16px 18px;display:flex;align-items:center;gap:14px"><span class="num" style="font-size:30px;font-weight:800;color:var(--amber)">${i + 4}</span><div style="display:flex;flex-direction:column;min-width:0"><span class="ellip" style="font-size:18px;font-weight:800">${esc(c.name)}</span><span class="muted" style="font-size:16px;font-weight:700">${fmt(c.ordered)} L</span></div></div>`).join('')}
      </div>` : ''}
    </div>`;
      },
    },
  ];

  const pageOf = new WeakMap<HTMLElement, number>();
  const pagers = new WeakMap<HTMLElement, ReturnType<typeof setInterval>>();

  function updateLiquid(el: HTMLElement) {
    const g = el.querySelector<SVGGElement>('[data-liquid]');
    if (!g) return;
    const f = clamp(D.stockCover / 100, 0.06, 1);
    g.style.transform = `translateY(${((1 - f) * 320 + 10).toFixed(0)}px)`;
  }

  function renderClubPage(el: HTMLElement, mode: 'enter' | 'flip' | 'quiet') {
    const box = el.querySelector<HTMLElement>('[data-rows]');
    if (!box) return;
    const sorted = sortedClubs();
    const pages = Math.max(1, Math.ceil(sorted.length / 9));
    const p = Math.min(pageOf.get(el) ?? 0, pages - 1);
    (el.querySelector('[data-pg]') as HTMLElement).textContent = String(p + 1);
    (el.querySelector('[data-pgdots]') as HTMLElement).innerHTML = Array.from({ length: Math.min(pages, 12) }, (_, i) => `<span style="width:${i === p ? 28 : 8}px;height:8px;border-radius:999px;background:${i === p ? '#faa70c' : 'rgba(255,253,247,.25)'};transition:width .4s"></span>`).join('');
    const quiet = mode === 'quiet';
    box.innerHTML = sorted.slice(p * 9, p * 9 + 9).map((c, i) => {
      const s = statusOf(c);
      const pc = Math.round((c.delivered / Math.max(1, c.ordered)) * 100);
      const cls = quiet ? '' : mode === 'flip' ? 'page-flip' : 'si';
      const delay = mode === 'flip' ? i * 0.06 : i * 0.08 + 0.35;
      return `<div class="row ${cls}" style="animation-delay:${delay}s;height:66px;border-radius:18px;background:${i % 2 ? 'transparent' : 'rgba(255,253,247,.035)'}">
      <span class="num" style="font-size:30px;font-weight:800;color:var(--amber)">${p * 9 + i + 1}</span>
      <div style="display:flex;flex-direction:column;min-width:0"><span class="ellip" style="font-size:23px;font-weight:800">${esc(c.name)}</span><span class="muted ellip" style="font-size:16px;font-weight:600">${esc([c.place, c.zone].filter(Boolean).join(' · '))}</span></div>
      <span class="num" style="font-size:28px;font-weight:700;text-align:right">${fmt(c.ordered)} <span class="muted" style="font-size:16px">L</span></span>
      <span class="num" style="font-size:28px;font-weight:700;text-align:right;color:var(--ok-fg)">${fmt(c.delivered)} <span class="muted" style="font-size:16px">L</span></span>
      <div style="display:flex;align-items:center;gap:12px"><div style="flex:1;height:12px;border-radius:999px;background:rgba(255,253,247,.08);overflow:hidden"><div class="tw cb" data-p="${pc}" style="height:12px;border-radius:999px;width:${quiet ? pc : 0}%;background:${s[3]}"></div></div><span style="font-size:17px;font-weight:800;width:48px;text-align:right">${pc}%</span></div>
      <span class="badge" style="background:${s[1]};color:${s[2]}"><i></i>${s[0]}</span>
    </div>`;
    }).join('');
    if (!quiet) later(() => box.querySelectorAll<HTMLElement>('.cb').forEach((b) => { b.style.width = `${b.dataset.p}%`; }), mode === 'flip' ? 300 : 800);
  }

  function renderLatest(el: HTMLElement, mode: 'all' | 'first') {
    const box = el.querySelector<HTMLElement>('[data-latest]');
    if (!box) return;
    box.innerHTML = S.latest.slice(0, 10).map((r, i) => {
      const first = i === 0;
      const anim = mode === 'all' ? `di" style="--d:${i};` : first ? 'di" style="--d:-5;' : '" style="';
      return `<div class="${anim}display:flex;align-items:center;gap:20px;height:62px">
      <span class="num" style="width:130px;flex-shrink:0;text-align:right;font-size:24px;font-weight:700;color:${first ? '#6ee7b7' : 'var(--muted)'}">${timeStr(r.time)}</span>
      <span class="${first ? 'glow' : ''}" style="width:24px;height:24px;flex-shrink:0;border-radius:50%;background:${first ? '#34d399' : 'rgba(52,211,153,.55)'};border:4px solid var(--panel)"></span>
      <div style="flex:1;min-width:0;height:62px;display:flex;align-items:center;gap:18px;padding:0 22px;border-radius:16px;background:${first ? 'rgba(52,211,153,.12)' : 'rgba(255,253,247,.035)'};border:1px solid ${first ? 'rgba(52,211,153,.5)' : 'transparent'}">
        <span class="ellip" style="font-size:23px;font-weight:800">${esc(r.clubName)}</span>
        <span class="muted" style="font-size:17px;font-weight:600;white-space:nowrap">${esc(r.place)}</span>
        ${first && Date.now() - r.time < 15 * 60000 ? '<span style="font-size:13px;font-weight:800;letter-spacing:2px;padding:5px 10px;border-radius:999px;background:#34d399;color:#062b1e;white-space:nowrap">JUST NOW</span>' : ''}
        <span style="flex:1"></span>
        <span class="num" style="font-size:30px;font-weight:800">${fmt(r.qty)} <span class="muted" style="font-size:17px">L</span></span>
        ${svgIcon(ICON.check, 30, '#34d399', 2.4)}
      </div></div>`;
    }).join('');
  }

  function renderChart(el: HTMLElement, entering: boolean) {
    const box = el.querySelector<HTMLElement>('[data-chart]');
    if (!box) return;
    const hourly = S.hourly;
    const n = hourly.length;
    if (!n) return;
    const peakI = hourly.reduce((m, h, i) => (h.v > hourly[m].v ? i : m), 0);
    const cumMax = Math.max(1000, Math.ceil((D.hTotal * 1.1) / 1000) * 1000);
    let cum = 0;
    const pts = hourly.map((h, i) => { cum += h.v; return `${(((i + 0.5) / n) * 1000).toFixed(1)},${(1000 - (cum / cumMax) * 1000).toFixed(1)}`; }).join(' ');
    const ph = hourly[peakI];
    const setPeak = () => {
      (el.querySelector('[data-peakh]') as HTMLElement).textContent = `${hourLabel(ph.h, true)} – ${hourLabel((ph.h + 1) % 24, true)}`;
      (el.querySelector('[data-peakv]') as HTMLElement).textContent = fmt(ph.v);
    };
    if (!entering && box.firstChild) {
      hourly.forEach((h, i) => {
        const b = box.querySelector<HTMLElement>(`[data-hb="${i}"]`);
        const l = box.querySelector<HTMLElement>(`[data-hl="${i}"]`);
        if (b) b.style.height = `${D[`h${i}`]}%`;
        if (l) l.textContent = fmt(h.v);
      });
      const pl = box.querySelector('polyline');
      if (pl) { pl.classList.remove('draw'); pl.setAttribute('points', pts); }
      (box.querySelector('[data-htot]') as HTMLElement).textContent = `Total ${fmt(D.hTotal)} L`;
      box.querySelectorAll<HTMLElement>('.yl').forEach((y, i) => { y.textContent = fmt(D.hStep * (4 - i)); });
      setPeak();
      return;
    }
    const lbl = (h: number, i: number) => hourLabel(h, i === 0 || i === n - 1 || h === 12);
    box.innerHTML = `
    <div style="width:64px;display:flex;flex-direction:column;justify-content:space-between;text-align:right;font-size:15px;font-weight:700;color:var(--muted2);padding-bottom:34px;margin-top:-9px">${[4, 3, 2, 1, 0].map((k) => `<span class="yl">${fmt(D.hStep * k)}</span>`).join('')}</div>
    <div style="flex:1;min-width:0;display:flex;flex-direction:column">
      <div style="flex:1;position:relative;border-bottom:2px solid rgba(255,253,247,.18)">
        ${[0, 25, 50, 75].map((t) => `<div style="position:absolute;left:0;right:0;top:${t}%;border-top:1px dashed rgba(255,253,247,.08)"></div>`).join('')}
        <div style="position:absolute;inset:0;display:flex;align-items:flex-end">
          ${hourly.map((h, i) => {
            const last = i === n - 1;
            const pk = i === peakI;
            const fill = last ? 'repeating-linear-gradient(135deg,#faa70c 0 8px,rgba(250,167,12,.35) 8px 16px)' : pk ? 'linear-gradient(180deg,#faa70c,#f3631f)' : 'linear-gradient(180deg,#f3631f,#ea183c)';
            return `<div style="flex:1 1 0;height:100%;padding:0 10px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:8px">
              <span data-hl="${i}" class="num fu" style="--d:${i * 0.5 + 2};font-size:20px;font-weight:700;color:${pk ? '#faa70c' : 'var(--fg)'}">${fmt(h.v)}</span>
              <div data-hb="${i}" class="rise th" style="--d:${i};width:100%;height:${D[`h${i}`]}%;border-radius:10px 10px 0 0;background:${fill}"></div></div>`;
          }).join('')}
        </div>
        <svg style="position:absolute;inset:0;width:100%;height:100%;overflow:visible" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><polyline class="draw" points="${pts}" fill="none" stroke="#fffdf7" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
        <div data-htot class="fu" style="--d:14;position:absolute;right:0;top:4px;padding:8px 14px;border-radius:12px;background:var(--fg);color:#14070b;font-size:18px;font-weight:800">Total ${fmt(D.hTotal)} L</div>
      </div>
      <div style="display:flex;height:34px;align-items:flex-end">${hourly.map((h, i) => `<span style="flex:1 1 0;text-align:center;font-size:16px;font-weight:700;color:var(--muted)">${lbl(h.h, i)}</span>`).join('')}</div>
    </div>`;
    setPeak();
  }

  /* ---------------- rotation + transitions ---------------- */
  const content = $('#content');
  const wipe = $('#wipe');
  let active: Screen[] = [];
  let idx = -1;
  let layer: HTMLElement | null = null;
  let current: Screen | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let paused = false;
  let tStart = 0;
  let tLeft = 0;
  let transCount = 0;

  const refreshActive = () => { active = SCREENS.filter((s) => !s.available || s.available()); };

  function setDots() {
    const dots = $('#tdots');
    dots.innerHTML = active.map((_, i) => `<i class="${i === idx ? 'on' : i < idx ? 'done' : ''}"></i>`).join('') + `<span id="nextLbl">Next · ${esc(active[(idx + 1) % active.length]?.short ?? '')}</span>`;
  }
  function restartProgress() {
    const bar = root.querySelector('#tprog div') as HTMLElement;
    bar.classList.remove('run');
    void bar.offsetWidth;
    bar.style.setProperty('--dur', `${SCREEN_MS}ms`);
    bar.classList.add('run');
  }
  function show(i: number) {
    derive();
    const prevKey = current?.key;
    refreshActive();
    if (!active.length) return;
    if (current?.leave && layer) current.leave(layer);
    const prev = layer;
    idx = ((i % active.length) + active.length) % active.length;
    if (active[idx].key === prevKey && active.length > 1 && prev) idx = (idx + 1) % active.length;
    const s = active[idx];
    current = s;
    const el = document.createElement('div');
    el.className = 'layer';
    el.innerHTML = s.html() + asideHTML(s.ads);
    content.appendChild(el);
    const nm = $('#screenName');
    nm.classList.add('swap');
    later(() => { nm.textContent = s.name; nm.classList.remove('swap'); }, 350);
    if (prev) {
      const t = TRANS[transCount++ % TRANS.length];
      prev.classList.add(`t-${t}-out`);
      el.classList.add(`t-${t}-in`);
      if (t === 'wipe') { wipe.classList.remove('go'); void wipe.offsetWidth; wipe.classList.add('go'); }
      later(() => { prev.remove(); el.className = 'layer'; }, 1400);
    }
    layer = el;
    bind(el, true);
    s.enter?.(el);
    setDots();
    schedule(SCREEN_MS);
    restartProgress();
  }
  const indexOfCurrent = () => Math.max(0, active.indexOf(current as Screen));
  function schedule(ms: number) {
    if (timer) clearTimeout(timer);
    tStart = Date.now();
    tLeft = ms;
    if (!paused && !adPlaying) timer = later(autoNext, ms);
  }
  function setPaused(p: boolean) {
    paused = p;
    $('#viewport').classList.toggle('paused', p);
    $('#bPause').setAttribute('aria-pressed', String(p));
    ($('#bPause').querySelector('span') as HTMLElement).textContent = p ? 'Play' : 'Pause';
    if (p) { if (timer) clearTimeout(timer); tLeft = Math.max(0, tLeft - (Date.now() - tStart)); } else schedule(tLeft || SCREEN_MS);
  }

  /* ---------------- ticker ---------------- */
  let pendingTicker = false;
  function buildTicker() {
    const items = events.slice(-8).reverse();
    if (!items.length) items.push({ text: 'ILU Foundation Palada Challenge · live delivery updates', color: '#faa70c' });
    const html = items.map((e) => `<span><i style="background:${e.color}"></i>${esc(e.text)}</span>`).join('');
    const m = $('#marquee');
    m.innerHTML = html + html;
    requestAnimationFrame(() => m.style.setProperty('--mdur', `${Math.max(25, m.scrollWidth / 2 / 110)}s`));
    pendingTicker = false;
  }
  const onIteration = () => { if (pendingTicker) buildTicker(); };
  $('#marquee').addEventListener('animationiteration', onIteration);
  const pushEvent = (text: string, color: string) => { events.push({ text, color }); if (events.length > 40) events.shift(); pendingTicker = true; };

  /* ---------------- clock ---------------- */
  function tickClock() {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const p2 = (n: number) => String(n).padStart(2, '0');
    $('#clockT').textContent = `${p2(h)}:${p2(now.getMinutes())}:${p2(now.getSeconds())}`;
    $('#clockA').textContent = now.getHours() >= 12 ? 'PM' : 'AM';
    $('#clockD').textContent = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function updateTop(entering: boolean) {
    bind($('#topbar'), entering);
    $('#miniRing').setAttribute('stroke-dasharray', `${((150.8 * clamp(D.pct || 0, 0, 100)) / 100).toFixed(1)} 150.8`);
  }

  /* ---------------- toasts, milestones, offline ---------------- */
  let toastT: ReturnType<typeof setTimeout> | null = null;
  let msShowing = false;
  function showToast(name: string, place: string, qty: number) {
    if (msShowing || adPlaying) return;
    $('#toastName').textContent = name;
    $('#toastMeta').textContent = [place, timeStr(Date.now())].filter(Boolean).join(' · ');
    $('#toastQty').textContent = `${fmt(qty)} L`;
    const t = $('#toast');
    t.classList.add('show');
    if (toastT) clearTimeout(toastT);
    toastT = later(() => t.classList.remove('show'), 4500);
  }
  function showMilestone(p: number) {
    if (adPlaying) { pendingMs = p; return; }
    if (msShowing) return;
    msShowing = true;
    $('#toast').classList.remove('show');
    const colors = ['#ea183c', '#e60388', '#f3631f', '#faa70c', '#fffdf7', '#34d399'];
    let cf = '';
    for (let i = 0; i < 34; i++) cf += `<span class="cf" style="left:${(i * 29 + 7) % 100}%;width:${8 + (i % 3) * 5}px;background:${colors[i % 6]};animation-delay:${(-(i * 0.41) % 5).toFixed(2)}s"></span>`;
    const en = p >= 100 ? 'All palada delivered!' : p === 50 ? 'Half of all palada delivered!' : `${p}% of all palada delivered!`;
    const ml = p >= 100 ? 'നന്ദി! മുഴുവൻ പാലടയും വിതരണം ചെയ്തു' : p === 50 ? 'നന്ദി! പകുതി പാലട വിതരണം ചെയ്തു' : `നന്ദി! ${p}% പാലട വിതരണം ചെയ്തു`;
    const m = $('#milestone');
    m.innerHTML = `${cf}<div class="ms-box"><span class="burst"></span><span class="burst"></span><span class="burst"></span>
    <div class="ms-text"><span class="fu" style="font-size:22px;font-weight:800;letter-spacing:6px;color:var(--amber)">MILESTONE REACHED</span>
    <span class="ms-big">${p}%</span>
    <span class="fu" style="--d:2;font-family:var(--display);font-size:52px;font-weight:800">${en}</span>
    <span class="fu" lang="ml" style="--d:4;font-family:var(--ml);font-size:36px;font-weight:800;color:var(--gold)">${ml}</span>
    <span class="fu muted" style="--d:6;font-size:22px;font-weight:600;margin-top:6px">${fmt(D.delivered)} of ${fmt(D.ordered)} litres · thank you to every club and volunteer</span></div></div>`;
    m.classList.add('show');
    later(() => { m.classList.remove('show'); later(() => { m.innerHTML = ''; msShowing = false; }, 700); }, 7000);
  }
  function setOffline(off: boolean, since?: number) {
    offline = off;
    $('#bOffline').setAttribute('aria-pressed', String(off));
    ($('#offline') as HTMLElement).hidden = !off;
    $('#liveBadge').classList.toggle('off', off);
    $('#liveText').textContent = off ? 'OFFLINE' : 'LIVE';
    if (off) $('#offlineText').textContent = since ? `Offline · showing data from ${timeStr(since)}, reconnecting…` : 'Connecting to live data…';
  }

  /* ---------------- data ---------------- */
  let started = false;
  let forcedOffline = false;
  function applySnapshot(next: TvSnapshot) {
    const prev = S;
    const before = D.pct ?? 0;
    S = next;
    derive();
    if (!started) {
      started = true;
      S.latest.slice(0, 5).reverse().forEach((l) => pushEvent(`${l.clubName} — ${fmt(l.qty)} L delivered`, '#34d399'));
      pushEvent(`Stock in kitchen: ${fmt(S.totals.stock)} L ready`, '#e60388');
      pushEvent('Thank you to every volunteer cooking and carrying palada today', '#faa70c');
      buildTicker();
      updateTop(true);
      show(0);
      return;
    }
    // detect what changed since the previous poll
    const prevById = new Map(prev.clubs.map((c) => [c.id, c]));
    const newDeliveries: { c: TvClub; qty: number }[] = [];
    for (const c of S.clubs) {
      const p = prevById.get(c.id);
      if (!p) { pushEvent(`${c.name} joined with ${fmt(c.ordered)} L`, '#faa70c'); continue; }
      if (c.delivered > p.delivered) newDeliveries.push({ c, qty: c.delivered - p.delivered });
      if (c.approved > p.approved && c.delivered === p.delivered) pushEvent(`${c.name} approved — ${fmt(c.approved)} L ready to deliver`, '#f3631f');
      if (c.ordered > p.ordered) pushEvent(`${c.name} ordered ${fmt(c.ordered - p.ordered)} L more`, '#faa70c');
    }
    if (S.totals.stock > prev.totals.stock + 50) pushEvent(`Fresh batch ready: +${fmt(S.totals.stock - prev.totals.stock)} L added to stock`, '#e60388');
    newDeliveries.forEach((d) => pushEvent(`${d.c.name} — ${fmt(d.qty)} L delivered`, '#34d399'));
    updateTop(false);
    const shouldRebuild = current && current.available && !current.available();
    if (layer && current && !shouldRebuild) { bind(layer, false); current.update?.(layer); }
    if (newDeliveries.length) {
      const big = newDeliveries.sort((a, b) => b.qty - a.qty)[0];
      showToast(big.c.name, big.c.place, big.qty);
    }
    if (Math.floor(D.pct / 5) > Math.floor(before / 5) && D.pct > 0) later(() => showMilestone(Math.floor(D.pct / 5) * 5), 1200);
  }

  let polling = false;
  async function poll() {
    if (polling || disposed || forcedOffline) return;
    polling = true;
    try {
      const snap = await source.load();
      if (disposed) return;
      if (offline) setOffline(false);
      applySnapshot(snap);
    } catch (err) {
      console.error('[tv-display] data refresh failed', err);
      setOffline(true, S.fetchedAt || undefined);
    } finally {
      polling = false;
    }
  }
  async function pollAds() {
    try {
      const list = await source.loadAds();
      ads = withOwnAds(list.length ? list : HOUSE_ADS);
    } catch (err) {
      console.warn('[tv-display] ads unavailable, showing house ads', err);
      ads = withOwnAds(HOUSE_ADS);
    }
  }

  /* ---------------- Raihsoft video ad ---------------- */
  let adPlaying = false;
  let adT: ReturnType<typeof setTimeout> | null = null;
  let adTick: ReturnType<typeof setInterval> | null = null;
  let sinceAd = 0;
  let pendingMs: number | null = null;
  let adDone: (() => void) | null = null;
  // Each break plays one scene (rotating through them) and then the final call-to-action scene.
  let nextAdScene = 0;
  function playAd(done?: () => void) {
    if (adPlaying) return;
    adPlaying = true;
    adDone = done ?? null;
    if (timer) clearTimeout(timer);
    $('#toast').classList.remove('show');
    const ad = $('#rsAd');
    const scenes = [...ad.querySelectorAll<HTMLElement>('.rs-scene')];
    const last = scenes.length - 1;
    const order = last > 0 ? [nextAdScene % last, last] : [0];
    if (last > 0) nextAdScene = (nextAdScene + 1) % last;
    const natural = order.map((k) => RS_DURS[k]);
    const scale = opts.adMs ? opts.adMs / natural.reduce((a, b) => a + b, 0) : 1;
    const durs = natural.map((ms) => Math.round(ms * scale));
    const segs = $('#rsSegs');
    segs.innerHTML = order.map(() => '<i><b></b></i>').join('');
    ad.classList.add('show');
    ad.setAttribute('aria-hidden', 'false');
    $('#bAd').setAttribute('aria-pressed', 'true');
    const total = durs.reduce((a, b) => a + b, 0);
    const t0 = Date.now();
    const upd = () => { $('#rsCount').textContent = `${Math.max(0, Math.ceil((total - (Date.now() - t0)) / 1000))}s`; };
    upd();
    adTick = every(upd, 500);
    let j = -1;
    const step = () => {
      if (j >= 0) {
        const p = scenes[order[j]];
        p.classList.remove('on');
        p.classList.add('off');
        later(() => p.classList.remove('off'), 700);
        (segs.children[j] as HTMLElement).className = 'done';
      }
      j++;
      if (j >= order.length) { endAd(); return; }
      const i = order[j];
      const s = scenes[i];
      s.classList.add('on');
      ad.dataset.scene = String(i);
      const sw = $('#rsSweep');
      sw.classList.remove('go');
      void sw.offsetWidth;
      if (j > 0) sw.classList.add('go');
      const seg = segs.children[j] as HTMLElement;
      seg.style.setProperty('--dur', `${durs[j]}ms`);
      seg.className = 'run';
      if (i === 2) {
        $('#rsTvPct').textContent = `${Math.round(D.pct || 0)}%`;
        const r = $('#rsTvRing');
        r.setAttribute('stroke-dasharray', '0 477.5');
        later(() => r.setAttribute('stroke-dasharray', `${((477.5 * clamp(D.pct || 0, 0, 100)) / 100).toFixed(1)} 477.5`), 900);
      }
      if (i === 5) s.querySelectorAll<NumEl>('[data-count]').forEach((el) => tween(el, 0, Number(el.dataset.count), 0, 1600, 600));
      adT = later(step, durs[j]);
    };
    step();
  }
  function endAd() {
    if (!adPlaying) return;
    if (adT) clearTimeout(adT);
    if (adTick) clearInterval(adTick);
    const ad = $('#rsAd');
    ad.classList.remove('show');
    ad.setAttribute('aria-hidden', 'true');
    $('#bAd').setAttribute('aria-pressed', 'false');
    later(() => ad.querySelectorAll('.rs-scene').forEach((s) => s.classList.remove('on', 'off')), 900);
    adPlaying = false;
    sinceAd = 0;
    const done = adDone;
    adDone = null;
    done?.();
    if (pendingMs != null) { const p = pendingMs; pendingMs = null; later(() => showMilestone(p), 1600); }
  }
  function autoNext() {
    sinceAd++;
    const due = ADS_EVERY === undefined ? sinceAd >= active.length : ADS_EVERY > 0 && sinceAd >= ADS_EVERY;
    if (due) playAd(() => show(indexOfCurrent() + 1));
    else show(indexOfCurrent() + 1);
  }

  /* ---------------- stage scaling + controls ---------------- */
  const stage = $('#stage');
  const fit = () => { const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080); stage.style.transform = `translate(-50%,-50%) scale(${s})`; };
  window.addEventListener('resize', fit);
  let idleT: ReturnType<typeof setTimeout> | null = null;
  const wake = () => {
    $('#controls').classList.remove('idle');
    $('#viewport').classList.remove('hide-cursor');
    if (idleT) clearTimeout(idleT);
    idleT = later(() => { $('#controls').classList.add('idle'); $('#viewport').classList.add('hide-cursor'); }, 3500);
  };
  const wakeEvents = ['mousemove', 'touchstart', 'keydown'] as const;
  wakeEvents.forEach((e) => window.addEventListener(e, wake, { passive: true }));

  const demo = source.kind === 'demo';
  root.querySelectorAll<HTMLElement>('[data-demo-only]').forEach((b) => { b.hidden = !demo; });
  $('#bPrev').onclick = () => (adPlaying ? endAd() : show(indexOfCurrent() - 1));
  $('#bNext').onclick = () => (adPlaying ? endAd() : show(indexOfCurrent() + 1));
  $('#bPause').onclick = () => setPaused(!paused);
  $('#bAd').onclick = () => (adPlaying ? endAd() : playAd(() => show(indexOfCurrent() + 1)));
  $('#bDeliver').onclick = () => { void poll(); };
  $('#bMilestone').onclick = () => showMilestone(Math.max(5, Math.floor((D.pct || 0) / 5) * 5));
  $('#bOffline').onclick = () => { forcedOffline = !offline; setOffline(!offline, S.fetchedAt); };
  $('#bFull').onclick = () => {
    try {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen?.().catch(() => undefined);
    } catch { /* fullscreen not allowed */ }
  };
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t?.closest?.('button') && (e.key === ' ' || e.key === 'Enter')) return;
    if (e.key === 'ArrowRight') $('#bNext').click();
    else if (e.key === 'ArrowLeft') $('#bPrev').click();
    else if (e.key === ' ') { e.preventDefault(); setPaused(!paused); }
    else if (e.key === 'f' || e.key === 'F') $('#bFull').click();
    else if (e.key === 'a' || e.key === 'A') $('#bAd').click();
  };
  window.addEventListener('keydown', onKey);

  let wakeLock: { release: () => Promise<void> } | null = null;
  const requestWakeLock = () => {
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    nav.wakeLock?.request('screen').then((l) => { wakeLock = l; }).catch(() => undefined);
  };
  const onVisible = () => { if (document.visibilityState === 'visible') requestWakeLock(); };
  document.addEventListener('visibilitychange', onVisible);
  requestWakeLock();

  /* ---------------- boot ---------------- */
  fit();
  derive();
  // waiting screen until the first snapshot arrives (show() transitions it away)
  layer = document.createElement('div');
  layer.className = 'layer';
  layer.innerHTML = '<div class="main panel waiting"><div class="spin"></div><h2>Loading live Palada statistics…</h2><p>The display starts automatically as soon as the data arrives.</p></div>';
  content.appendChild(layer);
  buildTicker();
  tickClock();
  every(tickClock, 1000);
  setOffline(true);
  ($('#liveText') as HTMLElement).textContent = 'LOADING';
  void pollAds().then(() => poll());
  every(() => { void poll(); }, source.pollMs);
  every(() => { void pollAds(); }, 5 * 60 * 1000);
  // a long-running TV page: reload once a day at ~4 AM to keep memory fresh
  every(() => { const n = new Date(); if (n.getHours() === 4 && n.getMinutes() === 0) window.location.reload(); }, 60 * 1000);
  wake();

  return () => {
    disposed = true;
    timers.forEach((t) => clearTimeout(t));
    intervals.forEach((t) => clearInterval(t));
    window.removeEventListener('resize', fit);
    wakeEvents.forEach((e) => window.removeEventListener(e, wake));
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVisible);
    $('#marquee').removeEventListener('animationiteration', onIteration);
    void wakeLock?.release().catch(() => undefined);
  };
}
