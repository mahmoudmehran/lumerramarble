'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Select } from '../../components/ui/select'
import { Card } from '../../components/ui/card'
import { Save, Edit, Eye, Settings, Calculator, LogOut, Building, Ship, Mail, Package, Clock } from 'lucide-react'

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
        const response = await fetch('/api/admin/content?page=homepage', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const apiContent = await response.json()
          // Transform API data to Admin panel format
          const transformed = transformApiToAdmin(apiContent, 'homepage')
          setContent(transformed)
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

  // Helper function to transform API data to Admin panel format
  const transformApiToAdmin = (apiContent: any, page: string) => {
    // API format: { hero: { title: { ar: "...", en: "..." } } }
    // Admin format: { ar: { [page]: { hero: { title: "..." } } } }
    
    const transformed: any = {
      ar: { [page]: {} },
      en: { [page]: {} },
      es: { [page]: {} },
      fr: { [page]: {} }
    }

    for (const sectionKey in apiContent) {
      // Special handling for stats section - convert to items array
      if (sectionKey === 'stats' && page === 'homepage') {
        const languages = ['ar', 'en', 'es', 'fr']
        languages.forEach(lang => {
          if (!transformed[lang][page].stats) {
            transformed[lang][page].stats = { 
              title: apiContent.stats.title?.[lang] || '',
              items: [
                { 
                  number: apiContent.stats.clients_number?.[lang] || '', 
                  text: apiContent.stats.clients_text?.[lang] || '' 
                },
                { 
                  number: apiContent.stats.projects_number?.[lang] || '', 
                  text: apiContent.stats.projects_text?.[lang] || '' 
                },
                { 
                  number: apiContent.stats.countries_number?.[lang] || '', 
                  text: apiContent.stats.countries_text?.[lang] || '' 
                },
                { 
                  number: apiContent.stats.satisfaction_number?.[lang] || '', 
                  text: apiContent.stats.satisfaction_text?.[lang] || '' 
                }
              ]
            }
          }
        })
        continue
      }

      // Special handling for features section - convert to items array
      if (sectionKey === 'features' && page === 'homepage') {
        const languages = ['ar', 'en', 'es', 'fr']
        languages.forEach(lang => {
          if (!transformed[lang][page].features) {
            transformed[lang][page].features = {
              title: apiContent.features.title?.[lang] || '',
              items: [
                { 
                  title: apiContent.features.quality_title?.[lang] || '', 
                  description: apiContent.features.quality_description?.[lang] || '' 
                },
                { 
                  title: apiContent.features.global_title?.[lang] || '', 
                  description: apiContent.features.global_description?.[lang] || '' 
                },
                { 
                  title: apiContent.features.service_title?.[lang] || '', 
                  description: apiContent.features.service_description?.[lang] || '' 
                },
                { 
                  title: apiContent.features.experience_title?.[lang] || '', 
                  description: apiContent.features.experience_description?.[lang] || '' 
                }
              ]
            }
          }
        })
        continue
      }

      // Standard handling for other sections
      for (const contentKey in apiContent[sectionKey]) {
        const values = apiContent[sectionKey][contentKey]
        
        if (!transformed.ar[page][sectionKey]) {
          transformed.ar[page][sectionKey] = {}
          transformed.en[page][sectionKey] = {}
          transformed.es[page][sectionKey] = {}
          transformed.fr[page][sectionKey] = {}
        }
        
        transformed.ar[page][sectionKey][contentKey] = values.ar || ''
        transformed.en[page][sectionKey][contentKey] = values.en || ''
        transformed.es[page][sectionKey][contentKey] = values.es || ''
        transformed.fr[page][sectionKey][contentKey] = values.fr || ''
      }
    }

    return transformed
  }

  // Helper function to transform Admin panel data to API format
  const transformAdminToApi = (adminContent: any, page: string) => {
    // Admin format: { ar: { [page]: { hero: { title: "..." } } } }
    // API format: { hero: { title: { ar: "...", en: "..." } } }
    
    const transformed: any = {}

    // Extract all sections from any language
    const sampleLang = adminContent.ar?.[page] || adminContent.en?.[page] || {}
    
    for (const sectionKey in sampleLang) {
      // Special handling for stats section - convert items array back to flat structure
      if (sectionKey === 'stats' && page === 'homepage') {
        transformed.stats = {
          title: {
            ar: adminContent.ar?.[page]?.stats?.title || '',
            en: adminContent.en?.[page]?.stats?.title || '',
            es: adminContent.es?.[page]?.stats?.title || '',
            fr: adminContent.fr?.[page]?.stats?.title || ''
          },
          clients_number: {
            ar: adminContent.ar?.[page]?.stats?.items?.[0]?.number || '',
            en: adminContent.en?.[page]?.stats?.items?.[0]?.number || '',
            es: adminContent.es?.[page]?.stats?.items?.[0]?.number || '',
            fr: adminContent.fr?.[page]?.stats?.items?.[0]?.number || ''
          },
          clients_text: {
            ar: adminContent.ar?.[page]?.stats?.items?.[0]?.text || '',
            en: adminContent.en?.[page]?.stats?.items?.[0]?.text || '',
            es: adminContent.es?.[page]?.stats?.items?.[0]?.text || '',
            fr: adminContent.fr?.[page]?.stats?.items?.[0]?.text || ''
          },
          projects_number: {
            ar: adminContent.ar?.[page]?.stats?.items?.[1]?.number || '',
            en: adminContent.en?.[page]?.stats?.items?.[1]?.number || '',
            es: adminContent.es?.[page]?.stats?.items?.[1]?.number || '',
            fr: adminContent.fr?.[page]?.stats?.items?.[1]?.number || ''
          },
          projects_text: {
            ar: adminContent.ar?.[page]?.stats?.items?.[1]?.text || '',
            en: adminContent.en?.[page]?.stats?.items?.[1]?.text || '',
            es: adminContent.es?.[page]?.stats?.items?.[1]?.text || '',
            fr: adminContent.fr?.[page]?.stats?.items?.[1]?.text || ''
          },
          countries_number: {
            ar: adminContent.ar?.[page]?.stats?.items?.[2]?.number || '',
            en: adminContent.en?.[page]?.stats?.items?.[2]?.number || '',
            es: adminContent.es?.[page]?.stats?.items?.[2]?.number || '',
            fr: adminContent.fr?.[page]?.stats?.items?.[2]?.number || ''
          },
          countries_text: {
            ar: adminContent.ar?.[page]?.stats?.items?.[2]?.text || '',
            en: adminContent.en?.[page]?.stats?.items?.[2]?.text || '',
            es: adminContent.es?.[page]?.stats?.items?.[2]?.text || '',
            fr: adminContent.fr?.[page]?.stats?.items?.[2]?.text || ''
          },
          satisfaction_number: {
            ar: adminContent.ar?.[page]?.stats?.items?.[3]?.number || '',
            en: adminContent.en?.[page]?.stats?.items?.[3]?.number || '',
            es: adminContent.es?.[page]?.stats?.items?.[3]?.number || '',
            fr: adminContent.fr?.[page]?.stats?.items?.[3]?.number || ''
          },
          satisfaction_text: {
            ar: adminContent.ar?.[page]?.stats?.items?.[3]?.text || '',
            en: adminContent.en?.[page]?.stats?.items?.[3]?.text || '',
            es: adminContent.es?.[page]?.stats?.items?.[3]?.text || '',
            fr: adminContent.fr?.[page]?.stats?.items?.[3]?.text || ''
          }
        }
        continue
      }

      // Special handling for features section - convert items array back to flat structure
      if (sectionKey === 'features' && page === 'homepage') {
        transformed.features = {
          title: {
            ar: adminContent.ar?.[page]?.features?.title || '',
            en: adminContent.en?.[page]?.features?.title || '',
            es: adminContent.es?.[page]?.features?.title || '',
            fr: adminContent.fr?.[page]?.features?.title || ''
          },
          quality_title: {
            ar: adminContent.ar?.[page]?.features?.items?.[0]?.title || '',
            en: adminContent.en?.[page]?.features?.items?.[0]?.title || '',
            es: adminContent.es?.[page]?.features?.items?.[0]?.title || '',
            fr: adminContent.fr?.[page]?.features?.items?.[0]?.title || ''
          },
          quality_description: {
            ar: adminContent.ar?.[page]?.features?.items?.[0]?.description || '',
            en: adminContent.en?.[page]?.features?.items?.[0]?.description || '',
            es: adminContent.es?.[page]?.features?.items?.[0]?.description || '',
            fr: adminContent.fr?.[page]?.features?.items?.[0]?.description || ''
          },
          global_title: {
            ar: adminContent.ar?.[page]?.features?.items?.[1]?.title || '',
            en: adminContent.en?.[page]?.features?.items?.[1]?.title || '',
            es: adminContent.es?.[page]?.features?.items?.[1]?.title || '',
            fr: adminContent.fr?.[page]?.features?.items?.[1]?.title || ''
          },
          global_description: {
            ar: adminContent.ar?.[page]?.features?.items?.[1]?.description || '',
            en: adminContent.en?.[page]?.features?.items?.[1]?.description || '',
            es: adminContent.es?.[page]?.features?.items?.[1]?.description || '',
            fr: adminContent.fr?.[page]?.features?.items?.[1]?.description || ''
          },
          service_title: {
            ar: adminContent.ar?.[page]?.features?.items?.[2]?.title || '',
            en: adminContent.en?.[page]?.features?.items?.[2]?.title || '',
            es: adminContent.es?.[page]?.features?.items?.[2]?.title || '',
            fr: adminContent.fr?.[page]?.features?.items?.[2]?.title || ''
          },
          service_description: {
            ar: adminContent.ar?.[page]?.features?.items?.[2]?.description || '',
            en: adminContent.en?.[page]?.features?.items?.[2]?.description || '',
            es: adminContent.es?.[page]?.features?.items?.[2]?.description || '',
            fr: adminContent.fr?.[page]?.features?.items?.[2]?.description || ''
          },
          experience_title: {
            ar: adminContent.ar?.[page]?.features?.items?.[3]?.title || '',
            en: adminContent.en?.[page]?.features?.items?.[3]?.title || '',
            es: adminContent.es?.[page]?.features?.items?.[3]?.title || '',
            fr: adminContent.fr?.[page]?.features?.items?.[3]?.title || ''
          },
          experience_description: {
            ar: adminContent.ar?.[page]?.features?.items?.[3]?.description || '',
            en: adminContent.en?.[page]?.features?.items?.[3]?.description || '',
            es: adminContent.es?.[page]?.features?.items?.[3]?.description || '',
            fr: adminContent.fr?.[page]?.features?.items?.[3]?.description || ''
          }
        }
        continue
      }

      // Standard handling for other sections
      transformed[sectionKey] = {}
      for (const contentKey in sampleLang[sectionKey]) {
        transformed[sectionKey][contentKey] = {
          ar: adminContent.ar?.[page]?.[sectionKey]?.[contentKey] || '',
          en: adminContent.en?.[page]?.[sectionKey]?.[contentKey] || '',
          es: adminContent.es?.[page]?.[sectionKey]?.[contentKey] || '',
          fr: adminContent.fr?.[page]?.[sectionKey]?.[contentKey] || ''
        }
      }
    }

    return transformed
  }

  // Load content when activeTab changes
  useEffect(() => {
    const loadTabContent = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/content?page=${activeTab}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const apiContent = await response.json()
          // Transform API data to Admin panel format
          const transformed = transformApiToAdmin(apiContent, activeTab)
          setContent(transformed)
        }
      } catch (error) {
        console.error('Error loading tab content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTabContent()
  }, [activeTab])

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
      formData.append('file', file)  // تغيير من 'image' إلى 'file'

      const token = localStorage.getItem('admin_token')
      console.log('Token exists:', !!token)
      
      // التأكد من استخدام البورت الصحيح
      const baseUrl = window.location.origin
      console.log('Upload URL:', `${baseUrl}/api/upload`)
      
      const response = await fetch(`${baseUrl}/api/upload`, {
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

      const responseData = await response.json()
      console.log('Upload response:', responseData)
      const filePath = responseData.url || responseData.files?.[0]
      
      if (!filePath) {
        throw new Error('لم يتم إرجاع مسار الصورة من الخادم')
      }

      // Update content with new image path for all languages
      const newContent = JSON.parse(JSON.stringify(content))
      const languages = ['ar', 'en', 'fr', 'es']
      
      console.log('Updating content with:', { section, subSection, imageKey, filePath, activeTab })
      
      languages.forEach(lang => {
        if (!newContent[lang]) newContent[lang] = {}

        if (section && subSection && imageKey) {
          // For specific sections like about.hero.backgroundImage
          if (!newContent[lang][section]) newContent[lang][section] = {}
          if (!newContent[lang][section][subSection]) newContent[lang][section][subSection] = {}
          newContent[lang][section][subSection][imageKey] = filePath
          console.log(`Updated ${lang}.${section}.${subSection}.${imageKey} = ${filePath}`)
        } else {
          // Default to homepage hero background
          if (!newContent[lang].homepage) newContent[lang].homepage = {}
          if (!newContent[lang].homepage.hero) newContent[lang].homepage.hero = {}
          newContent[lang].homepage.hero.backgroundImage = filePath
          console.log(`Updated ${lang}.homepage.hero.backgroundImage = ${filePath}`)
        }
      })

      setContent(newContent)
      console.log('تم رفع الصورة بنجاح:', filePath)
      console.log('Content after update:', newContent)
      alert('تم رفع الصورة بنجاح! ⚠️ تذكر الضغط على "حفظ" لحفظ التغييرات في قاعدة البيانات.')
    } catch (err) {
      console.error('Upload error:', err)
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف في رفع الصورة'
      alert(`خطأ في رفع الصورة: ${errorMessage}`)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      // Transform Admin panel data to API format before sending
      const apiFormat = transformAdminToApi(content, activeTab)
      
      console.log('Saving content for page:', activeTab)
      console.log('Admin format (before transform):', content)
      console.log('API format (after transform):', apiFormat)
      
      const response = await fetch(`/api/admin/content?page=${activeTab}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiFormat)
      })

      if (response.ok) {
        alert('تم حفظ التغييرات بنجاح!')
        setIsEditing(false)
        
        // إعادة تحميل المحتوى المحدث
        const updatedResponse = await fetch(`/api/admin/content?page=${activeTab}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        })
        
        if (updatedResponse.ok) {
          const updatedContent = await updatedResponse.json()
          const transformed = transformApiToAdmin(updatedContent, activeTab)
          setContent(transformed)
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
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b-2 border-primary-200 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-3 rounded-xl shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  لوحة تحكم لوميرا ماربل
                </h1>
                <p className="text-sm text-gray-600 font-medium">مرحباً {user?.name} 👋</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {content?._lastUpdated && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <Clock className="w-4 h-4" />
                  <span>آخر تحديث: {new Date(content._lastUpdated).toLocaleString('ar-EG', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short'
                  })}</span>
                </div>
              )}
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-5 py-2.5"
                disabled={!isEditing}
              >
                <Save className="w-4 h-4" />
                <span className="font-semibold">حفظ التغييرات</span>
              </Button>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-300 hover:border-red-600 transition-all duration-300 px-4 py-2.5 shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[88px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-6">
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

              {/* External Links Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">إدارة متقدمة</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/admin/quotes')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-right transition-colors text-gray-600 hover:bg-gray-100"
                  >
                    <Calculator className="w-4 h-4" />
                    طلبات الأسعار
                  </button>
                  <button
                    onClick={() => router.push('/admin/messages')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-right transition-colors text-gray-600 hover:bg-gray-100"
                  >
                    <Mail className="w-4 h-4" />
                    الرسائل الواردة
                  </button>
                  <button
                    onClick={() => router.push('/admin/products')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-right transition-colors text-gray-600 hover:bg-gray-100"
                  >
                    <Package className="w-4 h-4" />
                    إدارة المنتجات
                  </button>
                </div>
              </div>
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
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">رفع ملف</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, activeTab, 'hero', 'backgroundImage')}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-xs text-gray-500">أو</span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">رابط مباشر</label>
                                <Input
                                  value={content[editingLang]?.homepage?.hero?.backgroundImage || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                    if (!newContent[editingLang].homepage.hero) newContent[editingLang].homepage.hero = {}
                                    newContent[editingLang].homepage.hero.backgroundImage = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="https://example.com/image.jpg أو /images/hero-marble.jpg"
                                />
                              </div>
                              <p className="text-xs text-gray-500">
                                يمكنك رفع صورة أو إدخال رابط مباشر (JPG, PNG, WebP)
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
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان قسم الإحصائيات
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.homepage?.stats?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                              if (!newContent[editingLang].homepage.stats) newContent[editingLang].homepage.stats = {}
                              newContent[editingLang].homepage.stats.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="أرقامنا تتحدث"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.homepage?.stats?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

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
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان قسم المميزات
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.homepage?.features?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                              if (!newContent[editingLang].homepage.features) newContent[editingLang].homepage.features = {}
                              newContent[editingLang].homepage.features.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="لماذا تختارنا"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.homepage?.features?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

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

                      {/* Category Items */}
                      <div className="mt-6 space-y-6">
                        <h4 className="font-semibold text-md text-primary-600 border-b pb-2">بطاقات الفئات</h4>
                        
                        {/* Marble Category */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-3">فئة الرخام (Marble)</h5>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">اسم الفئة</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.homepage?.categories?.marble_name || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                    if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                                    newContent[editingLang].homepage.categories.marble_name = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="رخام"
                                />
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {content[editingLang]?.homepage?.categories?.marble_name || 'غير محدد'}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">صورة الفئة</label>
                              {isEditing ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">رفع ملف</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, activeTab, 'categories', 'marble_image')}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-xs text-gray-500">أو</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">رابط مباشر</label>
                                    <Input
                                      value={content[editingLang]?.homepage?.categories?.marble_image || ''}
                                      onChange={(e) => {
                                        const newContent = JSON.parse(JSON.stringify(content))
                                        if (!newContent[editingLang]) newContent[editingLang] = {}
                                        if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                        if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                                        newContent[editingLang].homepage.categories.marble_image = e.target.value
                                        setContent(newContent)
                                      }}
                                      placeholder="/images/marble-category.jpg"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {content[editingLang]?.homepage?.categories?.marble_image || 'غير محدد'}
                                </div>
                              )}
                              {content[editingLang]?.homepage?.categories?.marble_image && (
                                <div className="mt-2">
                                  <img 
                                    src={content[editingLang].homepage.categories.marble_image} 
                                    alt="صورة الرخام" 
                                    className="w-32 h-32 object-cover rounded border"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Granite Category */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-3">فئة الجرانيت (Granite)</h5>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">اسم الفئة</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.homepage?.categories?.granite_name || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                    if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                                    newContent[editingLang].homepage.categories.granite_name = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="جرانيت"
                                />
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {content[editingLang]?.homepage?.categories?.granite_name || 'غير محدد'}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">صورة الفئة</label>
                              {isEditing ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">رفع ملف</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, activeTab, 'categories', 'granite_image')}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-xs text-gray-500">أو</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">رابط مباشر</label>
                                    <Input
                                      value={content[editingLang]?.homepage?.categories?.granite_image || ''}
                                      onChange={(e) => {
                                        const newContent = JSON.parse(JSON.stringify(content))
                                        if (!newContent[editingLang]) newContent[editingLang] = {}
                                        if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                        if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                                        newContent[editingLang].homepage.categories.granite_image = e.target.value
                                        setContent(newContent)
                                      }}
                                      placeholder="/images/granite-category.jpg"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {content[editingLang]?.homepage?.categories?.granite_image || 'غير محدد'}
                                </div>
                              )}
                              {content[editingLang]?.homepage?.categories?.granite_image && (
                                <div className="mt-2">
                                  <img 
                                    src={content[editingLang].homepage.categories.granite_image} 
                                    alt="صورة الجرانيت" 
                                    className="w-32 h-32 object-cover rounded border"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quartz Category */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-3">فئة الكوارتز (Quartz)</h5>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">اسم الفئة</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.homepage?.categories?.quartz_name || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                    if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                                    newContent[editingLang].homepage.categories.quartz_name = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="كوارتز"
                                />
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {content[editingLang]?.homepage?.categories?.quartz_name || 'غير محدد'}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">صورة الفئة</label>
                              {isEditing ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">رفع ملف</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, activeTab, 'categories', 'quartz_image')}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-xs text-gray-500">أو</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">رابط مباشر</label>
                                    <Input
                                      value={content[editingLang]?.homepage?.categories?.quartz_image || ''}
                                      onChange={(e) => {
                                        const newContent = JSON.parse(JSON.stringify(content))
                                        if (!newContent[editingLang]) newContent[editingLang] = {}
                                        if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                        if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                                        newContent[editingLang].homepage.categories.quartz_image = e.target.value
                                        setContent(newContent)
                                      }}
                                      placeholder="/images/quartz-category.jpg"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {content[editingLang]?.homepage?.categories?.quartz_image || 'غير محدد'}
                                </div>
                              )}
                              {content[editingLang]?.homepage?.categories?.quartz_image && (
                                <div className="mt-2">
                                  <img 
                                    src={content[editingLang].homepage.categories.quartz_image} 
                                    alt="صورة الكوارتز" 
                                    className="w-32 h-32 object-cover rounded border"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Special Category */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium mb-3">فئة الأحجار الخاصة (Special Stones)</h5>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">اسم الفئة</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.homepage?.categories?.special_name || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                    if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                                    newContent[editingLang].homepage.categories.special_name = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="أحجار خاصة"
                                />
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {content[editingLang]?.homepage?.categories?.special_name || 'غير محدد'}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">صورة الفئة</label>
                              {isEditing ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">رفع ملف</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, activeTab, 'categories', 'special_image')}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-xs text-gray-500">أو</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">رابط مباشر</label>
                                    <Input
                                      value={content[editingLang]?.homepage?.categories?.special_image || ''}
                                      onChange={(e) => {
                                        const newContent = JSON.parse(JSON.stringify(content))
                                        if (!newContent[editingLang]) newContent[editingLang] = {}
                                        if (!newContent[editingLang].homepage) newContent[editingLang].homepage = {}
                                        if (!newContent[editingLang].homepage.categories) newContent[editingLang].homepage.categories = {}
                                        newContent[editingLang].homepage.categories.special_image = e.target.value
                                        setContent(newContent)
                                      }}
                                      placeholder="/images/special-category.jpg"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2 bg-white rounded border">
                                  {content[editingLang]?.homepage?.categories?.special_image || 'غير محدد'}
                                </div>
                              )}
                              {content[editingLang]?.homepage?.categories?.special_image && (
                                <div className="mt-2">
                                  <img 
                                    src={content[editingLang].homepage.categories.special_image} 
                                    alt="صورة الأحجار الخاصة" 
                                    className="w-32 h-32 object-cover rounded border"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
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
                            placeholder="عن شركة لوميرا ماربل"
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
                            value={content[editingLang]?.about?.hero?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.hero) newContent[editingLang].about.hero = {}
                              newContent[editingLang].about.hero.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="رحلة من التميز في تصدير الأحجار الطبيعية"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.hero?.subtitle || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة القسم الرئيسي
                        </label>
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">رفع ملف</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'about', 'hero', 'backgroundImage')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-px bg-gray-300"></div>
                              <span className="text-xs text-gray-500">أو</span>
                              <div className="flex-1 h-px bg-gray-300"></div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">رابط مباشر</label>
                              <Input
                                value={content[editingLang]?.about?.hero?.backgroundImage || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.hero) newContent[editingLang].about.hero = {}
                                  newContent[editingLang].about.hero.backgroundImage = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="/images/about-hero.jpg"
                              />
                            </div>
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

                  {/* Story Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      قصتنا
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان القسم
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.about?.story?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.story) newContent[editingLang].about.story = {}
                              newContent[editingLang].about.story.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="قصتنا"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.story?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          محتوى القصة
                        </label>
                        {isEditing ? (
                          <Textarea
                            rows={8}
                            value={content[editingLang]?.about?.story?.content || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.story) newContent[editingLang].about.story = {}
                              newContent[editingLang].about.story.content = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="تأسست شركة لوميرا ماربل في مصر بهدف أن تكون الجسر الذي يربط بين جمال الأحجار الطبيعية المصرية والأسواق العالمية..."
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                            {content[editingLang]?.about?.story?.content || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة القصة
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'about', 'story', 'image')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="text-sm text-gray-600">أو أدخل رابط الصورة:</div>
                            <Input
                              value={content[editingLang]?.about?.story?.image || ''}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(content))
                                if (!newContent[editingLang]) newContent[editingLang] = {}
                                if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                if (!newContent[editingLang].about.story) newContent[editingLang].about.story = {}
                                newContent[editingLang].about.story.image = e.target.value
                                setContent(newContent)
                              }}
                              placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة توضيحية للقصة (JPG, PNG, WebP)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.story?.image || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.about?.story?.image && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].about.story.image} 
                              alt="صورة القصة" 
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

                  {/* Values Section */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b pb-2">
                      قيمنا
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          عنوان القسم
                        </label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.about?.values?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].about) newContent[editingLang].about = {}
                              if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                              newContent[editingLang].about.values.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="قيمنا"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.values?.title || 'غير محدد'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة خلفية قسم القيم
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'about', 'values', 'backgroundImage')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="text-sm text-gray-600">أو أدخل رابط الصورة:</div>
                            <Input
                              value={content[editingLang]?.about?.values?.backgroundImage || ''}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(content))
                                if (!newContent[editingLang]) newContent[editingLang] = {}
                                if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                newContent[editingLang].about.values.backgroundImage = e.target.value
                                setContent(newContent)
                              }}
                              placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة خلفية لقسم القيم (JPG, PNG, WebP)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.values?.backgroundImage || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.about?.values?.backgroundImage && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].about.values.backgroundImage} 
                              alt="صورة خلفية القيم" 
                              className="w-32 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Vision Card */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">القيمة 1: رؤيتنا</h4>
                        <div className="space-y-3 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">عنوان</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.values?.vision_title || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.vision_title = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="رؤيتنا"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.vision_title || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">وصف</label>
                            {isEditing ? (
                              <Textarea
                                rows={3}
                                value={content[editingLang]?.about?.values?.vision_description || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.vision_description = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="أن نكون الشركة الرائدة عالمياً في تصدير الأحجار الطبيعية"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.vision_description || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mission Card */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">القيمة 2: رسالتنا</h4>
                        <div className="space-y-3 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">عنوان</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.values?.mission_title || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.mission_title = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="رسالتنا"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.mission_title || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">وصف</label>
                            {isEditing ? (
                              <Textarea
                                rows={3}
                                value={content[editingLang]?.about?.values?.mission_description || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.mission_description = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="نسعى لتقديم أفضل المنتجات والخدمات لعملائنا"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.mission_description || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quality Value */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">القيمة 3: الجودة</h4>
                        <div className="space-y-3 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">عنوان</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.values?.quality_title || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.quality_title = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="الجودة أولًا"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.quality_title || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">وصف</label>
                            {isEditing ? (
                              <Textarea
                                rows={2}
                                value={content[editingLang]?.about?.values?.quality_description || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.quality_description = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="نلتزم بأعلى معايير الجودة في كل منتج نقدمه"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.quality_description || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Trust Value */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">القيمة 4: الثقة</h4>
                        <div className="space-y-3 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">عنوان</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.values?.trust_title || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.trust_title = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="الثقة والشفافية"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.trust_title || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">وصف</label>
                            {isEditing ? (
                              <Textarea
                                rows={2}
                                value={content[editingLang]?.about?.values?.trust_description || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.trust_description = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="نبني علاقات طويلة الأمد مع عملائنا"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.trust_description || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Global Value */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">القيمة 5: الوصول العالمي</h4>
                        <div className="space-y-3 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">عنوان</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.values?.global_title || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.global_title = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="الوصول العالمي"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.global_title || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">وصف</label>
                            {isEditing ? (
                              <Textarea
                                rows={2}
                                value={content[editingLang]?.about?.values?.global_description || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.global_description = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="نصدر منتجاتنا لعملاء حول العالم"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.global_description || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Service Value */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">القيمة 6: التميز في الخدمة</h4>
                        <div className="space-y-3 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">عنوان</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.values?.service_title || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.service_title = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="التميز في الخدمة"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.service_title || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">وصف</label>
                            {isEditing ? (
                              <Textarea
                                rows={2}
                                value={content[editingLang]?.about?.values?.service_description || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.service_description = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="نقدم خدمة عملاء متميزة"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.service_description || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Precision Value */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">القيمة 7: الدقة</h4>
                        <div className="space-y-3 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">عنوان</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.values?.precision_title || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.precision_title = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="الدقة في التنفيذ"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.precision_title || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">وصف</label>
                            {isEditing ? (
                              <Textarea
                                rows={2}
                                value={content[editingLang]?.about?.values?.precision_description || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.precision_description = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="نهتم بأدق التفاصيل في كل مشروع"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.precision_description || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Passion Value */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">القيمة 8: الشغف</h4>
                        <div className="space-y-3 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">عنوان</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.values?.passion_title || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.passion_title = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="الشغف بالتميز"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.passion_title || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">وصف</label>
                            {isEditing ? (
                              <Textarea
                                rows={2}
                                value={content[editingLang]?.about?.values?.passion_description || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.values) newContent[editingLang].about.values = {}
                                  newContent[editingLang].about.values.passion_description = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="نعمل بشغف لتقديم الأفضل"
                              />
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.values?.passion_description || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
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
                          صورة خلفية كونتينر البيانات
                        </label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'about', 'location', 'backgroundImage')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-sm text-gray-500">
                              اختر صورة خلفية لكونتينر البيانات (خريطة أو صورة أخرى)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md">
                            {content[editingLang]?.about?.location?.backgroundImage || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.about?.location?.backgroundImage && (
                          <div className="mt-2">
                            <img 
                              src={content[editingLang].about.location.backgroundImage} 
                              alt="صورة خلفية البيانات" 
                              className="w-32 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          صورة الموقع (الجانبية)
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
                      
                      {/* Experience Stat */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">الإحصائية 1: سنوات الخبرة</h4>
                        <div className="grid grid-cols-2 gap-4 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">الرقم</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.stats?.experience_number || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.stats) newContent[editingLang].about.stats = {}
                                  newContent[editingLang].about.stats.experience_number = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="15+"
                              />
                            ) : (
                              <div className="p-2 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.stats?.experience_number || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">النص</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.stats?.experience_text || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.stats) newContent[editingLang].about.stats = {}
                                  newContent[editingLang].about.stats.experience_text = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="سنوات من الخبرة"
                              />
                            ) : (
                              <div className="p-2 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.stats?.experience_text || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Countries Stat */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">الإحصائية 2: الدول</h4>
                        <div className="grid grid-cols-2 gap-4 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">الرقم</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.stats?.countries_number || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.stats) newContent[editingLang].about.stats = {}
                                  newContent[editingLang].about.stats.countries_number = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="30+"
                              />
                            ) : (
                              <div className="p-2 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.stats?.countries_number || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">النص</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.stats?.countries_text || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.stats) newContent[editingLang].about.stats = {}
                                  newContent[editingLang].about.stats.countries_text = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="دولة حول العالم"
                              />
                            ) : (
                              <div className="p-2 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.stats?.countries_text || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Projects Stat */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">الإحصائية 3: المشاريع</h4>
                        <div className="grid grid-cols-2 gap-4 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">الرقم</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.stats?.projects_number || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.stats) newContent[editingLang].about.stats = {}
                                  newContent[editingLang].about.stats.projects_number = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="500+"
                              />
                            ) : (
                              <div className="p-2 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.stats?.projects_number || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">النص</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.stats?.projects_text || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.stats) newContent[editingLang].about.stats = {}
                                  newContent[editingLang].about.stats.projects_text = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="مشروع مكتمل"
                              />
                            ) : (
                              <div className="p-2 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.stats?.projects_text || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Satisfaction Stat */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3 text-primary-600">الإحصائية 4: رضا العملاء</h4>
                        <div className="grid grid-cols-2 gap-4 pl-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">الرقم</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.stats?.satisfaction_number || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.stats) newContent[editingLang].about.stats = {}
                                  newContent[editingLang].about.stats.satisfaction_number = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="98%"
                              />
                            ) : (
                              <div className="p-2 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.stats?.satisfaction_number || 'غير محدد'}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">النص</label>
                            {isEditing ? (
                              <Input
                                value={content[editingLang]?.about?.stats?.satisfaction_text || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].about) newContent[editingLang].about = {}
                                  if (!newContent[editingLang].about.stats) newContent[editingLang].about.stats = {}
                                  newContent[editingLang].about.stats.satisfaction_text = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="نسبة رضا العملاء"
                              />
                            ) : (
                              <div className="p-2 bg-gray-50 rounded-md text-sm">
                                {content[editingLang]?.about?.stats?.satisfaction_text || 'غير محدد'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
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
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <label className="text-xs text-gray-600 font-medium">رفع صورة:</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'export', 'hero', 'backgroundImage')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                              />
                              <p className="text-xs text-gray-500">اختر صورة (JPG, PNG, WebP)</p>
                            </div>
                            
                            <div className="relative flex items-center">
                              <div className="flex-grow border-t border-gray-300"></div>
                              <span className="flex-shrink mx-4 text-gray-500 text-xs">أو</span>
                              <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-xs text-gray-600 font-medium">رابط صورة مباشر:</label>
                              <Input
                                value={content[editingLang]?.export?.hero?.backgroundImage || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                  if (!newContent[editingLang].export.hero) newContent[editingLang].export.hero = {}
                                  newContent[editingLang].export.hero.backgroundImage = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="https://example.com/image.jpg"
                                className="text-sm"
                              />
                              <p className="text-xs text-gray-500">أدخل رابط الصورة مباشرة</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-md text-sm">
                            {content[editingLang]?.export?.hero?.backgroundImage || 'غير محدد'}
                          </div>
                        )}
                        {content[editingLang]?.export?.hero?.backgroundImage && (
                          <div className="mt-3">
                            <img 
                              src={content[editingLang].export.hero.backgroundImage} 
                              alt="صورة القسم الرئيسي" 
                              className="w-40 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
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
                  <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-lg border-2 border-primary-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-primary-700 border-b-2 border-primary-200 pb-2 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      خدماتنا
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">عنوان القسم</label>
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
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.services?.title || 'غير محدد'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">وصف القسم</label>
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
                            placeholder="نقدم خدمات تصدير متكاملة"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.services?.subtitle || 'غير محدد'}</div>
                        )}
                      </div>

                      {/* 6 Services */}
                      {['consultation', 'packaging', 'shipping', 'quality', 'delivery', 'aftersales'].map((service, idx) => (
                        <div key={service} className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm">
                          <h4 className="font-semibold text-md mb-3 text-primary-600 flex items-center gap-2">
                            <span className="bg-primary-100 text-primary-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                            {service === 'consultation' && 'الاستشارات والتخطيط'}
                            {service === 'packaging' && 'التغليف والتعبئة'}
                            {service === 'shipping' && 'الشحن الدولي'}
                            {service === 'quality' && 'مراقبة الجودة'}
                            {service === 'delivery' && 'التسليم والمتابعة'}
                            {service === 'aftersales' && 'خدمات ما بعد البيع'}
                          </h4>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">عنوان الخدمة</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.export?.services?.[`${service}_title`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.services) newContent[editingLang].export.services = {}
                                    newContent[editingLang].export.services[`${service}_title`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder={`عنوان ${service}`}
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.services?.[`${service}_title`] || 'غير محدد'}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">وصف الخدمة</label>
                              {isEditing ? (
                                <Textarea
                                  rows={2}
                                  value={content[editingLang]?.export?.services?.[`${service}_description`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.services) newContent[editingLang].export.services = {}
                                    newContent[editingLang].export.services[`${service}_description`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder={`وصف ${service}`}
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.services?.[`${service}_description`] || 'غير محدد'}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">صورة الخدمة</label>
                              {isEditing ? (
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-xs text-gray-500">رفع صورة:</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, 'export', 'services', `${service}_image`)}
                                      className="w-full px-2 py-1 border rounded text-xs"
                                    />
                                  </div>
                                  <div className="text-center text-xs text-gray-400">أو</div>
                                  <div>
                                    <label className="text-xs text-gray-500">رابط مباشر:</label>
                                    <Input
                                      value={content[editingLang]?.export?.services?.[`${service}_image`] || ''}
                                      onChange={(e) => {
                                        const newContent = JSON.parse(JSON.stringify(content))
                                        if (!newContent[editingLang]) newContent[editingLang] = {}
                                        if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                        if (!newContent[editingLang].export.services) newContent[editingLang].export.services = {}
                                        newContent[editingLang].export.services[`${service}_image`] = e.target.value
                                        setContent(newContent)
                                      }}
                                      placeholder="https://example.com/image.jpg"
                                      className="text-xs"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-xs break-all">{content[editingLang]?.export?.services?.[`${service}_image`] || 'غير محدد'}</div>
                              )}
                              {content[editingLang]?.export?.services?.[`${service}_image`] && (
                                <img 
                                  src={content[editingLang].export.services[`${service}_image`]} 
                                  alt={service}
                                  className="w-32 h-20 object-cover rounded-lg border-2 mt-2"
                                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Process Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border-2 border-blue-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-blue-700 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      خطوات العمل
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">عنوان القسم</label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.export?.process?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.process) newContent[editingLang].export.process = {}
                              newContent[editingLang].export.process.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="كيف نعمل"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.process?.title || 'غير محدد'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">وصف القسم</label>
                        {isEditing ? (
                          <Textarea
                            rows={2}
                            value={content[editingLang]?.export?.process?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.process) newContent[editingLang].export.process = {}
                              newContent[editingLang].export.process.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="خطوات منظمة وواضحة"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.process?.subtitle || 'غير محدد'}</div>
                        )}
                      </div>

                      {/* 6 Steps */}
                      {['quote', 'selection', 'confirmation', 'production', 'packaging', 'delivery'].map((step, idx) => (
                        <div key={step} className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm">
                          <h4 className="font-semibold text-md mb-3 text-blue-600 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                            {step === 'quote' && 'طلب عرض السعر'}
                            {step === 'selection' && 'اختيار المنتجات'}
                            {step === 'confirmation' && 'التأكيد والدفع'}
                            {step === 'production' && 'الإنتاج والتجهيز'}
                            {step === 'packaging' && 'التغليف والشحن'}
                            {step === 'delivery' && 'التسليم'}
                          </h4>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">رقم الخطوة</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.export?.process?.[`${step}_number`] || `${idx + 1}`}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.process) newContent[editingLang].export.process = {}
                                    newContent[editingLang].export.process[`${step}_number`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder={`${idx + 1}`}
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.process?.[`${step}_number`] || `${idx + 1}`}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">عنوان الخطوة</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.export?.process?.[`${step}_title`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.process) newContent[editingLang].export.process = {}
                                    newContent[editingLang].export.process[`${step}_title`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder={`عنوان ${step}`}
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.process?.[`${step}_title`] || 'غير محدد'}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">وصف الخطوة</label>
                              {isEditing ? (
                                <Textarea
                                  rows={2}
                                  value={content[editingLang]?.export?.process?.[`${step}_description`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.process) newContent[editingLang].export.process = {}
                                    newContent[editingLang].export.process[`${step}_description`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder={`وصف ${step}`}
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.process?.[`${step}_description`] || 'غير محدد'}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">صورة الخطوة</label>
                              {isEditing ? (
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-xs text-gray-500">رفع صورة:</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, 'export', 'process', `${step}_image`)}
                                      className="w-full px-2 py-1 border rounded text-xs"
                                    />
                                  </div>
                                  <div className="text-center text-xs text-gray-400">أو</div>
                                  <div>
                                    <label className="text-xs text-gray-500">رابط مباشر:</label>
                                    <Input
                                      value={content[editingLang]?.export?.process?.[`${step}_image`] || ''}
                                      onChange={(e) => {
                                        const newContent = JSON.parse(JSON.stringify(content))
                                        if (!newContent[editingLang]) newContent[editingLang] = {}
                                        if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                        if (!newContent[editingLang].export.process) newContent[editingLang].export.process = {}
                                        newContent[editingLang].export.process[`${step}_image`] = e.target.value
                                        setContent(newContent)
                                      }}
                                      placeholder="https://example.com/image.jpg"
                                      className="text-xs"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-xs break-all">{content[editingLang]?.export?.process?.[`${step}_image`] || 'غير محدد'}</div>
                              )}
                              {content[editingLang]?.export?.process?.[`${step}_image`] && (
                                <img 
                                  src={content[editingLang].export.process[`${step}_image`]} 
                                  alt={step}
                                  className="w-32 h-20 object-cover rounded-lg border-2 mt-2"
                                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Countries Section */}
                  <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border-2 border-green-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-green-700 border-b-2 border-green-200 pb-2 flex items-center gap-2">
                      <Ship className="w-5 h-5" />
                      الدول المستوردة
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">عنوان القسم</label>
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
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.countries?.title || 'غير محدد'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">وصف القسم</label>
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
                            placeholder="نصل إلى أكثر من 50 دولة"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.countries?.subtitle || 'غير محدد'}</div>
                        )}
                      </div>

                      {/* 6 Regions */}
                      {['europe', 'asia', 'americas', 'southamerica', 'africa', 'oceania'].map((region, idx) => (
                        <div key={region} className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm">
                          <h4 className="font-semibold text-md mb-3 text-green-600 flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                            {region === 'europe' && 'أوروبا'}
                            {region === 'asia' && 'آسيا'}
                            {region === 'americas' && 'أمريكا الشمالية'}
                            {region === 'southamerica' && 'أمريكا الجنوبية'}
                            {region === 'africa' && 'أفريقيا'}
                            {region === 'oceania' && 'أوقيانوسيا'}
                          </h4>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">اسم المنطقة</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.export?.countries?.[`${region}_name`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.countries) newContent[editingLang].export.countries = {}
                                    newContent[editingLang].export.countries[`${region}_name`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder={`اسم ${region}`}
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.countries?.[`${region}_name`] || 'غير محدد'}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">عدد الدول</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.export?.countries?.[`${region}_count`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.countries) newContent[editingLang].export.countries = {}
                                    newContent[editingLang].export.countries[`${region}_count`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="15+ دولة"
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.countries?.[`${region}_count`] || 'غير محدد'}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">علم المنطقة (Emoji)</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.export?.countries?.[`${region}_flag`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.countries) newContent[editingLang].export.countries = {}
                                    newContent[editingLang].export.countries[`${region}_flag`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="🇪🇺"
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm text-3xl">{content[editingLang]?.export?.countries?.[`${region}_flag`] || '🌍'}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">صورة المنطقة</label>
                              {isEditing ? (
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-xs text-gray-500">رفع صورة:</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, 'export', 'countries', `${region}_image`)}
                                      className="w-full px-2 py-1 border rounded text-xs"
                                    />
                                  </div>
                                  <div className="text-center text-xs text-gray-400">أو</div>
                                  <div>
                                    <label className="text-xs text-gray-500">رابط مباشر:</label>
                                    <Input
                                      value={content[editingLang]?.export?.countries?.[`${region}_image`] || ''}
                                      onChange={(e) => {
                                        const newContent = JSON.parse(JSON.stringify(content))
                                        if (!newContent[editingLang]) newContent[editingLang] = {}
                                        if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                        if (!newContent[editingLang].export.countries) newContent[editingLang].export.countries = {}
                                        newContent[editingLang].export.countries[`${region}_image`] = e.target.value
                                        setContent(newContent)
                                      }}
                                      placeholder="https://example.com/image.jpg"
                                      className="text-xs"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-xs break-all">{content[editingLang]?.export?.countries?.[`${region}_image`] || 'غير محدد'}</div>
                              )}
                              {content[editingLang]?.export?.countries?.[`${region}_image`] && (
                                <img 
                                  src={content[editingLang].export.countries[`${region}_image`]} 
                                  alt={region}
                                  className="w-32 h-20 object-cover rounded-lg border-2 mt-2"
                                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border-2 border-purple-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-purple-700 border-b-2 border-purple-200 pb-2 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      مميزاتنا
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">عنوان القسم</label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.export?.features?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.features) newContent[editingLang].export.features = {}
                              newContent[editingLang].export.features.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="لماذا نحن الأفضل"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.features?.title || 'غير محدد'}</div>
                        )}
                      </div>

                      {/* 6 Features */}
                      {['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'feature6'].map((feature, idx) => (
                        <div key={feature} className="bg-white p-5 rounded-lg border-2 border-gray-200 shadow-sm">
                          <h4 className="font-semibold text-md mb-3 text-purple-600 flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                            ميزة {idx + 1}
                          </h4>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">نص الميزة</label>
                              {isEditing ? (
                                <Textarea
                                  rows={2}
                                  value={content[editingLang]?.export?.features?.[`${feature}_text`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.features) newContent[editingLang].export.features = {}
                                    newContent[editingLang].export.features[`${feature}_text`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder={`نص الميزة ${idx + 1}`}
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.features?.[`${feature}_text`] || 'غير محدد'}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">صورة الميزة</label>
                              {isEditing ? (
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-xs text-gray-500">رفع صورة:</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, 'export', 'features', `${feature}_image`)}
                                      className="w-full px-2 py-1 border rounded text-xs"
                                    />
                                  </div>
                                  <div className="text-center text-xs text-gray-400">أو</div>
                                  <div>
                                    <label className="text-xs text-gray-500">رابط مباشر:</label>
                                    <Input
                                      value={content[editingLang]?.export?.features?.[`${feature}_image`] || ''}
                                      onChange={(e) => {
                                        const newContent = JSON.parse(JSON.stringify(content))
                                        if (!newContent[editingLang]) newContent[editingLang] = {}
                                        if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                        if (!newContent[editingLang].export.features) newContent[editingLang].export.features = {}
                                        newContent[editingLang].export.features[`${feature}_image`] = e.target.value
                                        setContent(newContent)
                                      }}
                                      placeholder="https://example.com/image.jpg"
                                      className="text-xs"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-xs break-all">{content[editingLang]?.export?.features?.[`${feature}_image`] || 'غير محدد'}</div>
                              )}
                              {content[editingLang]?.export?.features?.[`${feature}_image`] && (
                                <img 
                                  src={content[editingLang].export.features[`${feature}_image`]} 
                                  alt={feature}
                                  className="w-32 h-20 object-cover rounded-lg border-2 mt-2"
                                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border-2 border-orange-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-orange-700 border-b-2 border-orange-200 pb-2 flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      الإحصائيات
                    </h3>
                    <div className="space-y-4">
                      {['countries', 'shipments', 'experience', 'satisfaction'].map((stat, idx) => (
                        <div key={stat} className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                          <h4 className="font-semibold text-sm mb-3 text-orange-600 flex items-center gap-2">
                            <span className="bg-orange-100 text-orange-700 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                            {stat === 'countries' && 'عدد الدول'}
                            {stat === 'shipments' && 'عدد الشحنات'}
                            {stat === 'experience' && 'سنوات الخبرة'}
                            {stat === 'satisfaction' && 'رضا العملاء'}
                          </h4>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">الرقم</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.export?.stats?.[`${stat}_number`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.stats) newContent[editingLang].export.stats = {}
                                    newContent[editingLang].export.stats[`${stat}_number`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="50+"
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.stats?.[`${stat}_number`] || 'غير محدد'}</div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1 text-gray-600">النص</label>
                              {isEditing ? (
                                <Input
                                  value={content[editingLang]?.export?.stats?.[`${stat}_text`] || ''}
                                  onChange={(e) => {
                                    const newContent = JSON.parse(JSON.stringify(content))
                                    if (!newContent[editingLang]) newContent[editingLang] = {}
                                    if (!newContent[editingLang].export) newContent[editingLang].export = {}
                                    if (!newContent[editingLang].export.stats) newContent[editingLang].export.stats = {}
                                    newContent[editingLang].export.stats[`${stat}_text`] = e.target.value
                                    setContent(newContent)
                                  }}
                                  placeholder="دولة نصدر إليها"
                                  className="text-sm"
                                />
                              ) : (
                                <div className="p-2 bg-gray-50 rounded text-sm">{content[editingLang]?.export?.stats?.[`${stat}_text`] || 'غير محدد'}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-lg border-2 border-red-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-red-700 border-b-2 border-red-200 pb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      دعوة للعمل
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">العنوان</label>
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
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.cta?.title || 'غير محدد'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">النص التوضيحي</label>
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
                            placeholder="احصل على عرض سعر مخصص"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.cta?.subtitle || 'غير محدد'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">نص الزر</label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.export?.cta?.buttonText || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].export) newContent[editingLang].export = {}
                              if (!newContent[editingLang].export.cta) newContent[editingLang].export.cta = {}
                              newContent[editingLang].export.cta.buttonText = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="طلب عرض سعر الآن"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.export?.cta?.buttonText || 'غير محدد'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'blog' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">صفحة المدونة</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'إلغاء التعديل' : 'تعديل'}
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/admin/blog'}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      إدارة المقالات
                    </Button>
                  </div>
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
                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border-2 border-blue-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-blue-700 border-b-2 border-blue-200 pb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      القسم الرئيسي
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">العنوان الرئيسي</label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.blog?.hero?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].blog) newContent[editingLang].blog = {}
                              if (!newContent[editingLang].blog.hero) newContent[editingLang].blog.hero = {}
                              newContent[editingLang].blog.hero.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="المدونة"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.blog?.hero?.title || 'غير محدد'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">النص التوضيحي</label>
                        {isEditing ? (
                          <Textarea
                            rows={3}
                            value={content[editingLang]?.blog?.hero?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].blog) newContent[editingLang].blog = {}
                              if (!newContent[editingLang].blog.hero) newContent[editingLang].blog.hero = {}
                              newContent[editingLang].blog.hero.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="آخر الأخبار والمقالات..."
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.blog?.hero?.subtitle || 'غير محدد'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">صورة الخلفية (اختياري)</label>
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <label className="text-xs text-gray-600 font-medium">رفع صورة:</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'blog', 'hero', 'backgroundImage')}
                                className="w-full px-3 py-2 border rounded text-sm"
                              />
                            </div>
                            <div className="relative flex items-center">
                              <div className="flex-grow border-t border-gray-300"></div>
                              <span className="flex-shrink mx-4 text-gray-500 text-xs">أو</span>
                              <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs text-gray-600 font-medium">رابط مباشر:</label>
                              <Input
                                value={content[editingLang]?.blog?.hero?.backgroundImage || ''}
                                onChange={(e) => {
                                  const newContent = JSON.parse(JSON.stringify(content))
                                  if (!newContent[editingLang]) newContent[editingLang] = {}
                                  if (!newContent[editingLang].blog) newContent[editingLang].blog = {}
                                  if (!newContent[editingLang].blog.hero) newContent[editingLang].blog.hero = {}
                                  newContent[editingLang].blog.hero.backgroundImage = e.target.value
                                  setContent(newContent)
                                }}
                                placeholder="https://example.com/image.jpg"
                                className="text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm text-sm">{content[editingLang]?.blog?.hero?.backgroundImage || 'غير محدد'}</div>
                        )}
                        {content[editingLang]?.blog?.hero?.backgroundImage && (
                          <img 
                            src={content[editingLang].blog.hero.backgroundImage} 
                            alt="Background"
                            className="w-40 h-24 object-cover rounded-lg border-2 mt-3"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Featured Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border-2 border-purple-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">
                      قسم المقال المميز
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">عنوان القسم</label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.blog?.featured?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].blog) newContent[editingLang].blog = {}
                              if (!newContent[editingLang].blog.featured) newContent[editingLang].blog.featured = {}
                              newContent[editingLang].blog.featured.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="مقال مميز"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.blog?.featured?.title || 'غير محدد'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">النص التوضيحي (اختياري)</label>
                        {isEditing ? (
                          <Textarea
                            rows={2}
                            value={content[editingLang]?.blog?.featured?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].blog) newContent[editingLang].blog = {}
                              if (!newContent[editingLang].blog.featured) newContent[editingLang].blog.featured = {}
                              newContent[editingLang].blog.featured.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="أهم مقال في المدونة"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.blog?.featured?.subtitle || 'غير محدد'}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Section */}
                  <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border-2 border-green-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-green-700 border-b-2 border-green-200 pb-2">
                      قسم المقالات الحديثة
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">عنوان القسم</label>
                        {isEditing ? (
                          <Input
                            value={content[editingLang]?.blog?.recent?.title || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].blog) newContent[editingLang].blog = {}
                              if (!newContent[editingLang].blog.recent) newContent[editingLang].blog.recent = {}
                              newContent[editingLang].blog.recent.title = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="المقالات الحديثة"
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.blog?.recent?.title || 'غير محدد'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">النص التوضيحي</label>
                        {isEditing ? (
                          <Textarea
                            rows={2}
                            value={content[editingLang]?.blog?.recent?.subtitle || ''}
                            onChange={(e) => {
                              const newContent = JSON.parse(JSON.stringify(content))
                              if (!newContent[editingLang]) newContent[editingLang] = {}
                              if (!newContent[editingLang].blog) newContent[editingLang].blog = {}
                              if (!newContent[editingLang].blog.recent) newContent[editingLang].blog.recent = {}
                              newContent[editingLang].blog.recent.subtitle = e.target.value
                              setContent(newContent)
                            }}
                            placeholder="آخر المقالات والأخبار..."
                          />
                        ) : (
                          <div className="p-3 bg-white rounded-md shadow-sm">{content[editingLang]?.blog?.recent?.subtitle || 'غير محدد'}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* UI Text */}
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border-2 border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
                      نصوص واجهة المستخدم
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['readMore', 'author', 'date', 'loading', 'noPosts', 'loadMore', 'minutesRead'].map((key) => (
                        <div key={key}>
                          <label className="block text-sm font-medium mb-2">
                            {key === 'readMore' && 'اقرأ المزيد'}
                            {key === 'author' && 'كتب بواسطة'}
                            {key === 'date' && 'التاريخ'}
                            {key === 'loading' && 'جاري التحميل'}
                            {key === 'noPosts' && 'لا توجد مقالات'}
                            {key === 'loadMore' && 'تحميل المزيد'}
                            {key === 'minutesRead' && 'دقائق القراءة'}
                          </label>
                          {isEditing ? (
                            <Input
                              value={content[editingLang]?.blog?.ui?.[key] || ''}
                              onChange={(e) => {
                                const newContent = JSON.parse(JSON.stringify(content))
                                if (!newContent[editingLang]) newContent[editingLang] = {}
                                if (!newContent[editingLang].blog) newContent[editingLang].blog = {}
                                if (!newContent[editingLang].blog.ui) newContent[editingLang].blog.ui = {}
                                newContent[editingLang].blog.ui[key] = e.target.value
                                setContent(newContent)
                              }}
                              className="text-sm"
                            />
                          ) : (
                            <div className="p-2 bg-white rounded-md shadow-sm text-sm">{content[editingLang]?.blog?.ui?.[key] || 'غير محدد'}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
