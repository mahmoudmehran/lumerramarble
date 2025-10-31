/**
 * Admin Settings Loading State
 * صفحة تحميل الإعدادات
 */

import { FormSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton'

export default function AdminSettingsLoading() {
  return (
    <div className="p-8 max-w-4xl">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Settings Tabs Skeleton */}
      <div className="flex gap-2 mb-8 border-b">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-32 bg-gray-200 rounded-t-md animate-pulse" />
        ))}
      </div>

      {/* Settings Form Skeleton */}
      <div className="space-y-8">
        {/* Section 1 */}
        <div className="bg-white rounded-lg border p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <FormSkeleton fields={4} />
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-lg border p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <FormSkeleton fields={3} />
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-lg border p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <FormSkeleton fields={5} />
        </div>
      </div>
    </div>
  )
}
