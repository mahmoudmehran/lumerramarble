'use client'

import { useLayoutEffect } from 'react'

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
 * Uses useLayoutEffect to apply styles before paint
 */
export function ThemeWrapper({ settings, children }: ThemeWrapperProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    
    // Apply colors synchronously before paint
    root.style.setProperty('--color-primary', settings.primaryColor)
    root.style.setProperty('--color-secondary', settings.secondaryColor)
    root.style.setProperty('--color-tertiary', settings.tertiaryColor)
    root.style.setProperty('--color-quaternary', settings.quaternaryColor)
    root.style.setProperty('--color-quinary', settings.quinaryColor)
    
    // Apply typography and appearance settings
    if (settings.fontFamily) {
      root.style.setProperty('--font-family-base', settings.fontFamily)
    }
    if (settings.fontSize) {
      root.style.setProperty('--font-size-base', settings.fontSize)
    }
    if (settings.borderRadius) {
      root.style.setProperty('--border-radius', settings.borderRadius)
    }
    if (settings.boxShadow) {
      root.style.setProperty('--box-shadow', settings.boxShadow)
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
    
    // Cache theme colors in localStorage for instant loading on next visit
    try {
      localStorage.setItem('theme-colors', JSON.stringify({
        primary: settings.primaryColor,
        secondary: settings.secondaryColor,
        tertiary: settings.tertiaryColor,
        quaternary: settings.quaternaryColor,
        quinary: settings.quinaryColor
      }))
    } catch (e) {
      // Ignore localStorage errors (private browsing, etc.)
    }
  }, [settings])

  return <>{children}</>
}
