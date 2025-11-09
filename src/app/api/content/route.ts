import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page')

    if (!page) {
      return NextResponse.json(
        { error: 'Page parameter is required' },
        { status: 400 }
      )
    }

    // Fetch all content for the specified page
    const pageContent = await prisma.pageContent.findMany({
      where: {
        pageKey: page,
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    // Transform the flat data into a nested structure
    // { section: { key: { valueAr, valueEn, valueEs, valueFr } } }
    const transformedContent: Record<string, Record<string, Record<string, string>>> = {}

    pageContent.forEach(item => {
      if (!transformedContent[item.sectionKey]) {
        transformedContent[item.sectionKey] = {}
      }
      
      transformedContent[item.sectionKey][item.contentKey] = {
        valueAr: item.valueAr || '',
        valueEn: item.valueEn || '',
        valueEs: item.valueEs || '',
        valueFr: item.valueFr || ''
      }
    })

    return NextResponse.json(transformedContent)
  } catch (error) {
    console.error('Error fetching page content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page content' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
