/**
 * قوالب الأقسام المشتركة لجميع الصفحات
 * جميع الألوان تستخدم نظام الألوان الخماسي المخصص
 */

import { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '../../lib/utils'

// ================ Hero Section ================
interface HeroSectionProps {
  title: string
  subtitle?: string
  image?: string
  gradient?: 'primary' | 'secondary' | 'tertiary'
  className?: string
  children?: ReactNode
}

export function HeroSection({
  title,
  subtitle,
  image,
  gradient = 'primary',
  className,
  children
}: HeroSectionProps) {
  const gradientClasses = {
    primary: 'from-[var(--color-primary)] via-[var(--color-primary-800)] to-[var(--color-primary-900)]',
    secondary: 'from-[var(--color-secondary)] via-[var(--color-secondary-800)] to-[var(--color-secondary-900)]',
    tertiary: 'from-[var(--color-tertiary)] via-[var(--color-tertiary-800)] to-[var(--color-tertiary-900)]'
  }

  return (
    <section className={cn(
      'relative h-screen flex items-center justify-center',
      `bg-gradient-to-br ${gradientClasses[gradient]}`,
      className
    )}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[var(--color-quinary)]">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-[var(--color-quinary-200)]">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}

// ================ Page Header (smaller hero) ================
interface PageHeaderProps {
  title: string
  subtitle?: string
  image?: string
  className?: string
}

export function PageHeader({ title, subtitle, image, className }: PageHeaderProps) {
  return (
    <section className={cn(
      'relative py-20 bg-gradient-to-br',
      'from-[var(--color-primary)] to-[var(--color-primary-800)]',
      className
    )}>
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-20"
          />
        </div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[var(--color-quinary)]">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

// ================ Content Section ================
interface ContentSectionProps {
  title?: string
  subtitle?: string
  variant?: 'white' | 'light' | 'primary' | 'secondary' | 'tertiary'
  className?: string
  children: ReactNode
  centered?: boolean
}

export function ContentSection({
  title,
  subtitle,
  variant = 'white',
  className,
  children,
  centered = false
}: ContentSectionProps) {
  const backgrounds = {
    white: 'bg-[var(--color-quinary)]',
    light: 'bg-[var(--color-quinary-50)]',
    primary: 'bg-[var(--color-primary)] text-[var(--color-quinary)]',
    secondary: 'bg-[var(--color-secondary)] text-[var(--color-quinary)]',
    tertiary: 'bg-[var(--color-tertiary)] text-[var(--color-quinary)]'
  }

  return (
    <section className={cn('py-16', backgrounds[variant], className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className={cn('mb-12', centered && 'text-center')}>
            {title && (
              <h2 className={cn(
                'text-3xl md:text-4xl font-bold mb-4',
                variant === 'white' || variant === 'light'
                  ? 'text-[var(--color-tertiary)]'
                  : 'text-[var(--color-quinary)]'
              )}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(
                'text-xl max-w-3xl',
                centered && 'mx-auto',
                variant === 'white' || variant === 'light'
                  ? 'text-[var(--color-quaternary)]'
                  : 'text-[var(--color-quinary-200)]'
              )}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

// ================ Feature Card ================
interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn(
      'text-center p-6 rounded-lg transition-colors',
      'bg-[var(--color-quinary)] hover:bg-[var(--color-quinary-100)]',
      'border border-[var(--color-quaternary-100)]',
      className
    )}>
      <div className="w-16 h-16 bg-[var(--color-secondary-100)] rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="text-[var(--color-secondary)]">
          {icon}
        </div>
      </div>
      <h3 className="font-bold text-xl text-[var(--color-tertiary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--color-quaternary)]">
        {description}
      </p>
    </div>
  )
}

// ================ Stat Card ================
interface StatCardProps {
  number: string
  label: string
  icon?: ReactNode
  variant?: 'light' | 'dark'
  className?: string
}

export function StatCard({ number, label, icon, variant = 'light', className }: StatCardProps) {
  return (
    <div className={cn('text-center', className)}>
      {icon && (
        <div className={cn(
          'w-12 h-12 mx-auto mb-4',
          variant === 'light'
            ? 'text-[var(--color-secondary)]'
            : 'text-[var(--color-secondary)]'
        )}>
          {icon}
        </div>
      )}
      <div className={cn(
        'text-4xl md:text-5xl font-bold mb-2',
        variant === 'light'
          ? 'text-[var(--color-secondary)]'
          : 'text-[var(--color-secondary)]'
      )}>
        {number}
      </div>
      <div className={cn(
        variant === 'light'
          ? 'text-[var(--color-quaternary)]'
          : 'text-[var(--color-quaternary-300)]'
      )}>
        {label}
      </div>
    </div>
  )
}

// ================ Card Container ================
interface CardProps {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  variant?: 'white' | 'light'
  hover?: boolean
  className?: string
  children?: ReactNode
  onClick?: () => void
}

export function Card({
  title,
  description,
  image,
  imageAlt,
  variant = 'white',
  hover = true,
  className,
  children,
  onClick
}: CardProps) {
  const backgrounds = {
    white: 'bg-[var(--color-quinary)]',
    light: 'bg-[var(--color-quinary-50)]'
  }

  return (
    <div
      className={cn(
        'rounded-lg shadow-md overflow-hidden',
        backgrounds[variant],
        hover && 'hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {image && (
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={imageAlt || title || 'Card image'}
            fill
            className={cn(
              'object-cover',
              hover && 'group-hover:scale-110 transition-transform duration-300'
            )}
          />
        </div>
      )}
      <div className="p-6">
        {title && (
          <h3 className="text-xl font-bold text-[var(--color-secondary-900)] mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-[var(--color-quaternary)] mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

// ================ Grid Container ================
interface GridProps {
  cols?: 1 | 2 | 3 | 4
  gap?: 4 | 6 | 8 | 12
  className?: string
  children: ReactNode
}

export function Grid({ cols = 3, gap = 8, className, children }: GridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const gridGap = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    12: 'gap-12'
  }

  return (
    <div className={cn('grid', gridCols[cols], gridGap[gap], className)}>
      {children}
    </div>
  )
}

// ================ CTA Section ================
interface CTASectionProps {
  title: string
  subtitle?: string
  variant?: 'primary' | 'secondary' | 'tertiary'
  className?: string
  children: ReactNode
}

export function CTASection({
  title,
  subtitle,
  variant = 'secondary',
  className,
  children
}: CTASectionProps) {
  const backgrounds = {
    primary: 'from-[var(--color-primary)] to-[var(--color-primary-700)]',
    secondary: 'from-[var(--color-secondary)] to-[var(--color-secondary-700)]',
    tertiary: 'from-[var(--color-tertiary)] to-[var(--color-tertiary-700)]'
  }

  return (
    <section className={cn(
      'py-16 bg-gradient-to-r',
      backgrounds[variant],
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-quinary)] mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-[var(--color-quinary-200)] mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
