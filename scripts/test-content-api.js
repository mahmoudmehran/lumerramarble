async function testContentAPI() {
  try {
    console.log('🧪 اختبار API الخاص بمحتوى صفحة المدونة...\n');
    
    const response = await fetch('http://localhost:3000/api/content?page=blog');
    
    if (!response.ok) {
      console.log(`❌ فشل الاتصال: ${response.status} ${response.statusText}`);
      return;
    }
    
    const data = await response.json();
    
    console.log('✅ تم استرجاع البيانات بنجاح!\n');
    console.log('📊 الهيكل المُرجع:\n');
    console.log(JSON.stringify(data, null, 2));
    
    // Check hero section specifically
    if (data.hero) {
      console.log('\n🎯 محتوى Hero Section:');
      console.log('   العنوان (عربي):', data.hero.title?.valueAr);
      console.log('   العنوان (English):', data.hero.title?.valueEn);
      console.log('   الوصف (عربي):', data.hero.subtitle?.valueAr?.substring(0, 50) + '...');
      console.log('   صورة الخلفية:', data.hero.backgroundImage?.valueAr);
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
    console.log('\n💡 تأكد من تشغيل الـ development server أولاً بالأمر: npm run dev');
  }
}

testContentAPI();
