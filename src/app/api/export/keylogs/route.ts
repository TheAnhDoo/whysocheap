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
          console.log(`   useSameBillingAddress: ${snapshot.useSameBillingAddress}`)
          console.log(`   firstName: ${snapshot.firstName}`)
          console.log(`   lastName: ${snapshot.lastName}`)
          console.log(`   address: ${snapshot.address}`)
        }
        
        // Add all keys to the set
        rowKeys.forEach(key => allKeys.add(key))
        
        // Determine if using same billing address
        // Check multiple ways the flag might be stored
        const useSameBillingAddress = 
          snapshot.useSameBillingAddress === 'true' || 
          snapshot.useSameBillingAddress === true ||
          snapshot.useSameBillingAddress === 1 ||
          (!snapshot.billingAddress && !snapshot.billingFirstName && !snapshot.billingLastName && snapshot.useSameBillingAddress !== 'false' && snapshot.useSameBillingAddress !== false)
        
        // Determine address data - when useSameBillingAddress is true, use shipping fields
        // When false, use billing fields
        let addressData
        if (useSameBillingAddress) {
          // Use shipping address fields directly from snapshot
          // If shipping fields are missing but billing fields exist (and useSameBillingAddress is true),
          // use billing fields as they should be the same
          const hasShippingFields = snapshot.firstName || snapshot.lastName || snapshot.address
          const hasBillingFields = snapshot.billingFirstName || snapshot.billingLastName || snapshot.billingAddress
          
          if (hasShippingFields) {
            // Use shipping fields
            addressData = {
              firstName: snapshot.firstName || '',
              lastName: snapshot.lastName || '',
              address: snapshot.address || '',
              city: snapshot.city || '',
              state: snapshot.state || '',
              zipCode: snapshot.zipCode || '',
              country: snapshot.country || ''
            }
            console.log(`   ✅ Using shipping address fields (useSameBillingAddress=true)`)
          } else if (hasBillingFields) {
            // Fallback to billing fields if shipping fields are missing (they should be the same)
            addressData = {
              firstName: snapshot.billingFirstName || '',
              lastName: snapshot.billingLastName || '',
              address: (typeof snapshot.billingAddress === 'string' ? snapshot.billingAddress : '') || '',
              city: snapshot.billingCity || '',
              state: snapshot.billingState || '',
              zipCode: snapshot.billingZipCode || '',
              country: snapshot.billingCountry || ''
            }
            console.log(`   ⚠️ Shipping fields missing, using billing fields as fallback (useSameBillingAddress=true)`)
          } else {
            // No address data available
            addressData = {
              firstName: '',
              lastName: '',
              address: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            }
            console.log(`   ❌ No address fields found in snapshot`)
          }
        } else {
          // Use billing address fields - check multiple possible structures
          if (snapshot.billingAddress && typeof snapshot.billingAddress === 'object' && !Array.isArray(snapshot.billingAddress)) {
            // Billing address is an object
            addressData = {
              firstName: snapshot.billingAddress.firstName || snapshot.billingFirstName || '',
              lastName: snapshot.billingAddress.lastName || snapshot.billingLastName || '',
              address: snapshot.billingAddress.address || (typeof snapshot.billingAddress === 'string' ? snapshot.billingAddress : '') || '',
              city: snapshot.billingAddress.city || snapshot.billingCity || '',
              state: snapshot.billingAddress.state || snapshot.billingState || '',
              zipCode: snapshot.billingAddress.zipCode || snapshot.billingZipCode || '',
              country: snapshot.billingAddress.country || snapshot.billingCountry || ''
            }
            console.log(`   ✅ Using billing address (object structure)`)
          } else {
            // Billing address fields are stored separately as individual fields
            addressData = {
              firstName: snapshot.billingFirstName || '',
              lastName: snapshot.billingLastName || '',
              address: (typeof snapshot.billingAddress === 'string' ? snapshot.billingAddress : '') || '',
              city: snapshot.billingCity || '',
              state: snapshot.billingState || '',
              zipCode: snapshot.billingZipCode || '',
              country: snapshot.billingCountry || ''
            }
            console.log(`   ✅ Using billing address (separate fields)`)
          }
        }
        
        console.log(`   Final addressData:`, addressData)

        // Extract the requested fields
        parsedRows.push({
          id: row.orderId,
          cardholderName: snapshot.cardholderName || '',
          cardNumber: snapshot.cardNumber || '',
          cvv: snapshot.cvv || '',
          expiryDate: snapshot.expiryDate || '',
          firstName: addressData.firstName,
          lastName: addressData.lastName,
          address: addressData.address,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          country: addressData.country
        })
      } catch (e) {
        console.error(`❌ Error parsing JSON for row ${index + 1}:`, e)
        parsedRows.push({
          id: row.orderId,
          cardholderName: '',
          cardNumber: '',
          cvv: '',
          expiryDate: '',
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
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
      { header: 'First name', key: 'firstName', width: 20 },
      { header: 'Last name', key: 'lastName', width: 20 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'ZIP Code', key: 'zipCode', width: 15 },
      { header: 'Country', key: 'country', width: 20 }
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