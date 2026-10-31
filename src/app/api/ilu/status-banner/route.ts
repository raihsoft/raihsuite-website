import { NextResponse } from 'next/server';

export const runtime = 'edge';

const DEFAULT_BANNER_URL = 'https://media.raihsuite.com/RS0001/web/ilu/status-banner.webp';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url') || DEFAULT_BANNER_URL;

    const upstreamRes = await fetch(targetUrl, {
      cache: 'force-cache',
      next: { revalidate: 86400 }
    });

    if (!upstreamRes.ok) {
      return new NextResponse('Failed to fetch status banner upstream', {
        status: upstreamRes.status
      });
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (err) {
    console.error('[API status-banner] Error:', err);
    return new NextResponse('Internal server error loading banner', { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
