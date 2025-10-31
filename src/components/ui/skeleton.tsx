/**
 * Skeleton Components
 * مكونات Skeleton لعرض placeholders أثناء التحميل
 */

import React from 'react'

/**
 * Skeleton Base Component
 */
export function Skeleton({ 
  className = '',
  variant = 'rect',
  animation = 'pulse'
}: { 
  className?: string
  variant?: 'rect' | 'circle' | 'text'
  animation?: 'pulse' | 'wave' | 'none'
}) {
  const animationClass = {
    pulse: 'animate-pulse',
    wave: 'animate-skeleton-wave',
    none: ''
  }

  const variantClass = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded h-4'
  }

  return (
    <div 
      className={`
        bg-gray-200 
        ${animationClass[animation]} 
        ${variantClass[variant]}
        ${className}
      `}
      aria-hidden="true"
    />
  )
}

/**
 * Product Card Skeleton
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-64" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description Lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        {/* Price & Button Row */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}

/**
 * Blog Card Skeleton
 */
export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-48" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category & Date */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Title */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
        
        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Read More Button */}
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

/**
 * Table Row Skeleton
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  )
}

/**
 * Table Skeleton
 */
export function TableSkeleton({ 
  rows = 5,
  columns = 4,
  showHeader = true 
}: { 
  rows?: number
  columns?: number
  showHeader?: boolean 
}) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <table className="w-full">
        {showHeader && (
          <thead className="bg-gray-50 border-b">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton className="h-5 w-24" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Form Skeleton
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-12 w-full mt-6" />
    </div>
  )
}

/**
 * Stats Card Skeleton
 */
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton variant="circle" className="w-12 h-12" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  )
}

/**
 * Page Header Skeleton
 */
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-4 mb-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-96" />
      <div className="flex gap-3 mt-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

/**
 * User Avatar Skeleton
 */
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }
  
  return (
    <Skeleton 
      variant="circle" 
      className={sizeClasses[size]} 
    />
  )
}

/**
 * List Item Skeleton
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <AvatarSkeleton />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

/**
 * Grid Skeleton - عرض شبكة من البطاقات
 */
export function GridSkeleton({ 
  items = 6,
  columns = 3,
  CardComponent = ProductCardSkeleton 
}: { 
  items?: number
  columns?: 2 | 3 | 4
  CardComponent?: React.ComponentType
}) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardComponent key={i} />
      ))}
    </div>
  )
}

/**
 * Content Block Skeleton - لمحتوى طويل
 */
export function ContentBlockSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-64 w-full mt-6" />
      <div className="space-y-2 mt-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
