'use client'

import { useState, useEffect } from 'react'
import { Save, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'

interface PageSEOProps {
  pageKey: string
  pageName?: string
}

interface SEOData {
  id?: string
  pageKey: string
  titleAr: string
  titleEn: string
  titleEs: string
  titleFr: string
  descriptionAr: string
  descriptionEn: string
  descriptionEs: string
  descriptionFr: string
  keywordsAr: string
  keywordsEn: string
  keywordsEs: string
  keywordsFr: string
  ogImage: string
  canonicalUrl: string
  isActive: boolean
}

export default function PageSEOManager({ pageKey, pageName }: PageSEOProps) {
  const [seoData, setSeoData] = useState<SEOData>({
    pageKey,
    titleAr: '',
    titleEn: '',
    titleEs: '',
    titleFr: '',
    descriptionAr: '',
    descriptionEn: '',
    descriptionEs: '',
    descriptionFr: '',
    keywordsAr: '',
    keywordsEn: '',
    keywordsEs: '',
    keywordsFr: '',
    ogImage: '',
    canonicalUrl: '',
    isActive: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSEO, setShowSEO] = useState(false)

  useEffect(() => {
    loadSEOData()
  }, [pageKey])

  const loadSEOData = async () => {
    try {
      const response = await fetch(`/api/admin/page-seo/${pageKey}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setSeoData(data)
        }
      }
    } catch (error) {
      console.error('Error loading SEO data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const method = seoData.id ? 'PUT' : 'POST'
      const url = seoData.id 
        ? `/api/admin/page-seo/${seoData.id}`
        : '/api/admin/page-seo'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoData)
      })

      if (response.ok) {
        const saved = await response.json()
        setSeoData(saved)
        alert('تم حفظ إعدادات SEO بنجاح')
      } else {
        alert('فشل في حفظ إعدادات SEO')
      }
    } catch (error) {
      console.error('Error saving SEO data:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">جاري التحميل...</div>
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            إعدادات SEO - {pageName}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            تحسين محركات البحث والعنوان والوصف والصورة المميزة
          </p>
        </div>
        <Button
          onClick={() => setShowSEO(!showSEO)}
          variant="outline"
          size="sm"
        >
          {showSEO ? 'إخفاء' : 'عرض'} إعدادات SEO
        </Button>
      </div>

      {showSEO && (
        <div className="space-y-6 border-t pt-6">
          {/* Shared Image */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-semibold text-gray-900 mb-4">صورة الصفحة (مشتركة لجميع اللغات)</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Open Graph Image</label>
              <ImageUpload
                currentImages={seoData.ogImage ? [seoData.ogImage] : []}
                onUpload={(urls) => setSeoData({ ...seoData, ogImage: urls[0] || '' })}
                onRemove={() => setSeoData({ ...seoData, ogImage: '' })}
                multiple={false}
                maxFiles={1}
              />
              <p className="text-xs text-gray-500 mt-1">الحجم المثالي: 1200x630 بكسل | Optimal size: 1200x630 pixels</p>
            </div>
          </div>

          {/* Arabic */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              🇸🇦 العربية
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2">عنوان الصفحة (Title)</label>
              <Input
                value={seoData.titleAr}
                onChange={(e) => setSeoData({ ...seoData, titleAr: e.target.value })}
                placeholder="عنوان الصفحة للظهور في نتائج البحث"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">{seoData.titleAr.length}/60 حرف</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">وصف الصفحة (Description)</label>
              <textarea
                value={seoData.descriptionAr}
                onChange={(e) => setSeoData({ ...seoData, descriptionAr: e.target.value })}
                rows={3}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="وصف مختصر للصفحة يظهر في نتائج البحث"
              />
              <p className="text-xs text-gray-500 mt-1">{seoData.descriptionAr.length}/160 حرف</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الكلمات المفتاحية (Keywords)</label>
              <Input
                value={seoData.keywordsAr}
                onChange={(e) => setSeoData({ ...seoData, keywordsAr: e.target.value })}
                placeholder="كلمة1، كلمة2، كلمة3"
              />
            </div>
          </div>

          {/* English */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              🇬🇧 English
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2">Page Title</label>
              <Input
                value={seoData.titleEn}
                onChange={(e) => setSeoData({ ...seoData, titleEn: e.target.value })}
                placeholder="Page title for search results"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">{seoData.titleEn.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Page Description</label>
              <textarea
                value={seoData.descriptionEn}
                onChange={(e) => setSeoData({ ...seoData, descriptionEn: e.target.value })}
                rows={3}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Brief description for search results"
              />
              <p className="text-xs text-gray-500 mt-1">{seoData.descriptionEn.length}/160 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Keywords</label>
              <Input
                value={seoData.keywordsEn}
                onChange={(e) => setSeoData({ ...seoData, keywordsEn: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>

          {/* Spanish */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              🇪🇸 Español
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2">Título de la Página</label>
              <Input
                value={seoData.titleEs}
                onChange={(e) => setSeoData({ ...seoData, titleEs: e.target.value })}
                placeholder="Título de la página para resultados de búsqueda"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">{seoData.titleEs.length}/60 caracteres</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descripción de la Página</label>
              <textarea
                value={seoData.descriptionEs}
                onChange={(e) => setSeoData({ ...seoData, descriptionEs: e.target.value })}
                rows={3}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Breve descripción para resultados de búsqueda"
              />
              <p className="text-xs text-gray-500 mt-1">{seoData.descriptionEs.length}/160 caracteres</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Palabras Clave</label>
              <Input
                value={seoData.keywordsEs}
                onChange={(e) => setSeoData({ ...seoData, keywordsEs: e.target.value })}
                placeholder="palabra1, palabra2, palabra3"
              />
            </div>
          </div>

          {/* French */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              🇫🇷 Français
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2">Titre de la Page</label>
              <Input
                value={seoData.titleFr}
                onChange={(e) => setSeoData({ ...seoData, titleFr: e.target.value })}
                placeholder="Titre de la page pour les résultats de recherche"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">{seoData.titleFr.length}/60 caractères</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description de la Page</label>
              <textarea
                value={seoData.descriptionFr}
                onChange={(e) => setSeoData({ ...seoData, descriptionFr: e.target.value })}
                rows={3}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Brève description pour les résultats de recherche"
              />
              <p className="text-xs text-gray-500 mt-1">{seoData.descriptionFr.length}/160 caractères</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mots-clés</label>
              <Input
                value={seoData.keywordsFr}
                onChange={(e) => setSeoData({ ...seoData, keywordsFr: e.target.value })}
                placeholder="mot1, mot2, mot3"
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-gray-900">إعدادات إضافية</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Canonical URL</label>
              <Input
                value={seoData.canonicalUrl}
                onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                placeholder="https://example.com/page"
              />
              <p className="text-xs text-gray-500 mt-1">
                الرابط الرسمي للصفحة (اتركه فارغاً للاستخدام التلقائي)
              </p>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.isActive}
                  onChange={(e) => setSeoData({ ...seoData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>تفعيل إعدادات SEO المخصصة</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'جاري الحفظ...' : 'حفظ إعدادات SEO'}
            </Button>
          </div>

          <div className="bg-[var(--color-info-50)] border border-[var(--color-info-200)] rounded-md p-4 mt-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-[var(--color-info)] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[var(--color-info-800)]">
                <p className="font-semibold mb-1">نصائح لتحسين SEO:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>استخدم عناوين وصفية وجذابة (40-60 حرف)</li>
                  <li>اكتب وصف مختصر ومفيد (120-160 حرف)</li>
                  <li>استخدم كلمات مفتاحية مرتبطة بمحتوى الصفحة</li>
                  <li>الصورة المثالية: 1200x630 بكسل للمشاركة على وسائل التواصل</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
