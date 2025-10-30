'use client'

import { useState } from 'react'
import { Send, Calculator } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Select } from '../../../components/ui/select'

interface QuoteFormProps {
  locale: string
}

export default function QuoteForm({ locale }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    materialType: '',
    quantity: '',
    dimensions: '',
    location: '',
    budget: '',
    timeline: '',
    description: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const projectTypes = [
    { value: 'residential', label: 'سكني / Residential' },
    { value: 'commercial', label: 'تجاري / Commercial' },
    { value: 'industrial', label: 'صناعي / Industrial' },
    { value: 'hospitality', label: 'فندقي / Hospitality' }
  ]

  const materialTypes = [
    { value: 'marble', label: 'رخام / Marble' },
    { value: 'granite', label: 'جرانيت / Granite' },
    { value: 'quartz', label: 'كوارتز / Quartz' },
    { value: 'mixed', label: 'مختلط / Mixed' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          locale,
          submittedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        alert('تم إرسال طلب العرض بنجاح! سنتواصل معك قريباً.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          materialType: '',
          quantity: '',
          dimensions: '',
          location: '',
          budget: '',
          timeline: '',
          description: ''
        })
      } else {
        alert('حدث خطأ في إرسال الطلب')
      }
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('حدث خطأ في إرسال الطلب')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* معلومات الاتصال */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الاتصال</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني *
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الهاتف *
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الشركة
            </label>
            <Input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* تفاصيل المشروع */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل المشروع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع المشروع *
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">اختر نوع المشروع</option>
              {projectTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع المادة *
            </label>
            <select
              name="materialType"
              value={formData.materialType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">اختر نوع المادة</option>
              {materialTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الكمية (متر مربع) *
            </label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              placeholder="مثال: 100"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الموقع *
            </label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="البلد والمدينة"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* تفاصيل إضافية */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل إضافية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الميزانية المتوقعة
            </label>
            <Input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="مثال: 10,000 - 20,000 USD"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الإطار الزمني
            </label>
            <Input
              type="text"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="مثال: خلال شهرين"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            وصف المشروع والمتطلبات الخاصة
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="اكتب تفاصيل إضافية عن مشروعك..."
            className="w-full"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-600 text-white py-3 text-lg"
      >
        <Send className="w-5 h-5 mr-2" />
        {isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب العرض'}
      </Button>
    </form>
  )
}