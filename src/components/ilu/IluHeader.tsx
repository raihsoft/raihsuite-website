'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, ArrowLeft, ArrowRight, Menu, X } from 'lucide-react';

export default function IluHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStatusPage = pathname === '/ilu/order-status';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#030a1c]/85 backdrop-blur-xl border-b border-blue-900/30 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section - Shifted Slightly Right */}
          <div className="flex items-center gap-3 pl-2 sm:pl-6 lg:pl-10">
            <Link
              href="/ilu"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1 transition"
              aria-label="ILU Foundation Home"
            >
              <img
                src="https://media.raihsuite.com/RS0001/web/ilu/ilu-white-logo.png"
                alt="ILU Foundation Logo"
                className="h-11 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
          </div>



          {/* Right Top Pill Button */}
          <div className="hidden md:flex items-center gap-3 pr-2 sm:pr-6 lg:pr-10">
            {isStatusPage ? (
              <Link
                href="/ilu"
                className="flex items-center gap-2 px-5 py-2 bg-[#0066ff] hover:bg-blue-600 text-white font-semibold text-sm rounded-full shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Order Page</span>
              </Link>
            ) : (
              <Link
                href="/ilu/order-status"
                className="flex items-center gap-2 px-5 py-2 bg-[#0066ff] hover:bg-blue-600 text-white font-semibold text-sm rounded-full shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Check Order Status</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#030a1c]/98 border-b border-blue-900/40 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <Link
            href="/ilu/order-status"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl font-medium text-sm text-slate-200 hover:bg-blue-900/40"
          >
            Order Status
          </Link>
          <div className="pt-2">
            {isStatusPage ? (
              <Link
                href="/ilu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0066ff] text-white font-bold rounded-full text-center text-sm shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Order Page</span>
              </Link>
            ) : (
              <Link
                href="/ilu/order-status"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0066ff] text-white font-bold rounded-full text-center text-sm shadow-md"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Check Order Status →</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
