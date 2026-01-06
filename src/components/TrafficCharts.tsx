'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Stats {
  websiteVisits: number
  checkoutVisits: number
  completedOrders: number
  estimatedBuyers: number
  conversionRate: string
}

type TrafficChartsProps = {
  stats?: Stats
}

interface CountryStat {
  countryCode: string
  countryName: string
  visits: number
  checkoutVisits: number
  percentage: string
}

const COLORS = ['#851A1B', '#F97316', '#FBBF24', '#84CC16', '#22C55E', '#3B82F6', '#8B5CF6']

export default function TrafficCharts({ stats: providedStats }: TrafficChartsProps) {
  const [stats, setStats] = useState<Stats | null>(providedStats ?? null)
  const [countryStats, setCountryStats] = useState<CountryStat[]>([])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (providedStats) setStats(providedStats)
  }, [providedStats])

  const loadData = async () => {
    try {
      // Prefer stats from props (Admin page already loads them)
      let nextStats: Stats | null = providedStats ?? stats

      // Load stats only when not provided
      if (!providedStats) {
        const statsRes = await fetch(`/api/tracking/stats?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        const statsData = await statsRes.json()
        if (statsData.success && statsData.stats) {
          nextStats = statsData.stats as Stats
          setStats(nextStats)
        }
      }

      // Load country stats
      const countryRes = await fetch(`/api/tracking/countries?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
      const countryData = await countryRes.json()
      if (countryData.success) {
        setCountryStats(countryData.countries || [])
      }
    } catch (error) {
      console.error('Error loading chart data:', error)
    }
  }

  // Prepare data for charts
  const conversionData = stats ? [
    { name: 'Website Visits', value: stats.websiteVisits },
    { name: 'Checkout Visits', value: stats.checkoutVisits },
    { name: 'Completed Orders', value: stats.completedOrders }
  ] : []

  const topCountries = countryStats.slice(0, 5).map(c => ({
    name: c.countryName.length > 15 ? c.countryName.substring(0, 15) + '...' : c.countryName,
    visits: c.visits,
    checkouts: c.checkoutVisits
  }))

  const funnelData = stats ? [
    { name: 'Visitors', value: stats.websiteVisits, fill: '#851A1B' },
    { name: 'Checkout', value: stats.checkoutVisits, fill: '#F97316' },
    { name: 'Orders', value: stats.completedOrders, fill: '#22C55E' }
  ].filter(item => item.value > 0) : []

  if (!stats) {
    return (
      <div className="card-elevated p-6 text-center">
        <div className="text-gray-600">Loading charts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Countries Bar Chart */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold mb-4">Top 5 Countries by Visits</h3>
          {topCountries.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCountries} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="name" type="category" stroke="#6B7280" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="visits" fill="#851A1B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No country data available yet
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart - Traffic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Distribution</h3>
          {conversionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(((typeof percent === 'number' ? percent : 0) || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Top Countries Pie Chart */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold mb-4">Top Countries Distribution</h3>
          {topCountries.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topCountries}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(((typeof percent === 'number' ? percent : 0) || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="visits"
                >
                  {topCountries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No country data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
