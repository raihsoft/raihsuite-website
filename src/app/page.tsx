import Link from "next/link";

import FaqAccordion from "@/components/ui/FaqAccordion";
import { getLatestPosts } from "@/lib/blogPosts";

const faqItems = [
  {
    question: "What is Raihsuite and how does it improve operations?",
    answer: "Raihsuite is a modular Enterprise Resource Planning (ERP) platform designed for modern business operations. It unifies essential operational domains including HR &amp; Payroll Management, Customer Relationship Management (CRM), Asset Lifecycle Management, Order Processing, and Event Ticketing into a secure, single-dashboard workspace, eliminating data silos and manual workflow overhead."
  },
  {
    question: "Can we select only the modules that our business needs?",
    answer: "Yes! Raihsuite is built with strict modular architecture. You can begin by activating only a single module, such as the HRMS for employee tracking or the CRM for client sales pipeline tracking. As your business grows, you can activate additional modules like Order or Asset Management instantly without having to reinstall or modify your core environment."
  },
  {
    question: "How secure is our database on the Raihsuite platform?",
    answer: "Security is foundational to our operations. We utilize advanced transport-layer encryption, strict database partitioning, and robust role-based access control (RBAC) levels so that personnel only access records relevant to their approved duties. Our systems undergo routine security testing to prevent external leaks and ensure absolute business confidentiality."
  },
  {
    question: "Do you provide onboarding and data migration support?",
    answer: "Absolutely. We assign dedicated implementation managers to assist you throughout the data migration process. We will extract, clean, and validate your historical datasets—such as HR details, inventory tables, and client cycles—and migrate them safely into the Raihsuite system, ensuring your organization moves forward without any data loss."
  },
  {
    question: "What customization options exist for enterprise customers?",
    answer: "For our Enterprise tier customers, we offer customized layouts, unique workflow triggers, dedicated databases, custom reporting templates, and direct database integrations with legacy tools. Our core developers work closely with your internal teams to design custom solutions matching your exact compliance guidelines."
  }
];

export default function HomePage() {
  return (
    <div className="bg-[#0b061a] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826] animate-fade-in" />

        <div className="relative container-base mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="animate-slide-in-left text-center lg:text-left flex flex-col items-center lg:items-start">
           

            <h1 className="mt-8 text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-tight animate-slide-up animate-stagger-1 max-w-2xl">
              Raihsuite ERP — <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Business Management Software</span> for Operations, HR &amp; Finance
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl animate-slide-up animate-stagger-2">
              Stop wrestling with disconnected spreadsheets and fragmented software. Raihsuite unifies your workforce, customer pipelines, assets, and supply chain into a single, high-velocity operational command center. Built for modern teams who prioritize efficiency over software bloat.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up animate-stagger-3 w-full sm:w-auto">
              <a href="/contact" className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block text-center font-bold">
                Book a Private Demo
              </a>
              <a href="#modules" className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg text-center font-bold">
                Explore Modules &darr;
              </a>
            </div>

            <p className="mt-8 text-sm text-white/50 animate-slide-up animate-stagger-4">
              Engineered by Raihsoft. Trusted by 500+ business owners across 12 countries.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative animate-slide-in-right flex justify-center">
            <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full animate-pulse" />
            <img
              src="https://media.raihsuite.com/RS0001/web/original-7d8eb6bcb45c0d53f109bddc510ff04e.webp"
              alt="Raihsuite ERP Dashboard"
              className="relative w-full max-w-xl lg:max-w-2xl h-auto rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>


      {/* MODULES */}
      <section id="modules" className="bg-white text-black py-24 sm:py-32 animate-fade-in scroll-mt-24">
        <div className="container-base mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20 animate-slide-up">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold animate-scale-in">
              Core Modules
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold animate-slide-up animate-stagger-1 text-gray-900">
              Enterprise Capability. Zero Bloat.
            </h2>
            <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto animate-slide-up animate-stagger-2">
              Everything you need to automate workflows, eliminate manual data entry, and scale operations with absolute visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Workforce & Operations (HRMS)",
                description: "Centralize employee lifecycles, automate attendance tracking, and streamline core HR operations without the administrative friction.",
                keyValue: "Move from manual tracking to frictionless, automated compliance.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M13 16H3v-2a6 6 0 0112 0v2zm0-12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                link: "/features/hrms"
              },
              {
                title: "Pipeline & Growth (CRM)",
                description: "Never let a lead go cold. Track client lifecycles, manage high-value deals, and view real-time sales pipelines from a single dashboard.",
                keyValue: "Turn customer interactions into structured, repeatable revenue pipelines.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                link: "/features/crm"
              },
              {
                title: "Capital & Infrastructure",
                description: "Gain full lifecycle visibility over company infrastructure, hardware, and physical assets. Minimize loss, schedule preventive maintenance, and track depreciation accurately.",
                keyValue: "Protect your bottom line with total capital asset accountability.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M7 15l-3 1.5" />
                  </svg>
                ),
                link: "/features/assets-management"
              },
              {
                title: "Supply Chain & Fulfillment",
                description: "Streamline the entire order lifecycle from initial invoice generation to final fulfillment. Eliminate communication gaps between sales and logistics.",
                keyValue: "Elevate fulfillment accuracy and eliminate manual order processing errors.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
                link: "/features/order-management"
              },
              {
                title: "Corporate Operations",
                description: "Orchestrate major corporate events, stakeholder conferences, and operational rollouts. Track schedules, resource allocations, and execution milestones.",
                keyValue: "Keep complex organizational timelines synchronized and on track.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                link: "/features/event-management"
              },
              {
                title: "Intelligence & Strategy",
                description: "Ditch the guesswork. Consolidate cross-department data into clean, actionable, real-time dashboards for data-driven executive decisions.",
                keyValue: "Identify operational bottlenecks before they impact your quarterly profit margins.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                link: "/features/analytics"
              },
            ].map((feature, index) => {
              return (
                <a
                  key={feature.title}
                  href={feature.link}
                  className={`group relative p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-xl hover:shadow-purple-200/30 transition-all duration-500 hover:-translate-y-1 hover:border-purple-300 animate-scale-in overflow-hidden cursor-pointer block flex flex-col justify-between`}
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex-grow">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl mb-4 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:shadow-lg group-hover:shadow-purple-300/50 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-700 transition-colors">{feature.title}</h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <p className="text-xs text-purple-700 font-medium bg-purple-50 p-3 rounded-lg border border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-200 transition-colors">
                      <span className="font-bold text-purple-800">Key Value:</span> {feature.keyValue}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 inline-flex items-center gap-2 text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                    Learn more <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION MATRIX */}
      <section className="bg-white text-black py-24 sm:py-32 border-t border-gray-100">
        <div className="container-base mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16 sm:mb-20">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
              The Raihsuite Difference
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Value Proposition Matrix
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="bg-gray-50 p-8 sm:p-12">
                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span> What Legacy ERPs Do
                </h3>
                <ul className="space-y-6 text-gray-600 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    Months of complex onboarding and specialized consultant fees.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    Siloed data that requires manual exports and custom scripts to link.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    Hidden scaling costs and rigid module licensing traps.
                  </li>
                </ul>
              </div>
              <div className="p-8 sm:p-12 bg-gradient-to-br from-purple-900 to-[#120826] text-white">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                  <span className="text-green-400 font-bold">✓</span> What Raihsuite Delivers
                </h3>
                <ul className="space-y-6 text-purple-100 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    Rapid deployment with an intuitive, modern UI your team will actually love using.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    Native integration across HR, Sales, Assets, and Orders out of the box.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    Predictable, clear pricing designed to scale symmetrically with your growth.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#05030f] text-white py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#13072b] to-[#05030f] opacity-50" />
        <div className="relative container-base mx-auto px-6 z-10">
          <div className="text-center mb-16 sm:mb-20">
            <span className="bg-white/10 border border-white/10 text-purple-300 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
              Deployment Flow
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold">
              Simple Three-Step Implementation
            </h2>
            <p className="mt-4 text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
              Transitioning your operations to a new ERP platform should not feel daunting. We make configuration and deployment simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-5xl font-extrabold text-purple-500/30 mb-4 block">01</span>
              <h3 className="text-lg font-bold mb-3">Consult &amp; Customize</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Meet with our technical consultation team to map out your business processes. Choose the exact layout, configure specific roles, and adapt the system parameters to mirror your daily workflow.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-5xl font-extrabold text-purple-500/30 mb-4 block">02</span>
              <h3 className="text-lg font-bold mb-3">Seamless Data Migration</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                We handle the heavy lifting. Securely transfer employee files, CRM lead history, inventory sheets, and order logs from legacy software or sheets into your unified dashboard with zero system downtime.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-5xl font-extrabold text-purple-500/30 mb-4 block">03</span>
              <h3 className="text-lg font-bold mb-3">Go Live &amp; Automate</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Train your staff on a modern user interface, launch automated reporting triggers, and watch productivity metrics rise as your teams collaborate from a single centralized platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white text-black py-24 sm:py-32 border-t border-gray-100">
        <div className="container-base mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
              Success Stories
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Trusted by Leading Organizations
            </h2>
            <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Read how teams across various business models are optimizing their workflows and scaling efficiency using Raihsuite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-100 bg-[#fbfbfe] hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 flex flex-col justify-between">
              <p className="text-gray-700 text-sm leading-relaxed italic mb-8">
                "Raihsuite HRMS cut down our payroll processing time by over 40% in our first month. The employee self-service module has transformed how our team manages time tracking and leave approvals. The interface is intuitive and fast."
              </p>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Aisha Rahman</h4>
                <p className="text-purple-600 text-xs font-semibold hidden">COO, Santhwanam Healthcare Group</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 bg-[#fbfbfe] hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 flex flex-col justify-between">
              <p className="text-gray-700 text-sm leading-relaxed italic mb-8">
                "Consolidating our CRM, sales pipelines, and physical asset trackers under one login has given our leadership complete visibility over our regional supply chains. The analytics panels are clean, fast, and highly reliable."
              </p>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Marcus Thorne</h4>
                <p className="text-purple-600 text-xs font-semibold hidden">Director of Operations, Paneuro Logistics</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 bg-[#fbfbfe] hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 flex flex-col justify-between">
              <p className="text-gray-700 text-sm leading-relaxed italic mb-8">
                "We deployed the Event Management module to coordinate ticketing, seating layouts, and instant entry scanning for our recent live concert series. The app scanned thousands of tickets smoothly without a single hiccup."
              </p>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Elena Rivers</h4>
                <p className="text-purple-600 text-xs font-semibold hidden">Founder, Ikigai Creative Hub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 sm:py-32 bg-[#0b061a] border-t border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="container-base mx-auto px-6 max-w-4xl relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur">
              FAQ
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Questions</span>
            </h2>
            <p className="mt-4 text-white/60 text-base max-w-xl mx-auto">
              Got questions about Raihsuite ERP? Here are detailed answers to help you understand how our platform fits your needs.
            </p>
          </div>

          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* LATEST FROM OUR BLOG */}
      <section className="py-20 sm:py-28 bg-[#0b061a]">
        <div className="container-base mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs sm:text-sm backdrop-blur mb-4">
              <span className="bg-purple-600 text-[10px] sm:text-xs px-2 py-1 rounded-full">Blog</span>
              Insights &amp; Guides
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Latest from Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Blog</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-lg mx-auto">
              Expert articles on ERP, business management, and modern team productivity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getLatestPosts(3).map((post) => (
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
                <h3 className="text-lg font-bold mb-3 group-hover:text-purple-300 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.description}
                </p>
                <span className="text-purple-400 text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 font-medium"
            >
              View All Articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-gradient-to-r from-[#1a0b3d] to-[#2b0f66] animate-fade-in">
        <div className="container-base mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          <div className="animate-slide-in-left text-center lg:text-left flex flex-col items-center lg:items-start">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up leading-tight">
              Ready to Modernize Your Operations?
            </h2>
            <p className="text-white/70 text-lg sm:text-xl mb-8 animate-slide-up animate-stagger-1 max-w-xl">
              See how Raihsuite can eliminate manual friction, reduce overhead, and provide the real-time clarity your leadership team needs to scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animate-stagger-2">
              <a href="/contact" className="bg-white text-black px-10 py-5 rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow inline-block text-center font-bold">
                Schedule Your Technical Demo
              </a>
            </div>
            <p className="mt-8 text-sm text-white/50 animate-slide-up animate-stagger-3 max-w-md">
              Speak directly with a solutions architect. No high-pressure sales scripts—just a straight look at the platform tailored to your specific workflow requirements.
            </p>
          </div>

          <div className="animate-slide-in-right flex justify-center">
            <img
              src="https://media.raihsuite.com/RS0001/web/original-7d8eb6bcb45c0d53f109bddc510ff04e.webp"
              alt="Raihsuite ERP dashboard interface showing business analytics and management tools"
              loading="lazy"
              className="rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 animate-float w-full max-w-xl lg:max-w-2xl h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
