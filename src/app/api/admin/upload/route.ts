import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')
    
    // Check authentication with JWT
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    console.log('Token received:', token ? 'JWT token present' : 'No token')
    
    if (!token) {
      console.log('No token provided')
      return NextResponse.json({ error: 'غير مصرح - لا يوجد توكن' }, { status: 401 })
    }

    try {
      // Verify JWT token
      const jwtSecret = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'your-secret-key'
      const decoded = jwt.verify(token, jwtSecret) as any
      console.log('Token verified for user:', decoded.email)
      
      if (decoded.role !== 'ADMIN') {
        console.log('User is not admin, role:', decoded.role)
        return NextResponse.json({ error: 'غير مصرح - ليس أدمن' }, { status: 403 })
      }
    } catch (jwtError) {
      console.log('Invalid token error:', jwtError)
      return NextResponse.json({ error: 'غير مصرح - توكن غير صالح' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File
    console.log('File received:', file?.name, file?.type, file?.size)

    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ error: 'لم يتم تحديد ملف' }, { status: 400 })
    }

    // Validate file type - more permissive
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    console.log('File type check:', file.type, 'Allowed:', allowedTypes.includes(file.type))
    
    if (!allowedTypes.includes(file.type) && file.type !== '') {
      // Some browsers don't set file.type correctly, so we also check the extension
      const extension = path.extname(file.name).toLowerCase()
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
      
      if (!allowedExtensions.includes(extension)) {
        console.log('Invalid file type and extension:', file.type, extension)
        return NextResponse.json({ error: `نوع الملف غير مدعوم: ${file.type || extension}` }, { status: 400 })
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    console.log('Uploads directory:', uploadsDir)
    
    if (!existsSync(uploadsDir)) {
      console.log('Creating uploads directory')
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = path.extname(file.name) || '.jpg'
    const filename = `hero-${timestamp}${extension}`
    const filepath = path.join(uploadsDir, filename)
    console.log('File will be saved to:', filepath)

    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return the public path
    const publicPath = `/uploads/${filename}`
    console.log('File uploaded successfully:', publicPath)

    return NextResponse.json({ 
      filePath: publicPath,
      message: 'تم رفع الصورة بنجاح'
    })

  } catch (error) {
    console.error('Upload error details:', error)
    return NextResponse.json({ 
      error: 'خطأ في رفع الصورة', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}