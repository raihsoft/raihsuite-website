'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISSED_KEY = 'ilu-pwa-install-dismissed';

export default function IluPwaInstallPrompt() {
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const isIosDevice = /iphone|ipad|ipod/i.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setIos(isIosDevice);
    setInstalled(isStandalone);

    if ('serviceWorker' in navigator && window.isSecureContext) {
      let registration: ServiceWorkerRegistration | undefined;
      navigator.serviceWorker.register('/ilu/sw.js', { scope: '/ilu' })
        .then((result) => {
          registration = result;
          void result.update();
        })
        .catch(() => {
          // The website remains usable when service workers are unavailable.
        });

      const updateWhenVisible = () => {
        if (document.visibilityState === 'visible') void registration?.update();
      };
      document.addEventListener('visibilitychange', updateWhenVisible);
      return () => document.removeEventListener('visibilitychange', updateWhenVisible);
    }
    return undefined;
  }, []);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISSED_KEY) === '1';
    } catch {
      // Continue without remembering dismissal when storage is unavailable.
    }
    if (installed || dismissed) return;
    const isMobile = window.matchMedia('(max-width: 767px)').matches
      || /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!isMobile) return;
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, [installed]);

  useEffect(() => {
    const handleInstallAvailable = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setOpen(false);
      setInstallPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', handleInstallAvailable);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallAvailable);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // Closing the prompt should still work when storage is restricted.
    }
    setOpen(false);
  };

  const install = async () => {
    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === 'accepted') setOpen(false);
  };

  if (!open || installed) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/45 p-3 sm:items-center sm:p-6" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ilu-install-title"
        className="w-full max-w-sm rounded-3xl border border-white/70 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#e60368]">
            <Download aria-hidden="true" className="h-6 w-6" />
          </div>
          <button type="button" onClick={dismiss} aria-label="Close install prompt" className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <h2 id="ilu-install-title" className="text-xl font-bold text-slate-900">Install ILU Challenge</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add it to your home screen for quick access. The app stays up to date from the website.
        </p>

        {showInstructions && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm leading-5 text-slate-700">
            {ios ? (
              <p>In Safari, tap <strong>Share</strong>, then choose <strong>Add to Home Screen</strong>.</p>
            ) : (
              <p>Open your browser menu (⋮) and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" onClick={dismiss} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Later
          </button>
          <button type="button" onClick={install} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
            {ios || showInstructions ? 'How to install' : 'Install app'}
          </button>
        </div>
      </section>
    </div>
  );
}
