import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function GET() {
  try {
    const customers = databaseService.getCustomers()
    return NextResponse.json({ customers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
