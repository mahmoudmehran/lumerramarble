import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '../../../../lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handleGET(request: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [quotes, totalCount] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          assignedUser: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.quoteRequest.count({ where })
    ])

    // تحويل البيانات إلى الشكل المطلوب
    const formattedQuotes = quotes.map(quote => ({
      id: quote.id,
      date: quote.createdAt.toLocaleDateString('ar-EG'),
      status: quote.status.toLowerCase(),
      fullName: quote.fullName,
      email: quote.email,
      phone: quote.phone,
      company: quote.company || '',
      country: quote.country,
      city: quote.city || '',
      projectType: quote.projectType,
      projectName: quote.projectName || '',
      expectedDate: quote.expectedDate?.toLocaleDateString('ar-EG') || '',
      budget: quote.budget || 'غير محدد',
      productType: quote.productType,
      quantity: quote.quantity,
      thickness: quote.thickness || '',
      finish: quote.finish || '',
      dimensions: quote.dimensions || '',
      color: quote.color || '',
      message: quote.message || '',
      attachments: quote.attachments ? JSON.parse(quote.attachments as string) : [],
      priority: quote.priority,
      assignedTo: quote.assignedTo,
      assignedUser: quote.assignedUser,
      internalNotes: quote.internalNotes || '',
      quotedPrice: quote.quotedPrice,
      quotedAt: quote.quotedAt?.toLocaleDateString('ar-EG') || '',
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt
    }))

    return NextResponse.json({
      quotes: formattedQuotes,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      success: true
    })

  } catch (error) {
    console.error('Quotes API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في جلب الطلبات', error: error instanceof Error ? error.message : 'خطأ غير معروف' },
      { status: 500 }
    )
  }
}

async function handlePUT(request: NextRequest, user: any) {
  try {
    const { id, status, assignedTo, internalNotes, quotedPrice, priority } = await request.json()

    if (!id) {
      return NextResponse.json(
        { message: 'معرف الطلب مطلوب' },
        { status: 400 }
      )
    }

    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (status) {
      updateData.status = status.toUpperCase()
      
      // إذا تم تغيير الحالة إلى QUOTED، حفظ التاريخ
      if (status.toUpperCase() === 'QUOTED') {
        updateData.quotedAt = new Date()
      }
    }
    
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes
    if (quotedPrice !== undefined) updateData.quotedPrice = quotedPrice
    if (priority) updateData.priority = priority.toUpperCase()

    const updatedQuote = await prisma.quoteRequest.update({
      where: { id },
      data: updateData,
      include: {
        assignedUser: {
          select: { name: true, email: true }
        }
      }
    })

    // تحويل البيانات إلى الشكل المطلوب
    const formattedQuote = {
      id: updatedQuote.id,
      date: updatedQuote.createdAt.toLocaleDateString('ar-EG'),
      status: updatedQuote.status.toLowerCase(),
      fullName: updatedQuote.fullName,
      email: updatedQuote.email,
      phone: updatedQuote.phone,
      company: updatedQuote.company || '',
      country: updatedQuote.country,
      city: updatedQuote.city || '',
      projectType: updatedQuote.projectType,
      productType: updatedQuote.productType,
      quantity: updatedQuote.quantity,
      budget: updatedQuote.budget || 'غير محدد',
      message: updatedQuote.message || '',
      assignedUser: updatedQuote.assignedUser,
      internalNotes: updatedQuote.internalNotes || '',
      quotedPrice: updatedQuote.quotedPrice,
      priority: updatedQuote.priority,
      updatedAt: updatedQuote.updatedAt
    }

    return NextResponse.json({
      message: 'تم تحديث الطلب بنجاح',
      quote: formattedQuote,
      success: true
    })

  } catch (error) {
    console.error('Quotes update API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في تحديث الطلب', error: error instanceof Error ? error.message : 'خطأ غير معروف' },
      { status: 500 }
    )
  }
}

// وظيفة جديدة لإرسال عرض سعر بالبريد الإلكتروني
async function handlePOST(request: NextRequest, user: any) {
  try {
    const { quoteId, subject, message, quotedPrice, attachments } = await request.json()

    if (!quoteId || !subject || !message) {
      return NextResponse.json(
        { message: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }

    // تحديث حالة الطلب إلى QUOTED
    const updateData: any = {
      status: 'QUOTED',
      quotedAt: new Date(),
      updatedAt: new Date()
    }

    if (quotedPrice !== undefined) {
      updateData.quotedPrice = quotedPrice
    }

    const updatedQuote = await prisma.quoteRequest.update({
      where: { id: quoteId },
      data: updateData,
      include: {
        assignedUser: {
          select: { name: true, email: true }
        }
      }
    })

    // إضافة رد على الطلب
    const responseData: any = {
      quoteId: quoteId,
      message: message,
      isInternal: false,
      createdBy: user.id
    }

    if (attachments) {
      responseData.attachments = JSON.stringify(attachments)
    }

    await prisma.quoteResponse.create({
      data: responseData
    })

    // TODO: هنا يمكن إضافة إرسال البريد الإلكتروني الفعلي
    console.log('إرسال عرض سعر للعميل:', updatedQuote.email)

    return NextResponse.json({
      message: 'تم إرسال عرض السعر بنجاح',
      success: true
    })

  } catch (error) {
    console.error('Send quote API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في إرسال عرض السعر', error: error instanceof Error ? error.message : 'خطأ غير معروف' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handleGET)
export const PUT = withAuth(handlePUT)
export const POST = withAuth(handlePOST)
