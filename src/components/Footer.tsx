import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-red-900 via-red-800 to-green-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white drop-shadow-lg">WhySoCheap</span>
            </Link>
            <p className="text-yellow-100 text-sm">Premium idol-themed T-shirts. Quality materials. Fast shipping.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-yellow-200 hover:text-yellow-300 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-yellow-200 hover:text-yellow-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-yellow-200 hover:text-yellow-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-yellow-200 hover:text-yellow-300 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-yellow-200">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-yellow-100 hover:text-yellow-300 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-yellow-100 hover:text-yellow-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-yellow-100 hover:text-yellow-300 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-yellow-100 hover:text-yellow-300 transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-yellow-200">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="text-yellow-100 hover:text-yellow-300 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-yellow-100 hover:text-yellow-300 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-yellow-100 hover:text-yellow-300 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-yellow-100 hover:text-yellow-300 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Minimal column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-yellow-200">Get in touch</h3>
            <p className="text-yellow-100 text-sm">
              support@whysocheap.app
            </p>
          </div>
        </div>

        <div className="border-t border-yellow-300/30 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-yellow-100 text-sm">
            © 2024 WhySoCheap. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
