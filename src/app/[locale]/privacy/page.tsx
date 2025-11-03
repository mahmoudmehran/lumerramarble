import { use } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/settings'

interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings()
  
  const title = locale === 'ar' ? 'سياسة الخصوصية' :
                locale === 'es' ? 'Política de Privacidad' :
                locale === 'fr' ? 'Politique de Confidentialité' :
                'Privacy Policy'
  
  return {
    title: `${title} - ${settings.companyName || 'Lumerra Marble'}`,
    description: locale === 'ar' ? 'سياسة الخصوصية وحماية البيانات' :
                 locale === 'es' ? 'Política de privacidad y protección de datos' :
                 locale === 'fr' ? 'Politique de confidentialité et protection des données' :
                 'Privacy policy and data protection',
  }
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params
  const settings = await getSiteSettings()
  
  // جلب محتوى سياسة الخصوصية بناءً على اللغة
  let privacyContent = ''
  
  if (locale === 'ar') {
    privacyContent = settings.privacyPolicyAr || settings.privacyPolicyEn || ''
  } else if (locale === 'es') {
    privacyContent = settings.privacyPolicyEs || settings.privacyPolicyEn || ''
  } else if (locale === 'fr') {
    privacyContent = settings.privacyPolicyFr || settings.privacyPolicyEn || ''
  } else {
    privacyContent = settings.privacyPolicyEn || ''
  }
  
  // إذا لم يكن هناك محتوى، عرض رسالة افتراضية
  if (!privacyContent) {
    const defaultMessage = locale === 'ar' ? 'سياسة الخصوصية غير متوفرة حالياً.' :
                          locale === 'es' ? 'La política de privacidad no está disponible actualmente.' :
                          locale === 'fr' ? 'La politique de confidentialité n\'est pas disponible actuellement.' :
                          'Privacy policy is not currently available.'
    
    privacyContent = defaultMessage
  }
  
  const title = locale === 'ar' ? 'سياسة الخصوصية' :
                locale === 'es' ? 'Política de Privacidad' :
                locale === 'fr' ? 'Politique de Confidentialité' :
                'Privacy Policy'
  
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
            dangerouslySetInnerHTML={{ __html: privacyContent }}
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
