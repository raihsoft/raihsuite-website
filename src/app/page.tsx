import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="bg-[#0b061a] text-white">
      
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826] animate-fade-in" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT */}
          <div className="animate-slide-in-left">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm backdrop-blur animate-float">
              <span className="bg-purple-600 text-xs px-2 py-1 rounded-full animate-pulse-glow">New</span>
              Raihsuite Release 
            </span>

            <h1 className="mt-8 text-5xl lg:text-6xl font-bold leading-tight animate-slide-up animate-stagger-1">
              Supercharge Your <br />
              Workflow with <span className="text-purple-400">Raihsuite</span>
            </h1>

            <p className="mt-6 text-lg text-white/70 max-w-xl animate-slide-up animate-stagger-2">
              A powerful ERP platform to manage operations, finance, HR, and analytics —
              beautifully designed for modern teams.
            </p>

            <div className="mt-10 flex gap-6 animate-slide-up animate-stagger-3">
              <button className="bg-black text-white px-8 py-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Get 14 Days Free Trial
              </button>
              <button className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Book a Demo
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative animate-slide-in-right">
            <div className="absolute inset-0 bg-purple-600/30 blur-3xl rounded-full animate-pulse" />
            <img
              src="https://media.raihsuite.com/RS0001/web/original-7d8eb6bcb45c0d53f109bddc510ff04e.webp"
              alt="Dashboard"
              className="relative w-full max-w-2xl h-auto rounded-3xl shadow-2xl border border-white/10 hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="bg-white text-black py-16 animate-fade-in">
        <div className="text-center text-gray-500 mb-10 animate-slide-up">
          Trusted by 10,000+ founders & business owners.
        </div>

        <div className="flex flex-wrap justify-center gap-10 opacity-60">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`w-24 h-8 bg-gray-300 rounded hover:bg-purple-100 transition-all duration-300 hover:scale-110 animate-scale-in`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white text-black py-24 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm animate-scale-in">
              Features
            </span>
            <h2 className="mt-6 text-4xl font-bold animate-slide-up animate-stagger-1">
              Everything You Need to Work Smarter
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              "Inventory Management",
              "Finance & Accounting",
              "Human Resources",
            ].map((title, index) => (
              <div
                key={title}
                className={`p-8 rounded-3xl border border-gray-200 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-500 hover:scale-105 hover:border-purple-200 animate-scale-in`}
                style={{ animationDelay: `${(index + 1) * 0.2}s` }}
              >
                <div className="w-12 h-12 bg-purple-600 rounded-xl mb-6 animate-float" />
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-600">
                  Powerful tools designed to simplify complex operations and improve performance.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-gradient-to-r from-[#1a0b3d] to-[#2b0f66] animate-fade-in">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-12">
          
          <div className="animate-slide-in-left">
            <h2 className="text-5xl font-bold mb-6 animate-slide-up">
              Get Started with RaihSuite Today
            </h2>
            <p className="text-white/70 mb-8 animate-slide-up animate-stagger-1">
              Start your free 14-day trial — no credit card required.
            </p>
            <button className="bg-black text-white px-10 py-5 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow">
              Get 14 Days Free Trial
            </button>
          </div>

          <div className="animate-slide-in-right">
            <img
              src="https://media.raihsuite.com/RS0001/web/original-7d8eb6bcb45c0d53f109bddc510ff04e.webp"
              className="rounded-3xl shadow-2xl border border-white/10 hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 animate-float"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
