import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

export async function GET() {
  try {
    const types = await databaseService.getProductTypes()
    return NextResponse.json({ productTypes: types })
  } catch (error) {
    console.error('Failed to fetch product types:', error)
    return NextResponse.json({ error: 'Failed to fetch product types' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const productType = await databaseService.createProductType(body)
    return NextResponse.json({ productType })
  } catch (error) {
    console.error('Failed to create product type:', error)
    return NextResponse.json({ error: 'Failed to create product type' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const updated = await databaseService.updateProductType(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Product type not found' }, { status: 404 })
    }
    return NextResponse.json({ productType: updated })
  } catch (error) {
    console.error('Failed to update product type:', error)
    return NextResponse.json({ error: 'Failed to update product type' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Product type ID required' }, { status: 400 })
    }
    const deleted = await databaseService.deleteProductType(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Product type not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete product type:', error)
    return NextResponse.json({ error: 'Failed to delete product type' }, { status: 500 })
  }
}

