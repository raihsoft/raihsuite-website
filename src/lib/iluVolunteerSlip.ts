'use client';

import { VolunteerParticipant, formatVolunteerPassId } from './iluVolunteerService';

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

/**
 * Loads an image from a URL as a promise.
 */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Generates a clean, high-resolution PNG data URL for the volunteer pass (without QR code).
 */
export async function generateVolunteerSlipDataUrl(
  volunteer: VolunteerParticipant
): Promise<string> {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1320;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // 1. Dark elegant emerald background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a2e22');
  bgGrad.addColorStop(0.5, '#062319');
  bgGrad.addColorStop(1, '#041811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle gold outer border
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(250, 167, 12, 0.45)';
  drawRoundedRect(ctx, 36, 36, width - 72, height - 72, 32);
  ctx.stroke();

  // 2. White Card Container
  const cardX = 64;
  const cardY = 64;
  const cardW = width - 128;
  const cardH = height - 128;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 26);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 14;
  ctx.fill();
  ctx.restore();

  // Top header banner background (Emerald gradient)
  const headerH = 240;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cardX + 26, cardY);
  ctx.lineTo(cardX + cardW - 26, cardY);
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + 26);
  ctx.lineTo(cardX + cardW, cardY + headerH);
  ctx.lineTo(cardX, cardY + headerH);
  ctx.lineTo(cardX, cardY + 26);
  ctx.quadraticCurveTo(cardX, cardY, cardX + 26, cardY);
  ctx.closePath();
  ctx.clip();

  const hGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + headerH);
  hGrad.addColorStop(0, '#064e3b');
  hGrad.addColorStop(0.6, '#047857');
  hGrad.addColorStop(1, '#0f766e');
  ctx.fillStyle = hGrad;
  ctx.fill();

  // Amber accent line
  ctx.fillStyle = '#faa70c';
  ctx.fillRect(cardX, cardY + headerH - 6, cardW, 6);
  ctx.restore();

  // Logo
  const logo = await loadImage(
    'https://media.raihsuite.com/RS0001/web/ilu/tv-display-logo.png'
  );
  if (logo) {
    const logoW = 240;
    const logoH = Math.round((logoW * logo.height) / logo.width);
    ctx.drawImage(logo, cardX + (cardW - logoW) / 2, cardY + 24, logoW, logoH);
  } else {
    ctx.font = '800 32px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('ILU FOUNDATION', width / 2, cardY + 68);
  }

  // Header Title
  ctx.textAlign = 'center';
  ctx.font = '800 20px sans-serif';
  ctx.fillStyle = '#faa70c';
  ctx.letterSpacing = '3px';
  ctx.fillText('PALADA CHALLENGE 2026', width / 2, cardY + 154);

  ctx.font = '800 28px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.letterSpacing = '1px';
  ctx.fillText('OFFICIAL VOLUNTEER PASS', width / 2, cardY + 196);

  // 3. Pass Badge (ILUV-0007 / from backend code)
  const passId = volunteer.code || formatVolunteerPassId(volunteer);
  const badgeY = cardY + headerH + 28;
  const badgeH = 56;
  ctx.font = '800 24px sans-serif';
  const textWidth = ctx.measureText(`PASS NO: ${passId}`).width;
  const badgeW = Math.max(320, textWidth + 60);
  const badgeX = cardX + (cardW - badgeW) / 2;

  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 28);
  const bGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
  bGrad.addColorStop(0, '#faa70c');
  bGrad.addColorStop(1, '#f3631f');
  ctx.fillStyle = bGrad;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`PASS NO: ${passId}`, width / 2, badgeY + 36);

  // 4. Volunteer Name
  const nameY = badgeY + 76;
  ctx.textAlign = 'center';
  ctx.font = '700 14px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('VOLUNTEER NAME', width / 2, nameY + 18);

  ctx.font = '800 42px sans-serif';
  ctx.fillStyle = '#0f172a';
  const dispName = volunteer.first_name || volunteer.participant_name || 'Volunteer';
  ctx.fillText(dispName, width / 2, nameY + 66);

  // Status Badge
  const statY = nameY + 86;
  const statW = 260;
  const statH = 38;
  const statX = cardX + (cardW - statW) / 2;
  drawRoundedRect(ctx, statX, statY, statW, statH, 19);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#10b981';
  ctx.stroke();

  ctx.fillStyle = '#065f46';
  ctx.font = '800 15px sans-serif';
  ctx.fillText('✓ VERIFIED VOLUNTEER', width / 2, statY + 24);

  // 5. Details Grid (4 Cards: Mobile, Club, Place, Date)
  const gridY = statY + 60;
  const gridW = cardW - 80;
  const gridX = cardX + 40;
  const colW = (gridW - 20) / 2;
  const cellH = 110;

  const clubName =
    (volunteer.custom_data?.club_name as string) || '-';
  const place = volunteer.place || '-';

  const dateObj = volunteer.created_at ? new Date(volunteer.created_at) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const cells = [
    { label: 'WHATSAPP NUMBER', value: `+91 ${volunteer.phone}` },
    { label: 'CLUB / ORG / INSTITUTION', value: clubName },
    { label: 'PLACE', value: place },
    { label: 'DATE', value: dateStr },
  ];

  cells.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = gridX + col * (colW + 20);
    const cy = gridY + row * (cellH + 16);

    drawRoundedRect(ctx, cx, cy, colW, cellH, 16);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '700 13px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(item.label, cx + 20, cy + 34);

    ctx.font = '800 21px sans-serif';
    ctx.fillStyle = '#0f172a';

    let printVal = item.value;
    const maxValW = colW - 40;
    if (ctx.measureText(printVal).width > maxValW) {
      while (printVal.length > 3 && ctx.measureText(`${printVal}...`).width > maxValW) {
        printVal = printVal.slice(0, -1);
      }
      printVal = `${printVal}...`;
    }
    ctx.fillText(printVal, cx + 20, cy + 72);
  });

  // 6. Clean Footer
  const footY = cardY + cardH - 44;
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(cardX + 40, footY - 22);
  ctx.lineTo(cardX + cardW - 40, footY - 22);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '700 14px sans-serif';
  ctx.fillStyle = '#065f46';
  ctx.fillText('ILU FOUNDATION KERALA', width / 2, footY);

  ctx.font = '600 12px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Technology Partner: raihsoft.com', width / 2, footY + 20);

  return canvas.toDataURL('image/png');
}

/**
 * Initiates a browser download of the volunteer slip PNG file.
 */
export function downloadVolunteerSlipImage(
  dataUrl: string,
  volunteerName: string,
  passId: string
) {
  const safeName = volunteerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const link = document.createElement('a');
  link.download = `ilu-volunteer-pass-${passId.toLowerCase()}-${safeName || 'slip'}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
