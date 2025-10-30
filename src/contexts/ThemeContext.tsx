'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Theme types
export interface ThemeColors {
  primary: string      // Header/Footer/Main sections
  secondary: string    // Buttons and interactive elements
  tertiary: string     // Important text (headings, company info)
  quaternary: string   // General text
  quinary: string      // Opposite of quaternary (background text)
}

// Fixed alert colors (not customizable)
export const alertColors = {
  success: '#10b981',
  warning: '#f59e0b', 
  error: '#ef4444',
  info: '#3b82f6'
}

export interface SiteSettings {
  companyName: string
  companyNameAr: string
  description?: string
  descriptionAr?: string
  phone?: string
  email?: string
  whatsapp?: string
  address?: string
  addressAr?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  metaTitle?: string
  metaTitleAr?: string
  metaDescription?: string
  metaDescriptionAr?: string
  keywords?: string
  keywordsAr?: string
  businessHours?: string
  businessHoursAr?: string
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  quaternaryColor: string
  quinaryColor: string
  updatedAt?: string
}

interface ThemeContextType {
  settings: SiteSettings | null
  colors: ThemeColors
  isLoading: boolean
  error: string | null
  refreshSettings: () => Promise<void>
  updateThemeColors: (colors: ThemeColors) => void
}

const defaultColors: ThemeColors = {
  primary: '#f59000',      // Header/Footer/Main sections
  secondary: '#2c3e50',    // Buttons and interactive elements  
  tertiary: '#27ae60',     // Important text (headings, company info)
  quaternary: '#34495e',   // General text
  quinary: '#ecf0f1'       // Opposite of quaternary (background text)
}

const defaultSettings: SiteSettings = {
  companyName: 'Lumerra Marble',
  companyNameAr: 'شركة لوميرا للرخام',
  description: 'Leading marble and granite export company from Egypt',
  descriptionAr: 'شركة رائدة في تصدير الرخام والجرانيت من مصر',
  phone: '+20 111 312 1444',
  email: 'info@lumerramarble.com',
  whatsapp: '+20 111 312 1444',
  address: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
  addressAr: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
  facebook: 'https://facebook.com/lumerramarble',
  instagram: 'https://instagram.com/lumerramarble',
  linkedin: 'https://linkedin.com/company/lumerramarble',
  youtube: 'https://youtube.com/@lumerramarble',
  metaTitle: 'Lumerra Marble - Premium Egyptian Marble & Granite Export',
  metaTitleAr: 'لوميرا للرخام - تصدير الرخام والجرانيت المصري الفاخر',
  metaDescription: 'Leading Egyptian company exporting premium marble, granite and quartz worldwide.',
  metaDescriptionAr: 'شركة مصرية رائدة في تصدير الرخام والجرانيت والكوارتز الفاخر عالمياً.',
  keywords: 'marble, granite, quartz, export, Egypt, natural stone',
  keywordsAr: 'رخام, جرانيت, كوارتز, تصدير, مصر, أحجار طبيعية',
  businessHours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
  businessHoursAr: 'الأحد - الخميس: 9:00 ص - 6:00 م',
  primaryColor: defaultColors.primary,
  secondaryColor: defaultColors.secondary,
  tertiaryColor: defaultColors.tertiary,
  quaternaryColor: defaultColors.quaternary,
  quinaryColor: defaultColors.quinary
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [colors, setColors] = useState<ThemeColors>(defaultColors)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to convert hex to RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '0, 0, 0'
    
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    
    return `${r}, ${g}, ${b}`
  }

  // Function to generate color variations
  const generateColorVariations = (baseColor: string, name: string) => {
    const rgb = hexToRgb(baseColor)
    
    // Generate different shades (this is a simplified approach)
    const variations = {
      50: `rgba(${rgb}, 0.05)`,
      100: `rgba(${rgb}, 0.1)`,
      200: `rgba(${rgb}, 0.2)`,
      300: `rgba(${rgb}, 0.3)`,
      400: `rgba(${rgb}, 0.4)`,
      500: `rgba(${rgb}, 0.5)`,
      600: `rgba(${rgb}, 0.6)`,
      700: `rgba(${rgb}, 0.7)`,
      800: `rgba(${rgb}, 0.8)`,
      900: `rgba(${rgb}, 0.9)`,
      DEFAULT: baseColor
    }

    return variations
  }

  // Apply theme colors to CSS custom properties
  const applyThemeToDOM = (themeColors: ThemeColors) => {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    // Primary color variations
    const primaryVariations = generateColorVariations(themeColors.primary, 'primary')
    Object.entries(primaryVariations).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary${key === 'DEFAULT' ? '' : `-${key}`}`, value)
    })

    // Secondary color variations
    const secondaryVariations = generateColorVariations(themeColors.secondary, 'secondary')
    Object.entries(secondaryVariations).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary${key === 'DEFAULT' ? '' : `-${key}`}`, value)
    })

    // Tertiary color variations
    const tertiaryVariations = generateColorVariations(themeColors.tertiary, 'tertiary')
    Object.entries(tertiaryVariations).forEach(([key, value]) => {
      root.style.setProperty(`--color-tertiary${key === 'DEFAULT' ? '' : `-${key}`}`, value)
    })

    // Quaternary color variations
    const quaternaryVariations = generateColorVariations(themeColors.quaternary, 'quaternary')
    Object.entries(quaternaryVariations).forEach(([key, value]) => {
      root.style.setProperty(`--color-quaternary${key === 'DEFAULT' ? '' : `-${key}`}`, value)
    })

    // Quinary color variations
    const quinaryVariations = generateColorVariations(themeColors.quinary, 'quinary')
    Object.entries(quinaryVariations).forEach(([key, value]) => {
      root.style.setProperty(`--color-quinary${key === 'DEFAULT' ? '' : `-${key}`}`, value)
    })

    // Set basic RGB values for use in rgba() functions
    root.style.setProperty('--color-primary-rgb', hexToRgb(themeColors.primary))
    root.style.setProperty('--color-secondary-rgb', hexToRgb(themeColors.secondary))
    root.style.setProperty('--color-tertiary-rgb', hexToRgb(themeColors.tertiary))
    root.style.setProperty('--color-quaternary-rgb', hexToRgb(themeColors.quaternary))
    root.style.setProperty('--color-quinary-rgb', hexToRgb(themeColors.quinary))

    // Set fixed alert colors
    root.style.setProperty('--color-success', alertColors.success)
    root.style.setProperty('--color-warning', alertColors.warning)
    root.style.setProperty('--color-error', alertColors.error)
    root.style.setProperty('--color-info', alertColors.info)
  }

  // Fetch settings from API
  const refreshSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const fetchedSettings = data.settings || defaultSettings

      setSettings(fetchedSettings)
      
      const newColors: ThemeColors = {
        primary: fetchedSettings.primaryColor || defaultColors.primary,
        secondary: fetchedSettings.secondaryColor || defaultColors.secondary,
        tertiary: fetchedSettings.tertiaryColor || defaultColors.tertiary,
        quaternary: fetchedSettings.quaternaryColor || defaultColors.quaternary,
        quinary: fetchedSettings.quinaryColor || defaultColors.quinary
      }
      
      setColors(newColors)
      applyThemeToDOM(newColors)
      
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load settings')
      
      // Use default settings on error
      console.log('🔄 Using default settings due to API error')
      setSettings(defaultSettings)
      setColors(defaultColors)
      applyThemeToDOM(defaultColors)
    } finally {
      setIsLoading(false)
    }
  }

  // Update theme colors (for admin use)
  const updateThemeColors = (newColors: ThemeColors) => {
    setColors(newColors)
    applyThemeToDOM(newColors)
    
    // Update settings state
    if (settings) {
      setSettings({
        ...settings,
        primaryColor: newColors.primary,
        secondaryColor: newColors.secondary,
        tertiaryColor: newColors.tertiary,
        quaternaryColor: newColors.quaternary,
        quinaryColor: newColors.quinary
      })
    }
  }

  // Load settings on mount
  useEffect(() => {
    refreshSettings()
  }, [])

  // Set up polling for settings updates (optional - for admin changes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (settings?.updatedAt) {
        // Check if settings were updated (simple approach)
        fetch('/api/settings')
          .then(res => res.json())
          .then(data => {
            if (data.settings?.updatedAt && data.settings.updatedAt !== settings.updatedAt) {
              refreshSettings()
            }
          })
          .catch(() => {
            // Ignore polling errors
          })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [settings?.updatedAt])

  const value: ThemeContextType = {
    settings,
    colors,
    isLoading,
    error,
    refreshSettings,
    updateThemeColors
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Convenience hooks for specific theme aspects
export function useThemeColors(): ThemeColors {
  const { colors } = useTheme()
  return colors
}

export function useSiteSettings(): SiteSettings | null {
  const { settings } = useTheme()
  return settings
}