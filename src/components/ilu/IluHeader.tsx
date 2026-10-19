'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, ArrowLeft, ArrowRight } from 'lucide-react';

export default function IluHeader() {
  const pathname = usePathname();
  const isStatusPage = pathname === '/ilu/order-status';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/ilu"
              className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#f3631f] rounded-lg p-1 transition"
              aria-label="ILU Foundation Home"
            >
              <img
                src="https://media.raihsuite.com/RS0001/web/ilu/ilu-logo-dark.png"
                alt="ILU Foundation Logo"
                className="h-8 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {/* Mobile screen only: Typography near the logo */}
              <img
                src="https://media.raihsuite.com/RS0001/web/ilu/typography.png"
                alt="ILU Challenge Typography"
                className="block sm:hidden h-6 xs:h-7 w-auto max-w-[120px] xs:max-w-[160px] object-contain"
              />
            </Link>
          </div>

          {/* Right Action Pill Button with vibrant gradient */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isStatusPage ? (
              <Link
                href="/ilu"
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-[#ea183c]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden xs:inline sm:inline">Back to Order Page</span>
                <span className="xs:hidden sm:hidden">Order Page</span>
              </Link>
            ) : (
              <Link
                href="/ilu/order-status"
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-[#ea183c]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span className="hidden xs:inline sm:inline">Check Order Status</span>
                <span className="xs:hidden sm:hidden">Order Status</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 hidden sm:inline" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Thin brand gradient line under navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c]" />
    </header>
  );
}
