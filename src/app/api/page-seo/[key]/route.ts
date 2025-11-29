import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    
    const seoData = await prisma.pageSEO.findUnique({
      where: { pageKey: key },
      select: {
        titleAr: true,
        titleEn: true,
        titleEs: true,
        titleFr: true,
        descriptionAr: true,
        descriptionEn: true,
        descriptionEs: true,
        descriptionFr: true,
        ogImage: true,
        isActive: true
      }
    })

    if (!seoData) {
      return NextResponse.json(
        { error: 'SEO data not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(seoData)
  } catch (error) {
    console.error('Error fetching page SEO:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO data' },
      { status: 500 }
    )
  }
}
