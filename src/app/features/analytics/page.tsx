export default function AnalyticsPage() {
  return (
    <div className="bg-[#0b061a] text-white">
      {/* HEADER */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl"></span>
            <h1 className="text-5xl font-bold">Performance & Analytics</h1>
          </div>
          <p className="text-xl text-white/70 max-w-2xl">
            Get real-time insights and data-driven decisions with powerful analytics and business intelligence tools.
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
                title: "Real-time Dashboards",
                description: "Interactive dashboards with live data updates for instant insights.",
                features: ["Custom widgets", "Live updates", "KPI tracking", "Drill-down analysis"],
              },
              {
                title: "Sales Analytics",
                description: "Comprehensive sales metrics and performance analysis.",
                features: ["Revenue tracking", "Deal analysis", "Forecast accuracy", "Rep performance"],
              },
              {
                title: "Financial Reports",
                description: "Detailed financial reporting and accounting analytics.",
                features: ["Financial statements", "Cash flow analysis", "Budget vs actual", "Profitability analysis"],
              },
              {
                title: "HR Metrics",
                description: "Human resources analytics and workforce insights.",
                features: ["Headcount analysis", "Turnover tracking", "Payroll analysis", "Engagement metrics"],
              },
              {
                title: "Operational Analytics",
                description: "Track operational efficiency and performance metrics.",
                features: ["Process metrics", "Efficiency tracking", "Bottleneck analysis", "Cost analysis"],
              },
              {
                title: "Predictive Analytics",
                description: "AI-powered predictions for better forecasting and planning.",
                features: ["Trend forecasting", "Predictive models", "Risk analysis", "Scenario planning"],
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
              { title: "Better Decision Making", desc: "Make informed decisions with accurate, real-time data" },
              { title: "Identify Trends", desc: "Spot business trends and opportunities early" },
              { title: "Improve Performance", desc: "Track KPIs and improve business performance" },
              { title: "Risk Management", desc: "Identify and mitigate business risks proactively" },
              { title: "Competitive Advantage", desc: "Stay ahead with data-driven insights" },
              { title: "Faster Insights", desc: "Get actionable insights in minutes, not days" },
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
          <h2 className="text-4xl font-bold mb-6">Unlock Your Data Potential</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Start your free 14-day trial of RaihSuite Analytics today.
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105">
            Get 14 Days Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
