'use client'

import { useState, useEffect } from 'react'
import { 
  Eye, 
  Download, 
  Search, 
  // Filter, 
  // Calendar,
  User,
  Building,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  Send,
  // Edit,
  AlertCircle,
  Loader2,
  Copy,
  Upload,
  FileText
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card } from '../../../components/ui/card'
import { ToastProvider, toast } from '../../../components/ui/toast'
import PageSEOManager from '../../../components/admin/PageSEOManager'
import PageStatusToggle from '../../../components/admin/PageStatusToggle'

interface QuoteRequest {
  id: string
  date: string
  status: 'PENDING' | 'REVIEWED' | 'PROCESSING' | 'QUOTED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
  fullName: string
  email: string
  phone: string
  company: string
  country: string
  city?: string
  projectType: string
  projectName?: string
  productType: string
  quantity: string
  budget: string
  message: string
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  assignedTo?: string
  assignedUser?: { name: string; email: string }
  internalNotes?: string
  quotedPrice?: number
  quotedAt?: string
  expectedDate?: string
  thickness?: string
  finish?: string
  dimensions?: string
  color?: string
  attachments?: any
  createdAt: Date
  updatedAt: Date
}

interface SendQuoteModal {
  show: boolean
  quote: QuoteRequest | null
}

// interface StatusUpdateData {
//   quoteId: string
//   newStatus: QuoteRequest['status']
// }

export default function QuoteManagement() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendQuoteModal, setSendQuoteModal] = useState<SendQuoteModal>({ show: false, quote: null })
  const [updating, setUpdating] = useState<string | null>(null)

  // Load quotes from API
  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/quotes')

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.quotes) {
          setQuotes(data.quotes)
        } else {
          setError('فشل في تحميل البيانات')
        }
      } else {
        setError('خطأ في تحميل البيانات')
      }
    } catch (error) {
      console.error('Error loading quotes:', error)
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REVIEWED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800'
      case 'QUOTED': return 'bg-green-100 text-green-800'
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'COMPLETED': return 'bg-teal-100 text-teal-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'REVIEWED': return <Eye className="w-4 h-4" />
      case 'PROCESSING': return <Loader2 className="w-4 h-4" />
      case 'QUOTED': return <CheckCircle className="w-4 h-4" />
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />
      case 'REJECTED': return <XCircle className="w-4 h-4" />
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'في الانتظار'
      case 'REVIEWED': return 'تمت المراجعة'
      case 'PROCESSING': return 'قيد المعالجة'
      case 'QUOTED': return 'تم إرسال العرض'
      case 'ACCEPTED': return 'تم قبول العرض'
      case 'REJECTED': return 'تم رفض العرض'
      case 'COMPLETED': return 'مكتمل'
      case 'CANCELLED': return 'ملغي'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'NORMAL': return 'bg-blue-100 text-blue-800'
      case 'LOW': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'عاجل'
      case 'HIGH': return 'عالي'
      case 'NORMAL': return 'عادي'
      case 'LOW': return 'منخفض'
      default: return 'عادي'
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (quote.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateQuoteStatus = async (quoteId: string, newStatus: QuoteRequest['status']) => {
    try {
      setUpdating(quoteId)

      const response = await fetch('/api/admin/quotes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: quoteId,
          status: newStatus
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // تحديث الطلب في القائمة المحلية
          setQuotes(quotes.map(quote => 
            quote.id === quoteId ? { ...quote, status: newStatus, updatedAt: new Date() } : quote
          ))
          
          // تحديث الطلب المحدد إذا كان مفتوحاً
          if (selectedQuote && selectedQuote.id === quoteId) {
            setSelectedQuote({ ...selectedQuote, status: newStatus, updatedAt: new Date() })
          }
          
          toast.success('تم تحديث حالة الطلب بنجاح')
        } else {
          toast.error('فشل في تحديث حالة الطلب')
        }
      } else {
        toast.error('خطأ في تحديث حالة الطلب')
      }
    } catch (error) {
      console.error('Error updating quote status:', error)
      toast.error('خطأ في الاتصال بالخادم')
    } finally {
      setUpdating(null)
    }
  }

  const sendQuoteEmail = async (quote: QuoteRequest, subject: string, message: string, quotedPrice?: number) => {
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteId: quote.id,
          subject,
          message,
          quotedPrice
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // تحديث حالة الطلب إلى "تم إرسال العرض"
          await updateQuoteStatus(quote.id, 'QUOTED')
          setSendQuoteModal({ show: false, quote: null })
          toast.success('تم إرسال عرض السعر بنجاح')
        } else {
          toast.error('فشل في إرسال عرض السعر')
        }
      } else {
        toast.error('خطأ في إرسال عرض السعر')
      }
    } catch (error) {
      console.error('Error sending quote:', error)
      toast.error('خطأ في الاتصال بالخادم')
    }
  }

  const handleCallCustomer = (quote: QuoteRequest) => {
    if (quote.phone) {
      window.open(`tel:${quote.phone}`, '_self')
    } else {
      toast.warning('رقم الهاتف غير متوفر')
    }
  }

  const handleEmailCustomer = (quote: QuoteRequest) => {
    if (quote.email) {
      window.open(`mailto:${quote.email}`, '_blank')
    } else {
      toast.warning('البريد الإلكتروني غير متوفر')
    }
  }

  const handleDownloadPDF = (quote: QuoteRequest) => {
    try {
      // إنشاء محتوى PDF بصيغة HTML
      const pdfContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>تفاصيل طلب العرض ${quote.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #333; }
            .value { margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>تفاصيل طلب العرض</h1>
            <p>رقم الطلب: ${quote.id}</p>
            <p>تاريخ الإنشاء: ${quote.date}</p>
          </div>
          
          <div class="section">
            <h2>معلومات العميل</h2>
            <table>
              <tr><td class="label">الاسم</td><td>${quote.fullName}</td></tr>
              <tr><td class="label">البريد الإلكتروني</td><td>${quote.email}</td></tr>
              <tr><td class="label">الهاتف</td><td>${quote.phone}</td></tr>
              <tr><td class="label">الشركة</td><td>${quote.company || 'غير محدد'}</td></tr>
              <tr><td class="label">الدولة</td><td>${quote.country}</td></tr>
              ${quote.city ? `<tr><td class="label">المدينة</td><td>${quote.city}</td></tr>` : ''}
            </table>
          </div>
          
          <div class="section">
            <h2>تفاصيل المشروع</h2>
            <table>
              <tr><td class="label">نوع المشروع</td><td>${quote.projectType}</td></tr>
              ${quote.projectName ? `<tr><td class="label">اسم المشروع</td><td>${quote.projectName}</td></tr>` : ''}
              <tr><td class="label">نوع المنتج</td><td>${quote.productType}</td></tr>
              <tr><td class="label">الكمية</td><td>${quote.quantity}</td></tr>
              ${quote.thickness ? `<tr><td class="label">السماكة</td><td>${quote.thickness}</td></tr>` : ''}
              ${quote.finish ? `<tr><td class="label">نوع التشطيب</td><td>${quote.finish}</td></tr>` : ''}
              ${quote.color ? `<tr><td class="label">اللون</td><td>${quote.color}</td></tr>` : ''}
              ${quote.dimensions ? `<tr><td class="label">الأبعاد</td><td>${quote.dimensions}</td></tr>` : ''}
              <tr><td class="label">الميزانية</td><td>${quote.budget}</td></tr>
              ${quote.expectedDate ? `<tr><td class="label">التاريخ المطلوب</td><td>${quote.expectedDate}</td></tr>` : ''}
            </table>
          </div>
          
          ${quote.message ? `
          <div class="section">
            <h2>تفاصيل إضافية</h2>
            <p>${quote.message}</p>
          </div>
          ` : ''}
          
          <div class="section">
            <h2>حالة الطلب</h2>
            <table>
              <tr><td class="label">الحالة الحالية</td><td>${getStatusText(quote.status)}</td></tr>
              ${quote.priority ? `<tr><td class="label">الأولوية</td><td>${getPriorityText(quote.priority)}</td></tr>` : ''}
              ${quote.quotedPrice ? `<tr><td class="label">السعر المقترح</td><td>$${quote.quotedPrice.toLocaleString()}</td></tr>` : ''}
              ${quote.quotedAt ? `<tr><td class="label">تاريخ إرسال العرض</td><td>${quote.quotedAt}</td></tr>` : ''}
            </table>
          </div>
          
          <div class="footer" style="margin-top: 40px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
            <p>© لوميرا ماربل - تم إنشاء هذا التقرير في ${new Date().toLocaleString('ar-EG')}</p>
          </div>
        </body>
        </html>
      `
      
      // إنشاء نافذة جديدة وطباعة المحتوى
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(pdfContent)
        printWindow.document.close()
        printWindow.print()
        toast.success('تم إنشاء ملف PDF بنجاح')
      } else {
        toast.error('فشل في فتح نافذة الطباعة')
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('خطأ في إنشاء ملف PDF')
    }
  }

  const handleDownloadDetails = (quote: QuoteRequest) => {
    try {
      // إنشاء بيانات JSON منسقة
      const quoteData = {
        'معلومات الطلب': {
          'رقم الطلب': quote.id,
          'تاريخ الإنشاء': quote.date,
          'الحالة': getStatusText(quote.status),
          'الأولوية': quote.priority ? getPriorityText(quote.priority) : 'عادي'
        },
        'معلومات العميل': {
          'الاسم': quote.fullName,
          'البريد الإلكتروني': quote.email,
          'الهاتف': quote.phone,
          'الشركة': quote.company || 'غير محدد',
          'الدولة': quote.country,
          'المدينة': quote.city || 'غير محدد'
        },
        'تفاصيل المشروع': {
          'نوع المشروع': quote.projectType,
          'اسم المشروع': quote.projectName || 'غير محدد',
          'نوع المنتج': quote.productType,
          'الكمية': quote.quantity,
          'السماكة': quote.thickness || 'غير محدد',
          'نوع التشطيب': quote.finish || 'غير محدد',
          'اللون': quote.color || 'غير محدد',
          'الأبعاد': quote.dimensions || 'غير محدد',
          'الميزانية': quote.budget,
          'التاريخ المطلوب': quote.expectedDate || 'غير محدد'
        },
        'تفاصيل إضافية': {
          'الرسالة': quote.message || 'لا توجد تفاصيل إضافية',
          'السعر المقترح': quote.quotedPrice ? `$${quote.quotedPrice.toLocaleString()}` : 'لم يتم تحديد سعر',
          'تاريخ إرسال العرض': quote.quotedAt || 'لم يتم إرسال عرض بعد'
        }
      }

      // تحويل البيانات إلى نص JSON منسق
      const jsonString = JSON.stringify(quoteData, null, 2)
      
      // إنشاء ملف للتحميل
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      // إنشاء رابط تحميل
      const link = document.createElement('a')
      link.href = url
      link.download = `quote-${quote.id}-details.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('تم تحميل تفاصيل الطلب بنجاح')
    } catch (error) {
      console.error('Error downloading details:', error)
      toast.error('خطأ في تحميل التفاصيل')
    }
  }

  const handleExportAllQuotes = () => {
    try {
      // تحضير البيانات للتصدير
      const exportData = filteredQuotes.map(quote => ({
        'رقم الطلب': quote.id,
        'اسم العميل': quote.fullName,
        'البريد الإلكتروني': quote.email,
        'الهاتف': quote.phone,
        'الشركة': quote.company || 'غير محدد',
        'الدولة': quote.country,
        'المدينة': quote.city || 'غير محدد',
        'نوع المشروع': quote.projectType,
        'اسم المشروع': quote.projectName || 'غير محدد',
        'نوع المنتج': quote.productType,
        'الكمية': quote.quantity,
        'السماكة': quote.thickness || 'غير محدد',
        'التشطيب': quote.finish || 'غير محدد',
        'اللون': quote.color || 'غير محدد',
        'الأبعاد': quote.dimensions || 'غير محدد',
        'الميزانية': quote.budget,
        'التاريخ المطلوب': quote.expectedDate || 'غير محدد',
        'الحالة': getStatusText(quote.status),
        'الأولوية': quote.priority ? getPriorityText(quote.priority) : 'عادي',
        'السعر المقترح': quote.quotedPrice ? `$${quote.quotedPrice.toLocaleString()}` : 'لم يتم تحديد',
        'تاريخ الإنشاء': quote.date,
        'تاريخ العرض': quote.quotedAt || 'لم يتم إرسال عرض'
      }))

      // تحويل إلى CSV
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${(row as Record<string, string>)[header] || ''}"`).join(',')
        )
      ].join('\n')

      // إضافة BOM للدعم الصحيح للعربية
      const bom = '\uFEFF'
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `quotes-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success(`تم تصدير ${exportData.length} طلب بنجاح`)
    } catch (error) {
      console.error('Error exporting quotes:', error)
      toast.error('خطأ في تصدير البيانات')
    }
  }

  const handleCopyCustomerInfo = (quote: QuoteRequest) => {
    const customerInfo = `معلومات العميل:
الاسم: ${quote.fullName}
البريد الإلكتروني: ${quote.email}
الهاتف: ${quote.phone}
الشركة: ${quote.company || 'غير محدد'}
الدولة: ${quote.country}
المدينة: ${quote.city || 'غير محدد'}

تفاصيل المشروع:
نوع المشروع: ${quote.projectType}
نوع المنتج: ${quote.productType}
الكمية: ${quote.quantity}
الميزانية: ${quote.budget}`

    navigator.clipboard.writeText(customerInfo).then(() => {
      toast.success('تم نسخ معلومات العميل')
    }).catch(() => {
      toast.error('فشل في نسخ المعلومات')
    })
  }

  // مكون إرسال عرض السعر
  const SendQuoteModal = () => {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [quotedPrice, setQuotedPrice] = useState('')
    const [sending, setSending] = useState(false)
    const [language, setLanguage] = useState('es')

    const generateMessage = (lang: string, quote: QuoteRequest) => {
      if (lang === 'en') {
        return `Dear ${quote.fullName},

Thank you for contacting us regarding your ${quote.projectType}.

Based on the requirements specified in your request:
- Product Type: ${quote.productType}
- Quantity: ${quote.quantity}  
- Project: ${quote.projectType}
${quote.thickness ? `- Thickness: ${quote.thickness}` : ''}
${quote.finish ? `- Finish: ${quote.finish}` : ''}
${quote.color ? `- Color: ${quote.color}` : ''}
${quote.dimensions ? `- Dimensions: ${quote.dimensions}` : ''}

We are pleased to provide you with our competitive quote and look forward to serving you with the highest quality natural stone products.

Our products are sourced from the finest quarries and processed with state-of-the-art technology to ensure superior quality and durability.

Please feel free to contact us if you have any questions regarding this quote or if you need additional information.

Best regards,
Alhot Marble Team

---
Contact Information:
Email: info@alhotmarble.com
Website: www.alhotmarble.com
Phone: +1 (XXX) XXX-XXXX`
      } else if (lang === 'ar') {
        return `السيد/ة ${quote.fullName} المحترم/ة،

نشكركم على تواصلكم معنا بخصوص ${quote.projectType}.

بناءً على المتطلبات المحددة في طلبكم:
- نوع المنتج: ${quote.productType}
- الكمية: ${quote.quantity}
- المشروع: ${quote.projectType}
${quote.thickness ? `- السماكة: ${quote.thickness}` : ''}
${quote.finish ? `- نوع التشطيب: ${quote.finish}` : ''}
${quote.color ? `- اللون: ${quote.color}` : ''}
${quote.dimensions ? `- الأبعاد: ${quote.dimensions}` : ''}

يسعدنا أن نقدم لكم عرض أسعارنا التنافسي ونتطلع للعمل معكم وخدمتكم بأعلى جودة من الأحجار الطبيعية.

منتجاتنا مستخرجة من أفضل المحاجر ومعالجة بأحدث التقنيات لضمان الجودة العالية والمتانة.

لا تترددوا في التواصل معنا إذا كان لديكم أي استفسارات حول هذا العرض.

مع تحياتنا،
فريق لوميرا ماربل

---
معلومات التواصل:
البريد الإلكتروني: info@lumerramarble.com
الموقع الإلكتروني: www.lumerramarble.com
الهاتف: +1 (XXX) XXX-XXXX`
      } else if (lang === 'es') {
        return `Estimado/a ${quote.fullName},

Gracias por contactarnos en relación con su ${quote.projectType}.

Basado en los requisitos especificados en su solicitud:
- Tipo de Producto: ${quote.productType}
- Cantidad: ${quote.quantity}
- Proyecto: ${quote.projectType}
${quote.thickness ? `- Grosor: ${quote.thickness}` : ''}
${quote.finish ? `- Acabado: ${quote.finish}` : ''}
${quote.color ? `- Color: ${quote.color}` : ''}
${quote.dimensions ? `- Dimensiones: ${quote.dimensions}` : ''}

Nos complace ofrecerle nuestra cotización competitiva y esperamos servirle con productos de piedra natural de la más alta calidad.

Nuestros productos provienen de las mejores canteras y se procesan con tecnología de vanguardia para garantizar calidad superior y durabilidad.

No dude en contactarnos si tiene alguna pregunta sobre esta cotización o si necesita información adicional.

Saludos cordiales,
Equipo Alhot Marble

---
Información de Contacto:
Email: info@alhotmarble.com
Sitio Web: www.alhotmarble.com
Teléfono: +1 (XXX) XXX-XXXX`
      } else if (lang === 'fr') {
        return `Cher/Chère ${quote.fullName},

Merci de nous avoir contactés concernant votre ${quote.projectType}.

Basé sur les exigences spécifiées dans votre demande:
- Type de Produit: ${quote.productType}
- Quantité: ${quote.quantity}
- Projet: ${quote.projectType}
${quote.thickness ? `- Épaisseur: ${quote.thickness}` : ''}
${quote.finish ? `- Finition: ${quote.finish}` : ''}
${quote.color ? `- Couleur: ${quote.color}` : ''}
${quote.dimensions ? `- Dimensions: ${quote.dimensions}` : ''}

Nous sommes heureux de vous fournir notre devis compétitif et nous nous réjouissons de vous servir avec des produits en pierre naturelle de la plus haute qualité.

Nos produits proviennent des meilleures carrières et sont traités avec une technologie de pointe pour assurer une qualité et une durabilité supérieures.

N'hésitez pas à nous contacter si vous avez des questions concernant ce devis ou si vous avez besoin d'informations supplémentaires.

Cordialement,
Équipe Alhot Marble

---
Informations de Contact:
Email: info@alhotmarble.com
Site Web: www.alhotmarble.com
Téléphone: +1 (XXX) XXX-XXXX`
      }
      
      // الافتراضي: الإنجليزية
      return `Dear ${quote.fullName},

Thank you for contacting us regarding your ${quote.projectType}.

Based on the requirements specified in your request:
- Product Type: ${quote.productType}
- Quantity: ${quote.quantity}
- Project: ${quote.projectType}

We are pleased to provide you with our competitive quote and look forward to serving you with the highest quality natural stone products.

Best regards,
Alhot Marble Team

---
Contact Information:
Email: info@alhotmarble.com
Website: www.alhotmarble.com
Phone: +1 (XXX) XXX-XXXX`
    }

    useEffect(() => {
      if (sendQuoteModal.quote) {
        const quoteId = sendQuoteModal.quote.id.substring(0, 8)
        const titles = {
          en: `Quote for Your Request #${quoteId}`,
          ar: `عرض سعر لطلبكم رقم ${quoteId}`,
          es: `Cotización para su Solicitud #${quoteId}`,
          fr: `Devis pour votre Demande #${quoteId}`
        }
        setSubject(titles[language as keyof typeof titles] || titles.en)
        setMessage(generateMessage(language, sendQuoteModal.quote))
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language])

    const handleSend = async () => {
      if (!sendQuoteModal.quote || !subject || !message) {
        toast.warning('يرجى ملء جميع الحقول المطلوبة')
        return
      }

      setSending(true)
      try {
        await sendQuoteEmail(
          sendQuoteModal.quote, 
          subject, 
          message, 
          quotedPrice ? parseFloat(quotedPrice) : undefined
        )
      } finally {
        setSending(false)
      }
    }

    if (!sendQuoteModal.show || !sendQuoteModal.quote) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">إرسال عرض سعر</h2>
            <p className="text-gray-600">للعميل: {sendQuoteModal.quote.fullName}</p>
            <div className="mt-3 flex items-center gap-4">
              <label className="text-sm font-medium">لغة العرض:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setLanguage('en')
                    if (sendQuoteModal.quote) {
                      setMessage(generateMessage('en', sendQuoteModal.quote))
                      toast.info('تم تغيير اللغة إلى الإنجليزية')
                    }
                  }}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    language === 'en' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => {
                    setLanguage('ar')
                    if (sendQuoteModal.quote) {
                      setMessage(generateMessage('ar', sendQuoteModal.quote))
                      toast.info('تم تغيير اللغة إلى العربية')
                    }
                  }}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    language === 'ar' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  🇸🇦 العربية
                </button>
                <button
                  onClick={() => {
                    setLanguage('es')
                    if (sendQuoteModal.quote) {
                      setMessage(generateMessage('es', sendQuoteModal.quote))
                      toast.info('تم تغيير اللغة إلى الإسبانية')
                    }
                  }}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    language === 'es' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => {
                    setLanguage('fr')
                    if (sendQuoteModal.quote) {
                      setMessage(generateMessage('fr', sendQuoteModal.quote))
                      toast.info('تم تغيير اللغة إلى الفرنسية')
                    }
                  }}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    language === 'fr' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  🇫🇷 Français
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Email Subject' : 
                 language === 'ar' ? 'موضوع الرسالة' :
                 language === 'es' ? 'Asunto del Email' :
                 'Sujet de l\'Email'}
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={language === 'en' ? "Quote subject" : 
                           language === 'ar' ? "موضوع العرض" :
                           language === 'es' ? "Asunto de la cotización" :
                           "Sujet du devis"}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Quoted Price (USD)' : 
                 language === 'ar' ? 'السعر المقترح (دولار أمريكي)' :
                 language === 'es' ? 'Precio Cotizado (USD)' :
                 'Prix Devisé (USD)'}
              </label>
              <Input
                type="number"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
                placeholder={language === 'en' ? "Price in USD (optional)" : 
                           language === 'ar' ? "السعر بالدولار (اختياري)" :
                           language === 'es' ? "Precio en USD (opcional)" :
                           "Prix en USD (optionnel)"}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Message Content' : 
                 language === 'ar' ? 'نص الرسالة' :
                 language === 'es' ? 'Contenido del Mensaje' :
                 'Contenu du Message'}
              </label>
              <div className="mb-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (sendQuoteModal.quote) {
                      console.log('Resetting template for language:', language)
                      const newMessage = generateMessage(language, sendQuoteModal.quote)
                      console.log('Generated message:', newMessage.substring(0, 100) + '...')
                      setMessage(newMessage)
                      toast.success(`تم إعادة تعيين القالب (${language === 'en' ? 'English' : language === 'ar' ? 'العربية' : language === 'es' ? 'Español' : 'Français'})`)
                    } else {
                      toast.error('خطأ: لا يوجد طلب محدد')
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  🔄 {language === 'en' ? 'Reset to template' : 
                       language === 'ar' ? 'إعادة تعيين للقالب الافتراضي' :
                       language === 'es' ? 'Restablecer plantilla' :
                       'Réinitialiser le modèle'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setMessage('')}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  🗑️ {language === 'en' ? 'Clear' : 
                      language === 'ar' ? 'مسح الكل' :
                      language === 'es' ? 'Limpiar' :
                      'Effacer'}
                </button>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={14}
                className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${
                  language === 'ar' ? 'font-sans' : 'font-mono'
                }`}
                placeholder={language === 'en' ? "Enter your quote message..." : 
                           language === 'ar' ? "أدخل نص عرض السعر..." :
                           language === 'es' ? "Ingrese su mensaje de cotización..." :
                           "Entrez votre message de devis..."}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
          
          <div className="p-6 border-t flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setSendQuoteModal({ show: false, quote: null })}
              disabled={sending}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !subject || !message}
              className="flex items-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  إرسال العرض
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">جاري تحميل طلبات الأسعار...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">خطأ في التحميل</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadQuotes} className="w-full">
            إعادة المحاولة
          </Button>
        </Card>
      </div>
    )
  }

  if (selectedQuote) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedQuote(null)}
                className="mb-4"
              >
                ← العودة للقائمة
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                تفاصيل طلب العرض #{selectedQuote.id}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownloadPDF(selectedQuote)}
              >
                <Download className="w-4 h-4" />
                تحميل PDF
              </Button>
              <select
                value={selectedQuote.status}
                onChange={(e) => updateQuoteStatus(selectedQuote.id, e.target.value as QuoteRequest['status'])}
                className="px-3 py-2 border rounded-md"
                disabled={updating === selectedQuote.id}
              >
                <option value="PENDING">في الانتظار</option>
                <option value="REVIEWED">تمت المراجعة</option>
                <option value="PROCESSING">قيد المعالجة</option>
                <option value="QUOTED">تم إرسال العرض</option>
                <option value="ACCEPTED">تم قبول العرض</option>
                <option value="REJECTED">تم رفض العرض</option>
                <option value="COMPLETED">مكتمل</option>
                <option value="CANCELLED">ملغي</option>
              </select>
              {updating === selectedQuote.id && (
                <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* معلومات العميل */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                معلومات العميل
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyCustomerInfo(selectedQuote)}
                  className="mr-auto flex items-center gap-1 text-xs"
                >
                  <Copy className="w-3 h-3" />
                  نسخ
                </Button>
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">الاسم:</span> {selectedQuote.fullName}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${selectedQuote.email}`} className="text-blue-600 hover:underline">
                    {selectedQuote.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${selectedQuote.phone}`} className="text-blue-600 hover:underline">
                    {selectedQuote.phone}
                  </a>
                </div>
                <div>
                  <span className="font-medium">الشركة:</span> {selectedQuote.company || 'غير محدد'}
                </div>
                <div>
                  <span className="font-medium">الدولة:</span> {selectedQuote.country}
                </div>
                {selectedQuote.city && (
                  <div>
                    <span className="font-medium">المدينة:</span> {selectedQuote.city}
                  </div>
                )}
                {selectedQuote.priority && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">الأولوية:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedQuote.priority)}`}>
                      {getPriorityText(selectedQuote.priority)}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* تفاصيل المشروع */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                تفاصيل المشروع
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">نوع المشروع:</span> {selectedQuote.projectType}
                </div>
                {selectedQuote.projectName && (
                  <div>
                    <span className="font-medium">اسم المشروع:</span> {selectedQuote.projectName}
                  </div>
                )}
                <div>
                  <span className="font-medium">نوع المنتج:</span> {selectedQuote.productType}
                </div>
                <div>
                  <span className="font-medium">الكمية:</span> {selectedQuote.quantity}
                </div>
                {selectedQuote.thickness && (
                  <div>
                    <span className="font-medium">السماكة:</span> {selectedQuote.thickness}
                  </div>
                )}
                {selectedQuote.finish && (
                  <div>
                    <span className="font-medium">نوع التشطيب:</span> {selectedQuote.finish}
                  </div>
                )}
                {selectedQuote.color && (
                  <div>
                    <span className="font-medium">اللون:</span> {selectedQuote.color}
                  </div>
                )}
                {selectedQuote.dimensions && (
                  <div>
                    <span className="font-medium">الأبعاد:</span> {selectedQuote.dimensions}
                  </div>
                )}
                <div>
                  <span className="font-medium">الميزانية:</span> {selectedQuote.budget}
                </div>
                {selectedQuote.expectedDate && (
                  <div>
                    <span className="font-medium">التاريخ المطلوب:</span> {selectedQuote.expectedDate}
                  </div>
                )}
                <div>
                  <span className="font-medium">تاريخ الطلب:</span> {selectedQuote.date}
                </div>
                {selectedQuote.quotedPrice && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="font-medium text-green-800">السعر المقترح:</span> 
                    <span className="text-green-800 font-bold"> ${selectedQuote.quotedPrice.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* الرسالة */}
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">تفاصيل إضافية</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{selectedQuote.message || 'لا توجد تفاصيل إضافية'}</p>
              </div>
            </Card>

            {/* المرفقات */}
            {selectedQuote.attachments && (() => {
              try {
                const attachments = typeof selectedQuote.attachments === 'string' 
                  ? JSON.parse(selectedQuote.attachments) 
                  : selectedQuote.attachments
                
                if (!Array.isArray(attachments) || attachments.length === 0) return null
                
                return (
                  <Card className="p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      المرفقات ({attachments.length})
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {attachments.map((attachment: any, index: number) => {
                        const isImage = typeof attachment === 'string' && 
                          (attachment.endsWith('.jpg') || attachment.endsWith('.jpeg') || 
                           attachment.endsWith('.png') || attachment.endsWith('.gif') || 
                           attachment.endsWith('.webp'))
                        
                        return (
                          <div key={index} className="border rounded-lg p-2 hover:shadow-md transition-shadow">
                            {isImage ? (
                              <a href={attachment} target="_blank" rel="noopener noreferrer" className="block">
                                <img 
                                  src={attachment} 
                                  alt={`مرفق ${index + 1}`}
                                  className="w-full h-32 object-cover rounded mb-2"
                                />
                                <p className="text-xs text-gray-600 truncate">
                                  مرفق {index + 1}
                                </p>
                              </a>
                            ) : (
                              <a 
                                href={typeof attachment === 'string' ? attachment : '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded hover:bg-gray-200"
                              >
                                <FileText className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-xs text-gray-600 truncate px-2 text-center">
                                  {typeof attachment === 'string' ? attachment.split('/').pop() : `ملف ${index + 1}`}
                                </p>
                              </a>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                )
              } catch (e) {
                console.error('Error parsing attachments:', e)
                return null
              }
            })()}

            {/* الملاحظات الداخلية */}
            {selectedQuote.internalNotes && (
              <Card className="p-6 lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">ملاحظات داخلية</h2>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p>{selectedQuote.internalNotes}</p>
                </div>
              </Card>
            )}

            {/* إجراءات */}
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">الإجراءات</h2>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setSendQuoteModal({ show: true, quote: selectedQuote })}
                >
                  <Send className="w-4 h-4" />
                  إرسال عرض سعر
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleCallCustomer(selectedQuote)}
                >
                  <Phone className="w-4 h-4" />
                  اتصال بالعميل
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleEmailCustomer(selectedQuote)}
                >
                  <Mail className="w-4 h-4" />
                  إرسال بريد إلكتروني
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleDownloadDetails(selectedQuote)}
                >
                  <Download className="w-4 h-4" />
                  تحميل التفاصيل
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Send Quote Modal */}
        <SendQuoteModal />
        </div>
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
        
        {/* SEO Management Section */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">إعدادات صفحة طلب عرض سعر</h2>
              <PageStatusToggle pageKey="quote" />
            </div>
            <PageSEOManager pageKey="quote" />
          </Card>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة طلبات الأسعار</h1>
            <p className="text-gray-600">عرض ومتابعة جميع طلبات الأسعار</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">إجمالي الطلبات: </span>
              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded">
                {quotes.length}
              </span>
            </div>
            <Button 
              variant="outline"
              onClick={handleExportAllQuotes}
              className="flex items-center gap-2"
              disabled={filteredQuotes.length === 0}
            >
              <Download className="w-4 h-4" />
              تصدير النتائج ({filteredQuotes.length})
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="البحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="PENDING">في الانتظار</option>
                <option value="REVIEWED">تمت المراجعة</option>
                <option value="PROCESSING">قيد المعالجة</option>
                <option value="QUOTED">تم إرسال العرض</option>
                <option value="ACCEPTED">تم قبول العرض</option>
                <option value="REJECTED">تم رفض العرض</option>
                <option value="COMPLETED">مكتمل</option>
                <option value="CANCELLED">ملغي</option>
              </select>
            </div>
            <Button 
              variant="outline"
              onClick={loadQuotes}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              تحديث
            </Button>
          </div>
        </Card>

        {/* Quote Requests Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المشروع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الأولوية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{quote.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quote.fullName}</div>
                        <div className="text-sm text-gray-500">{quote.email}</div>
                        <div className="text-sm text-gray-500">{quote.country}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{quote.projectType}</div>
                        <div className="text-sm text-gray-500">{quote.company || 'غير محدد'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{quote.productType}</div>
                        <div className="text-sm text-gray-500">{quote.quantity}</div>
                        {quote.quotedPrice && (
                          <div className="text-sm text-green-600 font-medium">${quote.quotedPrice.toLocaleString()}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {quote.priority && (
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(quote.priority)}`}>
                          {getPriorityText(quote.priority)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quote.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusIcon(quote.status)}
                        {getStatusText(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedQuote(quote)}
                          className="inline-flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          عرض
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSendQuoteModal({ show: true, quote })}
                          className="inline-flex items-center gap-1"
                          disabled={quote.status === 'QUOTED' || quote.status === 'COMPLETED'}
                        >
                          <Send className="w-4 h-4" />
                          عرض سعر
                        </Button>
                        {updating === quote.id && (
                          <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">لا توجد طلبات أسعار</p>
            <p className="text-gray-500">سيظهر هنا جميع طلبات الأسعار الواردة</p>
          </div>
        )}

        {/* Send Quote Modal */}
        <SendQuoteModal />
        </div>
      </div>
    </ToastProvider>
  )
}
