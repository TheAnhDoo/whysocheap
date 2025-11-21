'use client'

import Link from 'next/link'
import { ArrowRight, Star, Truck, Shield, Heart, CheckCircle, DollarSign, TrendingDown, Tag, Award } from 'lucide-react'
import { mockProduct } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [collections, setCollections] = useState<{ id: string; name: string; slug: string; count: number }[]>([])
  const [hotProducts, setHotProducts] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/collections?withCounts=true').then(r => r.json()).then(d => setCollections(d.collections || [])).catch(() => {})
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        const products = (d.products || []) as any[]
        const featured = products.filter(p => p.featured)
        setHotProducts((featured.length ? featured : products).slice(0, 6))
      })
      .catch(() => {})
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-green-700 text-white overflow-hidden">
        {/* Snow pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-10">
          {/* Top Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-800 text-sm font-semibold rounded-full mb-8 shadow-lg border-2 border-yellow-300">
              <span>FREE SHIPPING US | $5 WORLDWIDE</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400/30 border-2 border-yellow-300/50 rounded-lg mb-6 backdrop-blur-sm">
                <span className="text-sm font-medium text-yellow-100">UP TO 70% OFF RETAIL PRICES</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="block text-white mb-2">
                  Premium Celebrity
                </span>
                <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-green-300 bg-clip-text text-transparent">
                  Merchandise
                </span>
                <span className="block text-3xl lg:text-4xl text-yellow-100 mt-3 font-medium">
                  At Unbeatable Prices
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
                Official and licensed celebrity merchandise at wholesale prices. Free shipping on orders $50+ to US, $5 worldwide shipping on all other orders.
              </p>

              {/* Price Highlight */}
              <div className="bg-gradient-to-r from-yellow-400/30 to-green-500/30 backdrop-blur-sm border-2 border-yellow-300/50 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-6 h-6 text-yellow-200" />
                  <h3 className="text-xl font-bold text-white">Lowest Price Guarantee</h3>
                </div>
                <p className="text-yellow-100 text-base">
                  We source directly from manufacturers. Find a lower price? We'll match it and beat it by 5%.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-base border-2 border-red-800"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="#collections"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-yellow-300/50 hover:border-yellow-300 font-semibold rounded-lg transition-all duration-200 text-base"
                >
                  View Collections
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur-sm border-2 border-yellow-300/50 rounded-xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-yellow-300 mb-2">
                  25K+
                </div>
                <div className="text-yellow-100 text-sm font-medium">Satisfied Customers</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm border-2 border-yellow-300/50 rounded-xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-green-300 mb-2">
                  100+
                </div>
                <div className="text-yellow-100 text-sm font-medium">Artists & Brands</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm border-2 border-yellow-300/50 rounded-xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-yellow-200 mb-2">
                  500+
                </div>
                <div className="text-yellow-100 text-sm font-medium">Products Available</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm border-2 border-yellow-300/50 rounded-xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-red-300 mb-2">
                  70%
                </div>
                <div className="text-yellow-100 text-sm font-medium">Average Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-20 bg-gradient-to-b from-white to-red-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-red-800 mb-4">
              Shop by Collection
            </h2>
            <p className="text-lg text-red-700 max-w-2xl mx-auto">Browse curated collections from top artists and brands. All products at wholesale prices with guaranteed savings.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(col => (
              <a 
                key={col.id || col.name} 
                href={`/products?collection=${col.id || col.slug || col.name}`} 
                className="group relative overflow-hidden rounded-lg border-2 border-red-200 hover:border-red-500 transition-all duration-300 p-6 bg-gradient-to-br from-white to-red-50 hover:shadow-xl hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-red-800 group-hover:text-red-600 transition-colors">
                    {col.name}
                  </h3>
                  <div className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-semibold border border-green-300">
                    <span>Save 60%+</span>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-red-100 to-green-100 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="absolute top-2 right-2 text-2xl">⭐</span>
                </div>
                <p className="text-red-700 text-sm mb-4">{col.count || 0} products available</p>
                <div className="flex items-center gap-2 text-red-600 group-hover:text-red-700 font-medium text-sm">
                  <span>Browse Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Professional service, authentic products, and unbeatable prices. We're your trusted source for celebrity merchandise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-white to-red-50 rounded-lg border-2 border-red-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-red-400">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 border-2 border-green-300">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Wholesale Pricing</h3>
              <p className="text-red-700 text-sm leading-relaxed">
                Direct manufacturer sourcing means up to 70% savings compared to retail stores.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-lg border-2 border-green-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-green-400">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 border-2 border-red-300">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Affordable Shipping</h3>
              <p className="text-green-700 text-sm leading-relaxed">
                Free shipping on orders $50+ (US). Just $5 worldwide shipping for all other orders.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-lg border-2 border-yellow-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mb-4 border-2 border-yellow-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-yellow-800 mb-2">Authentic Products</h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                Licensed and official merchandise. Quality guaranteed with 30-day return policy.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-red-50 rounded-lg border-2 border-red-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-red-400">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 border-2 border-green-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Secure & Trusted</h3>
              <p className="text-red-700 text-sm leading-relaxed">
                SSL secured checkout. Trusted by 25,000+ customers worldwide with 4.7/5 rating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase (Featured Products) */}
      <section className="py-20 bg-gradient-to-b from-white to-red-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-red-800 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-red-700 max-w-2xl mx-auto">Best sellers at unbeatable prices. Quality merchandise at wholesale costs.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotProducts.map((p) => (
              <Link 
                key={p.id} 
                href={`/products/${p.id}`} 
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  {p.images && p.images.length ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-slate-300">👕</div>
                  )}
                  {p.featured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg border-2 border-yellow-300">
                      BEST SELLER
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-2 py-1 rounded text-xs font-semibold border border-yellow-300">
                    Save 60%+
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-900">${p.price}</span>
                        {p.originalPrice && (
                          <span className="text-sm text-slate-400 line-through">${p.originalPrice}</span>
                        )}
                      </div>
                      {p.originalPrice && (
                        <div className="text-xs text-emerald-600 font-semibold mt-1">
                          Save ${(p.originalPrice - p.price).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                      <span>View</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Shipping Banner */}
          <div className="mt-16 bg-gradient-to-r from-red-600 via-red-700 to-green-700 rounded-xl p-8 text-center text-white border-4 border-yellow-300 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-center gap-3 mb-3 relative z-10">
              <Truck className="w-6 h-6 text-yellow-200" />
              <h3 className="text-2xl font-bold">Affordable Shipping Worldwide</h3>
            </div>
            <p className="text-yellow-100 text-lg max-w-2xl mx-auto relative z-10">
              Free shipping on orders $50+ to US. Just $5 shipping worldwide for all other orders. Express delivery available for $2.99 extra.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Customer Reviews
            </h2>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">See what our customers say about our products and service. Over 25,000 satisfied customers worldwide.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Sarah Kim', initials: 'SK', rating: 5, comment: 'Got my BTS shirt for only $15! The quality exceeded my expectations and shipping was fast. Best deal I\'ve found online.', saved: '$25', color: 'bg-blue-500', delay: '0.1s' },
              { name: 'Mike Johnson', initials: 'MJ', rating: 5, comment: 'Blackpink merch for $12? Unbelievable prices for official merchandise. Arrived in perfect condition within 3 days.', saved: '$18', color: 'bg-indigo-500', delay: '0.2s' },
              { name: 'Emma Chen', initials: 'EC', rating: 5, comment: 'Bought 3 NewJeans designs for less than $30 total. Quality is amazing for the price. Will definitely order again.', saved: '$42', color: 'bg-purple-500', delay: '0.3s' },
              { name: 'Alex Park', initials: 'AP', rating: 5, comment: 'Fast shipping and great customer service. Prices are unbeatable. Already placed my 5th order with this store.', saved: '$60', color: 'bg-emerald-500', delay: '0.4s' },
              { name: 'Lisa Tran', initials: 'LT', rating: 5, comment: 'The quality is excellent for wholesale prices. Fabric is soft and designs are perfect. Highly recommend!', saved: '$35', color: 'bg-cyan-500', delay: '0.5s' },
              { name: 'David Kim', initials: 'DK', rating: 4, comment: 'Great quality merchandise at amazing prices. Shipping took about a week but it was worth the wait.', saved: '$28', color: 'bg-amber-500', delay: '0.6s' },
              { name: 'Maria Garcia', initials: 'MG', rating: 5, comment: 'Love all my purchases! Perfect quality and designs. The savings compared to retail stores is incredible.', saved: '$45', color: 'bg-pink-500', delay: '0.7s' },
              { name: 'James Lee', initials: 'JL', rating: 5, comment: 'Best prices online for authentic merch. Affordable shipping worldwide. Already planning my next order.', saved: '$55', color: 'bg-rose-500', delay: '0.8s' },
            ].map((review, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white to-red-50 rounded-lg border-2 border-red-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-red-400"
                style={{ animation: `fadeInUp 0.6s ease ${review.delay} both` }}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 ${review.color} rounded-lg flex items-center justify-center mr-3`}>
                    <span className="text-white font-semibold text-sm">{review.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{review.name}</h4>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Verified Purchase</span>
                  <span className="text-xs text-emerald-600 font-semibold">Saved {review.saved}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Read More Reviews
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div> */}
        </div>
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50 border-t-4 border-red-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Why Customers Trust Us
            </h2>
            <p className="text-green-700 max-w-2xl mx-auto">We're committed to providing the best value, quality, and service in the celebrity merchandise industry.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-lg font-bold text-slate-900 mb-1">4.7/5</p>
              <p className="text-sm text-slate-600">Customer Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              </div>
              <p className="text-lg font-bold text-slate-900 mb-1">SSL</p>
              <p className="text-sm text-slate-600">Secure Checkout</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Truck className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <p className="text-lg font-bold text-slate-900 mb-1">Fast</p>
              <p className="text-sm text-slate-600">Worldwide Shipping</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-purple-600 mx-auto" />
              </div>
              <p className="text-lg font-bold text-slate-900 mb-1">30 Days</p>
              <p className="text-sm text-slate-600">Return Policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-700 via-red-600 to-green-700 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/30 border-2 border-yellow-300/50 rounded-lg mb-6 backdrop-blur-sm">
            <span className="text-sm font-semibold text-yellow-100">Save up to 70% on all orders</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Start Saving Today
          </h2>
          <p className="text-xl text-yellow-100 mb-10 max-w-2xl mx-auto">
            Join 25,000+ customers who save money every day with our wholesale pricing. Free shipping on orders $50+ to US.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-800 font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 text-lg border-2 border-yellow-300"
            >
              Shop Now & Save 60%+
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-yellow-100 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-300">✅</span>
              <span>Free Shipping $50+</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">✅</span>
              <span>Lowest Price Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">✅</span>
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}