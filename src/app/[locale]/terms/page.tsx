import { use } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/settings'

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings()
  
  const title = locale === 'ar' ? 'الشروط والأحكام' :
                locale === 'es' ? 'Términos y Condiciones' :
                locale === 'fr' ? 'Termes et Conditions' :
                'Terms and Conditions'
  
  return {
    title: `${title} - ${settings.companyName || 'Lumerra Marble'}`,
    description: locale === 'ar' ? 'الشروط والأحكام وقواعد الاستخدام' :
                 locale === 'es' ? 'Términos y condiciones y reglas de uso' :
                 locale === 'fr' ? 'Termes et conditions et règles d\'utilisation' :
                 'Terms and conditions and usage rules',
  }
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params
  const settings = await getSiteSettings()
  
  // جلب محتوى الشروط والأحكام بناءً على اللغة
  let termsContent = ''
  
  if (locale === 'ar') {
    termsContent = settings.termsConditionsAr || settings.termsConditionsEn || ''
  } else if (locale === 'es') {
    termsContent = settings.termsConditionsEs || settings.termsConditionsEn || ''
  } else if (locale === 'fr') {
    termsContent = settings.termsConditionsFr || settings.termsConditionsEn || ''
  } else {
    termsContent = settings.termsConditionsEn || ''
  }
  
  // إذا لم يكن هناك محتوى، عرض رسالة افتراضية
  if (!termsContent) {
    const defaultMessage = locale === 'ar' ? 'الشروط والأحكام غير متوفرة حالياً.' :
                          locale === 'es' ? 'Los términos y condiciones no están disponibles actualmente.' :
                          locale === 'fr' ? 'Les termes et conditions ne sont pas disponibles actuellement.' :
                          'Terms and conditions are not currently available.'
    
    termsContent = defaultMessage
  }
  
  const title = locale === 'ar' ? 'الشروط والأحكام' :
                locale === 'es' ? 'Términos y Condiciones' :
                locale === 'fr' ? 'Termes et Conditions' :
                'Terms and Conditions'
  
  const isRTL = locale === 'ar'
  
  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-8 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {title}
          </h1>
          
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dir={isRTL ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: termsContent }}
          />
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400" dir={isRTL ? 'rtl' : 'ltr'}>
              {locale === 'ar' ? `آخر تحديث: ${new Date().toLocaleDateString('ar-EG')}` :
               locale === 'es' ? `Última actualización: ${new Date().toLocaleDateString('es-ES')}` :
               locale === 'fr' ? `Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}` :
               `Last updated: ${new Date().toLocaleDateString('en-US')}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
