// Image upload utilities

export interface UploadResponse {
  success: boolean
  files?: string[]
  error?: string
  message?: string
}

/**
 * رفع صورة واحدة أو عدة صور
 */
export async function uploadImages(files: File[]): Promise<UploadResponse> {
  try {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed')
    }

    return data
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to upload images',
    }
  }
}

/**
 * حذف صورة من السيرفر
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/upload?file=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Failed to delete image:', error)
    return false
  }
}

/**
 * الحصول على URL بحجم معين
 */
export function getImageUrl(originalUrl: string, size?: 'thumbnail' | 'medium' | 'large'): string {
  if (!size || !originalUrl) return originalUrl

  const ext = originalUrl.substring(originalUrl.lastIndexOf('.'))
  const baseName = originalUrl.substring(0, originalUrl.lastIndexOf('.'))
  
  return `${baseName}-${size}${ext}`
}

/**
 * التحقق من نوع الملف
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * التحقق من حجم الملف (5MB max)
 */
export function isValidFileSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024 // 5MB
  return file.size <= maxSize
}

/**
 * التحقق من الملف بالكامل
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!isValidImageFile(file)) {
    return {
      valid: false,
      error: 'نوع الملف غير مدعوم. الأنواع المسموحة: JPG, PNG, WebP',
    }
  }

  if (!isValidFileSize(file)) {
    return {
      valid: false,
      error: 'حجم الملف كبير جداً. الحد الأقصى: 5MB',
    }
  }

  return { valid: true }
}

/**
 * معاينة الصورة قبل الرفع
 */
export function previewImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
