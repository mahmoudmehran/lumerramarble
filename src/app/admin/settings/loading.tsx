/**
 * Admin Settings Loading State
 * صفحة تحميل الإعدادات
 */

export default function AdminSettingsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Modern Fixed Header Skeleton */}
      <div className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex items-center gap-3 border-r border-gray-300 pr-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse" />
                <div>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Language Selection Bar Skeleton */}
      <div className="bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200 fixed top-[50px] sm:top-[73px] left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 sm:h-4 w-8 sm:w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-1 sm:gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 sm:h-10 w-8 sm:w-28 bg-gray-200 rounded-md sm:rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ paddingTop: '110px' }}>
        {/* Settings Cards Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((section) => (
            <div key={section} className="bg-white rounded-2xl shadow-lg border-0 p-6">
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl animate-pulse" />
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
              
              {/* Card Content */}
              <div className="space-y-4">
                {[1, 2, 3].map((field) => (
                  <div key={field}>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
