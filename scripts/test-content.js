async function testGetContent() {
  console.log('🔍 اختبار getContent...\n')
  
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()
  
  try {
    // Test homepage
    console.log('--- Homepage ---')
    const homepageRaw = await prisma.pageContent.findMany({
      where: { pageKey: 'homepage' }
    })
    console.log('عدد السجلات:', homepageRaw.length)
    if (homepageRaw.length > 0) {
      const sample = homepageRaw[0]
      console.log('مثال:', sample.sectionKey, sample.contentKey, sample.valueAr)
    }
    
    // Test about
    console.log('\n--- About ---')
    const aboutRaw = await prisma.pageContent.findMany({
      where: { pageKey: 'about' }
    })
    console.log('عدد السجلات:', aboutRaw.length)
    if (aboutRaw.length > 0) {
      const sample = aboutRaw[0]
      console.log('مثال:', sample.sectionKey, sample.contentKey, sample.valueAr)
    }
    
    // Test export
    console.log('\n--- Export ---')
    const exportRaw = await prisma.pageContent.findMany({
      where: { pageKey: 'export' }
    })
    console.log('عدد السجلات:', exportRaw.length)
    if (exportRaw.length > 0) {
      const sample = exportRaw[0]
      console.log('مثال:', sample.sectionKey, sample.contentKey, sample.valueAr)
    }
    
  } catch (error) {
    console.error('خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testGetContent()
