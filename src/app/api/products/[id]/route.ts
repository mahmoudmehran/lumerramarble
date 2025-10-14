import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { message: 'معرف المنتج مطلوب' },
        { status: 400 }
      )
    }

    // Mock product data for development
    const mockProducts = [
      {
        id: '1',
        nameAr: 'رخام كرارا أبيض',
        nameEn: 'Carrara White Marble',
        nameEs: 'Mármol Blanco Carrara',
        nameFr: 'Marbre Blanc de Carrare',
        category: 'MARBLE',
        descriptionAr: 'رخام كرارا الأبيض هو من أفخم أنواع الرخام الطبيعي المستخرج من محاجر كرارا الشهيرة. يتميز بلونه الأبيض الناصع مع العروق الرمادية الطبيعية التي تضفي عليه جمالاً فريداً.',
        descriptionEn: 'Carrara White Marble is one of the finest natural marbles extracted from the famous Carrara quarries. It features a pristine white color with natural gray veining that gives it unique beauty.',
        images: [
          'https://picsum.photos/600/600?random=1',
          'https://picsum.photos/600/600?random=2',
          'https://picsum.photos/600/600?random=3',
          'https://picsum.photos/600/600?random=4'
        ],
        originCountry: 'مصر',
        thickness: '18mm, 20mm, 30mm',
        density: '2.7 g/cm³',
        primaryColor: 'أبيض مع عروق رمادية',
        applications: ['أرضيات', 'حوائط', 'أسطح مطابخ', 'أحواض استحمام', 'سلالم']
      },
      {
        id: '2',
        nameAr: 'جرانيت أسود جالاكسي',
        nameEn: 'Black Galaxy Granite',
        nameEs: 'Granito Negro Galaxia',
        nameFr: 'Granit Noir Galaxie',
        category: 'GRANITE',
        descriptionAr: 'جرانيت أسود جالاكسي هو من أجمل أنواع الجرانيت الطبيعي. يتميز بلونه الأسود العميق مع النقاط الذهبية المتلألئة التي تشبه النجوم في السماء.',
        descriptionEn: 'Black Galaxy Granite is one of the most beautiful natural granites. It features a deep black color with glittering golden spots that resemble stars in the sky.',
        images: [
          'https://picsum.photos/600/600?random=5',
          'https://picsum.photos/600/600?random=6',
          'https://picsum.photos/600/600?random=7',
          'https://picsum.photos/600/600?random=8'
        ],
        originCountry: 'مصر',
        thickness: '20mm, 30mm',
        density: '2.8 g/cm³',
        primaryColor: 'أسود مع نقاط ذهبية',
        applications: ['أسطح مطابخ', 'أرضيات', 'حوائط', 'أعمدة']
      },
      {
        id: '3',
        nameAr: 'رخام كالاكاتا ذهبي',
        nameEn: 'Calacatta Gold Marble',
        nameEs: 'Mármol Calacatta Oro',
        nameFr: 'Marbre Calacatta Or',
        category: 'MARBLE',
        descriptionAr: 'رخام كالاكاتا الذهبي هو من أندر أنواع الرخام الإيطالي الفاخر. يتميز بخلفيته البيضاء النقية والعروق الذهبية الجريئة التي تخلق تبايناً مذهلاً.',
        descriptionEn: 'Calacatta Gold Marble is one of the rarest Italian luxury marbles. It features a pure white background with bold golden veins that create stunning contrast.',
        images: [
          'https://picsum.photos/600/600?random=9',
          'https://picsum.photos/600/600?random=10',
          'https://picsum.photos/600/600?random=11',
          'https://picsum.photos/600/600?random=12'
        ],
        originCountry: 'إيطاليا',
        thickness: '20mm, 30mm',
        density: '2.7 g/cm³',
        primaryColor: 'أبيض مع عروق ذهبية',
        applications: ['أرضيات فاخرة', 'حوائط مميزة', 'أسطح مطابخ', 'أحواض استحمام']
      },
      {
        id: '4',
        nameAr: 'جرانيت أحمر إمبريال',
        nameEn: 'Imperial Red Granite',
        nameEs: 'Granito Rojo Imperial',
        nameFr: 'Granit Rouge Impérial',
        category: 'GRANITE',
        descriptionAr: 'جرانيت أحمر إمبريال هو من أجمل أنواع الجرانيت الطبيعي. يتميز بلونه الأحمر الغني مع النقاط السوداء والرمادية التي تضفي عليه طابعاً ملكياً.',
        descriptionEn: 'Imperial Red Granite is one of the most beautiful natural granites. It features a rich red color with black and gray spots that give it a royal character.',
        images: [
          'https://picsum.photos/600/600?random=13',
          'https://picsum.photos/600/600?random=14',
          'https://picsum.photos/600/600?random=15',
          'https://picsum.photos/600/600?random=16'
        ],
        originCountry: 'الهند',
        thickness: '18mm, 20mm, 30mm',
        density: '2.9 g/cm³',
        primaryColor: 'أحمر مع نقاط سوداء ورمادية',
        applications: ['أرضيات', 'حوائط خارجية', 'أسطح مطابخ', 'نافورات', 'أعمدة']
      }
    ]

    const mockProduct = mockProducts.find(p => p.id === id)
    
    if (!mockProduct) {
      return NextResponse.json(
        { message: 'المنتج غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product: mockProduct })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { message: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    )
  }
}
