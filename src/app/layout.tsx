import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raihsuite ERP - Streamline Your Business Operations",
  description:
    "Comprehensive Enterprise Resource Planning solution to manage inventory, finance, HR, and more. Boost productivity and efficiency with RaihSuite ERP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b061a] text-white">

        {/* NAVBAR */}
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg">

              {/* Logo */}
              <div className="flex items-center gap-1">
                <img
                  src="https://media.raihsuite.com/RS0001/web/Gemini_Generated_Image_lltgbilltgbilltg%20(1).png"
                  alt="RaihSuite Logo"
                  className="h-12 w-auto"
                />
                <span className="text-xl font-semibold tracking-wide">Raihsuite</span>
              </div>

              {/* Nav links */}
              <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
                <a href="#features" className="hover:text-white transition">Features</a>
                <a href="#about" className="hover:text-white transition">About</a>
                <a href="/contact" className="hover:text-white transition">Contact</a>
              </nav>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <button className="hidden sm:block bg-white text-black px-6 py-2 rounded-full text-sm hover:bg-gray-200 transition">
                  Book a Demo
                </button>

                <button className="sm:hidden text-2xl">☰</button>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="pt-32">{children}</main>

        {/* FOOTER */}
        <footer className="border-t border-white/10 mt-24">
          <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10 text-white/70">

            <div>
              <div className="flex items-center mb-4 gap-1">
                <img
                  src="https://media.raihsuite.com/RS0001/web/Gemini_Generated_Image_lltgbilltgbilltg%20(1).png"
                  alt="RaihSuite Logo"
                  className="h-8 w-auto"
                />
                <span className="text-white font-semibold text-lg">Raihsuite</span>
              </div>
              <p className="text-sm leading-relaxed">
                Powerful ERP platform to manage your business operations with modern design and efficiency.
              </p>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>Features</li>
                <li>Pricing</li>
                <li>Integrations</li>
                <li>Updates</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>

          <div className="text-center text-white/40 text-sm pb-8">
            © {new Date().getFullYear()} Raihsuite ERP. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
