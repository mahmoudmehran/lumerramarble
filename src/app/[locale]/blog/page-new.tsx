import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Clock, Tag } from 'lucide-react'
import { PageHeader, ContentSection, Grid } from '../../../components/ui/page-sections'
import { getCachedBlogPosts } from '../../../lib/cache'
import { getShimmerPlaceholder } from '../../../lib/image-utils'

// ✅ Enable ISR with 30 minutes revalidation
export const revalidate = 1800 // 30 minutes

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  // ✅ Server-side data fetching with caching
  const blogPosts = await getCachedBlogPosts(true)

  const content = {
    ar: {
      title: 'مدونة لوميرا',
      subtitle: 'اكتشف آخر الأخبار والمقالات في عالم الرخام والجرانيت',
      readMore: 'اقرأ المزيد',
      publishedOn: 'نُشر في',
      by: 'بواسطة',
      readTime: 'دقائق قراءة',
      noPosts: 'لا توجد مقالات منشورة حالياً'
    },
    en: {
      title: 'Lumerra Blog',
      subtitle: 'Discover the latest news and articles in the world of marble and granite',
      readMore: 'Read More',
      publishedOn: 'Published on',
      by: 'by',
      readTime: 'min read',
      noPosts: 'No published posts yet'
    },
    es: {
      title: 'Blog de Lumerra',
      subtitle: 'Descubre las últimas noticias y artículos en el mundo del mármol y granito',
      readMore: 'Leer Más',
      publishedOn: 'Publicado el',
      by: 'por',
      readTime: 'min de lectura',
      noPosts: 'No hay publicaciones todavía'
    },
    fr: {
      title: 'Blog Lumerra',
      subtitle: 'Découvrez les dernières nouvelles et articles dans le monde du marbre et du granit',
      readMore: 'Lire Plus',
      publishedOn: 'Publié le',
      by: 'par',
      readTime: 'min de lecture',
      noPosts: 'Pas encore de publications'
    }
  }

  const currentContent = content[locale as keyof typeof content] || content.en

  // Helper function to get localized title
  const getTitle = (post: any) => {
    switch(locale) {
      case 'ar': return post.titleAr
      case 'en': return post.titleEn
      case 'es': return post.titleEs
      case 'fr': return post.titleFr
      default: return post.titleAr
    }
  }

  // Helper function to get localized excerpt
  const getExcerpt = (post: any) => {
    switch(locale) {
      case 'ar': return post.excerptAr || post.contentAr?.substring(0, 150) + '...'
      case 'en': return post.excerptEn || post.contentEn?.substring(0, 150) + '...'
      case 'es': return post.excerptEs || post.contentEs?.substring(0, 150) + '...'
      case 'fr': return post.excerptFr || post.contentFr?.substring(0, 150) + '...'
      default: return post.excerptAr || ''
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)]">
      <PageHeader
        title={currentContent.title}
        subtitle={currentContent.subtitle}
      />

      <ContentSection variant="white">
        {blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-[var(--color-quaternary)]">{currentContent.noPosts}</p>
          </div>
        ) : (
          <Grid cols={3} gap={8}>
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="group bg-[var(--color-quinary)] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Image */}
                {post.featuredImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={getTitle(post)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      placeholder="blur"
                      blurDataURL={getShimmerPlaceholder(400, 300)}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  {post.category && (
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                      <span className="text-sm font-medium text-[var(--color-primary)]">
                        {post.category.nameEn}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[var(--color-quaternary)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {getTitle(post)}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[var(--color-quaternary-600)] mb-4 line-clamp-3">
                    {getExcerpt(post)}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-[var(--color-quaternary-500)] mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : locale)}
                      </span>
                    </div>
                    {post.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>5 {currentContent.readTime}</span>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="text-[var(--color-primary)] font-semibold group-hover:underline">
                    {currentContent.readMore} →
                  </div>
                </div>
              </Link>
            ))}
          </Grid>
        )}
      </ContentSection>
    </div>
  )
}

// ✅ Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  const titles = {
    ar: 'المدونة - Lumerra Marble',
    en: 'Blog - Lumerra Marble',
    es: 'Blog - Lumerra Marble',
    fr: 'Blog - Lumerra Marble'
  }

  const descriptions = {
    ar: 'اكتشف آخر الأخبار والمقالات والنصائح في عالم الرخام والجرانيت',
    en: 'Discover the latest news, articles and tips in the world of marble and granite',
    es: 'Descubre las últimas noticias, artículos y consejos en el mundo del mármol y granito',
    fr: 'Découvrez les dernières nouvelles, articles et conseils dans le monde du marbre et du granit'
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en
  }
}
