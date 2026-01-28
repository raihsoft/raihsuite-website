export default function AboutPage() {
  return (
    <div className="bg-[#0b061a] text-white">
      {/* HEADER */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">About RaihSuite</h1>
          <p className="text-xl text-white/70 max-w-2xl">
            Empowering businesses with intelligent, integrated business management solutions.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                At RaihSuite, we believe that every business deserves access to world-class enterprise resource planning (ERP) solutions. Our mission is to empower organizations of all sizes with intelligent, integrated business management tools that drive growth, improve efficiency, and enable data-driven decision-making.
              </p>
              <p className="text-lg text-gray-700">
                We're committed to simplifying complex business operations and making powerful enterprise software accessible to everyone.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-12 text-center">
              <div className="text-6xl font-bold text-purple-600 mb-4">🎯</div>
              <p className="text-gray-700 font-semibold">Simplifying Business Operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-12 text-center">
              <div className="text-6xl font-bold text-purple-600 mb-4">💡</div>
              <p className="text-gray-700 font-semibold">Innovation in Every Feature</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 mb-4">
                We envision a future where businesses of any size can leverage cutting-edge enterprise technology without complexity or excessive cost. RaihSuite is building that future by creating integrated solutions that connect all aspects of business operations.
              </p>
              <p className="text-lg text-gray-700">
                Our vision is to become the most trusted and user-friendly ERP platform globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Innovation",
                description: "We constantly innovate to deliver cutting-edge solutions that meet evolving business needs.",
                icon: "💻",
              },
              {
                title: "Integrity",
                description: "We operate with transparency and honesty in all our dealings with customers and partners.",
                icon: "🤝",
              },
              {
                title: "Customer Focus",
                description: "Our customers' success is our success. We're dedicated to delivering exceptional value.",
                icon: "👥",
              },
              {
                title: "Excellence",
                description: "We're committed to excellence in every aspect of our product, service, and support.",
                icon: "⭐",
              },
              {
                title: "Scalability",
                description: "Our solutions grow with your business, supporting expansion and new opportunities.",
                icon: "📈",
              },
              {
                title: "Security",
                description: "Your data security and privacy are paramount. We implement industry-leading protections.",
                icon: "🔒",
              },
              {
                title: "Collaboration",
                description: "We work as partners with our customers to achieve their business objectives.",
                icon: "🌟",
              },
              {
                title: "Continuous Improvement",
                description: "We're always improving, learning, and adapting to serve you better.",
                icon: "🚀",
              },
            ].map((value) => (
              <div key={value.title} className="p-6 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Why Choose RaihSuite?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "All-in-One Platform",
                points: [
                  "Integrated HR, CRM, Finance, and more",
                  "Single source of truth for business data",
                  "Seamless module integration",
                  "Reduce tool sprawl and costs",
                ],
              },
              {
                title: "User-Friendly Design",
                points: [
                  "Intuitive interface that's easy to learn",
                  "Minimal training required",
                  "Mobile-responsive design",
                  "Accessible from anywhere",
                ],
              },
              {
                title: "Powerful Analytics",
                points: [
                  "Real-time dashboards and insights",
                  "Data-driven decision making",
                  "Predictive analytics",
                  "Custom reporting",
                ],
              },
              {
                title: "Scalable & Secure",
                points: [
                  "Grows with your business",
                  "Enterprise-grade security",
                  "99.9% uptime guarantee",
                  "Compliance-ready",
                ],
              },
            ].map((item) => (
              <div key={item.title} className="p-8 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-purple-600">{item.title}</h3>
                <ul className="space-y-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold mt-1">✓</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 bg-gradient-to-r from-[#1a0b3d] to-[#2b0f66] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Users", value: "10,000+" },
              { label: "Countries", value: "50+" },
              { label: "Businesses Served", value: "2,000+" },
              { label: "Years of Innovation", value: "5+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-purple-300 mb-2">{stat.value}</p>
                <p className="text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Thousands of Businesses</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Experience the power of integrated business management with RaihSuite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 text-white px-10 py-4 rounded-full font-semibold hover:bg-purple-700 transition-all duration-300 hover:scale-105">
              Get 14 Days Free Trial
            </button>
            <button className="border border-purple-600 text-purple-600 px-10 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
