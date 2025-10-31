/**
 * Admin Dashboard Loading State
 * صفحة تحميل لوحة التحكم
 */

import { StatsCardSkeleton, TableSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton'

export default function AdminLoading() {
  return (
    <div className="p-8">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Recent Activity Skeleton */}
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        <TableSkeleton rows={5} columns={5} />
      </div>
    </div>
  )
}
