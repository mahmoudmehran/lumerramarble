# الصفحات الجديدة - New Pages Implementation

تم إضافة 4 صفحات جديدة للموقع مع لوحات تحكم كاملة وبيانات افتراضية.

## 📄 الصفحات المضافة

### 1. الأسئلة الشائعة (FAQ)
- **رابط الصفحة**: `/[locale]/faq`
- **لوحة التحكم**: `/admin/faqs`
- **API Endpoints**: 
  - `GET/POST /api/admin/faqs`
  - `PUT/DELETE /api/admin/faqs/[id]`

### 2. شهادات الجودة (Certificates)
- **رابط الصفحة**: `/[locale]/certificates`
- **لوحة التحكم**: `/admin/certificates`
- **API Endpoints**: 
  - `GET/POST /api/admin/certificates`
  - `PUT/DELETE /api/admin/certificates/[id]`

### 3. المشاريع (Projects)
- **رابط الصفحة**: `/[locale]/projects`
- **لوحة التحكم**: `/admin/projects`
- **API Endpoints**: 
  - `GET/POST /api/admin/projects`
  - `PUT/DELETE /api/admin/projects/[id]`

### 4. دليل التصدير (Export Guide)
- **رابط الصفحة**: `/[locale]/export-guide`
- **لوحة التحكم**: `/admin/export-guides`
- **API Endpoints**: 
  - `GET/POST /api/admin/export-guides`
  - `PUT/DELETE /api/admin/export-guides/[id]`

## 🗃️ قاعدة البيانات

تم إضافة 4 جداول جديدة في Prisma Schema:

### FAQ
```prisma
model FAQ {
  id          String   @id @default(cuid())
  questionAr  String
  questionEn  String
  questionEs  String
  questionFr  String
  answerAr    String
  answerEn    String
  answerEs    String
  answerFr    String
  category    String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Certificate
```prisma
model Certificate {
  id             String   @id @default(cuid())
  nameAr         String
  nameEn         String
  nameEs         String
  nameFr         String
  descriptionAr  String?
  descriptionEn  String?
  descriptionEs  String?
  descriptionFr  String?
  issuer         String?
  issuerAr       String?
  issuerEn       String?
  issuerEs       String?
  issuerFr       String?
  issueDate      DateTime?
  expiryDate     DateTime?
  certificateUrl String?
  imageUrl       String?
  category       String?
  sortOrder      Int      @default(0)
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### Project
```prisma
model Project {
  id             String   @id @default(cuid())
  nameAr         String
  nameEn         String
  nameEs         String
  nameFr         String
  descriptionAr  String
  descriptionEn  String
  descriptionEs  String
  descriptionFr  String
  clientName     String?
  location       String?
  locationAr     String?
  locationEn     String?
  locationEs     String?
  locationFr     String?
  area           String?
  duration       String?
  completionDate DateTime?
  category       String?
  images         Json?
  featuredImage  String?
  slug           String   @unique
  featured       Boolean  @default(false)
  isActive       Boolean  @default(true)
  sortOrder      Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### ExportGuide
```prisma
model ExportGuide {
  id          String   @id @default(cuid())
  titleAr     String
  titleEn     String
  titleEs     String
  titleFr     String
  contentAr   String
  contentEn   String
  contentEs   String
  contentFr   String
  category    String?
  icon        String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🚀 كيفية الاستخدام

### تشغيل Migration
```bash
npx prisma migrate dev
```

### إضافة البيانات الافتراضية

يمكنك تشغيل كل سكريبت على حدة:
```bash
node scripts/seed-faqs.js
node scripts/seed-certificates.js
node scripts/seed-projects.js
node scripts/seed-export-guides.js
```

أو تشغيل جميع السكريبتات معاً:
```bash
node scripts/seed-all-new-pages.js
```

### تحديث Prisma Client
```bash
npx prisma generate
```

## 📝 البيانات الافتراضية

### الأسئلة الشائعة (5 أسئلة)
- ما هي أنواع الرخام المتوفرة؟
- ما هي المهلة الزمنية للتوريد؟
- هل تقدمون شهادات جودة؟
- ما هي طرق الدفع المتاحة؟
- هل يمكنكم توفير أحجام مخصصة؟

### الشهادات (4 شهادات)
- شهادة ISO 9001
- شهادة CE
- شهادة منشأ مصرية
- شهادة ISO 14001

### المشاريع (4 مشاريع)
- فندق فاخر في دبي
- مسجد في السعودية
- فيلا سكنية في قطر
- مركز تجاري في الكويت

### دليل التصدير (6 خطوات)
1. مواصفات المنتج والعينات
2. عرض السعر والتفاوض
3. الإنتاج والمراقبة
4. التعبئة والتغليف
5. الشحن والتخليص الجمركي
6. الدعم بعد البيع

## 🌐 دعم اللغات

جميع الصفحات تدعم 4 لغات:
- 🇸🇦 العربية (ar)
- 🇬🇧 الإنجليزية (en)
- 🇪🇸 الإسبانية (es)
- 🇫🇷 الفرنسية (fr)

## 🎨 المميزات

### صفحات المستخدم
- ✅ تصميم responsive
- ✅ دعم RTL/LTR
- ✅ SEO optimized
- ✅ ISR مع revalidation كل ساعة
- ✅ رسائل خطأ واضحة
- ✅ تحميل تفاعلي

### لوحات التحكم
- ✅ إضافة وتعديل وحذف
- ✅ البحث والفلترة
- ✅ ترتيب العناصر
- ✅ تفعيل/تعطيل العناصر
- ✅ دعم جميع اللغات
- ✅ واجهة سهلة الاستخدام

## 🔗 روابط Footer

تم إضافة هذه الصفحات في Footer:
```typescript
support: {
  title: 'الدعم',
  links: [
    { name: 'تواصل معنا', href: '/ar/contact' },
    { name: 'طلب عرض سعر', href: '/ar/quote' },
    { name: 'الأسئلة الشائعة', href: '/ar/faq' },
    { name: 'دليل التصدير', href: '/ar/export-guide' },
  ]
},
company: {
  title: 'الشركة',
  links: [
    { name: 'عن الشركة', href: '/ar/about' },
    { name: 'خدمات التصدير', href: '/ar/export' },
    { name: 'المشاريع', href: '/ar/projects' },
    { name: 'شهادات الجودة', href: '/ar/certificates' },
  ]
}
```

## 📁 هيكل الملفات

```
src/
├── app/
│   ├── [locale]/
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── certificates/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   └── page.tsx
│   │   └── export-guide/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── faqs/
│   │   │   └── page.tsx
│   │   ├── certificates/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   └── page.tsx
│   │   └── export-guides/
│   │       └── page.tsx
│   └── api/
│       └── admin/
│           ├── faqs/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           ├── certificates/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           ├── projects/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           └── export-guides/
│               ├── route.ts
│               └── [id]/route.ts
scripts/
├── seed-faqs.js
├── seed-certificates.js
├── seed-projects.js
├── seed-export-guides.js
└── seed-all-new-pages.js
```

## 🔄 التحديثات المستقبلية

يمكنك بسهولة:
1. إضافة المزيد من الحقول في Schema
2. تعديل البيانات من لوحة التحكم
3. تخصيص التصميم
4. إضافة فلاتر متقدمة
5. رفع صور للشهادات والمشاريع

## ⚠️ ملاحظات مهمة

1. **Prisma Client**: قد تحتاج لإعادة تشغيل VS Code بعد Migration
2. **الصور**: تأكد من رفع الصور في `/public/uploads/`
3. **Slug**: يجب أن يكون فريد لكل مشروع
4. **التواريخ**: استخدم ISO format للتواريخ في API

## 🎯 الخطوات التالية المقترحة

1. رفع صور حقيقية للشهادات والمشاريع
2. إضافة معرض صور للمشاريع
3. إضافة نظام تقييم للمشاريع
4. إضافة search متقدم
5. إضافة فلاتر حسب الفئة
6. إضافة pagination للصفحات

---

تم إنشاء هذه الصفحات بتاريخ: 27 نوفمبر 2025
