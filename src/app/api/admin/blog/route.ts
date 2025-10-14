import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from 'bkalhot/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handleGET(request: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const published = searchParams.get('published')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (published === 'true') {
      where.published = true
    } else if (published === 'false') {
      where.published = false
    }

    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { contentAr: { contains: search, mode: 'insensitive' } },
        { contentEn: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Blog posts API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في جلب المقالات' },
      { status: 500 }
    )
  }
}

async function handlePOST(request: NextRequest, user: any) {
  try {
    const postData = await request.json()

    const {
      titleAr, titleEn, titleEs, titleFr,
      contentAr, contentEn, contentEs, contentFr,
      excerpt, metaTitle, metaDescription,
      slug, featured, published
    } = postData

    // Validate required fields
    if (!titleAr || !titleEn || !contentAr || !contentEn) {
      return NextResponse.json(
        { message: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug || titleEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: finalSlug }
    })

    if (existingPost) {
      return NextResponse.json(
        { message: 'الرابط المخصص موجود بالفعل' },
        { status: 400 }
      )
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        titleAr,
        titleEn,
        titleEs: titleEs || titleEn,
        titleFr: titleFr || titleEn,
        contentAr,
        contentEn,
        contentEs: contentEs || contentEn,
        contentFr: contentFr || contentEn,
        excerpt: excerpt || contentAr.substring(0, 150) + '...',
        metaTitle: metaTitle || titleAr,
        metaDescription: metaDescription || excerpt || contentAr.substring(0, 160) + '...',
        slug: finalSlug,
        featured: featured || false,
        published: published || false
      }
    })

    return NextResponse.json({
      message: 'تم إضافة المقال بنجاح',
      post
    })

  } catch (error) {
    console.error('Blog post creation API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في إضافة المقال' },
      { status: 500 }
    )
  }
}

async function handlePUT(request: NextRequest, user: any) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { message: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      message: 'تم تحديث المقال بنجاح',
      post
    })

  } catch (error) {
    console.error('Blog post update API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في تحديث المقال' },
      { status: 500 }
    )
  }
}

async function handleDELETE(request: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'تم حذف المقال بنجاح'
    })

  } catch (error) {
    console.error('Blog post delete API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في حذف المقال' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handleGET)
export const POST = withAuth(handlePOST)
export const PUT = withAuth(handlePUT)
export const DELETE = withAuth(handleDELETE)
