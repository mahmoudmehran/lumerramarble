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
import { fetchContentFromAPI, getContent } from '../../../lib/content'
import {
  PageHeader,
  ContentSection,
  FeatureCard,
  StatCard,
  Grid,
  CTASection
} from '../../../components/ui/page-sections'

// إجبار dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ExportPageProps {
  params: Promise<{ locale: string }>
}

export default async function ExportPage({ params }: ExportPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  // جلب المحتوى من API مع fallback للمحتوى الثابت
  let contentData
  try {
    contentData = await fetchContentFromAPI()
  } catch (error) {
    console.error('فشل في جلب المحتوى من API، استخدام المحتوى الافتراضي:', error)
    contentData = getContent()
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

  // دمج المحتوى المحدث مع المحتوى الافتراضي
  const currentContent = exportContent ? {
    hero: {
      title: exportContent.hero?.title || content[locale as keyof typeof content]?.hero?.title || content.en.hero.title,
      subtitle: exportContent.hero?.subtitle || content[locale as keyof typeof content]?.hero?.subtitle || content.en.hero.subtitle,
      cta: exportContent.hero?.cta || content[locale as keyof typeof content]?.hero?.cta || content.en.hero.cta
    },
    services: {
      title: exportContent.services?.title || content[locale as keyof typeof content]?.services?.title || content.en.services.title,
      subtitle: exportContent.services?.subtitle || content[locale as keyof typeof content]?.services?.subtitle || content.en.services.subtitle,
      items: content[locale as keyof typeof content]?.services?.items || content.en.services.items
    },
    process: content[locale as keyof typeof content]?.process || content.en.process,
    countries: {
      title: exportContent.countries?.title || content[locale as keyof typeof content]?.countries?.title || content.en.countries.title,
      subtitle: exportContent.countries?.subtitle || content[locale as keyof typeof content]?.countries?.subtitle || content.en.countries.subtitle,
      regions: content[locale as keyof typeof content]?.countries?.regions || content.en.countries.regions
    },
    features: content[locale as keyof typeof content]?.features || content.en.features,
    cta: {
      title: exportContent.cta?.title || content[locale as keyof typeof content]?.cta?.title || content.en.cta.title,
      subtitle: exportContent.cta?.subtitle || content[locale as keyof typeof content]?.cta?.subtitle || content.en.cta.subtitle,
      button: exportContent.cta?.button || content[locale as keyof typeof content]?.cta?.button || content.en.cta.button
    }
  } : (content[locale as keyof typeof content] || content.en)

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)]">
      {/* Hero Section */}
      <PageHeader
        title={currentContent.hero.title}
        subtitle={currentContent.hero.subtitle}
        image={exportContent?.hero?.backgroundImage || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200"}
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
          <Grid cols={3} gap={8}>
            {currentContent.services.items.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div key={index} className="h-full">
                  <FeatureCard
                    icon={<IconComponent className="w-10 h-10" strokeWidth={2} />}
                    title={service.title}
                    description={service.description}
                  />
                </div>
              )
            })}
          </Grid>
        </div>
      </ContentSection>

      {/* Process Section */}
      <ContentSection
        title={currentContent.process.title}
        subtitle={currentContent.process.subtitle}
        variant="light"
        centered
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.process.steps.map((step, index) => (
              <div 
                key={index} 
                className="relative bg-[var(--color-quinary)] p-6 rounded-2xl shadow-lg border border-[var(--color-quaternary-100)] hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-700)] text-[var(--color-quinary)] rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-[var(--color-secondary-900)] mb-2 break-words">
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-quaternary)] text-sm leading-relaxed break-words">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Connection line for desktop */}
                {index < currentContent.process.steps.length - 1 && index % 3 !== 2 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-transparent z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Countries Section */}
      <ContentSection
        title={currentContent.countries.title}
        subtitle={currentContent.countries.subtitle}
        variant="white"
        centered
      >
        <div className="max-w-6xl mx-auto">
          <Grid cols={3} gap={6}>
            {currentContent.countries.regions.map((region, index) => (
              <div 
                key={index} 
                className="bg-[var(--color-quinary)] p-6 text-center rounded-2xl shadow-lg border border-[var(--color-quaternary-100)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {region.flag}
                </div>
                <h3 className="font-bold text-lg text-[var(--color-secondary-900)] mb-1 break-words">
                  {region.name}
                </h3>
                <p className="text-[var(--color-primary)] font-bold text-base">
                  {region.count}
                </p>
              </div>
            ))}
          </Grid>
        </div>
      </ContentSection>

      {/* Features Section */}
      <ContentSection
        title={currentContent.features.title}
        variant="light"
        centered
      >
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {currentContent.features.items.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 p-5 bg-[var(--color-quinary)] rounded-xl shadow-md border border-[var(--color-quaternary-100)] hover:shadow-lg hover:border-[var(--color-primary-200)] transition-all duration-300"
            >
              <div className="w-9 h-9 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={2.5} />
              </div>
              <span className="text-[var(--color-quaternary)] font-medium text-sm leading-relaxed break-words flex-1">{feature}</span>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Stats Section */}
      <ContentSection variant="primary" centered>
        <Grid cols={4} gap={8}>
          <StatCard
            number="50+"
            label={locale === 'ar' ? 'دولة نصدر إليها' : 'Countries Exported To'}
            variant="light"
          />
          <StatCard
            number="1000+"
            label={locale === 'ar' ? 'شحنة ناجحة' : 'Successful Shipments'}
            variant="light"
          />
          <StatCard
            number="15+"
            label={locale === 'ar' ? 'سنوات خبرة' : 'Years Experience'}
            variant="light"
          />
          <StatCard
            number="100%"
            label={locale === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}
            variant="light"
          />
        </Grid>
      </ContentSection>

      {/* CTA Section */}
      <CTASection
        title={currentContent.cta.title}
        subtitle={currentContent.cta.subtitle}
        variant="secondary"
      >
        <Link href={`/${locale}/quote`}>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {currentContent.cta.button}
            {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </Link>
      </CTASection>
    </div>
  )
}
