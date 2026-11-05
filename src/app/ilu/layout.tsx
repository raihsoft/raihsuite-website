import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  manifest: '/ilu/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'ILU Challenge',
    statusBarStyle: 'default',
  },
  icons: {
    apple: [{ url: '/ilu/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function IluLayout({ children }: Readonly<{ children: ReactNode }>) {
  // The apple-touch-icon comes from `metadata.icons.apple` above. A <head> element here
  // would render inside <body> and break hydration on every /ilu page.
  return <>{children}</>;
}
