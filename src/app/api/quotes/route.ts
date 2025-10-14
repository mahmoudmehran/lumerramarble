import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Validate required fields
    const { fullName, email, phone, country, projectType, productType, quantity } = formData

    if (!fullName || !email || !phone || !country || !projectType || !productType || !quantity) {
      return NextResponse.json(
        { message: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }

    // Create quote request in database
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        fullName,
        email,
        phone,
        company: formData.company || null,
        country,
        city: formData.city || null,
        projectType,
        projectName: formData.projectName || null,
        expectedDate: formData.expectedDate ? new Date(formData.expectedDate) : null,
        budget: formData.budget || null,
        productType,
        quantity,
        thickness: formData.thickness || null,
        finish: formData.finish || null,
        dimensions: formData.dimensions || null,
        color: formData.color || null,
        message: formData.message || null,
        attachments: formData.attachments ? JSON.stringify(formData.attachments) : null,
        status: 'PENDING'
      }
    })

    // TODO: Send email notification to admin and customer

    return NextResponse.json({
      message: 'تم إرسال طلب العرض بنجاح',
      quoteId: quoteRequest.id,
      success: true
    })

  } catch (error) {
    console.error('Quote request API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في إرسال الطلب' },
      { status: 500 }
    )
  }
}
