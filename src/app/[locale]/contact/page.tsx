import { MapPin, Phone, Mail, Clock, Youtube, Instagram, Facebook } from 'lucide-react'
import { Card } from '../../../components/ui/card'
import { getContent } from '../../../lib/content'
import { getSiteSettings } from '../../../lib/settings'
import ContactForm from './ContactForm'
import { PageHeader, ContentSection } from '../../../components/ui/page-sections'

// WhatsApp & TikTok Icons (not available in lucide-react)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'
  
  // جلب المحتوى من قاعدة البيانات
  const content = await getContent('contact')
  const siteSettings = await getSiteSettings()
  
  const getText = (sectionKey: string, contentKey: string) => {
    return content[sectionKey]?.[contentKey]?.[locale as keyof typeof content[string][string]] || ''
  }

  return (
    <div className="min-h-screen bg-[var(--color-quinary-50)]">
      {/* Header Section */}
      <PageHeader
        title={getText('hero', 'title')}
        subtitle={getText('hero', 'subtitle')}
      />

      <ContentSection variant="white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            {/* Combined Card - Same height as form */}
            <div className="bg-gradient-to-br from-white via-[var(--color-primary-50)] to-[var(--color-secondary-50)] rounded-2xl shadow-xl border-2 border-[var(--color-primary-200)] h-full flex flex-col p-8">
                
                {/* Social Media Icons Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-6 text-center">
                    {locale === 'ar' ? 'تواصل معنا' : locale === 'en' ? 'Contact Us' : locale === 'es' ? 'Contáctenos' : 'Contactez-nous'}
                  </h3>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {/* WhatsApp */}
                    {siteSettings?.whatsapp && (
                      <a 
                        href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all duration-300 transform hover:scale-125"
                        title="WhatsApp"
                      >
                        <WhatsAppIcon />
                      </a>
                    )}

                    {/* Phone */}
                    {siteSettings?.phone && (
                      <a 
                        href={`tel:${siteSettings.phone}`}
                        className="flex items-center justify-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all duration-300 transform hover:scale-125"
                        title={locale === 'ar' ? 'اتصل بنا' : locale === 'en' ? 'Call Us' : locale === 'es' ? 'Llámanos' : 'Appelez-nous'}
                      >
                        <Phone className="w-7 h-7" />
                      </a>
                    )}

                    {/* Email */}
                    {siteSettings?.email && (
                      <a 
                        href={`mailto:${siteSettings.email}`}
                        className="flex items-center justify-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all duration-300 transform hover:scale-125"
                        title={locale === 'ar' ? 'راسلنا' : locale === 'en' ? 'Email Us' : locale === 'es' ? 'Envíanos un correo' : 'Envoyez-nous un email'}
                      >
                        <Mail className="w-7 h-7" />
                      </a>
                    )}

                    {/* Location */}
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all duration-300 transform hover:scale-125"
                      title={locale === 'ar' ? 'موقعنا' : locale === 'en' ? 'Our Location' : locale === 'es' ? 'Nuestra ubicación' : 'Notre emplacement'}
                    >
                      <MapPin className="w-7 h-7" />
                    </a>

                    {/* YouTube */}
                    {siteSettings?.youtube && (
                      <a 
                        href={siteSettings.youtube}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all duration-300 transform hover:scale-125"
                        title="YouTube"
                      >
                        <Youtube className="w-7 h-7" />
                      </a>
                    )}

                    {/* TikTok */}
                    {siteSettings?.tiktok && (
                      <a 
                        href={siteSettings.tiktok}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all duration-300 transform hover:scale-125"
                        title="TikTok"
                      >
                        <TikTokIcon />
                      </a>
                    )}

                    {/* Instagram */}
                    {siteSettings?.instagram && (
                      <a 
                        href={siteSettings.instagram}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all duration-300 transform hover:scale-125"
                        title="Instagram"
                      >
                        <Instagram className="w-7 h-7" />
                      </a>
                    )}

                    {/* Facebook */}
                    {siteSettings?.facebook && (
                      <a 
                        href={siteSettings.facebook}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all duration-300 transform hover:scale-125"
                        title="Facebook"
                      >
                        <Facebook className="w-7 h-7" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t-2 border-[var(--color-primary-200)] mb-8"></div>

                {/* Working Hours Section */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white rounded-full p-3 shadow-lg flex-shrink-0">
                      <Clock className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-secondary)]">
                      {locale === 'ar' ? 'مواعيد العمل' : locale === 'en' ? 'Working Hours' : locale === 'es' ? 'Horario de Trabajo' : 'Heures de Travail'}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between gap-3 flex-nowrap">
                        <span className="font-bold text-[var(--color-secondary)] text-base whitespace-nowrap">
                          {locale === 'ar' ? 'الأحد - الخميس' : locale === 'en' ? 'Sun - Thu' : locale === 'es' ? 'Dom - Jue' : 'Dim - Jeu'}
                        </span>
                        <span className="text-[var(--color-primary)] font-bold text-base whitespace-nowrap" style={{ direction: 'ltr' }}>
                          9:00 AM - 5:00 PM
                        </span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl px-4 py-3 border-2 border-red-300 shadow-md">
                      <div className="flex items-center justify-between gap-3 flex-nowrap">
                        <span className="font-bold text-red-700 text-base whitespace-nowrap">
                          {locale === 'ar' ? 'الجمعة والسبت' : locale === 'en' ? 'Fri & Sat' : locale === 'es' ? 'Vie y Sáb' : 'Ven et Sam'}
                        </span>
                        <span className="text-red-600 font-bold text-base whitespace-nowrap">
                          {locale === 'ar' ? 'مغلق' : locale === 'en' ? 'Closed' : locale === 'es' ? 'Cerrado' : 'Fermé'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional spacing at bottom */}
                <div className="mt-auto pt-8"></div>
              </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-[var(--color-quinary)] border border-[var(--color-quaternary-100)]">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--color-tertiary)] mb-4">
                  {getText('form', 'title')}
                </h2>
                <p className="text-[var(--color-quaternary)]">
                  {getText('form', 'subtitle')}
                </p>
              </div>
              
              <ContactForm locale={locale} />
            </Card>
          </div>
        </div>
      </ContentSection>
    </div>
  )
}
