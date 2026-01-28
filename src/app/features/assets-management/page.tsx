export default function AssetsManagementPage() {
  return (
    <div className="bg-[#0b061a] text-white">
      {/* HEADER */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl"></span>
            <h1 className="text-5xl font-bold">Assets Management</h1>
          </div>
          <p className="text-xl text-white/70 max-w-2xl">
            Track and control all company assets with complete visibility and comprehensive asset lifecycle management.
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
                title: "Asset Types",
                description: "Categorize assets by type for better organization and management.",
                features: ["Type definitions", "Custom fields", "Classification", "Hierarchical grouping"],
              },
              {
                title: "Asset Records",
                description: "Maintain detailed records of every asset with complete lifecycle tracking.",
                features: ["Asset profiles", "Acquisition details", "Maintenance history", "Depreciation tracking"],
              },
              {
                title: "Asset Categories",
                description: "Organize assets into logical categories for easier management.",
                features: ["Category creation", "Bulk operations", "Filtering", "Smart grouping"],
              },
              {
                title: "Asset Type Categories",
                description: "Advanced categorization with type-specific attributes and rules.",
                features: ["Advanced categorization", "Custom attributes", "Business rules", "Validation"],
              },
              {
                title: "Maintenance Management",
                description: "Schedule and track maintenance activities to extend asset life.",
                features: ["Maintenance scheduling", "Work orders", "Cost tracking", "Service history"],
              },
              {
                title: "Depreciation & Reports",
                description: "Automated depreciation calculations and comprehensive asset reporting.",
                features: ["Depreciation calculation", "Financial reports", "Audit trails", "Export capabilities"],
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
              { title: "Complete Visibility", desc: "Track all assets in real-time with accurate location and status" },
              { title: "Reduced Loss & Theft", desc: "Minimize asset loss with automated tracking and alerts" },
              { title: "Optimized Maintenance", desc: "Extend asset life through scheduled preventive maintenance" },
              { title: "Compliance Ready", desc: "Generate audit trails and compliance reports automatically" },
              { title: "Better ROI", desc: "Make data-driven decisions on asset utilization and replacement" },
              { title: "Cost Savings", desc: "Reduce operational costs through better asset management" },
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
          <h2 className="text-4xl font-bold mb-6">Take Control of Your Assets</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Start your free 14-day trial of RaihSuite Assets Management today.
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105">
            Get 14 Days Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
