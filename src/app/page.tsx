export default function HomePage() {
  return (
    <div className="bg-[#0b061a] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826] animate-fade-in" />

        <div className="relative container-base mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="animate-slide-in-left text-center lg:text-left flex flex-col items-center lg:items-start">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs sm:text-sm backdrop-blur animate-float">
              <span className="bg-purple-600 text-[10px] sm:text-xs px-2 py-1 rounded-full animate-pulse-glow">Hey</span>
              Welcome to Raihsuite
            </span>

            <h1 className="mt-8 text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-tight animate-slide-up animate-stagger-1 max-w-2xl">
              Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Workflow</span> with <span className="text-purple-400">Raihsuite</span>
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
        <p className="text-center text-gray-500 mb-10 animate-slide-up text-sm sm:text-base font-medium tracking-wide">
          Trusted founders &amp; business owners.
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
                "https://media.raihsuite.com/RS0001/web/logos/ikigai-logoo.png",
                "https://media.raihsuite.com/RS0001/web/logos/logo-irshadiyya.png",
                "https://media.raihsuite.com/RS0001/web/logos/logo-paneuro.png",
                "https://media.raihsuite.com/RS0001/web/logos/logo-santhwanam.png",
                "https://media.raihsuite.com/RS0001/web/logos/vts-logo.jpg",
                "https://media.raihsuite.com/RS0001/web/logos/tarmeez-logo.png",
              ].map((logo, i) => (
                <img
                  key={`${pass}-${i}`}
                  src={logo}
                  alt="Client Logo"
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

      {/* CTA FINAL */}
      <section className="py-24 bg-gradient-to-r from-[#1a0b3d] to-[#2b0f66] animate-fade-in">
        <div className="container-base mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          <div className="animate-slide-in-left text-center lg:text-left flex flex-col items-center lg:items-start">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up leading-tight">
              Get Started with RaihSuite Today
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
