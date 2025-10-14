// Import للـ client-side (المحتوى الثابت)
import contentData from '../data/content.json'
import { ContentData } from '../types'

// دالة للـ client-side - تستخدم static import
export function getContent(): ContentData {
  return contentData as ContentData
}

export function updateContent(newContent: any) {
  // في التطبيق الحقيقي، هذا سيحفظ في قاعدة البيانات أو API
  console.log('Content updated:', newContent)
  return newContent
}

// دالة لتحديث محتوى ملف JSON عبر API
export async function saveContentToAPI(content: any, token?: string) {
  try {
    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(content)
    })

    if (!response.ok) {
      throw new Error('فشل في حفظ المحتوى')
    }

    return await response.json()
  } catch (error) {
    console.error('خطأ في حفظ المحتوى:', error)
    throw error
  }
}

// دالة لجلب المحتوى المحدث من API
export async function fetchContentFromAPI(token?: string) {
  try {
    // في server-side rendering نقرأ مباشرة من الملف
    if (typeof window === 'undefined') {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      const contentFilePath = path.join(process.cwd(), 'src', 'data', 'content.json')
      const fileContent = await fs.readFile(contentFilePath, 'utf8')
      return JSON.parse(fileContent)
    }
    
    // في client-side نستخدم fetch مع cache busting
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3001'
    
    const timestamp = Date.now()
    const response = await fetch(`${baseUrl}/api/admin/content?t=${timestamp}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      cache: 'no-store' // تجنب cache في client-side
    })

    if (!response.ok) {
      throw new Error('فشل في جلب المحتوى')
    }

    return await response.json()
  } catch (error) {
    console.error('خطأ في جلب المحتوى:', error)
    // إرجاع المحتوى الافتراضي في حالة الخطأ
    return getContent()
  }
}
