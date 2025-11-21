import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

export async function GET() {
  try {
    const customers = await databaseService.getCustomers()
    return NextResponse.json({ customers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
