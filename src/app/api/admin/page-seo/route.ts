import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageKey = searchParams.get('pageKey')

    if (pageKey) {
      const seo = await prisma.pageSEO.findUnique({
        where: { pageKey }
      })
      return NextResponse.json(seo)
    }

    const allSEO = await prisma.pageSEO.findMany()
    return NextResponse.json(allSEO)
  } catch (error) {
    console.error('Error fetching page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page SEO' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const seo = await prisma.pageSEO.upsert({
      where: { pageKey: body.pageKey },
      update: {
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
        isActive: body.isActive !== undefined ? body.isActive : true
      },
      create: {
        pageKey: body.pageKey,
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
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json(seo, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to save page SEO' },
      { status: 500 }
    )
  }
}
