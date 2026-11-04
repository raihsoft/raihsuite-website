'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'react-qr-code';

import { startTvEngine } from './engine';
import { TV_SHELL_HTML } from './markup';
import { createDemoSource, createLiveSource } from './tvData';
import './tv-display.css';

const RAIHSOFT_URL = 'https://www.raihsoft.com';

/**
 * Full-screen TV display for the ILU Palada Challenge.
 * URL options: ?demo=1 (sample data), ?seconds=18 (time per screen), ?adEvery=4 (Raihsoft ad after N screens, 0 = never).
 *
 * The shell markup is written once on mount and then owned by the engine, so React never
 * re-renders (and resets) it. Only the QR code is rendered by React, through a portal.
 */
export default function TvDisplay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [qrTarget, setQrTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    root.innerHTML = TV_SHELL_HTML;

    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo') === '1';
    const seconds = Number(params.get('seconds'));
    const adEveryParam = params.get('adEvery');
    const adEvery = adEveryParam != null && adEveryParam !== '' ? Number(adEveryParam) : NaN;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const stop = startTvEngine(root, {
      source: demo ? createDemoSource() : createLiveSource(),
      screenMs: Number.isFinite(seconds) && seconds >= 5 ? seconds * 1000 : undefined,
      adEvery: Number.isFinite(adEvery) && adEvery >= 0 ? adEvery : undefined,
    });
    setQrTarget(root.querySelector<HTMLElement>('#rsQR'));

    return () => {
      stop();
      setQrTarget(null);
      root.innerHTML = '';
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className="tvd" />
      {qrTarget &&
        createPortal(
          <QRCode value={RAIHSOFT_URL} size={320} fgColor="#000e52" bgColor="#ffffff" title="QR code for www.raihsoft.com" />,
          qrTarget
        )}
    </>
  );
}
