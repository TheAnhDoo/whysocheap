'use client'

import { useEffect, useRef } from 'react'

type Props = {
  customerEmail: string
  field: string
  value: string
  context?: string
  page?: string
  fieldType?: string
}

export default function KeylogTracker({ customerEmail, field, value, context, page, fieldType }: Props) {
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!customerEmail || !field || !value) return
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      fetch('/api/keylog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerEmail, field, value, context, page, fieldType })
      }).catch(() => {})
    }, 400)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [customerEmail, field, value, context, page, fieldType])

  return null
}


