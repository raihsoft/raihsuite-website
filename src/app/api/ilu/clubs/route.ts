import { NextResponse } from 'next/server';
import { SEED_CLUBS } from '@/lib/iluService';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: SEED_CLUBS,
    });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve club list' },
      { status: 500 }
    );
  }
}
