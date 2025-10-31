/**
 * Admin Quotes Loading State
 * صفحة تحميل إدارة الطلبات
 */

import { TableSkeleton, PageHeaderSkeleton, StatsCardSkeleton } from '@/components/ui/skeleton'

export default function AdminQuotesLoading() {
  return (
    <div className="p-8">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Stats Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-3 mb-6">
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={8} columns={7} />
    </div>
  )
}
