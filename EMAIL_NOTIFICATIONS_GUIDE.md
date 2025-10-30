# نظام الإشعارات عبر البريد الإلكتروني - Email Notifications System

## 📧 الميزات

### ✅ ما تم تنفيذه:

1. **Email Service Provider**
   - استخدام Resend API (الأفضل والأسهل)
   - Fallback إلى SMTP التقليدي إذا لزم الأمر

2. **Email Templates (3 أنواع)**
   - 📋 **Quote Notification to Admin**: إشعار الإدارة بطلب جديد
   - ✉️ **Quote Confirmation to Customer**: تأكيد للعميل
   - 📩 **Contact Form Notification**: إشعار برسالة اتصال جديدة

3. **Features**
   - تصميم HTML احترافي
   - RTL Support للعربية
   - Responsive design
   - معلومات تفصيلية منسقة
   - روابط سريعة للوحة التحكم

---

## 🚀 الإعداد (Setup)

### 1. الحصول على Resend API Key

1. اذهب إلى [resend.com](https://resend.com)
2. أنشئ حساب مجاني
3. احصل على API Key من Dashboard
4. أضف الـ API Key في `.env`:

```bash
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxx"
SMTP_FROM="noreply@lumerramarble.com"
ADMIN_EMAIL="info@lumerramarble.com"
NEXT_PUBLIC_APP_URL="https://lumerramarble.com"
```

### 2. إعداد Domain (للإنتاج)

في Resend Dashboard:
- أضف domain الخاص بك (مثال: lumerramarble.com)
- أضف DNS records المطلوبة
- انتظر التفعيل (عادة بضع دقائق)

---

## 📝 استخدام النظام

### في Quote Request API

```typescript
import { sendNewQuoteNotificationToAdmin, sendQuoteConfirmationToCustomer } from '@/lib/email'

// بعد إنشاء الطلب في قاعدة البيانات
const quoteRequest = await prisma.quoteRequest.create({...})

// إرسال الإيميلات
await sendNewQuoteNotificationToAdmin(quoteRequest)
await sendQuoteConfirmationToCustomer(quoteRequest)
```

### في Contact Form API

```typescript
import { sendContactNotification } from '@/lib/email'

// بعد حفظ الرسالة
await sendContactNotification({
  name: data.name,
  email: data.email,
  phone: data.phone,
  message: data.message
})
```

---

## 🎨 Email Templates

### 1. Quote Notification to Admin

**المحتوى:**
- 🔔 عنوان جذاب
- معلومات العميل (الاسم، البريد، الهاتف، الشركة، البلد)
- تفاصيل المشروع (نوع المشروع، التاريخ، الميزانية)
- المنتج المطلوب (النوع، الكمية، السماكة، التشطيب، الأبعاد، اللون)
- رسالة إضافية (إن وجدت)
- زر سريع للوحة التحكم

**التصميم:**
- Header برتقالي بتدرج جميل
- أقسام منظمة بخلفية رمادية فاتحة
- معلومات واضحة في صفوف
- Footer بمعلومات الشركة

### 2. Quote Confirmation to Customer

**المحتوى:**
- ✓ علامة صح كبيرة
- رسالة ترحيبية شخصية
- ملخص الطلب
- خطوات ما سيحدث بعد ذلك
- معلومات التواصل (إيميل، واتساب، موقع)

**التصميم:**
- Header مميز مع checkmark
- Highlight box للملخص
- Contact info box بلون داكن
- تصميم احترافي يعكس هوية الشركة

### 3. Contact Form Notification

**المحتوى:**
- 📩 عنوان بسيط
- الاسم والبريد والهاتف
- نص الرسالة كامل

---

## 🔧 Functions Reference

### sendEmail(options)

إرسال إيميل عام

```typescript
await sendEmail({
  to: 'customer@example.com',
  subject: 'مرحباً',
  html: '<h1>مرحباً بك</h1>',
  text: 'مرحباً بك'  // اختياري
})
```

### sendNewQuoteNotificationToAdmin(quoteData)

إشعار الإدارة بطلب جديد

```typescript
await sendNewQuoteNotificationToAdmin({
  fullName: 'محمد أحمد',
  email: 'customer@example.com',
  phone: '+20123456789',
  // ... باقي البيانات
})
```

### sendQuoteConfirmationToCustomer(quoteData)

تأكيد للعميل

```typescript
await sendQuoteConfirmationToCustomer({
  fullName: 'محمد أحمد',
  email: 'customer@example.com',
  productType: 'Marble',
  projectType: 'مشروع فيلا',
  // ... باقي البيانات
})
```

### sendContactNotification(contactData)

إشعار برسالة اتصال

```typescript
await sendContactNotification({
  name: 'محمد أحمد',
  email: 'customer@example.com',
  phone: '+20123456789',
  message: 'أريد الاستفسار عن...'
})
```

---

## 📊 Resend Free Plan Limits

- ✅ **100 emails/day** (مجاناً)
- ✅ **3,000 emails/month** (مجاناً)
- ✅ Unlimited domains
- ✅ Webhook support
- ✅ Email analytics

للترقية: $20/month لـ 50,000 email

---

## 🧪 Testing

### في Development

```bash
# 1. أضف API key في .env
RESEND_API_KEY="re_test_xxxxxxxxx"

# 2. شغل السيرفر
npm run dev

# 3. جرب إرسال quote request من الموقع
# سيتم إرسال الإيميلات تلقائياً
```

### Test Email

يمكنك إنشاء API endpoint للاختبار:

```typescript
// src/app/api/test-email/route.ts
import { sendEmail } from '@/lib/email'

export async function GET() {
  await sendEmail({
    to: 'your-email@example.com',
    subject: 'Test Email',
    html: '<h1>This is a test</h1>'
  })
  
  return Response.json({ success: true })
}
```

ثم اذهب إلى: `http://localhost:3000/api/test-email`

---

## 🔒 Security Best Practices

1. **لا تشارك API Key** - أبقيه في `.env` فقط
2. **استخدم Environment Variables** - لا تكتب الـ keys في الكود
3. **Validate Input** - تحقق من البيانات قبل الإرسال
4. **Rate Limiting** - حدد عدد الإيميلات (قريباً)

---

## 📦 Dependencies

```json
{
  "resend": "^4.0.1"
}
```

---

## 🚨 Troubleshooting

### الإيميل لم يصل

1. ✅ تأكد من صحة RESEND_API_KEY
2. ✅ تحقق من console logs
3. ✅ تأكد من تفعيل domain في Resend
4. ✅ افحص spam folder
5. ✅ تحقق من Resend Dashboard → Logs

### Domain Not Verified

1. أضف DNS records في domain provider
2. انتظر 5-10 دقائق للـ propagation
3. اضغط "Verify" في Resend Dashboard

### API Rate Limited

- Free plan: 100/day, 3,000/month
- للزيادة: Upgrade plan

---

## 📝 TODO - التحسينات المستقبلية

- [ ] Email queue system (Bull/Redis)
- [ ] Email templates builder
- [ ] Unsubscribe functionality
- [ ] Email tracking (opens, clicks)
- [ ] Resend webhooks integration
- [ ] Multi-language email templates
- [ ] Email scheduling

---

## 📞 Support

- **Resend Docs**: https://resend.com/docs
- **Resend Status**: https://status.resend.com

---

**تاريخ الإنشاء**: 30 أكتوبر 2025  
**الحالة**: ✅ جاهز للاستخدام  
**Provider**: Resend
