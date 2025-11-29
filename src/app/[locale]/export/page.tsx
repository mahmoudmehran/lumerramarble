import Image from 'next/image'
import Link from 'next/link'
import { 
  Ship, 
  Globe, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Package,
  Truck,
  FileText,
  Award,
  TrendingUp,
  Users
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { getContent } from '../../../lib/content'
import {
  PageHeader,
  ContentSection,
  FeatureCard,
  StatCard,
  Grid,
  CTASection
} from '../../../components/ui/page-sections'

// Enable ISR with hourly revalidation
export const revalidate = 3600

interface ExportPageProps {
  params: Promise<{ locale: string }>
}

export default async function ExportPage({ params }: ExportPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  // جلب المحتوى من قاعدة البيانات
  const contentData = await getContent('export')

  // دالة للحصول على النص بلغة محددة
  const getText = (sectionKey: string, contentKey: string) => {
    return contentData[sectionKey]?.[contentKey]?.[locale as keyof typeof contentData[string][string]] || ''
  }

  // استخدام المحتوى المحدث أو الافتراضي
  const exportContent = contentData[locale as keyof typeof contentData]?.export

  const content = {
    ar: {
      title: 'خدمات التصدير',
      subtitle: 'نصدر منتجاتنا عالية الجودة إلى أكثر من 50 دولة حول العالم',
      hero: {
        title: 'خدمات التصدير الاحترافية',
        subtitle: 'نحن نقدم خدمات تصدير شاملة للرخام والجرانيت والكوارتز من مصر إلى جميع أنحاء العالم مع ضمان الجودة والتسليم في الوقت المحدد',
        cta: 'طلب عرض سعر للتصدير'
      },
      services: {
        title: 'خدماتنا',
        subtitle: 'نقدم خدمات تصدير متكاملة من الاستشارة إلى التسليم',
        items: [
          {
            icon: FileText,
            title: 'استشارة مجانية',
            description: 'نقدم استشارة مجانية لاختيار أفضل المنتجات المناسبة لمشروعك'
          },
          {
            icon: Package,
            title: 'تغليف احترافي',
            description: 'تغليف آمن ومحترف يضمن وصول المنتجات بحالة ممتازة'
          },
          {
            icon: Ship,
            title: 'شحن عالمي',
            description: 'خدمات شحن موثوقة إلى جميع أنحاء العالم'
          },
          {
            icon: Shield,
            title: 'ضمان الجودة',
            description: 'جميع منتجاتنا معتمدة بشهادات الجودة الدولية'
          },
          {
            icon: Clock,
            title: 'التسليم في الموعد',
            description: 'نلتزم بمواعيد التسليم المحددة دون تأخير'
          },
          {
            icon: Award,
            title: 'خدمة ما بعد البيع',
            description: 'دعم مستمر وخدمة عملاء متميزة حتى بعد التسليم'
          }
        ]
      },
      process: {
        title: 'عملية التصدير',
        subtitle: 'خطوات بسيطة للحصول على منتجاتنا',
        steps: [
          {
            number: '01',
            title: 'طلب عرض السعر',
            description: 'تواصل معنا وأرسل تفاصيل مشروعك للحصول على عرض سعر مخصص'
          },
          {
            number: '02', 
            title: 'اختيار المنتجات',
            description: 'اختر من مجموعتنا الواسعة من الرخام والجرانيت والكوارتز'
          },
          {
            number: '03',
            title: 'التأكيد والدفع',
            description: 'تأكيد الطلب وإجراءات الدفع الآمنة'
          },
          {
            number: '04',
            title: 'الإنتاج والتجهيز',
            description: 'إنتاج وتجهيز المنتجات وفقاً للمواصفات المطلوبة'
          },
          {
            number: '05',
            title: 'التغليف والشحن',
            description: 'تغليف احترافي وترتيب الشحن إلى وجهتك'
          },
          {
            number: '06',
            title: 'التسليم',
            description: 'التسليم في الموعد المحدد مع جميع الوثائق المطلوبة'
          }
        ]
      },
      countries: {
        title: 'البلدان التي نصدر إليها',
        subtitle: 'نصل إلى أكثر من 50 دولة في 6 قارات',
        regions: [
          { name: 'أوروبا', count: '15 دولة', flag: '🇪🇺' },
          { name: 'آسيا', count: '12 دولة', flag: '🌏' },
          { name: 'أمريكا الشمالية', count: '8 دول', flag: '🇺🇸' },
          { name: 'أمريكا الجنوبية', count: '6 دول', flag: '🇧🇷' },
          { name: 'أفريقيا', count: '10 دول', flag: '🌍' },
          { name: 'أوقيانوسيا', count: '3 دول', flag: '🇦🇺' }
        ]
      },
      features: {
        title: 'مميزات التصدير معنا',
        items: [
          'شحن آمن ومؤمن بالكامل',
          'أسعار تنافسية وعروض خاصة للكميات الكبيرة',
          'دعم فني متخصص',
          'مرونة في طرق الدفع',
          'تتبع الشحنة أونلاين',
          'منتجات عالية الجودة'
        ]
      },
      cta: {
        title: 'ابدأ مشروع التصدير الخاص بك',
        subtitle: 'احصل على عرض سعر مخصص وابدأ رحلة التصدير معنا اليوم',
        button: 'طلب عرض سعر الآن'
      }
    },
    en: {
      title: 'Export Services',
      subtitle: 'We export our high-quality products to more than 50 countries worldwide',
      hero: {
        title: 'Professional Export Services',
        subtitle: 'We provide comprehensive export services for marble, granite, and quartz from Egypt to all over the world with quality assurance and on-time delivery',
        cta: 'Request Export Quote'
      },
      services: {
        title: 'Our Services',
        subtitle: 'We provide integrated export services from consultation to delivery',
        items: [
          {
            icon: FileText,
            title: 'Free Consultation',
            description: 'We provide free consultation to choose the best products suitable for your project'
          },
          {
            icon: Package,
            title: 'Professional Packaging',
            description: 'Safe and professional packaging ensures products arrive in excellent condition'
          },
          {
            icon: Ship,
            title: 'Global Shipping',
            description: 'Reliable shipping services to all parts of the world'
          },
          {
            icon: Shield,
            title: 'Quality Assurance',
            description: 'All our products are certified with international quality certificates'
          },
          {
            icon: Clock,
            title: 'On-Time Delivery',
            description: 'We commit to specified delivery dates without delay'
          },
          {
            icon: Award,
            title: 'After-Sales Service',
            description: 'Continuous support and excellent customer service even after delivery'
          }
        ]
      },
      process: {
        title: 'Export Process',
        subtitle: 'Simple steps to get our products',
        steps: [
          {
            number: '01',
            title: 'Request Quote',
            description: 'Contact us and send your project details to get a custom quote'
          },
          {
            number: '02',
            title: 'Product Selection',
            description: 'Choose from our wide range of marble, granite, and quartz'
          },
          {
            number: '03',
            title: 'Confirmation & Payment',
            description: 'Order confirmation and secure payment procedures'
          },
          {
            number: '04',
            title: 'Production & Preparation',
            description: 'Production and preparation of products according to required specifications'
          },
          {
            number: '05',
            title: 'Packaging & Shipping',
            description: 'Professional packaging and shipping arrangement to your destination'
          },
          {
            number: '06',
            title: 'Delivery',
            description: 'On-time delivery with all required documents'
          }
        ]
      },
      countries: {
        title: 'Countries We Export To',
        subtitle: 'We reach more than 50 countries in 6 continents',
        regions: [
          { name: 'Europe', count: '15 Countries', flag: '🇪🇺' },
          { name: 'Asia', count: '12 Countries', flag: '🌏' },
          { name: 'North America', count: '8 Countries', flag: '🇺🇸' },
          { name: 'South America', count: '6 Countries', flag: '🇧🇷' },
          { name: 'Africa', count: '10 Countries', flag: '🌍' },
          { name: 'Oceania', count: '3 Countries', flag: '🇦🇺' }
        ]
      },
      features: {
        title: 'Export Features With Us',
        items: [
          'Safe and fully insured shipping',
          'Competitive prices and special offers for large quantities',
          'Specialized technical support',
          'Flexible payment methods',
          'Online shipment tracking',
          'High quality products'
        ]
      },
      cta: {
        title: 'Start Your Export Project',
        subtitle: 'Get a custom quote and start your export journey with us today',
        button: 'Request Quote Now'
      }
    }
  }

  // استخدام المحتوى حسب اللغة مع fallback للإنجليزية
  const currentContent = content[locale as keyof typeof content] || content.en

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)] dark:bg-[var(--color-quinary)]">
      {/* Hero Section */}
      <PageHeader
        title={getText('hero', 'title') || currentContent.hero.title}
        subtitle={getText('hero', 'subtitle') || currentContent.hero.subtitle}
        image={getText('hero', 'backgroundImage') || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200"}
      />

      {/* CTA Button Section */}
      <ContentSection variant="white">
        <div className="text-center -mt-8">
          <Link href={`/${locale}/quote`}>
            <Button size="lg" className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {currentContent.hero.cta}
              {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </Link>
        </div>
      </ContentSection>

      {/* Services Section */}
      <ContentSection
        title={currentContent.services.title}
        subtitle={currentContent.services.subtitle}
        variant="white"
        centered
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.services.items.map((service, index) => {
              const IconComponent = service.icon
              // صور خلفية مناسبة لكل خدمة (الافتراضية)
              const defaultBackgroundImages = [
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', // استشارة
                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', // تغليف
                'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800', // شحن
                'https://images.unsplash.com/photo-1568667256549-094345857637?w=800', // جودة
                'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800', // وقت
                'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800'  // خدمة عملاء
              ]
              
              // أسماء الخدمات للربط مع قاعدة البيانات
              const serviceKeys = ['consultation', 'packaging', 'shipping', 'quality', 'delivery', 'aftersales']
              const serviceKey = serviceKeys[index]
              
              // جلب الصورة من قاعدة البيانات أو استخدام الافتراضية
              const serviceImage = getText('services', `${serviceKey}_image`) || defaultBackgroundImages[index]
              
              return (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${serviceImage})`,
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-[var(--color-primary)]/90 group-hover:via-[var(--color-primary)]/60 group-hover:to-[var(--color-primary)]/40 transition-all duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 text-center min-h-[320px] flex flex-col justify-center items-center">
                    <div className="mb-6 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">
                      <IconComponent className="w-16 h-16 text-white drop-shadow-2xl" strokeWidth={2} />
                    </div>
                    <h3 className="font-bold text-2xl text-white mb-3 drop-shadow-lg">
                      {service.title}
                    </h3>
                    <div className="w-16 h-1 bg-white/50 group-hover:bg-white group-hover:w-24 transition-all duration-500 mb-4 rounded-full" />
                    <p className="text-white/90 text-base leading-relaxed drop-shadow-md">
                      {service.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ContentSection>

      {/* Process Section - Professional Timeline Design */}
      <ContentSection
        title={getText('process', 'title') || currentContent.process.title}
        subtitle={getText('process', 'subtitle') || currentContent.process.subtitle}
        variant="light"
        centered
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* Desktop Timeline View */}
          <div className="hidden lg:block relative">
            <div className="relative grid grid-cols-6 gap-4">
              {currentContent.process.steps.map((step, index) => {
                // صور خلفية لكل خطوة من خطوات التصدير (افتراضية)
                const defaultStepImages = [
                  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800', // طلب عرض السعر
                  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', // اختيار المنتجات
                  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800', // التأكيد والدفع
                  'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800', // الإنتاج والتجهيز
                  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', // التغليف والشحن
                  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800'  // التسليم
                ]
                
                // أسماء الخطوات للربط مع قاعدة البيانات
                const stepKeys = ['quote', 'selection', 'confirmation', 'production', 'packaging', 'delivery']
                const stepKey = stepKeys[index]
                
                // جلب البيانات من قاعدة البيانات أو استخدام الافتراضية
                const stepImage = getText('process', `${stepKey}_image`) || defaultStepImages[index]
                const stepNumber = getText('process', `${stepKey}_number`) || step.number
                const stepTitle = getText('process', `${stepKey}_title`) || step.title
                const stepDescription = getText('process', `${stepKey}_description`) || step.description
                
                return (
                <div key={index} className="relative">
                  {/* Number */}
                  <div className={`text-center mb-4 transition-all duration-500 ${
                    index % 2 === 0 ? 'mt-0' : 'mt-32'
                  }`}>
                    <span className="text-[var(--color-primary)] font-bold text-3xl">
                      {stepNumber}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className={`font-bold text-base text-[var(--color-secondary-900)] mb-8 text-center min-h-[3rem] flex items-center justify-center px-2 ${
                    index % 2 === 0 ? '' : ''
                  }`}>
                    {stepTitle}
                  </h3>
                  
                  {/* Content Card with Background Image */}
                  <div className={`group relative overflow-hidden rounded-2xl shadow-xl dark:shadow-[var(--color-quaternary-900)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                    index % 2 === 0 ? 'mt-0' : 'mt-0'
                  }`}>
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${stepImage})`,
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-[var(--color-primary)]/90 group-hover:via-[var(--color-primary)]/60 group-hover:to-[var(--color-primary)]/40 transition-all duration-500" />
                    
                    {/* Content */}
                    <div className="relative z-10 p-5 min-h-[140px] flex items-center justify-center">
                      <p className="text-white text-sm leading-relaxed text-center drop-shadow-lg font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow below the first 3 cards (even indices 0, 2, 4) */}
                  {index % 2 === 0 && index < 5 && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-20">
                      {isRTL ? (
                        <ArrowLeft className="w-10 h-10 text-[var(--color-primary)]" strokeWidth={2.5} />
                      ) : (
                        <ArrowRight className="w-10 h-10 text-[var(--color-primary)]" strokeWidth={2.5} />
                      )}
                    </div>
                  )}
                </div>
              )})}
            </div>
          </div>

          {/* Tablet Timeline View */}
          <div className="hidden md:block lg:hidden relative">
            <div className="grid grid-cols-3 gap-6">
              {currentContent.process.steps.map((step, index) => {
                const defaultStepImages = [
                  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
                  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
                  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
                  'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800',
                  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
                  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800'
                ]
                const stepKeys = ['quote', 'selection', 'confirmation', 'production', 'packaging', 'delivery']
                const stepKey = stepKeys[index]
                const stepImage = getText('process', `${stepKey}_image`) || defaultStepImages[index]
                const stepNumber = getText('process', `${stepKey}_number`) || step.number
                const stepTitle = getText('process', `${stepKey}_title`) || step.title
                const stepDescription = getText('process', `${stepKey}_description`) || step.description
                
                return (
                <div key={index} className="relative">
                  {/* Number */}
                  <div className="text-center mb-4">
                    <span className="text-[var(--color-primary)] font-bold text-2xl">
                      {stepNumber}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-bold text-base text-[var(--color-secondary-900)] mb-6 text-center px-2 min-h-[3rem] flex items-center justify-center">
                    {stepTitle}
                  </h3>
                  
                  {/* Content Card */}
                  <div className="group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${stepImage})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-[var(--color-primary)]/90 group-hover:via-[var(--color-primary)]/60 group-hover:to-[var(--color-primary)]/40 transition-all duration-500" />
                    <div className="relative z-10 p-6 min-h-[160px] flex items-center justify-center">
                      <p className="text-white text-sm leading-relaxed text-center drop-shadow-lg font-medium">
                        {stepDescription}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow below for first 3 items */}
                  {index < 3 && (
                    <div className="flex justify-center mt-6">
                      <ArrowRight className="w-8 h-8 text-[var(--color-primary)] rotate-90" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              )})}
            </div>
          </div>

          {/* Mobile Timeline View */}
          <div className="block md:hidden relative">
            <div className="space-y-8">
              {currentContent.process.steps.map((step, index) => {
                const defaultStepImages = [
                  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
                  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
                  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
                  'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800',
                  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
                  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800'
                ]
                const stepKeys = ['quote', 'selection', 'confirmation', 'production', 'packaging', 'delivery']
                const stepKey = stepKeys[index]
                const stepImage = getText('process', `${stepKey}_image`) || defaultStepImages[index]
                const stepNumber = getText('process', `${stepKey}_number`) || step.number
                const stepTitle = getText('process', `${stepKey}_title`) || step.title
                const stepDescription = getText('process', `${stepKey}_description`) || step.description
                
                return (
                <div key={index} className="relative">
                  {/* Number */}
                  <div className="text-center mb-3">
                    <span className="text-[var(--color-primary)] font-bold text-2xl">
                      {stepNumber}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-bold text-base text-[var(--color-secondary-900)] mb-4 text-center px-2">
                    {stepTitle}
                  </h3>
                  
                  {/* Content Card */}
                  <div className="relative overflow-hidden rounded-xl shadow-xl active:scale-95 transition-transform duration-300">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                      style={{
                        backgroundImage: `url(${stepImage})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 transition-all duration-500" />
                    <div className="relative z-10 p-5 min-h-[140px] flex items-center justify-center">
                      <p className="text-white text-sm leading-relaxed text-center drop-shadow-lg font-medium">
                        {stepDescription}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow below for all items except last */}
                  {index < currentContent.process.steps.length - 1 && (
                    <div className="flex justify-center my-6">
                      <ArrowRight className="w-10 h-10 text-[var(--color-primary)] rotate-90" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              )})}
            </div>
          </div>
        </div>
      </ContentSection>

      {/* Countries Section */}
      <ContentSection
        title={getText('countries', 'title') || currentContent.countries.title}
        subtitle={getText('countries', 'subtitle') || currentContent.countries.subtitle}
        variant="white"
        centered
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.countries.regions.map((region, index) => {
              // صور خلفية للقارات (افتراضية)
              const defaultRegionImages = [
                'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800', // أوروبا
                'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800', // آسيا
                'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800', // أمريكا الشمالية
                'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800', // أمريكا الجنوبية
                'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800', // أفريقيا
                'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800'  // أوقيانوسيا
              ]
              
              // مفاتيح المناطق
              const regionKeys = ['europe', 'asia', 'americas', 'southamerica', 'africa', 'oceania']
              const regionKey = regionKeys[index]
              
              // جلب البيانات من قاعدة البيانات
              const regionName = getText('countries', `${regionKey}_name`) || region.name
              const regionCount = getText('countries', `${regionKey}_count`) || region.count
              const regionImage = getText('countries', `${regionKey}_image`) || defaultRegionImages[index]
              const regionFlag = getText('countries', `${regionKey}_flag`) || region.flag
              
              return (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${regionImage})`,
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-[var(--color-primary)]/90 group-hover:via-[var(--color-primary)]/60 group-hover:to-[var(--color-primary)]/40 transition-all duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 text-center min-h-[280px] flex flex-col justify-center items-center">
                    <div className="text-6xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 filter drop-shadow-lg">
                      {regionFlag}
                    </div>
                    <h3 className="font-bold text-2xl text-white mb-2 drop-shadow-lg">
                      {regionName}
                    </h3>
                    <div className="w-16 h-1 bg-white/50 group-hover:bg-white group-hover:w-24 transition-all duration-500 mb-3 rounded-full" />
                    <p className="text-white font-bold text-xl drop-shadow-lg">
                      {regionCount}
                    </p>
                    
                    {/* Decorative element */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Globe className="w-8 h-8 text-white/80 mx-auto animate-pulse" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ContentSection>

      {/* Features Section */}
      <ContentSection
        title={getText('features', 'title') || currentContent.features.title}
        variant="light"
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {currentContent.features.items.map((feature, index) => {
            // صور خلفية للمميزات (افتراضية)
            const defaultFeatureImages = [
              'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=800', // شحن آمن
              'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800', // أسعار تنافسية
              'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800', // دعم فني
              'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800', // مرونة في الدفع
              'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', // تتبع الشحنة
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'  // منتجات عالية الجودة
            ]
            
            // مفاتيح المميزات
            const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'feature6']
            const featureKey = featureKeys[index]
            
            // جلب البيانات من قاعدة البيانات
            const featureText = getText('features', `${featureKey}_text`) || feature
            const featureImage = getText('features', `${featureKey}_image`) || defaultFeatureImages[index]
            
            return (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl shadow-lg dark:shadow-[var(--color-quaternary-900)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${featureImage})`,
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)]/85 via-[var(--color-secondary)]/70 to-[var(--color-secondary)]/50 group-hover:from-[var(--color-primary)]/85 group-hover:via-[var(--color-primary)]/70 group-hover:to-[var(--color-primary)]/50 transition-all duration-500" />
                
                {/* Content */}
                <div className="relative z-10 p-12 min-h-[280px] flex items-center justify-center">
                  <div className="flex items-center gap-6 w-full">
                    <div className="flex-shrink-0 group-hover:scale-110 transition-all duration-500">
                      <CheckCircle className="w-14 h-14 text-white drop-shadow-lg" strokeWidth={2.5} />
                    </div>
                    <span className="text-white font-bold text-2xl leading-relaxed drop-shadow-lg flex-1">
                      {featureText}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ContentSection>

      {/* Stats Section */}
      <ContentSection variant="primary" centered>
        <Grid cols={4} gap={8}>
          <StatCard
            number={getText('stats', 'countries_number') || '50+'}
            label={getText('stats', 'countries_text') || (locale === 'ar' ? 'دولة نصدر إليها' : 'Countries Exported To')}
            variant="light"
            className="text-[var(--color-quinary)]"
          />
          <StatCard
            number={getText('stats', 'shipments_number') || '1000+'}
            label={getText('stats', 'shipments_text') || (locale === 'ar' ? 'شحنة ناجحة' : 'Successful Shipments')}
            variant="light"
            className="text-[var(--color-quinary)]"
          />
          <StatCard
            number={getText('stats', 'experience_number') || '15+'}
            label={getText('stats', 'experience_text') || (locale === 'ar' ? 'سنوات خبرة' : 'Years Experience')}
            variant="light"
            className="text-[var(--color-quinary)]"
          />
          <StatCard
            number={getText('stats', 'satisfaction_number') || '100%'}
            label={getText('stats', 'satisfaction_text') || (locale === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction')}
            variant="light"
            className="text-[var(--color-quinary)]"
          />
        </Grid>
      </ContentSection>

      {/* CTA Section */}
      <CTASection
        title={getText('cta', 'title') || (locale === 'ar' ? 'ابدأ مشروع التصدير الخاص بك' : 'Start Your Export Project')}
        subtitle={getText('cta', 'subtitle') || (locale === 'ar' ? 'احصل على عرض سعر مخصص وابدأ رحلة التصدير معنا اليوم' : 'Get a custom quote and start your export journey with us today')}
        variant="secondary"
      >
        <Link href={`/${locale}/quote`}>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {getText('cta', 'buttonText') || (locale === 'ar' ? 'اطلب عرض سعر الآن' : 'Request Quote Now')}
            {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </Link>
      </CTASection>
    </div>
  )
}
