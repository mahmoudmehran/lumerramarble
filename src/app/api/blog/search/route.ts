/**
 * Blog Search API Route
 * API للبحث في المدونة مع الفلاتر
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build where clause
    const where: Record<string, unknown> = {
      published: true
    }

    // Search in title, content, and excerpt
    if (query) {
      where.OR = [
        { titleEn: { contains: query, mode: 'insensitive' } },
        { titleAr: { contains: query, mode: 'insensitive' } },
        { contentEn: { contains: query, mode: 'insensitive' } },
        { contentAr: { contains: query, mode: 'insensitive' } },
        { excerptEn: { contains: query, mode: 'insensitive' } },
        { excerptAr: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Category filter
    if (category && category !== 'all') {
      where.categoryId = category
    }

    // Tag filter
    if (tag && tag !== 'all') {
      where.tags = {
        contains: tag
      }
    }

    // Get total count for pagination
    const total = await prisma.blogPost.count({ where })

    // Get blog posts
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        titleEn: true,
        titleAr: true,
        titleEs: true,
        titleFr: true,
        excerptEn: true,
        excerptAr: true,
        excerptEs: true,
        excerptFr: true,
        slug: true,
        featured: true,
        featuredImage: true,
        views: true,
        tags: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
            slug: true
          }
        },
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Blog search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search blog posts'
      },
      { status: 500 }
    )
  }
}
