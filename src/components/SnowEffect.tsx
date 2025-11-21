'use client'

import Script from 'next/script'

export default function SnowEffect() {
  const initSnow = () => {
    if (typeof window !== 'undefined') {
      // Check for snowStorm in multiple ways
      const snowStorm = (window as any).snowStorm || (window as any).window?.snowStorm
      if (snowStorm) {
        try {
          // Enhanced snow settings for better visual effect
          snowStorm.flakesMax = 200 // More snowflakes
          snowStorm.flakesMaxActive = 100 // More active flakes
          snowStorm.animationInterval = 25 // Smoother animation
          snowStorm.useGPU = true // Hardware acceleration
          snowStorm.snowColor = '#ffffff' // Pure white snow
          snowStorm.snowCharacter = '❄' // Snowflake emoji
          snowStorm.snowStick = true // Snow sticks at bottom
          snowStorm.useMeltEffect = true // Melting effect
          snowStorm.useTwinkleEffect = true // Twinkling effect
          snowStorm.followMouse = true // Interactive with mouse
          snowStorm.vMaxX = 3 // Horizontal velocity
          snowStorm.vMaxY = 4 // Vertical velocity
          snowStorm.zIndex = 9999 // Above everything
          snowStorm.excludeMobile = false // Enable on mobile too
          
          // Use start() instead of startSeason() to always start regardless of month
          snowStorm.start()
        } catch (e) {
          console.log('Snow effect initialization error:', e)
        }
      }
    }
  }

  return (
    <Script 
      src="/snowstorm.js" 
      strategy="afterInteractive"
      onLoad={() => {
        // Wait a bit for the script to fully initialize
        setTimeout(initSnow, 100)
      }}
      onReady={() => {
        // Also try on ready
        setTimeout(initSnow, 100)
      }}
    />
  )
}

