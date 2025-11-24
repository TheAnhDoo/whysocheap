'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

type ToastProps = {
  open: boolean
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  durationMs?: number
}

export default function Toast({ open, message, type = 'info', onClose, durationMs = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      setIsExiting(false)
      const t = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => {
          setIsVisible(false)
          onClose()
        }, 300)
      }, durationMs)
      return () => clearTimeout(t)
    } else {
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
      }, 300)
    }
  }, [open, durationMs, onClose])

  if (!open && !isVisible) return null

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  }

  const styles = {
    success: {
      bg: 'bg-white',
      border: 'border-gray-900',
      iconColor: 'text-green-600',
      textColor: 'text-gray-900',
      iconBg: 'bg-green-50'
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-600',
      iconColor: 'text-red-600',
      textColor: 'text-gray-900',
      iconBg: 'bg-red-50'
    },
    info: {
      bg: 'bg-white',
      border: 'border-gray-900',
      iconColor: 'text-gray-900',
      textColor: 'text-gray-900',
      iconBg: 'bg-gray-50'
    }
  }

  const style = styles[type]

  return (
    <div className={`fixed top-6 right-6 z-[9999] transition-all duration-300 ${
      isVisible && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      <div className={`flex items-center gap-4 ${style.bg} border-2 ${style.border} px-5 py-4 rounded-sm shadow-lg min-w-[320px] max-w-[90vw]`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${style.iconBg} flex items-center justify-center ${style.iconColor}`}>
          {icons[type]}
        </div>
        <span className={`flex-1 text-sm font-medium ${style.textColor}`}>{message}</span>
        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => {
              setIsVisible(false)
              onClose()
            }, 300)
          }}
          className={`flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors`}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
