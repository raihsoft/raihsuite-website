import { type ReactNode } from "react";
import Button from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* 
        HERO SECTION 
        Modern deep gradient with noise or subtle pattern texturing (simulated via gradient)
      */}
      <section className="relative overflow-hidden bg-[#0F0A1F] text-white py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2a1255] via-[#0F0A1F] to-[#120826] opacity-80" />
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-light rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-brand-dark rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="relative container-base mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-slide-up">
            About <span className="text-brand-light">Raihsuite</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-stagger-1">
            Empowering organizations with intelligent, integrated business management tools that drive growth and efficiency.
          </p>
        </div>
      </section>

      {/* 
        STATS / TRUST SECTION
        Clean bar to establish credibility immediately
      */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Users", value: "10k+" },
              { label: "Countries", value: "50+" },
              { label: "Businesses", value: "2k+" },
              { label: "Years", value: "5+" },
            ].map((stat, i) => (
              <div key={stat.label} className={`p-4 ${i !== 0 ? 'md:border-l border-gray-100' : ''}`}>
                <div className="text-3xl md:text-4xl font-bold text-brand-dark mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        MISSION & VISION 
        Split layout for better readability
      */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mission */}
            <div className="space-y-6 animate-slide-in-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-brand-dark text-sm font-semibold">
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Simplifying Complex Business Operations
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that every business deserves access to world-class enterprise resource planning (ERP) solutions.
                Our mission is to democratize access to intelligent tools that typically only large corporations could afford.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                By connecting finance, CRM, and HR into one seamless platform, we help you focus on what matters most — growing your business.
              </p>
            </div>

            {/* Visual/Card for Mission */}
            <div className="relative bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 animate-scale-in">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-light rounded-full opacity-20 blur-xl"></div>
              <h3 className="text-2xl font-bold mb-4 text-brand-dark">The Future is Integrated</h3>
              <p className="text-gray-600 mb-6">
                "RaihSuite isn't just software; it's the engine that powers modern enterprises."
              </p>
              <blockquote className="border-l-4 border-brand-light pl-4 py-2 italic text-gray-500">
                — CEO & Founder
              </blockquote>
            </div>
          </div>

          <div className="mt-24 grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual/Card for Vision */}
            <div className="order-2 lg:order-1 bg-gradient-to-br from-[#2a1255] to-[#0F0A1F] text-white p-8 md:p-12 rounded-2xl shadow-xl animate-scale-in">
              <div className="text-brand-light mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 3.391a22.5 22.5 0 011.208 4.33l.818.817a2.316 2.316 0 011.522 1.348l1.102 3.634a1.125 1.125 0 01-1.012 1.432h-1.071l-1.053 3.51a1.125 1.125 0 01-1.123.789H9.301a1.125 1.125 0 01-1.122-.79l-1.054-3.51H6.054a1.125 1.125 0 01-1.012-1.432l1.102-3.634a2.316 2.316 0 011.522-1.348l.818-.817a22.5 22.5 0 011.208-4.33c.125-.363.457-.61.841-.61h4.214c.384 0 .716.247.841.61zM10.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6.75 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Innovation First</h3>
              <p className="text-purple-200">
                We envision a world where technology adapts to businesses, not the other way around.
                Our platform evolves daily to meet new challenges.
              </p>
            </div>

            {/* Vision */}
            <div className="order-1 lg:order-2 space-y-6 animate-slide-in-right">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                Our Vision
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Building the Operating System for Business
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We envision a future where businesses of any size can leverage cutting-edge enterprise technology without complexity.
                RaihSuite creates integrated solutions that act as the central nervous system of your organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        CORE VALUES 
        Grid cards
      */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Core Values</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            The principles that guide every feature we build and every interaction we have.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Innovation",
              desc: "Pushing boundaries to deliver cutting-edge solutions.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              color: "bg-blue-50 text-blue-600",
            },
            {
              title: "Integrity",
              desc: "Transparent and honest in all our dealings.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              color: "bg-green-50 text-green-600",
            },
            {
              title: "Customer Focus",
              desc: "Your success is our obsession.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
              color: "bg-purple-50 text-purple-600",
            },
            {
              title: "Excellence",
              desc: "We don't settle for anything less than the best.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              ),
              color: "bg-orange-50 text-orange-600",
            },
            {
              title: "Scalability",
              desc: "Solutions that grow as you grow.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.5 4.5L21.75 7M21.75 7V12.75M21.75 7H16.125" />
                </svg>
              ),
              color: "bg-indigo-50 text-indigo-600",
            },
            {
              title: "Security",
              desc: "Iron-clad protection for your data.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              ),
              color: "bg-red-50 text-red-600",
            },
            {
              title: "Collaboration",
              desc: "Partnering with you for mutual success.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              ),
              color: "bg-orange-50 text-orange-600",
            },
            {
              title: "Improvement",
              desc: "Always learning, always adapting.",
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              ),
              color: "bg-teal-50 text-teal-600",
            },
          ].map((value) => (
            <div
              key={value.title}
              className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-brand-dark transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 
        WHY CHOOSE 
        Feature blocks
      */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-dark opacity-20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-light opacity-20 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Industry Leaders Choose RaihSuite</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "All-in-One Platform",
                points: ["Integrated HR, CRM, Finance", "Single Source of Truth", "Seamless Modules"],
              },
              {
                title: "User-Friendly Design",
                points: ["Minimal Training Required", "Intuitive Interface", "Mobile Ready"],
              },
              {
                title: "Powerful Analytics",
                points: ["Real-time Dashboards", "Predictive Insights", "Custom Reports"],
              },
              {
                title: "Scalable & Secure",
                points: ["Enterprise Security", "99.9% Uptime", "Compliance Ready"],
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <h3 className="text-2xl font-semibold mb-6 text-brand-light">{item.title}</h3>
                <ul className="space-y-4">
                  {item.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-gray-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        CTA SECTION
      */}
      <section className="py-32 bg-white text-center relative">
        <div className="container-base">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Join thousands of businesses that trust RaihSuite for their daily operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              className="!px-10 !py-4 !text-lg !rounded-full shadow-xl shadow-brand-light/30 hover:shadow-brand-light/40 hover:-translate-y-1 transition-all"
              href="/contact"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
