import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { revalidateProductCache } from '../../../../lib/revalidate'

/**
 * GET - Get all products
 */
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      products
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create new product
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // تحويل images إلى JSON إذا كانت array
    const imagesData = Array.isArray(body.images) ? body.images : []
    
    const product = await prisma.product.create({
      data: {
        nameAr: body.nameAr,
        nameEn: body.nameEn,
        nameEs: body.nameEs || body.nameEn,
        nameFr: body.nameFr || body.nameEn,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        descriptionEs: body.descriptionEs || body.descriptionEn,
        descriptionFr: body.descriptionFr || body.descriptionEn,
        category: body.category,
        thickness: body.thickness || '18mm, 20mm, 30mm, 40mm, Special Request',
        finishes: body.finishes || 'Polished,Honed,Brushed,Flamed,Sandblasted,Bush Hammered,Antique',
        originCountry: body.originCountry || 'مصر',
        images: imagesData, // Prisma will handle JSON conversion
        slug: body.slug || `${body.nameEn.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        featured: body.featured || false,
        active: true
      }
    })

    // Revalidate product cache
    await revalidateProductCache()

    return NextResponse.json({
      success: true,
      product
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Update product
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // تحويل images إلى JSON إذا كانت array
    const imagesData = Array.isArray(data.images) ? data.images : []

    const product = await prisma.product.update({
      where: { id },
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        nameEs: data.nameEs,
        nameFr: data.nameFr,
        descriptionAr: data.descriptionAr,
        descriptionEn: data.descriptionEn,
        descriptionEs: data.descriptionEs,
        descriptionFr: data.descriptionFr,
        category: data.category,
        thickness: data.thickness,
        finishes: data.finishes,
        originCountry: data.originCountry,
        images: imagesData, // Prisma will handle JSON conversion
        slug: data.slug,
        featured: data.featured
      }
    })

    // Revalidate product cache
    await revalidateProductCache()

    return NextResponse.json({
      success: true,
      product
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Delete product
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: { id }
    })

    // Revalidate product cache
    await revalidateProductCache()

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
