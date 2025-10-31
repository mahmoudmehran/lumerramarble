# 🔐 Security & Performance Testing Guide
# دليل اختبار الأمان والأداء

تم إضافة عدة ميزات أمان وأداء للمشروع. هذا الدليل يوضح كيفية اختبارها.

---

## ✅ الميزات المضافة

### 1️⃣ Rate Limiting (تحديد معدل الطلبات)

#### أنواع Rate Limiting:
- **API Rate Limit**: 10 طلبات/دقيقة لكل IP
- **Form Rate Limit**: 3 طلبات/ساعة للنماذج (Contact, Quote)
- **Auth Rate Limit**: 5 محاولات تسجيل دخول/15 دقيقة

#### كيفية الاختبار:
```bash
# اختبار API Rate Limit
# أرسل أكثر من 10 طلبات في دقيقة واحدة
for i in {1..15}; do
  curl http://localhost:3000/api/products
  echo "Request $i"
done
# المتوقع: بعد الطلب العاشر، ستحصل على 429 Too Many Requests

# اختبار Form Rate Limit
# أرسل نموذج اتصال أكثر من 3 مرات في ساعة
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'

# اختبار Auth Rate Limit
# حاول تسجيل دخول خاطئ أكثر من 5 مرات
for i in {1..7}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@email.com","password":"wrongpassword"}'
done
```

---

### 2️⃣ Input Validation (التحقق من المدخلات)

تم استخدام Zod لإنشاء schemas للتحقق من صحة البيانات.

#### الـ Schemas الموجودة:
- `quoteRequestSchema`: للتحقق من طلبات الأسعار
- `contactFormSchema`: للتحقق من نموذج الاتصال
- `loginSchema`: للتحقق من تسجيل الدخول
- `productSchema`: للتحقق من بيانات المنتجات
- `blogPostSchema`: للتحقق من مقالات المدونة

#### كيفية الاختبار:

**1. اختبار Quote Request Validation:**
```bash
# طلب صحيح
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "محمد أحمد",
    "email": "mohamed@example.com",
    "phone": "+201234567890",
    "country": "Egypt",
    "projectType": "Commercial",
    "productType": "Marble"
  }'

# طلب خاطئ (بريد إلكتروني غير صحيح)
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "محمد أحمد",
    "email": "invalid-email",
    "phone": "+201234567890",
    "country": "Egypt"
  }'
# المتوقع: خطأ validation
```

**2. اختبار Contact Form Validation:**
```bash
# نموذج صحيح
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+201234567890",
    "message": "رسالة اختبار طويلة تحتوي على أكثر من 10 أحرف"
  }'

# نموذج خاطئ (رسالة قصيرة جداً)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد",
    "email": "ahmed@example.com",
    "message": "قصير"
  }'
# المتوقع: خطأ validation
```

---

### 3️⃣ CORS Headers (التحكم في الوصول)

تم تكوين CORS للسماح فقط للنطاقات المصرح بها.

#### الإعدادات الحالية:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://lumerramarble.com',
  'https://www.lumerramarble.com'
]
```

#### كيفية الاختبار:
```bash
# طلب من أصل مسموح
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS http://localhost:3000/api/products

# طلب من أصل غير مسموح
curl -H "Origin: http://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:3000/api/products
# المتوقع: عدم وجود Access-Control-Allow-Origin header
```

---

### 4️⃣ Security Headers (رؤوس الأمان)

تم إضافة Security Headers في `next.config.ts`:

- **X-Frame-Options**: منع embedding الموقع في iframes
- **X-Content-Type-Options**: منع MIME type sniffing
- **Referrer-Policy**: التحكم في معلومات الـ referrer
- **Permissions-Policy**: تعطيل ميزات غير مطلوبة

#### كيفية الاختبار:
```bash
# افحص الـ headers
curl -I http://localhost:3000

# يجب أن تظهر:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# Referrer-Policy: origin-when-cross-origin
```

---

### 5️⃣ Error Handling (معالجة الأخطاء)

تم إنشاء نظام شامل لمعالجة الأخطاء.

#### المكونات:
- `ErrorBoundary.tsx`: للأخطاء العامة
- `PageErrorBoundary.tsx`: لأخطاء الصفحات
- `APIErrorBoundary.tsx`: لأخطاء API
- `global-error.tsx`: معالج الأخطاء الشامل
- `error.tsx`: معالج أخطاء الصفحات
- `not-found.tsx`: صفحة 404

#### كيفية الاختبار:
1. **اختبار 404:**
   - اذهب إلى: `http://localhost:3000/page-does-not-exist`
   - المتوقع: صفحة 404 مخصصة

2. **اختبار خطأ في الصفحة:**
   - يمكن إضافة كود يرمي خطأاً في أي صفحة
   - المتوقع: ظهور ErrorBoundary

---

## 🧪 اختبارات متقدمة

### اختبار الأداء مع Artillery

قم بتثبيت Artillery:
```bash
npm install -g artillery
```

إنشاء ملف اختبار `artillery-test.yml`:
```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Test Products API"
    flow:
      - get:
          url: "/api/products"
      - think: 1
```

تشغيل الاختبار:
```bash
artillery run artillery-test.yml
```

---

### اختبار الأمان مع OWASP ZAP

1. قم بتحميل [OWASP ZAP](https://www.zaproxy.org/download/)
2. قم بتشغيل المشروع: `npm run dev`
3. في ZAP، أدخل URL: `http://localhost:3000`
4. ابدأ المسح التلقائي
5. راجع التقرير للثغرات الأمنية

---

## 📊 المقاييس المتوقعة

### ✅ معايير النجاح:

1. **Rate Limiting:**
   - ✅ رفض الطلبات الزائدة
   - ✅ رسائل خطأ واضحة
   - ✅ إعادة تعيين العدادات بعد الوقت المحدد

2. **Input Validation:**
   - ✅ رفض البيانات غير الصحيحة
   - ✅ رسائل خطأ واضحة ومفيدة
   - ✅ قبول البيانات الصحيحة فقط

3. **CORS:**
   - ✅ السماح للنطاقات المصرح بها
   - ✅ رفض النطاقات غير المصرح بها

4. **Security Headers:**
   - ✅ جميع الـ headers موجودة في الاستجابة
   - ✅ القيم صحيحة

5. **Error Handling:**
   - ✅ لا تظهر معلومات حساسة في الأخطاء
   - ✅ تجربة مستخدم جيدة عند الأخطاء
   - ✅ تسجيل الأخطاء في console (development)

---

## 🔧 التكوين

### تخصيص Rate Limits

في ملف API الخاص بك:
```typescript
import { apiRateLimiter, formRateLimiter, authRateLimiter } from '@/lib/rate-limit'

// استخدام API Rate Limiter
const limitResult = await apiRateLimiter.check(ip)

// تخصيص الحدود
const customLimiter = new RateLimiter(20, 60 * 1000) // 20 طلب/دقيقة
```

### تخصيص CORS

في `middleware.ts` أو في route handlers:
```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://yourdomain.com'
]
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: Rate Limiting لا يعمل
**الحل:**
- تأكد من وجود IP صحيح في الطلب
- تحقق من الـ console للرسائل
- تأكد من استخدام الـ limiter الصحيح

### المشكلة: Validation يرفض بيانات صحيحة
**الحل:**
- راجع الـ schema في `src/lib/validation.ts`
- تحقق من رسائل الخطأ
- استخدم `console.log` لطباعة البيانات

### المشكلة: CORS يرفض طلبات من localhost
**الحل:**
- تأكد من إضافة `http://localhost:3000` في allowedOrigins
- راجع الـ headers في الطلب

---

## 📝 الخلاصة

تم إضافة طبقات أمان وأداء شاملة:
- ✅ Rate Limiting لمنع الإساءة
- ✅ Input Validation للحماية من البيانات الضارة
- ✅ CORS للتحكم في الوصول
- ✅ Security Headers للحماية الإضافية
- ✅ Error Handling لتجربة مستخدم أفضل
- ✅ Loading States لتجربة مستخدم سلسة
- ✅ Search Functionality للبحث المتقدم
- ✅ Google Analytics للتحليلات

**الخطوة التالية:** اختبر كل ميزة يدوياً أو باستخدام الأدوات المذكورة أعلاه.
