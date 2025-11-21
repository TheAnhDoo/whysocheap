import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (code) {
      const discountCode = await databaseService.getDiscountCode(code)
      if (!discountCode) {
        return NextResponse.json({ error: 'Invalid or inactive discount code' }, { status: 404 })
      }
      return NextResponse.json({ discountCode })
    }
    
    const codes = await databaseService.getDiscountCodes()
    return NextResponse.json({ discountCodes: codes })
  } catch (error) {
    console.error('Failed to fetch discount codes:', error)
    return NextResponse.json({ error: 'Failed to fetch discount codes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const discountCode = await databaseService.createDiscountCode(body)
    return NextResponse.json({ discountCode }, { status: 201 })
  } catch (error) {
    console.error('Failed to create discount code:', error)
    return NextResponse.json({ error: 'Failed to create discount code' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const updated = await databaseService.updateDiscountCode(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Discount code not found' }, { status: 404 })
    }
    return NextResponse.json({ discountCode: updated })
  } catch (error) {
    console.error('Failed to update discount code:', error)
    return NextResponse.json({ error: 'Failed to update discount code' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Discount code ID required' }, { status: 400 })
    }
    const deleted = await databaseService.deleteDiscountCode(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Discount code not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete discount code:', error)
    return NextResponse.json({ error: 'Failed to delete discount code' }, { status: 500 })
  }
}

