# 🔒 Security & Performance Optimization Guide

## نظام الأمان والحماية المطبق

### ✅ 1. Rate Limiting System

نظام شامل لمنع الـ spam والـ brute force attacks على جميع API endpoints.

#### الملف: `src/lib/rate-limit.ts`

**الميزات:**
- ✅ تخزين مؤقت في الذاكرة (In-Memory Storage)
- ✅ تنظيف تلقائي للبيانات القديمة كل 10 دقائق
- ✅ استخراج IP من headers مختلفة (x-forwarded-for, x-real-ip, cf-connecting-ip)
- ✅ ثلاثة أنواع من Rate Limiters:

**أنواع Rate Limiters:**

1. **API Limiter** - للـ API endpoints العامة
   - الحد: 10 طلبات في الدقيقة
   - الاستخدام: `/api/products`, `/api/blog`, etc.

2. **Form Limiter** - للنماذج (Contact & Quote)
   - الحد: 3 طلبات في الساعة
   - الاستخدام: `/api/contact`, `/api/quotes`

3. **Auth Limiter** - لتسجيل الدخول
   - الحد: 5 محاولات في 15 دقيقة
   - الاستخدام: `/api/auth/login`

**Response Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 45
```

**مثال الاستخدام:**
```typescript
import { formLimiter, getClientIdentifier } from '@/lib/rate-limit'

const identifier = getClientIdentifier(request)
const rateLimitResult = await formLimiter.check(identifier)

if (!rateLimitResult.success) {
  return NextResponse.json({ 
    error: 'Too many requests' 
  }, { status: 429 })
}
```

---

### ✅ 2. Input Validation & Sanitization

نظام متكامل للتحقق من المدخلات ومنع XSS و SQL Injection.

#### الملف: `src/lib/validation.ts`

**الميزات:**
- ✅ استخدام Zod للـ schema validation
- ✅ استخدام validator للـ sanitization
- ✅ تنظيف تلقائي من HTML tags
- ✅ التحقق من البريد الإلكتروني وأرقام الهاتف
- ✅ دعم الأرقام المصرية والدولية

**Schemas المتوفرة:**

1. **contactFormSchema** - نموذج الاتصال
2. **quoteFormSchema** - نموذج طلب العرض (4 خطوات)
3. **loginSchema** - تسجيل الدخول
4. **productSchema** - إضافة/تعديل المنتجات
5. **blogPostSchema** - إضافة/تعديل المقالات

**مثال الاستخدام:**
```typescript
import { contactFormSchema, validateData } from '@/lib/validation'

const result = await validateData(contactFormSchema, data)

if (!result.success) {
  return NextResponse.json({ 
    errors: result.errors 
  }, { status: 400 })
}

// استخدام البيانات النظيفة
const cleanData = result.data
```

**Validation Functions:**
```typescript
// تنظيف النصوص
const clean = sanitizeString(userInput)

// التحقق من البريد الإلكتروني
if (!validateEmail(email)) { ... }

// التحقق من رقم الهاتف
if (!validatePhone(phone)) { ... }
```

---

### ✅ 3. CORS Security

حماية الـ API من الطلبات غير المصرح بها.

#### الملف: `src/lib/cors.ts`

**الميزات:**
- ✅ قائمة بالـ origins المسموح بها
- ✅ دعم localhost للتطوير
- ✅ Security headers شاملة
- ✅ معالجة OPTIONS requests (preflight)

**Allowed Origins:**
```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://lumerramarble.com',
  'https://www.lumerramarble.com'
]
```

**Security Headers المطبقة:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: ...
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**مثال الاستخدام:**
```typescript
import { getCorsHeaders, withCors } from '@/lib/cors'

// إضافة CORS headers للـ response
const response = NextResponse.json({ data })
return withCors(response, request)
```

---

### ✅ 4. Middleware Integration

تطبيق الحماية تلقائياً على جميع API routes.

#### الملف: `src/middleware.ts`

**الميزات:**
- ✅ CORS headers تلقائية لكل API requests
- ✅ Security headers لجميع الـ responses
- ✅ معالجة OPTIONS requests
- ✅ حماية منطقة الإدارة (Admin)
- ✅ دعم اللغات المتعددة

**التطبيق التلقائي:**
- جميع endpoints في `/api/*` محمية بـ CORS
- Security headers مضافة تلقائياً
- Rate limiting مطبق على endpoints الحساسة

---

## API Endpoints المحمية

### 1. Contact Form API
**Endpoint:** `POST /api/contact`

**الحماية المطبقة:**
- ✅ Rate Limiting: 3 طلبات/ساعة
- ✅ Input Validation: contactFormSchema
- ✅ Sanitization: جميع النصوص
- ✅ CORS: مطبق من middleware

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال رسالتك بنجاح",
  "id": "clx..."
}
```

---

### 2. Quote Request API
**Endpoint:** `POST /api/quotes`

**الحماية المطبقة:**
- ✅ Rate Limiting: 3 طلبات/ساعة
- ✅ Input Validation: Custom validation
- ✅ Sanitization: جميع الحقول
- ✅ Email/Phone validation

**Validated Fields:**
```typescript
{
  fullName: string (2-100 chars),
  email: string (valid email),
  phone: string (valid phone),
  country: string,
  projectType: string,
  productType: string,
  quantity: number (1-1000000)
}
```

---

### 3. Admin Login API
**Endpoint:** `POST /api/auth/login`

**الحماية المطبقة:**
- ✅ Rate Limiting: 5 محاولات/15 دقيقة (منع brute force)
- ✅ Input Validation: loginSchema
- ✅ Email validation
- ✅ Password length check (min 8 chars)
- ✅ bcrypt password hashing

**Response:**
```json
{
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJ...",
  "user": {
    "id": "...",
    "email": "...",
    "name": "...",
    "role": "ADMIN"
  }
}
```

---

## أمثلة كاملة للاستخدام

### مثال 1: إضافة Rate Limiting لـ endpoint جديد

```typescript
import { apiLimiter, getClientIdentifier } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // تطبيق Rate Limiting
  const identifier = getClientIdentifier(request)
  const rateLimitResult = await apiLimiter.check(identifier)
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
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

  // بقية الكود...
}
```

### مثال 2: إضافة Validation لـ endpoint جديد

```typescript
import { validateData, sanitizeString } from '@/lib/validation'
import { z } from 'zod'

// تعريف Schema
const myFormSchema = z.object({
  name: z.string()
    .min(2, 'الاسم قصير جداً')
    .max(100, 'الاسم طويل جداً')
    .transform(sanitizeString),
  
  email: z.string()
    .email('البريد الإلكتروني غير صحيح')
})

export async function POST(request: NextRequest) {
  const rawData = await request.json()
  
  // التحقق من البيانات
  const result = await validateData(myFormSchema, rawData)
  
  if (!result.success) {
    return NextResponse.json(
      { errors: result.errors },
      { status: 400 }
    )
  }

  // استخدام البيانات النظيفة
  const cleanData = result.data
  
  // حفظ في قاعدة البيانات...
}
```

---

## نصائح الأمان

### ✅ Do's (افعل)

1. **استخدم Rate Limiting دائماً** على endpoints الحساسة
2. **تحقق من المدخلات** قبل حفظها في قاعدة البيانات
3. **نظف النصوص** من HTML و special characters
4. **استخدم HTTPS** في الإنتاج
5. **احفظ JWT_SECRET** في متغيرات البيئة
6. **راجع الـ ALLOWED_ORIGINS** قبل النشر

### ❌ Don'ts (لا تفعل)

1. **لا تثق في المدخلات** من المستخدم مباشرة
2. **لا تخزن كلمات المرور** بدون hashing
3. **لا تعرض أخطاء مفصلة** للمستخدم النهائي
4. **لا تستخدم eval()** مع مدخلات المستخدم
5. **لا تتجاهل Rate Limiting** على أي endpoint
6. **لا تنسى تحديث ALLOWED_ORIGINS** للإنتاج

---

## Environment Variables المطلوبة

```env
# JWT Secret (مطلوب)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Database (مطلوب)
DATABASE_URL="file:./dev.db"

# Email (اختياري)
RESEND_API_KEY=re_...

# Production Domain (مطلوب في الإنتاج)
NEXT_PUBLIC_SITE_URL=https://lumerramarble.com
```

---

## Testing Security

### اختبار Rate Limiting

```bash
# إرسال عدة طلبات متتالية
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","phone":"01234567890","subject":"Test","message":"Testing rate limit"}'
  echo ""
  sleep 1
done
```

### اختبار Input Validation

```bash
# محاولة XSS attack
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(\"XSS\")</script>","email":"test@test.com","phone":"01234567890","subject":"Test","message":"Test"}'
```

### اختبار CORS

```bash
# طلب من origin غير مسموح
curl -X POST http://localhost:3000/api/contact \
  -H "Origin: https://evil-site.com" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"01234567890","subject":"Test","message":"Test"}'
```

---

## Next Steps

1. ✅ **إضافة Redis** للـ Rate Limiting في الإنتاج
2. ✅ **إضافة Honeypot fields** في النماذج
3. ✅ **إضافة Google reCAPTCHA** للنماذج المهمة
4. ✅ **إضافة IP Blacklisting** للمستخدمين المسيئين
5. ✅ **إضافة Audit Logging** لتتبع العمليات الحساسة
6. ✅ **إضافة 2FA** لحسابات الإدارة

---

## الخلاصة

تم تطبيق نظام أمان شامل يشمل:
- ✅ Rate Limiting (منع spam والـ brute force)
- ✅ Input Validation (منع XSS و SQL Injection)
- ✅ CORS Security (حماية API)
- ✅ Security Headers (حماية متصفح)
- ✅ Sanitization (تنظيف المدخلات)

النظام جاهز للاستخدام ويوفر حماية قوية ضد معظم الهجمات الشائعة.
