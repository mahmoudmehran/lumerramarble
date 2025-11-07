import { revalidateTag } from 'next/cache'

/**
 * Cache revalidation functions for server-side use only
 * These functions should only be called from API routes or Server Actions
 */

/**
 * Revalidate all product caches
 * Use this after creating/updating/deleting products
 */
export async function revalidateProductCache() {
  revalidateTag('products')
  revalidateTag('categories')
  revalidateTag('featured')
  console.log('Product cache revalidated')
}

/**
 * Revalidate all blog caches
 */
export async function revalidateBlogCache() {
  revalidateTag('blog')
  revalidateTag('featured')
  console.log('Blog cache revalidated')
}

/**
 * Revalidate settings cache
 */
export async function revalidateSettingsCache() {
  revalidateTag('settings')
  console.log('Settings cache revalidated')
}

/**
 * Revalidate content cache
 */
export async function revalidateContentCache() {
  revalidateTag('content')
  console.log('Content cache revalidated')
}
