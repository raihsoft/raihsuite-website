import Link from "next/link";
import type { Metadata } from "next";

import { blogPosts } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog — Raihsuite ERP Insights & Guides",
  description:
    "Expert articles on ERP software, business management, HR, CRM, and operational efficiency. Learn how to streamline your business with Raihsuite.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="bg-[#0b061a] text-white min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]" />
        <div className="relative container-base mx-auto px-6 py-20 lg:py-28 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs sm:text-sm backdrop-blur mb-6">
            <span className="bg-purple-600 text-[10px] sm:text-xs px-2 py-1 rounded-full">
              Blog
            </span>
            Insights &amp; Guides
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mx-auto">
            Raihsuite ERP{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Blog
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto">
            Expert articles on ERP software, business management, and
            operational efficiency for modern teams.
          </p>
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="py-20 sm:py-28">
        <div className="container-base mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 sm:p-8 hover:border-purple-500/40 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
                    {post.category}
                  </span>
                  <span className="text-xs text-white/40">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="text-purple-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read more
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
