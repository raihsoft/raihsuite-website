import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Raisuite Web Starter',
  description: 'Reusable starter template for multi-tenant Raisuite client sites.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b mb-6">
          <div className="container-base py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Raisuite Starter</h1>
            <nav className="flex gap-4">
              <a href="/">Home</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </header>
        <main className="container-base">{children}</main>
        <footer className="container-base py-10 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Raisuite Starter. All rights reserved.
        </footer>
      </body>
    </html>
  );
}