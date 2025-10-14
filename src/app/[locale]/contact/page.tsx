'use client'

import { useState, use } from 'react'
import { MapPin, Phone, Mail, Clock, Send, User } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = use(params)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })

  const content = {
    ar: {
      title: 'تواصل معنا',
      subtitle: 'نحن هنا لمساعدتك في جميع استفساراتك',
      form: {
        title: 'أرسل لنا رسالة',
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        company: 'اسم الشركة (اختياري)',
        message: 'رسالتك',
        send: 'إرسال الرسالة',
        namePlaceholder: 'أدخل اسمك الكامل',
        emailPlaceholder: 'your@email.com',
        phonePlaceholder: '+20 XXX XXX XXXX',
        companyPlaceholder: 'اسم شركتك',
        messagePlaceholder: 'اكتب رسالتك هنا...'
      },
      info: {
        title: 'معلومات التواصل',
        address: {
          title: 'العنوان',
          value: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان'
        },
        phone: {
          title: 'الهاتف / واتساب',
          value: '+20 111 312 1444'
        },
        email: {
          title: 'البريد الإلكتروني',
          value: 'info@alhotmarble.com'
        },
        hours: {
          title: 'ساعات العمل',
          value: 'الأحد - الخميس: 9:00 ص - 6:00 م'
        }
      },
      success: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
      error: 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.'
    },
    en: {
      title: 'Contact Us',
      subtitle: 'We are here to help you with all your inquiries',
      form: {
        title: 'Send us a message',
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        company: 'Company Name (Optional)',
        message: 'Your Message',
        send: 'Send Message',
        namePlaceholder: 'Enter your full name',
        emailPlaceholder: 'your@email.com',
        phonePlaceholder: '+20 XXX XXX XXXX',
        companyPlaceholder: 'Your company name',
        messagePlaceholder: 'Write your message here...'
      },
      info: {
        title: 'Contact Information',
        address: {
          title: 'Address',
          value: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone'
        },
        phone: {
          title: 'Phone / WhatsApp',
          value: '+20 111 312 1444'
        },
        email: {
          title: 'Email',
          value: 'info@alhotmarble.com'
        },
        hours: {
          title: 'Business Hours',
          value: 'Sunday - Thursday: 9:00 AM - 6:00 PM'
        }
      },
      success: 'Your message has been sent successfully! We will contact you soon.',
      error: 'An error occurred while sending the message. Please try again.'
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle form submission
    console.log('Form submitted:', formData)
    
    // Mock success response
    alert(currentContent.success)
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              {currentContent.title}
            </h1>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {currentContent.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-secondary-900 mb-8">
                {currentContent.info.title}
              </h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {currentContent.info.address.title}
                    </h3>
                    <p className="text-secondary-600">
                      {currentContent.info.address.value}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {currentContent.info.phone.title}
                    </h3>
                    <a 
                      href={`tel:${currentContent.info.phone.value}`}
                      className="text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      {currentContent.info.phone.value}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {currentContent.info.email.title}
                    </h3>
                    <a 
                      href={`mailto:${currentContent.info.email.value}`}
                      className="text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      {currentContent.info.email.value}
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {currentContent.info.hours.title}
                    </h3>
                    <p className="text-secondary-600">
                      {currentContent.info.hours.value}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Link */}
              <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    {locale === 'ar' ? 'موقعنا على الخريطة' : 'Find Us on Map'}
                  </h3>
                  <a
                    href="https://maps.app.goo.gl/4to6WUKDMY7KEjRVA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {locale === 'ar' ? 'عرض في خرائط Google' : 'View on Google Maps'}
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-secondary-900 mb-8">
                  {currentContent.form.title}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      label={currentContent.form.name}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={currentContent.form.namePlaceholder}
                      icon={<User className="w-4 h-4" />}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      label={currentContent.form.email}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={currentContent.form.emailPlaceholder}
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>

                  {/* Phone & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      label={currentContent.form.phone}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={currentContent.form.phonePlaceholder}
                      icon={<Phone className="w-4 h-4" />}
                    />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      label={currentContent.form.company}
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder={currentContent.form.companyPlaceholder}
                      icon={<MapPin className="w-4 h-4" />}
                    />
                  </div>

                  {/* Message */}
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    label={currentContent.form.message}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={currentContent.form.messagePlaceholder}
                  />

                  {/* Submit Button */}
                  <div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full md:w-auto group transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <Send className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 group-hover:rotate-12 transition-transform" />
                      {currentContent.form.send}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
