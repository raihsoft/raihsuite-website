export default function OrderManagementPage() {
  return (
    <div className="bg-[#0b061a] text-white">
      {/* HEADER */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl"></span>
            <h1 className="text-5xl font-bold">Order Management</h1>
          </div>
          <p className="text-xl text-white/70 max-w-2xl">
            Simplify your order workflow from creation to fulfillment with complete process automation.
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
                title: "Order Tracking",
                description: "Real-time tracking of orders from creation through delivery.",
                features: ["Order creation", "Tracking updates", "Status visibility", "Customer notifications"],
              },
              {
                title: "Status Monitoring",
                description: "Monitor order status at every stage of the fulfillment process.",
                features: ["Real-time status", "Progress tracking", "Alert management", "Bottleneck detection"],
              },
              {
                title: "Process Automation",
                description: "Automate order workflows to reduce manual work and errors.",
                features: ["Workflow automation", "Auto-routing", "Rule engine", "Process optimization"],
              },
              {
                title: "Inventory Integration",
                description: "Seamless integration with inventory for accurate stock management.",
                features: ["Stock checking", "Auto-allocation", "Inventory sync", "Stock forecasting"],
              },
              {
                title: "Payment Processing",
                description: "Secure payment processing with multiple payment methods.",
                features: ["Multiple gateways", "Payment tracking", "Reconciliation", "Refund management"],
              },
              {
                title: "Shipping Management",
                description: "Integrated shipping with carrier management and label generation.",
                features: ["Carrier integration", "Label printing", "Tracking", "Rate comparison"],
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
              { title: "Faster Fulfillment", desc: "Reduce order-to-delivery time by 50% with automation" },
              { title: "Fewer Errors", desc: "Minimize shipping and fulfillment errors significantly" },
              { title: "Better Customer Experience", desc: "Keep customers informed with real-time updates" },
              { title: "Reduced Costs", desc: "Lower operational costs through process efficiency" },
              { title: "Improved Visibility", desc: "Complete end-to-end order visibility and control" },
              { title: "Scalability", desc: "Handle higher order volumes without additional resources" },
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
          <h2 className="text-4xl font-bold mb-6">Streamline Your Order Process</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Start your free 14-day trial of RaihSuite Order Management today.
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105">
            Get 14 Days Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
