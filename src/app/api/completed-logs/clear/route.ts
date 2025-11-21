import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'

export async function POST(request: NextRequest) {
  try {
    const result = await databaseService.clearCompletedOrderLogs()
    
    if (result) {
      return NextResponse.json({ success: true, message: 'All completed order logs have been cleared' })
    } else {
      return NextResponse.json({ success: false, message: 'Failed to clear completed order logs' }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error clearing completed order logs:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to clear completed order logs' }, { status: 500 })
  }
}
