/**
 * Search Component
 * مكون بحث متقدم مع filters
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
  showFilters?: boolean
  filters?: FilterOption[]
  className?: string
}

interface FilterOption {
  id: string
  label: string
  options: { value: string; label: string }[]
}

export function SearchBar({ 
  placeholder = 'ابحث...',
  onSearch,
  className = ''
}: Omit<SearchProps, 'showFilters' | 'filters'>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    if (onSearch) {
      onSearch(value)
    } else {
      // Update URL with search query
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('q', value)
      } else {
        params.delete('q')
      }
      router.push(`?${params.toString()}`)
    }
  }, [onSearch, router, searchParams])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== (searchParams.get('q') || '')) {
        handleSearch(query)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchParams, handleSearch])

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {query && (
        <button
          onClick={() => {
            setQuery('')
            handleSearch('')
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export function SearchWithFilters({
  placeholder = 'ابحث...',
  onSearch,
  showFilters = true,
  filters = [],
  className = ''
}: SearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    // Initialize filters from URL
    const filtersFromUrl: Record<string, string> = {}
    filters.forEach(filter => {
      const value = searchParams.get(filter.id)
      if (value) {
        filtersFromUrl[filter.id] = value
      }
    })
    setSelectedFilters(filtersFromUrl)
  }, [searchParams, filters])

  const handleFilterChange = (filterId: string, value: string) => {
    const newFilters = { ...selectedFilters }
    if (value === 'all' || !value) {
      delete newFilters[filterId]
    } else {
      newFilters[filterId] = value
    }
    setSelectedFilters(newFilters)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || !value) {
      params.delete(filterId)
    } else {
      params.set(filterId, value)
    }
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedFilters({})
    const params = new URLSearchParams(searchParams.toString())
    filters.forEach(filter => params.delete(filter.id))
    router.push(`?${params.toString()}`)
  }

  const activeFiltersCount = Object.keys(selectedFilters).length

  return (
    <div className={className}>
      <div className="flex gap-3">
        <SearchBar 
          placeholder={placeholder}
          onSearch={onSearch}
          className="flex-1"
        />
        
        {showFilters && filters.length > 0 && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>فلاتر</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilterPanel && showFilters && filters.length > 0 && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">تصفية النتائج</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                مسح الفلاتر
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map(filter => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                <div className="relative">
                  <select
                    value={selectedFilters[filter.id] || 'all'}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="all">الكل</option>
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
