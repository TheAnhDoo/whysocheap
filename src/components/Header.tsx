'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import CartSidebar from '@/components/CartSidebar'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { state, dispatch } = useCart()

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <>
      <header className="bg-gradient-to-r from-red-600 via-red-700 to-green-700 border-b-4 border-red-800 sticky top-0 z-50 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 via-red-700/90 to-green-700/90 animate-gradient opacity-90"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center h-20">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center group-hover:from-yellow-400 group-hover:to-yellow-600 transition-all duration-300 shadow-xl border-2 border-yellow-200 group-hover:scale-110 group-hover:rotate-6 overflow-hidden relative">
                <Image 
                  src="https://i.postimg.cc/65qp9XW9/88489e4b-2963-47e5-aa4a-62b97ace6e17-removebg-preview.png" 
                  alt="WhySoCheap Logo" 
                  width={40}
                  height={40}
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-yellow-200 transition-all duration-300 drop-shadow-2xl tracking-tight">
                WhySoCheap
              </span>
            </Link>

            {/* Desktop Navigation - Middle */}
            <nav className="hidden md:flex items-center justify-center space-x-8 flex-1 mx-8">
              <Link href="/" className="text-white/95 hover:text-yellow-200 transition-all duration-300 font-semibold text-sm uppercase tracking-wider group relative">
                <span className="relative">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link href="/products" className="text-white/95 hover:text-yellow-200 transition-all duration-300 font-semibold text-sm uppercase tracking-wider group relative">
                <span className="relative">
                  Products
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link href="/about" className="text-white/95 hover:text-yellow-200 transition-all duration-300 font-semibold text-sm uppercase tracking-wider group relative">
                <span className="relative">
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link href="/contact" className="text-white/95 hover:text-yellow-200 transition-all duration-300 font-semibold text-sm uppercase tracking-wider group relative">
                <span className="relative">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
              <Link 
                href="/partner-program"
                className="text-white/95 hover:text-yellow-200 transition-all duration-300 font-semibold text-sm uppercase tracking-wider group relative"
                title="Earn more together? Contact us for referral opportunities"
              >
                <span className="relative">
                  Partner Program
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </nav>

            {/* Right side actions - Search and Cart */}
            <div className="flex items-center space-x-3 ml-auto flex-shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-white/95 hover:text-yellow-200 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="relative p-2.5 text-white/95 hover:text-yellow-200 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-500 text-red-700 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white shadow-lg animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 text-white/95 hover:text-yellow-200 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-4 border-t border-white/30 backdrop-blur-sm">
              <form onSubmit={handleSearch} className="relative mt-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border-2 border-white/40 rounded-lg bg-white/95 text-red-900 placeholder-red-400/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 shadow-lg transition-all duration-300 font-medium"
                />
              </form>
            </div>
          )}

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/30 bg-red-700/60 backdrop-blur-md">
              <nav className="flex flex-col space-y-1">
                <Link
                  href="/"
                  className="text-white/95 hover:text-yellow-200 hover:bg-white/20 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-white/95 hover:text-yellow-200 hover:bg-white/20 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className="text-white/95 hover:text-yellow-200 hover:bg-white/20 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-white/95 hover:text-yellow-200 hover:bg-white/20 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/partner-program"
                  className="text-white/95 hover:text-yellow-200 hover:bg-white/20 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm uppercase tracking-wider"
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
