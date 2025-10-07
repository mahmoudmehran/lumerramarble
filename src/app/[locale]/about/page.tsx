import Image from 'next/image'
import { MapPin, Award, Users, Globe, Clock, Shield } from 'lucide-react'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  const content = {
    ar: {
      hero: {
        title: 'عن شركة Lumerra Marble',
        subtitle: 'رحلة من التميز في تصدير الأحجار الطبيعية'
      },
      story: {
        title: 'قصتنا',
        content: `تأسست شركة Lumerra Marble في مصر بهدف أن تكون الجسر الذي يربط بين جمال الأحجار الطبيعية المصرية والأسواق العالمية. 
        منذ تأسيسها قبل أكثر من 15 عامًا، نجحت الشركة في بناء سمعة متميزة في مجال تصدير الرخام والجرانيت والكوارتز عالي الجودة.
        
        نحن لا نقوم بتصدير الأحجار فحسب، بل نصدر قطعًا من الفن المصري الأصيل الذي يحمل في طياته تاريخ وحضارة آلاف السنين. 
        كل قطعة رخام أو جرانيت نقوم بتصديرها تحكي قصة الأرض المصرية الغنية بالكنوز الطبيعية.`
      },
      mission: {
        title: 'رؤيتنا ورسالتنا',
        vision: 'أن نكون الشركة الرائدة عالميًا في تصدير الأحجار الطبيعية المصرية عالية الجودة',
        mission: 'نسعى لتقديم أفضل المنتجات والخدمات لعملائنا حول العالم مع الحفاظ على أعلى معايير الجودة والاستدامة'
      },
      values: {
        title: 'قيمنا',
        items: [
          {
            icon: Award,
            title: 'الجودة',
            description: 'نلتزم بأعلى معايير الجودة في جميع منتجاتنا وخدماتنا'
          },
          {
            icon: Shield,
            title: 'الثقة',
            description: 'نبني علاقات طويلة المدى مع عملائنا القائمة على الثقة المتبادلة'
          },
          {
            icon: Globe,
            title: 'التميز العالمي',
            description: 'نسعى للتميز في الأسواق العالمية وتمثيل مصر بأفضل صورة'
          },
          {
            icon: Users,
            title: 'العمل الجماعي',
            description: 'نؤمن بقوة الفريق الواحد في تحقيق النجاح'
          }
        ]
      },
      location: {
        title: 'موقعنا',
        address: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
        description: 'يقع مقرنا الرئيسي ومصانعنا في المنطقة الصناعية شق الثعبان بالقاهرة، في موقع استراتيجي يسهل عمليات التصدير والشحن'
      },
      stats: {
        title: 'إنجازاتنا بالأرقام',
        items: [
          { number: '15+', label: 'سنوات من الخبرة', icon: Clock },
          { number: '50+', label: 'دولة نصدر إليها', icon: Globe },
          { number: '1000+', label: 'مشروع منجز', icon: Award },
          { number: '100%', label: 'رضا العملاء', icon: Users }
        ]
      }
    },
    en: {
      hero: {
        title: 'About Lumerra Marble',
        subtitle: 'A Journey of Excellence in Natural Stone Export'
      },
      story: {
        title: 'Our Story',
        content: `Lumerra Marble was founded in Egypt with the vision of becoming the bridge that connects the beauty of Egyptian natural stones with global markets. 
        Since its establishment over 15 years ago, the company has successfully built an outstanding reputation in exporting high-quality marble, granite, and quartz.
        
        We don't just export stones; we export pieces of authentic Egyptian art that carry within them the history and civilization of thousands of years. 
        Every piece of marble or granite we export tells the story of the Egyptian land rich with natural treasures.`
      },
      mission: {
        title: 'Our Vision & Mission',
        vision: 'To be the world-leading company in exporting high-quality Egyptian natural stones',
        mission: 'We strive to provide the best products and services to our customers worldwide while maintaining the highest standards of quality and sustainability'
      },
      values: {
        title: 'Our Values',
        items: [
          {
            icon: Award,
            title: 'Quality',
            description: 'We commit to the highest quality standards in all our products and services'
          },
          {
            icon: Shield,
            title: 'Trust',
            description: 'We build long-term relationships with our customers based on mutual trust'
          },
          {
            icon: Globe,
            title: 'Global Excellence',
            description: 'We strive for excellence in global markets and represent Egypt in the best way'
          },
          {
            icon: Users,
            title: 'Teamwork',
            description: 'We believe in the power of one team in achieving success'
          }
        ]
      },
      location: {
        title: 'Our Location',
        address: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
        description: 'Our headquarters and factories are located in Shaq Al-Thuban Industrial Zone in Cairo, in a strategic location that facilitates export and shipping operations'
      },
      stats: {
        title: 'Our Achievements in Numbers',
        items: [
          { number: '15+', label: 'Years of Experience', icon: Clock },
          { number: '50+', label: 'Countries Exported To', icon: Globe },
          { number: '1000+', label: 'Completed Projects', icon: Award },
          { number: '100%', label: 'Customer Satisfaction', icon: Users }
        ]
      }
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-900 to-secondary-800">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="About Lumerra Marble"
            fill
            className="object-cover opacity-20"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {currentContent.hero.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            {currentContent.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                {currentContent.story.title}
              </h2>
              <div className="text-lg text-secondary-700 leading-relaxed space-y-4">
                {currentContent.story.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/factory.jpg"
                alt="Lumerra Marble Factory"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-secondary-900 mb-12">
            {currentContent.mission.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-primary-600 mb-4">
                {locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}
              </h3>
              <p className="text-secondary-700 text-lg">
                {currentContent.mission.vision}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-primary-600 mb-4">
                {locale === 'ar' ? 'رسالتنا' : 'Our Mission'}
              </h3>
              <p className="text-secondary-700 text-lg">
                {currentContent.mission.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-secondary-900 mb-12">
            {currentContent.values.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.values.items.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-secondary-600">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                {currentContent.location.title}
              </h2>
              <div className="flex items-start space-x-3 rtl:space-x-reverse mb-4">
                <MapPin className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-secondary-900">
                    {currentContent.location.address}
                  </p>
                </div>
              </div>
              <p className="text-lg text-secondary-700 leading-relaxed">
                {currentContent.location.description}
              </p>
            </div>
            <div className="relative">
              {/* Map placeholder - replace with actual map component */}
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {locale === 'ar' ? 'خريطة الموقع' : 'Location Map'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <a 
                      href="https://maps.app.goo.gl/4to6WUKDMY7KEjRVA" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {locale === 'ar' ? 'عرض في خرائط Google' : 'View on Google Maps'}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {currentContent.stats.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {currentContent.stats.items.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                  <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-secondary-300">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
