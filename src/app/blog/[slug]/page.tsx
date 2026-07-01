import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { blogPosts, getPostBySlug } from "@/lib/blogPosts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Raihsuite Blog`,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://www.raihsuite.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Raihsuite",
    },
    publisher: {
      "@type": "Organization",
      name: "Raihsuite",
      logo: {
        "@type": "ImageObject",
        url: "https://media.raihsuite.com/RS0001/web/Raihsuite-logo.png",
      },
    },
    url: `https://www.raihsuite.com/blog/${post.slug}`,
  };

  // Convert markdown-like content to simple HTML
  const contentHtml = post.content
    .split("\n\n")
    .map((block) => {
      // Headings
      if (block.startsWith("### "))
        return `<h3 class="text-xl font-bold mt-10 mb-4 text-white">${block.slice(4)}</h3>`;
      if (block.startsWith("## "))
        return `<h2 class="text-2xl font-bold mt-12 mb-4 text-white">${block.slice(3)}</h2>`;

      // Table blocks
      if (block.includes("|") && block.includes("---")) {
        const rows = block
          .split("\n")
          .filter((r) => !r.match(/^\|[\s-|]+\|$/));
        const headerCells = rows[0]
          ?.split("|")
          .filter(Boolean)
          .map((c) => c.trim());
        const bodyRows = rows.slice(1);
        let table = `<div class="overflow-x-auto my-8"><table class="w-full text-sm border border-white/10 rounded-lg overflow-hidden"><thead><tr>`;
        headerCells?.forEach(
          (c) =>
            (table += `<th class="text-left px-4 py-3 bg-white/5 text-white/80 font-semibold border-b border-white/10">${c}</th>`)
        );
        table += `</tr></thead><tbody>`;
        bodyRows.forEach((row) => {
          const cells = row
            .split("|")
            .filter(Boolean)
            .map((c) => c.trim());
          table += `<tr class="border-b border-white/5">`;
          cells.forEach(
            (c) =>
              (table += `<td class="px-4 py-3 text-white/60">${c}</td>`)
          );
          table += `</tr>`;
        });
        table += `</tbody></table></div>`;
        return table;
      }

      // Unordered list blocks
      if (block.match(/^- \*\*/m)) {
        const items = block
          .split("\n")
          .filter((l) => l.startsWith("- "))
          .map((l) => {
            const text = l
              .slice(2)
              .replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="text-white">$1</strong>'
              );
            return `<li class="flex items-start gap-2"><span class="text-purple-400 mt-1.5 flex-shrink-0">•</span><span>${text}</span></li>`;
          });
        return `<ul class="space-y-2 my-4 text-white/60">${items.join("")}</ul>`;
      }

      // Numbered list blocks
      if (block.match(/^\d+\./m)) {
        const items = block
          .split("\n")
          .filter((l) => l.match(/^\d+\./))
          .map((l, i) => {
            const text = l
              .replace(/^\d+\.\s*/, "")
              .replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="text-white">$1</strong>'
              );
            return `<li class="flex items-start gap-3"><span class="text-purple-400 font-bold flex-shrink-0">${i + 1}.</span><span>${text}</span></li>`;
          });
        return `<ol class="space-y-2 my-4 text-white/60">${items.join("")}</ol>`;
      }

      // Paragraphs with inline formatting
      let html = block
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="text-white">$1</strong>'
        )
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" class="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">$1</a>'
        );
      return `<p class="text-white/60 leading-relaxed my-4">${html}</p>`;
    })
    .join("");

  return (
    <div className="bg-[#0b061a] text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]" />
        <div className="relative container-base mx-auto px-6 py-16 lg:py-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
              {post.category}
            </span>
            <span className="text-xs text-white/40">{post.readTime}</span>
            <time
              dateTime={post.date}
              className="text-xs text-white/40"
            >
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-white/60 max-w-2xl">
            {post.description}
          </p>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <article className="py-12 sm:py-16">
        <div className="container-base mx-auto px-6 max-w-3xl">
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </article>

      {/* BACK TO BLOG CTA */}
      <section className="py-16 border-t border-white/10">
        <div className="container-base mx-auto px-6 text-center">
          <p className="text-white/50 mb-4">
            Enjoyed this article?
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 font-medium"
          >
            Read More Articles
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
          </Link>
        </div>
      </section>
    </div>
  );
}
