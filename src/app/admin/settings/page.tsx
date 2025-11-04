'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Settings, 
  Globe, 
  Mail, 
  Phone, 
  Palette,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
  Server,
  Lock,
  Eye,
  EyeOff,
  Image,
  FileImage,
  Maximize2,
  BarChart,
  Search,
  Code,
  TrendingUp,
  Scale,
  FileText,
  Wand2,
  Shield,
  MessageCircle
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card } from '../../../components/ui/card'
import { ImageUpload } from '../../../components/ui/image-upload'
import { toast, ToastProvider } from '../../../components/ui/toast'

export default function SiteSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [originalSettings, setOriginalSettings] = useState<typeof settings | null>(null)
  const [activeLanguage, setActiveLanguage] = useState<'ar' | 'en' | 'es' | 'fr'>('ar')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const [settings, setSettings] = useState({
    // Company Information (4 languages)
    companyName: 'Lumerra Marble',
    companyNameAr: 'شركة لوميرا للرخام',
    companyNameEs: 'Lumerra Marble',
    companyNameFr: 'Lumerra Marble',
    
    // Logo & Branding
    logoUrl: '',
    logoAlt: 'Company Logo',
    logoAltAr: 'شعار الشركة',
    logoAltEs: 'Logo de la Empresa',
    logoAltFr: 'Logo de l\'Entreprise',
    darkModeLogoUrl: '',
    faviconUrl: '',
    
    description: 'Leading marble and granite export company from Egypt',
    descriptionAr: 'شركة رائدة في تصدير الرخام والجرانيت من مصر',
    descriptionEs: 'Empresa líder en exportación de mármol y granito desde Egipto',
    descriptionFr: 'Entreprise leader dans l\'exportation de marbre et granit depuis l\'Égypte',
    
    // Contact Information
    phone: '+20 111 312 1444',
    email: 'info@lumerramarble.com',
    whatsapp: '+20 111 312 1444',
    address: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
    addressAr: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
    addressEs: 'Egipto - El Cairo - Zona Industrial Shaq Al-Thuban',
    addressFr: 'Égypte - Le Caire - Zone Industrielle Shaq Al-Thuban',
    
    // Social Media
    facebook: 'https://facebook.com/lumerramarble',
    instagram: 'https://instagram.com/lumerramarble',
    linkedin: 'https://linkedin.com/company/lumerramarble',
    youtube: 'https://youtube.com/@lumerramarble',
    
    // SEO Settings (4 languages)
    metaTitle: 'Lumerra Marble - Premium Egyptian Marble & Granite Export',
    metaTitleAr: 'لوميرا للرخام - تصدير الرخام والجرانيت المصري الفاخر',
    metaTitleEs: 'Lumerra Marble - Exportación de Mármol y Granito Egipcio Premium',
    metaTitleFr: 'Lumerra Marble - Export de Marbre et Granit Égyptien Premium',
    metaDescription: 'Leading Egyptian company exporting premium marble, granite and quartz worldwide.',
    metaDescriptionAr: 'شركة مصرية رائدة في تصدير الرخام والجرانيت والكوارتز الفاخر عالمياً.',
    metaDescriptionEs: 'Empresa egipcia líder en la exportación de mármol, granito y cuarzo premium en todo el mundo.',
    metaDescriptionFr: 'Entreprise égyptienne leader exportant marbre, granit et quartz premium dans le monde entier.',
    keywords: 'marble, granite, quartz, export, Egypt, natural stone',
    keywordsAr: 'رخام, جرانيت, كوارتز, تصدير, مصر, أحجار طبيعية',
    keywordsEs: 'mármol, granito, cuarzo, exportación, Egipto, piedra natural',
    keywordsFr: 'marbre, granit, quartz, export, Égypte, pierre naturelle',
    
    // Theme Settings (5-color system)
    primaryColor: '#f59000',      // Header/Footer/Main sections
    secondaryColor: '#2c3e50',    // Buttons and interactive elements
    tertiaryColor: '#34495e',     // Important text (headings, company info)
    quaternaryColor: '#2c3e50',   // General text
    quinaryColor: '#ffffff',      // Opposite of quaternary (background text)
    
    // Business Hours (4 languages)
    businessHours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
    businessHoursAr: 'الأحد - الخميس: 9:00 ص - 6:00 م',
    businessHoursEs: 'Domingo - Jueves: 9:00 AM - 6:00 PM',
    businessHoursFr: 'Dimanche - Jeudi: 9h00 - 18h00',
    
    // Email/SMTP Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: false,
    emailFrom: 'info@lumerramarble.com',
    emailFromName: 'Lumerra Marble',
    notificationEmail: 'info@lumerramarble.com',
    
    // Image Settings
    maxImageSize: 5242880,       // 5MB in bytes
    allowedImageTypes: 'image/jpeg,image/png,image/webp,image/gif',
    imageQuality: 80,
    autoOptimize: true,
    thumbnailWidth: 300,
    thumbnailHeight: 300,
    maxWidth: 1920,
    maxHeight: 1080,
    
    // SEO & Analytics Settings
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    linkedinPartnerId: '',
    tiktokPixelId: '',
    bingAdsId: '',
    seoIndexing: true,
    seoFollowLinks: true,
    canonicalUrl: '',
    robotsTxt: '',
    
    // Legal Settings
    privacyPolicyAr: '',
    privacyPolicyEn: '',
    privacyPolicyEs: '',
    privacyPolicyFr: '',
    termsConditionsAr: '',
    termsConditionsEn: '',
    termsConditionsEs: '',
    termsConditionsFr: '',
    copyrightText: '© 2024 Lumerra Marble. All rights reserved.',
    
    // Advanced Appearance Settings
    fontFamily: 'Inter',
    fontSize: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    buttonStyle: 'rounded',
    animationsEnabled: true,
    darkModeEnabled: false,
    
    // Security Settings
    enableRecaptcha: true,
    recaptchaSiteKey: '',
    recaptchaSecretKey: '',
    maxLoginAttempts: 5,
    sessionTimeout: 480,
    enableTwoFactor: false,
    allowedIPs: '',
    blockedIPs: '',
    
    // Advanced Contact Settings (WhatsApp)
    whatsappAutoReply: '',
    whatsappGreeting: 'مرحباً! كيف يمكنني مساعدتك؟',
    whatsappButtonText: 'تواصل عبر واتساب',
    whatsappShowOnMobile: true,
    whatsappShowOnDesktop: true,
    whatsappPosition: 'bottom-right',
    
    // Footer Settings
    footerDescriptionAr: 'شركة رائدة في تصدير الرخام والجرانيت الفاخر من مصر إلى العالم',
    footerDescriptionEn: 'Leading company in exporting premium marble and granite from Egypt to the world',
    footerDescriptionEs: 'Empresa líder en exportación de mármol y granito premium desde Egipto al mundo',
    footerDescriptionFr: 'Entreprise leader dans l\'exportation de marbre et granit premium d\'Égypte vers le monde'
  })

  useEffect(() => {
    loadSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.settings) {
          // تحويل جميع القيم null إلى empty string لتجنب تحذيرات React
          const cleanedSettings = Object.entries(data.settings).reduce((acc, [key, value]) => {
            acc[key] = value === null ? '' : value
            return acc
          }, {} as any)
          
          const mergedSettings = { ...settings, ...cleanedSettings }
          setSettings(mergedSettings)
          setOriginalSettings(mergedSettings)
        }
      } else if (response.status === 401) {
        console.error('Unauthorized - Token invalid or expired')
        toast.error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى')
        // لا تعيد التوجيه تلقائياً - دع المستخدم يقرر
        return
      } else {
        console.error('Error response:', response.status)
        toast.error('حدث خطأ في تحميل الإعدادات')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('حدث خطأ في تحميل الإعدادات')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    // التحقق من البيانات قبل الحفظ
    const validationErrors = validateSettings()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('يرجى تصحيح الأخطاء قبل الحفظ')
      return
    }

    setIsSaving(true)
    console.log('🔄 Starting save...', { logoUrl: settings.logoUrl, darkModeLogoUrl: settings.darkModeLogoUrl })
    
    try {
      const token = localStorage.getItem('admin_token')
      
      console.log('📤 Sending settings:', settings)
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })

      console.log('📥 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Save successful:', data)
        setOriginalSettings(settings)
        toast.success('تم حفظ الإعدادات بنجاح!')
      } else {
        const data = await response.json()
        console.error('❌ Save failed:', data)
        toast.error(data.error || 'حدث خطأ في حفظ الإعدادات')
      }
    } catch (error) {
      console.error('💥 Error saving settings:', error)
      toast.error('حدث خطأ في حفظ الإعدادات')
    } finally {
      setIsSaving(false)
    }
  }

  const validateSettings = () => {
    const errors: Record<string, string> = {}
    
    // التحقق من الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (settings.email && !emailRegex.test(settings.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح'
    }
    
    // التحقق من أرقام الهواتف
    const phoneRegex = /^\+?[0-9\s\-()]+$/
    if (settings.phone && !phoneRegex.test(settings.phone)) {
      errors.phone = 'رقم الهاتف غير صحيح'
    }
    if (settings.whatsapp && !phoneRegex.test(settings.whatsapp)) {
      errors.whatsapp = 'رقم الواتساب غير صحيح'
    }
    
    // التحقق من الروابط
    const urlRegex = /^https?:\/\/.+/
    if (settings.facebook && !urlRegex.test(settings.facebook)) {
      errors.facebook = 'رابط فيسبوك غير صحيح'
    }
    if (settings.instagram && !urlRegex.test(settings.instagram)) {
      errors.instagram = 'رابط إنستغرام غير صحيح'
    }
    if (settings.linkedin && !urlRegex.test(settings.linkedin)) {
      errors.linkedin = 'رابط لينكد إن غير صحيح'
    }
    if (settings.youtube && !urlRegex.test(settings.youtube)) {
      errors.youtube = 'رابط يوتيوب غير صحيح'
    }
    
    // التحقق من الألوان
    const colorRegex = /^#[0-9A-Fa-f]{6}$/
    if (settings.primaryColor && !colorRegex.test(settings.primaryColor)) {
      errors.primaryColor = 'اللون الأساسي غير صحيح'
    }
    if (settings.secondaryColor && !colorRegex.test(settings.secondaryColor)) {
      errors.secondaryColor = 'اللون الثانوي غير صحيح'
    }
    
    return errors
  }

  const handleReset = () => {
    if (originalSettings && confirm('هل أنت متأكد من إلغاء جميع التغييرات؟')) {
      setSettings(originalSettings)
      setErrors({})
      toast.info('تم إلغاء التغييرات')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
    // مسح الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const updateSetting = (name: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
    // مسح الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  if (isLoading) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-quinary-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="text-quaternary">جاري تحميل الإعدادات...</p>
          </div>
        </div>
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة للوحة التحكم
                </Button>
                <div className="border-r pr-4">
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary-600" />
                    إعدادات الموقع
                  </h1>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleReset}
                  disabled={isSaving || !originalSettings}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  إلغاء التغييرات
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Language Tabs */}
          <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">اختر اللغة للتحرير</h3>
            <div className="flex gap-2">
              {[
                { code: 'ar' as const, name: 'العربية', flag: '🇪🇬' },
                { code: 'en' as const, name: 'English', flag: '🇬🇧' },
                { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
                { code: 'fr' as const, name: 'Français', flag: '🇫🇷' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLanguage(lang.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                    activeLanguage === lang.code
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

        <div className="space-y-6">
          {/* Company Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              معلومات الشركة
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الشركة ({activeLanguage === 'ar' ? 'عربي' : activeLanguage === 'en' ? 'English' : activeLanguage === 'es' ? 'Español' : 'Français'})
                </label>
                <Input
                  name={`companyName${activeLanguage === 'en' ? '' : activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'en' ? settings.companyName :
                    activeLanguage === 'ar' ? settings.companyNameAr :
                    activeLanguage === 'es' ? settings.companyNameEs :
                    settings.companyNameFr
                  }
                  onChange={handleInputChange}
                  placeholder={activeLanguage === 'ar' ? 'شركة لوميرا للرخام' : 'Lumerra Marble'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف ({activeLanguage === 'ar' ? 'عربي' : activeLanguage === 'en' ? 'English' : activeLanguage === 'es' ? 'Español' : 'Français'})
                </label>
                <textarea
                  name={`description${activeLanguage === 'en' ? '' : activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'en' ? settings.description :
                    activeLanguage === 'ar' ? settings.descriptionAr :
                    activeLanguage === 'es' ? settings.descriptionEs :
                    settings.descriptionFr
                  }
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder={activeLanguage === 'ar' ? 'وصف الشركة بالعربية' : 'Company description'}
                />
              </div>
            </div>
          </Card>

          {/* Logo & Branding */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" />
              الشعار والعلامة التجارية
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Main Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شعار الشركة (Company Logo)
                </label>
                <ImageUpload
                  currentImages={settings.logoUrl ? [settings.logoUrl] : []}
                  onUpload={(urls: string[]) => {
                    if (urls.length > 0) {
                      setSettings(prev => ({ ...prev, logoUrl: urls[0] }))
                    }
                  }}
                  onRemove={() => {
                    setSettings(prev => ({ ...prev, logoUrl: '' }))
                  }}
                  multiple={false}
                  maxFiles={1}
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 PNG شفاف مُفضّل - الحجم المثالي: 200x200 بكسل
                </p>
              </div>

              {/* Logo Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النص البديل للشعار ({activeLanguage === 'ar' ? 'عربي' : activeLanguage === 'en' ? 'English' : activeLanguage === 'es' ? 'Español' : 'Français'})
                </label>
                <Input
                  name={`logoAlt${activeLanguage === 'en' ? '' : activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'en' ? settings.logoAlt :
                    activeLanguage === 'ar' ? settings.logoAltAr :
                    activeLanguage === 'es' ? settings.logoAltEs :
                    settings.logoAltFr
                  }
                  onChange={handleInputChange}
                  placeholder={activeLanguage === 'ar' ? 'شعار شركة لوميرا للرخام' : 'Lumerra Marble Logo'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  مهم لمحركات البحث وإمكانية الوصول (SEO & Accessibility)
                </p>
              </div>

              {/* Dark Mode Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شعار الوضع الليلي (اختياري)
                </label>
                <ImageUpload
                  currentImages={settings.darkModeLogoUrl ? [settings.darkModeLogoUrl] : []}
                  onUpload={(urls: string[]) => {
                    if (urls.length > 0) {
                      setSettings(prev => ({ ...prev, darkModeLogoUrl: urls[0] }))
                    }
                  }}
                  onRemove={() => {
                    setSettings(prev => ({ ...prev, darkModeLogoUrl: '' }))
                  }}
                  multiple={false}
                  maxFiles={1}
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 نسخة فاتحة من اللوجو إذا كان الأصلي غامق
                </p>
              </div>

              {/* Favicon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon (أيقونة المتصفح)
                </label>
                <ImageUpload
                  currentImages={settings.faviconUrl ? [settings.faviconUrl] : []}
                  onUpload={(urls: string[]) => {
                    if (urls.length > 0) {
                      setSettings(prev => ({ ...prev, faviconUrl: urls[0] }))
                    }
                  }}
                  onRemove={() => {
                    setSettings(prev => ({ ...prev, faviconUrl: '' }))
                  }}
                  multiple={false}
                  maxFiles={1}
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 أيقونة صغيرة تظهر في تبويب المتصفح - الحجم: 32x32 أو 48x48
                </p>
              </div>

              {/* Preview Section */}
              {settings.logoUrl && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    💡 معاينة الشعارات
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Light Mode Preview */}
                    <div className="border rounded-lg p-4 bg-white">
                      <p className="text-xs font-medium text-gray-600 mb-2">الوضع العادي</p>
                      <div className="flex items-center justify-center h-20 bg-gray-50 rounded">
                        <img 
                          src={settings.logoUrl} 
                          alt={settings.logoAltAr || 'شعار الشركة'}
                          className="h-12 w-auto object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Dark Mode Preview */}
                    {settings.darkModeLogoUrl && (
                      <div className="border rounded-lg p-4 bg-gray-900">
                        <p className="text-xs font-medium text-gray-300 mb-2">الوضع الليلي</p>
                        <div className="flex items-center justify-center h-20 bg-gray-800 rounded">
                          <img 
                            src={settings.darkModeLogoUrl} 
                            alt={settings.logoAltAr || 'شعار الشركة'}
                            className="h-12 w-auto object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Favicon Preview */}
                  {settings.faviconUrl && (
                    <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                      <p className="text-xs font-medium text-gray-600 mb-2">Favicon</p>
                      <div className="flex items-center gap-2">
                        <img 
                          src={settings.faviconUrl} 
                          alt="Favicon"
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <span className="text-xs text-gray-500">كما سيظهر في تبويب المتصفح</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
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
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
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
                  className={errors.whatsapp ? 'border-red-500' : ''}
                />
                {errors.whatsapp && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.whatsapp}
                  </p>
                )}
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
                  ساعات العمل ({activeLanguage === 'ar' ? 'عربي' : activeLanguage === 'en' ? 'English' : activeLanguage === 'es' ? 'Español' : 'Français'})
                </label>
                <Input
                  name={`businessHours${activeLanguage === 'en' ? '' : activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'en' ? settings.businessHours :
                    activeLanguage === 'ar' ? settings.businessHoursAr :
                    activeLanguage === 'es' ? settings.businessHoursEs :
                    settings.businessHoursFr
                  }
                  onChange={handleInputChange}
                  placeholder={activeLanguage === 'ar' ? 'الأحد - الخميس: 9:00 ص - 6:00 م' : 'Sunday - Thursday: 9:00 AM - 6:00 PM'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان ({activeLanguage === 'ar' ? 'عربي' : activeLanguage === 'en' ? 'English' : activeLanguage === 'es' ? 'Español' : 'Français'})
                </label>
                <Input
                  name={`address${activeLanguage === 'en' ? '' : activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'en' ? settings.address :
                    activeLanguage === 'ar' ? settings.addressAr :
                    activeLanguage === 'es' ? settings.addressEs :
                    settings.addressFr
                  }
                  onChange={handleInputChange}
                  placeholder={activeLanguage === 'ar' ? 'مصر - القاهرة - المنطقة الصناعية' : 'Egypt - Cairo - Industrial Zone'}
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
                  className={errors.facebook ? 'border-red-500' : ''}
                />
                {errors.facebook && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.facebook}
                  </p>
                )}
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
                  className={errors.instagram ? 'border-red-500' : ''}
                />
                {errors.instagram && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.instagram}
                  </p>
                )}
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
                  className={errors.linkedin ? 'border-red-500' : ''}
                />
                {errors.linkedin && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.linkedin}
                  </p>
                )}
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
                  className={errors.youtube ? 'border-red-500' : ''}
                />
                {errors.youtube && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.youtube}
                  </p>
                )}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الموقع ({activeLanguage === 'ar' ? 'عربي' : activeLanguage === 'en' ? 'English' : activeLanguage === 'es' ? 'Español' : 'Français'})
                </label>
                <Input
                  name={`metaTitle${activeLanguage === 'en' ? '' : activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'en' ? settings.metaTitle :
                    activeLanguage === 'ar' ? settings.metaTitleAr :
                    activeLanguage === 'es' ? settings.metaTitleEs :
                    settings.metaTitleFr
                  }
                  onChange={handleInputChange}
                  placeholder={activeLanguage === 'ar' ? 'عنوان الموقع بالعربية' : 'Site title'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الموقع ({activeLanguage === 'ar' ? 'عربي' : activeLanguage === 'en' ? 'English' : activeLanguage === 'es' ? 'Español' : 'Français'})
                </label>
                <textarea
                  name={`metaDescription${activeLanguage === 'en' ? '' : activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'en' ? settings.metaDescription :
                    activeLanguage === 'ar' ? settings.metaDescriptionAr :
                    activeLanguage === 'es' ? settings.metaDescriptionEs :
                    settings.metaDescriptionFr
                  }
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  placeholder={activeLanguage === 'ar' ? 'وصف الموقع بالعربية' : 'Site description'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكلمات المفتاحية ({activeLanguage === 'ar' ? 'عربي' : activeLanguage === 'en' ? 'English' : activeLanguage === 'es' ? 'Español' : 'Français'})
                </label>
                <Input
                  name={`keywords${activeLanguage === 'en' ? '' : activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'en' ? settings.keywords :
                    activeLanguage === 'ar' ? settings.keywordsAr :
                    activeLanguage === 'es' ? settings.keywordsEs :
                    settings.keywordsFr
                  }
                  onChange={handleInputChange}
                  placeholder={activeLanguage === 'ar' ? 'رخام, جرانيت, تصدير, مصر' : 'marble, granite, export, Egypt'}
                />
              </div>
            </div>
          </Card>

          {/* Email/SMTP Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              إعدادات البريد الإلكتروني (SMTP)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>ملاحظة:</strong> هذه الإعدادات تُستخدم لإرسال رسائل البريد الإلكتروني من الموقع (طلبات الأسعار، إشعارات الاتصال، إلخ).
                  للحصول على بيانات SMTP من Gmail، قم بتفعيل &quot;تطبيقات أقل أماناً&quot; أو استخدم &quot;كلمة مرور التطبيق&quot;.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Server className="w-4 h-4 inline mr-1" />
                    خادم SMTP
                  </label>
                  <Input
                    name="smtpHost"
                    value={settings.smtpHost}
                    onChange={handleInputChange}
                    placeholder="smtp.gmail.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">مثال: smtp.gmail.com, smtp.office365.com</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    منفذ SMTP
                  </label>
                  <Input
                    name="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={handleInputChange}
                    placeholder="587"
                  />
                  <p className="text-xs text-gray-500 mt-1">587 (TLS) أو 465 (SSL) أو 25</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المستخدم (البريد الإلكتروني)
                  </label>
                  <Input
                    name="smtpUser"
                    type="email"
                    value={settings.smtpUser}
                    onChange={handleInputChange}
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Input
                      name="smtpPassword"
                      type={showPassword ? "text" : "password"}
                      value={settings.smtpPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">استخدم &quot;كلمة مرور التطبيق&quot; لـ Gmail</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="smtpSecure"
                  name="smtpSecure"
                  checked={settings.smtpSecure}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpSecure: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="smtpSecure" className="text-sm font-medium text-gray-700">
                  <Lock className="w-4 h-4 inline mr-1" />
                  استخدام SSL/TLS (للمنفذ 465)
                </label>
              </div>

              <hr className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني المُرسل (From)
                  </label>
                  <Input
                    name="emailFrom"
                    type="email"
                    value={settings.emailFrom}
                    onChange={handleInputChange}
                    placeholder="info@lumerramarble.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">البريد الذي يظهر كمرسل للرسائل</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المُرسل
                  </label>
                  <Input
                    name="emailFromName"
                    value={settings.emailFromName}
                    onChange={handleInputChange}
                    placeholder="Lumerra Marble"
                  />
                  <p className="text-xs text-gray-500 mt-1">الاسم الذي يظهر مع البريد المُرسل</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بريد استلام الإشعارات
                </label>
                <Input
                  name="notificationEmail"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={handleInputChange}
                  placeholder="notifications@lumerramarble.com"
                />
                <p className="text-xs text-gray-500 mt-1">البريد الذي يستلم إشعارات طلبات الأسعار والرسائل</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>تنبيه أمني:</strong> لا تشارك بيانات SMTP مع أي شخص. يُنصح باستخدام &quot;كلمة مرور التطبيق&quot; بدلاً من كلمة المرور الأساسية.
                </p>
              </div>
            </div>
          </Card>

          {/* Image Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" />
              {activeLanguage === 'ar' && 'إعدادات الصور'}
              {activeLanguage === 'en' && 'Image Settings'}
              {activeLanguage === 'es' && 'Configuración de Imágenes'}
              {activeLanguage === 'fr' && 'Paramètres des Images'}
            </h2>
            
            <div className="space-y-6">
              {/* File Size & Type Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'الحد الأقصى لحجم الصورة (بالميجابايت)'}
                    {activeLanguage === 'en' && 'Maximum Image Size (MB)'}
                    {activeLanguage === 'es' && 'Tamaño Máximo de Imagen (MB)'}
                    {activeLanguage === 'fr' && 'Taille Maximale d\'Image (Mo)'}
                  </label>
                  <Input
                    type="number"
                    name="maxImageSize"
                    value={Math.round((settings.maxImageSize || 5242880) / 1048576)}
                    onChange={(e) => {
                      const mb = parseInt(e.target.value) || 5
                      updateSetting('maxImageSize', mb * 1048576)
                    }}
                    min="1"
                    max="50"
                    placeholder="5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {activeLanguage === 'ar' && 'الحد الأقصى لحجم الصورة المسموح برفعها (1-50 ميجابايت)'}
                    {activeLanguage === 'en' && 'Maximum allowed image upload size (1-50 MB)'}
                    {activeLanguage === 'es' && 'Tamaño máximo permitido para subir imágenes (1-50 MB)'}
                    {activeLanguage === 'fr' && 'Taille maximale autorisée pour le téléchargement d\'images (1-50 Mo)'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'أنواع الملفات المسموحة'}
                    {activeLanguage === 'en' && 'Allowed File Types'}
                    {activeLanguage === 'es' && 'Tipos de Archivos Permitidos'}
                    {activeLanguage === 'fr' && 'Types de Fichiers Autorisés'}
                  </label>
                  <Input
                    name="allowedImageTypes"
                    value={settings.allowedImageTypes}
                    onChange={handleInputChange}
                    placeholder="image/jpeg,image/png,image/webp,image/gif"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {activeLanguage === 'ar' && 'أنواع MIME المسموحة، افصلها بفاصلة'}
                    {activeLanguage === 'en' && 'Allowed MIME types, separated by comma'}
                    {activeLanguage === 'es' && 'Tipos MIME permitidos, separados por comas'}
                    {activeLanguage === 'fr' && 'Types MIME autorisés, séparés par des virgules'}
                  </p>
                </div>
              </div>

              {/* Image Quality & Optimization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'جودة ضغط الصور (%)'}
                    {activeLanguage === 'en' && 'Image Compression Quality (%)'}
                    {activeLanguage === 'es' && 'Calidad de Compresión (%)'}
                    {activeLanguage === 'fr' && 'Qualité de Compression (%)'}
                  </label>
                  <Input
                    type="number"
                    name="imageQuality"
                    value={settings.imageQuality}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    placeholder="80"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {activeLanguage === 'ar' && 'جودة الضغط من 1-100 (يُنصح بـ 70-85 للتوازن بين الجودة والحجم)'}
                    {activeLanguage === 'en' && 'Compression quality 1-100 (70-85 recommended for quality/size balance)'}
                    {activeLanguage === 'es' && 'Calidad de compresión 1-100 (70-85 recomendado para equilibrio)'}
                    {activeLanguage === 'fr' && 'Qualité de compression 1-100 (70-85 recommandé pour l\'équilibre)'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'تحسين تلقائي للصور'}
                    {activeLanguage === 'en' && 'Auto-Optimize Images'}
                    {activeLanguage === 'es' && 'Optimización Automática'}
                    {activeLanguage === 'fr' && 'Optimisation Automatique'}
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="checkbox"
                      name="autoOptimize"
                      checked={settings.autoOptimize}
                      onChange={(e) => {
                        updateSetting('autoOptimize', e.target.checked)
                      }}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {activeLanguage === 'ar' && 'تفعيل التحسين التلقائي عند رفع الصور'}
                      {activeLanguage === 'en' && 'Enable automatic optimization on upload'}
                      {activeLanguage === 'es' && 'Activar optimización automática al subir'}
                      {activeLanguage === 'fr' && 'Activer l\'optimisation automatique au téléchargement'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {activeLanguage === 'ar' && 'ضغط وتحسين الصور تلقائياً عند الرفع لتحسين الأداء'}
                    {activeLanguage === 'en' && 'Automatically compress and optimize images on upload for better performance'}
                    {activeLanguage === 'es' && 'Comprimir y optimizar imágenes automáticamente para mejor rendimiento'}
                    {activeLanguage === 'fr' && 'Compresser et optimiser automatiquement les images pour de meilleures performances'}
                  </p>
                </div>
              </div>

              {/* Thumbnail Settings */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <FileImage className="w-4 h-4" />
                  {activeLanguage === 'ar' && 'إعدادات الصور المصغرة'}
                  {activeLanguage === 'en' && 'Thumbnail Settings'}
                  {activeLanguage === 'es' && 'Configuración de Miniaturas'}
                  {activeLanguage === 'fr' && 'Paramètres des Vignettes'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      {activeLanguage === 'ar' && 'عرض الصورة المصغرة (بكسل)'}
                      {activeLanguage === 'en' && 'Thumbnail Width (px)'}
                      {activeLanguage === 'es' && 'Ancho de Miniatura (px)'}
                      {activeLanguage === 'fr' && 'Largeur de Vignette (px)'}
                    </label>
                    <Input
                      type="number"
                      name="thumbnailWidth"
                      value={settings.thumbnailWidth}
                      onChange={handleInputChange}
                      min="50"
                      max="1000"
                      placeholder="300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      {activeLanguage === 'ar' && 'ارتفاع الصورة المصغرة (بكسل)'}
                      {activeLanguage === 'en' && 'Thumbnail Height (px)'}
                      {activeLanguage === 'es' && 'Alto de Miniatura (px)'}
                      {activeLanguage === 'fr' && 'Hauteur de Vignette (px)'}
                    </label>
                    <Input
                      type="number"
                      name="thumbnailHeight"
                      value={settings.thumbnailHeight}
                      onChange={handleInputChange}
                      min="50"
                      max="1000"
                      placeholder="300"
                    />
                  </div>
                </div>
              </div>

              {/* Max Dimensions */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                  {activeLanguage === 'ar' && 'الأبعاد القصوى للصور'}
                  {activeLanguage === 'en' && 'Maximum Image Dimensions'}
                  {activeLanguage === 'es' && 'Dimensiones Máximas de Imagen'}
                  {activeLanguage === 'fr' && 'Dimensions Maximales d\'Image'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      {activeLanguage === 'ar' && 'العرض الأقصى (بكسل)'}
                      {activeLanguage === 'en' && 'Maximum Width (px)'}
                      {activeLanguage === 'es' && 'Ancho Máximo (px)'}
                      {activeLanguage === 'fr' && 'Largeur Maximale (px)'}
                    </label>
                    <Input
                      type="number"
                      name="maxWidth"
                      value={settings.maxWidth}
                      onChange={handleInputChange}
                      min="500"
                      max="4000"
                      placeholder="1920"
                    />
                    <p className="text-xs text-purple-700 mt-1">
                      {activeLanguage === 'ar' && 'سيتم تصغير الصور الأكبر تلقائياً'}
                      {activeLanguage === 'en' && 'Larger images will be resized automatically'}
                      {activeLanguage === 'es' && 'Las imágenes más grandes se redimensionarán automáticamente'}
                      {activeLanguage === 'fr' && 'Les images plus grandes seront redimensionnées automatiquement'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      {activeLanguage === 'ar' && 'الارتفاع الأقصى (بكسل)'}
                      {activeLanguage === 'en' && 'Maximum Height (px)'}
                      {activeLanguage === 'es' && 'Alto Máximo (px)'}
                      {activeLanguage === 'fr' && 'Hauteur Maximale (px)'}
                    </label>
                    <Input
                      type="number"
                      name="maxHeight"
                      value={settings.maxHeight}
                      onChange={handleInputChange}
                      min="500"
                      max="4000"
                      placeholder="1080"
                    />
                    <p className="text-xs text-purple-700 mt-1">
                      {activeLanguage === 'ar' && 'الحفاظ على نسبة العرض إلى الارتفاع'}
                      {activeLanguage === 'en' && 'Aspect ratio will be maintained'}
                      {activeLanguage === 'es' && 'Se mantendrá la relación de aspecto'}
                      {activeLanguage === 'fr' && 'Le ratio d\'aspect sera maintenu'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>
                    {activeLanguage === 'ar' && 'معلومة:'}
                    {activeLanguage === 'en' && 'Info:'}
                    {activeLanguage === 'es' && 'Información:'}
                    {activeLanguage === 'fr' && 'Info:'}
                  </strong>{' '}
                  {activeLanguage === 'ar' && 'يُنصح باستخدام صور بصيغة WebP لأفضل أداء. الإعدادات الحالية ستطبق على جميع الصور المرفوعة في المنتجات والمدونة.'}
                  {activeLanguage === 'en' && 'WebP format is recommended for best performance. Current settings will apply to all uploaded images in products and blog posts.'}
                  {activeLanguage === 'es' && 'Se recomienda el formato WebP para un mejor rendimiento. La configuración actual se aplicará a todas las imágenes subidas en productos y publicaciones de blog.'}
                  {activeLanguage === 'fr' && 'Le format WebP est recommandé pour de meilleures performances. Les paramètres actuels s\'appliqueront à toutes les images téléchargées dans les produits et les articles de blog.'}
                </p>
              </div>
            </div>
          </Card>

          {/* SEO & Analytics Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              {activeLanguage === 'ar' && 'إعدادات SEO والتحليلات'}
              {activeLanguage === 'en' && 'SEO & Analytics Settings'}
              {activeLanguage === 'es' && 'Configuración de SEO y Análisis'}
              {activeLanguage === 'fr' && 'Paramètres SEO et Analytiques'}
            </h2>
            
            <div className="space-y-6">
              {/* Analytics Tracking Codes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {activeLanguage === 'ar' && 'أكواد التتبع والتحليلات'}
                  {activeLanguage === 'en' && 'Tracking & Analytics Codes'}
                  {activeLanguage === 'es' && 'Códigos de Seguimiento y Análisis'}
                  {activeLanguage === 'fr' && 'Codes de Suivi et Analytiques'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Google Analytics ID
                    </label>
                    <Input
                      name="googleAnalyticsId"
                      value={settings.googleAnalyticsId}
                      onChange={handleInputChange}
                      placeholder="G-XXXXXXXXXX"
                    />
                    <p className="text-xs text-blue-700 mt-1">
                      {activeLanguage === 'ar' && 'معرّف Google Analytics GA4'}
                      {activeLanguage === 'en' && 'Google Analytics GA4 Measurement ID'}
                      {activeLanguage === 'es' && 'ID de Medición de Google Analytics GA4'}
                      {activeLanguage === 'fr' && 'ID de Mesure Google Analytics GA4'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Google Tag Manager ID
                    </label>
                    <Input
                      name="googleTagManagerId"
                      value={settings.googleTagManagerId}
                      onChange={handleInputChange}
                      placeholder="GTM-XXXXXXX"
                    />
                    <p className="text-xs text-blue-700 mt-1">
                      {activeLanguage === 'ar' && 'معرّف Google Tag Manager'}
                      {activeLanguage === 'en' && 'Google Tag Manager Container ID'}
                      {activeLanguage === 'es' && 'ID de Contenedor de Google Tag Manager'}
                      {activeLanguage === 'fr' && 'ID de Conteneur Google Tag Manager'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Facebook Pixel ID
                    </label>
                    <Input
                      name="facebookPixelId"
                      value={settings.facebookPixelId}
                      onChange={handleInputChange}
                      placeholder="123456789012345"
                    />
                    <p className="text-xs text-blue-700 mt-1">
                      {activeLanguage === 'ar' && 'معرّف Facebook Pixel للإعلانات'}
                      {activeLanguage === 'en' && 'Facebook Pixel ID for Ads'}
                      {activeLanguage === 'es' && 'ID de Pixel de Facebook para Anuncios'}
                      {activeLanguage === 'fr' && 'ID de Pixel Facebook pour les Publicités'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      LinkedIn Partner ID
                    </label>
                    <Input
                      name="linkedinPartnerId"
                      value={settings.linkedinPartnerId}
                      onChange={handleInputChange}
                      placeholder="1234567"
                    />
                    <p className="text-xs text-blue-700 mt-1">
                      {activeLanguage === 'ar' && 'معرّف LinkedIn Insight Tag'}
                      {activeLanguage === 'en' && 'LinkedIn Insight Tag Partner ID'}
                      {activeLanguage === 'es' && 'ID de Socio de LinkedIn Insight Tag'}
                      {activeLanguage === 'fr' && 'ID Partenaire LinkedIn Insight Tag'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      TikTok Pixel ID
                    </label>
                    <Input
                      name="tiktokPixelId"
                      value={settings.tiktokPixelId}
                      onChange={handleInputChange}
                      placeholder="ABCDEFGHIJKLMNOP"
                    />
                    <p className="text-xs text-blue-700 mt-1">
                      {activeLanguage === 'ar' && 'معرّف TikTok Pixel للإعلانات'}
                      {activeLanguage === 'en' && 'TikTok Pixel ID for Ads'}
                      {activeLanguage === 'es' && 'ID de Pixel de TikTok para Anuncios'}
                      {activeLanguage === 'fr' && 'ID de Pixel TikTok pour les Publicités'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Microsoft Bing UET Tag ID
                    </label>
                    <Input
                      name="bingAdsId"
                      value={settings.bingAdsId}
                      onChange={handleInputChange}
                      placeholder="12345678"
                    />
                    <p className="text-xs text-blue-700 mt-1">
                      {activeLanguage === 'ar' && 'معرّف Microsoft Bing Ads UET'}
                      {activeLanguage === 'en' && 'Microsoft Bing Ads UET Tag ID'}
                      {activeLanguage === 'es' && 'ID de Etiqueta UET de Microsoft Bing Ads'}
                      {activeLanguage === 'fr' && 'ID de Balise UET Microsoft Bing Ads'}
                    </p>
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  {activeLanguage === 'ar' && 'إعدادات محركات البحث'}
                  {activeLanguage === 'en' && 'Search Engine Settings'}
                  {activeLanguage === 'es' && 'Configuración de Motores de Búsqueda'}
                  {activeLanguage === 'fr' && 'Paramètres des Moteurs de Recherche'}
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-2">
                        {activeLanguage === 'ar' && 'السماح بالفهرسة'}
                        {activeLanguage === 'en' && 'Allow Indexing'}
                        {activeLanguage === 'es' && 'Permitir Indexación'}
                        {activeLanguage === 'fr' && 'Autoriser l\'Indexation'}
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="checkbox"
                          name="seoIndexing"
                          checked={settings.seoIndexing}
                          onChange={(e) => updateSetting('seoIndexing', e.target.checked)}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          {activeLanguage === 'ar' && 'السماح لمحركات البحث بفهرسة الموقع'}
                          {activeLanguage === 'en' && 'Allow search engines to index the site'}
                          {activeLanguage === 'es' && 'Permitir que los motores de búsqueda indexen el sitio'}
                          {activeLanguage === 'fr' && 'Autoriser les moteurs de recherche à indexer le site'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-900 mb-2">
                        {activeLanguage === 'ar' && 'متابعة الروابط'}
                        {activeLanguage === 'en' && 'Follow Links'}
                        {activeLanguage === 'es' && 'Seguir Enlaces'}
                        {activeLanguage === 'fr' && 'Suivre les Liens'}
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="checkbox"
                          name="seoFollowLinks"
                          checked={settings.seoFollowLinks}
                          onChange={(e) => updateSetting('seoFollowLinks', e.target.checked)}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          {activeLanguage === 'ar' && 'السماح لمحركات البحث بمتابعة الروابط'}
                          {activeLanguage === 'en' && 'Allow search engines to follow links'}
                          {activeLanguage === 'es' && 'Permitir que los motores de búsqueda sigan los enlaces'}
                          {activeLanguage === 'fr' && 'Autoriser les moteurs de recherche à suivre les liens'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-2">
                      {activeLanguage === 'ar' && 'رابط الموقع الأساسي (Canonical URL)'}
                      {activeLanguage === 'en' && 'Canonical URL'}
                      {activeLanguage === 'es' && 'URL Canónica'}
                      {activeLanguage === 'fr' && 'URL Canonique'}
                    </label>
                    <Input
                      name="canonicalUrl"
                      value={settings.canonicalUrl}
                      onChange={handleInputChange}
                      placeholder="https://www.lumerramarble.com"
                    />
                    <p className="text-xs text-green-700 mt-1">
                      {activeLanguage === 'ar' && 'الدومين الأساسي للموقع لتجنب المحتوى المكرر في SEO'}
                      {activeLanguage === 'en' && 'Primary domain to avoid duplicate content in SEO'}
                      {activeLanguage === 'es' && 'Dominio principal para evitar contenido duplicado en SEO'}
                      {activeLanguage === 'fr' && 'Domaine principal pour éviter le contenu en double en SEO'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      {activeLanguage === 'ar' && 'محتوى robots.txt مخصص'}
                      {activeLanguage === 'en' && 'Custom robots.txt Content'}
                      {activeLanguage === 'es' && 'Contenido Personalizado de robots.txt'}
                      {activeLanguage === 'fr' && 'Contenu Personnalisé robots.txt'}
                    </label>
                    <textarea
                      name="robotsTxt"
                      value={settings.robotsTxt}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                      placeholder="User-agent: *&#10;Allow: /&#10;Sitemap: https://www.lumerramarble.com/sitemap.xml"
                    />
                    <p className="text-xs text-green-700 mt-1">
                      {activeLanguage === 'ar' && 'محتوى مخصص لملف robots.txt (اتركه فارغاً للإعدادات الافتراضية)'}
                      {activeLanguage === 'en' && 'Custom content for robots.txt file (leave empty for defaults)'}
                      {activeLanguage === 'es' && 'Contenido personalizado para archivo robots.txt (dejar vacío para predeterminados)'}
                      {activeLanguage === 'fr' && 'Contenu personnalisé pour le fichier robots.txt (laisser vide pour les paramètres par défaut)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>
                    {activeLanguage === 'ar' && 'تنبيه:'}
                    {activeLanguage === 'en' && 'Warning:'}
                    {activeLanguage === 'es' && 'Advertencia:'}
                    {activeLanguage === 'fr' && 'Attention:'}
                  </strong>{' '}
                  {activeLanguage === 'ar' && 'تأكد من إضافة أكواد التتبع الصحيحة. الأكواد الخاطئة قد تؤثر على أداء الموقع أو تتبع البيانات بشكل غير صحيح.'}
                  {activeLanguage === 'en' && 'Make sure to add correct tracking codes. Incorrect codes may affect site performance or track data incorrectly.'}
                  {activeLanguage === 'es' && 'Asegúrese de agregar códigos de seguimiento correctos. Los códigos incorrectos pueden afectar el rendimiento del sitio o rastrear datos incorrectamente.'}
                  {activeLanguage === 'fr' && 'Assurez-vous d\'ajouter les bons codes de suivi. Les codes incorrects peuvent affecter les performances du site ou suivre les données de manière incorrecte.'}
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>
                    {activeLanguage === 'ar' && 'نصيحة:'}
                    {activeLanguage === 'en' && 'Tip:'}
                    {activeLanguage === 'es' && 'Consejo:'}
                    {activeLanguage === 'fr' && 'Astuce:'}
                  </strong>{' '}
                  {activeLanguage === 'ar' && 'استخدم Google Tag Manager لإدارة جميع أكواد التتبع من مكان واحد. يمكنك إضافة Facebook Pixel و LinkedIn Insight Tag من خلاله دون تعديل الكود.'}
                  {activeLanguage === 'en' && 'Use Google Tag Manager to manage all tracking codes from one place. You can add Facebook Pixel and LinkedIn Insight Tag through it without code modifications.'}
                  {activeLanguage === 'es' && 'Use Google Tag Manager para administrar todos los códigos de seguimiento desde un solo lugar. Puede agregar Facebook Pixel y LinkedIn Insight Tag sin modificar el código.'}
                  {activeLanguage === 'fr' && 'Utilisez Google Tag Manager pour gérer tous les codes de suivi à partir d\'un seul endroit. Vous pouvez ajouter Facebook Pixel et LinkedIn Insight Tag sans modifier le code.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Legal Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              {activeLanguage === 'ar' && 'الإعدادات القانونية'}
              {activeLanguage === 'en' && 'Legal Settings'}
              {activeLanguage === 'es' && 'Configuración Legal'}
              {activeLanguage === 'fr' && 'Paramètres Légaux'}
            </h2>
            
            <div className="space-y-6">
              {/* Privacy Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {activeLanguage === 'ar' && 'سياسة الخصوصية'}
                  {activeLanguage === 'en' && 'Privacy Policy'}
                  {activeLanguage === 'es' && 'Política de Privacidad'}
                  {activeLanguage === 'fr' && 'Politique de Confidentialité'}
                </label>
                <textarea
                  name={`privacyPolicy${activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'en' ? 'En' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'ar' ? settings.privacyPolicyAr :
                    activeLanguage === 'en' ? settings.privacyPolicyEn :
                    activeLanguage === 'es' ? settings.privacyPolicyEs :
                    settings.privacyPolicyFr
                  }
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    activeLanguage === 'ar' ? 'اكتب سياسة الخصوصية هنا...' :
                    activeLanguage === 'en' ? 'Write privacy policy here...' :
                    activeLanguage === 'es' ? 'Escriba la política de privacidad aquí...' :
                    'Écrivez la politique de confidentialité ici...'
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {activeLanguage === 'ar' && 'سياسة الخصوصية باللغة الحالية'}
                  {activeLanguage === 'en' && 'Privacy policy in current language'}
                  {activeLanguage === 'es' && 'Política de privacidad en idioma actual'}
                  {activeLanguage === 'fr' && 'Politique de confidentialité en langue actuelle'}
                </p>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {activeLanguage === 'ar' && 'الشروط والأحكام'}
                  {activeLanguage === 'en' && 'Terms & Conditions'}
                  {activeLanguage === 'es' && 'Términos y Condiciones'}
                  {activeLanguage === 'fr' && 'Conditions Générales'}
                </label>
                <textarea
                  name={`termsConditions${activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'en' ? 'En' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'ar' ? settings.termsConditionsAr :
                    activeLanguage === 'en' ? settings.termsConditionsEn :
                    activeLanguage === 'es' ? settings.termsConditionsEs :
                    settings.termsConditionsFr
                  }
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    activeLanguage === 'ar' ? 'اكتب الشروط والأحكام هنا...' :
                    activeLanguage === 'en' ? 'Write terms & conditions here...' :
                    activeLanguage === 'es' ? 'Escriba los términos y condiciones aquí...' :
                    'Écrivez les conditions générales ici...'
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {activeLanguage === 'ar' && 'الشروط والأحكام باللغة الحالية'}
                  {activeLanguage === 'en' && 'Terms & conditions in current language'}
                  {activeLanguage === 'es' && 'Términos y condiciones en idioma actual'}
                  {activeLanguage === 'fr' && 'Conditions générales en langue actuelle'}
                </p>
              </div>

              {/* Copyright Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeLanguage === 'ar' && 'نص حقوق النشر'}
                  {activeLanguage === 'en' && 'Copyright Text'}
                  {activeLanguage === 'es' && 'Texto de Derechos de Autor'}
                  {activeLanguage === 'fr' && 'Texte de Copyright'}
                </label>
                <Input
                  name="copyrightText"
                  value={settings.copyrightText}
                  onChange={handleInputChange}
                  placeholder="© 2024 Lumerra Marble. All rights reserved."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {activeLanguage === 'ar' && 'النص الذي يظهر في الفوتر'}
                  {activeLanguage === 'en' && 'Text displayed in footer'}
                  {activeLanguage === 'es' && 'Texto que aparece en el pie de página'}
                  {activeLanguage === 'fr' && 'Texte affiché dans le pied de page'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>
                    {activeLanguage === 'ar' && 'معلومة:'}
                    {activeLanguage === 'en' && 'Info:'}
                    {activeLanguage === 'es' && 'Información:'}
                    {activeLanguage === 'fr' && 'Info:'}
                  </strong>{' '}
                  {activeLanguage === 'ar' && 'تأكد من مراجعة المحتوى القانوني مع مستشار قانوني. هذه النصوص مهمة للحماية القانونية للشركة.'}
                  {activeLanguage === 'en' && 'Make sure to review legal content with a legal advisor. These texts are important for legal protection of the company.'}
                  {activeLanguage === 'es' && 'Asegúrese de revisar el contenido legal con un asesor legal. Estos textos son importantes para la protección legal de la empresa.'}
                  {activeLanguage === 'fr' && 'Assurez-vous de réviser le contenu juridique avec un conseiller juridique. Ces textes sont importants pour la protection juridique de l\'entreprise.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Advanced Appearance Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              {activeLanguage === 'ar' && 'إعدادات المظهر المتقدمة'}
              {activeLanguage === 'en' && 'Advanced Appearance Settings'}
              {activeLanguage === 'es' && 'Configuración Avanzada de Apariencia'}
              {activeLanguage === 'fr' && 'Paramètres d\'Apparence Avancés'}
            </h2>
            
            <div className="space-y-6">
              {/* Typography */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'نوع الخط'}
                    {activeLanguage === 'en' && 'Font Family'}
                    {activeLanguage === 'es' && 'Familia de Fuentes'}
                    {activeLanguage === 'fr' && 'Famille de Polices'}
                  </label>
                  <select
                    name="fontFamily"
                    value={settings.fontFamily}
                    onChange={handleInputChange as any}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Cairo">Cairo (عربي)</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'حجم الخط الأساسي'}
                    {activeLanguage === 'en' && 'Base Font Size'}
                    {activeLanguage === 'es' && 'Tamaño de Fuente Base'}
                    {activeLanguage === 'fr' && 'Taille de Police de Base'}
                  </label>
                  <Input
                    name="fontSize"
                    value={settings.fontSize}
                    onChange={handleInputChange}
                    placeholder="16px"
                  />
                </div>
              </div>

              {/* Visual Effects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'نصف قطر الحواف'}
                    {activeLanguage === 'en' && 'Border Radius'}
                    {activeLanguage === 'es' && 'Radio de Borde'}
                    {activeLanguage === 'fr' && 'Rayon de Bordure'}
                  </label>
                  <Input
                    name="borderRadius"
                    value={settings.borderRadius}
                    onChange={handleInputChange}
                    placeholder="8px"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'نمط الأزرار'}
                    {activeLanguage === 'en' && 'Button Style'}
                    {activeLanguage === 'es' && 'Estilo de Botones'}
                    {activeLanguage === 'fr' && 'Style de Boutons'}
                  </label>
                  <select
                    name="buttonStyle"
                    value={settings.buttonStyle}
                    onChange={handleInputChange as any}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="rounded">
                      {activeLanguage === 'ar' ? 'مدور' : activeLanguage === 'en' ? 'Rounded' : activeLanguage === 'es' ? 'Redondeado' : 'Arrondi'}
                    </option>
                    <option value="square">
                      {activeLanguage === 'ar' ? 'مربع' : activeLanguage === 'en' ? 'Square' : activeLanguage === 'es' ? 'Cuadrado' : 'Carré'}
                    </option>
                    <option value="pill">
                      {activeLanguage === 'ar' ? 'دائري كامل' : activeLanguage === 'en' ? 'Pill' : activeLanguage === 'es' ? 'Píldora' : 'Pilule'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Box Shadow */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeLanguage === 'ar' && 'الظل الافتراضي'}
                  {activeLanguage === 'en' && 'Default Shadow'}
                  {activeLanguage === 'es' && 'Sombra Predeterminada'}
                  {activeLanguage === 'fr' && 'Ombre par Défaut'}
                </label>
                <Input
                  name="boxShadow"
                  value={settings.boxShadow}
                  onChange={handleInputChange}
                  placeholder="0 1px 3px rgba(0,0,0,0.1)"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'تفعيل الحركات'}
                    {activeLanguage === 'en' && 'Enable Animations'}
                    {activeLanguage === 'es' && 'Activar Animaciones'}
                    {activeLanguage === 'fr' && 'Activer les Animations'}
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="checkbox"
                      name="animationsEnabled"
                      checked={settings.animationsEnabled}
                      onChange={(e) => updateSetting('animationsEnabled', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {activeLanguage === 'ar' && 'تفعيل الحركات والتأثيرات في الصفحات'}
                      {activeLanguage === 'en' && 'Enable page animations and effects'}
                      {activeLanguage === 'es' && 'Activar animaciones y efectos de página'}
                      {activeLanguage === 'fr' && 'Activer les animations et effets de page'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'الوضع الليلي'}
                    {activeLanguage === 'en' && 'Dark Mode'}
                    {activeLanguage === 'es' && 'Modo Oscuro'}
                    {activeLanguage === 'fr' && 'Mode Sombre'}
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="checkbox"
                      name="darkModeEnabled"
                      checked={settings.darkModeEnabled}
                      onChange={(e) => updateSetting('darkModeEnabled', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {activeLanguage === 'ar' && 'تفعيل الوضع الليلي للموقع'}
                      {activeLanguage === 'en' && 'Enable dark mode for the site'}
                      {activeLanguage === 'es' && 'Activar modo oscuro para el sitio'}
                      {activeLanguage === 'fr' && 'Activer le mode sombre pour le site'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {activeLanguage === 'ar' && 'إعدادات الأمان'}
              {activeLanguage === 'en' && 'Security Settings'}
              {activeLanguage === 'es' && 'Configuración de Seguridad'}
              {activeLanguage === 'fr' && 'Paramètres de Sécurité'}
            </h2>
            
            <div className="space-y-6">
              {/* reCAPTCHA Settings */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {activeLanguage === 'ar' && 'إعدادات reCAPTCHA'}
                  {activeLanguage === 'en' && 'reCAPTCHA Settings'}
                  {activeLanguage === 'es' && 'Configuración de reCAPTCHA'}
                  {activeLanguage === 'fr' && 'Paramètres reCAPTCHA'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-red-900 mb-2">
                      {activeLanguage === 'ar' && 'تفعيل reCAPTCHA'}
                      {activeLanguage === 'en' && 'Enable reCAPTCHA'}
                      {activeLanguage === 'es' && 'Activar reCAPTCHA'}
                      {activeLanguage === 'fr' && 'Activer reCAPTCHA'}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="enableRecaptcha"
                        checked={settings.enableRecaptcha}
                        onChange={(e) => updateSetting('enableRecaptcha', e.target.checked)}
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        {activeLanguage === 'ar' && 'حماية النماذج من السبام والروبوتات'}
                        {activeLanguage === 'en' && 'Protect forms from spam and bots'}
                        {activeLanguage === 'es' && 'Proteger formularios contra spam y bots'}
                        {activeLanguage === 'fr' && 'Protéger les formulaires contre le spam et les bots'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-red-900 mb-2">
                        reCAPTCHA Site Key
                      </label>
                      <Input
                        name="recaptchaSiteKey"
                        value={settings.recaptchaSiteKey}
                        onChange={handleInputChange}
                        placeholder="6Lc..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-900 mb-2">
                        reCAPTCHA Secret Key
                      </label>
                      <Input
                        type="password"
                        name="recaptchaSecretKey"
                        value={settings.recaptchaSecretKey}
                        onChange={handleInputChange}
                        placeholder="6Lc..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Security */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-orange-900 mb-3">
                  {activeLanguage === 'ar' && 'أمان تسجيل الدخول'}
                  {activeLanguage === 'en' && 'Login Security'}
                  {activeLanguage === 'es' && 'Seguridad de Inicio de Sesión'}
                  {activeLanguage === 'fr' && 'Sécurité de Connexion'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-900 mb-2">
                      {activeLanguage === 'ar' && 'الحد الأقصى لمحاولات تسجيل الدخول'}
                      {activeLanguage === 'en' && 'Max Login Attempts'}
                      {activeLanguage === 'es' && 'Intentos Máximos de Inicio de Sesión'}
                      {activeLanguage === 'fr' && 'Tentatives de Connexion Maximales'}
                    </label>
                    <Input
                      type="number"
                      name="maxLoginAttempts"
                      value={settings.maxLoginAttempts}
                      onChange={handleInputChange}
                      min="3"
                      max="10"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-900 mb-2">
                      {activeLanguage === 'ar' && 'مدة الجلسة (بالدقائق)'}
                      {activeLanguage === 'en' && 'Session Timeout (minutes)'}
                      {activeLanguage === 'es' && 'Tiempo de Espera de Sesión (minutos)'}
                      {activeLanguage === 'fr' && 'Délai d\'Expiration de Session (minutes)'}
                    </label>
                    <Input
                      type="number"
                      name="sessionTimeout"
                      value={settings.sessionTimeout}
                      onChange={handleInputChange}
                      min="30"
                      max="1440"
                      placeholder="480"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-orange-900 mb-2">
                    {activeLanguage === 'ar' && 'تفعيل المصادقة الثنائية'}
                    {activeLanguage === 'en' && 'Enable Two-Factor Authentication'}
                    {activeLanguage === 'es' && 'Activar Autenticación de Dos Factores'}
                    {activeLanguage === 'fr' && 'Activer l\'Authentification à Deux Facteurs'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="enableTwoFactor"
                      checked={settings.enableTwoFactor}
                      onChange={(e) => updateSetting('enableTwoFactor', e.target.checked)}
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      {activeLanguage === 'ar' && 'طبقة أمان إضافية لحساب المسؤول'}
                      {activeLanguage === 'en' && 'Additional security layer for admin account'}
                      {activeLanguage === 'es' && 'Capa de seguridad adicional para cuenta de administrador'}
                      {activeLanguage === 'fr' && 'Couche de sécurité supplémentaire pour le compte administrateur'}
                    </span>
                  </div>
                </div>
              </div>

              {/* IP Management */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-900 mb-3">
                  {activeLanguage === 'ar' && 'إدارة عناوين IP'}
                  {activeLanguage === 'en' && 'IP Address Management'}
                  {activeLanguage === 'es' && 'Gestión de Direcciones IP'}
                  {activeLanguage === 'fr' && 'Gestion des Adresses IP'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      {activeLanguage === 'ar' && 'عناوين IP المسموح بها'}
                      {activeLanguage === 'en' && 'Allowed IP Addresses'}
                      {activeLanguage === 'es' && 'Direcciones IP Permitidas'}
                      {activeLanguage === 'fr' && 'Adresses IP Autorisées'}
                    </label>
                    <Input
                      name="allowedIPs"
                      value={settings.allowedIPs}
                      onChange={handleInputChange}
                      placeholder="192.168.1.1, 10.0.0.1"
                    />
                    <p className="text-xs text-purple-700 mt-1">
                      {activeLanguage === 'ar' && 'افصل عناوين IP بفاصلة. اتركه فارغاً للسماح لجميع العناوين'}
                      {activeLanguage === 'en' && 'Separate IPs with comma. Leave empty to allow all'}
                      {activeLanguage === 'es' && 'Separe las IP con comas. Deje vacío para permitir todas'}
                      {activeLanguage === 'fr' && 'Séparez les IP par des virgules. Laissez vide pour autoriser toutes'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      {activeLanguage === 'ar' && 'عناوين IP المحظورة'}
                      {activeLanguage === 'en' && 'Blocked IP Addresses'}
                      {activeLanguage === 'es' && 'Direcciones IP Bloqueadas'}
                      {activeLanguage === 'fr' && 'Adresses IP Bloquées'}
                    </label>
                    <Input
                      name="blockedIPs"
                      value={settings.blockedIPs}
                      onChange={handleInputChange}
                      placeholder="123.456.789.0"
                    />
                    <p className="text-xs text-purple-700 mt-1">
                      {activeLanguage === 'ar' && 'عناوين IP المحظورة من الوصول للموقع'}
                      {activeLanguage === 'en' && 'IP addresses blocked from accessing the site'}
                      {activeLanguage === 'es' && 'Direcciones IP bloqueadas para acceder al sitio'}
                      {activeLanguage === 'fr' && 'Adresses IP bloquées pour accéder au site'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>
                    {activeLanguage === 'ar' && 'تحذير:'}
                    {activeLanguage === 'en' && 'Warning:'}
                    {activeLanguage === 'es' && 'Advertencia:'}
                    {activeLanguage === 'fr' && 'Attention:'}
                  </strong>{' '}
                  {activeLanguage === 'ar' && 'كن حذراً عند تعديل إعدادات الأمان. الإعدادات الخاطئة قد تمنعك من الوصول إلى لوحة التحكم.'}
                  {activeLanguage === 'en' && 'Be careful when modifying security settings. Incorrect settings may prevent you from accessing the admin panel.'}
                  {activeLanguage === 'es' && 'Tenga cuidado al modificar la configuración de seguridad. La configuración incorrecta puede impedirle acceder al panel de administración.'}
                  {activeLanguage === 'fr' && 'Soyez prudent lors de la modification des paramètres de sécurité. Des paramètres incorrects peuvent vous empêcher d\'accéder au panneau d\'administration.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Advanced WhatsApp Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {activeLanguage === 'ar' && 'إعدادات واتساب المتقدمة'}
              {activeLanguage === 'en' && 'Advanced WhatsApp Settings'}
              {activeLanguage === 'es' && 'Configuración Avanzada de WhatsApp'}
              {activeLanguage === 'fr' && 'Paramètres Avancés WhatsApp'}
            </h2>
            
            <div className="space-y-6">
              {/* WhatsApp Messages */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'رسالة الترحيب'}
                    {activeLanguage === 'en' && 'Greeting Message'}
                    {activeLanguage === 'es' && 'Mensaje de Bienvenida'}
                    {activeLanguage === 'fr' && 'Message de Bienvenue'}
                  </label>
                  <Input
                    name="whatsappGreeting"
                    value={settings.whatsappGreeting}
                    onChange={handleInputChange}
                    placeholder="مرحباً! كيف يمكنني مساعدتك؟"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {activeLanguage === 'ar' && 'الرسالة التي تظهر عند النقر على زر واتساب'}
                    {activeLanguage === 'en' && 'Message shown when clicking WhatsApp button'}
                    {activeLanguage === 'es' && 'Mensaje que se muestra al hacer clic en el botón de WhatsApp'}
                    {activeLanguage === 'fr' && 'Message affiché lors du clic sur le bouton WhatsApp'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'رسالة الرد التلقائي'}
                    {activeLanguage === 'en' && 'Auto-Reply Message'}
                    {activeLanguage === 'es' && 'Mensaje de Respuesta Automática'}
                    {activeLanguage === 'fr' && 'Message de Réponse Automatique'}
                  </label>
                  <textarea
                    name="whatsappAutoReply"
                    value={settings.whatsappAutoReply}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      activeLanguage === 'ar' ? 'شكراً لتواصلك معنا! سنرد عليك في أقرب وقت.' :
                      activeLanguage === 'en' ? 'Thank you for contacting us! We will reply as soon as possible.' :
                      activeLanguage === 'es' ? '¡Gracias por contactarnos! Responderemos lo antes posible.' :
                      'Merci de nous contacter! Nous répondrons dans les plus brefs délais.'
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeLanguage === 'ar' && 'نص زر واتساب'}
                    {activeLanguage === 'en' && 'WhatsApp Button Text'}
                    {activeLanguage === 'es' && 'Texto del Botón de WhatsApp'}
                    {activeLanguage === 'fr' && 'Texte du Bouton WhatsApp'}
                  </label>
                  <Input
                    name="whatsappButtonText"
                    value={settings.whatsappButtonText}
                    onChange={handleInputChange}
                    placeholder="تواصل عبر واتساب"
                  />
                </div>
              </div>

              {/* Display Settings */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-900 mb-3">
                  {activeLanguage === 'ar' && 'إعدادات العرض'}
                  {activeLanguage === 'en' && 'Display Settings'}
                  {activeLanguage === 'es' && 'Configuración de Visualización'}
                  {activeLanguage === 'fr' && 'Paramètres d\'Affichage'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-2">
                      {activeLanguage === 'ar' && 'إظهار على الهاتف'}
                      {activeLanguage === 'en' && 'Show on Mobile'}
                      {activeLanguage === 'es' && 'Mostrar en Móvil'}
                      {activeLanguage === 'fr' && 'Afficher sur Mobile'}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="whatsappShowOnMobile"
                        checked={settings.whatsappShowOnMobile}
                        onChange={(e) => updateSetting('whatsappShowOnMobile', e.target.checked)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        {activeLanguage === 'ar' && 'عرض زر واتساب على الأجهزة المحمولة'}
                        {activeLanguage === 'en' && 'Show WhatsApp button on mobile devices'}
                        {activeLanguage === 'es' && 'Mostrar botón de WhatsApp en dispositivos móviles'}
                        {activeLanguage === 'fr' && 'Afficher le bouton WhatsApp sur les appareils mobiles'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-900 mb-2">
                      {activeLanguage === 'ar' && 'إظهار على الكمبيوتر'}
                      {activeLanguage === 'en' && 'Show on Desktop'}
                      {activeLanguage === 'es' && 'Mostrar en Escritorio'}
                      {activeLanguage === 'fr' && 'Afficher sur Bureau'}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="whatsappShowOnDesktop"
                        checked={settings.whatsappShowOnDesktop}
                        onChange={(e) => updateSetting('whatsappShowOnDesktop', e.target.checked)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        {activeLanguage === 'ar' && 'عرض زر واتساب على سطح المكتب'}
                        {activeLanguage === 'en' && 'Show WhatsApp button on desktop'}
                        {activeLanguage === 'es' && 'Mostrar botón de WhatsApp en escritorio'}
                        {activeLanguage === 'fr' && 'Afficher le bouton WhatsApp sur le bureau'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-green-900 mb-2">
                    {activeLanguage === 'ar' && 'موضع الزر'}
                    {activeLanguage === 'en' && 'Button Position'}
                    {activeLanguage === 'es' && 'Posición del Botón'}
                    {activeLanguage === 'fr' && 'Position du Bouton'}
                  </label>
                  <select
                    name="whatsappPosition"
                    value={settings.whatsappPosition}
                    onChange={handleInputChange as any}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="bottom-right">
                      {activeLanguage === 'ar' ? 'أسفل اليمين' : activeLanguage === 'en' ? 'Bottom Right' : activeLanguage === 'es' ? 'Inferior Derecha' : 'En Bas à Droite'}
                    </option>
                    <option value="bottom-left">
                      {activeLanguage === 'ar' ? 'أسفل اليسار' : activeLanguage === 'en' ? 'Bottom Left' : activeLanguage === 'es' ? 'Inferior Izquierda' : 'En Bas à Gauche'}
                    </option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>
                    {activeLanguage === 'ar' && 'نصيحة:'}
                    {activeLanguage === 'en' && 'Tip:'}
                    {activeLanguage === 'es' && 'Consejo:'}
                    {activeLanguage === 'fr' && 'Astuce:'}
                  </strong>{' '}
                  {activeLanguage === 'ar' && 'يظهر زر واتساب العائم في جميع صفحات الموقع لسهولة التواصل مع العملاء. تأكد من أن رقم الواتساب صحيح في إعدادات الاتصال.'}
                  {activeLanguage === 'en' && 'The floating WhatsApp button appears on all site pages for easy customer communication. Make sure the WhatsApp number is correct in contact settings.'}
                  {activeLanguage === 'es' && 'El botón flotante de WhatsApp aparece en todas las páginas del sitio para facilitar la comunicación con el cliente. Asegúrese de que el número de WhatsApp sea correcto en la configuración de contacto.'}
                  {activeLanguage === 'fr' && 'Le bouton flottant WhatsApp apparaît sur toutes les pages du site pour faciliter la communication avec les clients. Assurez-vous que le numéro WhatsApp est correct dans les paramètres de contact.'}
                </p>
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
            
            {/* Color Preview Section */}
            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">معاينة الألوان</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg shadow-md mb-2 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    أساسي
                  </div>
                  <span className="text-xs text-gray-600">{settings.primaryColor}</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg shadow-md mb-2 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: settings.secondaryColor }}
                  >
                    ثانوي
                  </div>
                  <span className="text-xs text-gray-600">{settings.secondaryColor}</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg shadow-md mb-2 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: settings.tertiaryColor }}
                  >
                    ثالث
                  </div>
                  <span className="text-xs text-gray-600">{settings.tertiaryColor}</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg shadow-md mb-2 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: settings.quaternaryColor }}
                  >
                    رابع
                  </div>
                  <span className="text-xs text-gray-600">{settings.quaternaryColor}</span>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg shadow-md mb-2 flex items-center justify-center border border-gray-300 font-bold"
                    style={{ 
                      backgroundColor: settings.quinaryColor,
                      color: settings.quaternaryColor
                    }}
                  >
                    خامس
                  </div>
                  <span className="text-xs text-gray-600">{settings.quinaryColor}</span>
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

          {/* Footer Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {activeLanguage === 'ar' && 'إعدادات الفوتر'}
              {activeLanguage === 'en' && 'Footer Settings'}
              {activeLanguage === 'es' && 'Configuración del Pie de Página'}
              {activeLanguage === 'fr' && 'Paramètres du Pied de Page'}
            </h2>
            
            <div className="space-y-6">
              {/* Footer Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeLanguage === 'ar' && 'وصف الشركة في الفوتر'}
                  {activeLanguage === 'en' && 'Company Description in Footer'}
                  {activeLanguage === 'es' && 'Descripción de la Empresa en el Pie de Página'}
                  {activeLanguage === 'fr' && 'Description de l\'Entreprise dans le Pied de Page'}
                </label>
                <textarea
                  name={`footerDescription${activeLanguage === 'ar' ? 'Ar' : activeLanguage === 'en' ? 'En' : activeLanguage === 'es' ? 'Es' : 'Fr'}`}
                  value={
                    activeLanguage === 'ar' ? settings.footerDescriptionAr :
                    activeLanguage === 'en' ? settings.footerDescriptionEn :
                    activeLanguage === 'es' ? settings.footerDescriptionEs :
                    settings.footerDescriptionFr
                  }
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    activeLanguage === 'ar' ? 'شركة رائدة في تصدير الرخام والجرانيت...' :
                    activeLanguage === 'en' ? 'Leading company in exporting...' :
                    activeLanguage === 'es' ? 'Empresa líder en exportación...' :
                    'Entreprise leader dans l\'exportation...'
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {activeLanguage === 'ar' && 'نص وصفي قصير يظهر في الفوتر باللغة الحالية'}
                  {activeLanguage === 'en' && 'Short description text displayed in footer in current language'}
                  {activeLanguage === 'es' && 'Texto descriptivo corto que aparece en el pie de página en idioma actual'}
                  {activeLanguage === 'fr' && 'Texte descriptif court affiché dans le pied de page en langue actuelle'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>
                    {activeLanguage === 'ar' && 'ملاحظة:'}
                    {activeLanguage === 'en' && 'Note:'}
                    {activeLanguage === 'es' && 'Nota:'}
                    {activeLanguage === 'fr' && 'Remarque:'}
                  </strong>{' '}
                  {activeLanguage === 'ar' && 'روابط الفوتر (الشركة، المنتجات، الدعم) ثابتة حالياً في الكود. نص حقوق النشر موجود في قسم الإعدادات القانونية.'}
                  {activeLanguage === 'en' && 'Footer links (Company, Products, Support) are currently fixed in code. Copyright text is in Legal Settings section.'}
                  {activeLanguage === 'es' && 'Los enlaces del pie de página (Empresa, Productos, Soporte) están actualmente fijos en el código. El texto de copyright está en la sección de Configuración Legal.'}
                  {activeLanguage === 'fr' && 'Les liens du pied de page (Entreprise, Produits, Support) sont fixes dans le code. Le texte de copyright est dans la section Paramètres Légaux.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </ToastProvider>
  )
}
