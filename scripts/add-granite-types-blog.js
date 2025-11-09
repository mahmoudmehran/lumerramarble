const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addGraniteTypesPost() {
  try {
    console.log('📝 إضافة مقال عن أنواع الجرانيت المصري وأشكاله...\n');

    const post = await prisma.blogPost.create({
      data: {
        slug: 'types-of-egyptian-granite',
        
        // العناوين بالأربع لغات
        titleAr: 'أنواع الجرانيت المصري: دليل شامل للألوان والأشكال',
        titleEn: 'Types of Egyptian Granite: A Complete Guide to Colors and Patterns',
        titleEs: 'Tipos de Granito Egipcio: Guía Completa de Colores y Patrones',
        titleFr: 'Types de Granit Égyptien : Guide Complet des Couleurs et Motifs',
        
        // المحتوى بالأربع لغات مع كلمات مفتاحية SEO
        contentAr: `
# أنواع الجرانيت المصري: دليل شامل للألوان والأشكال

## مقدمة عن تنوع الجرانيت المصري

تشتهر مصر بإنتاج **أفضل أنواع الجرانيت** في العالم بألوان وأشكال متنوعة. من **الجرانيت الأحمر الأسواني** الشهير عالمياً إلى **الجرانيت الوردي** الفاخر، تقدم مصر مجموعة واسعة تناسب جميع الأذواق والمشاريع.

---

## 🔴 أنواع الجرانيت المصري حسب اللون

### 1. الجرانيت الأحمر (Red Granite)

#### جرانيت أحمر أسواني (Red Aswan)
- **اللون**: أحمر داكن إلى وردي محمر
- **الخصائص**: صلابة عالية جداً، لمعان طبيعي
- **الاستخدامات**: واجهات المباني، النصب التذكارية، الأعمدة
- **التاريخ**: استخدمه الفراعنة في بناء المعابد والمسلات
- **السعر**: مرتفع نسبياً نظراً لجودته الاستثنائية
- **المحاجر**: أسوان، جنوب مصر

#### جرانيت روزا النصر (Rosa El Nasr)
- **اللون**: وردي مع نقاط سوداء ورمادية
- **الملمس**: حبيبات متوسطة إلى خشنة
- **الاستخدامات**: أرضيات، واجهات داخلية، ديكورات
- **المميزات**: توازن مثالي بين الجمال والسعر

#### جرانيت فورزا روزا (Forza Rosa)
- **اللون**: وردي فاتح إلى محمر
- **الملمس**: حبيبات ناعمة ومتساوية
- **الاستخدامات**: مطابخ، حمامات، واجهات فاخرة

---

### 2. الجرانيت الرمادي (Grey Granite)

#### جرانيت جندولا (Gandola Granite)
- **اللون**: رمادي فاتح مع عروق بيضاء وسوداء
- **الأسلوب**: حديث وعصري
- **الاستخدامات**: 
  - أرضيات المكاتب والشركات
  - واجهات المباني التجارية
  - ديكورات داخلية معاصرة
- **المميزات**: أناقة عالية، سهل التنظيف

#### جرانيت حلايب (Halayeb Granite)
- **اللون**: رمادي متوسط مع نقاط سوداء
- **الصلابة**: عالية جداً
- **مقاوم للعوامل الجوية**: ممتاز للاستخدام الخارجي

#### جرانيت سيلفر شاين (Silver Shine)
- **اللون**: رمادي فضي براق
- **اللمعان**: عالي جداً بعد التلميع
- **الاستخدامات**: واجهات فنادق، مداخل فاخرة

---

### 3. الجرانيت الأسود (Black Granite)

#### جرانيت أسود أسوان (Black Aswan)
- **اللون**: أسود نقي مع لمعان عالي
- **الفخامة**: من أغلى الأنواع
- **الاستخدامات**: 
  - أسطح مطابخ فاخرة
  - أرضيات قصور وفنادق 5 نجوم
  - نصب تذكارية
- **المميزات**: مقاومة عالية للخدش والحرارة

#### جرانيت جالاكسي بلاك (Galaxy Black)
- **اللون**: أسود مع نقاط ذهبية لامعة
- **المظهر**: يشبه السماء المرصعة بالنجوم
- **الاستخدامات**: ديكورات فاخرة، واجهات مميزة

---

### 4. الجرانيت الأخضر (Green Granite)

#### جرانيت فيردي غزال (Verdi Ghazal)
- **اللون**: أخضر داكن مع عروق سوداء وبيضاء
- **التفرد**: نادر ومميز
- **الاستخدامات**: ديكورات خاصة، واجهات فريدة
- **السعر**: مرتفع بسبب ندرته

#### جرانيت زمرد (Emerald Granite)
- **اللون**: أخضر زمردي براق
- **المظهر**: فاخر ولافت للنظر

---

### 5. الجرانيت الأبيض والبيج (White & Beige Granite)

#### جرانيت سيناي بيرل (Sinai Pearl)
- **اللون**: بيج فاتح مع عروق ذهبية
- **الأسلوب**: كلاسيكي أنيق
- **الاستخدامات**: 
  - أرضيات فلل
  - واجهات منازل كلاسيكية
  - ديكورات داخلية دافئة

#### جرانيت صني مصر (Sunny Egypt)
- **اللون**: أصفر فاتح إلى بيج ذهبي
- **المظهر**: دافئ ومشرق
- **مناسب للمناخ**: يعكس الحرارة في الصيف

---

## 📐 أشكال وتشطيبات الجرانيت المصري

### 1. التشطيب اللامع (Polished)
- **المظهر**: لمعان عالي كالمرآة
- **الاستخدامات**: أرضيات داخلية، أسطح مطابخ
- **المميزات**: يبرز جمال الألوان والعروق
- **العيوب**: قد ينزلق في الأماكن الرطبة

### 2. التشطيب المطفي (Honed)
- **المظهر**: سطح ناعم بدون لمعان
- **الاستخدامات**: أرضيات حمامات، مناطق خارجية
- **المميزات**: غير زلق، مظهر طبيعي

### 3. التشطيب المشطف (Brushed)
- **المظهر**: سطح خشن قليلاً مع خطوط
- **الاستخدامات**: أرضيات خارجية، ممرات
- **المميزات**: مقاوم للانزلاق

### 4. التشطيب المحروق (Flamed)
- **المظهر**: سطح خشن مع نتوءات
- **الاستخدامات**: ممرات حدائق، أرصفة
- **المميزات**: مقاومة عالية جداً للانزلاق

### 5. التشطيب المسفوع بالرمل (Sandblasted)
- **المظهر**: سطح محبب ناعم
- **الاستخدامات**: واجهات خارجية، جدران
- **المميزات**: مظهر عتيق وفني

### 6. تشطيب بوش هامر (Bush Hammered)
- **المظهر**: سطح منقط بنتوءات صغيرة
- **الاستخدامات**: أرضيات خارجية ثقيلة
- **المميزات**: متانة استثنائية

---

## 🏗️ استخدامات الجرانيت حسب النوع

### للأرضيات الداخلية:
- **جرانيت جندولا** (Gandola)
- **جرانيت روزا** (Rosa)
- **جرانيت أسود أسوان** (Black Aswan)
- التشطيب المفضل: **Polished** أو **Honed**

### للواجهات الخارجية:
- **جرانيت أحمر أسواني** (Red Aswan)
- **جرانيت حلايب** (Halayeb)
- **جرانيت سيناي بيرل** (Sinai Pearl)
- التشطيب المفضل: **Flamed** أو **Sandblasted**

### لأسطح المطابخ:
- **جرانيت أسود أسوان** (Black Aswan)
- **جرانيت جالاكسي بلاك** (Galaxy Black)
- **جرانيت روزا النصر** (Rosa El Nasr)
- التشطيب المفضل: **Polished**

### للديكورات الفاخرة:
- **جرانيت فيردي غزال** (Verdi Ghazal)
- **جرانيت فورزا روزا** (Forza Rosa)
- **جرانيت زمرد** (Emerald)

---

## 💰 مقارنة الأسعار

### الفئة العليا (Premium):
1. **جرانيت أسود أسوان** - الأعلى سعراً
2. **جرانيت فيردي غزال** - نادر ومكلف
3. **جرانيت أحمر أسواني** - تاريخي وفاخر

### الفئة المتوسطة:
1. **جرانيت جندولا**
2. **جرانيت حلايب**
3. **جرانيت روزا النصر**

### الفئة الاقتصادية:
1. **جرانيت سيناي بيرل**
2. **جرانيت صني مصر**
3. **جرانيت سيلفر شاين**

---

## 🔍 كيف تختار النوع المناسب؟

### حسب الموقع:
- **داخلي رطب** (حمامات): جرانيت مطفي غير زلق
- **داخلي جاف** (صالات): جرانيت لامع فاخر
- **خارجي**: جرانيت محروق مقاوم للعوامل

### حسب الأسلوب:
- **كلاسيكي**: جرانيت بيج وروزا
- **حديث**: جرانيت رمادي وأسود
- **فاخر**: جرانيت أخضر وأسود

### حسب الميزانية:
- **عالية**: أسود أسوان، فيردي غزال
- **متوسطة**: جندولا، روزا النصر
- **اقتصادية**: سيناي بيرل، صني مصر

---

## 🌍 مناطق استخراج الجرانيت في مصر

### أسوان:
أشهر محاجر الجرانيت في العالم
- جرانيت أحمر أسواني
- جرانيت أسود أسوان
- جرانيت روزا

### البحر الأحمر:
محاجر حديثة بتقنيات متطورة
- جرانيت حلايب
- جرانيت فيردي غزال

### سيناء:
- جرانيت سيناي بيرل
- أنواع بيج وذهبية

---

## ✅ مميزات الجرانيت المصري

1. **تنوع هائل**: أكثر من 50 نوع ولون
2. **جودة عالمية**: معايير دولية
3. **أسعار تنافسية**: أفضل قيمة مقابل السعر
4. **توفر مستمر**: إنتاج طوال العام
5. **تصدير عالمي**: يُصدّر لأكثر من 100 دولة

---

## 📞 احصل على أفضل أنواع الجرانيت المصري

هل تبحث عن نوع معين من **الجرانيت المصري**؟ شركة **لوميرا ماربل** توفر:
- ✅ جميع الأنواع والألوان
- ✅ تشطيبات متنوعة
- ✅ أسعار تنافسية
- ✅ تصدير عالمي
- ✅ استشارة مجانية

**تواصل معنا اليوم للحصول على عرض سعر مخصص!**

---

**كلمات مفتاحية:** أنواع الجرانيت المصري، جرانيت أحمر أسواني، جرانيت جندولا، أشكال الجرانيت، ألوان الجرانيت، جرانيت أسود، جرانيت روزا، تشطيبات الجرانيت، أسعار الجرانيت المصري، جرانيت فيردي غزال
`,

        contentEn: `
# Types of Egyptian Granite: A Complete Guide to Colors and Patterns

## Introduction to Egyptian Granite Variety

Egypt is renowned for producing the **finest granite types** in the world with diverse colors and patterns. From the globally famous **Red Aswan Granite** to luxurious **Pink Granite**, Egypt offers an extensive range suitable for all tastes and projects.

---

## 🔴 Types of Egyptian Granite by Color

### 1. Red Granite

#### Red Aswan Granite
- **Color**: Dark red to pinkish red
- **Properties**: Extremely high hardness, natural shine
- **Uses**: Building facades, monuments, columns
- **History**: Used by Pharaohs in temple and obelisk construction
- **Price**: Relatively high due to exceptional quality
- **Quarries**: Aswan, Southern Egypt

#### Rosa El Nasr Granite
- **Color**: Pink with black and gray spots
- **Texture**: Medium to coarse grains
- **Uses**: Flooring, interior facades, decorations
- **Advantages**: Perfect balance between beauty and price

---

### 2. Grey Granite

#### Gandola Granite
- **Color**: Light grey with white and black veins
- **Style**: Modern and contemporary
- **Uses**: 
  - Office and corporate flooring
  - Commercial building facades
  - Contemporary interior decorations
- **Advantages**: High elegance, easy to clean

#### Halayeb Granite
- **Color**: Medium grey with black spots
- **Hardness**: Very high
- **Weather resistance**: Excellent for outdoor use

---

### 3. Black Granite

#### Black Aswan Granite
- **Color**: Pure black with high shine
- **Luxury**: Among the most expensive types
- **Uses**: 
  - Luxury kitchen countertops
  - Palace and 5-star hotel flooring
  - Monuments
- **Advantages**: High resistance to scratches and heat

#### Galaxy Black Granite
- **Color**: Black with shiny golden spots
- **Appearance**: Resembles a star-studded sky
- **Uses**: Luxury decorations, distinctive facades

---

### 4. Green Granite

#### Verdi Ghazal Granite
- **Color**: Dark green with black and white veins
- **Uniqueness**: Rare and distinctive
- **Uses**: Special decorations, unique facades
- **Price**: High due to rarity

---

### 5. White & Beige Granite

#### Sinai Pearl Granite
- **Color**: Light beige with golden veins
- **Style**: Classic elegance
- **Uses**: 
  - Villa flooring
  - Classic house facades
  - Warm interior decorations

---

## 📐 Egyptian Granite Shapes and Finishes

### 1. Polished Finish
- **Appearance**: Mirror-like high gloss
- **Uses**: Indoor flooring, kitchen countertops
- **Advantages**: Highlights color and vein beauty
- **Drawbacks**: May be slippery in wet areas

### 2. Honed Finish
- **Appearance**: Smooth surface without shine
- **Uses**: Bathroom flooring, outdoor areas
- **Advantages**: Non-slip, natural appearance

### 3. Brushed Finish
- **Appearance**: Slightly rough surface with lines
- **Uses**: Outdoor flooring, walkways
- **Advantages**: Slip-resistant

### 4. Flamed Finish
- **Appearance**: Rough surface with protrusions
- **Uses**: Garden walkways, sidewalks
- **Advantages**: Very high slip resistance

### 5. Sandblasted Finish
- **Appearance**: Soft textured surface
- **Uses**: Exterior facades, walls
- **Advantages**: Antique and artistic appearance

### 6. Bush Hammered Finish
- **Appearance**: Dotted surface with small protrusions
- **Uses**: Heavy outdoor flooring
- **Advantages**: Exceptional durability

---

## 🏗️ Granite Uses by Type

### Indoor Flooring:
- **Gandola Granite**
- **Rosa Granite**
- **Black Aswan Granite**
- Preferred Finish: **Polished** or **Honed**

### Exterior Facades:
- **Red Aswan Granite**
- **Halayeb Granite**
- **Sinai Pearl Granite**
- Preferred Finish: **Flamed** or **Sandblasted**

### Kitchen Countertops:
- **Black Aswan Granite**
- **Galaxy Black Granite**
- **Rosa El Nasr Granite**
- Preferred Finish: **Polished**

---

## 💰 Price Comparison

### Premium Category:
1. **Black Aswan Granite** - Highest price
2. **Verdi Ghazal Granite** - Rare and expensive
3. **Red Aswan Granite** - Historic and luxurious

### Mid-Range Category:
1. **Gandola Granite**
2. **Halayeb Granite**
3. **Rosa El Nasr Granite**

### Economic Category:
1. **Sinai Pearl Granite**
2. **Sunny Egypt Granite**
3. **Silver Shine Granite**

---

## 📞 Get the Best Egyptian Granite Types

Looking for a specific type of **Egyptian Granite**? **Lumerra Marble** provides:
- ✅ All types and colors
- ✅ Various finishes
- ✅ Competitive prices
- ✅ Global export
- ✅ Free consultation

**Contact us today for a customized quote!**

---

**Keywords:** Egyptian granite types, Red Aswan granite, Gandola granite, granite shapes, granite colors, black granite, Rosa granite, granite finishes, Egyptian granite prices, Verdi Ghazal granite
`,

        contentEs: `
# Tipos de Granito Egipcio: Guía Completa de Colores y Patrones

## Introducción a la Variedad del Granito Egipcio

Egipto es reconocido por producir los **mejores tipos de granito** del mundo con colores y patrones diversos. Desde el mundialmente famoso **Granito Rojo de Asuán** hasta el lujoso **Granito Rosa**, Egipto ofrece una amplia gama adecuada para todos los gustos y proyectos.

## 🔴 Tipos de Granito Egipcio por Color

### 1. Granito Rojo

#### Granito Rojo de Asuán
- **Color**: Rojo oscuro a rojo rosado
- **Propiedades**: Dureza extremadamente alta, brillo natural
- **Usos**: Fachadas de edificios, monumentos, columnas
- **Precio**: Relativamente alto debido a su calidad excepcional

### 2. Granito Gris

#### Granito Gandola
- **Color**: Gris claro con vetas blancas y negras
- **Estilo**: Moderno y contemporáneo
- **Usos**: Pisos de oficinas, fachadas comerciales

### 3. Granito Negro

#### Granito Negro de Asuán
- **Color**: Negro puro con alto brillo
- **Lujo**: Entre los tipos más caros
- **Usos**: Encimeras de cocina de lujo, pisos de palacios

## Contáctenos

¿Busca un tipo específico de **granito egipcio**? **Lumerra Marble** ofrece:
- ✅ Todos los tipos y colores
- ✅ Varios acabados
- ✅ Precios competitivos
- ✅ Exportación global

**Palabras clave:** Tipos de granito egipcio, granito rojo Asuán, granito Gandola, colores de granito
`,

        contentFr: `
# Types de Granit Égyptien : Guide Complet des Couleurs et Motifs

## Introduction à la Variété du Granit Égyptien

L'Égypte est réputée pour produire les **meilleurs types de granit** au monde avec des couleurs et des motifs divers. Du célèbre **Granit Rouge d'Assouan** au luxueux **Granit Rose**, l'Égypte offre une large gamme adaptée à tous les goûts et projets.

## 🔴 Types de Granit Égyptien par Couleur

### 1. Granit Rouge

#### Granit Rouge d'Assouan
- **Couleur**: Rouge foncé à rouge rosé
- **Propriétés**: Dureté extrêmement élevée, brillance naturelle
- **Utilisations**: Façades de bâtiments, monuments, colonnes
- **Prix**: Relativement élevé en raison de sa qualité exceptionnelle

### 2. Granit Gris

#### Granit Gandola
- **Couleur**: Gris clair avec veines blanches et noires
- **Style**: Moderne et contemporain
- **Utilisations**: Sols de bureaux, façades commerciales

### 3. Granit Noir

#### Granit Noir d'Assouan
- **Couleur**: Noir pur avec éclat élevé
- **Luxe**: Parmi les types les plus chers
- **Utilisations**: Plans de travail de cuisine de luxe, sols de palais

## Contactez-nous

Vous recherchez un type spécifique de **granit égyptien** ? **Lumerra Marble** propose :
- ✅ Tous les types et couleurs
- ✅ Divers finitions
- ✅ Prix compétitifs
- ✅ Export mondial

**Mots-clés:** Types de granit égyptien, granit rouge Assouan, granit Gandola, couleurs de granit
`,

        // الملخصات بالأربع لغات
        excerptAr: 'دليل شامل لجميع أنواع الجرانيت المصري من حيث الألوان والأشكال والتشطيبات. تعرف على الجرانيت الأحمر الأسواني، جندولا، حلايب، فيردي غزال وأكثر من 15 نوع مع الأسعار والاستخدامات.',
        excerptEn: 'A comprehensive guide to all Egyptian granite types in terms of colors, shapes, and finishes. Learn about Red Aswan, Gandola, Halayeb, Verdi Ghazal granite and more than 15 types with prices and uses.',
        excerptEs: 'Guía completa de todos los tipos de granito egipcio en términos de colores, formas y acabados. Conozca el granito Rojo Asuán, Gandola, Halayeb y más de 15 tipos.',
        excerptFr: 'Guide complet de tous les types de granit égyptien en termes de couleurs, formes et finitions. Découvrez le granit Rouge Assouan, Gandola, Halayeb et plus de 15 types.',

        featuredImage: '/images/granite-types.jpg',
        
        featured: true,
        published: true,
      }
    });

    console.log('✅ تم إضافة المقال بنجاح!\n');
    console.log('📄 تفاصيل المقال:');
    console.log(`   ID: ${post.id}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   العنوان (عربي): ${post.titleAr}`);
    console.log(`   العنوان (English): ${post.titleEn}`);
    console.log(`   مميز: ${post.featured ? '✓' : '✗'}`);
    console.log(`   منشور: ${post.published ? '✓' : '✗'}`);
    console.log(`   تاريخ الإنشاء: ${post.createdAt}`);
    console.log(`   صورة: ${post.featuredImage}`);
    
    console.log('\n📊 المحتوى يشمل:');
    console.log('   • 15+ نوع من الجرانيت المصري');
    console.log('   • تصنيف حسب اللون (أحمر، رمادي، أسود، أخضر، بيج)');
    console.log('   • 6 أنواع تشطيبات مختلفة');
    console.log('   • دليل الاستخدامات والأسعار');
    console.log('   • كلمات مفتاحية SEO محسّنة');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('❌ خطأ: الـ slug موجود مسبقاً!');
      console.log('💡 حل: احذف المقال القديم أو غيّر الـ slug');
    } else {
      console.error('❌ خطأ في إضافة المقال:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addGraniteTypesPost();
