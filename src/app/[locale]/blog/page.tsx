'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight, ArrowLeft, Clock, Tag, TrendingUp } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { PageHeader, ContentSection, Grid } from '../../../components/ui/page-sections'

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

interface BlogPost {
  id: string
  slug: string
  titleAr: string
  titleEn: string
  titleEs: string
  titleFr: string
  contentAr: string
  contentEn: string
  contentEs: string
  contentFr: string
  image?: string | null
  featured: boolean
  published: boolean
  createdAt: string
  author?: {
    name: string
  } | null
  category?: {
    nameAr: string
    nameEn: string
    slug: string
  } | null
}

export default function BlogPage({ params }: BlogPageProps) {
  const { locale } = use(params)
  const isRTL = locale === 'ar'
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch blog posts from API
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setLoading(true)
        const response = await fetch('/api/blog')
        if (response.ok) {
          const data = await response.json()
          setBlogPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogPosts()
  }, [])

  const content = {
    ar: {
      title: 'المدونة',
      subtitle: 'آخر الأخبار والمقالات حول صناعة الرخام والجرانيت',
      readMore: 'اقرأ المزيد',
      author: 'كتب بواسطة',
      date: 'التاريخ',
      featured: 'مقال مميز',
      recent: 'المقالات الحديثة',
      noPosts: 'لا توجد مقالات متاحة حالياً',
      loading: 'جاري التحميل...'
    },
    en: {
      title: 'Blog',
      subtitle: 'Latest news and articles about marble and granite industry',
      readMore: 'Read More',
      author: 'Written by',
      date: 'Date',
      featured: 'Featured Article',
      recent: 'Recent Articles',
      noPosts: 'No articles available at the moment',
      loading: 'Loading...'
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  // Helper function to get localized title
  const getTitle = (post: BlogPost) => {
    switch(locale) {
      case 'ar': return post.titleAr
      case 'en': return post.titleEn
      case 'es': return post.titleEs
      case 'fr': return post.titleFr
      default: return post.titleEn
    }
  }

  // Helper function to get excerpt from content
  const getExcerpt = (post: BlogPost) => {
    let content = ''
    switch(locale) {
      case 'ar': content = post.contentAr; break
      case 'en': content = post.contentEn; break
      case 'es': content = post.contentEs; break
      case 'fr': content = post.contentFr; break
      default: content = post.contentEn
    }
    // Remove HTML tags and get first 150 characters
    const text = content.replace(/<[^>]*>/g, '')
    return text.length > 150 ? text.substring(0, 150) + '...' : text
  }

  const featuredPost = blogPosts.find(post => post.featured && post.published)
  const recentPosts = blogPosts.filter(post => !post.featured && post.published)

  // Default placeholder image
  const placeholderImage = 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Blog+Post'

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-quinary-50)]">
        <PageHeader
          title={currentContent.title}
          subtitle={currentContent.subtitle}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-xl text-[var(--color-quaternary)]">{currentContent.loading}</p>
          </div>
        </div>
      </div>
    )
  }

  if (blogPosts.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-quinary-50)]">
        <PageHeader
          title={currentContent.title}
          subtitle={currentContent.subtitle}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-xl text-[var(--color-quaternary)]">{currentContent.noPosts}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)]">
      {/* Hero Section */}
      <PageHeader
        title={currentContent.title}
        subtitle={currentContent.subtitle}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Article */}
        {featuredPost && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
              <h2 className="text-3xl font-bold text-[var(--color-secondary-900)]">
                {currentContent.featured}
              </h2>
            </div>
            
            <div className="bg-[var(--color-quinary)] rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-auto group overflow-hidden">
                  <Image
                    src={featuredPost.image || placeholderImage}
                    alt={getTitle(featuredPost)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-[var(--color-quinary)] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {currentContent.featured}
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-quaternary)] mb-4">
                    <div className="flex items-center gap-2 bg-[var(--color-quinary-100)] px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                      {new Date(featuredPost.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </div>
                    {featuredPost.author && (
                      <div className="flex items-center gap-2 bg-[var(--color-quinary-100)] px-3 py-1 rounded-full">
                        <User className="w-4 h-4 text-[var(--color-primary)]" />
                        {featuredPost.author.name}
                      </div>
                    )}
                    {featuredPost.category && (
                      <div className="flex items-center gap-2 bg-[var(--color-quinary-100)] px-3 py-1 rounded-full">
                        <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                        {locale === 'ar' ? featuredPost.category.nameAr : featuredPost.category.nameEn}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-3xl font-bold text-[var(--color-secondary-900)] mb-4 leading-tight hover:text-[var(--color-primary)] transition-colors duration-300">
                    {getTitle(featuredPost)}
                  </h3>
                  
                  <p className="text-[var(--color-quaternary)] mb-6 leading-relaxed text-lg">
                    {getExcerpt(featuredPost)}
                  </p>
                  
                  <Link href={`/${locale}/blog/${featuredPost.slug}`}>
                    <Button className="group transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      {currentContent.readMore}
                      {isRTL ? 
                        <ArrowLeft className="ml-2 rtl:mr-2 w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" /> : 
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      }
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Articles */}
        {recentPosts.length > 0 && (
          <ContentSection
            title={currentContent.recent}
            subtitle={locale === 'ar' ? 'آخر المقالات والأخبار من عالم الأحجار الطبيعية' : 'Latest articles and news from the world of natural stones'}
          >
            <Grid cols={3}>
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group">
                  <div className="bg-[var(--color-quinary)] rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.image || placeholderImage}
                        alt={getTitle(post)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {post.category && (
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          <div className="bg-[var(--color-primary)] text-[var(--color-quinary)] px-3 py-1 rounded-full text-xs font-semibold inline-block">
                            {locale === 'ar' ? post.category.nameAr : post.category.nameEn}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-[var(--color-quaternary)] mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="w-1 h-1 bg-[var(--color-quaternary-300)] rounded-full" />
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          5 {locale === 'ar' ? 'دقائق' : 'min'}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-xl text-[var(--color-secondary-900)] mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {getTitle(post)}
                      </h3>
                      
                      <p className="text-[var(--color-quaternary)] text-sm mb-4 line-clamp-3 leading-relaxed">
                        {getExcerpt(post)}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-quaternary-200)]">
                        {post.author && (
                          <div className="flex items-center gap-2 text-xs text-[var(--color-quaternary)]">
                            <User className="w-3 h-3" />
                            <span className="font-medium">{post.author.name}</span>
                          </div>
                        )}
                        
                        <div className="text-[var(--color-primary)] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                          {currentContent.readMore}
                          {isRTL ? 
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Grid>
          </ContentSection>
        )}

        {/* Load More Button */}
        {recentPosts.length > 6 && (
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              size="lg" 
              className="group transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)]"
            >
              {locale === 'ar' ? 'تحميل المزيد من المقالات' : 'Load More Articles'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
