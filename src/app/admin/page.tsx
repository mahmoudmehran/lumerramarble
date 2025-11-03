'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Select } from '../../components/ui/select'
import { Card } from '../../components/ui/card'
import { Save, Edit, Eye, Settings, Calculator, LogOut, Building, Ship } from 'lucide-react'

// تعريف نوع المحتوى
interface ContentData {
  [key: string]: any
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('homepage')
  const [content, setContent] = useState<ContentData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingLang, setEditingLang] = useState('ar') // اللغة النشطة للتحرير
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()



  // Check authentication and load content with session management
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    const loginTime = localStorage.getItem('admin_login_time')

    // التحقق من وجود Token
    if (!token || !userData) {
      router.push('/admin/login')
      return
    }

    // التحقق من انتهاء مدة الجلسة (8 ساعات)
    const SESSION_TIMEOUT = 8 * 60 * 60 * 1000 // 8 hours in milliseconds
    if (loginTime) {
      const loginTimestamp = parseInt(loginTime)
      const currentTime = Date.now()
      const sessionDuration = currentTime - loginTimestamp
      
      if (sessionDuration > SESSION_TIMEOUT) {
        // انتهت الجلسة
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        localStorage.removeItem('admin_login_time')
        alert('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى')
        router.push('/admin/login')
        return
      }
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_login_time')
      router.push('/admin/login')
      return
    }

    // تحديث آخر نشاط
    localStorage.setItem('admin_last_activity', Date.now().toString())

    // Load content from API/database
    const loadContent = async () => {
      try {
        const response = await fetch('/api/admin/content', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const apiContent = await response.json()
          setContent(apiContent)
        } else if (response.status === 401) {
          // Token غير صالح
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
          localStorage.removeItem('admin_login_time')
          router.push('/admin/login')
          return
        } else {
          // Fallback to default content if API fails
          const { getContent } = await import('../../lib/content')
          const defaultContent = await getContent()
          setContent(defaultContent)
        }
      } catch (error) {
        console.error('Error loading content:', error)
        // Fallback to default content
        const { getContent } = await import('../../lib/content')
        const defaultContent = await getContent()
        setContent(defaultContent)
      }
      setIsLoading(false)
    }
    
    loadContent()

    // مراقبة النشاط وتحديث آخر نشاط
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']
    const updateActivity = () => {
      localStorage.setItem('admin_last_activity', Date.now().toString())
    }
    
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity)
    })

    // تنظيف Event Listeners
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity)
      })
    }
  }, [router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section?: string, subSection?: string, imageKey?: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // التحقق من حجم الملف (5MB حد أقصى)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('حجم الملف كبير جداً. الحد الأقصى 5MB')
      return
    }

    try {
      console.log('بدء تحميل الصورة:', file.name, file.size, file.type)
      
      const formData = new FormData()
      formData.append('image', file)

      const token = localStorage.getItem('admin_token')
      console.log('Token exists:', !!token)
      
      // التأكد من استخدام البورت الصحيح
      const baseUrl = window.location.origin
      console.log('Upload URL:', `${baseUrl}/api/admin/upload`)
      
      const response = await fetch(`${baseUrl}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Upload error:', errorData)
        throw new Error(errorData.error || `فشل في رفع الصورة: ${response.status}`)
      }

      const { filePath } = await response.json()

      // Update content with new image path for all languages
      const newContent = JSON.parse(JSON.stringify(content))
      const languages = ['ar', 'en', 'fr', 'es']
      
      languages.forEach(lang => {
        if (!newContent[lang]) newContent[lang] = {}

        if (section && subSection && imageKey) {
          // For specific sections like about.hero.backgroundImage
          if (!newContent[lang][section]) newContent[lang][section] = {}
          if (!newContent[lang][section][subSection]) newContent[lang][section][subSection] = {}
          newContent[lang][section][subSection][imageKey] = filePath
        } else {
          // Default to homepage hero background
          if (!newContent[lang].homepage) newContent[lang].homepage = {}
          if (!newContent[lang].homepage.hero) newContent[lang].homepage.hero = {}
          newContent[lang].homepage.hero.backgroundImage = filePath
        }
      })

      setContent(newContent)
      console.log('تم رفع الصورة بنجاح:', filePath)
      alert('تم رفع الصورة بنجاح!')
    } catch (err) {
      console.error('Upload error:', err)
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف في رفع الصورة'
      alert(`خطأ في رفع الصورة: ${errorMessage}`)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      })

      if (response.ok) {
        alert('تم حفظ التغييرات بنجاح!')
        setIsEditing(false)
        
        // إعادة تحميل المحتوى المحدث
        const updatedResponse = await fetch('/api/admin/content', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        })
        
        if (updatedResponse.ok) {
          const updatedContent = await updatedResponse.json()
          setContent(updatedContent)
        }
        
        // تحديث الصفحات في browser cache
        if (typeof window !== 'undefined') {
          // إشعار المستخدم بأن المحتوى تم تحديثه
          setTimeout(() => {
            const confirmed = confirm('تم حفظ التغييرات بنجاح! هل تريد رؤية التغييرات في الموقع؟')
            if (confirmed) {
              window.open('/', '_blank')
            }
          }, 500)
        }
      } else {
        alert('حدث خطأ في حفظ التغييرات')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('حدث خطأ في حفظ التغييرات')
    }
  }

  const handleLogout = () => {
    // تنظيف جميع بيانات الجلسة
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_login_time')
    localStorage.removeItem('admin_last_activity')
    router.push('/admin/login')
  }

  const tabs = [
    { id: 'homepage', name: 'الصفحة الرئيسية', icon: Eye },
    { id: 'about', name: 'عن الشركة', icon: Building },
    { id: 'export', name: 'خدمات التصدير', icon: Ship },
    { id: 'quotes', name: 'طلبات الأسعار', icon: Calculator },
    { id: 'products', name: 'المنتجات', icon: Edit },
    { id: 'blog', name: 'المدونة', icon: Edit },
    { id: 'settings', name: 'الإعدادات', icon: Settings }
  ]

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  }

  if (!content || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم لوميرا ماربل</h1>
              <p className="text-gray-600">مرحباً {user?.name} - إدارة محتوى الموقع</p>
            </div>
            <div className="flex items-center gap-4">
              {content?._lastUpdated && (
                <div className="text-sm text-gray-500">
                  آخر تحديث: {new Date(content._lastUpdated).toLocaleString('ar-EG')}
                </div>
              )}
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2"
                disabled={!isEditing}
              >
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </Button>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
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
            {activeTab === 'homepage' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">الصفحة الرئيسية</h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'إلغاء التعديل' : 'تعديل'}
                  </Button>
                </div>

                {/* Language Tabs */}
                {isEditing && (
                  <div className="mb-6 border-b">
                    <div className="flex gap-2">
                      {[
                        { code: 'ar', name: 'العربية' },
                        { code: 'en', name: 'English' },
                        { code: 'fr', name: 'Français' },
                        { code: 'es', name: 'Español' }
                      ].map(lang => (
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
                )}

                <div className="space-y-8">
                  {/* Hero Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      قسم العنوان الرئيسي
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          العنوان الرئيسي
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.homepage?.hero?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                              if (!newContent[editingLang].homepage.hero) newContent[editingLang].homepage.hero = {}
                              newContent[editingLang].homepage.hero.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="أدخل العنوان الرئيسي"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.homepage?.hero?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          النص التوضيحي
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={3}
                            value={content[editingLang]?.homepage?.hero?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                              if (!newContent[editingLang].homepage.hero) newContent[editingLang].homepage.hero = {}
                              newContent[editingLang].homepage.hero.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="أدخل النص التوضيحي"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.homepage?.hero?.subtitle || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            نص الزر الأساسي
                          </label>
                          {isEditing ? (
                            <Input
                              value={content[editingLang]?.homepage?.hero?.primaryButton || ''}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(content))
                                if (!newContent[editingLang]) newContent[editingLang] = {}
                                if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                if (!newContent[editingLang].homepage.hero) newContent[editingLang].homepage.hero = {}
                                newContent[editingLang].homepage.hero.primaryButton = e.target.value
                                setContent(newContent)
                              }}
                              placeholder="نص الزر الأساسي"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-md">
                              {content[editingLang]?.homepage?.hero?.primaryButton || 'غير محدد'}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            نص الزر الثانوي
                          </label>
                          {isEditing ? (
                            <Input
                              value={content[editingLang]?.homepage?.hero?.secondaryButton || ''}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(content))
                                if (!newContent[editingLang]) newContent[editingLang] = {}
                                if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                if (!newContent[editingLang].homepage.hero) newContent[editingLang].homepage.hero = {}
                                newContent[editingLang].homepage.hero.secondaryButton = e.target.value
                                setContent(newContent)
                              }}
                              placeholder="نص الزر الثانوي"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-md">
                              {content[editingLang]?.homepage?.hero?.secondaryButton || 'غير محدد'}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            صورة الخلفية
                          </label>
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <p className="text-sm text-gray-500">
                                اختر صورة للخلفية (JPG, PNG, WebP)
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-md">
                              {content[editingLang]?.homepage?.hero?.backgroundImage || 'غير محدد'}
                            </div>
                          )}
                          {content[editingLang]?.homepage?.hero?.backgroundImage && (
                            <div className="mt-2">
                              <img 
                                src={content[editingLang].homepage.hero.backgroundImage} 
                                alt="صورة الخلفية" 
                                className="w-32 h-20 object-cover rounded border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      قسم الإحصائيات
                    </h3>
                    <div className="space-y-4">
                      {(content[editingLang]?.homepage?.stats?.items || []).map((stat: { number?: string; text?: string }, index: number) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              الرقم {index + 1}
                            </label>
                            {isEditing ? (
                              <Input
                                value={stat.number || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]?.homepage?.stats?.items) return
                                  newContent[editingLang].homepage.stats.items[index].number = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="15+"
                              />
                            ) : (
                              <div className="p-2 bg-white rounded border">
                                {stat.number || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              النص {index + 1}
                            </label>
                            {isEditing ? (
                              <Input
                                value={stat.text || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]?.homepage?.stats?.items) return
                                  newContent[editingLang].homepage.stats.items[index].text = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="سنوات من الخبرة"
                              />
                            ) : (
                              <div className="p-2 bg-white rounded border">
                                {stat.text || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      قسم المميزات
                    </h3>
                    <div className="space-y-4">
                      {(content[editingLang]?.homepage?.features?.items || []).map((feature: { title?: string; description?: string; icon?: string }, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                عنوان المميزة {index + 1}
                              </label>
                              {isEditing ? (
                                <Input
                                  value={feature.title || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]?.homepage?.features) return
                                    newContent[editingLang].homepage.features.items[index].title = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="جودة عالمية"
                                />
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {feature.title || 'غير محدد'}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                وصف المميزة {index + 1}
                              </label>
                              {isEditing ? (
                                <Textarea
                                  rows={2}
                                  value={feature.description || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]?.homepage?.features) return
                                    newContent[editingLang].homepage.features.items[index].description = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="منتجات معتمدة بشهادات الجودة العالمية"
                                />
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {feature.description || 'غير محدد'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categories Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      قسم الفئات
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان قسم الفئات
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.homepage?.categories?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                              if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                              newContent[editingLang].homepage.categories.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="فئات المنتجات"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[editingLang]?.homepage?.categories?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          وصف قسم الفئات
                        </label>
                        {isEditing ? (
                          <Textarea
                            value={content[editingLang]?.homepage?.categories?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                              if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                              newContent[editingLang].homepage.categories.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="استكشف مجموعتنا المتنوعة من الرخام والجرانيت"
                            rows={2}
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[editingLang]?.homepage?.categories?.subtitle || 'غير محدد'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      قسم الدعوة للعمل
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان الدعوة للعمل
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.homepage?.cta?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                              if (!newContent[editingLang].homepage.cta) newContent[editingLang].homepage.cta = {}
                              newContent[editingLang].homepage.cta.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="جاهز للبدء؟"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[editingLang]?.homepage?.cta?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          وصف الدعوة للعمل
                        </label>
                        {isEditing ? (
                          <Textarea
                            value={content[editingLang]?.homepage?.cta?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                              if (!newContent[editingLang].homepage.cta) newContent[editingLang].homepage.cta = {}
                              newContent[editingLang].homepage.cta.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="احصل على عرض سعر مجاني لمشروعك اليوم"
                            rows={2}
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[editingLang]?.homepage?.cta?.subtitle || 'غير محدد'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          نص زر الدعوة للعمل
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.homepage?.cta?.button || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                              if (!newContent[editingLang].homepage.cta) newContent[editingLang].homepage.cta = {}
                              newContent[editingLang].homepage.cta.button = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="احصل على عرض سعر"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[editingLang]?.homepage?.cta?.button || 'غير محدد'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Site Info */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      معلومات التواصل
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          رقم الهاتف
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.siteInfo?.phone || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]?.siteInfo) {
                                if (!newContent[editingLang]) newContent[editingLang] = {}
                                newContent[editingLang].siteInfo = {}
                              }
                              newContent[editingLang].siteInfo.phone = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="+20 111 312 1444"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.siteInfo?.phone || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          البريد الإلكتروني
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.siteInfo?.email || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]?.siteInfo) {
                                if (!newContent[editingLang]) newContent[editingLang] = {}
                                newContent[editingLang].siteInfo = {}
                              }
                              newContent[editingLang].siteInfo.email = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="info@alhotmarble.com"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.siteInfo?.email || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {editingLang === 'ar' ? 'العنوان' : 'Address'}
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.siteInfo?.address || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]?.siteInfo) {
                                if (!newContent[editingLang]) newContent[editingLang] = {}
                                newContent[editingLang].siteInfo = {}
                              }
                              newContent[editingLang].siteInfo.address = e.target.value
                              setContent(newContent)
                            }}
                            placeholder={editingLang === 'ar' ? 'العنوان' : 'Address'}
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.siteInfo?.address || 'غير محدد'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'about' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">صفحة عن الشركة</h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'إلغاء التعديل' : 'تعديل'}
                  </Button>
                </div>

                {/* Language Tabs */}
                {isEditing && (
                  <div className="mb-6 border-b">
                    <div className="flex gap-2">
                      {[
                        { code: 'ar', name: 'العربية' },
                        { code: 'en', name: 'English' },
                        { code: 'fr', name: 'Français' },
                        { code: 'es', name: 'Español' }
                      ].map(lang => (
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
                )}

                <div className="space-y-8">
                  {/* Hero Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      القسم الرئيسي
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          العنوان الرئيسي
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.about?.hero?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.hero) newContent[editingLang].about.hero = {}
                              newContent[editingLang].about.hero.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="من نحن"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.hero?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          النص التوضيحي
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={4}
                            value={content[editingLang]?.about?.hero?.description || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.hero) newContent[editingLang].about.hero = {}
                              newContent[editingLang].about.hero.description = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="وصف موجز عن الشركة"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.hero?.description || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة القسم الرئيسي
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'about', 'hero', 'backgroundImage')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة للخلفية (JPG, PNG, WebP)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.hero?.backgroundImage || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.about?.hero?.backgroundImage && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].about.hero.backgroundImage} 
                              alt="صورة الخلفية" 
                              className="w-32 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mission Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      الرؤية والرسالة
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان القسم
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.about?.mission?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.mission) newContent[editingLang].about.mission = {}
                              newContent[editingLang].about.mission.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="رؤيتنا ورسالتنا"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.mission?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          الرؤية
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={3}
                            value={content[editingLang]?.about?.mission?.vision || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.mission) newContent[editingLang].about.mission = {}
                              newContent[editingLang].about.mission.vision = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="رؤية الشركة"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.mission?.vision || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          الرسالة
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={3}
                            value={content[editingLang]?.about?.mission?.mission || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.mission) newContent[editingLang].about.mission = {}
                              newContent[editingLang].about.mission.mission = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="رسالة الشركة"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.mission?.mission || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة قسم الرؤية والرسالة
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'about', 'mission', 'image')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة توضيحية للرؤية والرسالة (JPG, PNG, WebP)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.mission?.image || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.about?.mission?.image && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].about.mission.image} 
                              alt="صورة الرؤية والرسالة" 
                              className="w-32 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      موقعنا
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان القسم
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.about?.location?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.location) newContent[editingLang].about.location = {}
                              newContent[editingLang].about.location.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="موقعنا"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.location?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          العنوان
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.about?.location?.address || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.location) newContent[editingLang].about.location = {}
                              newContent[editingLang].about.location.address = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="العنوان التفصيلي"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.location?.address || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          وصف الموقع
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={3}
                            value={content[editingLang]?.about?.location?.description || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.location) newContent[editingLang].about.location = {}
                              newContent[editingLang].about.location.description = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="وصف الموقع ومزاياه"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.location?.description || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة الموقع
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'about', 'location', 'image')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة للموقع أو المصنع (JPG, PNG, WebP)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.location?.image || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.about?.location?.image && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].about.location.image} 
                              alt="صورة الموقع" 
                              className="w-32 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      إنجازاتنا بالأرقام
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان القسم
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.about?.stats?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.stats) newContent[editingLang].about.stats = {}
                              newContent[editingLang].about.stats.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="إنجازاتنا بالأرقام"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.stats?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>
                      
                      {(content[editingLang]?.about?.stats?.items || []).map((stat: { number?: string; text?: string }, index: number) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              الرقم {index + 1}
                            </label>
                            {isEditing ? (
                              <Input
                                value={stat.number || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]?.about?.stats?.items) return
                                  newContent[editingLang].about.stats.items[index].number = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="15+"
                              />
                            ) : (
                              <div className="p-2 bg-white rounded border">
                                {stat.number || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              النص {index + 1}
                            </label>
                            {isEditing ? (
                              <Input
                                value={stat.text || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]?.about?.stats?.items) return
                                  newContent[editingLang].about.stats.items[index].text = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="سنوات من الخبرة"
                              />
                            ) : (
                              <div className="p-2 bg-white rounded border">
                                {stat.text || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'export' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">صفحة خدمات التصدير</h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'إلغاء التعديل' : 'تعديل'}
                  </Button>
                </div>

                {/* Language Tabs */}
                {isEditing && (
                  <div className="mb-6 border-b">
                    <div className="flex gap-2">
                      {[
                        { code: 'ar', name: 'العربية' },
                        { code: 'en', name: 'English' },
                        { code: 'fr', name: 'Français' },
                        { code: 'es', name: 'Español' }
                      ].map(lang => (
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
                )}

                <div className="space-y-8">
                  {/* Hero Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      القسم الرئيسي
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          العنوان الرئيسي
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.export?.hero?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.hero) newContent[editingLang].export.hero = {}
                              newContent[editingLang].export.hero.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="خدمات التصدير الاحترافية"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.hero?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          النص التوضيحي
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={4}
                            value={content[editingLang]?.export?.hero?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.hero) newContent[editingLang].export.hero = {}
                              newContent[editingLang].export.hero.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="وصف خدمات التصدير"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.hero?.subtitle || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          نص الزر
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.export?.hero?.cta || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.hero) newContent[editingLang].export.hero = {}
                              newContent[editingLang].export.hero.cta = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="طلب عرض سعر للتصدير"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.hero?.cta || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة القسم الرئيسي
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'export', 'hero', 'backgroundImage')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة للقسم الرئيسي (JPG, PNG, WebP)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.hero?.backgroundImage || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.export?.hero?.backgroundImage && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].export.hero.backgroundImage} 
                              alt="صورة القسم الرئيسي" 
                              className="w-32 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Services Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      خدماتنا
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان القسم
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.export?.services?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.services) newContent[editingLang].export.services = {}
                              newContent[editingLang].export.services.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="خدماتنا"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.services?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          وصف القسم
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={2}
                            value={content[editingLang]?.export?.services?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.services) newContent[editingLang].export.services = {}
                              newContent[editingLang].export.services.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="نقدم خدمات تصدير متكاملة من الاستشارة إلى التسليم"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.services?.subtitle || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة قسم الخدمات
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'export', 'services', 'image')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة توضيحية للخدمات (JPG, PNG, WebP)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.services?.image || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.export?.services?.image && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].export.services.image} 
                              alt="صورة الخدمات" 
                              className="w-32 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Countries Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      الدول المستوردة
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان القسم
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.export?.countries?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.countries) newContent[editingLang].export.countries = {}
                              newContent[editingLang].export.countries.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="الدول التي نصدر إليها"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.countries?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          وصف القسم
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={2}
                            value={content[editingLang]?.export?.countries?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.countries) newContent[editingLang].export.countries = {}
                              newContent[editingLang].export.countries.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="نصل إلى أكثر من 50 دولة في 6 قارات"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.countries?.subtitle || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة قسم الدول المستوردة
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'export', 'countries', 'image')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة خريطة أو تمثيلية للدول (JPG, PNG, WebP)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.countries?.image || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.export?.countries?.image && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].export.countries.image} 
                              alt="صورة الدول المستوردة" 
                              className="w-32 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      دعوة للعمل
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          العنوان
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.export?.cta?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.cta) newContent[editingLang].export.cta = {}
                              newContent[editingLang].export.cta.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="ابدأ مشروع التصدير الخاص بك"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.cta?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          النص التوضيحي
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={2}
                            value={content[editingLang]?.export?.cta?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.cta) newContent[editingLang].export.cta = {}
                              newContent[editingLang].export.cta.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="احصل على عرض سعر مخصص وابدأ رحلة التصدير معنا اليوم"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.cta?.subtitle || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          نص الزر
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.export?.cta?.button || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.cta) newContent[editingLang].export.cta = {}
                              newContent[editingLang].export.cta.button = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="طلب عرض سعر الآن"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.cta?.button || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة قسم دعوة العمل
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'export', 'cta', 'backgroundImage')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة خلفية لقسم دعوة العمل (JPG, PNG, WebP)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.export?.cta?.backgroundImage || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.export?.cta?.backgroundImage && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].export.cta.backgroundImage} 
                              alt="صورة خلفية دعوة العمل" 
                              className="w-32 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'products' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">إدارة المنتجات</h2>
                  <Button
                    onClick={() => window.location.href = '/admin/products'}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    إدارة جميع المنتجات
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600">رخام</p>
                        <p className="text-2xl font-bold text-blue-800">12</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                        <Edit className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">جرانيت</p>
                        <p className="text-2xl font-bold text-green-800">8</p>
                      </div>
                      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                        <Edit className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600">كوارتز</p>
                        <p className="text-2xl font-bold text-purple-800">5</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                        <Edit className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                        <p className="text-2xl font-bold text-gray-800">25</p>
                      </div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Edit className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">انقر على &quot;إدارة جميع المنتجات&quot; لإضافة وتعديل المنتجات</p>
                </div>
              </Card>
            )}

            {activeTab === 'quotes' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">طلبات الأسعار</h2>
                  <Button
                    onClick={() => window.location.href = '/admin/quotes'}
                    className="flex items-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    عرض جميع الطلبات
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-600">في الانتظار</p>
                        <p className="text-2xl font-bold text-yellow-800">5</p>
                      </div>
                      <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600">تمت المراجعة</p>
                        <p className="text-2xl font-bold text-blue-800">3</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">تم إرسال العرض</p>
                        <p className="text-2xl font-bold text-green-800">8</p>
                      </div>
                      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                        <Settings className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                        <p className="text-2xl font-bold text-gray-800">16</p>
                      </div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">انقر على &quot;عرض جميع الطلبات&quot; لإدارة طلبات الأسعار</p>
                </div>
              </Card>
            )}

            {activeTab === 'blog' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">إدارة المدونة</h2>
                  <Button
                    onClick={() => window.location.href = '/admin/blog'}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    إدارة جميع المقالات
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">منشور</p>
                        <p className="text-2xl font-bold text-green-800">12</p>
                      </div>
                      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                        <Eye className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-600">مسودات</p>
                        <p className="text-2xl font-bold text-yellow-800">5</p>
                      </div>
                      <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                        <Edit className="w-5 h-5 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600">مميز</p>
                        <p className="text-2xl font-bold text-purple-800">3</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                        <Settings className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">إجمالي المقالات</p>
                        <p className="text-2xl font-bold text-gray-800">17</p>
                      </div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Edit className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">انقر على &quot;إدارة جميع المقالات&quot; لإضافة وتعديل مقالات المدونة</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
