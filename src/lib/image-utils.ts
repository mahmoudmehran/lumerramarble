/**
 * Generate a base64 blur placeholder for images
 * This creates a tiny blurred version for instant loading
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(245,144,0);stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:rgb(44,62,80);stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Simple shimmer effect for loading states
 */
export function shimmer(w: number, h: number): string {
  return `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer">
          <stop stop-color="#f59000" stop-opacity="0.1" offset="20%" />
          <stop stop-color="#f59000" stop-opacity="0.2" offset="50%" />
          <stop stop-color="#f59000" stop-opacity="0.1" offset="80%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#shimmer)" />
    </svg>
  `
}

/**
 * Convert shimmer to base64 data URL
 */
export function toBase64(str: string): string {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)
}

/**
 * Get shimmer placeholder data URL
 */
export function getShimmerPlaceholder(w: number = 700, h: number = 475): string {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`
}
