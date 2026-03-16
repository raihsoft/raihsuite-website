import Link from "next/link";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/navbar";
import PageTransition from "@/components/layout/PageTransition";
import ProgressBar from "@/components/layout/ProgressBar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Raihsuite ERP - Streamline Your Business Operations",
  description:
    "Comprehensive Enterprise Resource Planning solution to manage inventory, finance, HR, and more. Boost productivity and efficiency with RaihSuite ERP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b061a] text-white">
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>

        {/* NAVBAR */}
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
          <div className="container-base mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="bg-[#05030f]/80 border border-white/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-2xl backdrop-blur-xl">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1">
                <img
                  src="https://media.raihsuite.com/RS0001/web/Gemini_Generated_Image_lltgbilltgbilltg%20(1).png"
                  alt="RaihSuite Logo"
                  className="h-10 sm:h-12 w-auto"
                />
                <span className="text-lg sm:text-xl font-semibold tracking-wide">
                  Raihsuite
                </span>
              </Link>

              {/* Nav links */}
              <Navbar />

              {/* CTA */}
              <div className="hidden sm:flex items-center gap-4">
                <a href="/contact" className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition inline-block">
                  Book a Demo
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="pt-28 sm:pt-36">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-white/10 mt-24">
          <div className="container-base mx-auto px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-white/70">
              <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-1">
                  <img
                    src="https://media.raihsuite.com/RS0001/web/Gemini_Generated_Image_lltgbilltgbilltg%20(1).png"
                    alt="RaihSuite Logo"
                    className="h-8 w-auto"
                  />
                  <span className="text-white font-semibold text-xl">
                    Raihsuite
                  </span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs text-center sm:text-left">
                  Powerful ERP platform to manage your business operations with
                  modern design and efficiency.
                </p>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-white font-medium mb-6">Product</h4>
                <ul className="space-y-4 text-sm">
                  <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/events/book-tickets" className="hover:text-white transition-colors">Events</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                  <li><Link href="/updates" className="hover:text-white transition-colors">Updates</Link></li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-white font-medium mb-6">Company</h4>
                <ul className="space-y-4 text-sm">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-white font-medium mb-6">Legal</h4>
                <ul className="space-y-4 text-sm">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 text-center text-white/40 text-sm flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <span>© {new Date().getFullYear()} Raihsuite ERP. All rights reserved.</span>
              <span className="hidden sm:inline text-white/10">|</span>
              <span>
                Powered by{" "}
                <a
                  href="https://www.raihsoft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-brand-light transition-colors font-medium"
                >
                  Raihsoft
                </a>
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
