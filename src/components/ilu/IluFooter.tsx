'use client';

import React from 'react';
import Link from 'next/link';

export default function IluFooter() {
  return (
    <footer id="footer" className="relative bg-white text-slate-700 border-t border-amber-100/80 pt-12 pb-8 overflow-hidden">
      {/* Decorative Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ea183c] via-[#e60388] via-[#f3631f] to-[#faa70c]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 xl:px-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/ilu">
              <img
                src="https://media.raihsuite.com/RS0001/web/ilu/ilu-logo-dark.png"
                alt="ILU Foundation Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center Tagline in English */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-slate-600 font-medium tracking-wide">
              Together for a more inclusive and compassionate world.
            </p>
          </div>

          {/* Right Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/people/Ilu-Thanal/pfbid0r4fe9PXQ8jci86Eq24eJwM1qStaszQynuhwtbWU5LKgDi6EKKRNrjyuTYUri1XGEl/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-100 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition"
              aria-label="ILU Foundation on Facebook"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/ilu_thanal?igshid=YmMyMTA2M2Y%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-100 text-slate-700 hover:text-pink-600 hover:bg-pink-50 transition"
              aria-label="ILU Foundation on Instagram"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/channel/UCv0ZSyTCKgcdjTSEsyFzaUg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-slate-100 text-slate-700 hover:text-red-600 hover:bg-red-50 transition"
              aria-label="ILU Foundation on YouTube"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.86.508 9.388.508 9.388.508s7.528 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="pt-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ILU Foundation. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <span>Designed & Developed by</span>
              <a
                href="https://www.raihsoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center transition-opacity hover:opacity-80"
                aria-label="Raihsoft Website"
              >
                <img
                  src="https://media.raihsuite.com/RS0013/Raihsoft-dark-logo.png"
                  alt="Raihsoft Logo"
                  className="h-4 sm:h-5 w-auto object-contain inline-block"
                />
              </a>
            </div>

            <span className="text-amber-200 hidden sm:inline" aria-hidden="true">•</span>

            {/* Raihsoft Social Links */}
            <div className="flex items-center gap-1.5">
              <a
                href="https://www.linkedin.com/company/raihsoft/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:scale-105 transition-all flex items-center justify-center"
                aria-label="Raihsoft on LinkedIn"
              >
                <svg className="w-3 h-3 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                </svg>
              </a>
              <a
                href="https://x.com/raihsoft"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:scale-105 transition-all flex items-center justify-center"
                aria-label="Raihsoft on X"
              >
                <svg className="w-3 h-3 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@raihsoft"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:scale-105 transition-all flex items-center justify-center"
                aria-label="Raihsoft on YouTube"
              >
                <svg className="w-3 h-3 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.86.508 9.388.508 9.388.508s7.528 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/raihsoft"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:scale-105 transition-all flex items-center justify-center"
                aria-label="Raihsoft on Instagram"
              >
                <svg className="w-3 h-3 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/raihsoft"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:scale-105 transition-all flex items-center justify-center"
                aria-label="Raihsoft on Facebook"
              >
                <svg className="w-3 h-3 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.52-.14-2.73-.14-2.8 0-4.77 1.71-4.77 4.9V9.5H7v4h3V22h4v-8.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
