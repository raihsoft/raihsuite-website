export interface Club {
  id: string;
  name: string;
  contactPerson: string;
  mobileNumber: string;
  location: string;
  district: string;
}

export interface Order {
  id: string;
  orderRef: string;
  clubId: string;
  clubName: string;
  contactPerson: string;
  mobileNumber: string;
  quantityLiters: number;
  status: 'confirmed' | 'processing' | 'cancelled';
  createdAt: string;
}

export interface ClubSummary {
  clubId: string;
  clubName: string;
  contactPerson: string;
  mobileNumber: string;
  totalQuantityLiters: number;
  orderCount: number;
  lastOrderDate: string;
}

export interface OrderStatusResponse {
  success: boolean;
  orders: Order[];
  summaries: ClubSummary[];
  grandTotalLiters: number;
  totalClubsWithOrders: number;
  totalOrderCount: number;
}

// Seed clubs exact to design reference
export const SEED_CLUBS: Club[] = [
  {
    id: 'club-01',
    name: 'Al-Furqan Club',
    contactPerson: 'Muhammed Shafi',
    mobileNumber: '9633 12 34 56',
    location: 'Calicut',
    district: 'Kozhikode',
  },
  {
    id: 'club-02',
    name: 'Anwar Club',
    contactPerson: 'Rashid K',
    mobileNumber: '9447 11 22 33',
    location: 'Kochi',
    district: 'Ernakulam',
  },
  {
    id: 'club-03',
    name: 'Noor Club',
    contactPerson: 'Faseeh P',
    mobileNumber: '9895 66 77 88',
    location: 'Malappuram',
    district: 'Malappuram',
  },
  {
    id: 'club-04',
    name: 'Iqra Club',
    contactPerson: 'Salman M',
    mobileNumber: '9744 22 33 44',
    location: 'Trivandrum',
    district: 'Thiruvananthapuram',
  },
  {
    id: 'club-05',
    name: 'Seera Club',
    contactPerson: 'Junaid K',
    mobileNumber: '9567 88 99 00',
    location: 'Thrissur',
    district: 'Thrissur',
  },
  {
    id: 'club-06',
    name: 'Hikma Club',
    contactPerson: 'Adil P',
    mobileNumber: '9655 44 33 22',
    location: 'Kannur',
    district: 'Kannur',
  },
  {
    id: 'club-07',
    name: 'Thanzeem Club',
    contactPerson: 'Shafi K',
    mobileNumber: '9944 55 66 77',
    location: 'Palakkad',
    district: 'Palakkad',
  },
  {
    id: 'club-08',
    name: 'Youth Club',
    contactPerson: 'Nihal K',
    mobileNumber: '9745 77 88 99',
    location: 'Kollam',
    district: 'Kollam',
  },
  {
    id: 'club-09',
    name: 'Rising Club',
    contactPerson: 'Ramees P',
    mobileNumber: '9566 33 22 11',
    location: 'Alappuzha',
    district: 'Alappuzha',
  },
  {
    id: 'club-10',
    name: 'Vision Club',
    contactPerson: 'Fairooz K',
    mobileNumber: '9633 99 88 77',
    location: 'Kottayam',
    district: 'Kottayam',
  },
  {
    id: 'club-11',
    name: 'Unity Sports Club',
    contactPerson: 'Ashraf Ali',
    mobileNumber: '9847 22 44 66',
    location: 'Wayanad',
    district: 'Wayanad',
  },
  {
    id: 'club-12',
    name: 'Crescent Cultural Forum',
    contactPerson: 'Sujith Kumar',
    mobileNumber: '9446 88 11 22',
    location: 'Pathanamthitta',
    district: 'Pathanamthitta',
  },
];

// Seed orders corresponding to 385L across 12 clubs and 28 orders
export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderRef: 'ILU-PAY-2026-101',
    clubId: 'club-01',
    clubName: 'Al-Furqan Club',
    contactPerson: 'Muhammed Shafi',
    mobileNumber: '9633 12 34 56',
    quantityLiters: 125,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'ord-2',
    orderRef: 'ILU-PAY-2026-102',
    clubId: 'club-02',
    clubName: 'Anwar Club',
    contactPerson: 'Rashid K',
    mobileNumber: '9447 11 22 33',
    quantityLiters: 80,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'ord-3',
    orderRef: 'ILU-PAY-2026-103',
    clubId: 'club-03',
    clubName: 'Noor Club',
    contactPerson: 'Faseeh P',
    mobileNumber: '9895 66 77 88',
    quantityLiters: 60,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'ord-4',
    orderRef: 'ILU-PAY-2026-104',
    clubId: 'club-04',
    clubName: 'Iqra Club',
    contactPerson: 'Salman M',
    mobileNumber: '9744 22 33 44',
    quantityLiters: 40,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-5',
    orderRef: 'ILU-PAY-2026-105',
    clubId: 'club-05',
    clubName: 'Seera Club',
    contactPerson: 'Junaid K',
    mobileNumber: '9567 88 99 00',
    quantityLiters: 32,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-6',
    orderRef: 'ILU-PAY-2026-106',
    clubId: 'club-06',
    clubName: 'Hikma Club',
    contactPerson: 'Adil P',
    mobileNumber: '9655 44 33 22',
    quantityLiters: 20,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'ord-7',
    orderRef: 'ILU-PAY-2026-107',
    clubId: 'club-07',
    clubName: 'Thanzeem Club',
    contactPerson: 'Shafi K',
    mobileNumber: '9944 55 66 77',
    quantityLiters: 15,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'ord-8',
    orderRef: 'ILU-PAY-2026-108',
    clubId: 'club-08',
    clubName: 'Youth Club',
    contactPerson: 'Nihal K',
    mobileNumber: '9745 77 88 99',
    quantityLiters: 15,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'ord-9',
    orderRef: 'ILU-PAY-2026-109',
    clubId: 'club-09',
    clubName: 'Rising Club',
    contactPerson: 'Ramees P',
    mobileNumber: '9566 33 22 11',
    quantityLiters: 8,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'ord-10',
    orderRef: 'ILU-PAY-2026-110',
    clubId: 'club-10',
    clubName: 'Vision Club',
    contactPerson: 'Fairooz K',
    mobileNumber: '9633 99 88 77',
    quantityLiters: 5,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'ord-11',
    orderRef: 'ILU-PAY-2026-111',
    clubId: 'club-11',
    clubName: 'Unity Sports Club',
    contactPerson: 'Ashraf Ali',
    mobileNumber: '9847 22 44 66',
    quantityLiters: 3,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'ord-12',
    orderRef: 'ILU-PAY-2026-112',
    clubId: 'club-12',
    clubName: 'Crescent Cultural Forum',
    contactPerson: 'Sujith Kumar',
    mobileNumber: '9446 88 11 22',
    quantityLiters: 2,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

export async function fetchClubsApi(): Promise<Club[]> {
  try {
    const res = await fetch('/api/ilu/clubs', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch clubs');
    const json = await res.json();
    return json.data || SEED_CLUBS;
  } catch (err) {
    console.warn('Fallback to seed clubs:', err);
    return SEED_CLUBS;
  }
}

export async function submitOrderApi(clubId: string, quantityLiters: number): Promise<Order> {
  const res = await fetch('/api/ilu/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId, quantityLiters }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to submit order');
  }

  return data.order;
}

export async function fetchOrderStatusApi(): Promise<OrderStatusResponse> {
  const res = await fetch('/api/ilu/orders', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch order status');
  }
  return await res.json();
}
