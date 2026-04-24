import Button from '@/components/ui/Button';

export default function HRMSPage() {
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
            HR & Payroll Solution
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-slide-up">
            Human Resource <span className="text-brand-light">Management</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-stagger-1">
            Manage your workforce efficiently with centralized employee records, attendance tracking, and comprehensive HR operations.
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
              Everything you need to build a world-class team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Employee Management",
                description: "Centralized employee database with complete profiles, contact information, and employment history.",
                features: ["Employee profiles", "Document management", "Employment history", "Skills tracking"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                )
              },
              {
                title: "Attendance Tracking",
                description: "Real-time attendance monitoring with leave management and shift scheduling.",
                features: ["Daily attendance", "Leave management", "Shift scheduling", "Time tracking"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Performance & Records",
                description: "Track employee performance with evaluations, reviews, and development plans.",
                features: ["Performance reviews", "Goal setting", "Development plans", "Evaluations"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.5 4.5L21.75 7M21.75 7V12.75M21.75 7H16.125" />
                  </svg>
                )
              },
              {
                title: "Payroll Processing",
                description: "Automated payroll with salary calculations, deductions, and tax compliance.",
                features: ["Salary calculations", "Tax management", "Deductions", "Pay slips"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                )
              },
              {
                title: "Leave Management",
                description: "Streamlined leave requests and approvals with balance tracking.",
                features: ["Leave requests", "Approval workflow", "Balance tracking", "Accrual management"],
                icon: (
                  <svg className="w-6 h-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                  </svg>
                )
              },
              {
                title: "Reports & Analytics",
                description: "Comprehensive HR analytics and reporting for better decision-making.",
                features: ["Headcount reports", "Turnover analysis", "Compliance reports", "Custom reports"],
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why HR Teams Love RaihSuite</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
            {[
              { title: "Improved Efficiency", desc: "Automate HR processes and reduce manual work by 70%" },
              { title: "Better Compliance", desc: "Stay compliant with labor laws and regulations automatically" },
              { title: "Enhanced Visibility", desc: "Real-time insights into workforce metrics and trends" },
              { title: "Employee Satisfaction", desc: "Self-service portal for employees to manage their own data" },
              { title: "Data Security", desc: "Bank-grade encryption for sensitive employee information" },
              { title: "Scalability", desc: "Grow from 10 to 10,000 employees without changing systems" },
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
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Transform Your HR?</h2>
          <p className="text-xl text-gray-500 mb-10">
            Join thousands of companies building better workplaces with RaihSuite HRMS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              className="!px-10 !py-4 !text-lg !rounded-full shadow-xl shadow-brand-light/30"
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
