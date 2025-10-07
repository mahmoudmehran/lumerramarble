'use client'

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
  Award
} from 'lucide-react'
import { Button } from 'bklumerra/components/ui/button'
import { Card } from 'bklumerra/components/ui/card'

interface ExportPageProps {
  params: Promise<{ locale: string }>
}

export default async function ExportPage({ params }: ExportPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

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
          'ضمان استبدال في حالة التلف'
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
          'Replacement guarantee in case of damage'
        ]
      },
      cta: {
        title: 'Start Your Export Project',
        subtitle: 'Get a custom quote and start your export journey with us today',
        button: 'Request Quote Now'
      }
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {currentContent.hero.title}
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                {currentContent.hero.subtitle}
              </p>
              <Link href={`/${locale}/contact`}>
                <Button variant="secondary" size="lg" className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  {currentContent.hero.cta}
                  {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/images/export-hero.jpg"
                  alt="Export Services"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {currentContent.services.title}
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {currentContent.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.services.items.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-xl text-secondary-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-secondary-600">
                    {service.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {currentContent.process.title}
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {currentContent.process.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.process.steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-secondary-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-secondary-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
                {index < currentContent.process.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 -right-4 w-8 h-0.5 bg-primary-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {currentContent.countries.title}
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {currentContent.countries.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentContent.countries.regions.map((region, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{region.flag}</div>
                <h3 className="font-bold text-lg text-secondary-900 mb-2">
                  {region.name}
                </h3>
                <p className="text-primary-600 font-semibold">
                  {region.count}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {currentContent.features.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {currentContent.features.items.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span className="text-secondary-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-900 to-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {currentContent.cta.title}
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {currentContent.cta.subtitle}
          </p>
          <Link href={`/${locale}/contact`}>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {currentContent.cta.button}
              {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
