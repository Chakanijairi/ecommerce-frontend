import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-100 text-gray-800">
      {/* Header */}
      <header className="fixed top-0 w-full glass-effect z-50 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-8 py-4">
          <Link to="/" className="text-3xl font-extrabold gradient-text-1 tracking-wide">
            Together by Shaw
          </Link>
          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <Link to="/#about" className="hover:gradient-text-1">About</Link>
            <Link to="/#shop" className="hover:gradient-text-2">Shop</Link>
            <Link to="/contact" className="hover:gradient-text-3">Contact Us</Link>
          </nav>
          <Link
            to="/"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover-scale"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 gradient-text-2 drop-shadow-lg">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get in touch with us. We'd love to hear from you!
            </p>
          </div>

          {/* Contact Information Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Email Card */}
            <div className="bg-white/70 glass-effect rounded-3xl p-8 shadow-xl hover-scale transition-transform">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold gradient-text-1 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Send us an email anytime</p>
              <a
                href="mailto:contact@togetherbyshaw.com"
                className="text-indigo-600 hover:underline font-medium"
              >
                contact@togetherbyshaw.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-white/70 glass-effect rounded-3xl p-8 shadow-xl hover-scale transition-transform">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold gradient-text-2 mb-2">Phone</h3>
              <p className="text-gray-600 mb-2">Call us during business hours</p>
              <a
                href="tel:+1234567890"
                className="text-purple-600 hover:underline font-medium"
              >
                +1 (234) 567-890
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-white/70 glass-effect rounded-3xl p-8 shadow-xl hover-scale transition-transform">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold gradient-text-3 mb-2">Address</h3>
              <p className="text-gray-600">
                123 Commerce Street<br />
                Pagadian City<br />
                Zamboanga del Sur<br />
                Philippines
              </p>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white/70 glass-effect rounded-3xl p-8 shadow-xl hover-scale transition-transform">
              <div className="text-4xl mb-4">🕐</div>
              <h3 className="text-xl font-bold gradient-text-1 mb-2">Business Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>

            {/* Social Media Card */}
            <div className="bg-white/70 glass-effect rounded-3xl p-8 shadow-xl hover-scale transition-transform">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold gradient-text-2 mb-2">Social Media</h3>
              <div className="flex flex-col gap-2 text-gray-600">
                <a href="#" className="hover:gradient-text-1 transition">Facebook</a>
                <a href="#" className="hover:gradient-text-2 transition">Instagram</a>
                <a href="#" className="hover:gradient-text-3 transition">Twitter</a>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white/70 glass-effect rounded-3xl p-8 shadow-xl hover-scale transition-transform">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold gradient-text-3 mb-2">Customer Support</h3>
              <p className="text-gray-600 mb-2">Need help? We're here for you</p>
              <a
                href="mailto:support@togetherbyshaw.com"
                className="text-pink-600 hover:underline font-medium"
              >
                support@togetherbyshaw.com
              </a>
            </div>
          </div>

          {/* GPS Map Section */}
          <div className="bg-white/70 glass-effect rounded-3xl p-8 shadow-xl mb-12">
            <h2 className="text-3xl font-bold gradient-text-1 mb-6 text-center">Find Us on the Map</h2>
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: "500px" }}>
              <iframe
                src="https://maps.google.com/maps?q=7.8257,123.437&hl=en&z=14&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Together by Shaw Location - Pagadian City, Philippines"
              ></iframe>
            </div>
            <p className="text-center text-gray-600 mt-4">
              Visit us at our location. We're always happy to welcome you!
            </p>
          </div>

          {/* Contact Form Section (Optional) */}
          <div className="bg-white/70 glass-effect rounded-3xl p-10 shadow-xl">
            <h2 className="text-3xl font-bold gradient-text-2 mb-6 text-center">Send Us a Message</h2>
            <form className="space-y-6 max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="6"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none"
                  placeholder="Tell us what's on your mind..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-10 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover-scale hover-glow transition"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center py-10 glass-effect border-t border-white/40">
        <p className="gradient-text-3 font-semibold">© 2025 Together by Shaw. All Rights Reserved.</p>
        <div className="flex justify-center gap-6 mt-4 text-gray-500">
          <a href="#" className="hover:gradient-text-1">Facebook</a>
          <a href="#" className="hover:gradient-text-2">Instagram</a>
          <a href="#" className="hover:gradient-text-3">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

