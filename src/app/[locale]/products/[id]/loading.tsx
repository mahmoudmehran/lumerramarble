/**
 * Product Details Loading State
 * صفحة تحميل تفاصيل المنتج
 */

export default function ProductDetailsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Gallery & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-24 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>

          {/* Price */}
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          </div>

          {/* Specs */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <div className="h-12 bg-gray-200 rounded flex-1 animate-pulse" />
            <div className="h-12 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
