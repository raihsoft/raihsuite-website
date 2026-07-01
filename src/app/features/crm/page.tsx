import Button from '@/components/ui/Button';

export default function CRMPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* 
        HERO SECTION 
      */}
      <section className="relative overflow-hidden bg-[#0F0A1F] text-white py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2a1255] via-[#0F0A1F] to-[#120826] opacity-80" />
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-brand-light rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-brand-dark rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="relative container-base mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-light text-[10px] sm:text-sm font-medium border border-white/10 backdrop-blur mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            Sales & Customer Success
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-slide-up">
            Customer <span className="text-brand-light">Relationship</span> Management
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-stagger-1">
            Strengthen customer relationships and manage leads effectively with centralized CRM tools.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-stagger-2">
            <Button
              variant="primary"
              className="!px-8 !py-4 !text-lg !rounded-full shadow-xl shadow-brand-light/20 w-full sm:w-auto"
              href="/contact"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* 
        CORE FEATURES 
      */}
      <section id="features" className="py-24 sm:py-32 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Core Features</h2>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
              Everything you need to close more deals and keep customers happy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Enquiry Management",
                description: "Track and manage all customer enquiries from receipt to resolution.",
                features: ["Enquiry tracking", "Auto-assignment", "Priority management", "Response tracking"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                )
              },
              {
                title: "Lead Tracking",
                description: "Manage sales leads through the entire pipeline with automated workflows.",
                features: ["Lead capture", "Lead scoring", "Pipeline management", "Conversion tracking"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38c-3.158 0-5.744-2.457-5.97-5.592c.15.02.302.03.456.03a6.002 6.002 0 005.514-3.61c.42.062.85.1 1.286.1c3.2 0 5.8-2.6 6.1-5.78a5.992 5.992 0 01.354 11.472zM12 9.75c1.657 0 3-1.343 3-3s-1.343-3-3-3s-3 1.343-3 3s1.343 3 3 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75l.01.011m-.01.011l.011-.011m-.011.011l-.011.011" />
                  </svg>
                )
              },
              {
                title: "Customer Follow-ups",
                description: "Automated reminders and follow-up scheduling for better engagement.",
                features: ["Follow-up scheduling", "Automated reminders", "Communication history", "Task management"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Contact Management",
                description: "Centralized customer database with complete contact and relationship history.",
                features: ["Contact profiles", "Communication log", "Interaction history", "Document storage"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )
              },
              {
                title: "Sales Pipeline",
                description: "Visual pipeline management with deal tracking and forecasting.",
                features: ["Pipeline visualization", "Deal tracking", "Sales forecasting", "Win/loss analysis"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0v1.125c0 .621.504 1.125 1.125 1.125H9.75M3.75 3h1.5m1.5 0v1.125c0 .621.504 1.125 1.125 1.125H9.75m4.875-1.125a1.125 1.125 0 011.125-1.125h3.375a1.125 1.125 0 011.125 1.125V21M3.375 21h17.25c.621 0 1.125-.504 1.125-1.125v-1.125c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.125c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                )
              },
              {
                title: "Reports & Analytics",
                description: "Comprehensive CRM analytics for sales performance and customer insights.",
                features: ["Sales reports", "Pipeline analysis", "Customer metrics", "Performance tracking"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                )
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-100 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-gray-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-brand-dark transition-colors">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-3 pt-6 border-t border-gray-100">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-light"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        BENEFITS 
      */}
      <section className="py-24 sm:py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-light blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-dark blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Sales Teams Choose Raihsuite</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
            {[
              { title: "Increased Sales", desc: "Boost conversion rates by 40% with better lead management" },
              { title: "Better Customer Insight", desc: "Complete 360-degree view of each customer" },
              { title: "Faster Response Times", desc: "Automated workflows and reminders improve response speed" },
              { title: "Team Collaboration", desc: "Enable seamless team collaboration on customer accounts" },
              { title: "Data-Driven Decisions", desc: "Advanced analytics for informed business decisions" },
              { title: "Customer Retention", desc: "Improve customer satisfaction and lifetime value" },
            ].map((benefit) => (
              <div key={benefit.title} className="flex gap-6 p-6 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-12 h-12 bg-brand-dark/50 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-light border border-brand-light/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        CTA 
      */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">Ready to Boost Your Sales?</h2>
          <p className="text-lg sm:text-xl text-gray-500 mb-10">
            Join thousands of sales teams winning with Raihsuite CRM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              className="!px-10 !py-4 !text-lg !rounded-full shadow-xl shadow-brand-light/30 w-full sm:w-auto"
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
