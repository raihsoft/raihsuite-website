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
              A powerful ERP platform to manage operations, finance, HR, and analytics —
              beautifully designed for modern teams.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up animate-stagger-3 w-full sm:w-auto">
              <a href="/contact" className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block text-center font-bold">
                Book a Demo
              </a>
              <a href="/events/book-tickets" className="hidden bg-transparent border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg text-center font-bold">
                Book Tickets
              </a>
            </div>
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

      {/* TRUSTED BY */}
      <section className="bg-white text-black py-12 sm:py-16 animate-fade-in overflow-hidden">
        <p className="text-center text-gray-500 mb-3 animate-slide-up text-sm sm:text-base font-medium tracking-wide">
          Trusted by 500+ business owners across 12 countries
        </p>
        <p className="text-center text-gray-400 mb-10 text-xs sm:text-sm">
          Powering operations for startups, SMBs, and enterprises worldwide.
        </p>

        {/* Marquee wrapper with edge fade masks */}
        <div
          className="relative w-full"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div
            className="flex items-center gap-16 w-max"
            style={{
              animation: "marquee-logos 22s linear infinite",
            }}
          >
            {/* Render logos TWICE so the strip loops seamlessly */}
            {[...Array(2)].flatMap((_, pass) =>
              [
                { src: "https://media.raihsuite.com/RS0001/web/logos/ikigai-logoo.png", alt: "Ikigai Creative Hub logo" },
                { src: "https://media.raihsuite.com/RS0001/web/logos/logo-irshadiyya.png", alt: "Irshadiyya logo" },
                { src: "https://media.raihsuite.com/RS0001/web/logos/logo-paneuro.png", alt: "Paneuro Logistics logo" },
                { src: "https://media.raihsuite.com/RS0001/web/logos/logo-santhwanam.png", alt: "Santhwanam Healthcare Group logo" },
                { src: "https://media.raihsuite.com/RS0001/web/logos/vts-logo.jpg", alt: "VTS logo" },
                { src: "https://media.raihsuite.com/RS0001/web/logos/tarmeez-logo.png", alt: "Tarmeez logo" },
              ].map((logo, i) => (
                <img
                  key={`${pass}-${i}`}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-10 sm:h-12 w-auto object-contain opacity-100 transition-all duration-300 hover:scale-110 flex-shrink-0"
                />
              ))
            )}
          </div>
        </div>

        {/* Keyframe definition */}
        <style>{`
          @keyframes marquee-logos {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white text-black py-24 sm:py-32 animate-fade-in scroll-mt-24">
        <div className="container-base mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20 animate-slide-up">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold animate-scale-in">
              Features.
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold animate-slide-up animate-stagger-1 text-gray-900">
              Everything You Need to Work Smarter
            </h2>
            <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto animate-slide-up animate-stagger-2">
              Comprehensive tools designed to streamline your business operations and drive growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "HRMS",
                description: "Manage your workforce efficiently with centralized employee records, attendance tracking, and HR operations.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M13 16H3v-2a6 6 0 0112 0v2zm0-12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: "CRM",
                description: "Strengthen customer relationships and manage leads effectively.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                title: "Assets Management",
                description: "Track and control all company assets with complete visibility.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M7 15l-3 1.5" />
                  </svg>
                ),
              },
              {
                title: "Order Management",
                description: "Simplify your order workflow from creation to fulfillment.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
              },
              {
                title: "Event Management",
                description: "Organize, manage, and monitor events with ease.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: "Performance & Analytics",
                description: "Get real-time insights and data-driven decisions to scale faster.",
                icon: (
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
            ].map((feature, index) => {
              const featureRoutes: Record<string, string> = {
                "HRMS": "/features/hrms",
                "CRM": "/features/crm",
                "Assets Management": "/features/assets-management",
                "Order Management": "/features/order-management",
                "Event Management": "/features/event-management",
                "Performance & Analytics": "/features/analytics",
              };

              return (
                <a
                  key={feature.title}
                  href={featureRoutes[feature.title]}
                  className={`group relative p-4 rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:shadow-purple-200/30 transition-all duration-500 hover:scale-105 hover:border-purple-300 animate-scale-in overflow-hidden cursor-pointer block`}
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                >
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                  <div className="relative z-10 text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-md mb-3 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 group-hover:shadow-lg group-hover:shadow-purple-300/50 transition-all duration-500 group-hover:scale-110 mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm font-bold mb-1 group-hover:text-purple-700 transition-colors">{feature.title}</h3>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-2 inline-flex items-center gap-1 text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
                      Learn more <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Feature Highlights */}
          <div className="mt-20 grid md:grid-cols-4 gap-6 animate-slide-up animate-stagger-3">
            {[
              { label: "Improve productivity" },
              { label: "Reduce manual work" },
              { label: "Get real-time insights" },
              { label: "Scale faster" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors">                <p className="text-gray-700 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section className="bg-white text-black py-24 sm:py-32 border-t border-gray-100">
        <div className="container-base mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
              Target Audience
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Built for Teams of All Sizes &amp; Industries
            </h2>
            <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Whether you are an early-stage startup, a growing mid-sized business, or a large-scale global enterprise, Raihsuite adapts to your unique operational workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-gray-100 bg-[#fbfbfe] hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6 font-bold text-lg">S</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Small &amp; Medium Businesses</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Empower your growing business with modular systems designed to eliminate spreadsheet clutter. SMEs can seamlessly manage employee databases, simplify client tracking, handle invoicing, and coordinate team tasks without the complexity or high costs of traditional legacy enterprise solutions.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 bg-[#fbfbfe] hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6 font-bold text-lg">E</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Large Scale Enterprises</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Accelerate operations with deep customization options, robust multi-tenant role-based access controls (RBAC), and automated auditing capabilities. Our platform supports extensive database volume, customized integrations via flexible API keys, and comprehensive analytics tracking to satisfy demanding enterprise IT requirements.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 bg-[#fbfbfe] hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6 font-bold text-lg">I</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Multi-Industry Solutions</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Whether you coordinate large-scale concerts, run medical facilities, manage global logistics networks, or control complex e-commerce supply chains, Raihsuite provides modules tailored specifically to your field. Switch on the exact CRM, HRMS, inventory, or ticket booking modules you require.
              </p>
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
                <p className="text-purple-600 text-xs font-semibold">COO, Santhwanam Healthcare Group</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 bg-[#fbfbfe] hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 flex flex-col justify-between">
              <p className="text-gray-700 text-sm leading-relaxed italic mb-8">
                "Consolidating our CRM, sales pipelines, and physical asset trackers under one login has given our leadership complete visibility over our regional supply chains. The analytics panels are clean, fast, and highly reliable."
              </p>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Marcus Thorne</h4>
                <p className="text-purple-600 text-xs font-semibold">Director of Operations, Paneuro Logistics</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-gray-100 bg-[#fbfbfe] hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 flex flex-col justify-between">
              <p className="text-gray-700 text-sm leading-relaxed italic mb-8">
                "We deployed the Event Management module to coordinate ticketing, seating layouts, and instant entry scanning for our recent live concert series. The app scanned thousands of tickets smoothly without a single hiccup."
              </p>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Elena Rivers</h4>
                <p className="text-purple-600 text-xs font-semibold">Founder, Ikigai Creative Hub</p>
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
              Get Started with Raihsuite Today
            </h2>
            <p className="text-white/70 text-lg sm:text-xl mb-8 animate-slide-up animate-stagger-1 max-w-xl">
              Connect with our team to see how Raihsuite can transform your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animate-stagger-2">
              <a href="/contact" className="bg-white text-black px-10 py-5 rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow inline-block text-center font-bold">
                Book a Demo
              </a>
              <a href="/events/book-tickets" className="hidden bg-transparent border border-white/20 text-white px-10 py-5 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg text-center font-bold">
                Book Tickets
              </a>
            </div>
          </div>

          <div className="animate-slide-in-right flex justify-center">
            <img
              src="https://media.raihsuite.com/RS0001/web/original-7d8eb6bcb45c0d53f109bddc510ff04e.webp"
              alt="Raihsuite ERP dashboard interface showing business analytics and management tools"
              className="rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 animate-float w-full max-w-xl lg:max-w-2xl h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
