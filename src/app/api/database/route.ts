import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { databaseService } from '@/lib/database'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

type PersistShape = {
  products: any[]
  orders: any[]
  customers: any[]
  keylogs: any[]
  feedbacks: any[]
}

// GET /api/database/export - Export current database to JSON
export async function GET() {
  try {
    const data = {
      products: databaseService.getProducts(),
      orders: databaseService.getOrders(),
      customers: databaseService.getCustomers(),
      keylogs: databaseService.getKeylogs(),
      feedbacks: databaseService.getFeedbacks()
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export database' },
      { status: 500 }
    )
  }
}

// POST /api/database/save - Save current state to file
export async function POST(request: NextRequest) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    
    const data: PersistShape = {
      products: databaseService.getProducts(),
      orders: databaseService.getOrders(),
      customers: databaseService.getCustomers(),
      keylogs: databaseService.getKeylogs(),
      feedbacks: databaseService.getFeedbacks()
    }
    
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
    
    return NextResponse.json({ success: true, message: 'Database saved to file' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save database' },
      { status: 500 }
    )
  }
}
