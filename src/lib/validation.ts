/**
 * Input Validation & Sanitization System
 * يمنع XSS و SQL Injection ويتحقق من صحة المدخلات
 */

import { z } from 'zod'
import validator from 'validator'

/**
 * تنظيف النصوص من HTML و XSS
 */
export function sanitizeString(input: string): string {
  // إزالة HTML tags
  let sanitized = validator.escape(input)
  
  // إزالة المسافات الزائدة
  sanitized = sanitized.trim()
  
  return sanitized
}

/**
 * التحقق من البريد الإلكتروني
 */
export function validateEmail(email: string): boolean {
  return validator.isEmail(email)
}

/**
 * التحقق من رقم الهاتف
 */
export function validatePhone(phone: string): boolean {
  // دعم الأرقام المصرية والدولية
  const cleaned = phone.replace(/\s/g, '')
  return validator.isMobilePhone(cleaned, 'any') || /^(\+?20|0)?1[0125]\d{8}$/.test(cleaned)
}

/**
 * Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'الاسم يجب أن يكون على الأقل حرفين')
    .max(100, 'الاسم طويل جداً')
    .transform(sanitizeString),
  
  email: z.string()
    .email('البريد الإلكتروني غير صحيح')
    .transform(val => validator.normalizeEmail(val) || val),
  
  phone: z.string()
    .min(10, 'رقم الهاتف غير صحيح')
    .max(20, 'رقم الهاتف طويل جداً')
    .transform(sanitizeString)
    .refine(validatePhone, 'رقم الهاتف غير صحيح')
    .optional()
    .or(z.literal('')),
  
  subject: z.string()
    .min(3, 'الموضوع يجب أن يكون على الأقل 3 أحرف')
    .max(200, 'الموضوع طويل جداً')
    .transform(sanitizeString),
  
  message: z.string()
    .min(10, 'الرسالة يجب أن تكون على الأقل 10 أحرف')
    .max(2000, 'الرسالة طويلة جداً')
    .transform(sanitizeString)
})

export type ContactFormData = z.infer<typeof contactFormSchema>

/**
 * Quote Form Schema - Step 1 (Project Info)
 */
export const quoteStep1Schema = z.object({
  projectType: z.enum(['residential', 'commercial', 'hospitality', 'other'], {
    message: 'نوع المشروع مطلوب'
  }),
  
  area: z.string()
    .min(1, 'المساحة مطلوبة')
    .max(50, 'المساحة طويلة جداً')
    .transform(sanitizeString),
  
  location: z.string()
    .min(2, 'الموقع يجب أن يكون على الأقل حرفين')
    .max(200, 'الموقع طويل جداً')
    .transform(sanitizeString),
  
  timeline: z.enum(['urgent', '1-2-weeks', '1-month', 'flexible'], {
    message: 'الإطار الزمني مطلوب'
  }),
  
  budget: z.enum(['low', 'medium', 'high', 'not-sure'], {
    message: 'الميزانية مطلوبة'
  })
})

/**
 * Quote Form Schema - Step 2 (Product Selection)
 */
export const quoteStep2Schema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string().transform(sanitizeString),
    quantity: z.number().min(1, 'الكمية يجب أن تكون على الأقل 1').max(1000000, 'الكمية كبيرة جداً')
  })).min(1, 'يجب اختيار منتج واحد على الأقل'),
  
  customRequirements: z.string()
    .max(1000, 'المتطلبات الخاصة طويلة جداً')
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined)
})

/**
 * Quote Form Schema - Step 3 (Installation)
 */
export const quoteStep3Schema = z.object({
  installation: z.enum(['yes', 'no', 'not-sure'], {
    message: 'خيار التركيب مطلوب'
  }),
  
  installationNotes: z.string()
    .max(500, 'ملاحظات التركيب طويلة جداً')
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined)
})

/**
 * Quote Form Schema - Step 4 (Contact Info)
 */
export const quoteStep4Schema = z.object({
  name: z.string()
    .min(2, 'الاسم يجب أن يكون على الأقل حرفين')
    .max(100, 'الاسم طويل جداً')
    .transform(sanitizeString),
  
  email: z.string()
    .email('البريد الإلكتروني غير صحيح')
    .transform(val => validator.normalizeEmail(val) || val),
  
  phone: z.string()
    .min(10, 'رقم الهاتف غير صحيح')
    .max(20, 'رقم الهاتف طويل جداً')
    .transform(sanitizeString)
    .refine(validatePhone, 'رقم الهاتف غير صحيح'),
  
  company: z.string()
    .max(200, 'اسم الشركة طويل جداً')
    .optional()
    .transform(val => val ? sanitizeString(val) : undefined)
})

/**
 * Full Quote Form Schema
 */
export const quoteFormSchema = z.object({
  step1: quoteStep1Schema,
  step2: quoteStep2Schema,
  step3: quoteStep3Schema,
  step4: quoteStep4Schema
})

export type QuoteFormData = z.infer<typeof quoteFormSchema>

/**
 * Admin Login Schema
 */
export const loginSchema = z.object({
  username: z.string()
    .min(3, 'اسم المستخدم يجب أن يكون على الأقل 3 أحرف')
    .max(50, 'اسم المستخدم طويل جداً')
    .transform(sanitizeString),
  
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون على الأقل 8 أحرف')
    .max(100, 'كلمة المرور طويلة جداً')
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Product Schema
 */
export const productSchema = z.object({
  name: z.string()
    .min(2, 'اسم المنتج يجب أن يكون على الأقل حرفين')
    .max(200, 'اسم المنتج طويل جداً')
    .transform(sanitizeString),
  
  name_ar: z.string()
    .min(2, 'الاسم بالعربية يجب أن يكون على الأقل حرفين')
    .max(200, 'الاسم بالعربية طويل جداً')
    .transform(sanitizeString),
  
  description: z.string()
    .min(10, 'الوصف يجب أن يكون على الأقل 10 أحرف')
    .max(2000, 'الوصف طويل جداً')
    .transform(sanitizeString),
  
  description_ar: z.string()
    .min(10, 'الوصف بالعربية يجب أن يكون على الأقل 10 أحرف')
    .max(2000, 'الوصف بالعربية طويل جداً')
    .transform(sanitizeString),
  
  category: z.string()
    .min(2, 'الفئة مطلوبة')
    .max(100, 'الفئة طويلة جداً')
    .transform(sanitizeString),
  
  price: z.number()
    .min(0, 'السعر يجب أن يكون صفر أو أكثر')
    .max(1000000000, 'السعر كبير جداً'),
  
  image: z.string()
    .url('رابط الصورة غير صحيح')
    .optional(),
  
  features: z.array(z.string().transform(sanitizeString))
    .max(20, 'عدد المميزات كبير جداً')
    .optional(),
  
  isActive: z.boolean().default(true)
})

export type ProductFormData = z.infer<typeof productSchema>

/**
 * Blog Post Schema
 */
export const blogPostSchema = z.object({
  title: z.string()
    .min(5, 'العنوان يجب أن يكون على الأقل 5 أحرف')
    .max(200, 'العنوان طويل جداً')
    .transform(sanitizeString),
  
  title_ar: z.string()
    .min(5, 'العنوان بالعربية يجب أن يكون على الأقل 5 أحرف')
    .max(200, 'العنوان بالعربية طويل جداً')
    .transform(sanitizeString),
  
  content: z.string()
    .min(50, 'المحتوى يجب أن يكون على الأقل 50 حرف')
    .max(50000, 'المحتوى طويل جداً'),
  
  content_ar: z.string()
    .min(50, 'المحتوى بالعربية يجب أن يكون على الأقل 50 حرف')
    .max(50000, 'المحتوى بالعربية طويل جداً'),
  
  excerpt: z.string()
    .min(10, 'الملخص يجب أن يكون على الأقل 10 أحرف')
    .max(500, 'الملخص طويل جداً')
    .transform(sanitizeString),
  
  excerpt_ar: z.string()
    .min(10, 'الملخص بالعربية يجب أن يكون على الأقل 10 أحرف')
    .max(500, 'الملخص بالعربية طويل جداً')
    .transform(sanitizeString),
  
  slug: z.string()
    .min(3, 'الـ slug يجب أن يكون على الأقل 3 أحرف')
    .max(200, 'الـ slug طويل جداً')
    .regex(/^[a-z0-9-]+$/, 'الـ slug يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط')
    .transform(sanitizeString),
  
  image: z.string()
    .url('رابط الصورة غير صحيح')
    .optional(),
  
  category: z.string()
    .min(2, 'الفئة مطلوبة')
    .max(100, 'الفئة طويلة جداً')
    .transform(sanitizeString),
  
  tags: z.array(z.string().transform(sanitizeString))
    .max(10, 'عدد الوسوم كبير جداً')
    .optional(),
  
  isPublished: z.boolean().default(false)
})

export type BlogPostFormData = z.infer<typeof blogPostSchema>

/**
 * Helper function للتحقق من البيانات
 */
export async function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: Record<string, string[]> }> {
  try {
    const validated = await schema.parseAsync(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.issues.forEach(err => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      return { success: false, errors }
    }
    throw error
  }
}
