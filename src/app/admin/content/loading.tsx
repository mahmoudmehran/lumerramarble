/**
 * Admin Content Management Loading State
 * صفحة تحميل إدارة المحتوى
 */

import { TableSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton'

export default function AdminContentLoading() {
  return (
    <div className="p-8">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Content Sections Skeleton */}
      <div className="space-y-8">
        {/* Section Tabs */}
        <div className="flex gap-2 border-b">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-200 rounded-t-md animate-pulse" />
          ))}
        </div>

        {/* Content Table */}
        <TableSkeleton rows={6} columns={4} />
      </div>
    </div>
  )
}
