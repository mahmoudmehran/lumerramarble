import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Star, Users, Globe, Award } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { fetchContentFromAPI } from '../../lib/content'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

// تعطيل الكاش للصفحة عشان تجيب المحتوى المحدث دايماً
export const revalidate = 0

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  // جلب المحتوى المحدث من API
  const contentData = await fetchContentFromAPI()
  const currentContent = contentData[locale as keyof typeof contentData] || contentData.en

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0">
          <Image
            src="/images/hero-marble.jpg"
            alt="Lumerra Marble Hero"
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {currentContent.homepage.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
            {currentContent.homepage.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/products`}>
              <Button size="lg" className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {currentContent.homepage.hero.primaryButton}
                {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </Link>
            <Link href={`/${locale}/quote`}>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-2 border-white text-white bg-white/10 hover:bg-white hover:text-secondary-900 font-bold shadow-lg backdrop-blur-sm group transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {currentContent.homepage.hero.secondaryButton}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-secondary-900 mb-12">
            {locale === 'ar' ? 'أرقام تتحدث عن التميز' : 'Numbers That Speak Excellence'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {currentContent.homepage.stats.map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary-600">{stat.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {locale === 'ar' ? 'تصفح منتجاتنا' : 'Browse Our Products'}
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              {locale === 'ar' ? 'اكتشف مجموعتنا الواسعة من الأحجار الطبيعية عالية الجودة' : 'Discover our extensive collection of premium natural stones'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.products.categories.map((category: any, index: number) => (
              <Link
                key={index}
                href={`/${locale}/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-square relative">
                  <Image
                    src={`/images/${category.id}-category.jpg`}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl mb-2">
                      {category.name}
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-secondary-900 mb-12">
            {locale === 'ar' ? 'لماذا تختار Lumerra Marble؟' : 'Why Choose Lumerra Marble?'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.homepage.features.map((feature: any, index: number) => {
              const icons = [Award, Globe, Users, Star]
              const IconComponent = icons[index] || Award
              return (
                <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-xl text-secondary-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {locale === 'ar' ? 'مستعد لبدء مشروعك؟' : 'Ready to Start Your Project?'}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {locale === 'ar' ? 'احصل على عرض سعر مخصص لمشروعك اليوم' : 'Get a custom quote for your project today'}
          </p>
          <Link href={`/${locale}/quote`}>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {locale === 'ar' ? 'طلب عرض سعر الآن' : 'Request Quote Now'}
              {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}