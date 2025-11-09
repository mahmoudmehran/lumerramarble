const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDirectQuery() {
  try {
    console.log('🔍 استعلام مباشر لقاعدة البيانات (بدون cache)...\n');
    
    // Query directly without cache
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    });

    console.log(`📊 عدد المقالات المنشورة: ${posts.length}\n`);

    if (posts.length === 0) {
      console.log('⚠️  لا توجد مقالات منشورة!');
      console.log('💡 تحقق من حقل published في قاعدة البيانات');
    } else {
      console.log('✅ المقالات المنشورة:\n');
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.titleAr}`);
        console.log(`   English: ${post.titleEn}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   منشور: ${post.published ? '✅' : '❌'}`);
        console.log(`   مميز: ${post.featured ? '⭐' : '⚪'}`);
        console.log(`   صورة: ${post.featuredImage || '(لا توجد)'}`);
        console.log(`   تاريخ: ${post.createdAt.toLocaleDateString('ar-EG')}\n`);
      });
    }

    // Also check ALL posts (including unpublished)
    const allPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n📈 إجمالي المقالات (منشور وغير منشور): ${allPosts.length}`);
    console.log(`   منشور: ${allPosts.filter(p => p.published).length}`);
    console.log(`   غير منشور: ${allPosts.filter(p => !p.published).length}`);

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDirectQuery();
