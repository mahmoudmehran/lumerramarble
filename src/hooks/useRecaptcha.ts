'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    grecaptcha: any
  }
}

export const useRecaptcha = (siteKey: string) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
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

    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount if needed
      const existingScript = document.querySelector(`script[src*="recaptcha"]`)
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [siteKey])

  const executeRecaptcha = async (action: string): Promise<string | null> => {
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

  return { isLoaded, executeRecaptcha }
}
