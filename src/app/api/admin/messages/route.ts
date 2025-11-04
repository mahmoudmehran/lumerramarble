import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

/**
 * GET - Get all contact messages
 * Only accessible by authenticated admin users
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch all contact messages, ordered by newest first
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      messages
    })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create a new contact message (public endpoint - moved from /api/contact)
 * This is kept for backwards compatibility
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, subject, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Create contact message
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject: subject || null,
        message,
        status: 'NEW'
      }
    })

    return NextResponse.json({
      success: true,
      message: contactMessage
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating contact message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
