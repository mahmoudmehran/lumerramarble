import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { sendContactNotification } from '../../../lib/email'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        company: data.company || '',
        subject: data.subject,
        message: data.message
      }
    })

    // إرسال إيميل للإدارة
    try {
      await sendContactNotification(data)
      console.log('✅ Contact notification email sent')
    } catch (emailError) {
      console.error('⚠️ Failed to send contact notification:', emailError)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم إرسال رسالتك بنجاح',
      id: message.id 
    })
  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}