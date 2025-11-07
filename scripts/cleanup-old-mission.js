const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupOldMissionFields() {
  try {
    console.log('🧹 حذف حقول Mission القديمة...\n')

    const fieldsToDelete = ['title', 'vision', 'mission', 'image']

    let deletedCount = 0
    let notFoundCount = 0

    for (const field of fieldsToDelete) {
      try {
        const deleted = await prisma.pageContent.deleteMany({
          where: {
            pageKey: 'about',
            sectionKey: 'mission',
            contentKey: field
          }
        })

        if (deleted.count > 0) {
          console.log(`✅ تم حذف mission.${field}`)
          deletedCount++
        } else {
          console.log(`⚠️  mission.${field} غير موجود`)
          notFoundCount++
        }
      } catch (error) {
        console.log(`❌ خطأ في حذف mission.${field}:`, error.message)
      }
    }

    console.log(`\n📊 الإحصائيات:`)
    console.log(`   - تم الحذف: ${deletedCount}`)
    console.log(`   - غير موجود: ${notFoundCount}`)
    console.log(`   - الإجمالي: ${fieldsToDelete.length}`)
    
    console.log('\n✅ اكتملت عملية التنظيف!')

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupOldMissionFields()
