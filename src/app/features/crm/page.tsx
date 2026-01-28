export default function CRMPage() {
  return (
    <div className="bg-[#0b061a] text-white">
      {/* HEADER */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl"></span>
            <h1 className="text-5xl font-bold">Customer Relationship Management (CRM)</h1>
          </div>
          <p className="text-xl text-white/70 max-w-2xl">
            Strengthen customer relationships and manage leads effectively with powerful CRM tools.
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
                title: "Enquiry Management",
                description: "Track and manage all customer enquiries from receipt to resolution.",
                features: ["Enquiry tracking", "Auto-assignment", "Priority management", "Response tracking"],
              },
              {
                title: "Lead Tracking",
                description: "Manage sales leads through the entire pipeline with automated workflows.",
                features: ["Lead capture", "Lead scoring", "Pipeline management", "Conversion tracking"],
              },
              {
                title: "Customer Follow-ups",
                description: "Automated reminders and follow-up scheduling for better customer engagement.",
                features: ["Follow-up scheduling", "Automated reminders", "Communication history", "Task management"],
              },
              {
                title: "Contact Management",
                description: "Centralized customer database with complete contact and relationship history.",
                features: ["Contact profiles", "Communication log", "Interaction history", "Document storage"],
              },
              {
                title: "Sales Pipeline",
                description: "Visual pipeline management with deal tracking and forecasting.",
                features: ["Pipeline visualization", "Deal tracking", "Sales forecasting", "Win/loss analysis"],
              },
              {
                title: "Reports & Analytics",
                description: "Comprehensive CRM analytics for sales performance and customer insights.",
                features: ["Sales reports", "Pipeline analysis", "Customer metrics", "Performance tracking"],
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
              { title: "Increased Sales", desc: "Boost conversion rates by 40% with better lead management" },
              { title: "Better Customer Insight", desc: "Complete 360-degree view of each customer" },
              { title: "Faster Response Times", desc: "Automated workflows and reminders improve response speed" },
              { title: "Team Collaboration", desc: "Enable seamless team collaboration on customer accounts" },
              { title: "Data-Driven Decisions", desc: "Advanced analytics for informed business decisions" },
              { title: "Customer Retention", desc: "Improve customer satisfaction and lifetime value" },
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
          <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Sales?</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Start your free 14-day trial of RaihSuite CRM today.
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105">
            Get 14 Days Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
