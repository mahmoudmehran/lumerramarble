import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../../lib/db'
import { authLimiter, getClientIdentifier } from '../../../../lib/rate-limit'
import { sanitizeString, validateEmail } from '../../../../lib/validation'

export async function POST(request: NextRequest) {
  try {
    // ✅ Rate Limiting - منع brute force attacks
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await authLimiter.check(identifier)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          message: 'لقد تجاوزت الحد المسموح من محاولات تسجيل الدخول. حاول مرة أخرى بعد 15 دقيقة.',
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

    const body = await request.json()
    
    // ✅ Input Validation & Sanitization
    const email = sanitizeString(body.email || '')
    const password = body.password || ''

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      )
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف' },
        { status: 400 }
      )
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        active: true
      }
    })

    if (!user || !user.active) {
      return NextResponse.json(
        { message: 'بيانات تسجيل الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول لهذه الصفحة' },
        { status: 403 }
      )
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { message: 'بيانات تسجيل الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'بيانات تسجيل الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // Return success response
    return NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.reset.toString()
      }
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
