import { Card } from '../../../components/ui/card'

export default function MessagesLoading() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </Card>

        {/* Messages Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List Skeleton */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-gray-200">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Message Details Skeleton */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="space-y-3 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
