'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Star, ShoppingCart, ArrowUpDown, ArrowUp, ArrowDown, Sparkles, DollarSign, SortAsc, Filter, ChevronDown, X } from 'lucide-react'
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

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollection, setSelectedCollection] = useState(searchParams.get('collection') || 'all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [openCollection, setOpenCollection] = useState(false)
  const [openCategory, setOpenCategory] = useState(false)
  const [showFiltersSidebar, setShowFiltersSidebar] = useState(false)
  const [openSortDropdown, setOpenSortDropdown] = useState(false)
  const collectionRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const { dispatch } = useCart()

  useEffect(() => {
    fetchProducts()
    fetch('/api/collections').then(r => r.json()).then(d => {
      const collectionsData = d.collections || []
      setCollections(collectionsData)
      
      // Handle collection parameter from URL (could be ID or slug)
      const collectionParam = searchParams.get('collection')
      if (collectionParam) {
        // Try to find collection by ID or slug
        const foundCollection = collectionsData.find((c: any) => 
          c.id === collectionParam || c.slug === collectionParam
        )
        if (foundCollection) {
          // Always use the ID for filtering
          setSelectedCollection(foundCollection.id)
        } else {
          // Fallback: use the parameter as-is (might be an ID)
          setSelectedCollection(collectionParam)
        }
      }
    }).catch(() => {})
    
    const search = searchParams.get('search')
    if (search) setSearchTerm(search)
  }, [searchParams])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCollection, selectedCategory, sortBy, searchTerm])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionRef.current && !collectionRef.current.contains(event.target as Node)) {
        setOpenCollection(false)
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setOpenCategory(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setOpenSortDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const clearAllFilters = () => {
    setSelectedCollection('all')
    setSelectedCategory('all')
    setSearchTerm('')
  }

  const hasActiveFilters = selectedCollection !== 'all' || selectedCategory !== 'all' || searchTerm !== ''

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
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      )
    }

    // Collection filter - handle both ID and slug
    if (selectedCollection !== 'all') {
      // Check if selectedCollection is a slug or ID
      const collection = collections.find(c => c.id === selectedCollection || c.slug === selectedCollection)
      if (collection) {
        // Filter by the collection ID
        filtered = filtered.filter((product: any) => product.collectionId === collection.id)
      } else {
        // Fallback: try direct ID match
        filtered = filtered.filter((product: any) => product.collectionId === selectedCollection)
      }
    }

    // Type filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
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

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]
  const collectionsById = Object.fromEntries(collections.map(c => [c.id, c]))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#eae4df' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eae4df' }}>
      {/* Sticky Filter Bar - Ultra Minimal */}
      <div className="sticky top-20 z-40 mb-16 pt-8 pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200" style={{ backgroundColor: '#eae4df' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-8">
            {/* Left: Filters Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFiltersSidebar(true)}
                className="flex items-center gap-2 text-sm font-light text-gray-700 hover:text-gray-900 transition-colors"
                style={{ fontFamily: "'Momo Trust Sans', system-ui, sans-serif" }}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors font-light"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Right: Sort Dropdown & Count */}
            <div className="flex items-center gap-6">
              <div className="text-xs text-gray-400 font-light">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
              </div>
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setOpenSortDropdown(!openSortDropdown)}
                  className="flex items-center gap-2 text-sm font-light text-gray-700 hover:text-gray-900 transition-colors border border-gray-300 px-4 py-2 bg-white"
                  style={{ fontFamily: "'Momo Trust Sans', system-ui, sans-serif" }}
                >
                  {sortBy === 'featured' ? 'Featured' : 
                   sortBy === 'price-low' ? 'Price ↑' :
                   sortBy === 'price-high' ? 'Price ↓' :
                   'A-Z'}
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${openSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {openSortDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg min-w-[160px] z-20 py-1">
                    {[
                      { value: 'featured', label: 'Featured' },
                      { value: 'price-low', label: 'Price ↑', icon: ArrowUp },
                      { value: 'price-high', label: 'Price ↓', icon: ArrowDown },
                      { value: 'name', label: 'A-Z' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setOpenSortDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-light transition-colors flex items-center gap-2 ${
                          sortBy === option.value
                            ? 'bg-gray-50 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        style={{ fontFamily: "'Momo Trust Sans', system-ui, sans-serif" }}
                      >
                        {option.icon && <option.icon className="w-3 h-3" />}
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Sidebar */}
      {showFiltersSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-50"
            onClick={() => setShowFiltersSidebar(false)}
          />
          <div className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">FILTERS</h2>
              <button
                onClick={() => setShowFiltersSidebar(false)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Collection Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Collection</h3>
                  {selectedCollection !== 'all' && (
                    <button
                      onClick={() => setSelectedCollection('all')}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="collection"
                      checked={selectedCollection === 'all'}
                      onChange={() => setSelectedCollection('all')}
                      className="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">All Collections</span>
                  </label>
                  {collections.map(collection => {
                    const isSelected = selectedCollection === collection.id || selectedCollection === collection.slug
                    return (
                      <label key={collection.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="collection"
                          checked={isSelected}
                          onChange={() => setSelectedCollection(collection.id)}
                          className="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-sm text-gray-700">{collection.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Category Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Category</h3>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">
                        {category === 'all' ? 'All Types' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <button
                onClick={clearAllFilters}
                className="w-full text-xs text-gray-500 hover:text-gray-700 underline text-center font-light"
              >
                CLEAR ALL
              </button>
            </div>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Products Grid - Editorial Style */}
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
          <div className="text-center py-24">
            <div className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-light mb-2 tracking-tight" style={{ color: '#851A1B' }}>No products found</h3>
            <p className="text-sm text-gray-500 mb-8 font-light">Try adjusting your filters</p>
            <button
              onClick={() => {
                setSelectedCollection('all')
                setSelectedCategory('all')
                setSortBy('featured')
              }}
              className="px-6 py-2.5 text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all tracking-wide uppercase"
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
    // Using v2 key to reset all existing ratings with new logic
    const storedRating = localStorage.getItem(`product-rating-v2-${product.id}`)
    if (storedRating) return JSON.parse(storedRating)
    // Clear old rating if exists
    localStorage.removeItem(`product-rating-${product.id}`)
    const newRating = {
      stars: 4.6 + Math.random() * 0.4, // 4.6 to 5.0
      reviews: Math.floor(15 + Math.random() * 16) // 15 to 30
    }
    localStorage.setItem(`product-rating-v2-${product.id}`, JSON.stringify(newRating))
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
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setToast({ open: true, message: 'Please select a size', type: 'info' })
      return
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setToast({ open: true, message: 'Please select a color', type: 'info' })
      return
    }
    onAddToCart(product, selectedSize || 'N/A', selectedColor || 'original')
    setToast({ open: true, message: 'Added to cart', type: 'success' })
  }

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image - Editorial Style */}
      <Link href={`/products/${product.id}`} className="block mb-3">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-300 text-xs font-light">No Image</span>
            </div>
          )}
          
          {/* Add to Cart - Appears on Hover */}
          <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={(e) => {
                e.preventDefault()
                if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                  setToast({ open: true, message: 'Please select a size', type: 'info' })
                  return
                }
                if (product.colors && product.colors.length > 0 && !selectedColor) {
                  setToast({ open: true, message: 'Please select a color', type: 'info' })
                  return
                }
                handleAddToCart()
              }}
              className="bg-white text-gray-900 px-6 py-2.5 text-xs font-light tracking-wider uppercase transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              Quick Add
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info - Ultra Minimal */}
      <div className="space-y-1">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-light tracking-wide hover:opacity-60 transition-opacity cursor-pointer" style={{ color: '#851A1B' }}>
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-light tracking-tight" style={{ color: '#851A1B' }}>
            {formatPrice(product.price)}
          </span>
          
          {/* Rating - Inline */}
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-gray-400 fill-current" />
            <span className="text-[9px] text-gray-400 font-light">{rating.stars.toFixed(1)}</span>
          </div>
        </div>

        {/* Size & Color - Compact */}
        <div className="flex items-center gap-2 pt-2">
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1">
              {product.sizes.slice(0, 3).map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-[10px] px-1.5 py-0.5 border transition-all ${
                    selectedSize === size
                      ? 'border-gray-900 text-gray-900'
                      : 'border-gray-200 text-gray-400 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
              {product.sizes.length > 3 && (
                <span className="text-[10px] text-gray-400">+{product.sizes.length - 3}</span>
              )}
            </div>
          )}
          
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedColor === color
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: getColorHex(color) }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ open: false, message: '' })} />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#eae4df' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  )
}