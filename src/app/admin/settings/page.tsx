'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Settings, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Palette,
  Type,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card } from '../../../components/ui/card'

export default function SiteSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const [settings, setSettings] = useState({
    // Company Information
    companyName: 'Lumerra Marble',
    companyNameAr: 'شركة لوميرا للرخام',
    description: 'Leading marble and granite export company from Egypt',
    descriptionAr: 'شركة رائدة في تصدير الرخام والجرانيت من مصر',
    
    // Contact Information
    phone: '+20 111 312 1444',
    email: 'info@alhotmarble.com',
    whatsapp: '+20 111 312 1444',
    address: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
    addressAr: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
    
    // Social Media
    facebook: 'https://facebook.com/alhotmarble',
    instagram: 'https://instagram.com/alhotmarble',
    linkedin: 'https://linkedin.com/company/alhotmarble',
    youtube: 'https://youtube.com/@alhotmarble',
    
    // SEO Settings
    metaTitle: 'Lumerra Marble - Premium Egyptian Marble & Granite Export',
    metaTitleAr: 'لوميرا للرخام - تصدير الرخام والجرانيت المصري الفاخر',
    metaDescription: 'Leading Egyptian company exporting premium marble, granite and quartz worldwide. High quality natural stones for construction and decoration.',
    metaDescriptionAr: 'شركة مصرية رائدة في تصدير الرخام والجرانيت والكوارتز الفاخر عالمياً. أحجار طبيعية عالية الجودة للبناء والديكور.',
    keywords: 'marble, granite, quartz, export, Egypt, natural stone',
    keywordsAr: 'رخام, جرانيت, كوارتز, تصدير, مصر, أحجار طبيعية',
    
    // Theme Settings (5-color system)
    primaryColor: '#f59000',      // Header/Footer/Main sections
    secondaryColor: '#2c3e50',    // Buttons and interactive elements
    tertiaryColor: '#34495e',     // Important text (headings, company info)
    quaternaryColor: '#2c3e50',   // General text
    quinaryColor: '#ffffff',      // Opposite of quaternary (background text)
    
    // Business Hours
    businessHours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
    businessHoursAr: 'الأحد - الخميس: 9:00 ص - 6:00 م'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.settings) {
          setSettings({ ...settings, ...data.settings })
        }
      } else if (response.status === 401) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('تم حفظ الإعدادات بنجاح!')
      } else {
        alert('حدث خطأ في حفظ الإعدادات')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('حدث خطأ في حفظ الإعدادات')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-quinary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="text-quaternary">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إعدادات الموقع</h1>
            <p className="text-gray-600">إدارة إعدادات الموقع العامة</p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Company Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              معلومات الشركة
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الشركة بالإنجليزية
                </label>
                <Input
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleInputChange}
                  placeholder="Lumerra Marble"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الشركة بالعربية
                </label>
                <Input
                  name="companyNameAr"
                  value={settings.companyNameAr}
                  onChange={handleInputChange}
                  placeholder="شركة لوميرا للرخام"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف بالإنجليزية
                </label>
                <textarea
                  name="description"
                  value={settings.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder="Company description in English"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف بالعربية
                </label>
                <textarea
                  name="descriptionAr"
                  value={settings.descriptionAr}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder="وصف الشركة بالعربية"
                />
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              معلومات التواصل
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <Input
                  name="phone"
                  value={settings.phone}
                  onChange={handleInputChange}
                  placeholder="+20 111 312 1444"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <Input
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  placeholder="info@alhotmarble.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الواتساب
                </label>
                <Input
                  name="whatsapp"
                  value={settings.whatsapp}
                  onChange={handleInputChange}
                  placeholder="+20 111 312 1444"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ساعات العمل بالإنجليزية
                </label>
                <Input
                  name="businessHours"
                  value={settings.businessHours}
                  onChange={handleInputChange}
                  placeholder="Sunday - Thursday: 9:00 AM - 6:00 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان بالإنجليزية
                </label>
                <Input
                  name="address"
                  value={settings.address}
                  onChange={handleInputChange}
                  placeholder="Egypt - Cairo - Industrial Zone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان بالعربية
                </label>
                <Input
                  name="addressAr"
                  value={settings.addressAr}
                  onChange={handleInputChange}
                  placeholder="مصر - القاهرة - المنطقة الصناعية"
                />
              </div>
            </div>
          </Card>

          {/* Social Media */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              وسائل التواصل الاجتماعي
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فيسبوك
                </label>
                <Input
                  name="facebook"
                  value={settings.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/alhotmarble"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إنستغرام
                </label>
                <Input
                  name="instagram"
                  value={settings.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/alhotmarble"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  لينكد إن
                </label>
                <Input
                  name="linkedin"
                  value={settings.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/company/alhotmarble"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  يوتيوب
                </label>
                <Input
                  name="youtube"
                  value={settings.youtube}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/@alhotmarble"
                />
              </div>
            </div>
          </Card>

          {/* SEO Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              إعدادات SEO
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان الموقع بالإنجليزية
                  </label>
                  <Input
                    name="metaTitle"
                    value={settings.metaTitle}
                    onChange={handleInputChange}
                    placeholder="Site title in English"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان الموقع بالعربية
                  </label>
                  <Input
                    name="metaTitleAr"
                    value={settings.metaTitleAr}
                    onChange={handleInputChange}
                    placeholder="عنوان الموقع بالعربية"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الموقع بالإنجليزية
                  </label>
                  <textarea
                    name="metaDescription"
                    value={settings.metaDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    placeholder="Site description in English"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الموقع بالعربية
                  </label>
                  <textarea
                    name="metaDescriptionAr"
                    value={settings.metaDescriptionAr}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    placeholder="وصف الموقع بالعربية"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكلمات المفتاحية بالإنجليزية
                  </label>
                  <Input
                    name="keywords"
                    value={settings.keywords}
                    onChange={handleInputChange}
                    placeholder="marble, granite, export, Egypt"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكلمات المفتاحية بالعربية
                  </label>
                  <Input
                    name="keywordsAr"
                    value={settings.keywordsAr}
                    onChange={handleInputChange}
                    placeholder="رخام, جرانيت, تصدير, مصر"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Theme Settings - 5 Color System */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              إعدادات الألوان (نظام الخمس ألوان)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون الأساسي
                  <span className="text-xs text-gray-500 block">للهيدر والفوتر والأقسام الرئيسية</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <Input
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleInputChange}
                    placeholder="#f59000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون الثانوي
                  <span className="text-xs text-gray-500 block">للأزرار والعناصر التفاعلية</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <Input
                    name="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={handleInputChange}
                    placeholder="#2c3e50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون الثالث
                  <span className="text-xs text-gray-500 block">للعناوين والنصوص المهمة</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="tertiaryColor"
                    value={settings.tertiaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <Input
                    name="tertiaryColor"
                    value={settings.tertiaryColor}
                    onChange={handleInputChange}
                    placeholder="#34495e"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون الرابع
                  <span className="text-xs text-gray-500 block">للنصوص العادية</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="quaternaryColor"
                    value={settings.quaternaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <Input
                    name="quaternaryColor"
                    value={settings.quaternaryColor}
                    onChange={handleInputChange}
                    placeholder="#2c3e50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون الخامس
                  <span className="text-xs text-gray-500 block">لخلفيات النصوص (عكس الرابع)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="quinaryColor"
                    value={settings.quinaryColor}
                    onChange={handleInputChange}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <Input
                    name="quinaryColor"
                    value={settings.quinaryColor}
                    onChange={handleInputChange}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
            
            {/* Fixed Alert Colors Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">ألوان التنبيهات (ثابتة في الكود)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>نجاح (#10b981)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>تحذير (#f59e0b)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>خطأ (#ef4444)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>معلومات (#3b82f6)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
