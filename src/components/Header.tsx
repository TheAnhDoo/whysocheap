'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/contexts/CartContext'
import CartSidebar from '@/components/CartSidebar'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { state, dispatch } = useCart()

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  // Fetch search results
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true)
      const debounceTimer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`)
          const data = await response.json()
          const filtered = (data.products || []).filter((p: Product) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 5)
          setSearchResults(filtered)
        } catch (error) {
          console.error('Search failed:', error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }, 300)
      return () => clearTimeout(debounceTimer)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchQuery])

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <>
      <header className="border-b border-gray-300 sticky top-0 z-50" style={{ backgroundColor: '#851A1B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="w-10 h-10 border border-white/30 rounded-sm flex items-center justify-center bg-white/10 group-hover:border-white/50 transition-colors overflow-hidden">
                <Image 
                  src="https://i.postimg.cc/65qp9XW9/88489e4b-2963-47e5-aa4a-62b97ace6e17-removebg-preview.png" 
                  alt="WhySoCheap Logo" 
                  width={40}
                  height={40}
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
              <span className="text-2xl font-light text-white group-hover:text-white/90 transition-colors" style={{ fontFamily: "'Momo Trust Display', system-ui, sans-serif" }}>
                WhySoCheap
              </span>
            </Link>

            {/* Desktop Navigation - Middle */}
            <nav className="hidden md:flex items-center justify-center space-x-8 flex-1 mx-8" style={{ fontFamily: "'Momo Trust Sans', system-ui, sans-serif" }}>
              <Link href="/" className="text-white hover:text-white/90 transition-colors font-medium text-sm group relative">
                <span className="relative">
                Home
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link href="/products" className="text-white hover:text-white/90 transition-colors font-medium text-sm group relative">
                <span className="relative">
                Products
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link href="/about" className="text-white hover:text-white/90 transition-colors font-medium text-sm group relative">
                <span className="relative">
                About
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link href="/contact" className="text-white hover:text-white/90 transition-colors font-medium text-sm group relative">
                <span className="relative">
                Contact
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link 
                href="/partner-program"
                className="text-white hover:text-white/90 transition-colors font-medium text-sm group relative"
                title="Earn more together? Contact us for referral opportunities"
              >
                <span className="relative">
                  Partner Program
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </nav>

            {/* Right side actions - Search and Cart */}
            <div className="flex items-center space-x-3 ml-auto flex-shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white hover:text-white/90 hover:bg-white/10 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="relative p-2 text-white hover:text-white/90 hover:bg-white/10 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white hover:text-white/90 hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-4 border-t border-white/20 relative" style={{ backgroundColor: '#851A1B' }} ref={searchRef}>
              <form onSubmit={handleSearch} className="relative mt-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition-colors"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', fontFamily: "'Momo Trust Sans', system-ui, sans-serif" }}
                />
              </form>
              
              {/* Search Results Dropdown */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 shadow-lg max-h-96 overflow-y-auto z-[9999]">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setSearchQuery('')
                            setSearchResults([])
                            setIsSearchOpen(false)
                          }}
                        >
                          <div className="w-16 h-16 bg-gray-100 border border-gray-300 overflow-hidden flex-shrink-0">
                            {product.images && product.images.length > 0 ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate" style={{ fontFamily: "'Momo Trust Display', system-ui, sans-serif" }}>{product.name}</h3>
                            <p className="text-sm text-gray-600">${product.price}</p>
                          </div>
                        </Link>
                      ))}
                      <div className="border-t border-gray-200 p-2">
                        <Link
                          href={`/products?search=${encodeURIComponent(searchQuery)}`}
                          className="block text-center text-sm text-gray-700 hover:text-gray-900 py-2"
                          onClick={() => {
                            setSearchQuery('')
                            setSearchResults([])
                            setIsSearchOpen(false)
                          }}
                        >
                          View all results for "{searchQuery}"
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-600">
                      <p className="text-sm">No products found</p>
                    </div>
                  )}
              </div>
              )}
            </div>
          )}

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20" style={{ backgroundColor: '#851A1B' }}>
              <nav className="flex flex-col space-y-1" style={{ fontFamily: "'Momo Trust Sans', system-ui, sans-serif" }}>
                <Link
                  href="/"
                  className="text-white hover:text-white/90 hover:bg-white/10 px-4 py-3 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-white hover:text-white/90 hover:bg-white/10 px-4 py-3 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className="text-white hover:text-white/90 hover:bg-white/10 px-4 py-3 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:text-white/90 hover:bg-white/10 px-4 py-3 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/partner-program"
                  className="text-white hover:text-white/90 hover:bg-white/10 px-4 py-3 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Partner Program
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
      <CartSidebar />
    </>
  )
}
