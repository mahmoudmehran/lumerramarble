const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedQuotes() {
  try {
    console.log('بدء إضافة البيانات التجريبية...')
    
    // حذف البيانات الموجودة
    await prisma.quoteRequest.deleteMany()
    console.log('تم حذف البيانات القديمة')
    
    // إضافة بيانات تجريبية
    const quotes = [
      {
        fullName: 'أحمد محمد علي',
        email: 'ahmed.mohamed@example.com',
        phone: '+20 111 222 3333',
        company: 'شركة الإنشاءات الحديثة',
        country: 'مصر',
        city: 'القاهرة',
        projectType: 'مشروع تجاري',
        projectName: 'فندق النيل الجديد',
        productType: 'رخام طبيعي',
        quantity: '500 متر مربع',
        thickness: '2 سم',
        finish: 'مصقول',
        color: 'أبيض كرارا',
        budget: '$20,000 - $30,000',
        message: 'نحتاج لرخام عالي الجودة لمشروع فندق 5 نجوم. المشروع عاجل ونحتاج عرض سعر سريع.',
        status: 'PENDING',
        priority: 'HIGH',
        expectedDate: new Date('2024-03-15')
      },
      {
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@moderninteriors.com',
        phone: '+1 555 123 4567',
        company: 'Modern Interiors LLC',
        country: 'الولايات المتحدة',
        city: 'نيويورك',
        projectType: 'مشروع سكني',
        projectName: 'Manhattan Luxury Apartments',
        productType: 'جرانيت',
        quantity: '200 متر مربع',
        thickness: '3 سم',
        finish: 'مصقول',
        color: 'أسود جالاكسي',
        budget: '$15,000 - $25,000',
        message: 'Looking for premium granite for kitchen countertops in luxury apartments. Quality is most important factor.',
        status: 'REVIEWED',
        priority: 'NORMAL',
        expectedDate: new Date('2024-02-20')
      },
      {
        fullName: 'محمد العلي الشمري',
        email: 'mohamed.alali@alalicontracting.ae',
        phone: '+971 50 123 4567',
        company: 'مؤسسة العلي للمقاولات',
        country: 'الإمارات العربية المتحدة',
        city: 'دبي',
        projectType: 'مشروع حكومي',
        projectName: 'مبنى الخدمات الحكومية الجديد',
        productType: 'جرانيت',
        quantity: '1000 متر مربع',
        thickness: '3 سم',
        finish: 'مطفي',
        color: 'رمادي فضي',
        budget: '$50,000+',
        message: 'مشروع مبنى حكومي يتطلب جرانيت عالي الجودة ومقاوم للخدوش والبقع. نحتاج شهادات جودة معتمدة.',
        status: 'QUOTED',
        priority: 'URGENT',
        quotedPrice: 75000,
        quotedAt: new Date(),
        expectedDate: new Date('2024-01-30')
      },
      {
        fullName: 'فاطمة الزهراء',
        email: 'fatima.zahra@designstudio.ma',
        phone: '+212 661 234 567',
        company: 'استوديو التصميم المغربي',
        country: 'المغرب',
        city: 'الرباط',
        projectType: 'مشروع سكني',
        projectName: 'فيلا ملكية',
        productType: 'رخام طبيعي',
        quantity: '300 متر مربع',
        thickness: '2 سم',
        finish: 'مصقول',
        color: 'بيج كريمي',
        budget: '$25,000 - $35,000',
        message: 'مشروع فيلا راقية تتطلب رخام طبيعي عالي الجودة مع تصميمات مخصصة. نحتاج عينات للمراجعة.',
        status: 'PROCESSING',
        priority: 'HIGH',
        expectedDate: new Date('2024-04-10')
      },
      {
        fullName: 'Robert Smith',
        email: 'robert.smith@constructionplus.com',
        phone: '+44 20 7123 4567',
        company: 'Construction Plus Ltd',
        country: 'المملكة المتحدة',
        city: 'لندن',
        projectType: 'مشروع تجاري',
        projectName: 'London Business Center',
        productType: 'كوارتز',
        quantity: '800 متر مربع',
        thickness: '2 سم',
        finish: 'مصقول',
        color: 'أبيض نقي',
        budget: '$40,000 - $60,000',
        message: 'We need high-quality quartz for a premium business center in central London. Delivery timing is critical.',
        status: 'ACCEPTED',
        priority: 'NORMAL',
        quotedPrice: 52000,
        quotedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // قبل أسبوع
        expectedDate: new Date('2024-05-15')
      }
    ]

    for (let i = 0; i < quotes.length; i++) {
      const quote = quotes[i]
      await prisma.quoteRequest.create({
        data: quote
      })
      console.log(`تم إضافة طلب رقم ${i + 1}: ${quote.fullName}`)
    }

    console.log('✅ تم إضافة البيانات التجريبية بنجاح!')
    console.log(`📊 تم إنشاء ${quotes.length} طلب عرض سعر`)

  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedQuotes()