// Simple geolocation service using free IP geolocation API
// Using ip-api.com (free, no API key required, 45 requests/minute)

export interface GeoLocation {
  country: string
  countryCode: string
  city?: string
  region?: string
}

const geoCache = new Map<string, { data: GeoLocation; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function getLocationFromIP(ipAddress: string): Promise<GeoLocation> {
  // Skip localhost and private IPs
  if (!ipAddress || ipAddress === 'unknown' || ipAddress.startsWith('127.') || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
    return { country: 'Unknown', countryCode: 'XX' }
  }

  // Check cache first
  const cached = geoCache.get(ipAddress)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  try {
    // Use ip-api.com (free, no key required)
    // Rate limit: 45 requests/minute
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,city,region`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`IP API returned ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status === 'success') {
      const geoData: GeoLocation = {
        country: data.country || 'Unknown',
        countryCode: data.countryCode || 'XX',
        city: data.city,
        region: data.region
      }
      
      // Cache the result
      geoCache.set(ipAddress, { data: geoData, timestamp: Date.now() })
      
      return geoData
    } else {
      return { country: 'Unknown', countryCode: 'XX' }
    }
  } catch (error: any) {
    console.error('Error getting geolocation:', error.message)
    // Return unknown on error
    return { country: 'Unknown', countryCode: 'XX' }
  }
}

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, cached] of geoCache.entries()) {
    if (now - cached.timestamp > CACHE_TTL) {
      geoCache.delete(ip)
    }
  }
}, 60 * 60 * 1000) // Run every hour

