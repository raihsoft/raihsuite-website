import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import Navbar from "@/components/navbar/navbar";
import PageTransition from "@/components/layout/PageTransition";
import ProgressBar from "@/components/layout/ProgressBar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Raihsuite ERP - Streamline Your Business Operations",
  description:
    "Raihsuite ERP unifies HR, CRM, assets, orders, and analytics in one platform. Built for modern teams. Book a free demo today.",
  metadataBase: new URL("https://www.raihsuite.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Raihsuite ERP - Streamline Your Business Operations",
    description: "A powerful ERP platform for operations, finance, HR, and analytics.",
    url: "https://www.raihsuite.com/",
    siteName: "Raihsuite",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Raihsuite ERP",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raihsuite ERP - Streamline Your Business Operations",
    description: "A powerful ERP platform for operations, finance, HR, and analytics.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "https://media.raihsuite.com/RS0001/web/Raihsuite-logo.png",
    shortcut: "https://media.raihsuite.com/RS0001/web/Raihsuite-logo.png",
    apple: "https://media.raihsuite.com/RS0001/web/Raihsuite-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Raihsuite ERP",
      "applicationCategory": "BusinessApplication",
      "description": "Comprehensive ERP platform for operations, finance, HR, and analytics.",
      "url": "https://www.raihsuite.com/",
      "offers": { 
        "@type": "Offer", 
        "price": "0", 
        "priceCurrency": "USD" 
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Raihsuite",
      "url": "https://www.raihsuite.com/",
      "logo": "https://media.raihsuite.com/RS0001/web/Raihsuite-logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9847-991-099",
        "contactType": "customer service",
        "email": "contact@raihsoft.com",
        "availableLanguage": ["en"]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Raihsuite",
      "url": "https://www.raihsuite.com/"
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Main Navigation",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "About Us",
          "url": "https://www.raihsuite.com/about"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "Contact Us",
          "url": "https://www.raihsuite.com/contact"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "ERP Blog",
          "url": "https://www.raihsuite.com/blog"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "HRMS Module",
          "url": "https://www.raihsuite.com/features/hrms"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "CRM Module",
          "url": "https://www.raihsuite.com/features/crm"
        }
      ]
    }
  ];

  return (
    <html lang="en">
      <head>
        <link rel="sitemap" type="application/xml" href="https://www.raihsuite.com/sitemap.xml" />
      </head>
      <body className="bg-[#0b061a] text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
                  src="https://media.raihsuite.com/RS0001/web/Raihsuite-logo.png"
                  alt="Raihsuite Logo"
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
                  Book a Private Demo
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
                    src="https://media.raihsuite.com/RS0001/web/Raihsuite-logo.png"
                    alt="Raihsuite Logo"
                    className="h-8 w-auto"
                  />
                  <span className="text-white font-semibold text-xl">
                    Raihsuite
                  </span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs text-center sm:text-left">
                  A powerful, unified ERP platform engineered to manage modern business operations with maximum efficiency and elegant design.
                </p>
                <div className="text-xs text-white/50 space-y-1 text-center sm:text-left pt-1">
                  <p>Email: <a href="mailto:contact@raihsoft.com" className="hover:text-white transition-colors">contact@raihsoft.com</a></p>
                  <p>Phone: <a href="tel:+919847991099" className="hover:text-white transition-colors">+91 9847 991 099</a></p>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <a
                    href="https://x.com/raihsoft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                    aria-label="Raihsoft X"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/raihsoft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                    aria-label="Raihsoft Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@raihsoft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                    aria-label="Raihsoft YouTube"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.86.508 9.388.508 9.388.508s7.528 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/raihsoft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                    aria-label="Raihsoft Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-white font-medium mb-6">Modules</h3>
                <ul className="space-y-4 text-sm">
                  <li><Link href="/#modules" className="hover:text-white transition-colors">HRMS</Link></li>
                  <li><Link href="/#modules" className="hover:text-white transition-colors">CRM</Link></li>
                  <li><Link href="/#modules" className="hover:text-white transition-colors">Asset Management</Link></li>
                  <li><Link href="/#modules" className="hover:text-white transition-colors">Order Management</Link></li>
                  <li><Link href="/#modules" className="hover:text-white transition-colors">Event Management</Link></li>
                  <li><Link href="/#modules" className="hover:text-white transition-colors">Business Intelligence</Link></li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-white font-medium mb-6">Company</h3>
                <ul className="space-y-4 text-sm">
                  <li><Link href="/about" className="hover:text-white transition-colors">About Raihsoft</Link></li>
                  <li><Link href="/technology-strategy" className="hover:text-white transition-colors">Technology Strategy</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Technical Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="text-white font-medium mb-6">Legal</h3>
                <ul className="space-y-4 text-sm">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
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
