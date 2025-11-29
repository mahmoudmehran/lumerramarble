'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageStatusToggleProps {
  pageKey: string
  pageName?: string
}

export default function PageStatusToggle({ pageKey, pageName }: PageStatusToggleProps) {
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadStatus()
  }, [pageKey])

  const loadStatus = async () => {
    try {
      const response = await fetch(`/api/admin/page-seo?pageKey=${pageKey}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setIsActive(data.isActive ?? true)
        }
      }
    } catch (error) {
      console.error('Error loading page status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStatus = async () => {
    setIsSaving(true)
    try {
      // First, get current data
      const currentData = await fetch(`/api/admin/page-seo?pageKey=${pageKey}`)
      let existingData = {}
      if (currentData.ok) {
        existingData = await currentData.json()
      }

      // Update with new status
      const response = await fetch('/api/admin/page-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...existingData,
          pageKey,
          isActive: !isActive
        })
      })

      if (response.ok) {
        setIsActive(!isActive)
      } else {
        console.error('Failed to update page status')
        alert('فشل تحديث حالة الصفحة')
      }
    } catch (error) {
      console.error('Error toggling page status:', error)
      alert('حدث خطأ أثناء تحديث حالة الصفحة')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-quinary-100)] rounded-lg">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-[var(--color-quaternary-600)]">جاري التحميل...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-[var(--color-quinary)] border border-[var(--color-quaternary-200)] rounded-lg shadow-sm">
      <div className="flex-1">
        <h3 className="font-semibold text-[var(--color-quaternary)]">حالة عرض الصفحة</h3>
        <p className="text-sm text-[var(--color-quaternary-600)]">
          {isActive 
            ? 'الصفحة معروضة في الموقع والفوتر' 
            : 'الصفحة مخفية من الموقع والفوتر'}
        </p>
      </div>
      <Button
        onClick={toggleStatus}
        disabled={isSaving}
        variant={isActive ? 'default' : 'outline'}
        className={`gap-2 ${
          isActive 
            ? 'bg-[var(--color-success)] hover:bg-[var(--color-success-700)] text-[var(--color-quinary)]' 
            : 'border-[var(--color-error-300)] text-[var(--color-error)] hover:bg-[var(--color-error-50)]'
        }`}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            جاري الحفظ...
          </>
        ) : isActive ? (
          <>
            <Eye className="w-4 h-4" />
            الصفحة مفعّلة
          </>
        ) : (
          <>
            <EyeOff className="w-4 h-4" />
            الصفحة معطّلة
          </>
        )}
      </Button>
    </div>
  )
}
