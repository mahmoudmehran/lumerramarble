import { FolderKanban, MapPin, Calendar, Ruler } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getSiteSettings } from '@/lib/settings'
import {
  PageHeader,
  ContentSection,
  Grid
} from '@/components/ui/page-sections'
import { Button } from '@/components/ui/button'

export const revalidate = 3600 // Revalidate every hour

interface ProjectsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params
  const { prisma } = await import('@/lib/db')
  
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'projects' }
  })

  const titles = {
    ar: seoData?.titleAr || 'المشاريع',
    en: seoData?.titleEn || 'Projects',
    es: seoData?.titleEs || 'Proyectos',
    fr: seoData?.titleFr || 'Projets'
  }

  const descriptions = {
    ar: seoData?.descriptionAr || 'معرض مشاريعنا المنفذة حول العالم',
    en: seoData?.descriptionEn || 'Gallery of our completed projects around the world',
    es: seoData?.descriptionEs || 'Galería de nuestros proyectos completados en todo el mundo',
    fr: seoData?.descriptionFr || 'Galerie de nos projets réalisés dans le monde entier'
  }

  return {
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    ...(seoData?.ogImage && {
      openGraph: {
        images: [seoData.ogImage]
      }
    })
  }
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params
  const isRTL = locale === 'ar'

  // Get SEO data to check if page is active
  const seoData = await prisma.pageSEO.findUnique({
    where: { pageKey: 'projects' }
  })

  // If page is not active, return 404
  if (!seoData?.isActive) {
    return notFound()
  }

  // Get projects from database
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })

  const siteSettings = await getSiteSettings()

  const titles = {
    ar: 'المشاريع',
    en: 'Projects',
    es: 'Proyectos',
    fr: 'Projets'
  }

  const subtitles = {
    ar: 'معرض مشاريعنا المنفذة حول العالم',
    en: 'Gallery of Our Completed Projects Around the World',
    es: 'Galería de Nuestros Proyectos Completados en Todo el Mundo',
    fr: 'Galerie de Nos Projets Réalisés dans le Monde Entier'
  }

  const labels = {
    client: {
      ar: 'العميل',
      en: 'Client',
      es: 'Cliente',
      fr: 'Client'
    },
    location: {
      ar: 'الموقع',
      en: 'Location',
      es: 'Ubicación',
      fr: 'Emplacement'
    },
    area: {
      ar: 'المساحة',
      en: 'Area',
      es: 'Área',
      fr: 'Superficie'
    },
    duration: {
      ar: 'المدة',
      en: 'Duration',
      es: 'Duración',
      fr: 'Durée'
    },
    completionDate: {
      ar: 'تاريخ الإنجاز',
      en: 'Completion Date',
      es: 'Fecha de Finalización',
      fr: 'Date d\'Achèvement'
    },
    viewDetails: {
      ar: 'عرض التفاصيل',
      en: 'View Details',
      es: 'Ver Detalles',
      fr: 'Voir les Détails'
    }
  }

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={titles[locale as keyof typeof titles]}
        subtitle={subtitles[locale as keyof typeof subtitles]}
        image={seoData?.ogImage || undefined}
      />

      <ContentSection>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {locale === 'ar' ? 'لا توجد مشاريع متاحة حالياً' : 'No projects available at the moment'}
            </p>
          </div>
        ) : (
          <Grid cols={3}>
            {projects.map((project: any) => {
              const name = project[`name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof project] as string
              const description = project[`description${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof project] as string
              const location = project[`location${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof project] as string || project.location

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {project.featuredImage ? (
                      <Image
                        src={project.featuredImage}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FolderKanban className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-3">
                      {name}
                    </h3>
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {description}
                    </p>
                    <div className="space-y-2 mb-4">
                      {project.clientName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">{labels.client[locale as keyof typeof labels.client]}:</span>
                          <span>{project.clientName}</span>
                        </div>
                      )}
                      {location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{location}</span>
                        </div>
                      )}
                      {project.area && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Ruler className="w-4 h-4" />
                          <span>{project.area}</span>
                        </div>
                      )}
                      {project.completionDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.completionDate).toLocaleDateString(locale)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </Grid>
        )}
      </ContentSection>
    </div>
  )
}
