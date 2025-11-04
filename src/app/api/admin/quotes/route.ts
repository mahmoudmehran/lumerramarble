import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { sendEmail } from '../../../../lib/email'

/**
 * GET - Get all quote requests
 * Accessible from admin panel
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch all quote requests, ordered by newest first
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        assignedUser: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      quotes
    })
  } catch (error) {
    console.error('Error fetching quote requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quote requests' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Update quote status
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updatedQuote = await prisma.quoteRequest.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      quote: updatedQuote
    })
  } catch (error) {
    console.error('Error updating quote status:', error)
    return NextResponse.json(
      { error: 'Failed to update quote status' },
      { status: 500 }
    )
  }
}

/**
 * POST - Send quote email to customer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quoteId, subject, message, quotedPrice } = body

    if (!quoteId || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get quote details
    const quote = await prisma.quoteRequest.findUnique({
      where: { id: quoteId }
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Send email
    await sendEmail({
      to: quote.email,
      subject: subject,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>عزيزي/عزيزتي ${quote.fullName}</h2>
          <p>${message}</p>
          ${quotedPrice ? `<p><strong>السعر المقترح:</strong> ${quotedPrice}</p>` : ''}
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            هذه رسالة تلقائية من نظام إدارة العروض
          </p>
        </div>
      `,
      text: `${message}\n${quotedPrice ? `السعر المقترح: ${quotedPrice}` : ''}`
    })

    // Update quote with quoted price if provided
    if (quotedPrice) {
      await prisma.quoteRequest.update({
        where: { id: quoteId },
        data: {
          quotedPrice,
          quotedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Quote email sent successfully'
    })
  } catch (error) {
    console.error('Error sending quote email:', error)
    return NextResponse.json(
      { error: 'Failed to send quote email' },
      { status: 500 }
    )
  }
}
