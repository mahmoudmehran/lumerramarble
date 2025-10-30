'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from './button'

interface ImageUploadProps {
  onUpload: (urls: string[]) => void
  multiple?: boolean
  maxFiles?: number
  currentImages?: string[]
  onRemove?: (url: string) => void
}

export function ImageUpload({ 
  onUpload, 
  multiple = false, 
  maxFiles = 5,
  currentImages = [],
  onRemove 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>(currentImages)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)
    setUploading(true)

    try {
      // التحقق من عدد الملفات
      if (files.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        setUploading(false)
        return
      }

      // إنشاء FormData
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      // رفع الصور
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload')
      }

      // تحديث معاينة الصور
      setPreviewUrls(prev => [...prev, ...data.files])
      
      // إرسال URLs للمكون الأب
      onUpload(data.files)
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleRemove = async (url: string) => {
    try {
      // حذف من السيرفر
      const response = await fetch(`/api/upload?file=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      // حذف من المعاينة
      setPreviewUrls(prev => prev.filter(u => u !== url))
      
      // إشعار المكون الأب
      if (onRemove) {
        onRemove(url)
      }
    } catch (err) {
      setError('Failed to delete image')
    }
  }

  return (
    <div className="space-y-4">
      {/* منطقة الرفع */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple={multiple}
          onChange={handleChange}
          disabled={uploading}
        />

        <div className="flex flex-col items-center gap-4">
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm text-gray-600">Uploading images...</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">
                  اسحب الصور هنا أو انقر للاختيار
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WebP (Max {maxFiles} files, 5MB each)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                اختر الصور
              </Button>
            </>
          )}
        </div>
      </div>

      {/* رسالة خطأ */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* معاينة الصور */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
