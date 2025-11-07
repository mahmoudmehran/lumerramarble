const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkBackgroundImage() {
  try {
    const result = await prisma.pageContent.findMany({
      where: {
        pageKey: 'homepage',
        sectionKey: 'hero',
        contentKey: 'backgroundImage'
      }
    })
    
    console.log('📸 نتيجة البحث عن backgroundImage:')
    console.log(JSON.stringify(result, null, 2))
    
    if (result.length === 0) {
      console.log('\n❌ لا يوجد حقل backgroundImage في قاعدة البيانات!')
      console.log('✅ سيتم إنشاءه عند أول حفظ')
    } else {
      console.log(`\n✅ وُجد ${result.length} سجل`)
      result.forEach(r => {
        console.log(`- ${r.contentKey}: ar="${r.valueAr}", en="${r.valueEn}"`)
      })
    }
  } catch (error) {
    console.error('خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBackgroundImage()
