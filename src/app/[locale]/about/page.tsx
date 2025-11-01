import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Award, Users, Globe, Clock, Shield, Target, Eye, Heart, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { fetchContentFromAPI, getContent } from '../../../lib/content'
import { Button } from '../../../components/ui/button'
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

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
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
  const aboutContent = contentData[locale as keyof typeof contentData]?.about

  const content = {
    ar: {
      hero: {
        title: 'عن شركة لوميرا ماربل',
        subtitle: 'رحلة من التميز في تصدير الأحجار الطبيعية'
      },
      story: {
        title: 'قصتنا',
        content: `تأسست شركة لوميرا ماربل في مصر بهدف أن تكون الجسر الذي يربط بين جمال الأحجار الطبيعية المصرية والأسواق العالمية. 
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
            title: 'الجودة العالية',
            description: 'نلتزم بأعلى معايير الجودة العالمية في جميع منتجاتنا'
          },
          {
            icon: Shield,
            title: 'الثقة والمصداقية',
            description: 'نبني علاقات طويلة الأمد مع عملائنا على أساس الثقة'
          },
          {
            icon: Globe,
            title: 'الانتشار العالمي',
            description: 'نخدم عملاء في أكثر من 50 دولة حول العالم'
          },
          {
            icon: Users,
            title: 'خدمة العملاء',
            description: 'فريق محترف متاح دائماً لخدمتكم'
          },
          {
            icon: Target,
            title: 'الدقة والالتزام',
            description: 'التزام تام بالمواعيد والمواصفات المتفق عليها'
          },
          {
            icon: Heart,
            title: 'الشغف بالتميز',
            description: 'شغف حقيقي بتقديم أفضل الأحجار الطبيعية'
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
            title: 'High Quality',
            description: 'We commit to the highest international quality standards'
          },
          {
            icon: Shield,
            title: 'Trust & Credibility',
            description: 'Building long-term relationships based on trust'
          },
          {
            icon: Globe,
            title: 'Global Reach',
            description: 'Serving customers in over 50 countries worldwide'
          },
          {
            icon: Users,
            title: 'Customer Service',
            description: 'Professional team always available to serve you'
          },
          {
            icon: Target,
            title: 'Precision & Commitment',
            description: 'Full commitment to deadlines and agreed specifications'
          },
          {
            icon: Heart,
            title: 'Passion for Excellence',
            description: 'Genuine passion for delivering the finest natural stones'
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

  // دمج المحتوى المحدث مع المحتوى الافتراضي
  const currentContent = aboutContent ? {
    hero: {
      title: aboutContent.hero?.title || content[locale as keyof typeof content]?.hero?.title || content.en.hero.title,
      subtitle: aboutContent.hero?.description || content[locale as keyof typeof content]?.hero?.subtitle || content.en.hero.subtitle
    },
    story: {
      title: content[locale as keyof typeof content]?.story?.title || content.en.story.title,
      content: content[locale as keyof typeof content]?.story?.content || content.en.story.content
    },
    mission: {
      title: aboutContent.mission?.title || content[locale as keyof typeof content]?.mission?.title || content.en.mission.title,
      vision: aboutContent.mission?.vision || content[locale as keyof typeof content]?.mission?.vision || content.en.mission.vision,
      mission: aboutContent.mission?.mission || content[locale as keyof typeof content]?.mission?.mission || content.en.mission.mission
    },
    values: content[locale as keyof typeof content]?.values || content.en.values,
    location: {
      title: aboutContent.location?.title || content[locale as keyof typeof content]?.location?.title || content.en.location.title,
      address: aboutContent.location?.address || content[locale as keyof typeof content]?.location?.address || content.en.location.address,
      description: aboutContent.location?.description || content[locale as keyof typeof content]?.location?.description || content.en.location.description
    },
    stats: {
      title: aboutContent.stats?.title || content[locale as keyof typeof content]?.stats?.title || content.en.stats.title,
      items: aboutContent.stats?.items?.map((item: { number?: string; text?: string }, index: number) => ({
        ...item,
        icon: content[locale as keyof typeof content]?.stats?.items?.[index]?.icon || content.en.stats.items[index]?.icon
      })) || content[locale as keyof typeof content]?.stats?.items || content.en.stats.items
    }
  } : (content[locale as keyof typeof content] || content.en)

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)]">
      {/* Hero Section */}
      <PageHeader
        title={currentContent.hero.title}
        subtitle={currentContent.hero.subtitle}
        image={aboutContent?.hero?.backgroundImage || "/images/about-hero.jpg"}
      />

      {/* Story Section */}
      <ContentSection variant="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary-900)] mb-6">
              {currentContent.story.title}
            </h2>
            <div className="text-lg text-[var(--color-quaternary)] leading-relaxed space-y-4">
              {currentContent.story.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-base md:text-lg">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={aboutContent?.mission?.image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800"}
                alt="Lumerra Marble Factory"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-[var(--color-primary)] opacity-20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--color-secondary)] opacity-20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* Mission & Vision */}
      <ContentSection variant="light" title={currentContent.mission.title}>
        <Grid cols={2} gap={8}>
          <div className="bg-[var(--color-quinary)] p-8 rounded-2xl shadow-lg border border-[var(--color-quaternary-100)] hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-secondary-900)]">
                {locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}
              </h3>
            </div>
            <p className="text-[var(--color-quaternary)] text-lg leading-relaxed">
              {currentContent.mission.vision}
            </p>
          </div>
          <div className="bg-[var(--color-quinary)] p-8 rounded-2xl shadow-lg border border-[var(--color-quaternary-100)] hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--color-secondary-100)] rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-[var(--color-secondary)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-secondary-900)]">
                {locale === 'ar' ? 'رسالتنا' : 'Our Mission'}
              </h3>
            </div>
            <p className="text-[var(--color-quaternary)] text-lg leading-relaxed">
              {currentContent.mission.mission}
            </p>
          </div>
        </Grid>
      </ContentSection>

      {/* Values Section */}
      <ContentSection variant="white" title={currentContent.values.title} centered>
        <Grid cols={3} gap={8}>
          {currentContent.values.items.map((value, index) => {
            const IconComponent = value.icon
            return (
              <FeatureCard
                key={index}
                icon={<IconComponent className="w-10 h-10" strokeWidth={2} />}
                title={value.title}
                description={value.description}
              />
            )
          })}
        </Grid>
      </ContentSection>

      {/* Stats Section */}
      <ContentSection variant="primary" title={currentContent.stats.title} centered>
        <Grid cols={4} gap={8}>
          {currentContent.stats.items.map((stat: { icon: React.ComponentType<{ className: string }>; number: string; text: string; label?: string }, index: number) => (
            <StatCard
              key={index}
              number={stat.number}
              label={stat.label || stat.text}
              variant="light"
            />
          ))}
        </Grid>
      </ContentSection>

      {/* Location Section */}
      <ContentSection variant="light" title={currentContent.location.title}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-start gap-4 mb-6 p-6 bg-[var(--color-quinary)] rounded-xl shadow-md border border-[var(--color-quaternary-100)]">
              <div className="w-12 h-12 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-secondary-900)] mb-2">
                  {locale === 'ar' ? 'العنوان' : 'Address'}
                </h3>
                <p className="text-[var(--color-quaternary)]">
                  {currentContent.location.address}
                </p>
              </div>
            </div>
            <p className="text-lg text-[var(--color-quaternary)] leading-relaxed">
              {currentContent.location.description}
            </p>
            <div className="mt-6">
              <a 
                href="https://maps.app.goo.gl/4to6WUKDMY7KEjRVA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-700)] font-semibold transition-colors"
              >
                <Globe className="w-5 h-5" />
                {locale === 'ar' ? 'عرض في خرائط Google' : 'View on Google Maps'}
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              {aboutContent?.location?.image ? (
                <Image
                  src={aboutContent.location.image}
                  alt="Our Location"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-secondary-100)] flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-[var(--color-primary)] mx-auto mb-4" />
                    <p className="text-[var(--color-quaternary)] font-medium">
                      {locale === 'ar' ? 'موقعنا على الخريطة' : 'Our Location on Map'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <CTASection
        title={locale === 'ar' ? 'هل أنت مستعد للعمل معنا؟' : 'Ready to Work With Us?'}
        subtitle={locale === 'ar' ? 'احصل على عرض سعر مخصص لمشروعك اليوم' : 'Get a custom quote for your project today'}
        variant="secondary"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/quote`}>
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {locale === 'ar' ? 'طلب عرض سعر' : 'Request Quote'}
              {isRTL ? <ArrowLeft className="ml-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </Link>
          <Link href={`/${locale}/contact`}>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3 border-2 border-[var(--color-quinary)] text-[var(--color-quinary)] bg-transparent hover:bg-[var(--color-quinary)] hover:text-[var(--color-secondary)] group transition-all duration-300 hover:scale-105"
            >
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Button>
          </Link>
        </div>
      </CTASection>
    </div>
  )
}
