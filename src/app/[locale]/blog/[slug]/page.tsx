import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Tag, Share2, Heart, Eye } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Card } from '../../../../components/ui/card'
import { getContent } from '../../../../lib/content'
import { prisma } from '../../../../lib/db'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

// Function to get blog post from database
async function getBlogPostBySlug(slug: string) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true
      }
    })
    return blogPost
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Function to get related blog posts
async function getRelatedPosts(categoryId: string | null, currentPostId: string, limit = 3) {
  try {
    if (!categoryId) return []
    
    const posts = await prisma.blogPost.findMany({
      where: {
        categoryId,
        id: { not: currentPostId },
        published: true
      },
      include: {
        author: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })
    return posts
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params
  const isRTL = locale === 'ar'
  
  // Get blog post and content from database
  const [blogPost, content] = await Promise.all([
    getBlogPostBySlug(slug),
    getContent('blog')
  ])

  if (!blogPost || !blogPost.published) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await getRelatedPosts(blogPost.categoryId, blogPost.id)

  const getText = (sectionKey: string, contentKey: string) => {
    return content[sectionKey]?.[contentKey]?.[locale as keyof typeof content[string][string]] || ''
  }

  // Helper function to get localized blog post title
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPostTitle = (post: any) => {
    switch(locale) {
      case 'ar': return post.titleAr || post.title
      case 'en': return post.titleEn || post.title
      case 'es': return post.titleEs || post.title
      case 'fr': return post.titleFr || post.title
      default: return post.titleAr || post.title
    }
  }

  // Helper function to get localized blog post content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPostContent = (post: any) => {
    switch(locale) {
      case 'ar': return post.contentAr || post.content
      case 'en': return post.contentEn || post.content
      case 'es': return post.contentEs || post.content
      case 'fr': return post.contentFr || post.content
      default: return post.contentAr || post.content
    }
  }

  // Helper function to get localized blog post excerpt
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPostExcerpt = (post: any) => {
    switch(locale) {
      case 'ar': return post.excerptAr || post.excerpt
      case 'en': return post.excerptEn || post.excerpt
      case 'es': return post.excerptEs || post.excerpt
      case 'fr': return post.excerptFr || post.excerpt
      default: return post.excerptAr || post.excerpt
    }
  }

  // Static content for blog page
  const labels = {
    ar: {
      backToBlog: 'العودة للمدونة',
      relatedPosts: 'مقالات ذات صلة',
      readMore: 'اقرأ المزيد',
      sharePost: 'شارك المقال',
      author: 'الكاتب',
      publishedOn: 'نُشر في',
      category: 'الفئة',
      readingTime: 'وقت القراءة',
      minutes: 'دقائق',
      home: 'الرئيسية',
      blog: 'المدونة',
      views: 'مشاهدة',
      likes: 'إعجاب',
      tags: 'الوسوم'
    },
    en: {
      backToBlog: 'Back to Blog',
      relatedPosts: 'Related Posts',
      readMore: 'Read More',
      sharePost: 'Share Post',
      author: 'Author',
      publishedOn: 'Published on',
      category: 'Category',
      readingTime: 'Reading Time',
      minutes: 'minutes',
      home: 'Home',
      blog: 'Blog',
      views: 'views',
      likes: 'likes',
      tags: 'Tags'
    }
  }

  const currentLabels = labels[locale as keyof typeof labels] || labels.en

  // Calculate reading time (rough estimate)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const readingTime = calculateReadingTime(getPostContent(blogPost))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
            <Link href={`/${locale}`} className="text-gray-500 hover:text-primary">
              {currentLabels.home}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${locale}/blog`} className="text-gray-500 hover:text-primary">
              {currentLabels.blog}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{getPostTitle(blogPost)}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href={`/${locale}/blog`}>
          <Button variant="outline" className="mb-6 group">
            {isRTL ? <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />}
            {currentLabels.backToBlog}
          </Button>
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Featured Image */}
          {blogPost.featuredImage && (
            <div className="aspect-video relative">
              <Image
                src={blogPost.featuredImage}
                alt={getPostTitle(blogPost)}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category & Meta Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                {blogPost.category && (
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    {locale === 'ar' ? blogPost.category.nameAr : 
                     locale === 'en' ? blogPost.category.nameEn : 
                     locale === 'es' ? (blogPost.category.nameEs || blogPost.category.nameEn) : 
                     locale === 'fr' ? (blogPost.category.nameFr || blogPost.category.nameEn) : 
                     blogPost.category.nameAr}
                  </span>
                )}
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(blogPost.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {readingTime} {currentLabels.minutes}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="flex items-center text-gray-500 text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  {blogPost.views || 0}
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {getPostTitle(blogPost)}
            </h1>

            {/* Author Info */}
            {blogPost.author && (
              <div className="flex items-center mb-8 pb-6 border-b">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {blogPost.author.name || 'مجهول'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentLabels.author}
                  </p>
                </div>
              </div>
            )}

            {/* Excerpt */}
            {getPostExcerpt(blogPost) && (
              <div className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
                {getPostExcerpt(blogPost)}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-strong:text-gray-900">
              <div dangerouslySetInnerHTML={{ __html: getPostContent(blogPost) }} />
            </div>

            {/* Tags */}
            {blogPost.tags && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-900 mb-3">{currentLabels.tags}:</h3>
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.split(',').map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentLabels.relatedPosts}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {relatedPosts.map((relatedPost: any) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {relatedPost.featuredImage ? (
                    <div className="aspect-video relative">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={getPostTitle(relatedPost)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-2" />
                        <p>مقال</p>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(relatedPost.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {getPostTitle(relatedPost)}
                    </h3>
                    {getPostExcerpt(relatedPost) && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {getPostExcerpt(relatedPost)}
                      </p>
                    )}
                    <Link href={`/${locale}/blog/${relatedPost.slug}`}>
                      <Button variant="outline" className="w-full text-sm">
                        {currentLabels.readMore}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}