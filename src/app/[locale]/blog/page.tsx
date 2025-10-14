'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight, ArrowLeft, Clock } from 'lucide-react'
import { Button } from 'bkalhot/components/ui/button'
import { Card } from 'bkalhot/components/ui/card'

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  const content = {
    ar: {
      title: 'المدونة',
      subtitle: 'آخر الأخبار والمقالات حول صناعة الرخام والجرانيت',
      readMore: 'اقرأ المزيد',
      author: 'كتب بواسطة',
      date: 'التاريخ',
      categories: {
        all: 'جميع المقالات',
        industry: 'صناعة الأحجار',
        tips: 'نصائح وإرشادات',
        projects: 'مشاريعنا',
        news: 'أخبار الشركة'
      },
      featured: 'مقال مميز',
      recent: 'المقالات الحديثة'
    },
    en: {
      title: 'Blog',
      subtitle: 'Latest news and articles about marble and granite industry',
      readMore: 'Read More',
      author: 'Written by',
      date: 'Date',
      categories: {
        all: 'All Articles',
        industry: 'Stone Industry',
        tips: 'Tips & Guides',
        projects: 'Our Projects',
        news: 'Company News'
      },
      featured: 'Featured Article',
      recent: 'Recent Articles'
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  // Sample blog data
  const blogPosts = [
    {
      id: 1,
      title: {
        ar: 'أحدث اتجاهات تصميم الرخام في 2024',
        en: 'Latest Marble Design Trends in 2024'
      },
      excerpt: {
        ar: 'اكتشف أحدث الاتجاهات في تصميم الرخام والطرق المبتكرة لاستخدامه في التصميم الداخلي والمعماري',
        en: 'Discover the latest trends in marble design and innovative ways to use it in interior and architectural design'
      },
      image: '/images/blog-1.jpg',
      author: 'Lumerra Team',
      date: '2024-01-15',
      category: 'tips',
      featured: true
    },
    {
      id: 2,
      title: {
        ar: 'كيفية اختيار النوع المناسب من الجرانيت لمطبخك',
        en: 'How to Choose the Right Granite Type for Your Kitchen'
      },
      excerpt: {
        ar: 'دليل شامل لاختيار أفضل أنواع الجرانيت المناسبة للمطابخ مع نصائح للعناية والصيانة',
        en: 'Complete guide to choosing the best granite types for kitchens with care and maintenance tips'
      },
      image: '/images/blog-2.jpg',
      author: 'Ahmed Hassan',
      date: '2024-01-10',
      category: 'tips'
    },
    {
      id: 3,
      title: {
        ar: 'مشروع فندق الفخامة: استخدام الرخام المصري الفاخر',
        en: 'Luxury Hotel Project: Using Premium Egyptian Marble'
      },
      excerpt: {
        ar: 'شاهد كيف تم استخدام الرخام المصري الفاخر في تصميم وإنشاء أحد أرقى الفنادق العالمية',
        en: 'See how premium Egyptian marble was used in designing and building one of the world\'s finest hotels'
      },
      image: '/images/blog-3.jpg',
      author: 'Sarah Mohamed',
      date: '2024-01-05',
      category: 'projects'
    },
    {
      id: 4,
      title: {
        ar: 'صناعة الأحجار الطبيعية في مصر: تاريخ وحاضر',
        en: 'Natural Stone Industry in Egypt: History and Present'
      },
      excerpt: {
        ar: 'نظرة شاملة على تاريخ صناعة الأحجار الطبيعية في مصر وتطورها حتى الوقت الحالي',
        en: 'Comprehensive look at the history of natural stone industry in Egypt and its development to the present'
      },
      image: '/images/blog-4.jpg',
      author: 'Mohamed Ali',
      date: '2023-12-28',
      category: 'industry'
    },
    {
      id: 5,
      title: {
        ar: 'نصائح للعناية والحفاظ على الرخام الطبيعي',
        en: 'Tips for Caring and Maintaining Natural Marble'
      },
      excerpt: {
        ar: 'تعلم أفضل الطرق للعناية بالرخام الطبيعي والحفاظ على جماله ولمعانه لسنوات طويلة',
        en: 'Learn the best ways to care for natural marble and maintain its beauty and shine for years'
      },
      image: '/images/blog-5.jpg',
      author: 'Fatima Ahmed',
      date: '2023-12-20',
      category: 'tips'
    },
    {
      id: 6,
      title: {
        ar: 'Lumerra Marble تحصل على شهادة الجودة الدولية ISO',
        en: 'Lumerra Marble Receives International ISO Quality Certificate'
      },
      excerpt: {
        ar: 'نفخر بالإعلان عن حصول شركتنا على شهادة الجودة الدولية ISO، مما يؤكد التزامنا بأعلى معايير الجودة',
        en: 'We are proud to announce that our company has received the international ISO quality certificate, confirming our commitment to the highest quality standards'
      },
      image: '/images/blog-6.jpg',
      author: 'Lumerra Team',
      date: '2023-12-15',
      category: 'news'
    }
  ]

  const featuredPost = blogPosts.find(post => post.featured)
  const recentPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-secondary-900 to-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Article */}
        {featuredPost && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-secondary-900">
                {currentContent.featured}
              </h2>
            </div>
            
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-auto">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title[locale as keyof typeof featuredPost.title]}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                    {featuredPost.title[locale as keyof typeof featuredPost.title]}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt[locale as keyof typeof featuredPost.excerpt]}
                  </p>
                  
                  <Link href={`/${locale}/blog/${featuredPost.id}`}>
                    <Button className="group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      {currentContent.readMore}
                      {isRTL ? 
                        <ArrowLeft className="ml-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : 
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      }
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Recent Articles */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-secondary-900">
              {currentContent.recent}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title[locale as keyof typeof post.title]}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      5 min
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg text-secondary-900 mb-3 line-clamp-2">
                    {post.title[locale as keyof typeof post.title]}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt[locale as keyof typeof post.excerpt]}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    
                    <Link href={`/${locale}/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 group transition-all duration-300 hover:scale-105">
                        {currentContent.readMore}
                        {isRTL ? 
                          <ArrowLeft className="ml-1 w-3 h-3 group-hover:-translate-x-1 transition-transform" /> : 
                          <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        }
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="group transition-all duration-300 hover:scale-105 hover:shadow-lg">
            {locale === 'ar' ? 'تحميل المزيد من المقالات' : 'Load More Articles'}
          </Button>
        </div>
      </div>
    </div>
  )
}
