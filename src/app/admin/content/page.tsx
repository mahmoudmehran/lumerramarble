'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
// import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'

interface ContentItem {
  ar: string
  en: string
  es: string
  fr: string
}

interface ContentSection {
  [key: string]: ContentItem
}

interface ContentData {
  [section: string]: ContentSection
}

export default function ContentManagementPage() {
  const [content, setContent] = useState<ContentData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedPage, setSelectedPage] = useState('homepage')

  useEffect(() => {
    fetchContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/content?page=${selectedPage}`)
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateContentItem = (section: string, key: string, language: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: {
          ...prev[section]?.[key],
          [language]: value
        }
      }
    }))
  }

  const saveContent = async (section: string, key: string) => {
    try {
      setSaving(true)
      const values = content[section][key]
      
      console.log('Saving content:', {
        pageKey: selectedPage,
        sectionKey: section,
        contentKey: key,
        values
      })
      
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pageKey: selectedPage,
          sectionKey: section,
          contentKey: key,
          ar: values?.ar || '',
          en: values?.en || '',
          es: values?.es || '',
          fr: values?.fr || ''
        })
      })

      if (response.ok) {
        alert('تم حفظ المحتوى بنجاح!')
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        alert('حدث خطأ في حفظ المحتوى')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('حدث خطأ في حفظ المحتوى')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">إدارة المحتوى</h1>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المحتوى...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">إدارة المحتوى</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">اختر الصفحة:</label>
            <select 
              value={selectedPage} 
              onChange={(e) => setSelectedPage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="homepage">الصفحة الرئيسية</option>
              <option value="about">من نحن</option>
              <option value="products">المنتجات</option>
              <option value="contact">اتصل بنا</option>
            </select>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(content).map(([sectionKey, sectionData]) => (
            <div key={sectionKey} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">
                {sectionKey}
              </h2>
              
              <div className="space-y-6">
                {Object.entries(sectionData).map(([contentKey, contentItem]) => (
                  <div key={contentKey} className="border-l-4 border-blue-100 pl-4">
                    <h3 className="font-medium text-gray-800 mb-3">{contentKey}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">العربية</label>
                        <Textarea
                          value={contentItem.ar || ''}
                          onChange={(e) => updateContentItem(sectionKey, contentKey, 'ar', e.target.value)}
                          className="w-full text-right"
                          dir="rtl"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
                        <Textarea
                          value={contentItem.en || ''}
                          onChange={(e) => updateContentItem(sectionKey, contentKey, 'en', e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Español</label>
                        <Textarea
                          value={contentItem.es || ''}
                          onChange={(e) => updateContentItem(sectionKey, contentKey, 'es', e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Français</label>
                        <Textarea
                          value={contentItem.fr || ''}
                          onChange={(e) => updateContentItem(sectionKey, contentKey, 'fr', e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => saveContent(sectionKey, contentKey)}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? 'جاري الحفظ...' : 'حفظ'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}