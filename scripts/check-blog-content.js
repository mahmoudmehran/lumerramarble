const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBlogContent() {
  try {
    console.log('\n🔍 فحص محتوى صفحة المدونة في قاعدة البيانات...\n');
    
    const blogContent = await prisma.pageContent.findMany({
      where: {
        pageKey: 'blog'
      },
      orderBy: [
        { sectionKey: 'asc' },
        { contentKey: 'asc' }
      ]
    });

    console.log(`📊 عدد الحقول: ${blogContent.length}\n`);

    if (blogContent.length === 0) {
      console.log('⚠️  لا يوجد محتوى لصفحة المدونة في قاعدة البيانات!\n');
    } else {
      console.log('📝 المحتوى الموجود:\n');
      
      const sections = {};
      blogContent.forEach(item => {
        if (!sections[item.sectionKey]) {
          sections[item.sectionKey] = [];
        }
        sections[item.sectionKey].push({
          key: item.contentKey,
          valueAr: item.valueAr?.substring(0, 50) + (item.valueAr?.length > 50 ? '...' : ''),
          valueEn: item.valueEn?.substring(0, 50) + (item.valueEn?.length > 50 ? '...' : '')
        });
      });

      Object.keys(sections).forEach(section => {
        console.log(`\n📌 ${section}:`);
        sections[section].forEach(item => {
          console.log(`   • ${item.key}:`);
          console.log(`     - عربي: ${item.valueAr || '(فارغ)'}`);
          console.log(`     - English: ${item.valueEn || '(فارغ)'}`);
        });
      });
    }

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogContent();
