'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, ShoppingCart, ArrowLeft, Plus, Minus, Check, ZoomIn } from 'lucide-react'
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
  const [showZoom, setShowZoom] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; type?: 'success'|'error'|'info' }>({ open: false, message: '' })
  const [rating, setRating] = useState<{ stars: number; reviews: number } | null>(null)
  const [stock, setStock] = useState<Record<string, number>>({})
  
  // Update quantity when size changes to respect stock limits
  useEffect(() => {
    if (product && Object.keys(stock).length > 0) {
      const availableStock = (!product.sizes || product.sizes.length === 0)
        ? (stock['N/A'] || 0)
        : (selectedSize ? (stock[selectedSize] || 0) : 0)
      if (quantity > availableStock && availableStock > 0) {
        setQuantity(availableStock)
      } else if (availableStock === 0) {
        setQuantity(1)
      }
    }
  }, [selectedSize, stock, product, quantity])

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
      // Generate rating once per product ID and store in localStorage
      // Using v2 key to reset all existing ratings with new logic
      const storedRating = localStorage.getItem(`product-rating-v2-${params.id}`)
      if (storedRating) {
        setRating(JSON.parse(storedRating))
      } else {
        // Clear old rating if exists
        localStorage.removeItem(`product-rating-${params.id}`)
        // Ratings: 4.6-5.0 stars, 15-30 reviews
        const newRating = {
          stars: 4.6 + Math.random() * 0.4, // 4.6 to 5.0
          reviews: Math.floor(15 + Math.random() * 16) // 15 to 30
        }
        localStorage.setItem(`product-rating-v2-${params.id}`, JSON.stringify(newRating))
        setRating(newRating)
      }
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`)
      const data = await response.json()
      setProduct(data.product)
      
      // Load or generate stock
      const storedStock = localStorage.getItem(`product-stock-${id}`)
      if (storedStock) {
        setStock(JSON.parse(storedStock))
      } else if (data.product) {
        const newStock: Record<string, number> = {}
        if (data.product.sizes && data.product.sizes.length > 0) {
          data.product.sizes.forEach((size: string) => {
            newStock[size] = Math.floor(2 + Math.random() * 4) // 2 to 5
          })
        } else {
          newStock['N/A'] = Math.floor(2 + Math.random() * 4) // 2 to 5 for products without size
        }
        localStorage.setItem(`product-stock-${id}`, JSON.stringify(newStock))
        setStock(newStock)
      }
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
    if (!product) return
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setToast({ open: true, message: 'Please select a size', type: 'info' })
      return
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setToast({ open: true, message: 'Please select a color', type: 'info' })
      return
    }
    
    // Check stock
    const availableStock = (!product.sizes || product.sizes.length === 0)
      ? (stock['N/A'] || 0)
      : (stock[selectedSize] || 0)
    
    if (quantity > availableStock) {
      setToast({ open: true, message: `Only ${availableStock} available in stock`, type: 'error' })
      return
    }
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        product: product,
        size: selectedSize || 'N/A',
        color: selectedColor || 'original',
        quantity: quantity
      }
    })
    setToast({ open: true, message: 'Added to cart', type: 'success' })
  }

  const handleBuyNow = () => {
    if (!product) return
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setToast({ open: true, message: 'Please select a size', type: 'info' })
      return
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setToast({ open: true, message: 'Please select a color', type: 'info' })
      return
    }
    
    // Check stock
    const availableStock = (!product.sizes || product.sizes.length === 0)
      ? (stock['N/A'] || 0)
      : (stock[selectedSize] || 0)
    
    if (quantity > availableStock) {
      setToast({ open: true, message: `Only ${availableStock} available in stock`, type: 'error' })
      return
    }
    
    // Add to cart first
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        product: product,
        size: selectedSize || 'N/A',
        color: selectedColor || 'original',
        quantity: quantity
      }
    })
    
    // Store buy now product in session storage
    sessionStorage.setItem('buyNowProduct', JSON.stringify({
      productId: product.id,
      product: product,
      size: selectedSize || 'N/A',
      color: selectedColor || 'original',
      quantity: quantity
    }))
    
    // Navigate to checkout
    router.push('/checkout')
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#eae4df' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#eae4df' }}>
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-6">Product not found</h1>
          <Link href="/products" className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
            Back to Products
            <ArrowLeft className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eae4df' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/products" 
            className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white border border-gray-300 overflow-hidden group">
              {product.images && product.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[selectedImage] || product.images[0]} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <span className="text-8xl">👕</span>
                </div>
              )}
              
              {/* Zoom Button */}
              <button
                onClick={() => setShowZoom(true)}
                className="absolute top-4 right-4 p-2 bg-white border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              
              {/* Sale Badge */}
              <div className="absolute bottom-4 left-4 bg-white border-2 border-gray-900 px-3 py-1 text-xs font-bold" style={{ color: '#851A1B' }}>
                HOT
                </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {(product.images?.length ? product.images : [1, 2, 3, 4]).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white border transition-all duration-200 ${
                    selectedImage === index ? 'border-gray-900' : 'border-gray-300 hover:border-gray-900'
                  }`}
                >
                  {product.images && product.images[index] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[index]} alt={`${product.name} ${index+1}`} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-2xl">👕</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header with Size, Color, and Quantity */}
            <div className="bg-white border border-gray-300 p-8 relative">
              <h1 className="text-4xl font-light mb-4" style={{ color: '#851A1B' }}>{product.name}</h1>
              {rating && (
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating.stars) ? 'fill-current' : i < rating.stars ? 'fill-current opacity-50' : ''}`} style={{ color: i < Math.floor(rating.stars) ? '#851A1B' : i < rating.stars ? '#851A1B' : '#d1d5db' }} />
                    ))}
                    <span className="ml-2 text-gray-600">({rating.stars.toFixed(1)}) • {rating.reviews} reviews</span>
                  </div>
                </div>
              )}
              <div className="text-3xl font-light mb-4" style={{ color: '#851A1B' }}>{formatPrice(product.price)}</div>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium" style={{ color: '#851A1B' }}>Size</h3>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-xs text-gray-600 hover:text-gray-900 underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map(size => {
                      const sizeStock = stock[size] || 0
                      const isOutOfStock = sizeStock === 0
                      return (
                        <button
                          key={size}
                          onClick={() => !isOutOfStock && setSelectedSize(size)}
                          disabled={isOutOfStock}
                          className={`py-2 px-3 border-2 transition-colors font-medium text-sm relative ${
                            selectedSize === size
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : isOutOfStock
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 hover:border-gray-900 text-gray-700'
                          }`}
                        >
                          {size}
                          {sizeStock > 0 && (
                            <span className="absolute -top-1 -right-1 text-[9px] text-gray-500 font-light">
                              {sizeStock}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium mb-3" style={{ color: '#851A1B' }}>Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedColor === color
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-300 hover:border-gray-900'
                        }`}
                        style={{ backgroundColor: getColorHex(color) }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium" style={{ color: '#851A1B' }}>Quantity</h3>
                  {(!product.sizes || product.sizes.length === 0) && stock['N/A'] !== undefined && (
                    <span className="text-xs text-gray-500 font-light">
                      {stock['N/A']} in stock
                    </span>
                  )}
                  {product.sizes && product.sizes.length > 0 && selectedSize && stock[selectedSize] !== undefined && (
                    <span className="text-xs text-gray-500 font-light">
                      {stock[selectedSize]} in stock
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-base font-light text-gray-900 w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => {
                      const maxStock = (!product.sizes || product.sizes.length === 0) 
                        ? (stock['N/A'] || 0)
                        : (selectedSize ? (stock[selectedSize] || 0) : 0)
                      setQuantity(Math.min(maxStock, quantity + 1))
                    }}
                    disabled={
                      (!product.sizes || product.sizes.length === 0)
                        ? quantity >= (stock['N/A'] || 0)
                        : !selectedSize || quantity >= (stock[selectedSize] || 0)
                    }
                    className="w-8 h-8 border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-gray-900 hover:bg-gray-800 text-white py-4 flex items-center justify-center space-x-2 font-medium transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="border-2 border-gray-900 text-gray-900 py-4 flex items-center justify-center space-x-2 font-medium hover:bg-gray-900 hover:text-white transition-colors"
                >
                  <Check className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
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

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSizeGuide(false)} />
          <div className="relative bg-white border border-gray-300 w-full max-w-2xl p-8" style={{ backgroundColor: '#eae4df' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-medium" style={{ color: '#851A1B' }}>SIZE GUIDE</h3>
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700 text-xl">×</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="text-left py-3 px-4 font-medium" style={{ color: '#851A1B' }}>SIZE</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: '#851A1B' }}>LENGTH</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: '#851A1B' }}>CHEST</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: '#851A1B' }}>SLEEVE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-4 text-gray-900 font-medium">YS/YM</td>
                    <td className="py-3 px-4 text-gray-700">20"</td>
                    <td className="py-3 px-4 text-gray-700">21"</td>
                    <td className="py-3 px-4 text-gray-700">26"</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-4 text-gray-900 font-medium">XS/S</td>
                    <td className="py-3 px-4 text-gray-700">23 1/2"</td>
                    <td className="py-3 px-4 text-gray-700">23"</td>
                    <td className="py-3 px-4 text-gray-700">31 1/2"</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-4 text-gray-900 font-medium">M/L</td>
                    <td className="py-3 px-4 text-gray-700">25"</td>
                    <td className="py-3 px-4 text-gray-700">25"</td>
                    <td className="py-3 px-4 text-gray-700">32 1/2"</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-4 text-gray-900 font-medium">XL/2XL</td>
                    <td className="py-3 px-4 text-gray-700">27"</td>
                    <td className="py-3 px-4 text-gray-700">27"</td>
                    <td className="py-3 px-4 text-gray-700">33 3/4"</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-900 font-medium">3XL/4XL</td>
                    <td className="py-3 px-4 text-gray-700">29"</td>
                    <td className="py-3 px-4 text-gray-700">29"</td>
                    <td className="py-3 px-4 text-gray-700">35"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ open: false, message: '' })} />
    </div>
  )
}
