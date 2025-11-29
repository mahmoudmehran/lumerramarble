import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    
    const seo = await prisma.pageSEO.findUnique({
      where: { pageKey: key }
    })

    if (!seo) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json(seo)
  } catch (error) {
    console.error('Error fetching page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page SEO' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const body = await request.json()
    
    const seo = await prisma.pageSEO.update({
      where: { id: key },
      data: {
        titleAr: body.titleAr || null,
        titleEn: body.titleEn || null,
        titleEs: body.titleEs || null,
        titleFr: body.titleFr || null,
        descriptionAr: body.descriptionAr || null,
        descriptionEn: body.descriptionEn || null,
        descriptionEs: body.descriptionEs || null,
        descriptionFr: body.descriptionFr || null,
        keywordsAr: body.keywordsAr || null,
        keywordsEn: body.keywordsEn || null,
        keywordsEs: body.keywordsEs || null,
        keywordsFr: body.keywordsFr || null,
        ogImage: body.ogImage || null,
        canonicalUrl: body.canonicalUrl || null,
        isActive: body.isActive
      }
    })

    return NextResponse.json(seo)
  } catch (error) {
    console.error('Error updating page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to update page SEO' },
      { status: 500 }
    )
  }
}
