import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

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

    // هنا يمكن إضافة إرسال إيميل للإدارة
    
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