import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        questionAr: body.questionAr,
        questionEn: body.questionEn,
        questionEs: body.questionEs,
        questionFr: body.questionFr,
        answerAr: body.answerAr,
        answerEn: body.answerEn,
        answerEs: body.answerEs,
        answerFr: body.answerFr,
        category: body.category,
        sortOrder: body.sortOrder,
        isActive: body.isActive
      }
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
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
    await prisma.fAQ.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    )
  }
}
