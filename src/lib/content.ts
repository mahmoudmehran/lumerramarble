// Import للـ client-side (المحتوى الثابت)
import contentData from '../data/content.json'

// دالة للـ client-side - تستخدم static import
export function getContent() {
  return contentData
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
    // في server-side rendering نحتاج absolute URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3001'
    
    const response = await fetch(`${baseUrl}/api/admin/content`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
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
