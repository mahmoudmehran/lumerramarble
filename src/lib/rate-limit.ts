/**
 * Rate Limiting System
 * يمنع الـ spam والـ brute force attacks على الـ API endpoints
 */

interface RateLimitConfig {
  interval: number // بالملي ثانية
  uniqueTokenPerInterval: number // عدد الطلبات المسموح بها
}

interface RateLimitStore {
  count: number
  resetTime: number
}

// تخزين مؤقت للطلبات
const rateLimitStore = new Map<string, RateLimitStore>()

/**
 * Rate limiter middleware
 * @param config - إعدادات الـ rate limiting
 */
export function rateLimit(config: RateLimitConfig) {
  const { interval, uniqueTokenPerInterval } = config

  return {
    check: async (identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> => {
      const now = Date.now()
      const key = identifier

      // الحصول على البيانات من التخزين
      let limitData = rateLimitStore.get(key)

      // إذا لم توجد بيانات أو انتهت الفترة، إنشاء جديد
      if (!limitData || now > limitData.resetTime) {
        limitData = {
          count: 0,
          resetTime: now + interval
        }
      }

      // زيادة العداد
      limitData.count++

      // حفظ في التخزين
      rateLimitStore.set(key, limitData)

      // حساب الوقت المتبقي
      const timeUntilReset = Math.ceil((limitData.resetTime - now) / 1000)

      // التحقق من تجاوز الحد
      const success = limitData.count <= uniqueTokenPerInterval

      return {
        success,
        limit: uniqueTokenPerInterval,
        remaining: Math.max(0, uniqueTokenPerInterval - limitData.count),
        reset: timeUntilReset
      }
    }
  }
}

/**
 * تنظيف التخزين من البيانات القديمة
 * يتم تشغيله كل 10 دقائق
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// تشغيل التنظيف التلقائي كل 10 دقائق
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000)
}

/**
 * استخراج IP من الطلب
 */
export function getClientIdentifier(request: Request): string {
  // محاولة الحصول على IP من headers مختلفة
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  // استخدام أول IP متاح
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  return ip
}

/**
 * إنشاء rate limiter للـ API endpoints
 */
export const apiLimiter = rateLimit({
  interval: 60 * 1000, // دقيقة واحدة
  uniqueTokenPerInterval: 10 // 10 طلبات في الدقيقة
})

/**
 * إنشاء rate limiter للـ contact و quote forms
 */
export const formLimiter = rateLimit({
  interval: 60 * 60 * 1000, // ساعة واحدة
  uniqueTokenPerInterval: 3 // 3 طلبات في الساعة
})

/**
 * إنشاء rate limiter للـ login
 */
export const authLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 دقيقة
  uniqueTokenPerInterval: 5 // 5 محاولات في 15 دقيقة
})
