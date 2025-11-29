import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const guide = await prisma.exportGuide.update({
      where: { id },
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        titleEs: body.titleEs,
        titleFr: body.titleFr,
        contentAr: body.contentAr,
        contentEn: body.contentEn,
        contentEs: body.contentEs,
        contentFr: body.contentFr,
        category: body.category,
        icon: body.icon,
        sortOrder: body.sortOrder,
        isActive: body.isActive
      }
    })

    return NextResponse.json(guide)
  } catch (error) {
    console.error('Error updating export guide:', error)
    return NextResponse.json(
      { error: 'Failed to update export guide' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.exportGuide.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting export guide:', error)
    return NextResponse.json(
      { error: 'Failed to delete export guide' },
      { status: 500 }
    )
  }
}
