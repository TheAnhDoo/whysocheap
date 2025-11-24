'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Mail, Home, ShoppingBag, Clock, Phone } from 'lucide-react'

// EU Countries list (same as checkout)
const EU_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy',
  'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal',
  'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'
]

export default function ThankYouPage() {
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get order data from session storage or URL params
    const urlParams = new URLSearchParams(window.location.search)
    const orderId = urlParams.get('orderId') || `ORD-${Date.now()}`
    const orderDate = urlParams.get('date') || new Date().toLocaleDateString()
    const country = urlParams.get('country') || 'United States'
    
    // Calculate shipping time based on country
    let shippingTime = '30 days'
    let shippingText = 'Worldwide orders arrive within 30 days'
    
    if (country === 'United States') {
      shippingTime = '7 days'
      shippingText = 'USA orders arrive within 7 days'
    } else if (EU_COUNTRIES.includes(country)) {
      shippingTime = '14 days'
      shippingText = 'EU orders arrive within 14 days'
    }
    
    setOrderData({
      orderId,
      orderDate,
      country,
      shippingTime,
      shippingText,
      status: 'Processing'
    })
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#eae4df' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eae4df' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Animation */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-10">
            <div className="w-24 h-24 border-2 border-gray-900 rounded-full flex items-center justify-center mx-auto bg-white">
              <CheckCircle className="w-12 h-12 text-gray-900" />
            </div>
          </div>
          

          <h1 className="text-4xl lg:text-5xl font-light mb-6" style={{ color: '#851A1B' }}>
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Thank you for your purchase! Your order has been successfully placed and is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border border-gray-300 p-10 mb-10">
          <div className="flex items-center space-x-3 mb-8">
            <Package className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-light" style={{ color: '#851A1B' }}>
              Order Details
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Order Number</span>
                <span className="text-gray-900 font-mono font-medium">{orderData?.orderId}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Order Date</span>
                <span className="text-gray-900 font-medium">{orderData?.orderDate}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium bg-white">
                  {orderData?.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="py-3 border-b border-gray-200">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600 font-medium flex-shrink-0">Payment</span>
                  <p className="text-gray-900 text-sm leading-relaxed text-right flex-1">
                    Payment is held and will be charged after 1-2 business days (you can{' '}
                    <Link href="/contact" className="underline hover:text-gray-700 transition-colors">
                      cancel
                    </Link>
                    {' '}it at anytime)
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Processing Time</span>
                <span className="text-gray-900 font-medium">1-2 Business Days</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Estimated Delivery</span>
                <span className="text-gray-900 font-medium">{orderData?.shippingTime || '30 days'}</span>
              </div>
            </div>
          </div>
        </div>



        {/* What's Next Section */}
        <div className="bg-white border border-gray-300 p-10 mb-10">
          <div className="flex items-center space-x-3 mb-10">
            <Clock className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-light" style={{ color: '#851A1B' }}>What's Next?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 border border-gray-300 rounded-sm flex items-center justify-center mx-auto mb-4 bg-white">
                <Mail className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>Confirmation Email</h3>
              <p className="text-sm text-gray-600">You'll receive an order confirmation email shortly with all the details.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 border border-gray-300 rounded-sm flex items-center justify-center mx-auto mb-4 bg-white">
                <Package className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>Order Processing</h3>
              <p className="text-sm text-gray-600">Your order will be processed and prepared for shipping within 1-2 business days.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 border border-gray-300 rounded-sm flex items-center justify-center mx-auto mb-4 bg-white">
                <Truck className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-medium mb-2" style={{ color: '#851A1B' }}>Tracking Information</h3>
              <p className="text-sm text-gray-600">You'll receive tracking information once your order ships.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white border border-gray-300 p-10 mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="w-6 h-6 text-gray-700" />
            <h3 className="text-xl font-light" style={{ color: '#851A1B' }}>
              Need Help?
            </h3>
          </div>
          <p className="text-gray-700 mb-6">
            Our support team is here to help with any questions about your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </Link>
            <Link 
              href="mailto:support@whysocheap.com" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors"
            >
              Email Us
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
          
          <p className="text-sm text-gray-600">
            Thank you for choosing WhySoCheap! We appreciate your business.
          </p>
        </div>
      </div>
    </div>
  )
}
