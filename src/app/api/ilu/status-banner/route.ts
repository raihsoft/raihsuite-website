import { STATUS_BANNER_BASE64 } from '@/lib/iluStatusBannerData';

export const runtime = 'edge';

const DEFAULT_BANNER_URL = 'https://media.raihsuite.com/RS0001/web/ilu/status-banner.webp';

function getFallbackResponse(): Response {
  const base64Data = STATUS_BANNER_BASE64.split(',')[1] || STATUS_BANNER_BASE64;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Response(bytes.buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800, immutable',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url') || DEFAULT_BANNER_URL;

    const upstreamRes = await fetch(targetUrl, {
      cache: 'force-cache',
    });

    if (!upstreamRes.ok) {
      console.warn('[API status-banner] Upstream returned non-200, using fallback');
      return getFallbackResponse();
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (err) {
    console.error('[API status-banner] Error fetching upstream, serving fallback:', err);
    return getFallbackResponse();
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


