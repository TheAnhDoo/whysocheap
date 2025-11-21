import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

export async function POST() {
  try {
    await databaseService.resetDatabase()
    return NextResponse.json({ message: 'Database reset successfully' })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 })
  }
}


