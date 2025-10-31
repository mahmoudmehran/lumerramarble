/**
 * Google Analytics Component
 * مكون Google Analytics 4
 */

'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Track page views
export function usePageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_TRACKING_ID) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    // Send page view event
    if (typeof window !== 'undefined' && (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('config', GA_TRACKING_ID, {
        page_path: url
      })
    }
  }, [pathname, searchParams])
}

// Google Analytics component
export function GoogleAnalytics() {
  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `
        }}
      />
    </>
  )
}

// Helper functions for tracking events

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag
  if (gtag) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}

export const trackQuoteRequest = (productType: string, country: string) => {
  trackEvent('quote_request', 'engagement', `${productType} - ${country}`)
}

export const trackProductView = (productId: string, productName: string) => {
  trackEvent('view_item', 'ecommerce', productName, undefined)
  
  // Enhanced ecommerce tracking
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag
  if (gtag) {
    gtag('event', 'view_item', {
      items: [{
        item_id: productId,
        item_name: productName
      }]
    })
  }
}

export const trackBlogView = (postId: string, postTitle: string) => {
  trackEvent('view_blog_post', 'content', postTitle)
}

export const trackContactForm = (type: 'submit' | 'error' | 'success') => {
  trackEvent(`contact_form_${type}`, 'form', type)
}

export const trackSearch = (query: string, resultCount: number) => {
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag
  if (gtag) {
    gtag('event', 'search', {
      search_term: query,
      search_results: resultCount
    })
  }
}

export const trackOutboundLink = (url: string, label: string) => {
  trackEvent('click', 'outbound_link', label)
  
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag
  if (gtag) {
    gtag('event', 'click', {
      event_category: 'outbound',
      event_label: label,
      transport_type: 'beacon',
      event_callback: () => {
        if (typeof window !== 'undefined') {
          window.location.href = url
        }
      }
    })
  }
}

export const trackFileDownload = (fileName: string) => {
  trackEvent('download', 'file', fileName)
}

export const trackVideoPlay = (videoTitle: string) => {
  trackEvent('play', 'video', videoTitle)
}

export const trackSocialShare = (platform: string, content: string) => {
  trackEvent('share', 'social', `${platform} - ${content}`)
}
