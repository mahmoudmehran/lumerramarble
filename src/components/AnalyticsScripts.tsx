'use client'

import Script from 'next/script'
import { useEffect } from 'react'

interface AnalyticsScriptsProps {
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  linkedinPartnerId?: string
  tiktokPixelId?: string
  bingAdsId?: string
}

/**
 * Client component that loads analytics and tracking scripts
 * Prioritizes GTM if available, otherwise loads individual scripts
 */
export function AnalyticsScripts({
  googleAnalyticsId,
  googleTagManagerId,
  facebookPixelId,
  linkedinPartnerId,
  tiktokPixelId,
  bingAdsId,
}: AnalyticsScriptsProps) {
  
  useEffect(() => {
    // Initialize Facebook Pixel if ID provided and no GTM
    if (facebookPixelId && !googleTagManagerId) {
      // @ts-ignore
      if (typeof window !== 'undefined' && !window.fbq) {
        // @ts-ignore
        window.fbq = function() {
          // @ts-ignore
          window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments)
        }
        // @ts-ignore
        if (!window._fbq) window._fbq = window.fbq
        // @ts-ignore
        window.fbq.push = window.fbq
        // @ts-ignore
        window.fbq.loaded = true
        // @ts-ignore
        window.fbq.version = '2.0'
        // @ts-ignore
        window.fbq.queue = []
        
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://connect.facebook.net/en_US/fbevents.js'
        document.head.appendChild(script)
        
        script.onload = () => {
          // @ts-ignore
          window.fbq('init', facebookPixelId)
          // @ts-ignore
          window.fbq('track', 'PageView')
        }
      }
    }
    
    // Initialize LinkedIn Insight Tag if ID provided and no GTM
    if (linkedinPartnerId && !googleTagManagerId) {
      // @ts-ignore
      if (typeof window !== 'undefined' && !window._linkedin_data_partner_ids) {
        // @ts-ignore
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
        // @ts-ignore
        window._linkedin_data_partner_ids.push(linkedinPartnerId)
        
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
        document.head.appendChild(script)
      }
    }
    
    // Initialize TikTok Pixel if ID provided and no GTM
    if (tiktokPixelId && !googleTagManagerId) {
      // @ts-ignore
      if (typeof window !== 'undefined' && !window.ttq) {
        // @ts-ignore
        window.ttq = {
          load: function(id: string) {
            const script = document.createElement('script')
            script.async = true
            script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + id + '&lib=ttq'
            document.head.appendChild(script)
          },
          page: function() {},
          track: function() {},
          identify: function() {},
        }
        // @ts-ignore
        window.ttq.load(tiktokPixelId)
        // @ts-ignore
        window.ttq.page()
      }
    }
    
    // Initialize Bing UET if ID provided and no GTM
    if (bingAdsId && !googleTagManagerId) {
      // @ts-ignore
      if (typeof window !== 'undefined' && !window.uetq) {
        // @ts-ignore
        window.uetq = window.uetq || []
        // @ts-ignore
        window.uetq.push('event', '', {})
        
        const script = document.createElement('script')
        script.async = true
        script.src = '//bat.bing.com/bat.js'
        document.head.appendChild(script)
        
        script.onload = () => {
          // @ts-ignore
          window.UET = window.UET || function() {
            // @ts-ignore
            (window.UET.q = window.UET.q || []).push(arguments)
          }
          // @ts-ignore
          window.UET.init(bingAdsId)
        }
      }
    }
  }, [facebookPixelId, linkedinPartnerId, tiktokPixelId, bingAdsId, googleTagManagerId])

  return (
    <>
      {/* Google Tag Manager - Preferred method */}
      {googleTagManagerId && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${googleTagManagerId}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Google Analytics - Only if no GTM */}
      {googleAnalyticsId && !googleTagManagerId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Note: Other pixels (Facebook, LinkedIn, TikTok, Bing) are loaded via useEffect */}
      {/* This is to avoid hydration issues and allow conditional loading */}
    </>
  )
}
