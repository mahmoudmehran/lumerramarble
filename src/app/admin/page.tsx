'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Select } from '../../components/ui/select'
import { Card } from '../../components/ui/card'
import { Save, Edit, Eye, Settings, Calculator, LogOut } from 'lucide-react'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('homepage')
  const [content, setContent] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentLang, setCurrentLang] = useState('ar')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()



  // Check authentication and load content
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
      console.error('Error parsing user data:', error)
      router.push('/admin/login')
      return
    }

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
        } else {
          // Fallback to default content if API fails
          const { getContent } = await import('../../lib/content')
          const defaultContent = getContent()
          setContent(defaultContent)
        }
      } catch (error) {
        console.error('Error loading content:', error)
        // Fallback to default content
        const { getContent } = await import('../../lib/content')
        const defaultContent = getContent()
        setContent(defaultContent)
      }
      setIsLoading(false)
    }
    
    loadContent()
  }, [router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('image', file)

      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('فشل في رفع الصورة')
      }

      const { filePath } = await response.json()

      // Update content with new image path
      const newContent = JSON.parse(JSON.stringify(content))
      if (!newContent[currentLang]) newContent[currentLang] = {}
      if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
      if (!newContent[currentLang].homepage.hero) newContent[currentLang].homepage.hero = {}
      newContent[currentLang].homepage.hero.backgroundImage = filePath
      setContent(newContent)

      alert('تم رفع الصورة بنجاح!')
    } catch (err) {
      console.error('Upload error:', err)
      alert(err instanceof Error ? err.message : 'خطأ في رفع الصورة')
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
      } else {
        alert('حدث خطأ في حفظ التغييرات')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('حدث خطأ في حفظ التغييرات')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  const tabs = [
    { id: 'homepage', name: 'الصفحة الرئيسية', icon: Eye },
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
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم Lumerra Marble</h1>
              <p className="text-gray-600">مرحباً {user?.name} - إدارة محتوى الموقع</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">اللغة:</label>
                <Select
                  value={currentLang}
                  onChange={(e) => setCurrentLang(e.target.value)}
                  options={[
                    { value: "ar", label: "العربية" },
                    { value: "en", label: "English" },
                    { value: "fr", label: "Français" },
                    { value: "es", label: "Español" }
                  ]}
                />

              </div>
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
                      onClick={() => setActiveTab(tab.id)}
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
                            value={content[currentLang]?.homepage?.hero?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]) newContent[currentLang] = {}
                              if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
                              if (!newContent[currentLang].homepage.hero) newContent[currentLang].homepage.hero = {}
                              newContent[currentLang].homepage.hero.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="أدخل العنوان الرئيسي"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[currentLang]?.homepage?.hero?.title || 'غير محدد'}
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
                            value={content[currentLang]?.homepage?.hero?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]) newContent[currentLang] = {}
                              if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
                              if (!newContent[currentLang].homepage.hero) newContent[currentLang].homepage.hero = {}
                              newContent[currentLang].homepage.hero.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="أدخل النص التوضيحي"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[currentLang]?.homepage?.hero?.subtitle || 'غير محدد'}
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
                              value={content[currentLang]?.homepage?.hero?.primaryButton || ''}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(content))
                                if (!newContent[currentLang]) newContent[currentLang] = {}
                                if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
                                if (!newContent[currentLang].homepage.hero) newContent[currentLang].homepage.hero = {}
                                newContent[currentLang].homepage.hero.primaryButton = e.target.value
                                setContent(newContent)
                              }}
                              placeholder="نص الزر الأساسي"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-md">
                              {content[currentLang]?.homepage?.hero?.primaryButton || 'غير محدد'}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            نص الزر الثانوي
                          </label>
                          {isEditing ? (
                            <Input
                              value={content[currentLang]?.homepage?.hero?.secondaryButton || ''}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(content))
                                if (!newContent[currentLang]) newContent[currentLang] = {}
                                if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
                                if (!newContent[currentLang].homepage.hero) newContent[currentLang].homepage.hero = {}
                                newContent[currentLang].homepage.hero.secondaryButton = e.target.value
                                setContent(newContent)
                              }}
                              placeholder="نص الزر الثانوي"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-md">
                              {content[currentLang]?.homepage?.hero?.secondaryButton || 'غير محدد'}
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
                              {content[currentLang]?.homepage?.hero?.backgroundImage || 'غير محدد'}
                            </div>
                          )}
                          {content[currentLang]?.homepage?.hero?.backgroundImage && (
                            <div className="mt-2">
                              <img 
                                src={content[currentLang].homepage.hero.backgroundImage} 
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
                      {(content[currentLang]?.homepage?.stats?.items || []).map((stat: any, index: number) => (
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
                                  if (!newContent[currentLang]?.homepage?.stats?.items) return
                                  newContent[currentLang].homepage.stats.items[index].number = e.target.value
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
                                  if (!newContent[currentLang]?.homepage?.stats?.items) return
                                  newContent[currentLang].homepage.stats.items[index].text = e.target.value
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
                      {(content[currentLang]?.homepage?.features?.items || []).map((feature: any, index: number) => (
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
                                    if (!newContent[currentLang]?.homepage?.features) return
                                    newContent[currentLang].homepage.features.items[index].title = e.target.value
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
                                    if (!newContent[currentLang]?.homepage?.features) return
                                    newContent[currentLang].homepage.features.items[index].description = e.target.value
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
                            value={content[currentLang]?.homepage?.categories?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]) newContent[currentLang] = {}
                              if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
                              if (!newContent[currentLang].homepage.categories) newContent[currentLang].homepage.categories = {}
                              newContent[currentLang].homepage.categories.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="فئات المنتجات"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[currentLang]?.homepage?.categories?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          وصف قسم الفئات
                        </label>
                        {isEditing ? (
                          <Textarea
                            value={content[currentLang]?.homepage?.categories?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]) newContent[currentLang] = {}
                              if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
                              if (!newContent[currentLang].homepage.categories) newContent[currentLang].homepage.categories = {}
                              newContent[currentLang].homepage.categories.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="استكشف مجموعتنا المتنوعة من الرخام والجرانيت"
                            rows={2}
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[currentLang]?.homepage?.categories?.subtitle || 'غير محدد'}
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
                            value={content[currentLang]?.homepage?.cta?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]) newContent[currentLang] = {}
                              if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
                              if (!newContent[currentLang].homepage.cta) newContent[currentLang].homepage.cta = {}
                              newContent[currentLang].homepage.cta.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="جاهز للبدء؟"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[currentLang]?.homepage?.cta?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          وصف الدعوة للعمل
                        </label>
                        {isEditing ? (
                          <Textarea
                            value={content[currentLang]?.homepage?.cta?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]) newContent[currentLang] = {}
                              if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
                              if (!newContent[currentLang].homepage.cta) newContent[currentLang].homepage.cta = {}
                              newContent[currentLang].homepage.cta.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="احصل على عرض سعر مجاني لمشروعك اليوم"
                            rows={2}
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[currentLang]?.homepage?.cta?.subtitle || 'غير محدد'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          نص زر الدعوة للعمل
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[currentLang]?.homepage?.cta?.button || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]) newContent[currentLang] = {}
                              if (!newContent[currentLang].homepage) newContent[currentLang].homepage = {}
                              if (!newContent[currentLang].homepage.cta) newContent[currentLang].homepage.cta = {}
                              newContent[currentLang].homepage.cta.button = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="احصل على عرض سعر"
                          />
                        ) : (
                          <div className="p-2 bg-white rounded border">
                            {content[currentLang]?.homepage?.cta?.button || 'غير محدد'}
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
                            value={content[currentLang]?.siteInfo?.phone || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]?.siteInfo) {
                                if (!newContent[currentLang]) newContent[currentLang] = {}
                                newContent[currentLang].siteInfo = {}
                              }
                              newContent[currentLang].siteInfo.phone = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="+20 111 312 1444"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[currentLang]?.siteInfo?.phone || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          البريد الإلكتروني
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[currentLang]?.siteInfo?.email || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]?.siteInfo) {
                                if (!newContent[currentLang]) newContent[currentLang] = {}
                                newContent[currentLang].siteInfo = {}
                              }
                              newContent[currentLang].siteInfo.email = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="info@lumerramarble.com"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[currentLang]?.siteInfo?.email || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {currentLang === 'ar' ? 'العنوان' : 'Address'}
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[currentLang]?.siteInfo?.address || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[currentLang]?.siteInfo) {
                                if (!newContent[currentLang]) newContent[currentLang] = {}
                                newContent[currentLang].siteInfo = {}
                              }
                              newContent[currentLang].siteInfo.address = e.target.value
                              setContent(newContent)
                            }}
                            placeholder={currentLang === 'ar' ? 'العنوان' : 'Address'}
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[currentLang]?.siteInfo?.address || 'غير محدد'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Language Sync Warning */}
                  {isEditing && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <p className="text-yellow-800 font-medium">
                          {currentLang === 'ar' 
                            ? 'تذكر: يجب تحديث المحتوى لكل اللغات المدعومة (العربية والإنجليزية)'
                            : 'Remember: Content should be updated for all supported languages (Arabic and English)'
                          }
                        </p>
                      </div>
                    </div>
                  )}
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
                  <p className="text-sm">انقر على "إدارة جميع المنتجات" لإضافة وتعديل المنتجات</p>
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
                  <p className="text-sm">انقر على "عرض جميع الطلبات" لإدارة طلبات الأسعار</p>
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
                  <p className="text-sm">انقر على "إدارة جميع المقالات" لإضافة وتعديل مقالات المدونة</p>
                </div>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">إعدادات الموقع</h2>
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4" />
                  <p>إعدادات الموقع العامة قيد التطوير</p>
                  <p className="text-sm">ستتمكن من تغيير الألوان والخطوط هنا</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
