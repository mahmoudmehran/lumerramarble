'use client'

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
    },
    es: {
      company: {
        title: 'Empresa',
        links: [
          { name: 'Sobre Nosotros', href: '/es/about' },
          { name: 'Servicios de Exportación', href: '/es/export' },
          { name: 'Proyectos', href: '/es/projects' },
          { name: 'Certificados de Calidad', href: '/es/certificates' },
        ]
      },
      products: {
        title: 'Productos',
        links: [
          { name: 'Mármol Natural', href: '/es/products?category=marble' },
          { name: 'Granito', href: '/es/products?category=granite' },
          { name: 'Cuarzo', href: '/es/products?category=quartz' },
          { name: 'Productos Especiales', href: '/es/products?category=special' },
        ]
      },
      support: {
        title: 'Soporte',
        links: [
          { name: 'Contáctenos', href: '/es/contact' },
          { name: 'Solicitar Cotización', href: '/es/quote' },
          { name: 'Preguntas Frecuentes', href: '/es/faq' },
          { name: 'Guía de Exportación', href: '/es/export-guide' },
        ]
      }
    },
    fr: {
      company: {
        title: 'Entreprise',
        links: [
          { name: 'À Propos', href: '/fr/about' },
          { name: 'Services d\'Exportation', href: '/fr/export' },
          { name: 'Projets', href: '/fr/projects' },
          { name: 'Certificats de Qualité', href: '/fr/certificates' },
        ]
      },
      products: {
        title: 'Produits',
        links: [
          { name: 'Marbre Naturel', href: '/fr/products?category=marble' },
          { name: 'Granit', href: '/fr/products?category=granite' },
          { name: 'Quartz', href: '/fr/products?category=quartz' },
          { name: 'Produits Spéciaux', href: '/fr/products?category=special' },
        ]
      },
      support: {
        title: 'Support',
        links: [
          { name: 'Contactez-nous', href: '/fr/contact' },
          { name: 'Demander un Devis', href: '/fr/quote' },
          { name: 'FAQ', href: '/fr/faq' },
          { name: 'Guide d\'Exportation', href: '/fr/export-guide' },
        ]
      }
    }
  }

  const currentSections = footerSections[locale as keyof typeof footerSections] || footerSections.en

  return (
    <footer className="bg-[var(--color-secondary)] text-[var(--color-quinary)] border-t-4 border-[var(--color-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Company Info Section */}
        <div className="mb-10 lg:mb-12 border-b border-[var(--color-secondary-700)] pb-10 lg:pb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-700)] rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-[var(--color-quinary)] font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-base lg:text-lg text-[var(--color-quinary)] leading-tight whitespace-nowrap">
              {locale === 'ar' ? 'لوميرا ماربل' : 'Lumerra Marble'}
            </span>
          </div>
          
          <p className="text-[var(--color-quinary-200)] text-sm lg:text-base leading-relaxed mb-4">
            {locale === 'ar' 
              ? 'شركة رائدة في تصدير أفخم أنواع الرخام والجرانيت من مصر إلى جميع أنحاء العالم بأعلى معايير الجودة'
              : locale === 'en'
              ? 'A leading company in exporting premium marble and granite from Egypt to worldwide with highest quality standards'
              : locale === 'es'
              ? 'Una empresa líder en la exportación de mármol y granito premium desde Egipto a todo el mundo con los más altos estándares de calidad'
              : 'Une entreprise leader dans l\'exportation de marbre et de granit haut de gamme d\'Égypte vers le monde entier avec les normes de qualité les plus élevées'
            }
          </p>
          
          {/* Social Media Links */}
          <div className="inline-flex gap-2 flex-shrink-0">
            <a 
              href="https://facebook.com/lumerramarble" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-secondary-700)] text-[var(--color-quinary-300)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95 flex-shrink-0"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://instagram.com/lumerramarble" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-secondary-700)] text-[var(--color-quinary-300)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95 flex-shrink-0"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://twitter.com/lumerramarble" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-secondary-700)] text-[var(--color-quinary-300)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95 flex-shrink-0"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="https://youtube.com/@lumerramarble" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-secondary-700)] text-[var(--color-quinary-300)] hover:bg-[var(--color-primary)] hover:text-[var(--color-quinary)] transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95 flex-shrink-0"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        {/* Navigation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-10 lg:mb-12">
          {Object.entries(currentSections).map(([key, section]) => (
            <div key={key} className="flex flex-col items-center">
              <h3 className="font-bold text-[var(--color-quinary)] mb-4 lg:mb-6 text-base lg:text-lg border-b-2 border-[var(--color-primary)] pb-2 inline-block">
                {section.title}
              </h3>
              <ul className="space-y-2.5 lg:space-y-3 mt-4 lg:mt-6 flex flex-col items-center">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--color-quinary-200)] hover:text-[var(--color-primary)] transition-all duration-200 text-sm lg:text-base inline-flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-3 transition-all duration-200 mr-0 group-hover:mr-2 rtl:mr-0 rtl:group-hover:mr-0 rtl:ml-0 rtl:group-hover:ml-2"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-[var(--color-secondary-700)] pt-8 lg:pt-10">
          <div className="flex flex-wrap justify-center items-center gap-3">
            <a 
              href="https://maps.google.com/?q=Shaq+Al-Thuban+Industrial+Zone+Cairo+Egypt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--color-secondary-700)] px-4 py-2.5 rounded hover:bg-[var(--color-primary)] transition-all duration-200 group"
              dir="ltr"
            >
              <MapPin className="w-4 h-4 text-[var(--color-quinary)] flex-shrink-0" />
              <span className="text-[var(--color-quinary-200)] group-hover:text-[var(--color-quinary)] text-sm whitespace-nowrap">
                {locale === 'ar' ? 'القاهرة' : locale === 'en' ? 'Cairo' : locale === 'es' ? 'El Cairo' : 'Le Caire'}
              </span>
            </a>
            
            <a 
              href="tel:+201113121444"
              className="inline-flex items-center gap-2 bg-[var(--color-secondary-700)] px-5 py-3 rounded hover:bg-[var(--color-primary)] transition-all duration-200 group overflow-visible"
              dir="ltr"
            >
              <Phone className="w-4 h-4 text-[var(--color-quinary)] flex-shrink-0" />
              <span className="text-[var(--color-quinary-200)] group-hover:text-[var(--color-quinary)] text-sm">
                +20 111 312 1444
              </span>
            </a>
            
            <a 
              href="mailto:info@lumerramarble.com"
              className="inline-flex items-center gap-2 bg-[var(--color-secondary-700)] px-4 py-2.5 rounded hover:bg-[var(--color-primary)] transition-all duration-200 group"
              dir="ltr"
            >
              <Mail className="w-4 h-4 text-[var(--color-quinary)] flex-shrink-0" />
              <span className="text-[var(--color-quinary-200)] group-hover:text-[var(--color-quinary)] text-sm whitespace-nowrap">
                info@lumerramarble.com
              </span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--color-secondary-700)] mt-8 lg:mt-10 pt-6 lg:pt-8 text-center">
          <p className="text-[var(--color-quinary-300)] text-sm lg:text-base font-medium">
            {locale === 'ar' 
              ? `© ${new Date().getFullYear()} لوميرا ماربل. جميع الحقوق محفوظة.`
              : locale === 'en'
              ? `© ${new Date().getFullYear()} Lumerra Marble. All rights reserved.`
              : locale === 'es'
              ? `© ${new Date().getFullYear()} Lumerra Marble. Todos los derechos reservados.`
              : `© ${new Date().getFullYear()} Lumerra Marble. Tous droits réservés.`
            }
          </p>
          <p className="text-[var(--color-quinary-400)] text-xs lg:text-sm mt-2 flex items-center justify-center gap-1">
            {locale === 'ar' 
              ? 'صُنع بكل'
              : locale === 'en'
              ? 'Made with'
              : locale === 'es'
              ? 'Hecho con'
              : 'Fait avec'
            }
            <span className="text-red-500 animate-pulse text-base">❤️</span>
            {locale === 'ar' 
              ? 'في مصر'
              : locale === 'en'
              ? 'in Egypt'
              : locale === 'es'
              ? 'en Egipto'
              : 'en Égypte'
            }
          </p>
        </div>
      </div>
    </footer>
  )
}
