'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, ArrowRight, UserPlus } from 'lucide-react';

export default function IluHeader() {
  const pathname = usePathname();
  const isVolunteerPage =
    pathname === '/ilu/volunteer-registration' ||
    pathname === '/ilu/volounteer-registration';
  const isOrderPage = pathname === '/ilu' || pathname === '/ilu/';
  const isSubPage = !isOrderPage;

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://media.raihsuite.com/RS0001/web/ilu/ilu-logo-dark.png"
                alt="ILU Foundation Logo"
                className="h-8 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Volunteer Registration Button */}
            {!isVolunteerPage && (
              <Link
                href="/ilu/volunteer-registration"
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-emerald-600/20 border border-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                title="Volunteer Registration"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span className="hidden sm:inline">Volunteer Registration</span>
                <span className="sm:hidden">Volunteer</span>
              </Link>
            )}

            {/* Order Status / Back to Orders Button */}
            {isSubPage ? (
              <Link
                href="/ilu"
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-[#ea183c]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <span>Submit New Orders</span>
              </Link>
            ) : (
              <Link
                href="/ilu/order-status"
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-[#ea183c]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span className="hidden md:inline">Order Status</span>
                <span className="md:hidden">Status</span>
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
