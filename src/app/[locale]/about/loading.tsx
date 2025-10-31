/**
 * About Page Loading State
 * صفحة تحميل صفحة من نحن
 */

import { ContentBlockSkeleton, PageHeaderSkeleton } from '@/components/ui/skeleton'

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header Skeleton */}
      <PageHeaderSkeleton />

      {/* Hero Section Skeleton */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          </div>
          <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6 text-center space-y-3">
            <div className="h-12 bg-gray-200 rounded w-20 mx-auto animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
          </div>
        ))}
      </div>

      {/* Values Section Skeleton */}
      <div className="mb-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-6 space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section Skeleton */}
      <div className="mb-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border overflow-hidden">
              <div className="w-full h-64 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2 text-center">
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Block Skeleton */}
      <ContentBlockSkeleton />
    </div>
  )
}
