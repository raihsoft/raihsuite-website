'use client';

export interface StatusImageOptions {
  clubName: string;
  quantity: number | string;
  location?: string;
  rank?: number;
  imageUrl?: string;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.length > 0 ? lines : [text];
}

import { STATUS_BANNER_BASE64 } from './iluStatusBannerData';

export const STATUS_BANNER_IMAGE_URL = 'https://media.raihsuite.com/RS0001/web/ilu/status-banner.webp';

let cachedTemplateImg: HTMLImageElement | null = null;

function loadImageFromSource(src: string, isCrossOrigin = false): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (isCrossOrigin) {
      image.crossOrigin = 'anonymous';
    }
    image.onload = () => resolve(image);
    image.onerror = (e) => reject(e);
    image.src = src;
  });
}

/**
 * Loads the template image directly from the specified image link:
 * 1. If in-memory cache is available, returns it immediately.
 * 2. Fetches via server proxy (/api/ilu/status-banner) which injects CORS headers and caches at edge.
 * 3. Attempts direct fetch with CORS if available.
 * 4. Fallback: Loads the embedded STATUS_BANNER_BASE64 (identical to https://media.raihsuite.com/RS0001/web/ilu/status-banner.webp).
 *    This ensures 100% reliability in staging, production, offline, or environments without edge API routes.
 */
async function loadTemplateImage(customUrl?: string): Promise<{ img: HTMLImageElement; cleanup: () => void }> {
  const isDefaultUrl = !customUrl || customUrl === STATUS_BANNER_IMAGE_URL;

  // Return in-memory cached image if available for instantaneous generation
  if (isDefaultUrl && cachedTemplateImg) {
    return { img: cachedTemplateImg, cleanup: () => {} };
  }

  const directUrl = customUrl || STATUS_BANNER_IMAGE_URL;
  const proxyUrl = `/api/ilu/status-banner?url=${encodeURIComponent(directUrl)}`;

  // Candidate URLs to try across network
  const candidateUrls = [proxyUrl, directUrl];

  for (const url of candidateUrls) {
    try {
      // Abort controller with 3s timeout to avoid blocking if network is slow
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(url, {
        signal: controller.signal,
        cache: 'force-cache',
      }).finally(() => clearTimeout(timeoutId));

      if (!res.ok) continue;
      const blob = await res.blob();
      if (!blob || blob.size === 0) continue;

      const blobUrl = URL.createObjectURL(blob);
      const img = await loadImageFromSource(blobUrl);

      if (isDefaultUrl) {
        cachedTemplateImg = img;
      }

      return {
        img,
        cleanup: () => {
          if (!isDefaultUrl) {
            URL.revokeObjectURL(blobUrl);
          }
        },
      };
    } catch (e) {
      console.warn(`[iluStatusImage] Network candidate failed: ${url}`, e);
    }
  }

  // Final Fail-Safe: Load embedded base64 of the status-banner.webp image
  // This guarantees zero-failure even if network/CORS fails or on staging before API deploy
  try {
    const img = await loadImageFromSource(STATUS_BANNER_BASE64);
    if (isDefaultUrl) {
      cachedTemplateImg = img;
    }
    return { img, cleanup: () => {} };
  } catch (err) {
    console.error('[iluStatusImage] Fallback base64 load failed:', err);
    throw new Error('Failed to load status banner image: ' + directUrl);
  }
}

/**
 * Generates a high-resolution WhatsApp status image by composing
 * the official ILU template with dynamic club name and quantity.
 */
export async function generateWhatsAppStatusImage(options: StatusImageOptions): Promise<string> {
  const { clubName, quantity, location, imageUrl } = options;
  const { img, cleanup } = await loadTemplateImage(imageUrl);

  try {
    const width = img.naturalWidth || 3375;
    const height = img.naturalHeight || 4219;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas 2d context');
    }

    // 1. Draw background template
    ctx.drawImage(img, 0, 0, width, height);

    const centerX = width / 2; // 1687.5

    // 2. Organization Name - Ultra-Bold directly on cream card background (No box)
    const nameLen = clubName.trim().length;
    let fontSize = 230;
    if (nameLen > 10) fontSize = 200;
    if (nameLen > 16) fontSize = 170;
    if (nameLen > 24) fontSize = 145;
    if (nameLen > 36) fontSize = 120;
    if (nameLen > 50) fontSize = 100;

    const maxNameWidth = 2650;
    ctx.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    let lines = wrapText(ctx, clubName, maxNameWidth);

    // If wrapping produced more than 2 lines, scale down font slightly to keep proportions tight
    if (lines.length > 2 && fontSize > 95) {
      fontSize = Math.max(90, Math.round(fontSize * 0.85));
      ctx.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      lines = wrapText(ctx, clubName, maxNameWidth);
    }

    const lineHeight = fontSize * 1.22;
    // Positioned at 1880px (moved down further for balanced centering)
    const nameStartY = 1880;

    // Render Club Name directly on template (no background)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = '#0f172a'; // rich deep slate
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    lines.forEach((line, i) => {
      ctx.fillText(line, centerX, nameStartY + i * lineHeight);
    });

    let currentY = nameStartY + lines.length * lineHeight;

    // Location subtitle (if available)
    const hasLocation = Boolean(location && location.trim());
    if (hasLocation) {
      ctx.font = '600 52px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.fillText(`📍 ${location!.trim()}`, centerX, currentY + 14);
      currentY += 76;
    }
    ctx.restore();

    // 3. Quantity Count Only - Heroic & Maximum Impact Size
    const formattedQty = Number(quantity).toLocaleString('en-IN');
    const qtyLen = formattedQty.length;

    // Scaled quantity numeral font size:
    let numFontSize = 480;
    if (qtyLen <= 3) numFontSize = 480;       // e.g. "25", "100" -> 480px!
    else if (qtyLen <= 4) numFontSize = 420;  // e.g. "500", "999" -> 420px!
    else if (qtyLen <= 6) numFontSize = 360;  // e.g. "1,250", "9,999" -> 360px!
    else if (qtyLen <= 8) numFontSize = 300;  // e.g. "25,000", "99,999" -> 300px!
    else numFontSize = 260;

    // Shifted down further to 2220px to sit harmoniously centered below the club name
    const countY = Math.max(currentY + 60, 2220);

    // Safety clamp ensuring the numeral never touches the "Order Completed" badge at y=2720
    if (countY + numFontSize > 2710) {
      numFontSize = Math.max(240, 2710 - countY);
    }

    ctx.save();
    // Soft ambient radial glow directly on the canvas behind the count
    const glowCenterY = countY + numFontSize * 0.45;
    const radialGlow = ctx.createRadialGradient(centerX, glowCenterY, 30, centerX, glowCenterY, 650);
    radialGlow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
    radialGlow.addColorStop(0.6, 'rgba(245, 158, 11, 0.12)');
    radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(centerX, glowCenterY, 650, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Render Massive Count Numeral (Directly on canvas)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = `900 ${numFontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = '#ea183c'; // vibrant signature crimson
    ctx.shadowColor = 'rgba(234, 24, 60, 0.35)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
    ctx.fillText(formattedQty, centerX, countY);
    ctx.restore();

    // Return Data URL (with graceful downscale fallback if mobile memory restricts high-res PNG)
    try {
      return canvas.toDataURL('image/png', 0.95);
    } catch (toDataUrlErr) {
      console.warn('[iluStatusImage] High-res PNG export failed, falling back to JPEG/scaled:', toDataUrlErr);
      try {
        return canvas.toDataURL('image/jpeg', 0.92);
      } catch {
        const scale = 1080 / width;
        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = 1080;
        smallCanvas.height = Math.round(height * scale);
        const sCtx = smallCanvas.getContext('2d');
        if (sCtx) {
          sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
          return smallCanvas.toDataURL('image/jpeg', 0.92);
        }
        throw toDataUrlErr;
      }
    }
  } finally {
    cleanup();
  }
}

/**
 * Triggers a browser download of the status image PNG file.
 */
export function downloadStatusImage(dataUrl: string, clubName: string) {
  const safeName = clubName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const link = document.createElement('a');
  link.download = `ilu-palada-order-${safeName || 'club'}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Shares the status image directly on WhatsApp or mobile native share sheet.
 */
export async function shareStatusImage(
  dataUrl: string,
  clubName: string,
  quantity: number | string
): Promise<boolean> {
  const shareText = `*ILU Foundation Palada Challenge 2026*\n\n🎉 *${clubName}* has ordered *${Number(quantity).toLocaleString('en-IN')} Litres* of Palada!\n\nJoin the challenge & view live order status:\nhttps://www.raihsuite.com/ilu/order-status`;

  // Try Web Share API with file (works on Android Chrome and iOS Safari)
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.share) {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const safeName = clubName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const file = new File([blob], `ilu-palada-${safeName}.png`, { type: 'image/png' });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${clubName} - Palada Challenge`,
          text: shareText,
          files: [file],
        });
        return true;
      }
    } catch (e) {
      console.warn('Web Share with file failed, falling back to WhatsApp link:', e);
    }
  }

  // Fallback to WhatsApp URL
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  return true;
}
