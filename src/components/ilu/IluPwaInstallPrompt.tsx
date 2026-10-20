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
    <div className="fixed inset-x-0 top-0 z-[70] flex justify-center px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] sm:inset-0 sm:items-center sm:bg-slate-950/45 sm:p-6" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ilu-install-title"
        className="w-full max-w-md rounded-2xl border border-white/70 bg-white p-3 shadow-xl sm:max-w-sm sm:rounded-3xl sm:p-6 sm:shadow-2xl"
      >
        <div className="flex items-center gap-3 sm:mb-4 sm:items-start sm:justify-between">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#e60368] sm:h-12 sm:w-12 sm:rounded-2xl">
            <Download aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="ilu-install-title" className="text-sm font-bold text-slate-900 sm:text-xl">Install ILU Challenge</h2>
            <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
              Add it to your home screen for quick access. The app stays up to date from the website.
            </p>
          </div>
          <button type="button" onClick={dismiss} aria-label="Close install prompt" className="-mr-1 -mt-1 self-start rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {showInstructions && (
          <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-slate-700 sm:text-sm">
            {ios ? (
              <p>In Safari, tap <strong>Share</strong>, then choose <strong>Add to Home Screen</strong>.</p>
            ) : (
              <p>Open your browser menu (⋮) and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center justify-end gap-2 sm:mt-5">
          <button type="button" onClick={dismiss} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm">
            Later
          </button>
          <button type="button" onClick={install} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm">
            {ios || showInstructions ? 'How to install' : 'Install app'}
          </button>
        </div>
      </section>
    </div>
  );
}
