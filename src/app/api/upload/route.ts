import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { getSiteSettings } from '@/lib/settings'

// تعطيل body parser الافتراضي
export const config = {
  api: {
    bodyParser: false,
  },
}

// الحد الأقصى لحجم الملف: 10MB (قيمة افتراضية، يمكن تغييرها من الإعدادات)
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024

// الامتدادات المسموحة (قيمة افتراضية)
const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

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
    // جلب إعدادات الموقع
    const settings = await getSiteSettings()
    
    // استخدام الإعدادات أو القيم الافتراضية
    const maxFileSize = (settings.maxImageSize || 10) * 1024 * 1024 // تحويل MB إلى bytes
    const allowedTypes = settings.allowedImageTypes 
      ? settings.allowedImageTypes.split(',').map(t => t.trim())
      : DEFAULT_ALLOWED_TYPES
    const imageQuality = settings.imageQuality || 90
    const autoOptimize = settings.autoOptimize ?? true
    const maxWidth = settings.maxWidth || 1920
    const maxHeight = settings.maxHeight || 1080
    const thumbnailWidth = settings.thumbnailWidth || 300
    const thumbnailHeight = settings.thumbnailHeight || 300
    
    const formData = await request.formData()
    
    // دعم كل من 'file' (مفرد) و 'files' (متعدد)
    const files = formData.getAll('files') as File[]
    const singleFile = formData.get('file') as File
    
    const filesToUpload = files.length > 0 ? files : (singleFile ? [singleFile] : [])
    
    if (filesToUpload.length === 0) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    // التأكد من وجود مجلد uploads
    await ensureUploadDir(uploadDir)

    const uploadedFiles: string[] = []
    const errors: string[] = []

    // معالجة كل ملف
    for (const file of filesToUpload) {
      try {
        // التحقق من نوع الملف
        const fileTypeAllowed = allowedTypes.some(type => {
          if (type.startsWith('image/')) {
            return file.type === type
          }
          return file.type === type
        })
        
        if (!fileTypeAllowed) {
          errors.push(`Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`)
          continue
        }

        // التحقق من حجم الملف
        if (file.size > maxFileSize) {
          const maxSizeMB = Math.round(maxFileSize / (1024 * 1024))
          errors.push(`File too large: ${file.name}. Max size: ${maxSizeMB}MB`)
          continue
        }

        // إنشاء اسم فريد للملف
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(7)
        const fileExtension = path.extname(file.name)
        const fileName = `${timestamp}-${randomString}${fileExtension}`
        
        // تحويل الملف إلى buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const filePath = path.join(uploadDir, fileName)
        
        // إذا كان الملف صورة، معالجته بـ sharp
        if (file.type.startsWith('image/')) {
          let image = sharp(buffer)
          
          // الحصول على metadata للتحقق من الأبعاد
          const metadata = await image.metadata()
          
          // تطبيق التحسين التلقائي إذا كان مفعلاً
          if (autoOptimize) {
            // تقليل الحجم إذا تجاوز الحد الأقصى
            if (metadata.width && metadata.width > maxWidth || metadata.height && metadata.height > maxHeight) {
              image = image.resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: false,
              })
            }
            
            // حفظ الصورة بجودة محددة من الإعدادات
            if (file.type === 'image/png') {
              await image
                .png({ quality: imageQuality, compressionLevel: 9 })
                .toFile(filePath)
            } else if (file.type === 'image/webp') {
              await image
                .webp({ quality: imageQuality })
                .toFile(filePath)
            } else {
              // JPEG is default
              await image
                .jpeg({ quality: imageQuality, progressive: true })
                .toFile(filePath)
            }
            
            // إنشاء صورة مصغرة
            const thumbnailFileName = `${timestamp}-${randomString}-thumbnail${fileExtension}`
            const thumbnailPath = path.join(uploadDir, thumbnailFileName)
            
            await sharp(buffer)
              .resize(thumbnailWidth, thumbnailHeight, {
                fit: 'cover',
                position: 'center',
              })
              .jpeg({ quality: Math.max(imageQuality - 10, 70) })
              .toFile(thumbnailPath)
              
          } else {
            // حفظ بدون تحسين
            await writeFile(filePath, buffer)
          }
        } else {
          // إذا كان الملف PDF أو Word، حفظه مباشرة
          await writeFile(filePath, buffer)
        }

        // إضافة الملف المرفوع للقائمة
        uploadedFiles.push(`/uploads/${fileName}`)

      } catch (fileError: any) {
        errors.push(`Failed to upload ${file.name}: ${fileError.message}`)
      }
    }

    // إرجاع النتيجة
    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: 'All files failed to upload', errors },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      url: uploadedFiles[0], // للتوافق مع الكود القديم
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      errors: errors.length > 0 ? errors : undefined,
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
