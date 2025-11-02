'use client'

import { useState, use, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { useRecaptcha } from '../../../hooks/useRecaptcha'

interface QuotePageProps {
  params: Promise<{ locale: string }>
}

export default function QuotePage({ params }: QuotePageProps) {
  const { locale } = use(params)
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [products, setProducts] = useState<any[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  // reCAPTCHA
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  const { isLoaded: isRecaptchaLoaded, executeRecaptcha } = useRecaptcha(recaptchaSiteKey)
  
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    city: '',
    
    // Product Selection (moved to step 1)
    productName: '', // Changed from productType to productName
    productId: '', // For tracking selected product from list
    
    // Project Info
    projectType: '',
    projectName: '',
    expectedDate: '',
    budget: '',
    
    // Product Requirements & Additional Info (merged in step 3)
    quantity: '',
    thickness: '',
    finish: '',
    dimensions: '',
    color: '',
    message: '',
    attachments: [] as string[]
  })

  // Load products and check for URL params
  useEffect(() => {
    // Fetch products list
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    
    fetchProducts()
    
    // Check if product was passed via URL
    const productParam = searchParams.get('product')
    const productIdParam = searchParams.get('productId')
    
    if (productParam) {
      setFormData(prev => ({
        ...prev,
        productName: decodeURIComponent(productParam) // Changed to productName
      }))
    }
    
    if (productIdParam) {
      setFormData(prev => ({
        ...prev,
        productId: productIdParam
      }))
    }
  }, [searchParams])

  const content = {
    ar: {
      title: 'طلب عرض سعر',
      subtitle: 'احصل على عرض سعر مخصص لمشروعك خلال 24 ساعة',
      steps: {
        1: 'معلومات شخصية ونوع المنتج',
        2: 'تفاصيل المشروع', 
        3: 'متطلبات المنتج والمعلومات الإضافية'
      },
      personalInfo: {
        title: 'معلوماتك الشخصية',
        fullName: 'الاسم الكامل',
        fullNamePlaceholder: 'أدخل اسمك الكامل',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'your@email.com',
        phone: 'رقم الهاتف',
        phonePlaceholder: '+20 XXX XXX XXXX',
        company: 'اسم الشركة',
        companyPlaceholder: 'اسم الشركة (اختياري)',
        country: 'الدولة',
        countryPlaceholder: 'اختر الدولة',
        city: 'المدينة',
        cityPlaceholder: 'اسم المدينة'
      },
      productSelection: {
        title: 'اختيار المنتج',
        productName: 'اسم المنتج',
        productPlaceholder: 'اختر المنتج',
        selectFromList: 'اختر من منتجاتنا',
        browseProducts: 'تصفح المنتجات'
      },
      projectInfo: {
        title: 'تفاصيل المشروع',
        projectType: 'نوع المشروع',
        projectTypePlaceholder: 'اختر نوع المشروع',
        projectName: 'اسم المشروع',
        projectNamePlaceholder: 'اسم المشروع (اختياري)',
        expectedDate: 'التاريخ المتوقع للتسليم',
        budget: 'الميزانية المتوقعة',
        budgetPlaceholder: '$10,000 - $50,000'
      },
      productRequirements: {
        title: 'متطلبات المنتج والمعلومات الإضافية',
        quantity: 'الكمية المطلوبة',
        quantityPlaceholder: 'الحد الأدنى 350 م²',
        thickness: 'السماكة',
        thicknessPlaceholder: '20mm',
        finish: 'نوع التشطيب',
        finishPlaceholder: 'اختر نوع التشطيب',
        dimensions: 'الأبعاد',
        dimensionsPlaceholder: '120x60cm',
        color: 'اللون المفضل',
        colorPlaceholder: 'أبيض، رمادي، إلخ',
        message: 'تفاصيل إضافية أو متطلبات خاصة',
        messagePlaceholder: 'أضف أي تفاصيل إضافية أو متطلبات خاصة لمشروعك...',
        attachments: 'المرفقات (صور، مخططات، إلخ)',
        uploadText: 'اسحب الملفات هنا أو انقر للاختيار',
        additionalInfoTitle: 'معلومات إضافية',
        productRequirementsTitle: 'متطلبات المنتج'
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
        'تشطيب لامع',
        'تشطيب مطفي',
        'تشطيب بفرشاة',
        'تشطيب بالنار',
        'تشطيب بالرمل',
        'تشطيب مطرقي',
        'تشطيب عتيق'
      ],
      buttons: {
        next: 'التالي',
        previous: 'السابق',
        submit: 'إرسال الطلب',
        uploadFiles: 'رفع الملفات'
      },
      validation: {
        requiredFields: 'يرجى ملء جميع الحقول المطلوبة',
        step1Required: 'يرجى ملء الاسم الكامل، البريد الإلكتروني، رقم الهاتف، الدولة، المدينة، واختيار المنتج',
        step2Required: 'يرجى اختيار نوع المشروع',
        step3Required: 'يرجى ملء الكمية المطلوبة',
        invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
        invalidPhone: 'يرجى إدخال رقم هاتف صحيح',
        nameRequired: 'يرجى إدخال الاسم الكامل',
        nameMin: 'يرجى إدخال اسم صحيح (حرفين على الأقل)',
        emailRequired: 'يرجى إدخال البريد الإلكتروني',
        emailFake: 'يرجى إدخال بريد إلكتروني حقيقي',
        phoneRequired: 'يرجى إدخال رقم الهاتف',
        phoneInvalid: 'يرجى إدخال رقم هاتف صحيح (8 أرقام على الأقل)',
        countryRequired: 'يرجى اختيار الدولة',
        cityRequired: 'يرجى إدخال المدينة',
        productRequired: 'يرجى اختيار المنتج',
        recaptchaFailed: 'فشل التحقق الأمني. يرجى المحاولة مرة أخرى.',
        submitError: 'حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.',
        networkError: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.'
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
        1: 'Personal Information & Product',
        2: 'Project Details',
        3: 'Product Requirements & Additional Info'
      },
      personalInfo: {
        title: 'Your Personal Information',
        fullName: 'Full Name',
        fullNamePlaceholder: 'Enter your full name',
        email: 'Email Address',
        emailPlaceholder: 'your@email.com',
        phone: 'Phone Number',
        phonePlaceholder: '+20 XXX XXX XXXX',
        company: 'Company Name',
        companyPlaceholder: 'Company name (optional)',
        country: 'Country',
        countryPlaceholder: 'Select country',
        city: 'City',
        cityPlaceholder: 'City name'
      },
      productSelection: {
        title: 'Product Selection',
        productName: 'Product Name',
        productPlaceholder: 'Select product',
        selectFromList: 'Select from our products',
        browseProducts: 'Browse Products'
      },
      projectInfo: {
        title: 'Project Details',
        projectType: 'Project Type',
        projectTypePlaceholder: 'Select project type',
        projectName: 'Project Name',
        projectNamePlaceholder: 'Project name (optional)',
        expectedDate: 'Expected Delivery Date',
        budget: 'Expected Budget',
        budgetPlaceholder: '$10,000 - $50,000'
      },
      productRequirements: {
        title: 'Product Requirements & Additional Information',
        quantity: 'Required Quantity',
        quantityPlaceholder: 'Minimum 350 m²',
        thickness: 'Thickness',
        thicknessPlaceholder: '20mm',
        finish: 'Finish Type',
        finishPlaceholder: 'Select finish type',
        dimensions: 'Dimensions',
        dimensionsPlaceholder: '120x60cm',
        color: 'Preferred Color',
        colorPlaceholder: 'White, gray, etc.',
        message: 'Additional details or special requirements',
        messagePlaceholder: 'Add any additional details or special requirements for your project...',
        attachments: 'Attachments (images, blueprints, etc.)',
        uploadText: 'Drag files here or click to select',
        additionalInfoTitle: 'Additional Information',
        productRequirementsTitle: 'Product Requirements'
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
        'Polished Finish',
        'Honed Finish',
        'Brushed Finish',
        'Flamed Finish',
        'Sandblasted Finish',
        'Bush Hammered Finish',
        'Antique Finish'
      ],
      buttons: {
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit Request',
        uploadFiles: 'Upload Files'
      },
      validation: {
        requiredFields: 'Please fill in all required fields',
        step1Required: 'Please fill in Full Name, Email, Phone, Country, City, and select a Product',
        step2Required: 'Please select a Project Type',
        step3Required: 'Please fill in the Required Quantity',
        invalidEmail: 'Please enter a valid email address',
        invalidPhone: 'Please enter a valid phone number',
        nameRequired: 'Please enter your full name',
        nameMin: 'Please enter a valid name (at least 2 characters)',
        emailRequired: 'Please enter email address',
        emailFake: 'Please enter a real email address',
        phoneRequired: 'Please enter phone number',
        phoneInvalid: 'Please enter a valid phone number (at least 8 digits)',
        countryRequired: 'Please select country',
        cityRequired: 'Please enter city',
        productRequired: 'Please select product',
        recaptchaFailed: 'Security verification failed. Please try again.',
        submitError: 'An error occurred while submitting the request. Please try again.',
        networkError: 'A server connection error occurred. Please try again.'
      },
      success: {
        title: 'Your request has been submitted successfully!',
        message: 'We will contact you within 24 hours with a custom quote',
        backToHome: 'Back to Home'
      }
    },
    es: {
      title: 'Solicitar Cotización',
      subtitle: 'Obtenga una cotización personalizada para su proyecto en 24 horas',
      steps: {
        1: 'Información Personal y Producto',
        2: 'Detalles del Proyecto',
        3: 'Requisitos del Producto e Información Adicional'
      },
      personalInfo: {
        title: 'Su Información Personal',
        fullName: 'Nombre Completo',
        fullNamePlaceholder: 'Ingrese su nombre completo',
        email: 'Correo Electrónico',
        emailPlaceholder: 'su@email.com',
        phone: 'Número de Teléfono',
        phonePlaceholder: '+34 XXX XXX XXX',
        company: 'Nombre de la Empresa',
        companyPlaceholder: 'Nombre de la empresa (opcional)',
        country: 'País',
        countryPlaceholder: 'Seleccione el país',
        city: 'Ciudad',
        cityPlaceholder: 'Nombre de la ciudad'
      },
      productSelection: {
        title: 'Selección de Producto',
        productName: 'Nombre del Producto',
        productPlaceholder: 'Seleccione el producto',
        selectFromList: 'Seleccione de nuestros productos',
        browseProducts: 'Explorar Productos'
      },
      projectInfo: {
        title: 'Detalles del Proyecto',
        projectType: 'Tipo de Proyecto',
        projectTypePlaceholder: 'Seleccione el tipo de proyecto',
        projectName: 'Nombre del Proyecto',
        projectNamePlaceholder: 'Nombre del proyecto (opcional)',
        expectedDate: 'Fecha de Entrega Esperada',
        budget: 'Presupuesto Esperado',
        budgetPlaceholder: '$10,000 - $50,000'
      },
      productRequirements: {
        title: 'Requisitos del Producto e Información Adicional',
        quantity: 'Cantidad Requerida',
        quantityPlaceholder: 'Mínimo 350 m²',
        thickness: 'Grosor',
        thicknessPlaceholder: '20mm',
        finish: 'Tipo de Acabado',
        finishPlaceholder: 'Seleccione el tipo de acabado',
        dimensions: 'Dimensiones',
        dimensionsPlaceholder: '120x60cm',
        color: 'Color Preferido',
        colorPlaceholder: 'Blanco, gris, etc.',
        message: 'Detalles adicionales o requisitos especiales',
        messagePlaceholder: 'Agregue cualquier detalle adicional o requisitos especiales para su proyecto...',
        attachments: 'Archivos adjuntos (imágenes, planos, etc.)',
        uploadText: 'Arrastre archivos aquí o haga clic para seleccionar',
        additionalInfoTitle: 'Información Adicional',
        productRequirementsTitle: 'Requisitos del Producto'
      },
      projectTypes: [
        'Proyecto Residencial',
        'Proyecto Comercial',
        'Hotel o Resort',
        'Restaurante o Café',
        'Oficina',
        'Proyecto Gubernamental',
        'Otro'
      ],
      productTypes: [
        'Mármol Natural',
        'Granito',
        'Cuarzo',
        'Piedras Especiales'
      ],
      finishTypes: [
        'Acabado pulido',
        'Acabado mate (lijado)',
        'Acabado cepillado',
        'Acabado flameado',
        'Acabado arenado',
        'Acabado abujardado',
        'Acabado antiguo'
      ],
      buttons: {
        next: 'Siguiente',
        previous: 'Anterior',
        submit: 'Enviar Solicitud',
        uploadFiles: 'Subir Archivos'
      },
      validation: {
        requiredFields: 'Por favor complete todos los campos obligatorios',
        step1Required: 'Por favor complete Nombre Completo, Correo Electrónico, Teléfono, País, Ciudad y seleccione un Producto',
        step2Required: 'Por favor seleccione un Tipo de Proyecto',
        step3Required: 'Por favor complete la Cantidad Requerida',
        invalidEmail: 'Por favor ingrese un correo electrónico válido',
        invalidPhone: 'Por favor ingrese un número de teléfono válido',
        nameRequired: 'Por favor ingrese su nombre completo',
        nameMin: 'Por favor ingrese un nombre válido (al menos 2 caracteres)',
        emailRequired: 'Por favor ingrese el correo electrónico',
        emailFake: 'Por favor ingrese un correo electrónico real',
        phoneRequired: 'Por favor ingrese el número de teléfono',
        phoneInvalid: 'Por favor ingrese un número de teléfono válido (al menos 8 dígitos)',
        countryRequired: 'Por favor seleccione el país',
        cityRequired: 'Por favor ingrese la ciudad',
        productRequired: 'Por favor seleccione el producto',
        recaptchaFailed: 'La verificación de seguridad falló. Por favor, inténtelo de nuevo.',
        submitError: 'Ocurrió un error al enviar la solicitud. Por favor, inténtelo de nuevo.',
        networkError: 'Ocurrió un error de conexión con el servidor. Por favor, inténtelo de nuevo.'
      },
      success: {
        title: '¡Su solicitud ha sido enviada con éxito!',
        message: 'Nos pondremos en contacto con usted en 24 horas con una cotización personalizada',
        backToHome: 'Volver al Inicio'
      }
    },
    fr: {
      title: 'Demander un Devis',
      subtitle: 'Obtenez un devis personnalisé pour votre projet en 24 heures',
      steps: {
        1: 'Informations Personnelles et Produit',
        2: 'Détails du Projet',
        3: 'Exigences du Produit et Informations Supplémentaires'
      },
      personalInfo: {
        title: 'Vos Informations Personnelles',
        fullName: 'Nom Complet',
        fullNamePlaceholder: 'Entrez votre nom complet',
        email: 'Adresse Email',
        emailPlaceholder: 'votre@email.com',
        phone: 'Numéro de Téléphone',
        phonePlaceholder: '+33 X XX XX XX XX',
        company: 'Nom de l\'Entreprise',
        companyPlaceholder: 'Nom de l\'entreprise (facultatif)',
        country: 'Pays',
        countryPlaceholder: 'Sélectionnez le pays',
        city: 'Ville',
        cityPlaceholder: 'Nom de la ville'
      },
      productSelection: {
        title: 'Sélection du Produit',
        productName: 'Nom du Produit',
        productPlaceholder: 'Sélectionnez le produit',
        selectFromList: 'Sélectionnez parmi nos produits',
        browseProducts: 'Parcourir les Produits'
      },
      projectInfo: {
        title: 'Détails du Projet',
        projectType: 'Type de Projet',
        projectTypePlaceholder: 'Sélectionnez le type de projet',
        projectName: 'Nom du Projet',
        projectNamePlaceholder: 'Nom du projet (facultatif)',
        expectedDate: 'Date de Livraison Prévue',
        budget: 'Budget Prévu',
        budgetPlaceholder: '$10,000 - $50,000'
      },
      productRequirements: {
        title: 'Exigences du Produit et Informations Supplémentaires',
        quantity: 'Quantité Requise',
        quantityPlaceholder: 'Minimum 350 m²',
        thickness: 'Épaisseur',
        thicknessPlaceholder: '20mm',
        finish: 'Type de Finition',
        finishPlaceholder: 'Sélectionnez le type de finition',
        dimensions: 'Dimensions',
        dimensionsPlaceholder: '120x60cm',
        color: 'Couleur Préférée',
        colorPlaceholder: 'Blanc, gris, etc.',
        message: 'Détails supplémentaires ou exigences spéciales',
        messagePlaceholder: 'Ajoutez tous les détails supplémentaires ou exigences spéciales pour votre projet...',
        attachments: 'Pièces jointes (images, plans, etc.)',
        uploadText: 'Faites glisser les fichiers ici ou cliquez pour sélectionner',
        additionalInfoTitle: 'Informations Supplémentaires',
        productRequirementsTitle: 'Exigences du Produit'
      },
      projectTypes: [
        'Projet Résidentiel',
        'Projet Commercial',
        'Hôtel ou Resort',
        'Restaurant ou Café',
        'Bureau',
        'Projet Gouvernemental',
        'Autre'
      ],
      productTypes: [
        'Marbre Naturel',
        'Granit',
        'Quartz',
        'Pierres Spéciales'
      ],
      finishTypes: [
        'Finition polie',
        'Finition adoucie',
        'Finition brossée',
        'Finition flammée',
        'Finition sablée',
        'Finition bouchardée',
        'Finition antique'
      ],
      buttons: {
        next: 'Suivant',
        previous: 'Précédent',
        submit: 'Envoyer la Demande',
        uploadFiles: 'Télécharger des Fichiers'
      },
      validation: {
        requiredFields: 'Veuillez remplir tous les champs obligatoires',
        step1Required: 'Veuillez remplir Nom Complet, E-mail, Téléphone, Pays, Ville et sélectionner un Produit',
        step2Required: 'Veuillez sélectionner un Type de Projet',
        step3Required: 'Veuillez remplir la Quantité Requise',
        invalidEmail: 'Veuillez entrer une adresse e-mail valide',
        invalidPhone: 'Veuillez entrer un numéro de téléphone valide',
        nameRequired: 'Veuillez entrer votre nom complet',
        nameMin: 'Veuillez entrer un nom valide (au moins 2 caractères)',
        emailRequired: 'Veuillez entrer l\'e-mail',
        emailFake: 'Veuillez entrer un e-mail réel',
        phoneRequired: 'Veuillez entrer le numéro de téléphone',
        phoneInvalid: 'Veuillez entrer un numéro de téléphone valide (au moins 8 chiffres)',
        countryRequired: 'Veuillez sélectionner le pays',
        cityRequired: 'Veuillez entrer la ville',
        productRequired: 'Veuillez sélectionner le produit',
        recaptchaFailed: 'La vérification de sécurité a échoué. Veuillez réessayer.',
        submitError: 'Une erreur s\'est produite lors de l\'envoi de la demande. Veuillez réessayer.',
        networkError: 'Une erreur de connexion au serveur s\'est produite. Veuillez réessayer.'
      },
      success: {
        title: 'Votre demande a été envoyée avec succès!',
        message: 'Nous vous contactons dans les 24 heures avec un devis personnalisé',
        backToHome: 'Retour à l\'Accueil'
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Step 1: Personal Info + Product Selection
        if (!formData.fullName.trim()) {
          alert(currentContent.validation.nameRequired)
          return false
        }
        
        // Check if name contains at least 2 characters and looks valid
        if (formData.fullName.trim().length < 2) {
          alert(currentContent.validation.nameMin)
          return false
        }
        
        if (!formData.email.trim()) {
          alert(currentContent.validation.emailRequired)
          return false
        }
        
        // Enhanced email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(formData.email)) {
          alert(currentContent.validation.invalidEmail)
          return false
        }
        
        // Check for common fake email patterns
        const fakeEmailPatterns = ['test@test', 'fake@fake', 'example@example', 'noreply@']
        if (fakeEmailPatterns.some(pattern => formData.email.toLowerCase().includes(pattern))) {
          alert(currentContent.validation.emailFake)
          return false
        }
        
        if (!formData.phone.trim()) {
          alert(currentContent.validation.phoneRequired)
          return false
        }
        
        // Phone validation - allow international formats with flexibility
        // Accept: +20 123 456 7890, 01234567890, +1-234-567-8900, etc.
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
        const cleanPhone = formData.phone.replace(/\s/g, '') // Remove spaces for validation
        
        if (!phoneRegex.test(formData.phone) || cleanPhone.length < 8) {
          alert(currentContent.validation.phoneInvalid)
          return false
        }
        
        if (!formData.country.trim()) {
          alert(currentContent.validation.countryRequired)
          return false
        }
        if (!formData.city.trim()) {
          alert(currentContent.validation.cityRequired)
          return false
        }
        if (!formData.productName.trim()) {
          alert(currentContent.validation.productRequired)
          return false
        }
        return true

      case 2:
        // Step 2: Project Details
        if (!formData.projectType.trim()) {
          alert(currentContent.validation.step2Required)
          return false
        }
        return true

      case 3:
        // Step 3: Product Requirements
        if (!formData.quantity.trim()) {
          alert(currentContent.validation.step3Required)
          return false
        }
        return true

      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate step 3 before submission
    if (!validateStep(3)) {
      return
    }
    
    setSubmitting(true)
    
    try {
      // Execute reCAPTCHA if available
      let recaptchaToken = null
      if (recaptchaSiteKey && isRecaptchaLoaded) {
        recaptchaToken = await executeRecaptcha('submit_quote')
        
        if (recaptchaToken) {
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
            alert(currentContent.validation.recaptchaFailed)
            setSubmitting(false)
            return
          }
        }
      }
      
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Quote request submitted successfully:', data)
        setCurrentStep(4) // Success step
      } else {
        console.error('Quote submission error:', data)
        alert(currentContent.validation.submitError)
      }
    } catch (error) {
      console.error('Quote submission error:', error)
      alert(currentContent.validation.networkError)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newUploadedFiles: File[] = []
    const newAttachments: string[] = [...formData.attachments]

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        })

        if (response.ok) {
          const data = await response.json()
          newUploadedFiles.push(file)
          newAttachments.push(data.url)
        } else {
          const error = await response.json()
          alert(`خطأ في رفع ${file.name}: ${error.error}`)
        }
      }

      setUploadedFiles([...uploadedFiles, ...newUploadedFiles])
      setFormData(prev => ({
        ...prev,
        attachments: newAttachments
      }))
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('حدث خطأ في رفع الملفات')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index)
    const newAttachments = formData.attachments.filter((_, i) => i !== index)
    
    setUploadedFiles(newUploadedFiles)
    setFormData(prev => ({
      ...prev,
      attachments: newAttachments
    }))
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
              step === currentStep
                ? 'bg-[var(--color-primary)] text-[var(--color-quinary)] shadow-lg scale-110 ring-4 ring-[var(--color-primary-200)]'
                : step < currentStep
                ? 'bg-[var(--color-success)] text-[var(--color-quinary)] shadow-md'
                : 'bg-[var(--color-quinary-200)] text-[var(--color-quaternary-400)]'
            }`}>
              {step < currentStep ? <CheckCircle className="w-7 h-7" /> : step}
            </div>
            <p className={`mt-2 text-sm font-medium transition-colors ${
              step === currentStep 
                ? 'text-[var(--color-primary)]' 
                : step < currentStep
                ? 'text-[var(--color-success)]'
                : 'text-[var(--color-quaternary-400)]'
            }`}>
              {currentContent.steps[step as keyof typeof currentContent.steps]}
            </p>
          </div>
          {step < 3 && (
            <div className={`w-24 h-1 mx-4 rounded-full transition-all duration-500 ${
              step < currentStep ? 'bg-gradient-to-r from-[var(--color-success)] to-[var(--color-primary)]' : 'bg-[var(--color-quinary-200)]'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-quinary-50)] via-[var(--color-primary-50)] to-[var(--color-quinary-50)] flex items-center justify-center p-4">
        <Card className="max-w-lg mx-auto p-10 text-center bg-[var(--color-quinary)] shadow-2xl border-t-4 border-[var(--color-success)]">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success-600)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
            <CheckCircle className="w-12 h-12 text-[var(--color-quinary)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-secondary-900)] mb-4">
            {currentContent.success.title}
          </h1>
          <p className="text-lg text-[var(--color-quaternary)] mb-8 leading-relaxed">
            {currentContent.success.message}
          </p>
          <Button 
            onClick={() => window.location.href = `/${locale}`}
            className="w-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {currentContent.success.backToHome}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-quinary-50)] via-[var(--color-primary-50)] to-[var(--color-quinary-50)]">
      {/* Header */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-700)] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-quinary)] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[var(--color-quinary-100)] p-4 rounded-2xl shadow-xl">
              <Calculator className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[var(--color-quinary)] mb-4 drop-shadow-lg">
            {currentContent.title}
          </h1>
          <p className="text-xl text-[var(--color-quinary-100)] max-w-2xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepIndicator />
          
          <Card className="p-8 md:p-12 bg-[var(--color-quinary)] shadow-2xl rounded-2xl border-t-4 border-[var(--color-primary)]">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information & Product Selection */}
              {currentStep === 1 && (
                <div className="animate-fadeIn">
                  <div className="flex items-center mb-8 pb-4 border-b-2 border-[var(--color-primary-100)]">
                    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-600)] p-3 rounded-xl shadow-lg">
                      <User className="w-7 h-7 text-[var(--color-quinary)]" />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-secondary-900)] mr-4">
                      {currentContent.personalInfo.title}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Input
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder={currentContent.personalInfo.fullNamePlaceholder}
                          label={currentContent.personalInfo.fullName}
                          icon={<User className="w-5 h-5" />}
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={currentContent.personalInfo.emailPlaceholder}
                          label={currentContent.personalInfo.email}
                          icon={<Mail className="w-5 h-5" />}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Input
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={currentContent.personalInfo.phonePlaceholder}
                          label={currentContent.personalInfo.phone}
                          icon={<Phone className="w-5 h-5" />}
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Input
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder={currentContent.personalInfo.companyPlaceholder}
                          label={currentContent.personalInfo.company}
                          icon={<Building className="w-5 h-5" />}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Input
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder={currentContent.personalInfo.countryPlaceholder}
                          label={currentContent.personalInfo.country}
                          icon={<MapPin className="w-5 h-5" />}
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder={currentContent.personalInfo.cityPlaceholder}
                          label={currentContent.personalInfo.city}
                          icon={<MapPin className="w-5 h-5" />}
                        />
                      </div>
                    </div>

                    {/* Product Selection Section */}
                    <div className="w-full bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-quinary)] border-2 border-[var(--color-primary-200)] rounded-xl p-6 mt-8 shadow-lg">
                      <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-600)] p-3 rounded-xl shadow-lg">
                          <Package className="w-7 h-7 text-[var(--color-quinary)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--color-secondary-900)] mr-4">
                          {currentContent.productSelection.title}
                        </h3>
                      </div>
                      
                      <div className="w-full transform transition-all duration-300 hover:scale-[1.02]">
                        <Select
                          name="productName"
                          required
                          value={formData.productName}
                          onChange={handleInputChange}
                          label={currentContent.productSelection.productName}
                          placeholder={currentContent.productSelection.productPlaceholder}
                          options={products.map((product) => ({
                            value: locale === 'ar' ? product.nameAr : product.nameEn,
                            label: locale === 'ar' ? product.nameAr : product.nameEn
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {currentStep === 2 && (
                <div className="animate-fadeIn">
                  <div className="flex items-center mb-8 pb-4 border-b-2 border-[var(--color-primary-100)]">
                    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-600)] p-3 rounded-xl shadow-lg">
                      <Building className="w-7 h-7 text-[var(--color-quinary)]" />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-secondary-900)] mr-4">
                      {currentContent.projectInfo.title}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Select
                          name="projectType"
                          required
                          value={formData.projectType}
                          onChange={handleInputChange}
                          label={currentContent.projectInfo.projectType}
                          placeholder={currentContent.projectInfo.projectTypePlaceholder}
                          options={currentContent.projectTypes.map((type, index) => ({
                            value: type,
                            label: type
                          }))}
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Input
                          name="projectName"
                          value={formData.projectName}
                          onChange={handleInputChange}
                          placeholder={currentContent.projectInfo.projectNamePlaceholder}
                          label={currentContent.projectInfo.projectName}
                          icon={<FileText className="w-5 h-5" />}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Input
                          name="expectedDate"
                          type="date"
                          value={formData.expectedDate}
                          onChange={handleInputChange}
                          label={currentContent.projectInfo.expectedDate}
                          icon={<Calendar className="w-5 h-5" />}
                        />
                      </div>
                      <div className="transform transition-all duration-300 hover:scale-[1.02]">
                        <Input
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder={currentContent.projectInfo.budgetPlaceholder}
                          label={currentContent.projectInfo.budget}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Product Requirements & Additional Information */}
              {currentStep === 3 && (
                <div className="animate-fadeIn">
                  <div className="flex items-center mb-8 pb-4 border-b-2 border-[var(--color-primary-100)]">
                    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-600)] p-3 rounded-xl shadow-lg">
                      <Package className="w-7 h-7 text-[var(--color-quinary)]" />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-secondary-900)] mr-4">
                      {currentContent.productRequirements.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Product Requirements */}
                    <div className="bg-[var(--color-quinary-50)] rounded-xl p-6 shadow-inner">
                      <h3 className="text-xl font-semibold text-[var(--color-secondary-900)] mb-6 flex items-center">
                        <div className="w-2 h-8 bg-[var(--color-primary)] rounded-full ml-3"></div>
                        {currentContent.productRequirements.productRequirementsTitle}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                          <label className="block text-sm font-semibold text-[var(--color-secondary-700)] mb-2">
                            {currentContent.productRequirements.quantity} *
                          </label>
                          <Input
                            name="quantity"
                            required
                            value={formData.quantity}
                            onChange={handleInputChange}
                            placeholder={currentContent.productRequirements.quantityPlaceholder}
                          />
                        </div>
                        
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                          <label className="block text-sm font-semibold text-[var(--color-secondary-700)] mb-2">
                            {currentContent.productRequirements.thickness}
                          </label>
                          <Input
                            name="thickness"
                            value={formData.thickness}
                            onChange={handleInputChange}
                            placeholder={currentContent.productRequirements.thicknessPlaceholder}
                          />
                        </div>
                        
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                          <label className="block text-sm font-semibold text-[var(--color-secondary-700)] mb-2">
                            {currentContent.productRequirements.finish}
                          </label>
                          <div className="relative">
                            <select
                              name="finish"
                              value={formData.finish}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 pr-10 border-2 border-[var(--color-quaternary-300)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-quinary)] transition-all duration-300 hover:border-[var(--color-primary-300)] appearance-none cursor-pointer"
                            >
                              <option value="">{currentContent.productRequirements.finishPlaceholder}</option>
                              {currentContent.finishTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-[var(--color-quaternary-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                          <label className="block text-sm font-semibold text-[var(--color-secondary-700)] mb-2">
                            {currentContent.productRequirements.dimensions}
                          </label>
                          <Input
                            name="dimensions"
                            value={formData.dimensions}
                            onChange={handleInputChange}
                            placeholder={currentContent.productRequirements.dimensionsPlaceholder}
                          />
                        </div>
                        
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                          <label className="block text-sm font-semibold text-[var(--color-secondary-700)] mb-2">
                            {currentContent.productRequirements.color}
                          </label>
                          <Input
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            placeholder={currentContent.productRequirements.colorPlaceholder}
                          />
                        </div>
                      </div>
                    </div>                    {/* Additional Information Section */}
                    <div className="bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-quinary)] border-2 border-[var(--color-primary-200)] rounded-xl p-6 shadow-lg">
                      <div className="flex items-center mb-6">
                        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-600)] p-3 rounded-xl shadow-lg">
                          <FileText className="w-7 h-7 text-[var(--color-quinary)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--color-secondary-900)] mr-4">
                          {currentContent.productRequirements.additionalInfoTitle}
                        </h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="transform transition-all duration-300 hover:scale-[1.01]">
                          <label className="block text-sm font-semibold text-[var(--color-secondary-700)] mb-2">
                            {currentContent.productRequirements.message}
                          </label>
                          <textarea
                            name="message"
                            rows={6}
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder={currentContent.productRequirements.messagePlaceholder}
                            className="w-full px-4 py-3 border-2 border-[var(--color-quaternary-300)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-quinary)] transition-all duration-300 hover:border-[var(--color-primary-300)] resize-none"
                          />
                        </div>
                        
                        <div className="transform transition-all duration-300 hover:scale-[1.01]">
                          <label className="block text-sm font-semibold text-[var(--color-secondary-700)] mb-2">
                            {currentContent.productRequirements.attachments}
                          </label>
                          
                          <input
                            type="file"
                            id="file-upload"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          
                          <label 
                            htmlFor="file-upload"
                            className="border-2 border-dashed border-[var(--color-primary-300)] rounded-xl p-8 text-center bg-[var(--color-quinary)] hover:bg-[var(--color-primary-50)] transition-all duration-300 cursor-pointer group block"
                          >
                            <div className="bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-200)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              {uploading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--color-primary)] border-t-transparent"></div>
                              ) : (
                                <Upload className="w-8 h-8 text-[var(--color-primary)]" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-[var(--color-quaternary)] mb-3">
                              {uploading 
                                ? (locale === 'ar' ? 'جاري الرفع...' : 'Uploading...')
                                : currentContent.productRequirements.uploadText
                              }
                            </p>
                            <div className="inline-block">
                              <div className="px-4 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-all font-semibold">
                                {currentContent.buttons.uploadFiles}
                              </div>
                            </div>
                          </label>
                          
                          {/* Display uploaded files */}
                          {uploadedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {uploadedFiles.map((file, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center justify-between bg-[var(--color-quinary-50)] p-3 rounded-lg border border-[var(--color-quaternary-200)]"
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                                    <span className="text-sm font-medium text-[var(--color-secondary-700)]">
                                      {file.name}
                                    </span>
                                    <span className="text-xs text-[var(--color-quaternary-400)]">
                                      ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12 pt-6 border-t-2 border-[var(--color-quaternary-100)]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="group transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-6 text-lg font-semibold shadow-md hover:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    {locale === 'ar' ? '→' : '←'}
                    {currentContent.buttons.previous}
                  </span>
                </Button>
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="group transition-all duration-300 hover:scale-105 hover:shadow-2xl px-8 py-6 text-lg font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] shadow-lg"
                  >
                    <span className="flex items-center gap-2">
                      {currentContent.buttons.next}
                      {locale === 'ar' ? '←' : '→'}
                    </span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="group transition-all duration-300 hover:scale-105 hover:shadow-2xl px-8 py-6 text-lg font-semibold bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success-600)] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-3">
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
                          {locale === 'ar' ? 'جاري الإرسال...' : 
                           locale === 'es' ? 'Enviando...' :
                           locale === 'fr' ? 'Envoi en cours...' :
                           'Sending...'}
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                          {currentContent.buttons.submit}
                        </>
                      )}
                    </span>
                  </Button>
                )}
              </div>
              
              {/* reCAPTCHA Notice */}
              {recaptchaSiteKey && (
                <div className="mt-6 text-center">
                  <p className="text-xs text-[var(--color-quaternary-500)]">
                    {locale === 'ar' 
                      ? 'هذا الموقع محمي بواسطة reCAPTCHA وتطبق سياسة الخصوصية وشروط الخدمة من Google.'
                      : locale === 'es'
                      ? 'Este sitio está protegido por reCAPTCHA y se aplican la Política de privacidad y los Términos de servicio de Google.'
                      : locale === 'fr'
                      ? 'Ce site est protégé par reCAPTCHA et les Règles de confidentialité et Conditions d\'utilisation de Google s\'appliquent.'
                      : 'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.'}
                  </p>
                </div>
              )}
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}
