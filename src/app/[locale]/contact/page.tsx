import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Card } from '../../../components/ui/card'
import { getContent } from '../../../lib/content'
import ContactForm from './ContactForm'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {getText('hero', 'title')}
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            {getText('hero', 'subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {getText('info', 'title')}
                </h2>
                <div className="space-y-6">
                  {/* Address */}
                  <Card className="p-6">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {getText('info', 'address_title')}
                        </h3>
                        <p className="text-gray-600">
                          {getText('info', 'address_value')}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Phone */}
                  <Card className="p-6">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {getText('info', 'phone_title')}
                        </h3>
                        <a 
                          href={`tel:${getText('info', 'phone_value')}`}
                          className="text-primary hover:text-primary-dark transition-colors"
                        >
                          {getText('info', 'phone_value')}
                        </a>
                      </div>
                    </div>
                  </Card>

                  {/* Email */}
                  <Card className="p-6">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {getText('info', 'email_title')}
                        </h3>
                        <a 
                          href={`mailto:${getText('info', 'email_value')}`}
                          className="text-primary hover:text-primary-dark transition-colors"
                        >
                          {getText('info', 'email_value')}
                        </a>
                      </div>
                    </div>
                  </Card>

                  {/* Hours */}
                  <Card className="p-6">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {getText('info', 'hours_title')}
                        </h3>
                        <p className="text-gray-600">
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
            <Card className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {getText('form', 'title')}
                </h2>
                <p className="text-gray-600">
                  {getText('form', 'subtitle')}
                </p>
              </div>
              
              <ContactForm locale={locale} />
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p>خريطة موقع الشركة</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
