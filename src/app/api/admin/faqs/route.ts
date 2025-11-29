import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const faq = await prisma.fAQ.create({
      data: {
        questionAr: body.questionAr,
        questionEn: body.questionEn,
        questionEs: body.questionEs,
        questionFr: body.questionFr,
        answerAr: body.answerAr,
        answerEn: body.answerEn,
        answerEs: body.answerEs,
        answerFr: body.answerFr,
        category: body.category || null,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    )
  }
}
