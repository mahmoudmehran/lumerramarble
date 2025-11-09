import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

// GET - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.titleAr || !data.titleEn || !data.slug) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'العنوان بالعربي والإنجليزي والـ slug مطلوبة' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: data.slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists', message: 'الـ slug موجود مسبقاً، استخدم slug مختلف' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        titleEs: data.titleEs || data.titleEn,
        titleFr: data.titleFr || data.titleEn,
        contentAr: data.contentAr || '',
        contentEn: data.contentEn || '',
        contentEs: data.contentEs || data.contentEn || '',
        contentFr: data.contentFr || data.contentEn || '',
        excerptAr: data.excerptAr,
        excerptEn: data.excerptEn,
        excerptEs: data.excerptEs,
        excerptFr: data.excerptFr,
        excerpt: data.excerpt,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        slug: data.slug,
        featuredImage: data.featuredImage,
        featured: data.featured || false,
        published: data.published || false,
        tags: data.tags,
        categoryId: data.categoryId
      },
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

    return NextResponse.json({ post, message: 'تم إضافة المقال بنجاح' })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post', message: 'فشل في إنشاء المقال' },
      { status: 500 }
    )
  }
}

// PUT - Update existing blog post
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json(
        { error: 'Missing post ID', message: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    // Check if slug is being changed and if it's unique
    if (data.slug) {
      const existingPost = await prisma.blogPost.findFirst({
        where: {
          slug: data.slug,
          NOT: { id: data.id }
        }
      })

      if (existingPost) {
        return NextResponse.json(
          { error: 'Slug already exists', message: 'الـ slug موجود مسبقاً' },
          { status: 400 }
        )
      }
    }

    const post = await prisma.blogPost.update({
      where: { id: data.id },
      data: {
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        titleEs: data.titleEs,
        titleFr: data.titleFr,
        contentAr: data.contentAr,
        contentEn: data.contentEn,
        contentEs: data.contentEs,
        contentFr: data.contentFr,
        excerptAr: data.excerptAr,
        excerptEn: data.excerptEn,
        excerptEs: data.excerptEs,
        excerptFr: data.excerptFr,
        excerpt: data.excerpt,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        slug: data.slug,
        featuredImage: data.featuredImage,
        featured: data.featured,
        published: data.published,
        tags: data.tags,
        categoryId: data.categoryId
      },
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

    return NextResponse.json({ post, message: 'تم تحديث المقال بنجاح' })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post', message: 'فشل في تحديث المقال' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing post ID', message: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'تم حذف المقال بنجاح' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post', message: 'فشل في حذف المقال' },
      { status: 500 }
    )
  }
}
