const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        published: true,
        featured: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📊 عدد المقالات في قاعدة البيانات:', posts.length)
    
    if (posts.length > 0) {
      console.log('\n📝 المقالات الموجودة:\n')
      posts.forEach((post, index) => {
        const status = post.published ? '✅ منشور' : '📝 مسودة'
        const featured = post.featured ? '⭐ مميز' : ''
        console.log(`${index + 1}. ${post.titleAr}`)
        console.log(`   ${post.titleEn}`)
        console.log(`   ${status} ${featured}`)
        console.log(`   تاريخ الإنشاء: ${new Date(post.createdAt).toLocaleDateString('ar-EG')}`)
        console.log('')
      })
    } else {
      console.log('\n❌ لا توجد مقالات في قاعدة البيانات')
      console.log('💡 يمكنك إضافة مقالات من لوحة التحكم: /admin/blog')
    }
  } catch (error) {
    console.error('❌ خطأ:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkBlogPosts()
