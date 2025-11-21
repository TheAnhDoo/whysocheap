import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

// GET /api/collections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const withCounts = searchParams.get('withCounts') === 'true'
    const collections = databaseService.getCollections() as any[]

    if (!withCounts) {
      return NextResponse.json({ collections })
    }

    const products = databaseService.getProducts() as any[]
    const counts: Record<string, number> = {}
    products.forEach((p: any) => {
      const key = p.collectionId || p.category || 'Uncategorized'
      counts[key] = (counts[key] || 0) + 1
    })

    const collectionsWithCounts = collections.map((c: any) => ({
      ...c,
      count: counts[c.id] || counts[c.slug] || counts[c.name] || 0
    }))
    return NextResponse.json({ collections: collectionsWithCounts })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load collections' }, { status: 500 })
  }
}

// POST /api/collections
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const created = databaseService.createCollection(body)
    return NextResponse.json({ collection: created }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
  }
}

// PUT /api/collections
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const updated = databaseService.updateCollection(id, updates)
    if (!updated) return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    return NextResponse.json({ collection: updated })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 })
  }
}

// DELETE /api/collections?id=...
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const deleted = databaseService.deleteCollection(id)
    if (!deleted) return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    return NextResponse.json({ message: 'Collection deleted' })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 })
  }
}


