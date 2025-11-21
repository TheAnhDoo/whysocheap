'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface ImageZoomProps {
  imageSrc: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageZoom({ imageSrc, isOpen, onClose }: ImageZoomProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(2)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imgRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
    }
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      setZoom(prev => Math.max(1.5, Math.min(5, prev + (e.deltaY > 0 ? -0.2 : 0.2))))
    }
    containerRef.current?.addEventListener('mousemove', handleMouseMove)
    containerRef.current?.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMouseMove)
      containerRef.current?.removeEventListener('wheel', handleWheel)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div ref={containerRef} className="relative max-w-5xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Zoomed"
            className="w-full h-full object-contain"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
            Scroll to zoom • Click outside to close
          </div>
        </div>
      </div>
    </div>
  )
}

