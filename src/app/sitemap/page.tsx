import Link from "next/link";
import type { Metadata } from "next";

import { blogPosts } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Sitemap — Raihsuite ERP Pages & Resources",
  description:
    "Explore the complete HTML sitemap for Raihsuite ERP. Access all product features, company info, resources, and blog articles.",
  alternates: {
    canonical: "/sitemap",
  },
};

export default function HtmlSitemapPage() {
  const mainPages = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Book Event Tickets", href: "/events/book-tickets" },
  ];

  const features = [
    { label: "Analytics & Reporting", href: "/features/analytics" },
    { label: "Assets Lifecycle Management", href: "/features/assets-management" },
    { label: "Customer Relationship Management (CRM)", href: "/features/crm" },
    { label: "Event Management Systems", href: "/features/event-management" },
    { label: "Human Resource Management System (HRMS)", href: "/features/hrms" },
    { label: "Order Fulfilment & Processing", href: "/features/order-management" },
  ];

  const legal = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookies Settings", href: "/cookies" },
  ];

  return (
    <div className="bg-[#0b061a] text-white min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]" />
        <div className="relative container-base mx-auto px-6 py-20 lg:py-28 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs sm:text-sm backdrop-blur mb-6">
            Directory
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mx-auto">
            Website{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Sitemap
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto">
            Find and navigate to any page, feature dashboard, or guide on the Raihsuite ERP platform.
          </p>
        </div>
      </section>

      {/* SITEMAP LINKS */}
      <section className="py-20">
        <div className="container-base mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Core Pages */}
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur rounded-2xl p-8 hover:border-purple-500/20 transition-all duration-300">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Main Pages
              </h2>
              <ul className="space-y-4">
                {mainPages.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="text-white/60 hover:text-purple-300 transition-colors text-base flex items-center gap-2 group"
                    >
                      <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Modules */}
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur rounded-2xl p-8 hover:border-purple-500/20 transition-all duration-300">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                ERP Modules
              </h2>
              <ul className="space-y-4">
                {features.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/60 hover:text-purple-300 transition-colors text-base flex items-center gap-2 group"
                    >
                      <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blog Articles */}
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur rounded-2xl p-8 hover:border-purple-500/20 transition-all duration-300 md:col-span-2">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Blog Insights &amp; Guides
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blogPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300 group flex items-start gap-3"
                  >
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform mt-0.5">→</span>
                    <div>
                      <h3 className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors">
                        {post.title}
                      </h3>
                      <span className="text-xs text-white/40 block mt-1">{post.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur rounded-2xl p-8 hover:border-purple-500/20 transition-all duration-300 md:col-span-2">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Legal &amp; Policy
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {legal.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/60 hover:text-purple-300 transition-colors text-base flex items-center gap-2 group"
                    >
                      <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
