# فصل لوجو الهيدر والفوتر
## Separate Header & Footer Logos

## 📋 نظرة عامة
تم تطوير النظام ليدعم لوجو منفصل للهيدر (Header) ولوجو منفصل للفوتر (Footer)، بدلاً من استخدام نفس اللوجو في الموقعين.

---

## ✨ المميزات الجديدة

### 1. لوجو الهيدر (Header Logo)
- ✅ رفع لوجو خاص بالهيدر
- ✅ نص بديل (Alt Text) بـ 4 لغات (عربي، إنجليزي، إسباني، فرنسي)
- ✅ لوجو منفصل للوضع الليلي (Dark Mode) للهيدر
- ✅ معاينة مباشرة في صفحة الإعدادات

### 2. لوجو الفوتر (Footer Logo)
- ✅ رفع لوجو خاص بالفوتر
- ✅ نص بديل (Alt Text) بـ 4 لغات
- ✅ لوجو منفصل للوضع الليلي (Dark Mode) للفوتر
- ✅ معاينة مباشرة في صفحة الإعدادات

### 3. التوافق مع الإصدارات السابقة (Backward Compatibility)
- ✅ إذا لم يتم رفع لوجو للهيدر، يستخدم النظام اللوجو القديم (`logoUrl`)
- ✅ إذا لم يتم رفع لوجو للفوتر، يستخدم النظام اللوجو القديم (`logoUrl`)
- ✅ الحقول القديمة محفوظة ولم يتم حذفها

---

## 🗄️ التغييرات في قاعدة البيانات

### Prisma Schema
تمت إضافة الحقول التالية في `SiteSettings` model:

```prisma
model SiteSettings {
  // ... حقول أخرى
  
  // Old logo fields (deprecated, keeping for backward compatibility)
  logoUrl               String?
  logoAlt               String   @default("Company Logo")
  logoAltAr             String   @default("شعار الشركة")
  logoAltEs             String   @default("Logo de la Empresa")
  logoAltFr             String   @default("Logo de l'Entreprise")
  darkModeLogoUrl       String?
  
  // Header Logo
  headerLogoUrl         String?
  headerLogoAlt         String   @default("Header Logo")
  headerLogoAltAr       String   @default("شعار الهيدر")
  headerLogoAltEs       String   @default("Logo del Encabezado")
  headerLogoAltFr       String   @default("Logo de l'En-tête")
  headerDarkModeLogoUrl String?
  
  // Footer Logo
  footerLogoUrl         String?
  footerLogoAlt         String   @default("Footer Logo")
  footerLogoAltAr       String   @default("شعار الفوتر")
  footerLogoAltEs       String   @default("Logo del Pie de Página")
  footerLogoAltFr       String   @default("Logo du Pied de Page")
  footerDarkModeLogoUrl String?
  
  faviconUrl            String?
  // ... حقول أخرى
}
```

### Migration
تم إنشاء migration جديد:
- **اسم الـ Migration:** `20251109183124_separate_header_footer_logos`
- **الملف:** `prisma/migrations/20251109183124_separate_header_footer_logos/migration.sql`

---

## 🔧 التغييرات التقنية

### 1. TypeScript Interface (`src/lib/settings.ts`)
```typescript
export interface SiteSettings {
  // ... حقول أخرى
  
  // Logo & Branding (Old - for backward compatibility)
  logoUrl?: string
  logoAlt?: string
  logoAltAr?: string
  logoAltEs?: string
  logoAltFr?: string
  darkModeLogoUrl?: string
  
  // Header Logo
  headerLogoUrl?: string
  headerLogoAlt?: string
  headerLogoAltAr?: string
  headerLogoAltEs?: string
  headerLogoAltFr?: string
  headerDarkModeLogoUrl?: string
  
  // Footer Logo
  footerLogoUrl?: string
  footerLogoAlt?: string
  footerLogoAltAr?: string
  footerLogoAltEs?: string
  footerLogoAltFr?: string
  footerDarkModeLogoUrl?: string
  
  faviconUrl?: string
  // ... حقول أخرى
}
```

### 2. API Route (`src/app/api/admin/settings/route.ts`)
تم تحديث:
- ✅ استقبال الحقول الجديدة في `PUT` request
- ✅ حفظ الحقول في قاعدة البيانات (Update & Create)
- ✅ إرجاع الحقول في `GET` response

### 3. صفحة الإعدادات في لوحة التحكم (`src/app/admin/settings/page.tsx`)
تم إضافة:
- ✅ قسم منفصل للوجو الهيدر (بخلفية زرقاء)
- ✅ قسم منفصل للوجو الفوتر (بخلفية خضراء)
- ✅ رفع صور منفصلة لكل قسم
- ✅ نص بديل بـ 4 لغات لكل قسم
- ✅ لوجو Dark Mode منفصل لكل قسم
- ✅ معاينة فورية لكل لوجو

### 4. Navbar Component (`src/components/layout/Navbar.tsx`)
```typescript
const logoUrl = useMemo(() => {
  // Use headerLogoUrl if available, fallback to old logoUrl
  const mainLogo = siteSettings?.headerLogoUrl || siteSettings?.logoUrl
  if (!mainLogo) return null
  
  const darkModeLogo = siteSettings?.headerDarkModeLogoUrl || siteSettings?.darkModeLogoUrl
  return siteSettings.darkModeEnabled && darkModeLogo ? darkModeLogo : mainLogo
}, [siteSettings])

const logoAlt = useMemo(() => {
  const altAr = siteSettings.headerLogoAltAr || siteSettings.logoAltAr || 'شعار الشركة'
  // ... same for other languages
  return locale === 'ar' ? altAr : ...
}, [siteSettings, locale])
```

### 5. Footer Component (`src/components/layout/Footer.tsx`)
```typescript
const logoUrl = useMemo(() => {
  // Use footerLogoUrl if available, fallback to old logoUrl
  const mainLogo = siteSettings?.footerLogoUrl || siteSettings?.logoUrl
  if (!mainLogo) return null
  
  const darkModeLogo = siteSettings?.footerDarkModeLogoUrl || siteSettings?.darkModeLogoUrl
  return siteSettings.darkModeEnabled && darkModeLogo ? darkModeLogo : mainLogo
}, [siteSettings])

const logoAlt = useMemo(() => {
  const altAr = siteSettings.footerLogoAltAr || siteSettings.logoAltAr || 'شعار الشركة'
  // ... same for other languages
  return locale === 'ar' ? altAr : ...
}, [siteSettings, locale])
```

---

## 🎨 واجهة المستخدم في لوحة التحكم

### قسم لوجو الهيدر (Header Logo Section)
- **خلفية زرقاء** (blue-50) مع حدود زرقاء
- **Badge أزرق** مكتوب عليه "Header"
- **حقول:**
  1. رفع لوجو الهيدر
  2. النص البديل (4 لغات)
  3. لوجو Dark Mode للهيدر
  4. معاينة فورية

### قسم لوجو الفوتر (Footer Logo Section)
- **خلفية خضراء** (green-50) مع حدود خضراء
- **Badge أخضر** مكتوب عليه "Footer"
- **حقول:**
  1. رفع لوجو الفوتر
  2. النص البديل (4 لغات)
  3. لوجو Dark Mode للفوتر
  4. معاينة فورية

---

## 📖 كيفية الاستخدام

### 1. رفع لوجو الهيدر
1. سجل دخول لـ `/admin`
2. اذهب إلى **الإعدادات** (Settings)
3. ابحث عن قسم **"الشعار والعلامة التجارية"**
4. في القسم الأزرق **"لوجو الهيدر"**:
   - ارفع لوجو الهيدر
   - أضف النص البديل بجميع اللغات
   - (اختياري) ارفع لوجو للوضع الليلي
5. احفظ التغييرات

### 2. رفع لوجو الفوتر
1. في نفس صفحة الإعدادات
2. في القسم الأخضر **"لوجو الفوتر"**:
   - ارفع لوجو الفوتر
   - أضف النص البديل بجميع اللغات
   - (اختياري) ارفع لوجو للوضع الليلي
3. احفظ التغييرات

### 3. النتيجة
- ✅ الهيدر سيعرض لوجو الهيدر
- ✅ الفوتر سيعرض لوجو الفوتر
- ✅ كل واحد منفصل تماماً عن الآخر

---

## 🔄 التوافق مع الإصدارات السابقة

### السيناريو 1: لم يتم رفع لوجو جديد
- ❓ لم يرفع المستخدم `headerLogoUrl`
- ✅ النظام يستخدم `logoUrl` القديم للهيدر
- ❓ لم يرفع المستخدم `footerLogoUrl`
- ✅ النظام يستخدم `logoUrl` القديم للفوتر
- **النتيجة:** الموقع يعمل كما هو بدون أي مشاكل

### السيناريو 2: تم رفع لوجو الهيدر فقط
- ✅ رفع المستخدم `headerLogoUrl`
- ✅ الهيدر يستخدم اللوجو الجديد
- ❓ لم يرفع `footerLogoUrl`
- ✅ الفوتر يستخدم `logoUrl` القديم

### السيناريو 3: تم رفع كلا اللوجوهات
- ✅ رفع المستخدم `headerLogoUrl`
- ✅ رفع المستخدم `footerLogoUrl`
- ✅ كل واحد يعرض لوجو منفصل تماماً

---

## 🧪 الاختبار

### تم اختبار:
1. ✅ رفع لوجو الهيدر فقط
2. ✅ رفع لوجو الفوتر فقط
3. ✅ رفع لوجو الهيدر والفوتر معاً
4. ✅ عدم رفع أي لوجو جديد (التوافق مع القديم)
5. ✅ رفع لوجو Dark Mode للهيدر
6. ✅ رفع لوجو Dark Mode للفوتر
7. ✅ النصوص البديلة بجميع اللغات
8. ✅ المعاينة الفورية في صفحة الإعدادات
9. ✅ تبديل اللغة → يتغير النص البديل
10. ✅ تفعيل Dark Mode → يتبدل اللوجو

---

## 📝 ملاحظات مهمة

### 1. الحقول القديمة
- ❗ **لم يتم حذف** حقول `logoUrl`, `logoAlt`, `darkModeLogoUrl`
- ✅ تم الاحتفاظ بها للتوافق مع الإصدارات السابقة
- ✅ تعمل كـ **Fallback** إذا لم يتم رفع لوجو جديد

### 2. أولوية الاستخدام
```
Navbar:
  headerLogoUrl (إذا موجود)
    ↓ fallback
  logoUrl (القديم)

Footer:
  footerLogoUrl (إذا موجود)
    ↓ fallback
  logoUrl (القديم)
```

### 3. Dark Mode
```
Navbar:
  headerDarkModeLogoUrl (إذا موجود + Dark Mode مفعّل)
    ↓ fallback
  darkModeLogoUrl (القديم)
    ↓ fallback
  headerLogoUrl أو logoUrl (العادي)

Footer:
  footerDarkModeLogoUrl (إذا موجود + Dark Mode مفعّل)
    ↓ fallback
  darkModeLogoUrl (القديم)
    ↓ fallback
  footerLogoUrl أو logoUrl (العادي)
```

### 4. النصوص البديلة (Alt Text)
- ✅ مدعومة بـ 4 لغات لكل لوجو
- ✅ تتغير تلقائياً مع تبديل اللغة
- ✅ مهمة لـ SEO و Accessibility

---

## 🎯 الخلاصة

✅ **تم بنجاح:**
- فصل لوجو الهيدر عن لوجو الفوتر
- دعم Dark Mode لكل واحد بشكل منفصل
- النصوص البديلة بـ 4 لغات
- واجهة مستخدم واضحة في لوحة التحكم
- التوافق الكامل مع الإصدارات السابقة
- معاينة فورية للوجوهات

✅ **النتيجة:**
- يمكن الآن رفع لوجو مختلف للهيدر ولوجو مختلف للفوتر
- كل واحد يتحكم فيه بشكل منفصل تماماً من لوحة التحكم
- لا حاجة لتعديل الكود لتغيير اللوجوهات

---

## 📅 التاريخ
- **تاريخ التطوير:** 9 نوفمبر 2025
- **Migration ID:** `20251109183124_separate_header_footer_logos`

---

## 🔗 الملفات المعدّلة

1. `prisma/schema.prisma` - إضافة حقول جديدة
2. `src/lib/settings.ts` - تحديث Interface و Function
3. `src/app/api/admin/settings/route.ts` - تحديث API
4. `src/app/admin/settings/page.tsx` - تحديث UI
5. `src/components/layout/Navbar.tsx` - استخدام headerLogoUrl
6. `src/components/layout/Footer.tsx` - استخدام footerLogoUrl

---

**تم التطوير والتوثيق بواسطة:** GitHub Copilot  
**حالة المشروع:** ✅ جاهز للاستخدام
