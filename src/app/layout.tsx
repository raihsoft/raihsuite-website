import { Suspense } from "react";
import type { Metadata } from "next";

import ProgressBar from "@/components/layout/ProgressBar";
import ConditionalShell from "@/components/layout/ConditionalShell";

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

        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}

