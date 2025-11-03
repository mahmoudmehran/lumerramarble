import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../../lib/db'
import { authLimiter, getClientIdentifier } from '../../../../lib/rate-limit'
import { sanitizeString, validateEmail } from '../../../../lib/validation'
import { 
  checkIPAccess, 
  checkLoginAttempts, 
  recordFailedLogin, 
  resetLoginAttempts,
  blockIP
} from '../../../../lib/security'
import { getSiteSettings } from '../../../../lib/settings'

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request)
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
  
  try {
    // ✅ تحقق من IP Access Control
    const ipCheck = await checkIPAccess(clientIP)
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { message: 'الوصول مرفوض من عنوان IP الخاص بك' },
        { status: 403 }
      )
    }
    
    // ✅ تحقق من محاولات تسجيل الدخول الفاشلة
    const attemptCheck = await checkLoginAttempts(identifier)
    if (!attemptCheck.allowed) {
      const minutesLeft = attemptCheck.blockedUntil 
        ? Math.ceil((attemptCheck.blockedUntil - Date.now()) / 60000)
        : 30
      
      return NextResponse.json(
        { 
          message: `تم حظر حسابك مؤقتاً بسبب محاولات تسجيل دخول فاشلة متعددة. حاول مرة أخرى بعد ${minutesLeft} دقيقة.`,
          blockedUntil: attemptCheck.blockedUntil
        },
        { status: 429 }
      )
    }
    
    // ✅ Rate Limiting - منع brute force attacks
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
      await recordFailedLogin(identifier)
      return NextResponse.json(
        { message: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      )
    }

    if (!password || password.length < 8) {
      await recordFailedLogin(identifier)
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
      const failResult = await recordFailedLogin(identifier)
      
      // إذا وصل لعدد المحاولات القصوى، حظر IP مؤقتاً
      if (failResult.blocked) {
        blockIP(clientIP)
      }
      
      return NextResponse.json(
        { 
          message: 'بيانات تسجيل الدخول غير صحيحة',
          attemptsLeft: failResult.attemptsLeft
        },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      await recordFailedLogin(identifier)
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول لهذه الصفحة' },
        { status: 403 }
      )
    }

    // Verify password
    if (!user.password) {
      await recordFailedLogin(identifier)
      return NextResponse.json(
        { message: 'بيانات تسجيل الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      const failResult = await recordFailedLogin(identifier)
      
      if (failResult.blocked) {
        blockIP(clientIP)
      }
      
      return NextResponse.json(
        { 
          message: 'بيانات تسجيل الدخول غير صحيحة',
          attemptsLeft: failResult.attemptsLeft
        },
        { status: 401 }
      )
    }

    // ✅ نجاح تسجيل الدخول - إعادة تعيين المحاولات
    resetLoginAttempts(identifier)
    
    // الحصول على إعدادات الجلسة
    const settings = await getSiteSettings()
    const sessionTimeout = settings.sessionTimeout || 60 // بالدقائق
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: `${sessionTimeout}m` }
    )

    // Return success response
    return NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      sessionTimeout: sessionTimeout * 60 * 1000, // milliseconds for frontend
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
    await recordFailedLogin(identifier)
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
