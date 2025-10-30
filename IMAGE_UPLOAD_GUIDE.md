# نظام رفع الصور - Image Upload System

## 📸 الميزات

### ✅ ما تم تنفيذه:

1. **API Endpoint** (`/api/upload`)
   - POST: رفع صورة أو عدة صور
   - DELETE: حذف صورة من السيرفر

2. **Image Optimization**
   - تحسين الجودة تلقائياً (90% للأصلي، 85% للنسخ)
   - إنشاء 3 أحجام لكل صورة:
     - Thumbnail: 300x300
     - Medium: 800x800
     - Large: 1200x1200
   - تحويل تلقائي لـ Progressive JPEG

3. **Validation & Security**
   - حجم ملف أقصى: 5MB
   - الأنواع المسموحة: JPG, PNG, WebP
   - التحقق من نوع وحجم الملف
   - حماية من رفع ملفات خطيرة

4. **UI Component** (`ImageUpload`)
   - Drag & Drop
   - Multiple files upload
   - معاينة الصور
   - حذف الصور
   - رسائل خطأ واضحة
   - Loading states

---

## 🚀 كيفية الاستخدام

### 1. في صفحات الإدارة (Admin)

```tsx
import { ImageUpload } from '@/components/ui/image-upload'
import { useState } from 'react'

function ProductForm() {
  const [images, setImages] = useState<string[]>([])

  const handleUpload = (newUrls: string[]) => {
    setImages(prev => [...prev, ...newUrls])
  }

  const handleRemove = (url: string) => {
    setImages(prev => prev.filter(img => img !== url))
  }

  return (
    <form>
      <ImageUpload
        onUpload={handleUpload}
        onRemove={handleRemove}
        multiple={true}
        maxFiles={5}
        currentImages={images}
      />
      
      {/* باقي الفورم */}
    </form>
  )
}
```

### 2. استخدام Helper Functions

```tsx
import { uploadImages, deleteImage, getImageUrl } from '@/lib/image-upload'

// رفع صور
const files = [file1, file2]
const result = await uploadImages(files)
if (result.success) {
  console.log('Uploaded:', result.files)
}

// حذف صورة
await deleteImage('/uploads/image.jpg')

// الحصول على حجم معين
const thumbnail = getImageUrl('/uploads/image.jpg', 'thumbnail')
// => /uploads/image-thumbnail.jpg
```

---

## 📁 هيكل الملفات

```
public/
  uploads/              # الصور المرفوعة
    image-123.jpg       # الصورة الأصلية
    image-123-thumbnail.jpg
    image-123-medium.jpg
    image-123-large.jpg

src/
  app/
    api/
      upload/
        route.ts        # API endpoint
  
  components/
    ui/
      image-upload.tsx  # UI Component
  
  lib/
    image-upload.ts     # Helper functions
```

---

## 🔧 API Reference

### POST `/api/upload`

**Request:**
```typescript
FormData {
  files: File[]  // واحد أو أكثر
}
```

**Response:**
```typescript
{
  success: true,
  files: string[],  // مسارات الصور
  message: string
}
```

### DELETE `/api/upload?file=/uploads/image.jpg`

**Response:**
```typescript
{
  success: true,
  message: "File deleted successfully"
}
```

---

## ⚙️ Configuration

يمكنك تعديل الإعدادات في `src/app/api/upload/route.ts`:

```typescript
// حجم الملف الأقصى
const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5MB

// الأنواع المسموحة
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// أحجام الصور
const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 300 },
  medium: { width: 800, height: 800 },
  large: { width: 1200, height: 1200 },
}
```

---

## 📝 TODO - التحديثات المستقبلية

- [ ] دعم تحميل الصور من URL
- [ ] Watermark تلقائي
- [ ] تحويل تلقائي لـ WebP
- [ ] Cloud storage (AWS S3, Cloudinary)
- [ ] إضافة progress bar للرفع
- [ ] Crop & resize قبل الرفع

---

## 🧪 Testing

```bash
# تشغيل dev server
npm run dev

# اذهب إلى صفحة الإدارة وجرب رفع صورة
# مثال: /admin/products
```

---

## 📦 Dependencies

```json
{
  "sharp": "^0.33.0",           // معالجة الصور
  "formidable": "^3.5.1",       // parse multipart forms
  "@types/formidable": "^3.4.5"
}
```

---

**تاريخ الإنشاء**: 30 أكتوبر 2025  
**الحالة**: ✅ جاهز للاستخدام
