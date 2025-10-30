import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, ArrowLeft, Star, Users, Globe, Award } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { getContent } from '../../lib/content'

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
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-800 to-primary-900">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0">
          <Image
            src="/images/hero-marble.jpg"
            alt="Lumerra Marble Hero"
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkv/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {getText('hero', 'title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-quinary-200">
            {getText('hero', 'subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/products`}>
              <Button size="lg" className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {getText('hero', 'primaryButton')}
                {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </Link>
            <Link href={`/${locale}/quote`}>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-2 border-quinary text-quinary bg-quinary/10 hover:bg-quinary hover:text-primary font-bold shadow-lg backdrop-blur-sm group transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {getText('hero', 'secondaryButton')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-tertiary mb-12">
            {getText('stats', 'title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['clients', 'projects', 'countries', 'satisfaction'].map((statKey, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                  {getText('stats', `${statKey}_number`)}
                </div>
                <div className="text-quaternary">
                  {getText('stats', `${statKey}_text`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-quinary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-tertiary mb-4">
              {getText('categories', 'title')}
            </h2>
            <p className="text-xl text-quaternary max-w-2xl mx-auto">
              {getText('categories', 'subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/${locale}${category.href}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-square relative">
                  <Image
                    src={category.image}
                    alt={`${category.key} category`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl mb-2">
                      {category.key}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-tertiary mb-12">
            {getText('features', 'title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="text-center p-6 rounded-lg bg-quinary hover:bg-quinary-100 transition-colors border border-quaternary-100">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-xl text-tertiary mb-2">
                    {getText('features', `${feature.key}_title`)}
                  </h3>
                  <p className="text-quaternary">
                    {getText('features', `${feature.key}_description`)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary to-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-quinary mb-4">
            {getText('cta', 'title')}
          </h2>
          <p className="text-xl text-quinary-200 mb-8 max-w-2xl mx-auto">
            {getText('cta', 'subtitle')}
          </p>
          <Link href={`/${locale}/quote`}>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl bg-quinary text-secondary hover:bg-quinary-100">
              {getText('cta', 'button')}
              {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
