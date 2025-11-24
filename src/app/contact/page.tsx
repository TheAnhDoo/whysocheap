export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eae4df' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">

          <h1 className="text-4xl font-light mb-6" style={{ color: '#851A1B' }}>
            Contact Us
          </h1>
          <p className="text-xl text-gray-700">We're here to help with your orders, product inquiries, and any other questions you may have.          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white border border-gray-300 p-8 relative">
            <h2 className="text-2xl font-light mb-6" style={{ color: '#851A1B' }}>
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors">
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
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 font-medium transition-colors"
              >
                Send Message - Get Help Now
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-300 p-8">
              <h2 className="text-2xl font-light mb-6" style={{ color: '#851A1B' }}>
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                  <div>
                  <h3 className="font-medium text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-700">support@whysocheap.site</p>
                  <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
                </div>
                
                  <div>
                  <h3 className="font-medium text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-700">Available 9 AM - 6 PM EST</p>
                  <p className="text-sm text-gray-600">Monday through Friday</p>
                </div>
                
                  {/* <div>
                  <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-700">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-600">Mon-Fri 9 AM - 6 PM EST</p>
                </div> */}
              </div>
            </div>

            <div id="faq" className="bg-white border border-gray-300 p-8">
              <h2 className="text-2xl font-light mb-6" style={{ color: '#851A1B' }}>
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>
                    How long does shipping take?
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                    <li>USA orders arrive within 7 days.</li>
                    <li>EU orders arrive within 14 days.</li>
                    <li>Worldwide orders arrive within 30 days.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>
                    Do you offer free shipping?
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                    <li>Yes! We offer free shipping for all USA orders.</li>
                    <li>Shipping to the EU is $3.</li>
                    <li>Worldwide shipping is a flat $5.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>
                    What's your return policy?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We offer a 30-day return policy for unused items in original packaging.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>
                    Do you ship internationally?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes, we ship worldwide. Delivery times vary by region.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>
                    How can I track my order?
                  </h3>
                  <p className="text-gray-600 text-sm">
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
