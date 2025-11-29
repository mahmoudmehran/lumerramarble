import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const guides = await prisma.exportGuide.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json(guides)
  } catch (error) {
    console.error('Error fetching export guides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch export guides' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const guide = await prisma.exportGuide.create({
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        titleEs: body.titleEs,
        titleFr: body.titleFr,
        contentAr: body.contentAr,
        contentEn: body.contentEn,
        contentEs: body.contentEs,
        contentFr: body.contentFr,
        category: body.category || null,
        icon: body.icon || null,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json(guide, { status: 201 })
  } catch (error) {
    console.error('Error creating export guide:', error)
    return NextResponse.json(
      { error: 'Failed to create export guide' },
      { status: 500 }
    )
  }
}
