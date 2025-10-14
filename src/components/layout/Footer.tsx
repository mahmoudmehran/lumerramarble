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
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ح</span>
              </div>
              <span className="font-bold text-xl">
                {locale === 'ar' ? 'الحوت ماربل' : 'Alhot Marble'}
              </span>
            </div>
            <p className="text-secondary-300 mb-4 text-sm">
              {locale === 'ar' 
                ? 'شركة رائدة في تصدير أفخم أنواع الرخام والجرانيت من مصر إلى العالم'
                : 'Leading company in exporting premium marble and granite from Egypt to the world'
              }
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          {Object.entries(currentSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-secondary-300 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-secondary-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-secondary-300">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <MapPin className="w-4 h-4 text-primary-400" />
              <span>
                {locale === 'ar' 
                  ? 'مصر - القاهرة - شق الثعبان'
                  : 'Egypt - Cairo - Shaq Al-Thuban'
                }
              </span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Phone className="w-4 h-4 text-primary-400" />
              <span>+20 111 312 1444</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Mail className="w-4 h-4 text-primary-400" />
              <span>info@alhotmarble.com</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-sm text-secondary-400">
          <p>
            {locale === 'ar' 
              ? `© ${new Date().getFullYear()} الحوت ماربل. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Alhot Marble. All rights reserved.`
            }
          </p>
        </div>
      </div>
    </footer>
  )
}
