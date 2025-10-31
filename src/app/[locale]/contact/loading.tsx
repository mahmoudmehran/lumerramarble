/**
 * Contact Form Loading State
 * صفحة تحميل نموذج الاتصال
 */

import { FormSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton'

export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Contact Info Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Form Card Skeleton */}
      <div className="bg-white rounded-lg border p-8">
        <FormSkeleton fields={5} />
      </div>
    </div>
  )
}
