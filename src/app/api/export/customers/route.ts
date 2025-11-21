import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

export async function GET() {
  try {
    const customers = await databaseService.getCustomers()
    const headers = ['email','firstName','lastName','phone','address','city','state','zipCode','country','lastIp','latitude','longitude','locationAccuracy','locationTimestamp','totalOrders','totalSpent','createdAt','updatedAt']
    const csv = [headers.join(',')].concat(customers.map(c => headers.map(h => JSON.stringify(c[h] ?? '')).join(','))).join('\n')
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="customers.csv"'
      }
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to export customers' }, { status: 500 })
  }
}


