import { NextResponse } from 'next/server';
import { SEED_CLUBS, SEED_ORDERS, Order, ClubSummary } from '@/lib/iluService';

// Global in-memory storage for orders so additions persist during app lifecycle
declare global {
  // eslint-disable-next-line no-var
  var _iluOrders: Order[] | undefined;
}

if (!globalThis._iluOrders) {
  globalThis._iluOrders = [...SEED_ORDERS];
}

function computeSummaries(orders: Order[]): {
  summaries: ClubSummary[];
  grandTotalLiters: number;
  totalClubsWithOrders: number;
} {
  const validOrders = orders.filter((o) => o.status === 'confirmed');

  const clubMap = new Map<string, ClubSummary>();

  for (const ord of validOrders) {
    const existing = clubMap.get(ord.clubId);
    if (existing) {
      existing.totalQuantityLiters = Number(
        (existing.totalQuantityLiters + ord.quantityLiters).toFixed(2)
      );
      existing.orderCount += 1;
      if (new Date(ord.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = ord.createdAt;
      }
    } else {
      clubMap.set(ord.clubId, {
        clubId: ord.clubId,
        clubName: ord.clubName,
        contactPerson: ord.contactPerson,
        mobileNumber: ord.mobileNumber,
        totalQuantityLiters: Number(ord.quantityLiters.toFixed(2)),
        orderCount: 1,
        lastOrderDate: ord.createdAt,
      });
    }
  }

  const summaries = Array.from(clubMap.values()).sort(
    (a, b) => b.totalQuantityLiters - a.totalQuantityLiters
  );

  const grandTotalLiters = Number(
    summaries.reduce((sum, s) => sum + s.totalQuantityLiters, 0).toFixed(2)
  );

  return {
    summaries,
    grandTotalLiters,
    totalClubsWithOrders: summaries.length,
  };
}

export async function GET() {
  try {
    const orders = globalThis._iluOrders || [];
    const { summaries, grandTotalLiters, totalClubsWithOrders } = computeSummaries(orders);

    return NextResponse.json({
      success: true,
      orders,
      summaries,
      grandTotalLiters,
      totalClubsWithOrders,
      totalOrderCount: orders.filter((o) => o.status === 'confirmed').length,
    });
  } catch (error) {
    console.error('Error in GET /api/ilu/orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve order status' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clubId, quantityLiters } = body;

    // Field validations
    if (!clubId || typeof clubId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Please select a valid club.' },
        { status: 400 }
      );
    }

    const numQuantity = parseFloat(quantityLiters);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid positive quantity in liters.' },
        { status: 400 }
      );
    }

    const club = SEED_CLUBS.find((c) => c.id === clubId);
    if (!club) {
      return NextResponse.json(
        { success: false, message: 'Selected club was not found.' },
        { status: 404 }
      );
    }

    // Generate unique order reference number
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderRef = `ILU-PAY-2026-${randomCode}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderRef,
      clubId: club.id,
      clubName: club.name,
      contactPerson: club.contactPerson,
      mobileNumber: club.mobileNumber,
      quantityLiters: Number(numQuantity.toFixed(2)),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    if (!globalThis._iluOrders) {
      globalThis._iluOrders = [];
    }

    globalThis._iluOrders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Payasam order submitted successfully!',
    });
  } catch (error) {
    console.error('Error in POST /api/ilu/orders:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while submitting your order.' },
      { status: 500 }
    );
  }
}
