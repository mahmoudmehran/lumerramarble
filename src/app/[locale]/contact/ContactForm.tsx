'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'

interface ContactFormProps {
  locale: string
}

// Static labels for the form
const formLabels = {
  ar: {
    name_label: 'الاسم',
    email_label: 'البريد الإلكتروني',
    subject_label: 'الموضوع',
    message_label: 'الرسالة',
    submit_button: 'إرسال الرسالة'
  },
  en: {
    name_label: 'Name',
    email_label: 'Email',
    subject_label: 'Subject',
    message_label: 'Message',
    submit_button: 'Send Message'
  }
}

export default function ContactForm({ locale }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  })

  // Helper function to get text based on locale
  const getText = (section: string, key: string) => {
    const labels = formLabels[locale as keyof typeof formLabels] || formLabels.en
    return labels[key as keyof typeof labels] || key
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          locale
        })
      })

      if (response.ok) {
        alert('تم إرسال رسالتك بنجاح!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',  
          subject: '',
          message: ''
        })
      } else {
        alert('حدث خطأ في إرسال الرسالة')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('حدث خطأ في إرسال الرسالة')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getText('form', 'name_label')}
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
            {getText('form', 'email_label')}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الهاتف / Phone
          </label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الشركة / Company
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getText('form', 'subject_label')}
        </label>
        <Input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getText('form', 'message_label')}
        </label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary-600 text-white"
      >
        <Send className="w-4 h-4 mr-2" />
        {isSubmitting ? 'جاري الإرسال...' : getText('form', 'submit_button')}
      </Button>
    </form>
  )
}