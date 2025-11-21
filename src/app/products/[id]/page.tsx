'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, ShoppingCart, Heart, ArrowLeft, Plus, Minus, Check, Truck, Shield, RefreshCw, ZoomIn } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Toast from '@/components/Toast'
import ImageZoom from '@/components/ImageZoom'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  sizes: string[]
  colors: string[]
  material: string
  washingGuide: string
  printType: string
  inStock: boolean
  category: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { dispatch } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; type?: 'success'|'error'|'info' }>({ open: false, message: '' })
  const [rating, setRating] = useState<{ stars: number; reviews: number } | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
      // Generate rating once per product ID and store in localStorage
      const storedRating = localStorage.getItem(`product-rating-${params.id}`)
      if (storedRating) {
        setRating(JSON.parse(storedRating))
      } else {
        // More realistic ratings: 4.0-4.9 stars, 12-150 reviews
        const newRating = {
          stars: 4 + Math.random() * 0.9, // 4.0 to 4.9
          reviews: Math.floor(12 + Math.random() * 138) // 12 to 150
        }
        localStorage.setItem(`product-rating-${params.id}`, JSON.stringify(newRating))
        setRating(newRating)
      }
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`)
      const data = await response.json()
      setProduct(data.product)
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const getColorHex = (color: string): string => {
    const colorMap: Record<string, string> = {
      white: '#ffffff', black: '#000000', gray: '#6b7280', grey: '#6b7280',
      pink: '#ec4899', blue: '#3b82f6', green: '#10b981', red: '#ef4444',
      yellow: '#eab308', orange: '#f97316', purple: '#a855f7', brown: '#92400e',
      navy: '#1e3a8a', beige: '#f5f5dc', cream: '#fffdd0', maroon: '#800000',
      teal: '#14b8a6', cyan: '#06b6d4', lime: '#84cc16', indigo: '#4f46e5'
    }
    const normalized = color.toLowerCase().trim()
    return colorMap[normalized] || `#${normalized.replace(/[^0-9a-f]/g, '').padStart(6, '0').slice(0, 6)}` || '#6b7280'
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setToast({ open: true, message: 'Please select a size', type: 'info' })
      return
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setToast({ open: true, message: 'Please select a color', type: 'info' })
      return
    }
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product!.id,
        product: product!,
        size: selectedSize,
        color: selectedColor || 'original',
        quantity
      }
    })
    
    // Show success message
    setToast({ open: true, message: 'Added to cart', type: 'success' })
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      setToast({ open: true, message: 'Please select a size', type: 'info' })
      return
    }
    if (product!.colors && product!.colors.length > 0 && !selectedColor) {
      setToast({ open: true, message: 'Please select a color', type: 'info' })
      return
    }
    
    // Store product in session for buy now flow
    const buyNowData = {
      productId: product!.id,
      product: product!,
      size: selectedSize,
      color: selectedColor || 'original',
      quantity,
      timestamp: Date.now()
    }
    
    sessionStorage.setItem('buyNowProduct', JSON.stringify(buyNowData))
    
    // Redirect to checkout
    router.push('/checkout')
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // In a real app, you would save to user's wishlist
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-900 mb-4">Product not found</h1>
          <Link href="/products" className="text-primary-600 hover:text-primary-700">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/products" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-strong group">
              {product.images && product.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[selectedImage] || product.images[0]} alt={product.name} className="object-cover w-full h-full" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl">👕</span>
                </div>
              )}
              
              {/* Zoom Button */}
              <button
                onClick={() => setShowZoom(true)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ZoomIn className="w-5 h-5 text-primary-600" />
              </button>
              
              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className={`absolute top-4 left-4 p-2 rounded-full transition-colors duration-200 ${
                  isWishlisted 
                    ? 'bg-error-500 text-white' 
                    : 'bg-white/80 backdrop-blur-sm text-primary-600 hover:bg-error-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              
              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute bottom-4 left-4 bg-primary-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {(product.images?.length ? product.images : [1, 2, 3, 4]).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden shadow-md transition-all duration-200 ${
                    selectedImage === index ? 'ring-2 ring-primary-600' : 'hover:shadow-lg'
                  }`}
                >
                  {product.images && product.images[index] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[index]} alt={`${product.name} ${index+1}`} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">👕</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-primary-900 mb-4">{product.name}</h1>
              {rating && (
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating.stars) ? 'text-warning fill-current' : i < rating.stars ? 'text-warning fill-current opacity-50' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-2 text-primary-600">({rating.stars.toFixed(1)}) • {rating.reviews} reviews</span>
                  </div>
                </div>
              )}
              <div className="text-3xl font-bold text-primary-900">{formatPrice(product.price)}</div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Description</h3>
              <p className="text-primary-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-primary-200 hover:border-primary-400 text-primary-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-primary-600 scale-110'
                        : 'border-primary-200 hover:border-primary-400'
                    }`}
                    style={{ backgroundColor: getColorHex(color) }}
                  />
                ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border-2 border-primary-200 flex items-center justify-center hover:border-primary-400 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold text-primary-900 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border-2 border-primary-200 flex items-center justify-center hover:border-primary-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary py-4 rounded-xl flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-primary-900 text-white py-4 rounded-xl flex items-center justify-center space-x-2 text-lg font-semibold hover:bg-primary-800 transition-colors"
                >
                  <Check className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6 pt-8 border-t border-primary-200">
              <div>
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Product Details</h3>
                <div className="space-y-2 text-primary-600">
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span>{product.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Print Type:</span>
                    <span>{product.printType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{product.category}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary-900 mb-3">Washing Guide</h3>
                <p className="text-primary-600">{product.washingGuide}</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-primary-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-primary-900">Free Shipping</div>
                  <div className="text-sm text-primary-600">On orders over $50</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-primary-900">Secure Payment</div>
                  <div className="text-sm text-primary-600">100% protected</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-primary-900">Easy Returns</div>
                  <div className="text-sm text-primary-600">30-day policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && product.images && product.images.length > 0 && (
        <ImageZoom
          imageSrc={product.images[selectedImage] || product.images[0]}
          isOpen={showZoom}
          onClose={() => setShowZoom(false)}
        />
      )}
      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ open: false, message: '' })} />
    </div>
  )
}
