export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-red-800 mb-6">
            About WhySoCheap
          </h1>
          <p className="text-xl text-red-700 max-w-3xl mx-auto">
            We're passionate about bringing fans closer to their favorite idols through premium quality merchandise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl border-2 border-red-200 p-6">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Our Mission
            </h2>
            <p className="text-red-700 leading-relaxed mb-6">
              At WhySoCheap, we believe that fandom is more than just admiration—it's a way of life. 
              Our mission is to provide fans worldwide with high-quality, officially-inspired merchandise 
              that lets them express their love for their favorite K-pop idols, actors, and singers.
            </p>
            <p className="text-red-700 leading-relaxed">
              We're committed to delivering exceptional products that meet the highest standards of 
              quality, comfort, and design, ensuring that every fan can wear their passion with pride.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-200 p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Our Story
            </h2>
            <p className="text-green-700 leading-relaxed mb-6">
              Founded in 2024 by a group of passionate K-pop fans, WhySoCheap began as a small 
              project to create better quality merchandise for the fan community. What started 
              as a personal passion quickly grew into a global platform serving fans worldwide.
            </p>
            <p className="text-green-700 leading-relaxed">
              Today, we're proud to be trusted by thousands of fans who choose us for our 
              commitment to quality, authenticity, and exceptional customer service.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white via-red-50 to-green-50 rounded-2xl shadow-lg p-8 mb-16 border-4 border-red-300">
          <h2 className="text-2xl font-bold text-red-800 mb-8 text-center">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-xl p-6 border-2 border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Premium Quality</h3>
              <p className="text-red-700">
                100% organic cotton with high-quality screen printing that lasts wash after wash
              </p>
            </div>
            
            <div className="text-center bg-white rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Fast Shipping</h3>
              <p className="text-green-700">
                Free shipping on orders over $50. Express delivery available worldwide
              </p>
            </div>
            
            <div className="text-center bg-white rounded-xl p-6 border-2 border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Fan Community</h3>
              <p className="text-red-700">
                Join thousands of fans worldwide who trust us for their idol merchandise
              </p>
            </div>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-red-600 to-green-600 rounded-2xl p-8 text-white border-4 border-yellow-300">
          <h2 className="text-2xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-yellow-100 mb-8">
            Follow us on social media to stay updated on new designs, exclusive offers, and fan events.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-yellow-200 hover:text-yellow-300 text-lg transition-colors">Instagram</a>
            <a href="#" className="text-yellow-200 hover:text-yellow-300 text-lg transition-colors">Twitter</a>
            <a href="#" className="text-yellow-200 hover:text-yellow-300 text-lg transition-colors">Facebook</a>
            <a href="#" className="text-yellow-200 hover:text-yellow-300 text-lg transition-colors">TikTok</a>
          </div>
        </div>
      </div>
    </div>
  )
}
