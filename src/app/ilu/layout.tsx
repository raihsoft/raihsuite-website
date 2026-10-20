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
  return (
    <>
      <head>
        <link rel="apple-touch-icon" href="/ilu/icons/icon-192.png" />
      </head>
      {children}
    </>
  );
}
