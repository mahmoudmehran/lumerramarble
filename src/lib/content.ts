import contentData from '../data/content.json'

export function getContent() {
  return contentData
}

export function updateContent(newContent: any) {
  // في التطبيق الحقيقي، هذا سيحفظ في قاعدة البيانات أو API
  console.log('Content updated:', newContent)
  return newContent
}
