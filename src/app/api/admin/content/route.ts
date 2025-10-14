import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'

// مسار ملف المحتوى  
const contentFilePath = join(process.cwd(), 'src', 'data', 'content.json')

async function handlePUT(request: NextRequest) {
  try {
    const contentData = await request.json()

    // التحقق من صحة البيانات
    if (!contentData || typeof contentData !== 'object') {
      return NextResponse.json(
        { message: 'بيانات غير صحيحة' },
        { status: 400 }
      )
    }

    // إضافة تاريخ آخر تحديث
    contentData._lastUpdated = new Date().toISOString()
    
    // حفظ البيانات في ملف JSON
    await writeFile(contentFilePath, JSON.stringify(contentData, null, 2), 'utf8')

    // إعادة تحديث الصفحات المعتمدة على هذا المحتوى
    revalidatePath('/')
    revalidatePath('/ar')
    revalidatePath('/en')
    revalidatePath('/fr')
    revalidatePath('/es')
    revalidatePath('/ar/about')
    revalidatePath('/en/about')
    revalidatePath('/fr/about')
    revalidatePath('/es/about')
    revalidatePath('/ar/export')
    revalidatePath('/en/export')
    revalidatePath('/fr/export')
    revalidatePath('/es/export')

    return NextResponse.json({
      message: 'تم حفظ المحتوى بنجاح',
      success: true
    })

  } catch (error) {
    console.error('Content API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في حفظ المحتوى' },
      { status: 500 }
    )
  }
}

async function handleGET(request: NextRequest) {
  try {
    // قراءة المحتوى من ملف JSON
    const fileContent = await readFile(contentFilePath, 'utf8')
    const content = JSON.parse(fileContent)

    const response = NextResponse.json(content)
    
    // إضافة headers لمنع cache
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error) {
    console.error('Content API error:', error)
    
    // في حالة عدم وجود الملف، إرجاع محتوى افتراضي
    const defaultContent = {
      ar: {
        siteInfo: {
          title: "الحوت ماربل",
          description: "شركة رائدة في تصدير الرخام والجرانيت من مصر",
          phone: "+20 111 312 1444",
          email: "info@alhotmarble.com",
          address: "مصر - القاهرة - المنطقة الصناعية شق الثعبان"
        },
        homepage: {
          hero: {
            title: "أفخم أنواع الرخام والجرانيت من مصر",
            subtitle: "نحن شركة رائدة في تصدير الرخام الطبيعي والجرانيت والكوارتز عالي الجودة من مصر إلى الأسواق العالمية",
            primaryButton: "استكشف منتجاتنا",
            secondaryButton: "طلب عرض سعر"
          },
          stats: [
            { number: "15+", text: "سنوات من الخبرة" },
            { number: "50+", text: "دولة نصدر إليها" },
            { number: "1000+", text: "مشروع منجز" },
            { number: "100%", text: "رضا العملاء" }
          ],
          features: [
            { title: "جودة عالمية", description: "منتجات معتمدة بشهادات الجودة العالمية" },
            { title: "تصدير عالمي", description: "نصل إلى أكثر من 50 دولة حول العالم" },
            { title: "فريق متخصص", description: "فريق من الخبراء لضمان أفضل خدمة" },
            { title: "خبرة 15 عام", description: "خبرة طويلة في مجال تصدير الأحجار الطبيعية" }
          ]
        },
        products: {
          categories: [
            { id: "marble", name: "رخام طبيعي" },
            { id: "granite", name: "جرانيت" },
            { id: "quartz", name: "كوارتز" },
            { id: "special", name: "منتجات خاصة" }
          ]
        }
      },
      en: {
        siteInfo: {
          title: "Alhot Marble",
          description: "Leading company in marble and granite export from Egypt",
          phone: "+20 111 312 1444",
          email: "info@alhotmarble.com",
          address: "Egypt - Cairo - Shaq Al-Thuban Industrial Zone"
        },
        homepage: {
          hero: {
            title: "Premium Marble & Granite from Egypt",
            subtitle: "We are a leading company exporting high-quality natural marble, granite, and quartz from Egypt to global markets",
            primaryButton: "Explore Our Products",
            secondaryButton: "Request Quote"
          },
          stats: [
            { number: "15+", text: "Years of Experience" },
            { number: "50+", text: "Countries Exported To" },
            { number: "1000+", text: "Completed Projects" },
            { number: "100%", text: "Customer Satisfaction" }
          ],
          features: [
            { title: "Global Quality", description: "Products certified with international quality standards" },
            { title: "Global Export", description: "We reach more than 50 countries worldwide" },
            { title: "Expert Team", description: "A team of experts to ensure the best service" },
            { title: "15 Years Experience", description: "Long experience in natural stone export industry" }
          ]
        },
        products: {
          categories: [
            { id: "marble", name: "Natural Marble" },
            { id: "granite", name: "Granite" },
            { id: "quartz", name: "Quartz" },
            { id: "special", name: "Special Products" }
          ]
        }
      }
    }
    
    return NextResponse.json(defaultContent)
  }
}

export const PUT = handlePUT
export const GET = handleGET
