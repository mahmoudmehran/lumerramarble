'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Card } from '../../../components/ui/card'
import { Save, Eye, Settings, LogOut, Building, Ship, Edit } from 'lucide-react'

export default function AdminContentEditor() {
  const [activeTab, setActiveTab] = useState('homepage')
  const [content, setContent] = useState<any>(null)
  const [editingLang, setEditingLang] = useState('ar')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const tabs = [
    { id: 'homepage', name: 'الصفحة الرئيسية', icon: Eye },
    { id: 'about', name: 'عن الشركة', icon: Building },
    { id: 'export', name: 'خدمات التصدير', icon: Ship },
    { id: 'settings', name: 'الإعدادات', icon: Settings }
  ]

  const languages = [
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ]

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')

    if (!token || !userData) {
      router.push('/admin/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      router.push('/admin/login')
      return
    }

    setIsLoading(false)
  }, [router])

  // Load content when tab changes
  useEffect(() => {
    const loadContent = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token || !user) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/content?page=${activeTab}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        }
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadContent()
    }
  }, [activeTab, user])

  // Update field value
  const updateField = (section: string, field: string, value: string) => {
    const newContent = JSON.parse(JSON.stringify(content))
    if (!newContent[section]) newContent[section] = {}
    if (!newContent[section][field]) newContent[section][field] = {}
    newContent[section][field][editingLang] = value
    setContent(newContent)
  }

  // Get field value
  const getValue = (section: string, field: string): string => {
    return content?.[section]?.[field]?.[editingLang] || ''
  }

  // Save content
  const handleSave = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      setIsSaving(true)
      
      // تحويل المحتوى إلى صيغة قاعدة البيانات
      const updates = []
      for (const sectionKey in content) {
        for (const contentKey in content[sectionKey]) {
          const item = content[sectionKey][contentKey]
          updates.push({
            pageKey: activeTab,
            sectionKey,
            contentKey,
            valueAr: item.ar || '',
            valueEn: item.en || '',
            valueEs: item.es || '',
            valueFr: item.fr || ''
          })
        }
      }

      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        alert('تم الحفظ بنجاح! ✅')
      } else {
        alert('فشل الحفظ')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_login_time')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!content || !user) return null

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
              <p className="text-sm text-gray-500">مرحباً {user?.name}</p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 ml-2" />
                {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">أقسام الموقع</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'settings') {
                          router.push('/admin/settings')
                        } else {
                          setActiveTab(tab.id)
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-right transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {/* Language Tabs */}
              <div className="mb-6 border-b">
                <div className="flex gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setEditingLang(lang.code)}
                      className={`px-4 py-2 font-medium transition-colors ${
                        editingLang === lang.code
                          ? 'border-b-2 border-primary-600 text-primary-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Content Rendering */}
              <div className="space-y-6">
                {Object.keys(content).map(sectionKey => (
                  <div key={sectionKey} className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      {sectionKey}
                    </h3>
                    <div className="space-y-4">
                      {Object.keys(content[sectionKey]).map(fieldKey => (
                        <div key={fieldKey}>
                          <label className="block text-sm font-medium mb-2">
                            {fieldKey}
                          </label>
                          {fieldKey.includes('description') || fieldKey.includes('content') ? (
                            <Textarea
                              rows={4}
                              value={getValue(sectionKey, fieldKey)}
                              onChange={(e) => updateField(sectionKey, fieldKey, e.target.value)}
                              className="w-full"
                              dir={editingLang === 'ar' ? 'rtl' : 'ltr'}
                            />
                          ) : (
                            <Input
                              value={getValue(sectionKey, fieldKey)}
                              onChange={(e) => updateField(sectionKey, fieldKey, e.target.value)}
                              className="w-full"
                              dir={editingLang === 'ar' ? 'rtl' : 'ltr'}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
