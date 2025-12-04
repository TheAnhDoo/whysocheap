'use client'

import Link from 'next/link'
import { ArrowRight, Star, Truck, Shield, Award, Sparkles, Gift, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface Review {
  name: string
  rating: number
  comment: string
  saved: string
  imageUrl?: string  // URL to external image
  imagePath?: string // Path to local image file in data folder (e.g., "review1.jpg")
}

function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Helper function to get image source
  const getImageSrc = (review: Review): string | null => {
    if (review.imageUrl) {
      return review.imageUrl
    }
    if (review.imagePath) {
      return `/api/review-images/${review.imagePath}`
    }
    return null
  }

  const reviews: Review[] = [

    { 
      name: 'Jordan Kim', 
      rating: 5, 
      comment: 'Box #6 arrived safely and nothing inside was damaged. All official items. Took about a week to get to me. Really smooth experience', 
      imagePath: 'images/review1.jpg',
      saved: '$45' 
    },
    { 
      name: 'Riley Chen', 
      rating: 5, 
      comment: 'Box #9 arrived in just under a week. Complete, perfect condition, and authentic. This shop only sells real merch so I feel very safe buying from them. Amazing service!', 
      imagePath: 'images/review2.jpg',
      saved: '$58' 
    },
    { 
      name: 'Morgan Williams', 
      rating: 5, 
      comment: 'Box 12 came fully sealed and complete. No damage, no missing items. It arrived in under a week. Definitely official merch. Would order again', 
      imagePath: 'images/review3.jpg',
      saved: '$72' 
    },
    { 
      name: 'Casey Martinez', 
      rating: 5, 
      comment: 'Got the 5th Muster full package and everything came in great shape. Photos, DVD, all inclusions were clean and official. Shipping to the US was quick too. Really happy I found this set here.', 
      imagePath: 'images/review4.jpg',
      saved: '$28' 
    },
    { 
      name: 'Christine Ha', 
      rating: 5, 
      comment: 'Got the 1989 zip up and honestly it surprised me. Shipping to the US took around 6 days and the quality is solid — thick, comfy, definitely official. Happy with this one', 
      imagePath: 'images/review5.webp',
      saved: '$35' 
    },
    { 
      name: 'Alex Kim', 
      rating: 5, 
      comment: 'I\'ve been trying to find the Capsule Album Vol.1 for a while, glad this shop had it. Arrived in 6 days. Brand new, no issues', 
      saved: '$28',
      imagePath: 'images/review6.webp'
    },
    { 
      name: 'Maya Patel', 
      rating: 5, 
      comment: 'Merch Box #7 came quickly and with all photocards and items included. The purple theme is gorgeous and absolutely authentic. Great service and fast delivery!', 
      saved: '$45',
      imagePath: 'images/review7.jpg'
    },
    { 
      name: 'Ryan Chen', 
      rating: 5, 
      comment: 'My 6th ARMY KIT came in perfect condition. Nothing missing. Arrived in under a week. My friend in the EU ordered too and theirs came in about 10 days with $5 shipping. All legit.', 
      saved: '$52',
      imagePath: 'images/review8.webp'
    },
    { 
      name: 'Emma Wilson', 
      rating: 5, 
      comment: 'My Butter album showed up with the right version and all inclusions. Photocard and poster were perfect. Free US shipping was surprisingly quick', 
      saved: '$35',
      imagePath: 'images/review9.webp'
    },
    { 
      name: 'Noah Martinez', 
      rating: 5, 
      comment: 'Official Line Friends BT21 Sweet Things Sweatshirt arrived in perfect condition. Quality is amazing and it\'s definitely authentic. Fast shipping and great service!', 
      saved: '$38',
      imagePath: 'images/review10.jpg'
    },
    { 
      name: 'Sophia Lee', 
      rating: 5, 
      comment: 'The ARMY Book looks way nicer in person. Pages are thick and well printed. It came packed well so no dents. Free US shipping took like a week', 
      saved: '$42',
      imagePath: 'images/review11.webp'
    },
    { 
      name: 'Lucas Brown', 
      rating: 5, 
      comment: 'The BE Album came sealed and everything inside is clean and new. Definitely official merch. EU shipping was only $5 and took around 10 days', 
      saved: '$30',
      imagePath: 'images/review12.jpg'
    },
    { 
      name: 'Isabella Garcia', 
      rating: 5, 
      comment: 'The Box #5 suitcase is super cute. Everything inside is original and still sealed. Shipping was fast and free. No complaints at all', 
      saved: '$48',
      imagePath: 'images/review13.jpg'
    },
    { 
      name: 'Ethan Davis', 
      rating: 5, 
      comment: 'The Echo Jin frame looks even better in person. Colors are clear and the acrylic is perfect. Arrived safely with no scratches. Fast shipping and real merch', 
      saved: '$25',
      imagePath: 'images/review14.jpg'
    },
    { 
      name: 'Olivia Anderson', 
      rating: 5, 
      comment: 'The J-Hope acorn charm is so cute! The material is great and it\'s definitely official. Packaging was protective and delivery to the EU was exactly 10 days. Very trustworthy shop', 
      saved: '$20',
      imagePath: 'images/review15.avif'
    },
    { 
      name: 'Mason Taylor', 
      rating: 5, 
      comment: 'The Jungkook Armyst hoodie is really soft and comfy. Color looks nice too. It came fast and it\'s definitely official, not the cheap replica kind', 
      saved: '$55',
      imagePath: 'images/review16.jpg'
    },
    { 
      name: 'Ava Rodriguez', 
      rating: 5, 
      comment: 'The Jungkook GOLDEN merch is beautiful! Authentic quality just like the official store. Arrived quickly, with the box and all items in perfect condition. I\'ve bought multiple times and everything has always been real', 
      saved: '$65',
      imagePath: 'images/review17.jpg'
    },
    { 
      name: 'Liam Johnson', 
      rating: 5, 
      comment: 'The Layover Membership Box #17 is rare, but this shop had it new and sealed. Everything is official and beautiful. I\'m in the EU and received it in about 10 days. Totally worth it', 
      saved: '$72',
      imagePath: 'images/review18.jpg'
    },
    { 
      name: 'Charlotte White', 
      rating: 5, 
      comment: 'The MOS lightstick came sealed and works flawlessly. Bright light and connects to the app with no issues. I used to worry about fakes but this one is 100% official. Free US shipping in under 7 days', 
      saved: '$58',
      imagePath: 'images/review19.jpg'
    },
    { 
      name: 'James Moore', 
      rating: 5, 
      comment: 'The MOTS SE lightstick is 100% official. Box is clean, QR scan works, and the light is strong. Shipping was fast and free in the US. Extremely reliable shop', 
      saved: '$60',
      imagePath: 'images/review20.jpg'
    },
    { 
      name: 'Amelia Harris', 
      rating: 5, 
      comment: 'The RED ornament set came packaged nicely and everything inside was intact. The colors are vibrant and they look great on display. Fast delivery and no issues', 
      saved: '$32',
      imagePath: 'images/review21.jpg'
    },
    { 
      name: 'Benjamin Clark', 
      rating: 5, 
      comment: 'The toddler Folklore cardigan is honestly so cute. Soft material and good stitching. Fits my kid perfectly. Shipping was quick and the quality feels like official merch.', 
      saved: '$40',
      imagePath: 'images/review22.jpg'
    },
    { 
      name: 'Harper Lewis', 
      rating: 5, 
      comment: 'The tote arrived clean and new. Quality is great and it\'s definitely authentic. Fast shipping and perfect condition. Very happy with my purchase!', 
      saved: '$18',
      imagePath: 'images/review23.webp'
    },
    { 
      name: 'Henry Walker', 
      rating: 5, 
      comment: 'The TTPD cardigan came exactly as I hoped. Good weight, nice knit, and no loose threads. Arrived in under a week. Really happy with it', 
      saved: '$50',
      imagePath: 'images/review24.avif'
    },
    { 
      name: 'Evelyn Hall', 
      rating: 5, 
      comment: 'This Jimin hoodie is perfect—exact color, thick fabric, and clean print. 100% official, not a replica. Free US shipping was fast, arrived in about a week. Super happy with my purchase!', 
      saved: '$45',
      imagePath: 'images/review25.jpg'
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
                    {getImageSrc(review) && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={getImageSrc(review) || ''} 
                          alt={`Review by ${review.name}`}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            // Hide image on error
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.comment}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-500">Verified Purchase</span>
                      {/* <span className="text-xs font-medium" style={{ color: '#851A1B' }}>Saved {review.saved}</span> */}
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
              <span className="text-lg font-bold" style={{ color: '#851A1B' }}>XMAS SALE | 30% OFF | CODE: "XMAS30"</span>
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
                Authentic celebrity merchandise. Official goods from your favorite artists and brands.
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
                <div className="text-4xl font-light mb-2" style={{ color: '#851A1B' }}>30%</div>
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
