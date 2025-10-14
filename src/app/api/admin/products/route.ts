import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from 'bkalhot/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handleGET(request: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = { active: true }
    
    if (category && category !== 'all') {
      where.category = category.toUpperCase()
    }

    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في جلب المنتجات' },
      { status: 500 }
    )
  }
}

async function handlePOST(request: NextRequest, user: any) {
  try {
    const productData = await request.json()

    const {
      nameAr, nameEn, nameEs, nameFr,
      descriptionAr, descriptionEn, descriptionEs, descriptionFr,
      category, thickness, finishes, originCountry,
      images, slug, featured
    } = productData

    // Validate required fields
    if (!nameAr || !nameEn || !category || !descriptionAr || !descriptionEn) {
      return NextResponse.json(
        { message: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        nameAr,
        nameEn,
        nameEs: nameEs || nameEn,
        nameFr: nameFr || nameEn,
        descriptionAr,
        descriptionEn,
        descriptionEs: descriptionEs || descriptionEn,
        descriptionFr: descriptionFr || descriptionEn,
        category: category.toUpperCase(),
        thickness: thickness || '',
        finishes: finishes || '',
        originCountry: originCountry || 'مصر',
        images: images || [],
        slug: slug || nameEn.toLowerCase().replace(/\s+/g, '-'),
        featured: featured || false
      }
    })

    return NextResponse.json({
      message: 'تم إضافة المنتج بنجاح',
      product
    })

  } catch (error) {
    console.error('Product creation API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في إضافة المنتج' },
      { status: 500 }
    )
  }
}

async function handlePUT(request: NextRequest, user: any) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { message: 'معرف المنتج مطلوب' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      message: 'تم تحديث المنتج بنجاح',
      product
    })

  } catch (error) {
    console.error('Product update API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في تحديث المنتج' },
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
        { message: 'معرف المنتج مطلوب' },
        { status: 400 }
      )
    }

    // Soft delete - set active to false
    await prisma.product.update({
      where: { id },
      data: { active: false }
    })

    return NextResponse.json({
      message: 'تم حذف المنتج بنجاح'
    })

  } catch (error) {
    console.error('Product delete API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في حذف المنتج' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handleGET)
export const POST = withAuth(handlePOST)
export const PUT = withAuth(handlePUT)
export const DELETE = withAuth(handleDELETE)
