/**
 * Blog Post Loading State
 * صفحة تحميل مقالة المدونة
 */

import { ContentBlockSkeleton } from '@/components/ui/skeleton'

export default function BlogPostLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-4">
        {/* Category & Date */}
        <div className="flex items-center gap-3">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>

        {/* Author & Meta */}
        <div className="flex items-center gap-4 pt-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <div className="w-full h-96 bg-gray-200 rounded-lg mb-8 animate-pulse" />

      {/* Content Skeleton */}
      <div className="prose max-w-none">
        <ContentBlockSkeleton />
        <div className="mt-8">
          <ContentBlockSkeleton />
        </div>
      </div>

      {/* Tags & Share Skeleton */}
      <div className="mt-12 pt-8 border-t space-y-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse" />
          ))}
        </div>

        {/* Share Buttons */}
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Related Posts Skeleton */}
      <div className="mt-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
