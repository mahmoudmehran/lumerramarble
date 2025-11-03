'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    grecaptcha: any
  }
}

interface RecaptchaConfig {
  siteKey?: string
  enabled?: boolean
}

/**
 * Hook for Google reCAPTCHA v3 integration
 * @param config - Configuration object with siteKey and enabled flag
 * @returns isLoaded status and executeRecaptcha function
 */
export const useRecaptcha = (config?: RecaptchaConfig | string) => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Support both old string API and new config object API
  const siteKey = typeof config === 'string' ? config : config?.siteKey
  const enabled = typeof config === 'string' ? true : (config?.enabled ?? true)

  useEffect(() => {
    // If reCAPTCHA is disabled or no site key provided, don't load
    if (!enabled || !siteKey) {
      setIsLoaded(false)
      return
    }

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha) {
      setIsLoaded(true)
      return
    }

    // Load reCAPTCHA script
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      setIsLoaded(true)
    }

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script')
      setIsLoaded(false)
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount if needed
      const existingScript = document.querySelector(`script[src*="recaptcha"]`)
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [siteKey, enabled])

  const executeRecaptcha = async (action: string): Promise<string | null> => {
    // If disabled, return a dummy token or null
    if (!enabled) {
      console.log('reCAPTCHA is disabled in settings')
      return 'disabled'
    }

    if (!siteKey) {
      console.warn('reCAPTCHA site key not configured')
      return null
    }

    if (!isLoaded || !window.grecaptcha) {
      console.error('reCAPTCHA not loaded yet')
      return null
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action })
      return token
    } catch (error) {
      console.error('Error executing reCAPTCHA:', error)
      return null
    }
  }

  return { 
    isLoaded: enabled ? isLoaded : false, 
    executeRecaptcha,
    isEnabled: enabled && !!siteKey
  }
}
