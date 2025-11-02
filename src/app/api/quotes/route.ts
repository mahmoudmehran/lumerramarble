import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { sendNewQuoteNotificationToAdmin, sendQuoteConfirmationToCustomer } from '../../../lib/email'
import { formLimiter, getClientIdentifier } from '../../../lib/rate-limit'
import { sanitizeString, validateEmail, validatePhone } from '../../../lib/validation'

export async function POST(request: NextRequest) {
  try {
    // ✅ Rate Limiting - منع الـ spam
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await formLimiter.check(identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          message: 'لقد تجاوزت الحد المسموح من الطلبات. حاول مرة أخرى بعد قليل.',
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

    const formData = await request.json()
    
    // ✅ Verify reCAPTCHA token if provided
    if (formData.recaptchaToken) {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY
      
      if (secretKey) {
        try {
          const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
          const verifyResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${formData.recaptchaToken}`,
          })
          
          const verifyData = await verifyResponse.json()
          
          // Check reCAPTCHA score (0.0 - 1.0)
          if (!verifyData.success || (verifyData.score && verifyData.score < 0.5)) {
            return NextResponse.json(
              { message: 'فشل التحقق الأمني. يبدو أن هذا الطلب مشبوه.' },
              { status: 403 }
            )
          }
        } catch (error) {
          console.error('reCAPTCHA verification error:', error)
          // Continue even if reCAPTCHA fails to avoid blocking legitimate users
        }
      }
    }

    // ✅ Input Validation & Sanitization
    const fullName = sanitizeString(formData.fullName || '')
    const email = sanitizeString(formData.email || '')
    const phone = sanitizeString(formData.phone || '')
    const country = sanitizeString(formData.country || '')
    const projectType = sanitizeString(formData.projectType || '')
    const productName = sanitizeString(formData.productName || formData.productType || '') // Support both productName and productType
    
    // التحقق من الحقول المطلوبة
    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { message: 'الاسم يجب أن يكون على الأقل حرفين' },
        { status: 400 }
      )
    }

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      )
    }

    if (!phone || !validatePhone(phone)) {
      return NextResponse.json(
        { message: 'رقم الهاتف غير صحيح' },
        { status: 400 }
      )
    }

    if (!country || !projectType || !productName) {
      return NextResponse.json(
        { message: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }

    const quantity = parseInt(formData.quantity)
    if (!quantity || quantity < 1 || quantity > 1000000) {
      return NextResponse.json(
        { message: 'الكمية غير صحيحة' },
        { status: 400 }
      )
    }

    // ✅ حفظ البيانات النظيفة في قاعدة البيانات
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        fullName,
        email,
        phone,
        company: formData.company ? sanitizeString(formData.company) : null,
        country,
        city: formData.city ? sanitizeString(formData.city) : null,
        projectType,
        projectName: formData.projectName ? sanitizeString(formData.projectName) : null,
        expectedDate: formData.expectedDate ? new Date(formData.expectedDate) : null,
        budget: formData.budget ? sanitizeString(formData.budget) : null,
        productType: productName, // Save productName in productType field
        quantity: quantity.toString(), // تحويل إلى string لأن schema يستخدم String
        thickness: formData.thickness ? sanitizeString(formData.thickness) : null,
        finish: formData.finish ? sanitizeString(formData.finish) : null,
        dimensions: formData.dimensions ? sanitizeString(formData.dimensions) : null,
        color: formData.color ? sanitizeString(formData.color) : null,
        message: formData.message ? sanitizeString(formData.message) : null,
        attachments: formData.attachments ? JSON.stringify(formData.attachments) : undefined,
        status: 'PENDING'
      }
    })

    // إرسال إيميل للإدارة والعميل
    try {
      await sendNewQuoteNotificationToAdmin(quoteRequest)
      await sendQuoteConfirmationToCustomer(quoteRequest)
      console.log('✅ Emails sent successfully for quote:', quoteRequest.id)
    } catch (emailError) {
      console.error('⚠️ Failed to send email notifications:', emailError)
    }

    return NextResponse.json({
      message: 'تم إرسال طلب العرض بنجاح',
      quoteId: quoteRequest.id,
      success: true
    }, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString()
      }
    })

  } catch (error) {
    console.error('Quote request API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في إرسال الطلب' },
      { status: 500 }
    )
  }
}
