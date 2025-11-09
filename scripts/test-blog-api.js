async function testBlogAPI() {
  try {
    console.log('🧪 اختبار API المدونة...\n');
    
    // Test public blog API
    const response = await fetch('http://localhost:3000/api/blog');
    
    if (!response.ok) {
      console.log(`❌ فشل الاتصال: ${response.status} ${response.statusText}`);
      if (response.status === 500) {
        const data = await response.json();
        console.log('تفاصيل الخطأ:', data);
      }
      return;
    }
    
    const data = await response.json();
    
    console.log('✅ تم استرجاع البيانات بنجاح!\n');
    console.log(`📊 عدد المقالات: ${data.posts ? data.posts.length : 0}\n`);
    
    if (data.posts && data.posts.length > 0) {
      console.log('📝 المقالات المُرجعة:\n');
      data.posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.titleAr || post.titleEn}`);
        console.log(`   - منشور: ${post.published ? '✅' : '❌'}`);
        console.log(`   - مميز: ${post.featured ? '⭐' : '⚪'}`);
        console.log(`   - Slug: ${post.slug}`);
        console.log(`   - صورة: ${post.featuredImage || '(لا توجد)'}\n`);
      });
    } else {
      console.log('⚠️  API يُرجع قائمة فارغة!');
      console.log('💡 السبب المحتمل: Cache أو مشكلة في الـ API');
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
    console.log('\n💡 تأكد من:');
    console.log('   1. تشغيل الـ development server: npm run dev');
    console.log('   2. السيرفر يعمل على المنفذ 3000');
    console.log('   3. لا توجد أخطاء في console السيرفر');
  }
}

testBlogAPI();
