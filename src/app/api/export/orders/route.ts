import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

export async function GET() {
  try {
    const orders = await databaseService.getOrders()
    const headers = ['id','customerEmail','customerName','total','status','paymentStatus','createdAt','updatedAt']
    const csv = [headers.join(',')].concat(orders.map(o => headers.map(h => JSON.stringify(o[h] ?? '')).join(','))).join('\n')
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="orders.csv"'
      }
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to export orders' }, { status: 500 })
  }
}


