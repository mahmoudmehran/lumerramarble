import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Award, Users, Globe, Clock, Shield, Target, Eye, Heart, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { getContent } from '../../../lib/content'
import { getSiteSettings } from '../../../lib/settings'
import { Button } from '../../../components/ui/button'
import {
  PageHeader,
  ContentSection,
  FeatureCard,
  StatCard,
  Grid,
  CTASection
} from '../../../components/ui/page-sections'

// ✅ Enable ISR with hourly revalidation
export const revalidate = 3600 // Revalidate every hour

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  // جلب المحتوى من قاعدة البيانات
  const contentData = await getContent('about')
  const siteSettings = await getSiteSettings()

  // دالة للحصول على النص بلغة محددة
  const getText = (sectionKey: string, contentKey: string) => {
    return contentData[sectionKey]?.[contentKey]?.[locale as keyof typeof contentData[string][string]] || ''
  }

  // بيانات القيم من قاعدة البيانات
  const valuesItems = [
    {
      icon: Eye,
      title: getText('values', 'vision_title') || 'Our Vision',
      description: getText('values', 'vision_description') || 'To be the leading company globally in exporting high-quality Egyptian natural stones'
    },
    {
      icon: Target,
      title: getText('values', 'mission_title') || 'Our Mission',
      description: getText('values', 'mission_description') || 'We strive to provide the best products and services to our customers around the world'
    },
    {
      icon: Award,
      title: getText('values', 'quality_title') || 'High Quality',
      description: getText('values', 'quality_description') || 'We commit to the highest international quality standards'
    },
    {
      icon: Shield,
      title: getText('values', 'trust_title') || 'Trust & Credibility',
      description: getText('values', 'trust_description') || 'Building long-term relationships based on trust'
    },
    {
      icon: Globe,
      title: getText('values', 'global_title') || 'Global Reach',
      description: getText('values', 'global_description') || 'Serving customers in over 50 countries worldwide'
    },
    {
      icon: Users,
      title: getText('values', 'service_title') || 'Customer Service',
      description: getText('values', 'service_description') || 'Professional team always available to serve you'
    },
    {
      icon: Target,
      title: getText('values', 'precision_title') || 'Precision & Commitment',
      description: getText('values', 'precision_description') || 'Full commitment to deadlines and agreed specifications'
    },
    {
      icon: Heart,
      title: getText('values', 'passion_title') || 'Passion for Excellence',
      description: getText('values', 'passion_description') || 'Genuine passion for delivering the finest natural stones'
    }
  ]

  // بيانات الإحصائيات من قاعدة البيانات
  const statsItems = [
    { 
      number: getText('stats', 'experience_number') || '15+',
      label: getText('stats', 'experience_text') || 'Years of Experience',
      icon: Clock 
    },
    { 
      number: getText('stats', 'countries_number') || '50+',
      label: getText('stats', 'countries_text') || 'Countries Exported To',
      icon: Globe 
    },
    { 
      number: getText('stats', 'projects_number') || '1000+',
      label: getText('stats', 'projects_text') || 'Completed Projects',
      icon: Award 
    },
    { 
      number: getText('stats', 'satisfaction_number') || '100%',
      label: getText('stats', 'satisfaction_text') || 'Customer Satisfaction',
      icon: Users 
    }
  ]

  // استخدام المحتوى من قاعدة البيانات
  const currentContent = {
    hero: {
      title: getText('hero', 'title') || 'About Us',
      subtitle: getText('hero', 'subtitle') || 'A Journey of Excellence'
    },
    story: {
      title: getText('story', 'title') || 'Our Story',
      content: getText('story', 'content') || 'Company story content'
    },
    values: {
      title: getText('values', 'title') || 'Our Values',
      items: valuesItems
    },
    location: {
      title: getText('location', 'title') || 'Our Location',
      address: getText('location', 'address') || 'Egypt - Cairo',
      description: getText('location', 'description') || 'Our headquarters location'
    },
    stats: {
      title: getText('stats', 'title') || 'Our Achievements in Numbers',
      items: statsItems
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)]">
      {/* Hero Section */}
      <PageHeader
        title={currentContent.hero.title}
        subtitle={currentContent.hero.subtitle}
        image={getText('hero', 'backgroundImage') || "/images/about-hero.jpg"}
      />

      {/* Story Section */}
      <ContentSection variant="white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary-900)] mb-6">
                {currentContent.story.title}
              </h2>
              <div className="text-[var(--color-quaternary)] leading-relaxed space-y-4">
                {currentContent.story.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-base md:text-lg break-words">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={getText('story', 'image') || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800"}
                  alt="Lumerra Marble Factory"
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                {/* Decorative element */}
                <div className="absolute -top-4 -right-4 w-24 h-24 md:w-32 md:h-32 bg-[var(--color-primary)] opacity-20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 md:w-32 md:h-32 bg-[var(--color-secondary)] opacity-20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* Values, Mission & Vision Section with Background Image */}
      <div className="relative bg-[var(--color-quinary-50)] py-16 md:py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getText('values', 'backgroundImage') || "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1600"}
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-quinary-50)]/80 to-[var(--color-quinary-50)]/75"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary-900)] mb-4">
              {currentContent.values.title}
            </h2>
          </div>

          {/* All Cards in 2 Rows x 4 Columns Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Values Cards */}
              {valuesItems.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div key={index} className="bg-gradient-to-br from-[var(--color-primary-100)] via-[var(--color-secondary-50)] to-[var(--color-tertiary-50)] backdrop-blur-sm p-10 rounded-2xl shadow-lg border border-[var(--color-quaternary-200)] hover:shadow-xl hover:from-[var(--color-secondary-100)] hover:via-[var(--color-primary-100)] hover:to-[var(--color-quinary)] transition-all duration-300">
                    <div className="flex flex-col items-center text-center h-full">
                      <IconComponent className="w-16 h-16 text-[var(--color-primary)] mb-6 flex-shrink-0" strokeWidth={1.5} />
                      <h3 className="text-2xl font-bold text-[var(--color-secondary-900)] mb-5">
                        {value.title}
                      </h3>
                      <p className="text-[var(--color-quaternary)] text-base leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <ContentSection variant="primary" title={currentContent.stats.title} centered>
        <Grid cols={4} gap={8}>
          {currentContent.stats.items.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              label={stat.label}
              variant="light"
            />
          ))}
        </Grid>
      </ContentSection>

      {/* Location Section */}
      <ContentSection variant="light">
        {/* Title in the middle of the page */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-secondary-900)] mb-4">
            {currentContent.location.title}
          </h2>
          <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Location Info Container - Clickable with Map Background */}
            <a 
              href={siteSettings?.googleMapsLink || "https://maps.app.goo.gl/4to6WUKDMY7KEjRVA"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative block overflow-hidden p-10 rounded-2xl shadow-2xl border-2 border-[var(--color-primary-200)] hover:shadow-3xl hover:border-[var(--color-primary)] transition-all duration-300 min-h-[400px] group cursor-pointer"
            >
              {/* Background Map Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={getText('location', 'backgroundImage') || "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+f74e4e(31.2357,30.0444)/31.2357,30.0444,12,0/800x600@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"}
                  alt="Map Location"
                  fill
                  className="object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-quinary)]/95 to-[var(--color-primary-50)]/90"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Click to View Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 text-[var(--color-primary)] font-bold text-lg">
                    <Globe className="w-6 h-6" />
                    <span className="border-b-2 border-[var(--color-primary)] pb-1 group-hover:border-[var(--color-primary-700)] transition-colors">
                      {locale === 'ar' ? 'اضغط لعرض موقعنا على الخريطة' : 'Click to View Our Location on Map'}
                    </span>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
                    <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-3 uppercase tracking-wide">
                      {locale === 'ar' ? 'العنوان' : 'Address'}
                    </h4>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-[var(--color-secondary-900)] whitespace-pre-line">
                        {currentContent.location.address}
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
                    <p className="text-[var(--color-quaternary)] text-base leading-relaxed">
                      {currentContent.location.description}
                    </p>
                  </div>
                </div>
              </div>
            </a>

            {/* Map/Image Container */}
            <div className="relative min-h-[400px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[var(--color-primary-200)]">
              <Image
                src={getText('location', 'image') || "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800"}
                alt="Our Location"
                fill
                className="object-cover"
              />
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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
