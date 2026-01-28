"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Overview", href: "/" },
    { name: "Features", href: "/#features" },
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
              ${
                isActive
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
      <nav className={`fixed top-20 left-0 w-full md:hidden bg-[#0b061a]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden ${
        isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`transition-all duration-200 ${
                  isActive
                    ? "text-white font-medium"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col gap-1.5 focus:outline-none"
        aria-label="Toggle menu"
      >
        <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${
          isOpen ? "rotate-45 translate-y-2" : ""
        }`} />
        <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${
          isOpen ? "opacity-0" : ""
        }`} />
        <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${
          isOpen ? "-rotate-45 -translate-y-2" : ""
        }`} />
      </button>
    </>
  );
}
