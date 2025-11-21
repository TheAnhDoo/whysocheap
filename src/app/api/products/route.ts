import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const collectionId = searchParams.get('collectionId')
    const id = searchParams.get('id')
    const includeCollection = searchParams.get('includeCollection') === 'true'
    
    // Get single product by ID
    if (id) {
      const product = await databaseService.getProduct(id)
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ product })
    }
    
    // Get multiple products
    let products
    if (featured === 'true') {
      products = await databaseService.getFeaturedProducts()
    } else if (collectionId) {
      const allProducts = await databaseService.getProducts()
      products = allProducts.filter((p: any) => p.collectionId === collectionId)
    } else if (category) {
      const allProducts = await databaseService.getProducts()
      products = allProducts.filter((p: any) => p.category === category)
    } else {
      products = await databaseService.getProducts()
    }

    if (includeCollection) {
      const collections = await databaseService.getCollections()
      products = products.map((p: any) => ({
        ...p,
        collection: p.collectionId ? collections.find((c: any) => c.id === p.collectionId) || null : null
      }))
    }

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newProduct = await databaseService.createProduct(body)
    
    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT /api/products
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    const updatedProduct = await databaseService.updateProduct(id, updates)
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const deleted = await databaseService.deleteProduct(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
