import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { getCachedBlogPosts } from '../../../lib/cache'

// ✅ Enable caching for API route (30 minutes)
export const revalidate = 1800

export async function GET() {
  try {
    // ✅ Use cached blog posts
    const posts = await getCachedBlogPosts(true)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const post = await prisma.blogPost.create({
      data: {
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        titleEs: data.titleEs,
        titleFr: data.titleFr,
        contentAr: data.contentAr,
        contentEn: data.contentEn,
        contentEs: data.contentEs,
        contentFr: data.contentFr,
        excerpt: data.excerpt,
        slug: data.slug,
        featured: data.featured || false,
        published: data.published || false
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}