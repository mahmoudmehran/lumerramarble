const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  try {
    const count = await prisma.pageContent.count()
    console.log('عدد سجلات PageContent:', count)
    
    const pages = await prisma.pageContent.findMany({
      select: { pageKey: true },
      distinct: ['pageKey']
    })
    console.log('الصفحات:', pages.map(p => p.pageKey))
    
    // Check homepage content
    const homepageContent = await prisma.pageContent.findMany({
      where: { pageKey: 'homepage' }
    })
    console.log('\nعدد سجلات homepage:', homepageContent.length)
    
    // Check about content
    const aboutContent = await prisma.pageContent.findMany({
      where: { pageKey: 'about' }
    })
    console.log('عدد سجلات about:', aboutContent.length)
    
    // Check export content
    const exportContent = await prisma.pageContent.findMany({
      where: { pageKey: 'export' }
    })
    console.log('عدد سجلات export:', exportContent.length)
    
  } catch (error) {
    console.error('خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

check()
