# إصلاح مشكلة رفع الصور في لوحة التحكم

## التاريخ: 6 نوفمبر 2025
## الحالة: ✅ تم الإصلاح

---

## 🐛 المشكلة

عند محاولة رفع صورة من لوحة التحكم، كان يظهر الخطأ التالي:

```
Upload error: {}
فشل في رفع الصورة: 400
```

---

## 🔍 السبب الجذري

تم اكتشاف **3 مشاكل** في الكود:

### 1. مسار API خاطئ
**الكود الخطأ:**
```typescript
const response = await fetch(`${baseUrl}/api/admin/upload`, {
```

**المشكلة:** الكود كان يحاول الوصول إلى `/api/admin/upload` لكن المسار الصحيح هو `/api/upload`

### 2. اسم حقل خاطئ
**الكود الخطأ:**
```typescript
formData.append('image', file)
```

**المشكلة:** API endpoint يتوقع اسم الحقل `file` أو `files`، لكن الكود كان يرسل `image`

### 3. قراءة خاطئة للـ Response
**الكود الخطأ:**
```typescript
const { filePath } = await response.json()
```

**المشكلة:** API يرجع `url` أو `files[]`، لكن الكود كان يبحث عن `filePath`

---

## ✅ الحل

### التعديل 1: تصحيح مسار API
```typescript
// قبل
const response = await fetch(`${baseUrl}/api/admin/upload`, {

// بعد
const response = await fetch(`${baseUrl}/api/upload`, {
```

### التعديل 2: تصحيح اسم الحقل
```typescript
// قبل
formData.append('image', file)

// بعد
formData.append('file', file)
```

### التعديل 3: تصحيح قراءة Response
```typescript
// قبل
const { filePath } = await response.json()

// بعد
const responseData = await response.json()
console.log('Upload response:', responseData)
const filePath = responseData.url || responseData.files?.[0]

if (!filePath) {
  throw new Error('لم يتم إرجاع مسار الصورة من الخادم')
}
```

---

## 📋 التعديلات الكاملة

**الملف:** `src/app/admin/page.tsx`

**الدالة:** `handleImageUpload`

**السطور المعدلة:** 418، 428-436

**الكود الكامل بعد الإصلاح:**
```typescript
const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>, 
  section?: string, 
  subSection?: string, 
  imageKey?: string
) => {
  const file = e.target.files?.[0]
  if (!file) return

  // التحقق من حجم الملف (5MB حد أقصى)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    alert('حجم الملف كبير جداً. الحد الأقصى 5MB')
    return
  }

  try {
    console.log('بدء تحميل الصورة:', file.name, file.size, file.type)
    
    const formData = new FormData()
    formData.append('file', file)  // ✅ تم التصحيح

    const token = localStorage.getItem('admin_token')
    console.log('Token exists:', !!token)
    
    // التأكد من استخدام البورت الصحيح
    const baseUrl = window.location.origin
    console.log('Upload URL:', `${baseUrl}/api/upload`)  // ✅ تم التصحيح
    
    const response = await fetch(`${baseUrl}/api/upload`, {  // ✅ تم التصحيح
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Upload error:', errorData)
      throw new Error(errorData.error || `فشل في رفع الصورة: ${response.status}`)
    }

    // ✅ تم التصحيح - قراءة صحيحة للـ response
    const responseData = await response.json()
    console.log('Upload response:', responseData)
    const filePath = responseData.url || responseData.files?.[0]
    
    if (!filePath) {
      throw new Error('لم يتم إرجاع مسار الصورة من الخادم')
    }

    // Update content with new image path for all languages
    const newContent = JSON.parse(JSON.stringify(content))
    const languages = ['ar', 'en', 'fr', 'es']
    
    languages.forEach(lang => {
      if (!newContent[lang]) newContent[lang] = {}

      if (section && subSection && imageKey) {
        // For specific sections like about.hero.backgroundImage
        if (!newContent[lang][section]) newContent[lang][section] = {}
        if (!newContent[lang][section][subSection]) newContent[lang][section][subSection] = {}
        newContent[lang][section][subSection][imageKey] = filePath
      } else {
        // Default to homepage hero background
        if (!newContent[lang].homepage) newContent[lang].homepage = {}
        if (!newContent[lang].homepage.hero) newContent[lang].homepage.hero = {}
        newContent[lang].homepage.hero.backgroundImage = filePath
      }
    })

    setContent(newContent)
    console.log('تم رفع الصورة بنجاح:', filePath)
    alert('تم رفع الصورة بنجاح!')
    
  } catch (err) {
    console.error('Upload error:', err)
    const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف في رفع الصورة'
    alert(`خطأ في رفع الصورة: ${errorMessage}`)
  }
}
```

---

## 🧪 الاختبار

### خطوات الاختبار:
1. ✅ افتح لوحة التحكم
2. ✅ اذهب إلى الصفحة الرئيسية
3. ✅ انقر "تعديل"
4. ✅ اختر صورة للخلفية (أقل من 5MB)
5. ✅ تحقق من ظهور رسالة "تم رفع الصورة بنجاح!"
6. ✅ تحقق من ظهور معاينة الصورة
7. ✅ انقر "حفظ"
8. ✅ أعد تحميل الصفحة وتحقق من بقاء الصورة

### النتيجة المتوقعة:
- ✅ رفع الصورة بنجاح
- ✅ ظهور الصورة في المعاينة
- ✅ حفظ مسار الصورة في قاعدة البيانات
- ✅ ظهور الصورة في الصفحة العامة

---

## 📊 معلومات API endpoint

**المسار:** `/api/upload`

**الملف:** `src/app/api/upload/route.ts`

**الطريقة:** POST

**المعاملات المطلوبة:**
- `file` (File) - ملف واحد
- أو `files` (File[]) - ملفات متعددة

**الـ Response:**
```typescript
{
  success: true,
  files: string[],        // قائمة مسارات الملفات
  url: string,           // مسار الملف الأول (للتوافق)
  message: string,       // رسالة نجاح
  errors?: string[]      // أخطاء إن وجدت
}
```

**القيود:**
- الحد الأقصى لحجم الملف: 10MB (قابل للتغيير من إعدادات الموقع)
- الأنواع المسموحة: JPG, PNG, WebP, PDF, DOC, DOCX
- التحسين التلقائي: تفعيل (sharp library)
- إنشاء نسخ مصغرة: نعم (thumbnail, medium, large)

---

## ✨ التحسينات المضافة

1. **معالجة أفضل للأخطاء:**
   - رسائل خطأ واضحة للمستخدم
   - console.log تفصيلي للتصحيح
   - التحقق من وجود مسار الصورة في الـ response

2. **التوافق مع API:**
   - استخدام اسم الحقل الصحيح (`file`)
   - قراءة الـ response بطريقة صحيحة (`url` أو `files[0]`)
   - المسار الصحيح `/api/upload`

3. **رسائل واضحة:**
   - "تم رفع الصورة بنجاح!" عند النجاح
   - "خطأ في رفع الصورة: [سبب الخطأ]" عند الفشل

---

## 🎯 الخطوة التالية

بعد التأكد من نجاح رفع الصور:
1. اختبار رفع صورة من URL مباشر
2. اختبار حفظ البيانات
3. اختبار ظهور الصورة في الصفحة العامة
4. الانتقال لمراجعة صفحة "عن الشركة"

---

**تم بحمد الله ✨**
