"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Overview", href: "/" },
    { name: "Modules", href: "/#modules" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="hidden md:flex items-center gap-8 text-sm">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`
              relative transition-all duration-200
              ${isActive
                  ? "text-white font-medium"
                  : "text-slate-300 hover:text-white"
                }
            `}
            >
              {link.name}

              {/* underline for active */}
              {isActive && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mobile menu */}
      <nav aria-hidden="true" className={`fixed inset-x-0 top-[72px] sm:top-[88px] mx-4 sm:mx-6 md:hidden bg-[#05030f]/95 backdrop-blur-2xl border border-white/10 rounded-2xl transition-all duration-300 origin-top overflow-hidden z-50 ${isOpen ? "scale-y-100 opacity-100 translate-y-0" : "scale-y-0 opacity-0 -translate-y-4 pointer-events-none"
        }`}>
        <div className="p-6 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg transition-all duration-200 py-2 border-b border-white/5 last:border-0 ${isActive
                  ? "text-brand-light font-semibold"
                  : "text-slate-300 hover:text-white"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 mt-2 border-t border-white/10">
            <a href="/contact" onClick={() => setIsOpen(false)} className="w-full bg-white text-black px-6 py-4 rounded-xl text-center font-bold hover:bg-gray-200 transition inline-block">
              Book a Private Demo
            </a>
          </div>
        </div>
      </nav>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative z-50 p-2 -mr-2 flex flex-col gap-1.5 focus:outline-none bg-[#05030f]/50 rounded-lg border border-white/10"
        aria-label="Toggle menu"
      >
        <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""
          }`} />
        <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""
          }`} />
        <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""
          }`} />
      </button>
    </>
  );
}
