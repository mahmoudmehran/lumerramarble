const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function analyzeDataStructure() {
  try {
    console.log('📊 تحليل بنية البيانات في قاعدة البيانات\n')
    
    // Homepage data
    console.log('=== HOMEPAGE DATA ===')
    const homepage = await prisma.pageContent.findMany({
      where: { pageKey: 'homepage' },
      take: 3
    })
    
    homepage.forEach(item => {
      console.log({
        pageKey: item.pageKey,
        sectionKey: item.sectionKey,
        contentKey: item.contentKey,
        valueAr: item.valueAr?.substring(0, 50) + '...',
        valueEn: item.valueEn?.substring(0, 50) + '...'
      })
    })
    
    // About data
    console.log('\n=== ABOUT DATA ===')
    const about = await prisma.pageContent.findMany({
      where: { pageKey: 'about' },
      take: 3
    })
    
    about.forEach(item => {
      console.log({
        pageKey: item.pageKey,
        sectionKey: item.sectionKey,
        contentKey: item.contentKey,
        valueAr: item.valueAr?.substring(0, 50) + '...',
        valueEn: item.valueEn?.substring(0, 50) + '...'
      })
    })
    
    // Export data
    console.log('\n=== EXPORT DATA ===')
    const exportData = await prisma.pageContent.findMany({
      where: { pageKey: 'export' },
      take: 3
    })
    
    exportData.forEach(item => {
      console.log({
        pageKey: item.pageKey,
        sectionKey: item.sectionKey,
        contentKey: item.contentKey,
        valueAr: item.valueAr?.substring(0, 50) + '...',
        valueEn: item.valueEn?.substring(0, 50) + '...'
      })
    })
    
    // الآن دعني أرى كيف يتم تحويل البيانات في API
    console.log('\n=== كيف يتم تحويل البيانات في API ===')
    const contentRows = await prisma.pageContent.findMany({
      where: { pageKey: 'about' },
      orderBy: [
        { sectionKey: 'asc' },
        { contentKey: 'asc' }
      ]
    })
    
    const content = {}
    contentRows.forEach(row => {
      if (!content[row.sectionKey]) {
        content[row.sectionKey] = {}
      }
      content[row.sectionKey][row.contentKey] = {
        ar: row.valueAr || '',
        en: row.valueEn || '',
        es: row.valueEs || '',
        fr: row.valueFr || ''
      }
    })
    
    console.log('\nبنية البيانات بعد التحويل:')
    console.log(JSON.stringify(content, null, 2))
    
  } catch (error) {
    console.error('خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzeDataStructure()
