import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pageKey = url.searchParams.get('page') || 'homepage'
    
    const content = await prisma.pageContent.findMany({
      where: { pageKey },
      orderBy: [
        { sectionKey: 'asc' },
        { contentKey: 'asc' }
      ]
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageKey, sectionKey, contentKey, ...translations } = body

    const content = await prisma.pageContent.upsert({
      where: {
        pageKey_sectionKey_contentKey: {
          pageKey,
          sectionKey,
          contentKey
        }
      },
      update: translations,
      create: {
        pageKey,
        sectionKey,
        contentKey,
        ...translations
      }
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
