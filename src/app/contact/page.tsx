export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-red-800 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-red-700">
            Have questions? We're here to help! Reach out to us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg p-8 border-2 border-red-200">
            <h2 className="text-2xl font-bold text-red-800 mb-6">
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Subject
                </label>
                <select className="w-full px-3 py-2 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Product Question</option>
                  <option>Shipping Issue</option>
                  <option>Return/Exchange</option>
                  <option>Partner Program</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-800 transition-colors font-semibold border-2 border-red-800 shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-8 border-2 border-green-200">
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-green-800">Email</h3>
                  <p className="text-green-700">support@whysocheap.com</p>
                  <p className="text-sm text-green-600">We'll respond within 24 hours</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-800">Live Chat</h3>
                  <p className="text-green-700">Available 9 AM - 6 PM EST</p>
                  <p className="text-sm text-green-600">Monday through Friday</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-800">Phone</h3>
                  <p className="text-green-700">+1 (555) 123-4567</p>
                  <p className="text-sm text-green-600">Mon-Fri 9 AM - 6 PM EST</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg p-8 border-2 border-red-200">
              <h2 className="text-2xl font-bold text-red-800 mb-6">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">
                    How long does shipping take?
                  </h3>
                  <p className="text-red-700 text-sm">
                    Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">
                    What's your return policy?
                  </h3>
                  <p className="text-red-700 text-sm">
                    We offer a 30-day return policy for unused items in original packaging.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">
                    Do you ship internationally?
                  </h3>
                  <p className="text-red-700 text-sm">
                    Yes! We ship worldwide. International shipping rates vary by location.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">
                    How do I track my order?
                  </h3>
                  <p className="text-red-700 text-sm">
                    You'll receive a tracking number via email once your order ships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
