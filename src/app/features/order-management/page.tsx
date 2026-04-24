import Button from '@/components/ui/Button';

export default function OrderManagementPage() {
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
            Fulfillment & Logistics
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-slide-up">
            Order <span className="text-brand-light">Management</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-stagger-1">
            Simplify your order workflow from creation to fulfillment with complete process automation.
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
              End-to-end visibility and control over your orders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Order Tracking",
                description: "Real-time tracking of orders from creation through delivery.",
                features: ["Order creation", "Tracking updates", "Status visibility", "Customer notifications"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                )
              },
              {
                title: "Status Monitoring",
                description: "Monitor order status at every stage of the fulfillment process.",
                features: ["Real-time status", "Progress tracking", "Alert management", "Bottleneck detection"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                title: "Process Automation",
                description: "Automate order workflows to reduce manual work and errors.",
                features: ["Workflow automation", "Auto-routing", "Rule engine", "Process optimization"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0a5.999 5.999 0 01-5.999 6 5.999 5.999 0 01-6-6 5.999 5.999 0 016-5.999 5.999 5.999 0 015.999 6zm-7.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                )
              },
              {
                title: "Inventory Integration",
                description: "Seamless integration with inventory for accurate stock management.",
                features: ["Stock checking", "Auto-allocation", "Inventory sync", "Stock forecasting"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-4.5 4.5 4.5M6.75 4.5V21" />
                  </svg>
                )
              },
              {
                title: "Payment Processing",
                description: "Secure payment processing with multiple payment methods.",
                features: ["Multiple gateways", "Payment tracking", "Reconciliation", "Refund management"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                )
              },
              {
                title: "Shipping Management",
                description: "Integrated shipping with carrier management and label generation.",
                features: ["Carrier integration", "Label printing", "Tracking", "Rate comparison"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3h-2.25a1.5 1.5 0 01-1.5-1.5v-2.25h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-1.125" />
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose RaihSuite Orders?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
            {[
              { title: "Faster Fulfillment", desc: "Reduce order-to-delivery time by 50% with automation" },
              { title: "Fewer Errors", desc: "Minimize shipping and fulfillment errors significantly" },
              { title: "Better Customer Experience", desc: "Keep customers informed with real-time updates" },
              { title: "Reduced Costs", desc: "Lower operational costs through process efficiency" },
              { title: "Improved Visibility", desc: "Complete end-to-end order visibility and control" },
              { title: "Scalability", desc: "Handle higher order volumes without additional resources" },
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">Streamline Your Order Process</h2>
          <p className="text-lg sm:text-xl text-gray-500 mb-10">
            Join thousands of teams scaling their operations with RaihSuite.
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
