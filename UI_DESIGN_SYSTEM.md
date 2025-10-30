# نظام التصميم الموحد - Lumerra Marble UI Design System

## 📋 نظرة عامة

تم إنشاء نظام تصميم موحد لجميع صفحات الموقع يعتمد على **نظام الألوان الخماسي المخصص** القابل للتعديل من لوحة الإدارة.

## 🎨 نظام الألوان الخماسي

### الألوان الرئيسية (Customizable)

```css
--color-primary: #f59000          /* اللون الأساسي - البرتقالي */
--color-secondary: #2c3e50        /* اللون الثانوي - الرمادي الداكن */
--color-tertiary: #27ae60         /* اللون الثلاثي - الأخضر */
--color-quaternary: #34495e       /* اللون الرباعي - رمادي */
--color-quinary: #ecf0f1          /* اللون الخماسي - رمادي فاتح */
```

### ألوان ثابتة (Fixed Alert Colors)

```css
--color-success: #10b981          /* نجاح - أخضر */
--color-warning: #f59e0b          /* تحذير - برتقالي */
--color-error: #ef4444            /* خطأ - أحمر */
--color-info: #3b82f6             /* معلومة - أزرق */
```

### تدرجات الألوان (Shades)

كل لون له 10 تدرجات (50 إلى 900):
```css
--color-primary-50: rgba(245, 144, 0, 0.05)
--color-primary-100: rgba(245, 144, 0, 0.1)
...
--color-primary-900: rgba(245, 144, 0, 0.9)
```

## 🧱 المكونات المشتركة (Shared Components)

### ملف المكونات
`src/components/ui/page-sections.tsx`

### 1. HeroSection - القسم الرئيسي

```tsx
import { HeroSection } from '@/components/ui/page-sections'

<HeroSection
  title="عنوان الصفحة"
  subtitle="وصف الصفحة"
  image="/images/hero.jpg"
  gradient="primary" // primary | secondary | tertiary
>
  {/* محتوى إضافي مثل الأزرار */}
</HeroSection>
```

**المميزات:**
- خلفية متدرجة بألوان النظام
- صورة خلفية اختيارية
- نص عنوان ووصف
- محتوى مخصص (children)

---

### 2. PageHeader - رأس الصفحة (صغير)

```tsx
import { PageHeader } from '@/components/ui/page-sections'

<PageHeader
  title="من نحن"
  subtitle="تعرف على قصتنا"
  image="/images/about.jpg"
/>
```

**الاستخدام:** للصفحات الداخلية التي لا تحتاج hero كامل

---

### 3. ContentSection - قسم محتوى

```tsx
import { ContentSection } from '@/components/ui/page-sections'

<ContentSection
  title="عنوان القسم"
  subtitle="وصف القسم"
  variant="white" // white | light | primary | secondary | tertiary
  centered={true}
>
  {/* محتوى القسم */}
</ContentSection>
```

**المتغيرات (Variants):**
- `white`: خلفية بيضاء
- `light`: خلفية رمادية فاتحة
- `primary`: خلفية بلون primary مع نص أبيض
- `secondary`: خلفية بلون secondary مع نص أبيض
- `tertiary`: خلفية بلون tertiary مع نص أبيض

---

### 4. FeatureCard - بطاقة ميزة

```tsx
import { FeatureCard } from '@/components/ui/page-sections'
import { Award } from 'lucide-react'

<FeatureCard
  icon={<Award className="w-8 h-8" />}
  title="الجودة"
  description="نلتزم بأعلى معايير الجودة"
/>
```

**الاستخدام:** لعرض المميزات والخدمات

---

### 5. StatCard - بطاقة إحصائية

```tsx
import { StatCard } from '@/components/ui/page-sections'
import { Users } from 'lucide-react'

<StatCard
  number="500+"
  label="عميل راضٍ"
  icon={<Users className="w-12 h-12" />}
  variant="light" // light | dark
/>
```

**الاستخدام:** لعرض الإحصائيات والأرقام

---

### 6. Card - بطاقة عامة

```tsx
import { Card } from '@/components/ui/page-sections'

<Card
  title="عنوان البطاقة"
  description="وصف البطاقة"
  image="/images/card.jpg"
  imageAlt="صورة"
  variant="white" // white | light
  hover={true}
  onClick={() => console.log('clicked')}
>
  {/* محتوى إضافي */}
</Card>
```

**الاستخدام:** لعرض المحتوى في بطاقات

---

### 7. Grid - شبكة تخطيط

```tsx
import { Grid } from '@/components/ui/page-sections'

<Grid 
  cols={4}  // 1 | 2 | 3 | 4
  gap={8}   // 4 | 6 | 8 | 12
>
  {/* العناصر */}
</Grid>
```

**المميزات:**
- تخطيط responsive تلقائي
- مسافات قابلة للتخصيص

---

### 8. CTASection - قسم دعوة لإجراء

```tsx
import { CTASection } from '@/components/ui/page-sections'

<CTASection
  title="جاهز للبدء؟"
  subtitle="تواصل معنا اليوم"
  variant="secondary" // primary | secondary | tertiary
>
  <Button>اتصل بنا</Button>
</CTASection>
```

**الاستخدام:** في نهاية الصفحات لدعوة المستخدم لإجراء

---

## 📐 استخدام الألوان في الكود

### استخدام CSS Variables

```tsx
// ✅ صحيح - استخدام متغيرات CSS
<div className="bg-[var(--color-primary)] text-[var(--color-quinary)]">
  المحتوى
</div>

// ❌ خطأ - استخدام ألوان مباشرة
<div className="bg-orange-500 text-white">
  المحتوى
</div>
```

### الألوان الشائعة

```tsx
// خلفيات
bg-[var(--color-quinary)]          // خلفية بيضاء
bg-[var(--color-quinary-50)]       // خلفية رمادية فاتحة جداً
bg-[var(--color-primary)]          // خلفية بلون primary
bg-[var(--color-secondary)]        // خلفية بلون secondary

// نصوص
text-[var(--color-quaternary)]     // نص رمادي داكن
text-[var(--color-tertiary)]       // نص أخضر (عناوين)
text-[var(--color-quinary)]        // نص أبيض

// حدود
border-[var(--color-quaternary-300)]
border-[var(--color-primary)]

// تأثيرات hover
hover:bg-[var(--color-primary-700)]
hover:text-[var(--color-primary)]
```

---

## 📝 قواعد التصميم

### 1. التباين والوضوح
- استخدم نصوص داكنة على خلفيات فاتحة والعكس
- `text-[var(--color-quaternary)]` على `bg-[var(--color-quinary)]`
- `text-[var(--color-quinary)]` على `bg-[var(--color-primary)]`

### 2. التسلسل الهرمي
- **العناوين الرئيسية**: `text-[var(--color-tertiary)]`
- **العناوين الفرعية**: `text-[var(--color-secondary)]`
- **النصوص العادية**: `text-[var(--color-quaternary)]`
- **النصوص الثانوية**: `text-[var(--color-quaternary-600)]`

### 3. الأزرار
```tsx
// زر primary
<Button className="bg-[var(--color-primary)] text-[var(--color-quinary)]">
  اضغط هنا
</Button>

// زر secondary
<Button className="bg-[var(--color-secondary)] text-[var(--color-quinary)]">
  اضغط هنا
</Button>

// زر outline
<Button className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)]">
  اضغط هنا
</Button>
```

### 4. البطاقات
```tsx
<div className="bg-[var(--color-quinary)] border border-[var(--color-quaternary-100)] rounded-lg shadow-md hover:shadow-xl transition-all">
  {/* محتوى البطاقة */}
</div>
```

---

## 🔄 التحديثات المستقبلية

عند تعديل ألوان الموقع من لوحة الإدارة:

1. **لا تحتاج** لتعديل أي كود
2. الألوان ستتحدث تلقائياً في جميع الصفحات
3. نظام CSS Variables يطبق التغييرات فوراً

---

## 📚 أمثلة عملية

### مثال: صفحة رئيسية كاملة

```tsx
import { 
  HeroSection, 
  ContentSection, 
  FeatureCard, 
  StatCard,
  Grid,
  CTASection 
} from '@/components/ui/page-sections'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection
        title="مرحباً بك في لوميرا ماربل"
        subtitle="أفضل أنواع الرخام والجرانيت"
        image="/images/hero.jpg"
      >
        <Button>تصفح المنتجات</Button>
      </HeroSection>

      {/* الإحصائيات */}
      <ContentSection title="إنجازاتنا" variant="white" centered>
        <Grid cols={4}>
          <StatCard number="500+" label="عميل" />
          <StatCard number="1000+" label="مشروع" />
          <StatCard number="50+" label="دولة" />
          <StatCard number="100%" label="رضا العملاء" />
        </Grid>
      </ContentSection>

      {/* المميزات */}
      <ContentSection title="لماذا نحن؟" variant="light" centered>
        <Grid cols={4}>
          <FeatureCard 
            icon={<Award />} 
            title="الجودة" 
            description="أعلى معايير الجودة"
          />
          {/* المزيد... */}
        </Grid>
      </ContentSection>

      {/* CTA */}
      <CTASection 
        title="جاهز للبدء؟" 
        subtitle="اطلب عرض سعر الآن"
        variant="secondary"
      >
        <Button>اتصل بنا</Button>
      </CTASection>
    </>
  )
}
```

---

## ✅ Checklist للصفحات الجديدة

عند إنشاء صفحة جديدة:

- [ ] استخدم `PageHeader` أو `HeroSection` في البداية
- [ ] جميع الأقسام داخل `ContentSection`
- [ ] استخدم `Grid` للتخطيط
- [ ] استخدم `FeatureCard` للمميزات
- [ ] استخدم `StatCard` للإحصائيات
- [ ] أضف `CTASection` في النهاية
- [ ] جميع الألوان من نظام CSS Variables
- [ ] لا ألوان مباشرة (hardcoded)
- [ ] تأكد من responsive design

---

## 🛠️ الصيانة والتحديث

### إضافة لون جديد للنظام

1. افتح `src/app/globals.css`
2. أضف اللون الجديد:
```css
:root {
  --color-senary: #your-color;
  --color-senary-50: rgba(r, g, b, 0.05);
  /* ... باقي التدرجات */
}
```
3. أضف اللون في `tailwind.config.ts` إذا لزم الأمر

### تحديث مكون مشترك

1. افتح `src/components/ui/page-sections.tsx`
2. عدّل المكون المطلوب
3. التغيير سيطبق تلقائياً على جميع الصفحات

---

## 📞 المساعدة

للأسئلة أو المساعدة:
- راجع الأمثلة في `/src/app/[locale]/page.tsx`
- راجع المكونات في `/src/components/ui/page-sections.tsx`
- راجع الألوان في `/src/app/globals.css`

---

**آخر تحديث:** 30 أكتوبر 2025
**الإصدار:** 1.0.0
