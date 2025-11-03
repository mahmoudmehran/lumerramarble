'use client'

import { useEffect } from 'react'

interface ThemeWrapperProps {
  settings: {
    primaryColor: string
    secondaryColor: string
    tertiaryColor: string
    quaternaryColor: string
    quinaryColor: string
    fontFamily?: string
    fontSize?: string
    borderRadius?: string
    boxShadow?: string
    animationsEnabled?: boolean
  }
  children: React.ReactNode
}

/**
 * Client component that applies theme settings to CSS variables
 */
export function ThemeWrapper({ settings, children }: ThemeWrapperProps) {
  useEffect(() => {
    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--color-primary', settings.primaryColor)
    document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor)
    document.documentElement.style.setProperty('--color-tertiary', settings.tertiaryColor)
    document.documentElement.style.setProperty('--color-quaternary', settings.quaternaryColor)
    document.documentElement.style.setProperty('--color-quinary', settings.quinaryColor)
    
    // Apply typography and appearance settings
    if (settings.fontFamily) {
      document.documentElement.style.setProperty('--font-family-base', settings.fontFamily)
    }
    if (settings.fontSize) {
      document.documentElement.style.setProperty('--font-size-base', settings.fontSize)
    }
    if (settings.borderRadius) {
      document.documentElement.style.setProperty('--border-radius', settings.borderRadius)
    }
    if (settings.boxShadow) {
      document.documentElement.style.setProperty('--box-shadow', settings.boxShadow)
    }
    
    // Apply animations setting
    if (settings.animationsEnabled === false) {
      document.body.classList.add('no-animations')
    } else {
      document.body.classList.remove('no-animations')
    }
    
    // Apply theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', settings.primaryColor)
    }
  }, [settings])

  return <>{children}</>
}
