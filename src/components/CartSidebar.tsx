'use client'

import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default function CartSidebar() {
  const { state, dispatch } = useCart()

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal > 0 ? 5.99 : 0
  const total = subtotal + shipping

  return (
    <>
      {/* Overlay */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => dispatch({ type: 'CLOSE_CART' })}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-red-50 via-white to-green-50 shadow-strong transform transition-transform duration-300 ease-in-out z-50 border-l-4 border-red-300 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-4 border-red-300 bg-gradient-to-r from-red-600 to-green-700 text-white relative z-10">
            <h2 className="text-lg font-semibold">
              Shopping Cart
            </h2>
            <button
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
              className="p-2 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-yellow-200" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 relative z-10">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-red-700 mb-4 font-medium">Your cart is empty</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg transition-colors border-2 border-red-800 shadow-lg"
                  onClick={() => dispatch({ type: 'CLOSE_CART' })}
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 rounded-lg p-4 hover:border-red-400 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-red-50 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-red-200">
                        {item.product.images && item.product.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product.images[0]} alt={item.product.name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-red-800">{item.product.name}</h3>
                        <p className="text-sm text-red-600">
                          Size {item.size} • {item.color === 'default' || item.color === 'original' ? 'Original Color' : item.color}
                        </p>
                        <p className="text-sm font-medium text-red-900">
                          {formatPrice(item.product.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (item.quantity > 1) {
                                dispatch({
                                  type: 'UPDATE_QUANTITY',
                                  payload: { 
                                    productId: item.productId,
                                    size: item.size,
                                    color: item.color,
                                    quantity: item.quantity - 1 
                                  }
                                })
                              } else {
                                dispatch({
                                  type: 'REMOVE_ITEM',
                                  payload: { productId: item.productId, size: item.size, color: item.color }
                                })
                              }
                            }}
                            className="w-7 h-7 flex items-center justify-center hover:bg-red-100 rounded-md transition-colors border-2 border-red-300 bg-red-50"
                            title="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-red-700" />
                          </button>
                          <span className="w-10 text-center text-red-900 font-medium font-bold">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              dispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: { 
                                  productId: item.productId,
                                  size: item.size,
                                  color: item.color,
                                  quantity: item.quantity + 1 
                                }
                              })
                            }}
                            className="w-7 h-7 flex items-center justify-center hover:bg-green-100 rounded-md transition-colors border-2 border-green-300 bg-green-50"
                            title="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-green-700" />
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            dispatch({
                              type: 'REMOVE_ITEM',
                              payload: { productId: item.productId, size: item.size, color: item.color }
                            })
                          }}
                          className="p-1.5 text-red-700 hover:bg-red-100 rounded-md transition-colors border-2 border-red-300 bg-red-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t-4 border-red-300 p-6 space-y-4 bg-gradient-to-br from-white to-green-50 relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-700 font-medium">Subtotal</span>
                  <span className="text-red-900 font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-700 font-medium">Shipping</span>
                  <span className="text-red-900 font-semibold">{shipping > 0 ? formatPrice(shipping) : 'Free'}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t-2 border-red-300 pt-2">
                  <span className="text-red-800">
                    Total
                  </span>
                  <span className="text-red-900">{formatPrice(total)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg text-center block font-semibold border-2 border-red-800 shadow-lg transition-all"
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
