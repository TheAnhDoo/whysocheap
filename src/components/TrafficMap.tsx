'use client'

import { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

interface CountryStat {
  countryCode: string
  countryName: string
  visits: number
  checkoutVisits: number
  percentage: string
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function TrafficMap() {
  const [countryStats, setCountryStats] = useState<CountryStat[]>([])
  const [totalVisits, setTotalVisits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCountryStats()
    const interval = setInterval(loadCountryStats, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const loadCountryStats = async () => {
    try {
      const res = await fetch(`/api/tracking/countries?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
      const data = await res.json()
      if (data.success) {
        setCountryStats(data.countries || [])
        setTotalVisits(data.totalVisits || 0)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading country stats:', error)
      setLoading(false)
    }
  }

  const getCountryColor = (countryCode: string): string => {
    const stat = countryStats.find(s => s.countryCode === countryCode)
    if (!stat) return '#E5E7EB' // Gray for no data
    
    const visits = stat.visits
    if (visits >= 100) return '#DC2626' // Red - high traffic
    if (visits >= 50) return '#F97316' // Orange
    if (visits >= 20) return '#FBBF24' // Yellow
    if (visits >= 10) return '#84CC16' // Light green
    if (visits >= 1) return '#22C55E' // Green
    return '#E5E7EB' // Gray
  }

  if (loading) {
    return (
      <div className="card-elevated p-6 text-center">
        <div className="text-gray-600">Loading map data...</div>
      </div>
    )
  }

  if (countryStats.length === 0) {
    return (
      <div className="card-elevated p-6 text-center">
        <div className="text-gray-600">No country data available yet. Traffic will appear here as visitors come to your site.</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card-elevated p-6">
        <h3 className="text-lg font-semibold mb-4">Traffic by Country</h3>
        
        {/* Map */}
        <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden rounded-lg mb-4">
          <ComposableMap
            projectionConfig={{ scale: 147 }}
            className="w-full h-full"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = geo.properties.ISO_A2 || geo.properties.ISO_A3
                  const fillColor = getCountryColor(countryCode)
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: '#851A1B', cursor: 'pointer' },
                        pressed: { outline: 'none' }
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>No data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>1-9 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>10-19 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>20-49 visits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>50+ visits</span>
          </div>
        </div>

        {/* Country Statistics Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold">Country</th>
                <th className="text-right py-2 px-3 font-semibold">Visits</th>
                <th className="text-right py-2 px-3 font-semibold">Checkout</th>
                <th className="text-right py-2 px-3 font-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {countryStats.slice(0, 10).map((stat) => (
                <tr key={stat.countryCode} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ backgroundColor: getCountryColor(stat.countryCode) }}
                      ></div>
                      <span className="font-medium">{stat.countryName}</span>
                    </div>
                  </td>
                  <td className="text-right py-2 px-3">{stat.visits.toLocaleString()}</td>
                  <td className="text-right py-2 px-3">{stat.checkoutVisits.toLocaleString()}</td>
                  <td className="text-right py-2 px-3 font-semibold" style={{ color: '#851A1B' }}>
                    {stat.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {countryStats.length > 10 && (
            <div className="text-center py-2 text-gray-500 text-xs">
              Showing top 10 countries. Total: {countryStats.length} countries
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

