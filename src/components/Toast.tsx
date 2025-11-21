'use client'

import { useEffect, useState } from 'react'

type ToastProps = {
  open: boolean
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  durationMs?: number
}

export default function Toast({ open, message, type = 'info', onClose, durationMs = 2000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      const t = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, durationMs)
      return () => clearTimeout(t)
    } else {
      setIsVisible(false)
    }
  }, [open, durationMs, onClose])

  if (!open && !isVisible) return null

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  }

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className={`flex items-center gap-3 ${bgColors[type]} text-white px-5 py-3 rounded-lg shadow-xl min-w-[280px] max-w-[90vw] backdrop-blur-sm`}>
        <span className="text-lg font-bold">{icons[type]}</span>
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-white/80 hover:text-white transition-colors text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}
