import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    const orders = databaseService.getOrders()
    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newOrder = databaseService.createOrder(body)
    
    return NextResponse.json({ order: newOrder }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// PUT /api/orders
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body
    
    const updatedOrder = databaseService.updateOrderStatus(id, status)
    
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}