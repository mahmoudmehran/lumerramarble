/**
 * سكريبت لمسح الـ cache بعد إضافة مقالات جديدة
 * يستخدم هذا السكريبت لحل مشكلة عدم ظهور المقالات الجديدة
 */

async function clearCache() {
  try {
    console.log('🧹 جاري مسح الـ cache...\n');

    // Try to clear cache via API
    try {
      const response = await fetch('http://localhost:3000/api/revalidate?tag=blog', {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ تم مسح الـ cache بنجاح!');
        console.log('📝 التفاصيل:', data.message);
        console.log('\n💡 الآن يمكنك تحديث الصفحة لرؤية المقالات الجديدة');
        return;
      }
    } catch (apiError) {
      console.log('⚠️  السيرفر غير شغال، سيتم مسح الـ cache يدوياً...\n');
    }

    // Manual cache clear (delete .next folder)
    console.log('🔄 جاري مسح مجلد .next للتأكد من مسح جميع الـ caches...');
    console.log('\n⚡ قم بتشغيل هذه الأوامر يدوياً:');
    console.log('   1. أوقف السيرفر (Ctrl+C)');
    console.log('   2. احذف مجلد .next:');
    console.log('      PowerShell: Remove-Item -Recurse -Force .next');
    console.log('      CMD: rmdir /s /q .next');
    console.log('   3. شغل السيرفر من جديد: npm run dev');
    console.log('\n💡 بعد حذف مجلد .next، المقالات ستظهر بالتأكيد!');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

clearCache();
