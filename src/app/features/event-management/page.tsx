export default function EventManagementPage() {
  return (
    <div className="bg-[#0b061a] text-white">
      {/* HEADER */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl"></span>
            <h1 className="text-5xl font-bold">Event Management</h1>
          </div>
          <p className="text-xl text-white/70 max-w-2xl">
            Organize, manage, and monitor events with ease using our comprehensive event management platform.
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
                title: "Events Management",
                description: "Create, organize, and manage events with all details in one place.",
                features: ["Event creation", "Venue management", "Budget tracking", "Timeline management"],
              },
              {
                title: "Sessions Scheduling",
                description: "Schedule multiple sessions and tracks with detailed agenda management.",
                features: ["Session creation", "Speaker assignment", "Room allocation", "Schedule optimization"],
              },
              {
                title: "Participant Management",
                description: "Manage attendees with registration, check-in, and communication tools.",
                features: ["Registration forms", "Attendee tracking", "Badging", "Email campaigns"],
              },
              {
                title: "Attendance Tracking",
                description: "Real-time attendance monitoring and reporting.",
                features: ["Check-in system", "QR codes", "Attendance reports", "Real-time updates"],
              },
              {
                title: "Fee & Payment Management",
                description: "Manage event fees, tickets, and payment processing.",
                features: ["Ticket pricing", "Payment processing", "Refund management", "Revenue tracking"],
              },
              {
                title: "Reports & Analytics",
                description: "Comprehensive event analytics and performance reporting.",
                features: ["Attendance reports", "Revenue analysis", "Feedback surveys", "Performance metrics"],
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
              { title: "Seamless Execution", desc: "Organize and execute events flawlessly from planning to close" },
              { title: "Better Engagement", desc: "Increase attendee engagement with interactive features" },
              { title: "Revenue Optimization", desc: "Maximize event revenue through smart pricing and sales" },
              { title: "Data & Insights", desc: "Gain valuable insights from attendee data and feedback" },
              { title: "Reduced Workload", desc: "Automate event operations and reduce manual work" },
              { title: "Improved Attendee Experience", desc: "Deliver memorable experiences with smooth operations" },
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
          <h2 className="text-4xl font-bold mb-6">Manage Your Events Effortlessly</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Start your free 14-day trial of RaihSuite Event Management today.
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105">
            Get 14 Days Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
