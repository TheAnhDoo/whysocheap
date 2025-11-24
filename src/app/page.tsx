'use client'

import Link from 'next/link'
import { ArrowRight, Star, Truck, Shield, Award, Sparkles, Gift, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface Review {
  name: string
  rating: number
  comment: string
  saved: string
}

function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const reviews: Review[] = [
    { 
      name: 'Taylor Rodriguez', 
      rating: 5, 
      comment: 'My friend told me about this site and I literally thought she was pranking me. $18 for official merch? No way. But here I am, wearing my new shirt and it\'s 100% real. Mind = blown! 🤯', 
      saved: '$32' 
    },
    { 
      name: 'Jordan Kim', 
      rating: 5, 
      comment: 'Okay so I was fully expecting a knockoff when I saw the price. Like, there\'s no way this is legit right? WRONG. The quality is insane and it arrived faster than Amazon Prime. Already ordered 3 more!', 
      saved: '$45' 
    },
    { 
      name: 'Riley Chen', 
      rating: 5, 
      comment: 'I\'ve been collecting merch for years and I\'ve NEVER seen prices like this. Thought my eyes were playing tricks on me. The material is premium and the print quality is chef\'s kiss. This is my new go-to spot!', 
      saved: '$58' 
    },
    { 
      name: 'Morgan Williams', 
      rating: 5, 
      comment: 'My wallet is crying but in a good way. Bought 5 items for what I usually pay for 1. The shipping was so fast I thought they had a teleporter. Everything is authentic and perfect condition!', 
      saved: '$72' 
    },
    { 
      name: 'Casey Martinez', 
      rating: 5, 
      comment: 'I showed my mom the receipt and she was like "that can\'t be right, check your bank account." Checked it - only charged what they said. This site is magical. Quality is top tier!', 
      saved: '$28' 
    },
    { 
      name: 'Alex Rivera', 
      rating: 5, 
      comment: 'Honestly thought I was getting scammed. Like, these prices are criminal (in a good way). But nope, everything is legit and the customer service is actually human beings who respond! Wild concept.', 
      saved: '$35' 
    },
    { 
      name: 'Sam Thompson', 
      rating: 5, 
      comment: 'My entire collection is from here now. I used to spend $50+ per item at concerts. Now I get the same quality for $15. My bank account and I are both very happy. 10/10 would recommend!', 
      saved: '$95' 
    },
    { 
      name: 'Jamie Park', 
      rating: 5, 
      comment: 'I was skeptical AF but took the risk. Best decision ever. The shirt fits perfectly, the design is crisp, and it hasn\'t faded after 10 washes. This is the real deal, people!', 
      saved: '$22' 
    },
    { 
      name: 'Drew Anderson', 
      rating: 5, 
      comment: 'My roommate thought I was buying fake merch and was ready to roast me. Jokes on them - I showed them the tags and they immediately asked for the link. We both ordered more!', 
      saved: '$40' 
    },
    { 
      name: 'Quinn Lee', 
      rating: 5, 
      comment: 'I\'m not exaggerating when I say this changed my life. I can finally afford to collect merch without going broke. The quality is identical to what I\'ve bought at concerts. Mind-blowing!', 
      saved: '$65' 
    },
    { 
      name: 'Blake Johnson', 
      rating: 5, 
      comment: 'First order I was like "this has to be a mistake." Second order I was like "okay maybe it\'s real." Third order I\'m like "why did I ever shop anywhere else?" This is it, chief!', 
      saved: '$48' 
    },
    { 
      name: 'Avery Brown', 
      rating: 5, 
      comment: 'I literally screenshot the prices and sent them to my group chat like "is this real??" Everyone thought it was fake. Now we all shop here. The quality speaks for itself!', 
      saved: '$52' 
    },
    { 
      name: 'Cameron Davis', 
      rating: 5, 
      comment: 'I\'ve been burned by "too good to be true" deals before, so I was super cautious. But this? This is the real deal. Authentic, fast shipping, great prices. My new addiction!', 
      saved: '$38' 
    },
    { 
      name: 'Sage Wilson', 
      rating: 5, 
      comment: 'My friend dared me to order from here thinking I\'d get scammed. Jokes on them - I got premium merch for pennies. They\'re now regular customers too. We love to see it!', 
      saved: '$30' 
    },
    { 
      name: 'Rowan Patel', 
      rating: 5, 
      comment: 'I\'m usually the type to read 50 reviews before buying. But I took a chance here and WOW. The quality is insane, shipping was lightning fast, and the prices are unreal. 100% worth it!', 
      saved: '$42' 
    },
    { 
      name: 'Phoenix Taylor', 
      rating: 5, 
      comment: 'I thought my eyes were deceiving me when I saw these prices. Like, is this a glitch? Nope, just amazing deals on authentic merch. My collection has never looked better!', 
      saved: '$55' 
    },
  ]

  const reviewsPerView = 4
  const totalSlides = Math.ceil(reviews.length / reviewsPerView)

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % totalSlides)
      }
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isDragging, totalSlides])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    if (carouselRef.current) {
      setStartX(e.pageX - carouselRef.current.offsetLeft)
      setScrollLeft(carouselRef.current.scrollLeft)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
              {reviews
                .slice(slideIndex * reviewsPerView, slideIndex * reviewsPerView + reviewsPerView)
                .map((review, idx) => (
                  <div
                    key={slideIndex * reviewsPerView + idx}
                    className="p-6 border border-gray-300 bg-white relative"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-700 text-sm font-medium">{review.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm" style={{ color: '#851A1B' }}>{review.name}</h4>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : ''}`} style={{ color: i < review.rating ? '#851A1B' : '#d1d5db' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.comment}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-500">Verified Purchase</span>
                      <span className="text-xs font-medium" style={{ color: '#851A1B' }}>Saved {review.saved}</span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border border-gray-300 p-2 hover:bg-gray-50 transition-colors shadow-lg z-10"
        aria-label="Previous reviews"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border border-gray-300 p-2 hover:bg-gray-50 transition-colors shadow-lg z-10"
        aria-label="Next reviews"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-gray-900 w-8' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

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
    <div className="min-h-screen" style={{ backgroundColor: '#eae4df' }}>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Black Friday Banner */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-900 mb-6 shadow-lg">
              <Sparkles className="w-5 h-5" style={{ color: '#851A1B' }} />
              <span className="text-lg font-bold" style={{ color: '#851A1B' }}>BLACK FRIDAY SALE | 30% OFF | CODE: "BFSALE"</span>
              <Gift className="w-5 h-5" style={{ color: '#851A1B' }} />
            </div>

          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-light leading-tight mb-6" style={{ color: '#851A1B' }}>
                Authentic Celebrity
                <span className="block font-normal mt-2">Merchandise</span>
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-xl">
                Authentic celebrity merchandise. Offical goods from your favorite artists and brands.
                <br></br>
                Verified - High quality - Affordable prices - Shipping worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  Shop Black Friday Deals
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="#collections"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Browse Collections
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 border border-gray-300 bg-white">
                <div className="text-4xl font-light mb-2" style={{ color: '#851A1B' }}>25K+</div>
                <div className="text-sm text-gray-600">Satisfied Customers</div>
              </div>
              <div className="text-center p-6 border border-gray-300 bg-white">
                <div className="text-4xl font-light mb-2" style={{ color: '#851A1B' }}>100+</div>
                <div className="text-sm text-gray-600">Artists & Brands</div>
              </div>
              <div className="text-center p-6 border border-gray-300 bg-white">
                <div className="text-4xl font-light mb-2" style={{ color: '#851A1B' }}>100+</div>
                <div className="text-sm text-gray-600">Products Available</div>
              </div>
              <div className="text-center p-6 border border-gray-300 bg-white">
                <div className="text-4xl font-light mb-2" style={{ color: '#851A1B' }}>70%</div>
                <div className="text-sm text-gray-600">Average Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t-2 border-gray-400 my-12"></div>

      {/* Collections Section */}
      <section id="collections" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4" style={{ color: '#851A1B' }}>
              Shop by Collection
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">Browse curated collections from top artists and brands.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(col => (
              <Link 
                key={col.id || col.name} 
                href={col.slug ? `/collections/${col.slug}` : `/products?collection=${col.id || col.name}`} 
                className="group p-8 border border-gray-300 bg-white hover:border-gray-900 transition-colors relative"
              >
                <h3 className="text-xl font-medium mb-2 group-hover:text-gray-700 transition-colors" style={{ color: '#851A1B' }}>
                  {col.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{col.count || 0} products available</p>
                <div className="flex items-center gap-2 text-gray-900 group-hover:gap-3 transition-all text-sm font-medium">
                  <span>Browse Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t-2 border-gray-400 my-12"></div>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4" style={{ color: '#851A1B' }}>
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Professional service, authentic products, and unbeatable prices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border border-gray-300 bg-white relative">
              <div className="w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center mb-4 bg-white">
                <Truck className="w-6 h-6" style={{ color: '#851A1B' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#851A1B' }}>Verified Authenticity</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Direct manufacturer sourcing means up to 70% savings compared to retail stores.
              </p>
            </div>

            <div className="p-6 border border-gray-300 bg-white relative">
              <div className="w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center mb-4 bg-white">
                <Truck className="w-6 h-6" style={{ color: '#851A1B' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#851A1B' }}>Worldwide Shipping</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Free shipping on all orders (US). Just $5 worldwide shipping fees for all other orders.
              </p>
            </div>

            <div className="p-6 border border-gray-300 bg-white relative">
              <div className="w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center mb-4 bg-white">
                <Award className="w-6 h-6" style={{ color: '#851A1B' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#851A1B' }}>Easy Returns</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Licensed and official merchandise. Quality guaranteed with 30-day return policy.
              </p>
            </div>

            <div className="p-6 border border-gray-300 bg-white relative">
              <div className="w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center mb-4 bg-white">
                <Shield className="w-6 h-6" style={{ color: '#851A1B' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#851A1B' }}>Secure & Trusted</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                SSL secured checkout. Trusted by 25,000+ customers worldwide with 4.7/5 rating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t-2 border-gray-400 my-12"></div>

      {/* Product Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">

            <h2 className="text-4xl font-light mb-4" style={{ color: '#851A1B' }}>
              Featured Products
            </h2>
            {/* <p className="text-lg text-gray-700 max-w-2xl mx-auto">Quality merchandise at wholesale costs.</p> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotProducts.map((p) => (
              <Link 
                key={p.id} 
                href={`/products/${p.id}`} 
                className="group bg-white border border-gray-300 overflow-hidden hover:border-gray-900 transition-colors relative"
              >
                <div className="absolute top-3 left-3 bg-white border border-gray-900 px-2 py-1 text-xs font-bold z-10" style={{ color: '#851A1B' }}>
                  FEATURED
                </div>
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {p.images && p.images.length ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">👕</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors" style={{ color: '#851A1B' }}>{p.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-light" style={{ color: '#851A1B' }}>${p.price}</span>
                        {p.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${p.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-900 text-sm font-medium">
                      <span>View</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t-2 border-gray-400 my-12"></div>

      {/* Customer Reviews Carousel Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4" style={{ color: '#851A1B' }}>
              Customer Reviews
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">See what our customers say about our products and service.</p>
          </div>
          
          <ReviewsCarousel />
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t-2 border-gray-400 my-12"></div>

      {/* Trust Indicators */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4" style={{ color: '#851A1B' }}>
              Why Customers Trust Us
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">We're committed to providing the best value, quality, and service.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#851A1B' }} />
                ))}
              </div>
              <p className="text-lg font-light mb-1" style={{ color: '#851A1B' }}>4.7/5</p>
              <p className="text-sm text-gray-600">Customer Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8" style={{ color: '#851A1B' }} />
              </div>
              <p className="text-lg font-light mb-1" style={{ color: '#851A1B' }}>SSL</p>
              <p className="text-sm text-gray-600">Secure Checkout</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Truck className="w-8 h-8" style={{ color: '#851A1B' }} />
              </div>
              <p className="text-lg font-light mb-1" style={{ color: '#851A1B' }}>Fast</p>
              <p className="text-sm text-gray-600">Worldwide Shipping</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8" style={{ color: '#851A1B' }} />
              </div>
              <p className="text-lg font-light mb-1" style={{ color: '#851A1B' }}>30 Days</p>
              <p className="text-sm text-gray-600">Return Policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t-2 border-gray-400 my-12"></div>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-light mb-6" style={{ color: '#851A1B' }}>
            Start Saving Today
          </h2>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 25,000+ customers who save money every day with our wholesale pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Shop Black Friday Deals Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
