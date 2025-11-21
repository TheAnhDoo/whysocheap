'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Mail, ArrowRight, Home, ShoppingBag, Clock, MapPin, Phone } from 'lucide-react'

export default function ThankYouPage() {
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get order data from session storage or URL params
    const urlParams = new URLSearchParams(window.location.search)
    const orderId = urlParams.get('orderId') || 'ORD-1761764339426'
    const orderDate = urlParams.get('date') || new Date().toLocaleDateString()
    
    setOrderData({
      orderId,
      orderDate,
      status: 'Confirmed'
    })
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Animation */}
        <div className="text-center mb-12 relative z-10">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse border-4 border-yellow-300">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-red-800 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-red-700 max-w-2xl mx-auto leading-relaxed">
            Thank you for your purchase! Your order has been successfully placed and is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="card-elevated p-8 mb-8 bg-gradient-to-br from-white to-red-50 backdrop-blur-sm border-4 border-red-300 rounded-2xl relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="w-6 h-6 text-red-800" />
            <h2 className="text-2xl font-bold text-red-800">
              Order Details
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-primary-100">
                <span className="text-primary-600 font-medium">Order Number</span>
                <span className="text-primary-900 font-mono font-semibold">{orderData?.orderId}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-primary-100">
                <span className="text-primary-600 font-medium">Order Date</span>
                <span className="text-primary-900 font-semibold">{orderData?.orderDate}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-primary-600 font-medium">Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {orderData?.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-primary-100">
                <span className="text-primary-600 font-medium">Payment</span>
                <span className="text-green-600 font-semibold">✓ Paid</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-primary-100">
                <span className="text-primary-600 font-medium">Processing Time</span>
                <span className="text-primary-900 font-semibold">1-2 Business Days</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-primary-600 font-medium">Estimated Delivery</span>
                <span className="text-primary-900 font-semibold">3-5 Business Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="card-elevated p-8 mb-8 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-primary-900">What's Next?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Confirmation Email</h3>
              <p className="text-sm text-primary-600">You'll receive an order confirmation email shortly with all the details.</p>
            </div>
            
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Order Processing</h3>
              <p className="text-sm text-primary-600">Your order will be processed and prepared for shipping within 1-2 business days.</p>
            </div>
            
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Tracking Information</h3>
              <p className="text-sm text-primary-600">You'll receive tracking information once your order ships.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="card-elevated p-6 mb-8 bg-gradient-to-r from-red-600 via-red-700 to-green-700 text-white border-4 border-yellow-300 rounded-2xl relative z-10">
          <div className="flex items-center space-x-3 mb-4 relative z-10">
            <Phone className="w-6 h-6 text-yellow-200" />
            <h3 className="text-xl font-bold">
              Need Help?
            </h3>
          </div>
          <p className="text-yellow-100 mb-4 relative z-10">
            Our support team is here to help with any questions about your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-yellow-400 text-red-800 font-semibold rounded-lg hover:bg-yellow-500 transition-colors border-2 border-yellow-300"
            >
              Contact Support
            </Link>
            <Link 
              href="mailto:support@whysocheap.com" 
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-yellow-300 text-white font-semibold rounded-lg hover:bg-yellow-400 hover:text-red-800 transition-colors"
            >
              Email Us
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-900 text-white font-semibold rounded-xl hover:bg-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-900 text-primary-900 font-semibold rounded-xl hover:bg-primary-900 hover:text-white transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
          
          <p className="text-sm text-red-700">
            Thank you for choosing WhySoCheap! We appreciate your business.
          </p>
        </div>
      </div>
    </div>
  )
}