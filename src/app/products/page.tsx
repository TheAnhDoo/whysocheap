'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Star, ShoppingCart, Heart, Filter, Search } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import Toast from '@/components/Toast'

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

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCollection, setSelectedCollection] = useState(searchParams.get('collection') || 'all')
  const [selectedColor, setSelectedColor] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const { dispatch } = useCart()

  useEffect(() => {
    fetchProducts()
    fetch('/api/collections').then(r => r.json()).then(d => setCollections(d.collections || [])).catch(() => {})
    const collection = searchParams.get('collection')
    const search = searchParams.get('search')
    if (collection) setSelectedCollection(collection)
    if (search) setSearchTerm(search)
  }, [searchParams])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCollection, selectedColor, sortBy])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Collection filter
    if (selectedCollection !== 'all') {
      filtered = filtered.filter(product => product.collectionId === selectedCollection)
    }

    // Color filter
    if (selectedColor !== 'all') {
      filtered = filtered.filter(product => product.colors.includes(selectedColor))
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = (product: Product, size: string, color: string) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        product: product,
        size,
        color,
        quantity: 1
      }
    })
  }

  const colors = ['all', ...Array.from(new Set(products.flatMap(p => p.colors || [])))]
  const collectionsById = Object.fromEntries(collections.map(c => [c.id, c]))

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <span className="absolute top-20 left-10 text-6xl">🎄</span>
        <span className="absolute top-40 right-20 text-5xl">🎁</span>
        <span className="absolute bottom-40 left-1/4 text-5xl">⭐</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-800 mb-2 flex items-center gap-3">
            <span>🎁</span>
            <span>Our Products</span>
            <span>🎄</span>
          </h1>
          <p className="text-red-700">Discover our collection of premium idol merchandise</p>
        </div>

        {/* Filters */}
        <div className="card-elevated p-6 mb-8 bg-gradient-to-br from-white to-red-50 border-4 border-red-300 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Collection Filter */}
            <div>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="input-field"
              >
                <option value="all">All Collections</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Filter */}
            <div>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="input-field"
              >
                {colors.map(color => (
                  <option key={color} value={color}>
                    {color === 'all' ? 'All Colors' : color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-primary-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary-900 mb-2">No products found</h3>
            <p className="text-primary-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedColor('all')
                setSortBy('featured')
              }}
              className="btn-primary px-6 py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, size: string, color: string) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; type?: 'success'|'error'|'info' }>({ open: false, message: '' })
  const [rating] = useState(() => {
    const storedRating = localStorage.getItem(`product-rating-${product.id}`)
    if (storedRating) return JSON.parse(storedRating)
    const newRating = {
      stars: 4 + Math.random() * 0.9, // 4.0 to 4.9
      reviews: Math.floor(12 + Math.random() * 138) // 12 to 150
    }
    localStorage.setItem(`product-rating-${product.id}`, JSON.stringify(newRating))
    return newRating
  })

  const getColorHex = (color: string): string => {
    const colorMap: Record<string, string> = {
      white: '#ffffff', black: '#000000', gray: '#6b7280', grey: '#6b7280',
      pink: '#ec4899', blue: '#3b82f6', green: '#10b981', red: '#ef4444',
      yellow: '#eab308', orange: '#f97316', purple: '#a855f7', brown: '#92400e',
      navy: '#1e3a8a', beige: '#f5f5dc', cream: '#fffdd0', maroon: '#800000',
      teal: '#14b8a6', cyan: '#06b6d4', lime: '#84cc16', indigo: '#4f46e5'
    }
    const normalized = color.toLowerCase().trim()
    if (colorMap[normalized]) return colorMap[normalized]
    // Try to parse as hex
    if (normalized.startsWith('#')) return normalized
    // Try to extract hex from string
    const hexMatch = normalized.match(/#?([0-9a-f]{6})/i)
    if (hexMatch) return `#${hexMatch[1]}`
    return '#6b7280'
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
    onAddToCart(product, selectedSize, selectedColor || 'original')
    setToast({ open: true, message: 'Added to cart', type: 'success' })
  }

  return (
    <div
      className="card-elevated overflow-hidden hover:shadow-strong transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square bg-primary-50 flex items-center justify-center relative overflow-hidden cursor-pointer group">
          {product.images && product.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">👕</span>
          )}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-primary-900 text-white px-2 py-1 rounded text-xs font-medium">
              Featured
            </div>
          )}
          <div className={`absolute top-2 right-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Handle wishlist
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors"
            >
              <Heart className="w-4 h-4 text-primary-600" />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-primary-900 mb-2 line-clamp-2 hover:text-primary-700 transition-colors cursor-pointer">{product.name}</h3>
        </Link>
        <p className="text-sm text-primary-600 mb-3 line-clamp-2">{product.description}</p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-primary-900">{formatPrice(product.price)}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating.stars) ? 'text-warning fill-current' : i < rating.stars ? 'text-warning fill-current opacity-50' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-primary-600 ml-1">({rating.stars.toFixed(1)})</span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-primary-700 mb-2">Size</label>
          <div className="flex space-x-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                  selectedSize === size
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-primary-200 hover:border-primary-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-colors ${
                    selectedColor === color
                      ? 'border-primary-600'
                      : 'border-primary-200 hover:border-primary-400'
                  }`}
                  style={{ backgroundColor: getColorHex(color) }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full btn-primary py-2 rounded-lg flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ open: false, message: '' })} />
    </div>
  )
}