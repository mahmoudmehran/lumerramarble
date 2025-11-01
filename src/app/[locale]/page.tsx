import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { ArrowRight, ArrowLeft, Star, Users, Globe, Award } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { getContent } from '../../lib/content'
import {
  HeroSection,
  ContentSection,
  FeatureCard,
  StatCard,
  Grid,
  CTASection
} from '../../components/ui/page-sections'

interface HomePageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lumerramarble.com'
  
  const titles = {
    ar: 'لوميرا ماربل - تصدير الرخام والجرانيت الفاخر من مصر',
    en: 'Lumerra Marble - Premium Marble & Granite Export from Egypt',
    es: 'Lumerra Marble - Exportación Premium de Mármol y Granito desde Egipto',
    fr: 'Lumerra Marble - Export Premium de Marbre et Granit d\'Égypte'
  }
  
  const descriptions = {
    ar: 'شركة رائدة في تصدير أفخم أنواع الرخام والجرانيت والكوارتز الطبيعي من مصر للعالم. جودة عالية وأسعار تنافسية.',
    en: 'Leading company in exporting premium natural marble, granite and quartz from Egypt worldwide. High quality and competitive prices.',
    es: 'Empresa líder en exportación de mármol, granito y cuarzo natural premium desde Egipto. Alta calidad y precios competitivos.',
    fr: 'Entreprise leader dans l\'exportation de marbre, granit et quartz naturel premium d\'Égypte. Haute qualité et prix compétitifs.'
  }
  
  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ar: `${baseUrl}/ar`,
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        fr: `${baseUrl}/fr`,
      },
    },
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: `${baseUrl}/${locale}`,
      siteName: 'Lumerra Marble',
      locale: locale,
      type: 'website',
    },
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'
  
  // جلب المحتوى من قاعدة البيانات
  const content = await getContent('homepage')
  
  // دالة للحصول على النص بلغة محددة
  const getText = (sectionKey: string, contentKey: string) => {
    return content[sectionKey]?.[contentKey]?.[locale as keyof typeof content[string][string]] || ''
  }
  
  // بيانات الفئات
  const categoriesData = {
    marble: { ar: 'رخام', en: 'Marble', es: 'Mármol', fr: 'Marbre' },
    granite: { ar: 'جرانيت', en: 'Granite', es: 'Granito', fr: 'Granit' },
    quartz: { ar: 'كوارتز', en: 'Quartz', es: 'Cuarzo', fr: 'Quartz' },
    special: { ar: 'أحجار خاصة', en: 'Special Stones', es: 'Piedras Especiales', fr: 'Pierres Spéciales' }
  }
  
  const categories = [
    { 
      key: 'marble',
      href: '/products?category=marble',
      image: '/images/marble-category.jpg'
    },
    {
      key: 'granite', 
      href: '/products?category=granite',
      image: '/images/granite-category.jpg'
    },
    {
      key: 'quartz',
      href: '/products?category=quartz', 
      image: '/images/quartz-category.jpg'
    },
    {
      key: 'special',
      href: '/products?category=special',
      image: '/images/special-category.jpg'
    }
  ]
  
  // بيانات المميزات مع الأيقونات
  const features = [
    { icon: Award, key: 'quality' },
    { icon: Globe, key: 'global' },
    { icon: Users, key: 'service' },
    { icon: Star, key: 'experience' }
  ]

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={getText('hero', 'title')}
        subtitle={getText('hero', 'subtitle')}
        image="/images/hero-marble.jpg"
        gradient="primary"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/products`}>
            <Button size="lg" className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {getText('hero', 'primaryButton')}
              {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </Link>
          <Link href={`/${locale}/quote`}>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-2 border-[var(--color-quinary)] text-[var(--color-quinary)] bg-[var(--color-quinary)]/10 hover:bg-[var(--color-quinary)] hover:text-[var(--color-primary)] font-bold shadow-lg backdrop-blur-sm group transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {getText('hero', 'secondaryButton')}
            </Button>
          </Link>
        </div>
      </HeroSection>

      {/* Stats Section */}
      <ContentSection
        title={getText('stats', 'title')}
        variant="white"
        centered
      >
        <div className="max-w-3xl mx-auto px-12">
          <Grid cols={4} gap={8}>
            {['clients', 'projects', 'countries', 'satisfaction'].map((statKey, index) => (
              <StatCard
                key={index}
                number={getText('stats', `${statKey}_number`)}
                label={getText('stats', `${statKey}_text`)}
                variant="light"
              />
            ))}
          </Grid>
        </div>
      </ContentSection>

      {/* Categories Section */}
      <ContentSection
        title={getText('categories', 'title')}
        subtitle={getText('categories', 'subtitle')}
        variant="light"
        centered
      >
        <div className="max-w-4xl mx-auto px-12">
          <Grid cols={4} gap={8}>
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/${locale}${category.href}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-square relative">
                  <Image
                    src={category.image}
                    alt={`${categoriesData[category.key as keyof typeof categoriesData][locale as keyof typeof categoriesData.marble]} category`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-[var(--color-quinary)] font-bold text-xl mb-2">
                      {categoriesData[category.key as keyof typeof categoriesData][locale as keyof typeof categoriesData.marble]}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </Grid>
        </div>
      </ContentSection>

      {/* Features Section */}
      <ContentSection
        title={getText('features', 'title')}
        variant="white"
        centered
      >
        <div className="max-w-4xl mx-auto px-12">
          <Grid cols={4} gap={8}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <FeatureCard
                  key={index}
                  icon={<IconComponent className="w-10 h-10 flex-shrink-0" strokeWidth={2} />}
                  title={getText('features', `${feature.key}_title`)}
                  description={getText('features', `${feature.key}_description`)}
                />
              )
            })}
          </Grid>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <CTASection
        title={getText('cta', 'title')}
        subtitle={getText('cta', 'subtitle')}
        variant="secondary"
      >
        <Link href={`/${locale}/quote`}>
          <Button 
            variant="secondary" 
            size="lg" 
            className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl bg-[var(--color-quinary)] text-[var(--color-secondary)] hover:bg-[var(--color-quinary-100)]"
          >
            {getText('cta', 'button')}
            {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </Link>
      </CTASection>
    </div>
  )
}
