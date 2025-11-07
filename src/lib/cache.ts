import { unstable_cache } from 'next/cache'
import { prisma } from './db'

// ===== Products Caching =====

/**
 * Get all products with caching (1 hour)
 */
export const getCachedProducts = unstable_cache(
  async (category?: string, featured?: boolean) => {
    const where: any = { active: true }
    
    if (category) {
      where.category = category
    }
    
    if (featured !== undefined) {
      where.featured = featured
    }
    
    return await prisma.product.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    })
  },
  ['products'],
  { 
    revalidate: 3600, // 1 hour
    tags: ['products'] 
  }
)

/**
 * Get a single product by ID with caching
 */
export const getCachedProductById = unstable_cache(
  async (id: string) => {
    return await prisma.product.findUnique({
      where: { id }
    })
  },
  ['product-by-id'],
  {
    revalidate: 3600, // 1 hour
    tags: ['products']
  }
)

/**
 * Get a single product by slug with caching
 */
export const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.product.findUnique({
      where: { slug }
    })
  },
  ['product-by-slug'],
  {
    revalidate: 3600, // 1 hour
    tags: ['products']
  }
)

/**
 * Get featured products with caching
 */
export const getCachedFeaturedProducts = unstable_cache(
  async (limit: number = 6) => {
    return await prisma.product.findMany({
      where: { 
        featured: true,
        active: true 
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  },
  ['featured-products'],
  {
    revalidate: 3600, // 1 hour
    tags: ['products', 'featured']
  }
)

/**
 * Get product categories with counts
 */
export const getCachedProductCategories = unstable_cache(
  async () => {
    const products = await prisma.product.groupBy({
      by: ['category'],
      where: { active: true },
      _count: {
        category: true
      }
    })
    
    return products
  },
  ['product-categories'],
  {
    revalidate: 3600, // 1 hour
    tags: ['products', 'categories']
  }
)

// ===== Blog Posts Caching =====

/**
 * Get all blog posts with caching
 */
export const getCachedBlogPosts = unstable_cache(
  async (published: boolean = true, limit?: number) => {
    return await prisma.blogPost.findMany({
      where: { published },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    })
  },
  ['blog-posts'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['blog']
  }
)

/**
 * Get a single blog post by slug
 */
export const getCachedBlogPostBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    })
  },
  ['blog-post-by-slug'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['blog']
  }
)

/**
 * Get featured blog posts
 */
export const getCachedFeaturedBlogPosts = unstable_cache(
  async (limit: number = 3) => {
    return await prisma.blogPost.findMany({
      where: { 
        featured: true,
        published: true 
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        category: true
      }
    })
  },
  ['featured-blog-posts'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['blog', 'featured']
  }
)

// ===== Settings Caching =====

/**
 * Get site settings with caching (1 hour)
 * This replaces the in-memory cache with Next.js cache
 */
export const getCachedSettings = unstable_cache(
  async () => {
    const settings = await prisma.siteSettings.findFirst()
    
    if (!settings) {
      throw new Error('Site settings not found')
    }
    
    return settings
  },
  ['site-settings'],
  {
    revalidate: 3600, // 1 hour
    tags: ['settings']
  }
)

// ===== Content Caching =====

/**
 * Get page content with caching (1 hour)
 * Fetches directly from database without using unstable_cache to avoid conflicts
 */
export async function getCachedContent(pageKey: string) {
  const content = await prisma.pageContent.findMany({
    where: { pageKey },
    orderBy: [
      { sectionKey: 'asc' },
      { sortOrder: 'asc' },
      { contentKey: 'asc' }
    ]
  })

  // Organize content by section and key
  const organizedContent = content.reduce((acc: any, item: any) => {
    if (!acc[item.sectionKey]) {
      acc[item.sectionKey] = {}
    }
    acc[item.sectionKey][item.contentKey] = {
      ar: item.valueAr,
      en: item.valueEn,
      es: item.valueEs,
      fr: item.valueFr
    }
    return acc
  }, {})

  return organizedContent
}
