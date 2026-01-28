export default function HRMSPage() {
  return (
    <div className="bg-[#0b061a] text-white">
      {/* HEADER */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl"></span>
            <h1 className="text-5xl font-bold">Human Resource Management (HRMS)</h1>
          </div>
          <p className="text-xl text-white/70 max-w-2xl">
            Manage your workforce efficiently with centralized employee records, attendance tracking, and comprehensive HR operations.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Core Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Employee Management",
                description: "Centralized employee database with complete profiles, contact information, and employment history.",
                features: ["Employee profiles", "Document management", "Employment history", "Skills tracking"],
              },
              {
                title: "Attendance Tracking",
                description: "Real-time attendance monitoring with leave management and shift scheduling.",
                features: ["Daily attendance", "Leave management", "Shift scheduling", "Time tracking"],
              },
              {
                title: "Performance & Records",
                description: "Track employee performance with evaluations, reviews, and development plans.",
                features: ["Performance reviews", "Goal setting", "Development plans", "Evaluations"],
              },
              {
                title: "Payroll Processing",
                description: "Automated payroll with salary calculations, deductions, and tax compliance.",
                features: ["Salary calculations", "Tax management", "Deductions", "Pay slips"],
              },
              {
                title: "Leave Management",
                description: "Streamlined leave requests and approvals with balance tracking.",
                features: ["Leave requests", "Approval workflow", "Balance tracking", "Accrual management"],
              },
              {
                title: "Reports & Analytics",
                description: "Comprehensive HR analytics and reporting for better decision-making.",
                features: ["Headcount reports", "Turnover analysis", "Compliance reports", "Custom reports"],
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-lg hover:border-purple-300 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-2 text-purple-600">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-purple-600">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Benefits</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              { title: "Improved Efficiency", desc: "Automate HR processes and reduce manual work by 70%" },
              { title: "Better Compliance", desc: "Stay compliant with labor laws and regulations" },
              { title: "Enhanced Visibility", desc: "Real-time insights into workforce metrics and trends" },
              { title: "Employee Satisfaction", desc: "Self-service portal for employees to manage their data" },
              { title: "Data Security", desc: "Secure storage of sensitive employee information" },
              { title: "Scalability", desc: "Grow your workforce without operational complexity" },
            ].map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl text-purple-600">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1a0b3d] to-[#2b0f66]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your HR?</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Start your free 14-day trial of RaihSuite HRMS today.
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105">
            Get 14 Days Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
