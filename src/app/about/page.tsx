export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eae4df' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 mb-6">
            <span className="text-sm font-medium" style={{ color: '#851A1B' }}>CHRISTMAS SPECIAL - LIMITED TIME</span>
          </div> */}
          <h1 className="text-4xl font-light mb-6" style={{ color: '#851A1B' }}>
            About WhySoCheap
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We're passionate about bringing fans closer to their favorite celebrities through authentic, high-quality merchandise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-gray-300 p-8 relative">
            <h2 className="text-2xl font-light mb-4" style={{ color: '#851A1B' }}>
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At WhySoCheap, we believe that fandom is more than just admiration—it's a way of life. 
              Our mission is to provide fans worldwide with high-quality, authentic merchandise 
              that lets them express their love for their favorite celebrities.
            </p>
            <p className="text-gray-700 leading-relaxed">
            We're committed to delivering exceptional products that meet the highest standards of quality, comfort, and design, ensuring that every fan can wear their passion with pride.
            </p>
          </div>
          
          <div className="bg-white border border-gray-300 p-8 relative">
            <h2 className="text-2xl font-light mb-4" style={{ color: '#851A1B' }}>
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Founded in 2024 by a group of passionate K-pop fans, WhySoCheap began with one goal: to make authentic, official celebrity merchandise more affordable and accessible to the fan community worldwide.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, what started as a small project has grown into a global platform serving fans worldwide, trusted by thousands of fans who choose us for our commitment to quality, authenticity, and exceptional customer service.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-10 mb-16">
          <h2 className="text-2xl font-light mb-8 text-center" style={{ color: '#851A1B' }}>
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#851A1B' }}>Verified Authenticity</h3>
              <p className="text-gray-600 text-sm">
                All products are sourced from certified suppliers and official distributors, ensuring 100% authenticity and quality.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#851A1B' }}>Free Shipping</h3>
              <p className="text-gray-600 text-sm">
            Enjoy free shipping across the US with delivery in 7 days, EU customers pay only $3 with 14-day delivery guarantee, while the rest of the world benefits from a flat $5 rate with delivery within 30 days.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2" style={{ color: '#851A1B' }}>Fan Community</h3>
              <p className="text-gray-600 text-sm">
                Join thousands of fans worldwide who trust us for their idol merchandise
              </p>
            </div>
          </div>
        </div>

        {/* <div className="text-center bg-white border border-gray-300 p-10">
          <h2 className="text-2xl font-light mb-6" style={{ color: '#851A1B' }}>
            Join Our Community
          </h2>
          <p className="text-gray-700 mb-8">
            Follow us on social media to stay updated on new designs, exclusive offers, and fan events.
          </p>
          <div className="flex justify-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 text-lg transition-colors">Instagram</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-lg transition-colors">Twitter</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-lg transition-colors">Facebook</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-lg transition-colors">TikTok</a>
          </div>
        </div> */}
      </div>
    </div>
  )
}
