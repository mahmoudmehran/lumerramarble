'use client'

import { useState, useEffect } from 'react'
import { Button } from 'bklumerra/components/ui/button'
import { Input } from 'bklumerra/components/ui/input'
import { Card } from 'bklumerra/components/ui/card'
import { Save, Edit, Eye, Settings } from 'lucide-react'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('homepage')
  const [content, setContent] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentLang, setCurrentLang] = useState('ar')

  // Load content from JSON file (in real app, this would be from API/database)
  useEffect(() => {
    // This would normally fetch from your API
    const mockContent = {
      ar: {
        siteInfo: {
          title: "Lumerra Marble",
          description: "شركة رائدة في تصدير الرخام والجرانيت من مصر",
          phone: "+20 111 312 1444",
          email: "info@lumerramarble.com"
        },
        homepage: {
          hero: {
            title: "أفخم أنواع الرخام والجرانيت من مصر",
            subtitle: "نحن شركة رائدة في تصدير الرخام الطبيعي والجرانيت والكوارتز عالي الجودة من مصر إلى الأسواق العالمية"
          }
        }
      }
    }
    setContent(mockContent)
  }, [])

  const handleSave = () => {
    // This would save to API/database
    alert('تم حفظ التغييرات بنجاح!')
    setIsEditing(false)
  }

  const tabs = [
    { id: 'homepage', name: 'الصفحة الرئيسية', icon: Eye },
    { id: 'products', name: 'المنتجات', icon: Edit },
    { id: 'settings', name: 'الإعدادات', icon: Settings }
  ]

  if (!content) {
    return <div className="p-8">جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم Lumerra Marble</h1>
              <p className="text-gray-600">إدارة محتوى الموقع</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2"
                disabled={!isEditing}
              >
                <Save className="w-4 h-4" />
                حفظ التغييرات
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

                <div className="space-y-6">
                  {/* Hero Section */}
                  <div>
                    <h3 className="font-medium mb-4">قسم العنوان الرئيسي</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">العنوان الرئيسي</label>
                        {isEditing ? (
                          <Input
                            value={content[currentLang]?.homepage?.hero?.title || ''}
                            onChange={(e) => {
                              const newContent = { ...content }
                              newContent[currentLang].homepage.hero.title = e.target.value
                              setContent(newContent)
                            }}
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-md">
                            {content[currentLang]?.homepage?.hero?.title}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">النص التوضيحي</label>
                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={content[currentLang]?.homepage?.hero?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = { ...content }
                              newContent[currentLang].homepage.hero.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-md">
                            {content[currentLang]?.homepage?.hero?.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Site Info */}
                  <div>
                    <h3 className="font-medium mb-4">معلومات التواصل</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                        {isEditing ? (
                          <Input
                            value={content[currentLang]?.siteInfo?.phone || ''}
                            onChange={(e) => {
                              const newContent = { ...content }
                              newContent[currentLang].siteInfo.phone = e.target.value
                              setContent(newContent)
                            }}
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-md">
                            {content[currentLang]?.siteInfo?.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                        {isEditing ? (
                          <Input
                            value={content[currentLang]?.siteInfo?.email || ''}
                            onChange={(e) => {
                              const newContent = { ...content }
                              newContent[currentLang].siteInfo.email = e.target.value
                              setContent(newContent)
                            }}
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-md">
                            {content[currentLang]?.siteInfo?.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'products' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">إدارة المنتجات</h2>
                <div className="text-center py-8 text-gray-500">
                  <Edit className="w-12 h-12 mx-auto mb-4" />
                  <p>قسم إدارة المنتجات قيد التطوير</p>
                  <p className="text-sm">ستتمكن من إضافة وتعديل المنتجات هنا</p>
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
