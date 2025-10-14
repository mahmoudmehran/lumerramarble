import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: string
  email: string
  role: string
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lumerra-marble-jwt-secret-key-2024') as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function withAuth(handler: (req: NextRequest, user: TokenPayload) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { message: 'رمز المصادقة مطلوب' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix
      const user = verifyToken(token)

      if (!user) {
        return NextResponse.json(
          { message: 'رمز المصادقة غير صحيح' },
          { status: 401 }
        )
      }

      if (user.role !== 'ADMIN') {
        return NextResponse.json(
          { message: 'غير مصرح لك بالوصول' },
          { status: 403 }
        )
      }

      return handler(req, user)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { message: 'خطأ في التحقق من الهوية' },
        { status: 500 }
      )
    }
  }
}
