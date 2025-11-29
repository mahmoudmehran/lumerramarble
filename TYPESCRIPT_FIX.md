# إصلاح أخطاء TypeScript بعد Migration

إذا ظهرت أخطاء TypeScript مثل:
```
Property 'fAQ' does not exist on type 'PrismaClient'
Property 'certificate' does not exist on type 'PrismaClient'
Property 'project' does not exist on type 'PrismaClient'
Property 'exportGuide' does not exist on type 'PrismaClient'
```

## الحل السريع:

### 1. إعادة تحميل TypeScript Server في VS Code
اضغط `Ctrl + Shift + P` ثم ابحث عن:
```
TypeScript: Restart TS Server
```

### 2. أو إعادة تشغيل VS Code
أغلق VS Code وافتحه مرة أخرى

### 3. أو تشغيل Prisma Generate مرة أخرى
```bash
npx prisma generate
```

## التحقق من نجاح الإعداد:

### 1. تحقق من قاعدة البيانات
```bash
npx prisma studio
```

### 2. تشغيل السيرفر
```bash
npm run dev
```

### 3. اختبار الصفحات:
- http://localhost:3000/ar/faq
- http://localhost:3000/ar/certificates
- http://localhost:3000/ar/projects
- http://localhost:3000/ar/export-guide

### 4. اختبار لوحات التحكم:
- http://localhost:3000/admin/faqs
- http://localhost:3000/admin/certificates
- http://localhost:3000/admin/projects
- http://localhost:3000/admin/export-guides

## البيانات الافتراضية موجودة ✅

تم إضافة البيانات التالية:
- ✅ 5 أسئلة شائعة
- ✅ 4 شهادات جودة
- ✅ 4 مشاريع
- ✅ 6 خطوات في دليل التصدير

جميع البيانات متاحة بـ 4 لغات (العربية، الإنجليزية، الإسبانية، الفرنسية)
