"use client"

import { useEffect, useMemo, useState } from 'react'
import Toast from '@/components/Toast'
import Modal from '@/components/Modal'

type Collection = { id: string; name: string; slug: string; image?: string; description?: string; featured?: boolean; count?: number }
type Product = any
type ProductType = { id: string; name: string; material: string; printType: string; washingGuide: string }

export default function AdminPage() {
  const [tab, setTab] = useState<'collections' | 'products' | 'product-types' | 'discount-codes' | 'danger'>('collections')
  const [collections, setCollections] = useState<Collection[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [discountCodes, setDiscountCodes] = useState<any[]>([])
  const [toast, setToast] = useState<{ open: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ open: false, message: '' })

  const [newCollection, setNewCollection] = useState<Partial<Collection>>({ name: '', slug: '' })
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [showCollectionModal, setShowCollectionModal] = useState(false)

  const [newProduct, setNewProduct] = useState<any>({ name: '', description: '', price: 0, collectionId: '', productTypeId: '', category: '', images: '', sizes: '', colors: '', featured: false })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)

  const [newProductType, setNewProductType] = useState<Partial<ProductType>>({ name: '', material: '', printType: '', washingGuide: '' })
  const [showProductTypeModal, setShowProductTypeModal] = useState(false)

  const [newDiscountCode, setNewDiscountCode] = useState<{ code: string; discountPercent: number }>({ code: '', discountPercent: 20 })
  const [showDiscountCodeModal, setShowDiscountCodeModal] = useState(false)

  const load = async () => {
    const [c, p, pt, dc] = await Promise.all([
      fetch('/api/collections?withCounts=true').then(r => r.json()).catch(() => ({ collections: [] })),
      fetch('/api/products').then(r => r.json()).catch(() => ({ products: [] })),
      fetch('/api/product-types').then(r => r.json()).catch(() => ({ productTypes: [] })),
      fetch('/api/discount-codes').then(r => r.json()).catch(() => ({ discountCodes: [] })),
    ])
    setCollections(c.collections || [])
    // Normalize products to ensure images, sizes, and colors are always arrays
    const normalizedProducts = (p.products || []).map((product: any) => ({
      ...product,
      images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []),
      sizes: Array.isArray(product.sizes) ? product.sizes : (product.sizes ? [product.sizes] : []),
      colors: Array.isArray(product.colors) ? product.colors : (product.colors ? [product.colors] : [])
    }))
    setProducts(normalizedProducts)
    setProductTypes(pt.productTypes || [])
    setDiscountCodes(dc.discountCodes || [])
  }

  useEffect(() => { load() }, [])

  const addCollection = async () => {
    if (!newCollection.name || !newCollection.slug) return
    const res = await fetch('/api/collections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCollection) })
    if (!res.ok) return setToast({ open: true, message: 'Failed to create collection', type: 'error' })
    setToast({ open: true, message: 'Collection created', type: 'success' })
    setShowCollectionModal(false)
    setNewCollection({ name: '', slug: '' })
    load()
  }

  const updateCollection = async () => {
    if (!editingCollection || !newCollection.name || !newCollection.slug) return
    const res = await fetch('/api/collections', { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ id: editingCollection.id, ...newCollection }) 
    })
    if (!res.ok) return setToast({ open: true, message: 'Failed to update collection', type: 'error' })
    setToast({ open: true, message: 'Collection updated', type: 'success' })
    setShowCollectionModal(false)
    setEditingCollection(null)
    setNewCollection({ name: '', slug: '' })
    load()
  }

  const editCollection = (collection: Collection) => {
    setEditingCollection(collection)
    setNewCollection({ name: collection.name, slug: collection.slug, image: collection.image, description: collection.description, featured: collection.featured })
    setShowCollectionModal(true)
  }

  const deleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection? Products in this collection will lose their collection association.')) return
    const res = await fetch(`/api/collections?id=${id}`, { method: 'DELETE' })
    if (!res.ok) return setToast({ open: true, message: 'Failed to delete collection', type: 'error' })
    setToast({ open: true, message: 'Collection deleted', type: 'success' })
    load()
  }

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      ...newProduct,
      images: newProduct.images ? newProduct.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      sizes: newProduct.sizes ? newProduct.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      colors: newProduct.colors ? newProduct.colors.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      featured: newProduct.featured || false
    }
    const method = editingProduct ? 'PUT' : 'POST'
    const url = editingProduct ? '/api/products' : '/api/products'
    const payload = editingProduct ? { ...body, id: editingProduct.id } : body
    
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) return setToast({ open: true, message: editingProduct ? 'Failed to update product' : 'Failed to add product', type: 'error' })
    setToast({ open: true, message: editingProduct ? 'Product updated' : 'Product added', type: 'success' })
    setNewProduct({ name: '', description: '', price: 0, collectionId: '', productTypeId: '', category: '', images: '', sizes: '', colors: '', featured: false })
    setEditingProduct(null)
    setShowProductModal(false)
    load()
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    if (!res.ok) return setToast({ open: true, message: 'Failed to delete product', type: 'error' })
    setToast({ open: true, message: 'Product deleted', type: 'success' })
    load()
  }

  const toggleFeatured = async (product: Product) => {
    const res = await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id, featured: !product.featured })
    })
    if (!res.ok) return setToast({ open: true, message: 'Failed to update product', type: 'error' })
    setToast({ open: true, message: `Product ${!product.featured ? 'added to' : 'removed from'} hot products`, type: 'success' })
    load()
  }

  const editProduct = (product: Product) => {
    setEditingProduct(product)
    // Ensure images, sizes, and colors are arrays before joining
    const imagesArray = Array.isArray(product.images) 
      ? product.images 
      : (product.images ? [product.images] : [])
    const sizesArray = Array.isArray(product.sizes) 
      ? product.sizes 
      : (product.sizes ? [product.sizes] : [])
    const colorsArray = Array.isArray(product.colors) 
      ? product.colors 
      : (product.colors ? [product.colors] : [])
    
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      collectionId: product.collectionId || '',
      productTypeId: product.productTypeId || '',
      category: product.category || '',
      images: imagesArray.join(', ') || '',
      sizes: sizesArray.join(',') || '',
      colors: colorsArray.join(',') || '',
      featured: product.featured || false
    })
    setShowProductModal(true)
  }

  const addProductType = async () => {
    if (!newProductType.name) return
    const method = newProductType.id ? 'PUT' : 'POST'
    const url = '/api/product-types'
    const payload = newProductType.id ? { ...newProductType, id: newProductType.id } : newProductType
    
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) return setToast({ open: true, message: 'Failed to save product type', type: 'error' })
    setToast({ open: true, message: newProductType.id ? 'Product type updated' : 'Product type created', type: 'success' })
    setNewProductType({ name: '', material: '', printType: '', washingGuide: '' })
    setShowProductTypeModal(false)
    load()
  }

  const deleteProductType = async (id: string) => {
    if (!confirm('Are you sure? Products using this type will lose their details.')) return
    const res = await fetch(`/api/product-types?id=${id}`, { method: 'DELETE' })
    if (!res.ok) return setToast({ open: true, message: 'Failed to delete product type', type: 'error' })
    setToast({ open: true, message: 'Product type deleted', type: 'success' })
    load()
  }

  const addDiscountCode = async () => {
    if (!newDiscountCode.code) return
    const res = await fetch('/api/discount-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDiscountCode)
    })
    if (!res.ok) return setToast({ open: true, message: 'Failed to create discount code', type: 'error' })
    setToast({ open: true, message: 'Discount code created', type: 'success' })
    setNewDiscountCode({ code: '', discountPercent: 20 })
    setShowDiscountCodeModal(false)
    load()
  }

  const deleteDiscountCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) return
    const res = await fetch(`/api/discount-codes?id=${id}`, { method: 'DELETE' })
    if (!res.ok) return setToast({ open: true, message: 'Failed to delete discount code', type: 'error' })
    setToast({ open: true, message: 'Discount code deleted', type: 'success' })
    load()
  }

  const collectionsById = useMemo(() => Object.fromEntries(collections.map(c => [c.id, c])), [collections])
  const productTypesById = useMemo(() => Object.fromEntries(productTypes.map(pt => [pt.id, pt])), [productTypes])

  const resetDatabase = async () => {
    const res = await fetch('/api/database/reset', { method: 'POST' })
    if (!res.ok) return setToast({ open: true, message: 'Failed to reset database', type: 'error' })
    setToast({ open: true, message: 'Database reset', type: 'success' })
    load()
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ open: false, message: '' })} />
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        <button className={`px-4 py-2 rounded ${tab === 'collections' ? 'btn-primary' : 'border'}`} onClick={() => setTab('collections')}>Collections</button>
        <button className={`px-4 py-2 rounded ${tab === 'products' ? 'btn-primary' : 'border'}`} onClick={() => setTab('products')}>Products</button>
        <button className={`px-4 py-2 rounded ${tab === 'product-types' ? 'btn-primary' : 'border'}`} onClick={() => setTab('product-types')}>Product Types</button>
        <button className={`px-4 py-2 rounded ${tab === 'discount-codes' ? 'btn-primary' : 'border'}`} onClick={() => setTab('discount-codes')}>Discount Codes</button>
        <button className={`px-4 py-2 rounded ${tab === 'danger' ? 'bg-red-600 text-white' : 'border border-red-600 text-red-600'}`} onClick={() => setTab('danger')}>Danger Zone</button>
      </div>

      {tab === 'collections' && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Collections</h2>
            <button className="btn-primary px-4 py-2 rounded" onClick={() => setShowCollectionModal(true)}>New Collection</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections.map(col => (
              <div key={col.id} className="card-elevated p-4">
                <div className="font-semibold mb-2">{col.name}</div>
                <div className="text-sm text-primary-600 mb-1">{col.count || 0} products</div>
                <div className="text-xs text-primary-500 mb-3">/{col.slug}</div>
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 border rounded hover:bg-gray-50 transition-colors" onClick={() => editCollection(col)}>Edit</button>
                  <button className="text-xs px-2 py-1 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors" onClick={() => deleteCollection(col.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'product-types' && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Product Types</h2>
            <button className="btn-primary px-4 py-2 rounded" onClick={() => { setNewProductType({ name: '', material: '', printType: '', washingGuide: '' }); setShowProductTypeModal(true) }}>New Product Type</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productTypes.map(pt => (
              <div key={pt.id} className="card-elevated p-4">
                <div className="font-semibold mb-2">{pt.name}</div>
                <div className="text-sm space-y-1">
                  <div><strong>Material:</strong> {pt.material || '-'}</div>
                  <div><strong>Print Type:</strong> {pt.printType || '-'}</div>
                  <div><strong>Washing:</strong> {pt.washingGuide || '-'}</div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs px-2 py-1 border rounded" onClick={() => { setNewProductType(pt); setShowProductTypeModal(true) }}>Edit</button>
                  <button className="text-xs px-2 py-1 border border-red-600 text-red-600 rounded" onClick={() => deleteProductType(pt.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'discount-codes' && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Discount Codes</h2>
            <button className="btn-primary px-4 py-2 rounded" onClick={() => { setNewDiscountCode({ code: '', discountPercent: 20 }); setShowDiscountCodeModal(true) }}>New Discount Code</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {discountCodes.map(dc => (
              <div key={dc.id} className="card-elevated p-4">
                <div className="font-semibold mb-2 text-primary-900">{dc.code}</div>
                <div className="text-sm space-y-1">
                  <div><strong>Discount:</strong> {dc.discountPercent}%</div>
                  <div className={`text-xs ${dc.active ? 'text-green-600' : 'text-gray-500'}`}>
                    {dc.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs px-2 py-1 border border-red-600 text-red-600 rounded" onClick={() => deleteDiscountCode(dc.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'products' && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Products</h2>
            <button className="btn-primary px-4 py-2 rounded" onClick={() => { setEditingProduct(null); setNewProduct({ name: '', description: '', price: 0, collectionId: '', productTypeId: '', category: '', images: '', sizes: '', colors: '', featured: false }); setShowProductModal(true) }}>Add Product</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Collection</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Hot</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p.id}>
                    <td className="p-2 border">{p.name}</td>
                    <td className="p-2 border">{p.collectionId ? (collectionsById[p.collectionId]?.name || p.collectionId) : (p.category || '-')}</td>
                    <td className="p-2 border">{p.productTypeId ? (productTypesById[p.productTypeId]?.name || '-') : '-'}</td>
                    <td className="p-2 border">${p.price}</td>
                    <td className="p-2 border">
                      <button onClick={() => toggleFeatured(p)} className={`px-2 py-1 text-xs rounded ${p.featured ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                        {p.featured ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 border rounded" onClick={() => editProduct(p)}>Edit</button>
                        <button className="text-xs px-2 py-1 border border-red-600 text-red-600 rounded" onClick={() => deleteProduct(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <a className="px-4 py-2 border rounded" href="/api/export/customers">Export Customers CSV</a>
            <a className="px-4 py-2 border rounded" href="/api/export/orders">Export Orders CSV</a>
            <a className="px-4 py-2 border rounded" href="/api/export/keylogs?mode=completed">Export Completed Logs</a>
            <a className="px-4 py-2 border rounded" href="/api/export/keylogs?mode=latest">Export Latest Snapshot</a>
            <a className="px-4 py-2 border rounded" href="/api/export/keylogs?mode=raw">Export Real-time Keylogs</a>
            <a className="px-4 py-2 border rounded" href="/api/export/keylogs?mode=json">Export json</a>
          </div>
        </section>
      )}

      {tab === 'danger' && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
          
          <div className="space-y-4 border-t pt-4">
            <div>
              <h3 className="font-semibold mb-2">Clear Completed Order Logs</h3>
              <p className="text-sm text-primary-700 mb-2">This will permanently delete all completed order logs from the database. This action cannot be undone.</p>
              <button 
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded" 
                onClick={async () => {
                  if (!confirm('Are you sure you want to clear all completed order logs? This action cannot be undone.')) return
                  const res = await fetch('/api/completed-logs/clear', { method: 'POST' })
                  if (!res.ok) {
                    const data = await res.json()
                    return setToast({ open: true, message: data.message || 'Failed to clear completed order logs', type: 'error' })
                  }
                  setToast({ open: true, message: 'All completed order logs have been cleared', type: 'success' })
                }}
              >
                Clear All Completed Logs
              </button>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Reset Entire Database</h3>
              <p className="text-sm text-primary-700 mb-2">This will erase all data and recreate empty tables.</p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={resetDatabase}>Reset Database</button>
            </div>
          </div>
        </section>
      )}

      <Modal open={showCollectionModal} title={editingCollection ? 'Edit Collection' : 'Create Collection'} onClose={() => { setShowCollectionModal(false); setEditingCollection(null); setNewCollection({ name: '', slug: '' }) }}
        primaryAction={{ label: editingCollection ? 'Update' : 'Create', onClick: editingCollection ? updateCollection : addCollection }}
        secondaryAction={{ label: 'Cancel', onClick: () => { setShowCollectionModal(false); setEditingCollection(null); setNewCollection({ name: '', slug: '' }) } }}
      >
        <div className="space-y-3">
          <input className="input-field" placeholder="Name" value={newCollection.name || ''} onChange={e => setNewCollection({ ...newCollection, name: e.target.value })} />
          <input className="input-field" placeholder="Slug" value={newCollection.slug || ''} onChange={e => {
            const slug = e.target.value.replace(/\s+/g, '-').toLowerCase()
            setNewCollection({ ...newCollection, slug })
          }} />
          <input className="input-field" placeholder="Image URL (optional)" value={newCollection.image || ''} onChange={e => setNewCollection({ ...newCollection, image: e.target.value })} />
          <textarea className="input-field" placeholder="Description (optional)" value={newCollection.description || ''} onChange={e => setNewCollection({ ...newCollection, description: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!newCollection.featured} onChange={e => setNewCollection({ ...newCollection, featured: e.target.checked })} /> Featured</label>
        </div>
      </Modal>

      <Modal open={showProductModal} title={editingProduct ? 'Edit Product' : 'Add Product'} onClose={() => { setShowProductModal(false); setEditingProduct(null) }}
        primaryAction={{ label: editingProduct ? 'Update' : 'Save', onClick: () => { const fakeEvent = { preventDefault: () => {} } as React.FormEvent; addProduct(fakeEvent) } }}
        secondaryAction={{ label: 'Cancel', onClick: () => { setShowProductModal(false); setEditingProduct(null) } }}
      >
        <form onSubmit={addProduct} className="space-y-3">
          <input className="input-field" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
          <select className="input-field" value={newProduct.collectionId} onChange={e => setNewProduct({ ...newProduct, collectionId: e.target.value })} required>
            <option value="">Select collection</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select className="input-field" value={newProduct.productTypeId} onChange={e => setNewProduct({ ...newProduct, productTypeId: e.target.value })}>
            <option value="">Select product type (optional)</option>
            {productTypes.map(pt => (
              <option key={pt.id} value={pt.id}>{pt.name}</option>
            ))}
          </select>
          <input className="input-field" placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
          <input className="input-field" placeholder="Price" type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value || '0') })} required />
          <input className="input-field" placeholder="Image URLs (comma-separated, supports many)" value={newProduct.images} onChange={e => setNewProduct({ ...newProduct, images: e.target.value })} />
          <input className="input-field" placeholder="Sizes (S,M,L)" value={newProduct.sizes} onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value })} />
          <input className="input-field" placeholder="Colors (white,black)" value={newProduct.colors} onChange={e => setNewProduct({ ...newProduct, colors: e.target.value })} />
          <textarea className="input-field" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={newProduct.featured} onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })} /> Featured (Hot Product)</label>
        </form>
      </Modal>

      <Modal open={showProductTypeModal} title={newProductType.id ? 'Edit Product Type' : 'Create Product Type'} onClose={() => { setShowProductTypeModal(false); setNewProductType({ name: '', material: '', printType: '', washingGuide: '' }) }}
        primaryAction={{ label: newProductType.id ? 'Update' : 'Create', onClick: addProductType }}
        secondaryAction={{ label: 'Cancel', onClick: () => { setShowProductTypeModal(false); setNewProductType({ name: '', material: '', printType: '', washingGuide: '' }) } }}
      >
        <div className="space-y-3">
          <input className="input-field" placeholder="Name (e.g., Premium T-Shirt)" value={newProductType.name || ''} onChange={e => setNewProductType({ ...newProductType, name: e.target.value })} required />
          <input className="input-field" placeholder="Material (e.g., 100% Organic Cotton)" value={newProductType.material || ''} onChange={e => setNewProductType({ ...newProductType, material: e.target.value })} />
          <input className="input-field" placeholder="Print Type (e.g., High-quality screen print)" value={newProductType.printType || ''} onChange={e => setNewProductType({ ...newProductType, printType: e.target.value })} />
          <textarea className="input-field" placeholder="Washing Guide (e.g., Machine wash cold, tumble dry low)" value={newProductType.washingGuide || ''} onChange={e => setNewProductType({ ...newProductType, washingGuide: e.target.value })} />
        </div>
      </Modal>

      <Modal open={showDiscountCodeModal} title="Create Discount Code" onClose={() => { setShowDiscountCodeModal(false); setNewDiscountCode({ code: '', discountPercent: 20 }) }}
        primaryAction={{ label: 'Create', onClick: addDiscountCode }}
        secondaryAction={{ label: 'Cancel', onClick: () => { setShowDiscountCodeModal(false); setNewDiscountCode({ code: '', discountPercent: 20 }) } }}
      >
        <div className="space-y-3">
          <input className="input-field" placeholder="Code (e.g., SUMMER20)" value={newDiscountCode.code} onChange={e => setNewDiscountCode({ ...newDiscountCode, code: e.target.value.toUpperCase() })} required />
          <input type="number" className="input-field" placeholder="Discount % (default: 20)" value={newDiscountCode.discountPercent} onChange={e => setNewDiscountCode({ ...newDiscountCode, discountPercent: parseFloat(e.target.value) || 20 })} />
          <p className="text-xs text-primary-600">Discount codes automatically apply a percentage discount when used at checkout.</p>
        </div>
      </Modal>
    </div>
  )
}
