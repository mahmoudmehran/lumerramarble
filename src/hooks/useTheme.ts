import { useTheme, useThemeColors, useSiteSettings } from '../contexts/ThemeContext'

// Main theme hook - re-export for convenience
export { useTheme, useThemeColors, useSiteSettings }

// Utility functions for theme-related operations
export const themeUtils = {
  // Generate CSS class names with theme colors
  getColorClass: (color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'success' | 'warning' | 'error' | 'info', variant?: number) => {
    const variantSuffix = variant ? `-${variant}` : ''
    return `text-${color}${variantSuffix}`
  },

  // Generate background color class names
  getBgColorClass: (color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'success' | 'warning' | 'error' | 'info', variant?: number) => {
    const variantSuffix = variant ? `-${variant}` : ''
    return `bg-${color}${variantSuffix}`
  },

  // Generate border color class names
  getBorderColorClass: (color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'success' | 'warning' | 'error' | 'info', variant?: number) => {
    const variantSuffix = variant ? `-${variant}` : ''
    return `border-${color}${variantSuffix}`
  },

  // Get CSS custom property name
  getCSSVariable: (color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'success' | 'warning' | 'error' | 'info', variant?: number) => {
    const variantSuffix = variant ? `-${variant}` : ''
    return `var(--color-${color}${variantSuffix})`
  },

  // Get RGB values for use in rgba()
  getRGBVariable: (color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary') => {
    return `var(--color-${color}-rgb)`
  },

  // Generate inline styles with theme colors
  getInlineStyle: (color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'success' | 'warning' | 'error' | 'info', variant?: number) => {
    return {
      color: themeUtils.getCSSVariable(color, variant)
    }
  },

  // Generate inline background styles
  getInlineBgStyle: (color: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'success' | 'warning' | 'error' | 'info', variant?: number) => {
    return {
      backgroundColor: themeUtils.getCSSVariable(color, variant)
    }
  },

  // Generate gradient styles
  getGradientStyle: (
    fromColor: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary',
    toColor: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary',
    fromVariant?: number,
    toVariant?: number,
    direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl' = 'to-r'
  ) => {
    const fromCSSVar = themeUtils.getCSSVariable(fromColor, fromVariant)
    const toCSSVar = themeUtils.getCSSVariable(toColor, toVariant)
    
    const directionMap = {
      'to-r': 'to right',
      'to-l': 'to left',
      'to-t': 'to top',
      'to-b': 'to bottom',
      'to-br': 'to bottom right',
      'to-bl': 'to bottom left',
      'to-tr': 'to top right',
      'to-tl': 'to top left'
    }

    return {
      background: `linear-gradient(${directionMap[direction]}, ${fromCSSVar}, ${toCSSVar})`
    }
  }
}

// Hook for theme-aware styling
export function useThemedStyles() {
  const colors = useThemeColors()

  return {
    colors,
    utils: themeUtils,
    
    // Pre-defined common styles
    primaryButton: {
      backgroundColor: colors.secondary,
      color: 'white',
      border: `2px solid ${colors.secondary}`,
      borderRadius: '0.5rem',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    },

    secondaryButton: {
      backgroundColor: 'transparent',
      color: colors.secondary,
      border: `2px solid ${colors.secondary}`,
      borderRadius: '0.5rem',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer'
    },

    card: {
      backgroundColor: colors.quinary,
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: `1px solid rgba(${themeUtils.getRGBVariable('quaternary')}, 0.1)`,
      color: colors.quaternary
    },

    heroGradient: themeUtils.getGradientStyle('primary', 'primary', undefined, 800, 'to-br'),
    
    // New semantic styles
    headingText: {
      color: colors.tertiary
    },
    
    bodyText: {
      color: colors.quaternary
    },
    
    backgroundColor: {
      color: colors.quinary
    }
  }
}

// Hook for company information
export function useCompanyInfo() {
  const settings = useSiteSettings()
  
  return {
    name: settings?.companyName || 'Lumerra Marble',
    nameAr: settings?.companyNameAr || 'شركة لوميرا للرخام',
    description: settings?.description || 'Leading marble and granite export company from Egypt',
    descriptionAr: settings?.descriptionAr || 'شركة رائدة في تصدير الرخام والجرانيت من مصر',
    phone: settings?.phone || '+20 111 312 1444',
    email: settings?.email || 'info@lumerramarble.com',
    whatsapp: settings?.whatsapp || '+20 111 312 1444',
    address: settings?.address || 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
    addressAr: settings?.addressAr || 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
    businessHours: settings?.businessHours || 'Sunday - Thursday: 9:00 AM - 6:00 PM',
    businessHoursAr: settings?.businessHoursAr || 'الأحد - الخميس: 9:00 ص - 6:00 م',
    social: {
      facebook: settings?.facebook || 'https://facebook.com/lumerramarble',
      instagram: settings?.instagram || 'https://instagram.com/lumerramarble',
      linkedin: settings?.linkedin || 'https://linkedin.com/company/lumerramarble',
      youtube: settings?.youtube || 'https://youtube.com/@lumerramarble'
    }
  }
}

// Hook for SEO information
export function useSEOInfo() {
  const settings = useSiteSettings()
  
  return {
    title: settings?.metaTitle || 'Lumerra Marble - Premium Egyptian Marble & Granite Export',
    titleAr: settings?.metaTitleAr || 'لوميرا للرخام - تصدير الرخام والجرانيت المصري الفاخر',
    description: settings?.metaDescription || 'Leading Egyptian company exporting premium marble, granite and quartz worldwide.',
    descriptionAr: settings?.metaDescriptionAr || 'شركة مصرية رائدة في تصدير الرخام والجرانيت والكوارتز الفاخر عالمياً.',
    keywords: settings?.keywords || 'marble, granite, quartz, export, Egypt, natural stone',
    keywordsAr: settings?.keywordsAr || 'رخام, جرانيت, كوارتز, تصدير, مصر, أحجار طبيعية'
  }
}