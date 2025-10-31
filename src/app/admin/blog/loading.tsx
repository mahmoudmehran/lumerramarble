/**
 * Admin Blog Loading State
 * صفحة تحميل إدارة المدونة
 */

import { TableSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton'

export default function AdminBlogLoading() {
  return (
    <div className="p-8">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Search & Filters Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={8} columns={5} />
    </div>
  )
}
