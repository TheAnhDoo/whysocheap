import { Product, Order } from '@/types'

// Mock product data
export const mockProduct: Product = {
  id: '1',
  name: 'BTS Dynamite T-Shirt',
  description: 'Premium quality cotton T-shirt featuring your favorite K-pop idols. Perfect for concerts, fan meetings, or casual wear. Made with 100% organic cotton for ultimate comfort.',
  price: 29.99,
  images: [
    '/images/bts-dynamite-front.jpg',
    '/images/bts-dynamite-back.jpg',
    '/images/bts-dynamite-detail.jpg'
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['white', 'black', 'gray'],
  material: '100% Organic Cotton',
  washingGuide: 'Machine wash cold, tumble dry low. Do not bleach. Iron on reverse side.',
  printType: 'High-quality screen print',
  inStock: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

// Mock orders data for admin panel
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerEmail: 'john.doe@email.com',
    customerName: 'John Doe',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    items: [{
      productId: '1',
      product: mockProduct,
      size: 'M',
      color: 'black',
      quantity: 1
    }],
    subtotal: 29.99,
    shipping: 5.99,
    discount: 0,
    total: 35.98,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'ORD-002',
    customerEmail: 'jane.smith@email.com',
    customerName: 'Jane Smith',
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '+1-555-0456',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    items: [{
      productId: '1',
      product: mockProduct,
      size: 'L',
      color: 'white',
      quantity: 2
    }],
    subtotal: 59.98,
    shipping: 5.99,
    discount: 5.00,
    total: 60.97,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16')
  }
]

// API functions
export async function getProduct(id: string): Promise<Product> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockProduct
}

export async function getOrders(): Promise<Order[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockOrders
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    customerEmail: orderData.customerEmail || '',
    customerName: orderData.customerName || '',
    shippingAddress: orderData.shippingAddress || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    shipping: orderData.shipping || 0,
    discount: orderData.discount || 0,
    total: orderData.total || 0,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  return newOrder
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const order = mockOrders.find(o => o.id === orderId)
  if (!order) throw new Error('Order not found')
  
  order.status = status
  order.updatedAt = new Date()
  
  return order
}
