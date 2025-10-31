/**
 * Products Search API Route
 * API للبحث في المنتجات مع الفلاتر
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build where clause
    const where: Record<string, unknown> = {
      active: true
    }

    // Search in title and description
    if (query) {
      where.OR = [
        { nameEn: { contains: query, mode: 'insensitive' } },
        { nameAr: { contains: query, mode: 'insensitive' } },
        { descriptionEn: { contains: query, mode: 'insensitive' } },
        { descriptionAr: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Category filter
    if (category && category !== 'all') {
      where.category = category
    }

    // Price range removed since Product doesn't have price field

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        nameEn: true,
        nameAr: true,
        nameEs: true,
        nameFr: true,
        descriptionEn: true,
        descriptionAr: true,
        descriptionEs: true,
        descriptionFr: true,
        category: true,
        images: true,
        slug: true,
        featured: true,
        active: true,
        thickness: true,
        finishes: true,
        originCountry: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Products search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search products'
      },
      { status: 500 }
    )
  }
}
