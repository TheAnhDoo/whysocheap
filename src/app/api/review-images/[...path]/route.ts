import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const imagePath = path.join('/')
    
    // Security: Prevent directory traversal
    if (imagePath.includes('..') || imagePath.startsWith('/')) {
      return new NextResponse('Invalid path', { status: 400 })
    }

    // Construct the full path to the image in the data folder
    const dataDir = join(process.cwd(), 'data')
    const fullPath = join(dataDir, imagePath)

    // Verify the file exists
    if (!existsSync(fullPath)) {
      return new NextResponse('Image not found', { status: 404 })
    }

    // Read the image file
    const imageBuffer = await readFile(fullPath)
    
    // Determine content type based on file extension
    const ext = imagePath.split('.').pop()?.toLowerCase()
    const contentType = 
      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
      ext === 'png' ? 'image/png' :
      ext === 'gif' ? 'image/gif' :
      ext === 'webp' ? 'image/webp' :
      ext === 'avif' ? 'image/avif' :
      'image/jpeg' // default

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving review image:', error)
    return new NextResponse('Error serving image', { status: 500 })
  }
}

