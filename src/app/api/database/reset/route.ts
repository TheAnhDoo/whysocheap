import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'

export async function POST() {
  try {
    databaseService.resetDatabase()
    return NextResponse.json({ message: 'Database reset successfully' })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 })
  }
}


