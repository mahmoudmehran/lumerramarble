import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Card } from '../../../components/ui/card'
import { getContent } from '../../../lib/content'
import ContactForm from './ContactForm'
import { PageHeader, ContentSection } from '../../../components/ui/page-sections'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'
  
  // جلب المحتوى من قاعدة البيانات
  const content = await getContent('contact')
  
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
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-tertiary)] mb-6">
                  {getText('info', 'title')}
                </h2>
                <div className="space-y-6">
                  {/* Address */}
                  <Card className="p-6 bg-[var(--color-quinary)] border border-[var(--color-quaternary-100)]">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--color-secondary)] mb-2">
                          {getText('info', 'address_title')}
                        </h3>
                        <p className="text-[var(--color-quaternary)]">
                          {getText('info', 'address_value')}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Phone */}
                  <Card className="p-6 bg-[var(--color-quinary)] border border-[var(--color-quaternary-100)]">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <Phone className="w-6 h-6 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--color-secondary)] mb-2">
                          {getText('info', 'phone_title')}
                        </h3>
                        <a 
                          href={`tel:${getText('info', 'phone_value')}`}
                          className="text-[var(--color-primary)] hover:text-[var(--color-primary-700)] transition-colors"
                        >
                          {getText('info', 'phone_value')}
                        </a>
                      </div>
                    </div>
                  </Card>

                  {/* Email */}
                  <Card className="p-6 bg-[var(--color-quinary)] border border-[var(--color-quaternary-100)]">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <Mail className="w-6 h-6 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--color-secondary)] mb-2">
                          {getText('info', 'email_title')}
                        </h3>
                        <a 
                          href={`mailto:${getText('info', 'email_value')}`}
                          className="text-[var(--color-primary)] hover:text-[var(--color-primary-700)] transition-colors"
                        >
                          {getText('info', 'email_value')}
                        </a>
                      </div>
                    </div>
                  </Card>

                  {/* Hours */}
                  <Card className="p-6 bg-[var(--color-quinary)] border border-[var(--color-quaternary-100)]">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <Clock className="w-6 h-6 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--color-secondary)] mb-2">
                          {getText('info', 'hours_title')}
                        </h3>
                        <p className="text-[var(--color-quaternary)]">
                          {getText('info', 'hours_value')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
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

      {/* Map Section */}
      <ContentSection variant="light">
        <Card className="overflow-hidden bg-[var(--color-quinary)] border border-[var(--color-quaternary-100)]">
          <div className="h-96 bg-[var(--color-quinary-100)] flex items-center justify-center">
            <div className="text-center text-[var(--color-quaternary)]">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <p>خريطة موقع الشركة</p>
            </div>
          </div>
        </Card>
      </ContentSection>
    </div>
  )
}
