import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { sendContactNotification } from '../../../lib/email'
import { formLimiter, getClientIdentifier } from '../../../lib/rate-limit'
import { contactFormSchema, validateData } from '../../../lib/validation'

export async function POST(request: NextRequest) {
  try {
    // ✅ Rate Limiting - منع الـ spam
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await formLimiter.check(identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'لقد تجاوزت الحد المسموح من الطلبات. حاول مرة أخرى بعد قليل.',
          retryAfter: rateLimitResult.reset
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString()
          }
        }
      )
    }

    // ✅ Input Validation & Sanitization
    const rawData = await request.json()
    
    // ✅ Verify reCAPTCHA token if provided
    if (rawData.recaptchaToken) {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY
      
      if (secretKey) {
        try {
          const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
          const verifyResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${rawData.recaptchaToken}`,
          })
          
          const verifyData = await verifyResponse.json()
          
          // Check reCAPTCHA score (0.0 - 1.0)
          if (!verifyData.success || (verifyData.score && verifyData.score < 0.5)) {
            return NextResponse.json(
              { error: 'فشل التحقق الأمني. يبدو أن هذا الطلب مشبوه.' },
              { status: 403 }
            )
          }
        } catch (error) {
          console.error('reCAPTCHA verification error:', error)
          // Continue even if reCAPTCHA fails to avoid blocking legitimate users
        }
      }
    }
    
    const validationResult = await validateData(contactFormSchema, rawData)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'البيانات المدخلة غير صحيحة',
          errors: validationResult.errors
        },
        { status: 400 }
      )
    }

    const data = validationResult.data
    
    // ✅ حفظ في قاعدة البيانات
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: rawData.company || '', // Support company field from raw data
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
    }, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString()
      }
    })
  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json({ 
      error: 'حدث خطأ في إرسال الرسالة. حاول مرة أخرى.' 
    }, { status: 500 })
  }
}