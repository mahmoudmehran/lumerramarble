'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import { 
  Calculator, 
  Send, 
  Upload, 
  CheckCircle, 
  Package, 
  MapPin, 
  Calendar,
  FileText,
  Building,
  Phone,
  Mail,
  User
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Select } from '../../../components/ui/select'
import { Card } from '../../../components/ui/card'

interface QuotePageProps {
  params: Promise<{ locale: string }>
}

export default function QuotePage({ params }: QuotePageProps) {
  const { locale } = use(params)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    city: '',
    
    // Project Info
    projectType: '',
    projectName: '',
    expectedDate: '',
    budget: '',
    
    // Product Requirements
    productType: '',
    quantity: '',
    thickness: '',
    finish: '',
    dimensions: '',
    color: '',
    
    // Additional Info
    message: '',
    attachments: []
  })

  const content = {
    ar: {
      title: 'طلب عرض سعر',
      subtitle: 'احصل على عرض سعر مخصص لمشروعك خلال 24 ساعة',
      steps: {
        1: 'معلومات شخصية',
        2: 'تفاصيل المشروع', 
        3: 'متطلبات المنتج',
        4: 'معلومات إضافية'
      },
      personalInfo: {
        title: 'معلوماتك الشخصية',
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        company: 'اسم الشركة',
        country: 'الدولة',
        city: 'المدينة'
      },
      projectInfo: {
        title: 'تفاصيل المشروع',
        projectType: 'نوع المشروع',
        projectName: 'اسم المشروع',
        expectedDate: 'التاريخ المتوقع للتسليم',
        budget: 'الميزانية المتوقعة'
      },
      productRequirements: {
        title: 'متطلبات المنتج',
        productType: 'نوع المنتج',
        quantity: 'الكمية المطلوبة',
        thickness: 'السماكة',
        finish: 'نوع التشطيب',
        dimensions: 'الأبعاد',
        color: 'اللون المفضل'
      },
      additionalInfo: {
        title: 'معلومات إضافية',
        message: 'تفاصيل إضافية أو متطلبات خاصة',
        attachments: 'المرفقات (صور، مخططات، إلخ)'
      },
      projectTypes: [
        'مشروع سكني',
        'مشروع تجاري',
        'فندق أو منتجع',
        'مطعم أو مقهى',
        'مكتب',
        'مشروع حكومي',
        'أخرى'
      ],
      productTypes: [
        'رخام طبيعي',
        'جرانيت',
        'كوارتز',
        'أحجار خاصة'
      ],
      finishTypes: [
        'مصقول',
        'مطفي',
        'مضغوط',
        'محفور',
        'مخرم'
      ],
      buttons: {
        next: 'التالي',
        previous: 'السابق',
        submit: 'إرسال الطلب',
        uploadFiles: 'رفع الملفات'
      },
      success: {
        title: 'تم إرسال طلبك بنجاح!',
        message: 'سنتواصل معك خلال 24 ساعة مع عرض السعر المخصص',
        backToHome: 'العودة للرئيسية'
      }
    },
    en: {
      title: 'Request Quote',
      subtitle: 'Get a custom quote for your project within 24 hours',
      steps: {
        1: 'Personal Information',
        2: 'Project Details',
        3: 'Product Requirements', 
        4: 'Additional Information'
      },
      personalInfo: {
        title: 'Your Personal Information',
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        company: 'Company Name',
        country: 'Country',
        city: 'City'
      },
      projectInfo: {
        title: 'Project Details',
        projectType: 'Project Type',
        projectName: 'Project Name',
        expectedDate: 'Expected Delivery Date',
        budget: 'Expected Budget'
      },
      productRequirements: {
        title: 'Product Requirements',
        productType: 'Product Type',
        quantity: 'Required Quantity',
        thickness: 'Thickness',
        finish: 'Finish Type',
        dimensions: 'Dimensions',
        color: 'Preferred Color'
      },
      additionalInfo: {
        title: 'Additional Information',
        message: 'Additional details or special requirements',
        attachments: 'Attachments (images, blueprints, etc.)'
      },
      projectTypes: [
        'Residential Project',
        'Commercial Project',
        'Hotel or Resort',
        'Restaurant or Cafe',
        'Office',
        'Government Project',
        'Other'
      ],
      productTypes: [
        'Natural Marble',
        'Granite',
        'Quartz',
        'Special Stones'
      ],
      finishTypes: [
        'Polished',
        'Honed',
        'Brushed',
        'Carved',
        'Perforated'
      ],
      buttons: {
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit Request',
        uploadFiles: 'Upload Files'
      },
      success: {
        title: 'Your request has been submitted successfully!',
        message: 'We will contact you within 24 hours with a custom quote',
        backToHome: 'Back to Home'
      }
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Quote request submitted successfully:', data)
        setCurrentStep(5) // Success step
      } else {
        console.error('Quote submission error:', data)
        alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.')
      }
    } catch (error) {
      console.error('Quote submission error:', error)
      alert('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.')
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
            step === currentStep
              ? 'bg-[var(--color-primary)] text-[var(--color-quinary)]'
              : step < currentStep
              ? 'bg-[var(--color-success)] text-[var(--color-quinary)]'
              : 'bg-[var(--color-quinary-200)] text-[var(--color-quaternary)]'
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-[var(--color-success)]' : 'bg-[var(--color-quinary-200)]'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-[var(--color-quinary-50)] flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 text-center bg-[var(--color-quinary)]">
          <div className="w-16 h-16 bg-[var(--color-success-100)] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[var(--color-success)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-secondary-900)] mb-4">
            {currentContent.success.title}
          </h1>
          <p className="text-[var(--color-quaternary)] mb-6">
            {currentContent.success.message}
          </p>
          <Button 
            onClick={() => window.location.href = `/${locale}`}
            className="w-full"
          >
            {currentContent.success.backToHome}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)]">
      {/* Header */}
      <section className="bg-[var(--color-quinary)] py-16 border-b border-[var(--color-quaternary-200)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-[var(--color-primary)] mr-3" />
            <h1 className="text-4xl font-bold text-[var(--color-secondary-900)]">
              {currentContent.title}
            </h1>
          </div>
          <p className="text-xl text-[var(--color-quaternary)] max-w-2xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepIndicator />
          
          <Card className="p-8 bg-[var(--color-quinary)]">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center mb-6">
                    <User className="w-6 h-6 text-[var(--color-primary)] mr-3" />
                    <h2 className="text-2xl font-bold text-[var(--color-secondary-900)]">
                      {currentContent.personalInfo.title}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                      <Input
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={currentContent.personalInfo.fullName}
                        label={currentContent.personalInfo.fullName}
                        icon={<User className="w-4 h-4" />}
                      />
                      <Input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        label={currentContent.personalInfo.email}
                        icon={<Mail className="w-4 h-4" />}
                      />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                      <Input
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+20 XXX XXX XXXX"
                        label={currentContent.personalInfo.phone}
                        icon={<Phone className="w-4 h-4" />}
                      />
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder={currentContent.personalInfo.company}
                        label={currentContent.personalInfo.company}
                        icon={<Building className="w-4 h-4" />}
                      />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                      <Input
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder={currentContent.personalInfo.country}
                        label={currentContent.personalInfo.country}
                        icon={<MapPin className="w-4 h-4" />}
                      />
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder={currentContent.personalInfo.city}
                        label={currentContent.personalInfo.city}
                        icon={<MapPin className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center mb-6">
                    <Building className="w-6 h-6 text-[var(--color-primary)] mr-3" />
                    <h2 className="text-2xl font-bold text-[var(--color-secondary-900)]">
                      {currentContent.projectInfo.title}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                      <Select
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={handleInputChange}
                        label={currentContent.projectInfo.projectType}
                        placeholder="اختر نوع المشروع"
                        options={currentContent.projectTypes.map((type, index) => ({
                          value: type,
                          label: type
                        }))}
                      />
                      <Input
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        placeholder={currentContent.projectInfo.projectName}
                        label={currentContent.projectInfo.projectName}
                        icon={<FileText className="w-4 h-4" />}
                      />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                      <Input
                        name="expectedDate"
                        type="date"
                        value={formData.expectedDate}
                        onChange={handleInputChange}
                        label={currentContent.projectInfo.expectedDate}
                        icon={<Calendar className="w-4 h-4" />}
                      />
                      <Input
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="$10,000 - $50,000"
                        label={currentContent.projectInfo.budget}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Product Requirements */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center mb-6">
                    <Package className="w-6 h-6 text-[var(--color-primary)] mr-3" />
                    <h2 className="text-2xl font-bold text-[var(--color-secondary-900)]">
                      {currentContent.productRequirements.title}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary-700)] mb-2">
                        {currentContent.productRequirements.productType} *
                      </label>
                      <select
                        name="productType"
                        required
                        value={formData.productType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[var(--color-quaternary-300)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-quinary)]"
                      >
                        <option value="">اختر نوع المنتج</option>
                        {currentContent.productTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary-700)] mb-2">
                        {currentContent.productRequirements.quantity} *
                      </label>
                      <Input
                        name="quantity"
                        required
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="100 متر مربع"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary-700)] mb-2">
                        {currentContent.productRequirements.thickness}
                      </label>
                      <Input
                        name="thickness"
                        value={formData.thickness}
                        onChange={handleInputChange}
                        placeholder="20mm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary-700)] mb-2">
                        {currentContent.productRequirements.finish}
                      </label>
                      <select
                        name="finish"
                        value={formData.finish}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[var(--color-quaternary-300)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-quinary)]"
                      >
                        <option value="">اختر نوع التشطيب</option>
                        {currentContent.finishTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary-700)] mb-2">
                        {currentContent.productRequirements.dimensions}
                      </label>
                      <Input
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        placeholder="120x60cm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary-700)] mb-2">
                        {currentContent.productRequirements.color}
                      </label>
                      <Input
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="أبيض، رمادي، إلخ"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Additional Information */}
              {currentStep === 4 && (
                <div>
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-[var(--color-primary)] mr-3" />
                    <h2 className="text-2xl font-bold text-[var(--color-secondary-900)]">
                      {currentContent.additionalInfo.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary-700)] mb-2">
                        {currentContent.additionalInfo.message}
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="أضف أي تفاصيل إضافية أو متطلبات خاصة لمشروعك..."
                        className="w-full px-3 py-2 border border-[var(--color-quaternary-300)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-quinary)]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary-700)] mb-2">
                        {currentContent.additionalInfo.attachments}
                      </label>
                      <div className="border-2 border-dashed border-[var(--color-quaternary-300)] rounded-lg p-6 text-center bg-[var(--color-quinary-50)]">
                        <Upload className="w-8 h-8 text-[var(--color-quaternary-400)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--color-quaternary)] mb-2">
                          اسحب الملفات هنا أو انقر للاختيار
                        </p>
                        <Button type="button" variant="outline" size="sm">
                          {currentContent.buttons.uploadFiles}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="group transition-all duration-300 hover:scale-105"
                >
                  {currentContent.buttons.previous}
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="group transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {currentContent.buttons.next}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="group transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Send className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    {currentContent.buttons.submit}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}
