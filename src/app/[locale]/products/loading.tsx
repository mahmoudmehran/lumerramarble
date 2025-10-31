/**
 * Products Loading State
 * صفحة تحميل المنتجات
 */

import { GridSkeleton, ProductCardSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Filters & Search Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="h-12 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-32 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-12 w-32 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <GridSkeleton 
        items={9}
        columns={3}
        CardComponent={ProductCardSkeleton}
      />
    </div>
  )
}
