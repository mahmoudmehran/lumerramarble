import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

// تعطيل body parser الافتراضي
export const config = {
  api: {
    bodyParser: false,
  },
}

// الحد الأقصى لحجم الملف: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// الامتدادات المسموحة
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// أبعاد الصور المختلفة
const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 300 },
  medium: { width: 800, height: 800 },
  large: { width: 1200, height: 1200 },
}

async function ensureUploadDir(uploadDir: string) {
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      )
    }

    const uploadedFiles: string[] = []
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    // التأكد من وجود مجلد uploads
    await ensureUploadDir(uploadDir)

    for (const file of files) {
      // التحقق من نوع الملف
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP` },
          { status: 400 }
        )
      }

      // التحقق من حجم الملف
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max size: 5MB` },
          { status: 400 }
        )
      }

      // إنشاء اسم فريد للملف
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(7)
      const fileExtension = path.extname(file.name)
      const fileName = `${timestamp}-${randomString}${fileExtension}`
      
      // تحويل الملف إلى buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // معالجة الصورة بـ sharp
      const image = sharp(buffer)
      const metadata = await image.metadata()

      // حفظ الصورة الأصلية (مع تحسين الجودة)
      const originalPath = path.join(uploadDir, fileName)
      await image
        .jpeg({ quality: 90, progressive: true })
        .toFile(originalPath)

      // إنشاء نسخ بأحجام مختلفة
      const sizes = ['thumbnail', 'medium', 'large'] as const
      
      for (const size of sizes) {
        const { width, height } = IMAGE_SIZES[size]
        const sizeFileName = `${timestamp}-${randomString}-${size}${fileExtension}`
        const sizePath = path.join(uploadDir, sizeFileName)
        
        await sharp(buffer)
          .resize(width, height, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85 })
          .toFile(sizePath)
      }

      // إضافة المسار النسبي للملف
      uploadedFiles.push(`/uploads/${fileName}`)
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

// API لحذف الصورة
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('file')

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // التأكد من أن المسار داخل مجلد uploads فقط
    if (!filePath.startsWith('/uploads/')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }

    const fullPath = path.join(process.cwd(), 'public', filePath)
    
    // حذف الملف الأصلي
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs').promises
    try {
      await fs.unlink(fullPath)
      
      // حذف النسخ المصغرة
      const fileName = path.basename(filePath, path.extname(filePath))
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      
      const sizes = ['thumbnail', 'medium', 'large']
      for (const size of sizes) {
        const sizeFile = path.join(uploadDir, `${fileName}-${size}${path.extname(filePath)}`)
        try {
          await fs.unlink(sizeFile)
        } catch {
          // تجاهل الأخطاء إذا لم يكن الملف موجود
        }
      }

      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
