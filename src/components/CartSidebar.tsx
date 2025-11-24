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
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 border-l border-gray-300 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#eae4df' }}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-300 bg-white">
            <h2 className="text-lg font-medium text-gray-900">
              Shopping Cart
            </h2>
            <button
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
              className="p-2 hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-700 mb-4 font-medium">Your cart is empty</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => dispatch({ type: 'CLOSE_CART' })}
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${item.color}-${index}`} className="bg-white border border-gray-300 p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product.images[0]} alt={item.product.name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">
                          Size {item.size} • {item.color === 'default' || item.color === 'original' ? 'Original Color' : item.color}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
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
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-300"
                            title="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="w-10 text-center text-gray-900 font-medium">{item.quantity}</span>
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
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-300"
                            title="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-gray-700" />
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
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
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
            <div className="border-t border-gray-300 p-6 space-y-4 bg-white">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
                </div>
                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Shipping</span>
                  <span className="text-gray-900 font-medium">{shipping > 0 ? formatPrice(shipping) : 'Free'}</span>
                </div> */}
                {/* <div className="flex justify-between font-medium text-lg border-t border-gray-300 pt-2">
                  <span className="text-gray-900">
                    Total
                  </span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div> */}
              </div>
              <Link
                href="/checkout"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-center block font-medium transition-colors"
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
