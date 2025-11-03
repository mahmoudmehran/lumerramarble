'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, User, Send, Building, FileText, CheckCircle } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { useRecaptcha } from '../../../hooks/useRecaptcha'
import { useRecaptchaConfig } from '../../../contexts/RecaptchaContext'

interface ContactFormProps {
  locale: string
}

// Static labels for the form
const formLabels = {
  ar: {
    name_label: 'الاسم الكامل',
    name_placeholder: 'أدخل اسمك الكامل',
    email_label: 'البريد الإلكتروني',
    email_placeholder: 'example@email.com',
    phone_label: 'رقم الهاتف',
    phone_placeholder: '+20 XXX XXX XXXX',
    phone_helper: 'أدخل رقم هاتف دولي صحيح (8 أرقام على الأقل)',
    company_label: 'اسم الشركة',
    company_placeholder: 'اسم الشركة (اختياري)',
    subject_label: 'الموضوع',
    subject_placeholder: 'موضوع الرسالة',
    message_label: 'الرسالة',
    message_placeholder: 'اكتب رسالتك هنا...',
    submit_button: 'إرسال الرسالة',
    sending: 'جاري الإرسال...',
    success_title: 'تم إرسال رسالتك بنجاح!',
    success_message: 'سنتواصل معك في أقرب وقت ممكن',
    send_another: 'إرسال رسالة أخرى',
    recaptcha_notice: 'هذا الموقع محمي بواسطة reCAPTCHA وتطبق سياسة الخصوصية وشروط الخدمة من Google.',
    validation: {
      name_required: 'يرجى إدخال الاسم الكامل',
      name_min: 'الاسم يجب أن يكون حرفين على الأقل',
      email_required: 'يرجى إدخال البريد الإلكتروني',
      email_invalid: 'يرجى إدخال بريد إلكتروني صحيح',
      email_fake: 'يرجى إدخال بريد إلكتروني حقيقي',
      phone_required: 'يرجى إدخال رقم الهاتف',
      phone_invalid: 'يرجى إدخال رقم هاتف صحيح (8 أرقام على الأقل)',
      subject_required: 'يرجى إدخال موضوع الرسالة',
      message_required: 'يرجى كتابة رسالتك',
      message_min: 'الرسالة يجب أن تكون 10 أحرف على الأقل',
      recaptcha_failed: 'فشل التحقق الأمني. يرجى المحاولة مرة أخرى.',
      submit_error: 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
      network_error: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.'
    }
  },
  en: {
    name_label: 'Full Name',
    name_placeholder: 'Enter your full name',
    email_label: 'Email Address',
    email_placeholder: 'example@email.com',
    phone_label: 'Phone Number',
    phone_placeholder: '+20 XXX XXX XXXX',
    phone_helper: 'Enter a valid international phone number (at least 8 digits)',
    company_label: 'Company Name',
    company_placeholder: 'Company name (optional)',
    subject_label: 'Subject',
    subject_placeholder: 'Message subject',
    message_label: 'Message',
    message_placeholder: 'Write your message here...',
    submit_button: 'Send Message',
    sending: 'Sending...',
    success_title: 'Your message has been sent successfully!',
    success_message: 'We will contact you as soon as possible',
    send_another: 'Send Another Message',
    recaptcha_notice: 'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.',
    validation: {
      name_required: 'Please enter your full name',
      name_min: 'Name must be at least 2 characters',
      email_required: 'Please enter your email address',
      email_invalid: 'Please enter a valid email address',
      email_fake: 'Please enter a real email address',
      phone_required: 'Please enter your phone number',
      phone_invalid: 'Please enter a valid phone number (at least 8 digits)',
      subject_required: 'Please enter message subject',
      message_required: 'Please write your message',
      message_min: 'Message must be at least 10 characters',
      recaptcha_failed: 'Security verification failed. Please try again.',
      submit_error: 'An error occurred while sending the message. Please try again.',
      network_error: 'A server connection error occurred. Please try again.'
    }
  },
  es: {
    name_label: 'Nombre Completo',
    name_placeholder: 'Ingrese su nombre completo',
    email_label: 'Correo Electrónico',
    email_placeholder: 'ejemplo@email.com',
    phone_label: 'Número de Teléfono',
    phone_placeholder: '+20 XXX XXX XXXX',
    phone_helper: 'Ingrese un número de teléfono internacional válido (al menos 8 dígitos)',
    company_label: 'Nombre de la Empresa',
    company_placeholder: 'Nombre de la empresa (opcional)',
    subject_label: 'Asunto',
    subject_placeholder: 'Asunto del mensaje',
    message_label: 'Mensaje',
    message_placeholder: 'Escriba su mensaje aquí...',
    submit_button: 'Enviar Mensaje',
    sending: 'Enviando...',
    success_title: '¡Su mensaje ha sido enviado con éxito!',
    success_message: 'Nos pondremos en contacto con usted lo antes posible',
    send_another: 'Enviar Otro Mensaje',
    recaptcha_notice: 'Este sitio está protegido por reCAPTCHA y se aplican la Política de Privacidad y los Términos de Servicio de Google.',
    validation: {
      name_required: 'Por favor ingrese su nombre completo',
      name_min: 'El nombre debe tener al menos 2 caracteres',
      email_required: 'Por favor ingrese su correo electrónico',
      email_invalid: 'Por favor ingrese un correo electrónico válido',
      email_fake: 'Por favor ingrese un correo electrónico real',
      phone_required: 'Por favor ingrese su número de teléfono',
      phone_invalid: 'Por favor ingrese un número de teléfono válido (al menos 8 dígitos)',
      subject_required: 'Por favor ingrese el asunto del mensaje',
      message_required: 'Por favor escriba su mensaje',
      message_min: 'El mensaje debe tener al menos 10 caracteres',
      recaptcha_failed: 'La verificación de seguridad falló. Por favor, inténtelo de nuevo.',
      submit_error: 'Ocurrió un error al enviar el mensaje. Por favor, inténtelo de nuevo.',
      network_error: 'Ocurrió un error de conexión con el servidor. Por favor, inténtelo de nuevo.'
    }
  },
  fr: {
    name_label: 'Nom Complet',
    name_placeholder: 'Entrez votre nom complet',
    email_label: 'Adresse E-mail',
    email_placeholder: 'exemple@email.com',
    phone_label: 'Numéro de Téléphone',
    phone_placeholder: '+20 XXX XXX XXXX',
    phone_helper: 'Entrez un numéro de téléphone international valide (au moins 8 chiffres)',
    company_label: 'Nom de l\'Entreprise',
    company_placeholder: 'Nom de l\'entreprise (optionnel)',
    subject_label: 'Sujet',
    subject_placeholder: 'Sujet du message',
    message_label: 'Message',
    message_placeholder: 'Écrivez votre message ici...',
    submit_button: 'Envoyer le Message',
    sending: 'Envoi en cours...',
    success_title: 'Votre message a été envoyé avec succès!',
    success_message: 'Nous vous contacterons dans les plus brefs délais',
    send_another: 'Envoyer un Autre Message',
    recaptcha_notice: 'Ce site est protégé par reCAPTCHA et les Règles de Confidentialité et Conditions d\'Utilisation de Google s\'appliquent.',
    validation: {
      name_required: 'Veuillez entrer votre nom complet',
      name_min: 'Le nom doit contenir au moins 2 caractères',
      email_required: 'Veuillez entrer votre adresse e-mail',
      email_invalid: 'Veuillez entrer une adresse e-mail valide',
      email_fake: 'Veuillez entrer une adresse e-mail réelle',
      phone_required: 'Veuillez entrer votre numéro de téléphone',
      phone_invalid: 'Veuillez entrer un numéro de téléphone valide (au moins 8 chiffres)',
      subject_required: 'Veuillez entrer le sujet du message',
      message_required: 'Veuillez écrire votre message',
      message_min: 'Le message doit contenir au moins 10 caractères',
      recaptcha_failed: 'La vérification de sécurité a échoué. Veuillez réessayer.',
      submit_error: 'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer.',
      network_error: 'Une erreur de connexion au serveur s\'est produite. Veuillez réessayer.'
    }
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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // reCAPTCHA from settings
  const recaptchaConfig = useRecaptchaConfig()
  const { isLoaded: isRecaptchaLoaded, executeRecaptcha, isEnabled } = useRecaptcha({
    siteKey: recaptchaConfig.siteKey,
    enabled: recaptchaConfig.enabled
  })

  // Helper function to get text based on locale
  const getText = (key: string): string => {
    const labels = formLabels[locale as keyof typeof formLabels] || formLabels.en
    const value = labels[key as keyof typeof labels]
    // Exclude validation object
    if (typeof value === 'string') {
      return value
    }
    return key
  }
  
  const getValidation = (key: string): string => {
    const labels = formLabels[locale as keyof typeof formLabels] || formLabels.en
    const validation = labels.validation[key as keyof typeof labels.validation]
    return typeof validation === 'string' ? validation : key
  }

  const validateForm = (): boolean => {
    // Name validation
    if (!formData.name.trim()) {
      alert(getValidation('name_required'))
      return false
    }
    
    if (formData.name.trim().length < 2) {
      alert(getValidation('name_min'))
      return false
    }
    
    // Email validation
    if (!formData.email.trim()) {
      alert(getValidation('email_required'))
      return false
    }
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email)) {
      alert(getValidation('email_invalid'))
      return false
    }
    
    // Check for fake emails
    const fakeEmailPatterns = ['test@test', 'fake@fake', 'example@example', 'noreply@']
    if (fakeEmailPatterns.some(pattern => formData.email.toLowerCase().includes(pattern))) {
      alert(getValidation('email_fake'))
      return false
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      alert(getValidation('phone_required'))
      return false
    }
    
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
    const cleanPhone = formData.phone.replace(/\s/g, '')
    
    if (!phoneRegex.test(formData.phone) || cleanPhone.length < 8) {
      alert(getValidation('phone_invalid'))
      return false
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      alert(getValidation('subject_required'))
      return false
    }
    
    // Message validation
    if (!formData.message.trim()) {
      alert(getValidation('message_required'))
      return false
    }
    
    if (formData.message.trim().length < 10) {
      alert(getValidation('message_min'))
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Execute reCAPTCHA if available
      let recaptchaToken = null
      if (isEnabled && isRecaptchaLoaded) {
        recaptchaToken = await executeRecaptcha('contact_form')
        
        if (recaptchaToken && recaptchaToken !== 'disabled') {
          // Verify reCAPTCHA token
          const verifyResponse = await fetch('/api/verify-recaptcha', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: recaptchaToken }),
          })
          
          const verifyData = await verifyResponse.json()
          
          if (!verifyData.success) {
            alert(getValidation('recaptcha_failed'))
            setIsSubmitting(false)
            return
          }
        }
      }
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          locale,
          recaptchaToken
        })
      })

      if (response.ok) {
        setIsSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',  
          subject: '',
          message: ''
        })
      } else {
        alert(getValidation('submit_error'))
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(getValidation('network_error'))
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

  const handleSendAnother = () => {
    setIsSuccess(false)
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success-600)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
          <CheckCircle className="w-12 h-12 text-[var(--color-quinary)]" />
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-secondary-900)] mb-4">
          {getText('success_title')}
        </h3>
        <p className="text-lg text-[var(--color-quaternary)] mb-8">
          {getText('success_message')}
        </p>
        <Button 
          onClick={handleSendAnother}
          className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] hover:shadow-xl transition-all duration-300"
        >
          {getText('send_another')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            label={getText('name_label')}
            placeholder={getText('name_placeholder')}
            icon={<User className="w-5 h-5" />}
          />
        </div>
        
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            label={getText('email_label')}
            placeholder={getText('email_placeholder')}
            icon={<Mail className="w-5 h-5" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            label={getText('phone_label')}
            placeholder={getText('phone_placeholder')}
            helperText={getText('phone_helper')}
            icon={<Phone className="w-5 h-5" />}
          />
        </div>
        
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <Input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            label={getText('company_label')}
            placeholder={getText('company_placeholder')}
            icon={<Building className="w-5 h-5" />}
          />
        </div>
      </div>

      <div className="transform transition-all duration-300 hover:scale-[1.02]">
        <Input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          label={getText('subject_label')}
          placeholder={getText('subject_placeholder')}
          icon={<FileText className="w-5 h-5" />}
        />
      </div>

      <div className="transform transition-all duration-300 hover:scale-[1.01]">
        <label className="block text-sm font-medium text-[var(--color-quaternary)] mb-2">
          {getText('message_label')}
          <span className="text-red-500 ml-1 rtl:ml-0 rtl:mr-1">*</span>
        </label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder={getText('message_placeholder')}
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] hover:shadow-2xl transition-all duration-300 py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center justify-center gap-3">
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
              {getText('sending')}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {getText('submit_button')}
            </>
          )}
        </span>
      </Button>
      
      {/* reCAPTCHA Notice */}
      {isEnabled && (
        <div className="text-center">
          <p className="text-xs text-[var(--color-quaternary-500)]">
            {getText('recaptcha_notice')}
          </p>
        </div>
      )}
    </form>
  )
}