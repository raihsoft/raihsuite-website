import Button from '@/components/ui/Button';

export default function AssetsManagementPage() {
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
            Asset Lifecycle Management
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-slide-up">
            Assets <span className="text-brand-light">Management</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-stagger-1">
            Track and control all company assets with complete visibility and comprehensive asset lifecycle management.
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
              Complete control over your organization's physical and digital assets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Asset Types",
                description: "Categorize assets by type for better organization and management.",
                features: ["Type definitions", "Custom fields", "Classification", "Hierarchical grouping"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L10.581 3.659A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                )
              },
              {
                title: "Asset Records",
                description: "Maintain detailed records of every asset with complete lifecycle tracking.",
                features: ["Asset profiles", "Acquisition details", "Maintenance history", "Depreciation tracking"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.029.07-.044.148-.044.226v2.603c0 .35.285.635.635.635h2.603c.078 0 .155-.015.226-.044M11.35 3.836a2.25 2.25 0 012.814 2.814M11.35 3.836l-3.321 8.298a2.25 2.25 0 00-.03.07l-1.071 3.213a.75.75 0 00.948.948l3.213-1.071a2.25 2.25 0 00.07-.03l8.298-3.321a2.25 2.25 0 001.242-2.814l-.06-.15a2.25 2.25 0 00-2.814-1.242l-8.298 3.321z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75l-4.5 4.5M3 15.75h4.5M3 18.75h4.5M3 21h18M11.25 12h.008v.008h-.008V12zm0 3h.008v.008h-.008V15zm0 3h.008v.008h-.008V18z" />
                  </svg>
                )
              },
              {
                title: "Asset Categories",
                description: "Organize assets into logical categories for easier management.",
                features: ["Category creation", "Bulk operations", "Filtering", "Smart grouping"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.884 2.223V19.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V12a2.25 2.25 0 00-1.884-2.223m-16.5 0l1.286-6.428A2.25 2.25 0 014.162 1.5h15.676a2.25 2.25 0 012.21 2.048l1.285 6.428m-16.5 0h16.5" />
                  </svg>
                )
              },
              {
                title: "Advanced Categorization",
                description: "Expert-level categorization with type-specific attributes and rules.",
                features: ["Custom attributes", "Business rules", "Validation", "Taxonomy"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A4.833 4.833 0 0118 10.5c-2.485 0-4.5-2.015-4.5-4.5A4.5 4.5 0 0118 1.5c2.485 0 4.5 2.015 4.5 4.5 0 1.344-.59 2.55-1.524 3.37L21 9" />
                  </svg>
                )
              },
              {
                title: "Maintenance Management",
                description: "Schedule and track maintenance activities to extend asset life.",
                features: ["Maintenance scheduling", "Work orders", "Cost tracking", "Service history"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.423 20.242a9.25 9.25 0 01-10.744-10.744m10.744 10.744a9.25 9.25 0 0010.744-10.744m-10.744 10.744V21m0-21V3m0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5zM2.25 12h21" />
                  </svg>
                )
              },
              {
                title: "Depreciation & Reports",
                description: "Automated depreciation calculations and comprehensive asset reporting.",
                features: ["Depreciation calculation", "Financial reports", "Audit trails", "Export capabilities"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.5 4.5L21.75 7M21.75 7V12.75M21.75 7H16.125" />
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose RaihSuite Assets?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
            {[
              { title: "Complete Visibility", desc: "Track all assets in real-time with accurate location and status" },
              { title: "Reduced Loss & Theft", desc: "Minimize asset loss with automated tracking and alerts" },
              { title: "Optimized Maintenance", desc: "Extend asset life through scheduled preventive maintenance" },
              { title: "Compliance Ready", desc: "Generate audit trails and compliance reports automatically" },
              { title: "Better ROI", desc: "Make data-driven decisions on asset utilization and replacement" },
              { title: "Cost Savings", desc: "Reduce operational costs through better asset management" },
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">Take Control of Your Assets</h2>
          <p className="text-lg sm:text-xl text-gray-500 mb-10">
            Join thousands of businesses optimizing their assets with RaihSuite.
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
