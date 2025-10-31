/**
 * Blog Loading State
 * صفحة تحميل المدونة
 */

import { GridSkeleton, BlogCardSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton'

export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Search & Filters Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="h-12 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-40 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Blog Grid Skeleton */}
      <GridSkeleton 
        items={6}
        columns={3}
        CardComponent={BlogCardSkeleton}
      />
    </div>
  )
}
