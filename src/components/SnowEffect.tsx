'use client'

import Script from 'next/script'

export default function SnowEffect() {
  return (
    <Script 
      src="https://app.embed.im/snow.js" 
      strategy="afterInteractive"
      defer
    />
  )
}

