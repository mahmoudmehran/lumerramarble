import { getSiteSettings } from './settings'

// In-memory storage for login attempts (في بيئة production يجب استخدام Redis أو قاعدة بيانات)
const loginAttempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>()
const ipBlocklist = new Set<string>()

/**
 * تحقق من عنوان IP إذا كان محظوراً أو مسموحاً
 */
export async function checkIPAccess(ip: string): Promise<{ allowed: boolean; reason?: string }> {
  const settings = await getSiteSettings()
  
  // تحقق من القائمة البيضاء (IP المسموح بها)
  if (settings.allowedIPs) {
    const allowedList = settings.allowedIPs.split(',').map(ip => ip.trim()).filter(Boolean)
    if (allowedList.length > 0) {
      const isAllowed = allowedList.some(allowedIP => {
        if (allowedIP.includes('*')) {
          // دعم wildcards بسيط
          const regex = new RegExp('^' + allowedIP.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$')
          return regex.test(ip)
        }
        return allowedIP === ip
      })
      
      if (!isAllowed) {
        return { allowed: false, reason: 'IP not in whitelist' }
      }
    }
  }
  
  // تحقق من القائمة السوداء (IP المحظورة)
  if (settings.blockedIPs) {
    const blockedList = settings.blockedIPs.split(',').map(ip => ip.trim()).filter(Boolean)
    const isBlocked = blockedList.some(blockedIP => {
      if (blockedIP.includes('*')) {
        const regex = new RegExp('^' + blockedIP.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$')
        return regex.test(ip)
      }
      return blockedIP === ip
    })
    
    if (isBlocked || ipBlocklist.has(ip)) {
      return { allowed: false, reason: 'IP is blocked' }
    }
  }
  
  return { allowed: true }
}

/**
 * تسجيل محاولة تسجيل دخول فاشلة
 */
export async function recordFailedLogin(identifier: string): Promise<{ blocked: boolean; attemptsLeft: number }> {
  const settings = await getSiteSettings()
  const maxAttempts = settings.maxLoginAttempts || 5
  
  const now = Date.now()
  const attempt = loginAttempts.get(identifier) || { count: 0, lastAttempt: now }
  
  // إذا مر أكثر من 15 دقيقة، إعادة تعيين العداد
  const lockoutDuration = 15 * 60 * 1000 // 15 دقيقة
  if (now - attempt.lastAttempt > lockoutDuration && !attempt.blockedUntil) {
    attempt.count = 0
  }
  
  // إذا كان محظوراً، تحقق من انتهاء الحظر
  if (attempt.blockedUntil && now < attempt.blockedUntil) {
    return { blocked: true, attemptsLeft: 0 }
  } else if (attempt.blockedUntil && now >= attempt.blockedUntil) {
    // انتهى الحظر، إعادة تعيين
    attempt.count = 0
    attempt.blockedUntil = undefined
  }
  
  // زيادة عدد المحاولات
  attempt.count++
  attempt.lastAttempt = now
  
  // إذا تجاوز الحد الأقصى، حظر لمدة 30 دقيقة
  if (attempt.count >= maxAttempts) {
    attempt.blockedUntil = now + (30 * 60 * 1000) // 30 دقيقة
    loginAttempts.set(identifier, attempt)
    return { blocked: true, attemptsLeft: 0 }
  }
  
  loginAttempts.set(identifier, attempt)
  return { blocked: false, attemptsLeft: maxAttempts - attempt.count }
}

/**
 * التحقق من حالة محاولات تسجيل الدخول
 */
export async function checkLoginAttempts(identifier: string): Promise<{ allowed: boolean; attemptsLeft: number; blockedUntil?: number }> {
  const settings = await getSiteSettings()
  const maxAttempts = settings.maxLoginAttempts || 5
  
  const attempt = loginAttempts.get(identifier)
  if (!attempt) {
    return { allowed: true, attemptsLeft: maxAttempts }
  }
  
  const now = Date.now()
  
  // تحقق من الحظر
  if (attempt.blockedUntil && now < attempt.blockedUntil) {
    return { 
      allowed: false, 
      attemptsLeft: 0,
      blockedUntil: attempt.blockedUntil
    }
  }
  
  // إذا انتهى الحظر أو مرت فترة طويلة
  const lockoutDuration = 15 * 60 * 1000
  if (attempt.blockedUntil && now >= attempt.blockedUntil) {
    loginAttempts.delete(identifier)
    return { allowed: true, attemptsLeft: maxAttempts }
  }
  
  if (now - attempt.lastAttempt > lockoutDuration) {
    loginAttempts.delete(identifier)
    return { allowed: true, attemptsLeft: maxAttempts }
  }
  
  return { 
    allowed: true, 
    attemptsLeft: Math.max(0, maxAttempts - attempt.count)
  }
}

/**
 * إعادة تعيين محاولات تسجيل الدخول بعد نجاح
 */
export function resetLoginAttempts(identifier: string): void {
  loginAttempts.delete(identifier)
}

/**
 * التحقق من صلاحية الجلسة بناءً على وقت انتهاء الصلاحية
 */
export async function validateSession(loginTime: number): Promise<boolean> {
  const settings = await getSiteSettings()
  const sessionTimeout = (settings.sessionTimeout || 60) * 60 * 1000 // تحويل من دقائق إلى milliseconds
  
  const now = Date.now()
  const sessionAge = now - loginTime
  
  return sessionAge < sessionTimeout
}

/**
 * حظر IP مؤقتاً
 */
export function blockIP(ip: string): void {
  ipBlocklist.add(ip)
  
  // إزالة الحظر بعد ساعة واحدة
  setTimeout(() => {
    ipBlocklist.delete(ip)
  }, 60 * 60 * 1000)
}

/**
 * التحقق من تفعيل المصادقة الثنائية
 */
export async function isTwoFactorEnabled(): Promise<boolean> {
  const settings = await getSiteSettings()
  return settings.enableTwoFactor ?? false
}

/**
 * تنظيف البيانات القديمة (يُشغل دورياً)
 */
export function cleanupOldAttempts(): void {
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 ساعة
  
  for (const [identifier, attempt] of loginAttempts.entries()) {
    if (now - attempt.lastAttempt > maxAge) {
      loginAttempts.delete(identifier)
    }
  }
}

// تشغيل التنظيف كل ساعة
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldAttempts, 60 * 60 * 1000)
}
