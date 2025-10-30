import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  const isRTL = locale === 'ar'

  const footerSections = {
    ar: {
      company: {
        title: 'الشركة',
        links: [
          { name: 'عن الشركة', href: '/ar/about' },
          { name: 'خدمات التصدير', href: '/ar/export' },
          { name: 'المشاريع', href: '/ar/projects' },
          { name: 'شهادات الجودة', href: '/ar/certificates' },
        ]
      },
      products: {
        title: 'المنتجات',
        links: [
          { name: 'رخام طبيعي', href: '/ar/products?category=marble' },
          { name: 'جرانيت', href: '/ar/products?category=granite' },
          { name: 'كوارتز', href: '/ar/products?category=quartz' },
          { name: 'منتجات خاصة', href: '/ar/products?category=special' },
        ]
      },
      support: {
        title: 'الدعم',
        links: [
          { name: 'تواصل معنا', href: '/ar/contact' },
          { name: 'طلب عرض سعر', href: '/ar/quote' },
          { name: 'الأسئلة الشائعة', href: '/ar/faq' },
          { name: 'دليل التصدير', href: '/ar/export-guide' },
        ]
      }
    },
    en: {
      company: {
        title: 'Company',
        links: [
          { name: 'About Us', href: '/en/about' },
          { name: 'Export Services', href: '/en/export' },
          { name: 'Projects', href: '/en/projects' },
          { name: 'Quality Certificates', href: '/en/certificates' },
        ]
      },
      products: {
        title: 'Products',
        links: [
          { name: 'Natural Marble', href: '/en/products?category=marble' },
          { name: 'Granite', href: '/en/products?category=granite' },
          { name: 'Quartz', href: '/en/products?category=quartz' },
          { name: 'Special Products', href: '/en/products?category=special' },
        ]
      },
      support: {
        title: 'Support',
        links: [
          { name: 'Contact Us', href: '/en/contact' },
          { name: 'Request Quote', href: '/en/quote' },
          { name: 'FAQ', href: '/en/faq' },
          { name: 'Export Guide', href: '/en/export-guide' },
        ]
      }
    }
  }

  const currentSections = footerSections[locale as keyof typeof footerSections] || footerSections.en

  return (
    <footer className="bg-[var(--color-secondary)] text-[var(--color-quinary)] border-t-4 border-[var(--color-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-700)] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-[var(--color-quinary)] font-bold text-2xl">L</span>
              </div>
              <div>
                <span className="font-bold text-2xl text-[var(--color-quinary)] block">
                  {locale === 'ar' ? 'لوميرا ماربل' : 'Lumerra Marble'}
                </span>
              </div>
            </div>
            <p className="text-[var(--color-quinary-200)] mb-6 text-base leading-relaxed">
              {locale === 'ar' 
                ? 'شركة رائدة في تصدير أفخم أنواع الرخام والجرانيت من مصر إلى جميع أنحاء العالم بأعلى معايير الجودة'
                : 'Leading company in exporting premium marble and granite from Egypt to worldwide with highest quality standards'
              }
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="https://facebook.com/lumerramarble" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-secondary-700)] text-[var(--color-quinary-300)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-all duration-200 transform hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/lumerramarble" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-secondary-700)] text-[var(--color-quinary-300)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-all duration-200 transform hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/lumerramarble" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-secondary-700)] text-[var(--color-quinary-300)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-all duration-200 transform hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@lumerramarble" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-secondary-700)] text-[var(--color-quinary-300)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-all duration-200 transform hover:scale-110">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          {Object.entries(currentSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-bold text-[var(--color-quinary)] mb-6 text-lg border-b-2 border-[var(--color-primary)] pb-2 inline-block">
                {section.title}
              </h3>
              <ul className="space-y-3 mt-6">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--color-quinary-200)] hover:text-[var(--color-primary)] transition-all duration-200 text-base flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-3 transition-all duration-200 mr-0 group-hover:mr-2 rtl:mr-0 rtl:group-hover:ml-2"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-[var(--color-secondary-700)] mt-12 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse bg-[var(--color-secondary-700)] p-4 rounded-lg hover:bg-[var(--color-secondary-600)] transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[var(--color-quinary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-quinary)] mb-1 text-sm">
                  {locale === 'ar' ? 'العنوان' : 'Address'}
                </h4>
                <p className="text-[var(--color-quinary-200)] text-sm">
                  {locale === 'ar' 
                    ? 'مصر - القاهرة - المنطقة الصناعية شق الثعبان'
                    : 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse bg-[var(--color-secondary-700)] p-4 rounded-lg hover:bg-[var(--color-secondary-600)] transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-[var(--color-quinary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-quinary)] mb-1 text-sm">
                  {locale === 'ar' ? 'الهاتف' : 'Phone'}
                </h4>
                <a href="tel:+201113121444" className="text-[var(--color-quinary-200)] hover:text-[var(--color-primary)] transition-colors text-sm">
                  +20 111 312 1444
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse bg-[var(--color-secondary-700)] p-4 rounded-lg hover:bg-[var(--color-secondary-600)] transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--color-quinary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-quinary)] mb-1 text-sm">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </h4>
                <a href="mailto:info@lumerramarble.com" className="text-[var(--color-quinary-200)] hover:text-[var(--color-primary)] transition-colors text-sm">
                  info@lumerramarble.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--color-secondary-700)] mt-10 pt-8 text-center">
          <p className="text-[var(--color-quinary-300)] text-base">
            {locale === 'ar' 
              ? `© ${new Date().getFullYear()} لوميرا ماربل. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Lumerra Marble. All rights reserved.`
            }
          </p>
          <p className="text-[var(--color-quinary-400)] text-sm mt-2">
            {locale === 'ar' 
              ? 'صُنع بكل ❤️ في مصر'
              : 'Made with ❤️ in Egypt'
            }
          </p>
        </div>
      </div>
    </footer>
  )
}
