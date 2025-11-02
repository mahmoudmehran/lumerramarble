import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No reCAPTCHA token provided' },
        { status: 400 }
      )
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not configured')
      // في حالة عدم وجود المفتاح، نسمح بالطلب (لتجنب تعطيل الموقع)
      return NextResponse.json({ success: true, score: 1.0 })
    }

    // Verify the token with Google
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const verifyData = await verifyResponse.json()

    if (!verifyData.success) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification failed', details: verifyData },
        { status: 400 }
      )
    }

    // reCAPTCHA v3 returns a score (0.0 - 1.0)
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    const score = verifyData.score || 0
    const threshold = 0.5 // Minimum acceptable score

    if (score < threshold) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Low reCAPTCHA score', 
          score,
          message: 'Your request appears suspicious. Please try again.'
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      score,
      message: 'reCAPTCHA verification successful'
    })

  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    // في حالة خطأ في التحقق، نسمح بالطلب (لتجنب تعطيل الموقع)
    return NextResponse.json({ success: true, score: 1.0 })
  }
}
