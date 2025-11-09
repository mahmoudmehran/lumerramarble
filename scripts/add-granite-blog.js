const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addGraniteBlogPost() {
  try {
    console.log('📝 إضافة مقال عن جودة الجرانيت المصري...\n');

    const post = await prisma.blogPost.create({
      data: {
        slug: 'egyptian-granite-quality',
        
        // العناوين بالأربع لغات
        titleAr: 'جودة الجرانيت المصري: لماذا يعتبر الأفضل عالمياً؟',
        titleEn: 'Egyptian Granite Quality: Why Is It the Best Globally?',
        titleEs: 'Calidad del Granito Egipcio: ¿Por Qué Es el Mejor a Nivel Mundial?',
        titleFr: 'Qualité du Granit Égyptien : Pourquoi Est-il le Meilleur au Monde ?',
        
        // المحتوى بالأربع لغات مع كلمات مفتاحية SEO
        contentAr: `
# جودة الجرانيت المصري: لماذا يعتبر الأفضل عالمياً؟

## مقدمة عن الجرانيت المصري
يُعد **الجرانيت المصري** من أفضل أنواع الأحجار الطبيعية في العالم، حيث يتميز بجودة استثنائية ومتانة لا مثيل لها. مصر لديها تاريخ طويل في استخراج وتصدير الجرانيت منذ عصور الفراعنة.

## مميزات الجرانيت المصري

### 1. المتانة والصلابة الفائقة
- **جرانيت طبيعي عالي الجودة** يتحمل الظروف المناخية القاسية
- مقاومة عالية للخدش والتآكل
- عمر افتراضي يتجاوز 100 عام

### 2. التنوع في الألوان والأنواع
- **جرانيت أحمر أسواني** الشهير عالمياً
- جرانيت رمادي فاتح وداكن
- جرانيت أسود عالي اللمعان
- جرانيت وردي فاخر

### 3. السعر التنافسي
مقارنة بدول أخرى، **أسعار الجرانيت المصري** تنافسية للغاية مع الحفاظ على أعلى معايير الجودة.

## استخدامات الجرانيت المصري

### للمشاريع السكنية:
- **أرضيات جرانيت** فاخرة للفلل والقصور
- **واجهات منازل جرانيت** تدوم لعقود
- أسطح مطابخ من الجرانيت الطبيعي
- سلالم وممرات

### للمشاريع التجارية:
- **واجهات مباني تجارية** من الجرانيت
- أرضيات فنادق ومراكز تسوق
- ديكورات داخلية فاخرة

## لماذا تختار الجرانيت المصري؟

### 1. الجودة المضمونة
مصر تمتلك أفضل المحاجر في العالم، خاصة في **أسوان** و**البحر الأحمر**، حيث يتم استخراج الجرانيت بأحدث التقنيات.

### 2. التصدير العالمي
يتم **تصدير الجرانيت المصري** إلى أكثر من 100 دولة حول العالم، مما يثبت جودته العالمية.

### 3. الاستدامة
الجرانيت مادة طبيعية صديقة للبيئة، قابلة لإعادة التدوير بنسبة 100%.

## كيفية اختيار الجرانيت المناسب

### نصائح للشراء:
1. **فحص الجودة**: تأكد من عدم وجود شقوق أو تشوهات
2. **اختيار اللون**: حدد اللون المناسب لديكورك
3. **السمك المناسب**: للأرضيات استخدم 2-3 سم، للواجهات 3-4 سم
4. **التشطيب**: اختر بين اللمعان العالي (بوليش) أو المطفي

## أشهر أنواع الجرانيت المصري

### 1. جرانيت أحمر أسواني (Red Aswan)
الأكثر شهرة عالمياً، استخدمه الفراعنة في بناء المعابد والأهرامات.

### 2. جرانيت جندولا (Gandola)
لون رمادي أنيق، مثالي للديكورات الحديثة.

### 3. جرانيت فيردي غزال (Verdi Ghazal)
جرانيت أخضر فريد من نوعه.

### 4. جرانيت حلايب (Halayeb)
لون وردي فاتح، يضيف لمسة من الفخامة.

## الخلاصة
**الجرانيت المصري** هو الخيار الأمثل لمن يبحث عن الجودة، المتانة، والسعر التنافسي. سواء كنت تبحث عن **جرانيت للأرضيات**، **واجهات**، أو **ديكورات داخلية**، ستجد في مصر أفضل الأنواع والألوان.

## تواصل معنا
للحصول على أفضل **أسعار الجرانيت المصري** واستشارة مجانية، تواصل مع شركة لوميرا ماربل اليوم!

---

**كلمات مفتاحية:** جرانيت مصري، جرانيت أحمر أسواني، أسعار الجرانيت، تصدير جرانيت، جرانيت طبيعي، واجهات جرانيت، أرضيات جرانيت، جودة الجرانيت المصري
`,

        contentEn: `
# Egyptian Granite Quality: Why Is It the Best Globally?

## Introduction to Egyptian Granite
**Egyptian granite** is among the finest natural stones in the world, distinguished by exceptional quality and unparalleled durability. Egypt has a long history of extracting and exporting granite dating back to the Pharaonic era.

## Features of Egyptian Granite

### 1. Superior Durability and Hardness
- **High-quality natural granite** withstands harsh weather conditions
- High resistance to scratching and wear
- Lifespan exceeding 100 years

### 2. Variety in Colors and Types
- World-famous **Red Aswan granite**
- Light and dark gray granite
- High-gloss black granite
- Luxurious pink granite

### 3. Competitive Pricing
Compared to other countries, **Egyptian granite prices** are highly competitive while maintaining the highest quality standards.

## Uses of Egyptian Granite

### For Residential Projects:
- Luxurious **granite flooring** for villas and palaces
- **Granite house facades** that last for decades
- Natural granite kitchen countertops
- Stairs and walkways

### For Commercial Projects:
- **Commercial building facades** in granite
- Hotel and shopping mall flooring
- Luxurious interior decorations

## Why Choose Egyptian Granite?

### 1. Guaranteed Quality
Egypt owns the world's best quarries, especially in **Aswan** and the **Red Sea**, where granite is extracted using the latest technologies.

### 2. Global Export
**Egyptian granite is exported** to over 100 countries worldwide, proving its global quality.

### 3. Sustainability
Granite is a natural, eco-friendly material that is 100% recyclable.

## How to Choose the Right Granite

### Buying Tips:
1. **Quality Check**: Ensure no cracks or deformities
2. **Color Selection**: Choose the color that suits your decor
3. **Appropriate Thickness**: Use 2-3 cm for flooring, 3-4 cm for facades
4. **Finish**: Choose between high gloss (polished) or matte

## Most Famous Egyptian Granite Types

### 1. Red Aswan Granite
The most famous worldwide, used by Pharaohs in building temples and pyramids.

### 2. Gandola Granite
Elegant gray color, ideal for modern decorations.

### 3. Verdi Ghazal Granite
A unique green granite.

### 4. Halayeb Granite
Light pink color, adds a touch of luxury.

## Conclusion
**Egyptian granite** is the optimal choice for those seeking quality, durability, and competitive pricing. Whether you're looking for **granite flooring**, **facades**, or **interior decorations**, you'll find the best types and colors in Egypt.

## Contact Us
For the best **Egyptian granite prices** and free consultation, contact Lumerra Marble today!

---

**Keywords:** Egyptian granite, Red Aswan granite, granite prices, granite export, natural granite, granite facades, granite flooring, Egyptian granite quality
`,

        contentEs: `
# Calidad del Granito Egipcio: ¿Por Qué Es el Mejor a Nivel Mundial?

## Introducción al Granito Egipcio
El **granito egipcio** se encuentra entre las mejores piedras naturales del mundo, distinguido por su calidad excepcional y durabilidad sin igual. Egipto tiene una larga historia de extracción y exportación de granito que se remonta a la era faraónica.

## Características del Granito Egipcio

### 1. Durabilidad y Dureza Superiores
- **Granito natural de alta calidad** que resiste condiciones climáticas severas
- Alta resistencia al rayado y al desgaste
- Vida útil superior a 100 años

### 2. Variedad en Colores y Tipos
- **Granito Rojo de Asuán** famoso mundialmente
- Granito gris claro y oscuro
- Granito negro de alto brillo
- Granito rosa lujoso

### 3. Precios Competitivos
En comparación con otros países, los **precios del granito egipcio** son altamente competitivos mientras mantienen los más altos estándares de calidad.

## Usos del Granito Egipcio

### Para Proyectos Residenciales:
- **Pisos de granito** lujosos para villas y palacios
- **Fachadas de casas de granito** que duran décadas
- Encimeras de cocina de granito natural
- Escaleras y pasillos

### Para Proyectos Comerciales:
- **Fachadas de edificios comerciales** en granito
- Pisos de hoteles y centros comerciales
- Decoraciones interiores lujosas

## ¿Por Qué Elegir el Granito Egipcio?

### 1. Calidad Garantizada
Egipto posee las mejores canteras del mundo, especialmente en **Asuán** y el **Mar Rojo**, donde se extrae granito con las últimas tecnologías.

### 2. Exportación Global
El **granito egipcio se exporta** a más de 100 países en todo el mundo, lo que demuestra su calidad global.

### 3. Sostenibilidad
El granito es un material natural y ecológico que es 100% reciclable.

## Conclusión
El **granito egipcio** es la opción óptima para quienes buscan calidad, durabilidad y precios competitivos.

## Contáctenos
Para obtener los mejores **precios de granito egipcio** y consulta gratuita, ¡contacte con Lumerra Marble hoy!

---

**Palabras clave:** Granito egipcio, granito rojo Asuán, precios granito, exportación granito, granito natural, fachadas granito, pisos granito
`,

        contentFr: `
# Qualité du Granit Égyptien : Pourquoi Est-il le Meilleur au Monde ?

## Introduction au Granit Égyptien
Le **granit égyptien** figure parmi les meilleures pierres naturelles au monde, se distinguant par une qualité exceptionnelle et une durabilité inégalée. L'Égypte a une longue histoire d'extraction et d'exportation de granit remontant à l'ère pharaonique.

## Caractéristiques du Granit Égyptien

### 1. Durabilité et Dureté Supérieures
- **Granit naturel de haute qualité** résistant aux conditions météorologiques difficiles
- Haute résistance aux rayures et à l'usure
- Durée de vie supérieure à 100 ans

### 2. Variété de Couleurs et de Types
- **Granit Rouge d'Assouan** mondialement célèbre
- Granit gris clair et foncé
- Granit noir très brillant
- Granit rose luxueux

### 3. Prix Compétitifs
Par rapport à d'autres pays, les **prix du granit égyptien** sont très compétitifs tout en maintenant les normes de qualité les plus élevées.

## Utilisations du Granit Égyptien

### Pour les Projets Résidentiels :
- **Sols en granit** luxueux pour villas et palais
- **Façades de maisons en granit** qui durent des décennies
- Plans de travail de cuisine en granit naturel
- Escaliers et allées

### Pour les Projets Commerciaux :
- **Façades de bâtiments commerciaux** en granit
- Sols d'hôtels et de centres commerciaux
- Décorations intérieures luxueuses

## Pourquoi Choisir le Granit Égyptien ?

### 1. Qualité Garantie
L'Égypte possède les meilleures carrières au monde, en particulier à **Assouan** et en **Mer Rouge**, où le granit est extrait avec les dernières technologies.

### 2. Export Mondial
Le **granit égyptien est exporté** vers plus de 100 pays dans le monde, prouvant sa qualité mondiale.

### 3. Durabilité
Le granit est un matériau naturel et écologique, recyclable à 100%.

## Conclusion
Le **granit égyptien** est le choix optimal pour ceux qui recherchent la qualité, la durabilité et des prix compétitifs.

## Contactez-nous
Pour les meilleurs **prix du granit égyptien** et une consultation gratuite, contactez Lumerra Marble aujourd'hui !

---

**Mots-clés :** Granit égyptien, granit rouge Assouan, prix granit, export granit, granit naturel, façades granit, sols granit
`,

        // الملخصات بالأربع لغات
        excerptAr: 'اكتشف لماذا يُعتبر الجرانيت المصري الأفضل عالمياً. تعرف على أنواعه، مميزاته، استخداماته، وأسعاره التنافسية. دليلك الشامل لاختيار الجرانيت المناسب لمشروعك.',
        excerptEn: 'Discover why Egyptian granite is considered the best globally. Learn about its types, features, uses, and competitive prices. Your comprehensive guide to choosing the right granite for your project.',
        excerptEs: 'Descubra por qué el granito egipcio se considera el mejor a nivel mundial. Conozca sus tipos, características, usos y precios competitivos.',
        excerptFr: 'Découvrez pourquoi le granit égyptien est considéré comme le meilleur au monde. Apprenez-en plus sur ses types, caractéristiques, utilisations et prix compétitifs.',

        // يمكنك إضافة صورة هنا (ضع الصورة في مجلد public/uploads أولاً)
        featuredImage: '/images/granite-quality.jpg', // غيّر هذا المسار حسب الصورة الفعلية
        
        featured: true,
        published: true,
        
        // يمكنك ربطها بفئة إذا كانت موجودة
        // categoryId: 'category-id-here'
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
    
    console.log('\n📸 كيفية إضافة صورة للمقال:');
    console.log('   1. ضع الصورة في مجلد: public/images/ أو public/uploads/');
    console.log('   2. أو ارفع الصورة من لوحة التحكم عند التعديل');
    console.log('   3. المسار الحالي للصورة: ' + post.featuredImage);
    
  } catch (error) {
    console.error('❌ خطأ في إضافة المقال:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addGraniteBlogPost();
