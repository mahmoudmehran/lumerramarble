/**
 * Quote Form Loading State
 * صفحة تحميل نموذج الطلب
 */

import { FormSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton'

export default function QuoteLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Form Card Skeleton */}
      <div className="bg-white rounded-lg border p-8">
        <FormSkeleton fields={8} />
      </div>
    </div>
  )
}
