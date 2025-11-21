export interface Product {
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
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  product: Product
  size: string
  color: string
  quantity: number
}

export interface Order {
  id: string
  customerEmail: string
  customerName: string
  shippingAddress: ShippingAddress
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: Date
  updatedAt: Date
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentInfo {
  cardholderName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export type Size = 'S' | 'M' | 'L' | 'XL'
export type Color = 'white' | 'black' | 'gray'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
