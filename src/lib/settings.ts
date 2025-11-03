import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface SiteSettings {
  // Company Information
  companyName: string
  companyNameAr: string
  companyNameEs: string
  companyNameFr: string
  description: string
  descriptionAr: string
  descriptionEs: string
  descriptionFr: string
  
  // Contact Information
  phone: string
  email: string
  whatsapp: string
  address: string
  addressAr: string
  addressEs: string
  addressFr: string
  
  // Social Media
  facebook?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  
  // SEO Settings
  metaTitle?: string
  metaTitleAr?: string
  metaTitleEs?: string
  metaTitleFr?: string
  metaDescription?: string
  metaDescriptionAr?: string
  metaDescriptionEs?: string
  metaDescriptionFr?: string
  keywords?: string
  keywordsAr?: string
  keywordsEs?: string
  keywordsFr?: string
  
  // Business Hours
  businessHours?: string
  businessHoursAr?: string
  businessHoursEs?: string
  businessHoursFr?: string
  
  // Email/SMTP Settings
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  smtpSecure?: boolean
  emailFrom?: string
  emailFromName?: string
  notificationEmail?: string
  
  // Image Settings
  maxImageSize?: number
  allowedImageTypes?: string
  imageQuality?: number
  autoOptimize?: boolean
  thumbnailWidth?: number
  thumbnailHeight?: number
  maxWidth?: number
  maxHeight?: number
  
  // SEO & Analytics
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  linkedinPartnerId?: string
  tiktokPixelId?: string
  bingAdsId?: string
  seoIndexing?: boolean
  seoFollowLinks?: boolean
  canonicalUrl?: string
  robotsTxt?: string
  
  // Legal Settings
  privacyPolicyAr?: string
  privacyPolicyEn?: string
  privacyPolicyEs?: string
  privacyPolicyFr?: string
  termsConditionsAr?: string
  termsConditionsEn?: string
  termsConditionsEs?: string
  termsConditionsFr?: string
  copyrightText?: string
  
  // Advanced Appearance
  fontFamily?: string
  fontSize?: string
  borderRadius?: string
  boxShadow?: string
  buttonStyle?: string
  animationsEnabled?: boolean
  darkModeEnabled?: boolean
  
  // Security Settings
  enableRecaptcha?: boolean
  recaptchaSiteKey?: string
  recaptchaSecretKey?: string
  maxLoginAttempts?: number
  sessionTimeout?: number
  enableTwoFactor?: boolean
  allowedIPs?: string
  blockedIPs?: string
  
  // WhatsApp Settings
  whatsappAutoReply?: string
  whatsappGreeting?: string
  whatsappButtonText?: string
  whatsappShowOnMobile?: boolean
  whatsappShowOnDesktop?: boolean
  whatsappPosition?: string
  
  // Theme Colors
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  quaternaryColor: string
  quinaryColor: string
}

let settingsCache: SiteSettings | null = null
let lastCacheUpdate = 0
const CACHE_DURATION = 60000 // 1 minute cache

/**
 * Get site settings from database with caching
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now()
  
  // Return cached settings if still valid
  if (settingsCache && (now - lastCacheUpdate) < CACHE_DURATION) {
    return settingsCache
  }

  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    }) as any

    if (!settings) {
      // Return default settings if none found
      return getDefaultSettings()
    }

    // Map database fields to SiteSettings interface
    const siteSettings: SiteSettings = {
      companyName: settings.companyName || 'Lumerra Marble',
      companyNameAr: settings.companyNameAr || 'شركة لوميرا للرخام',
      companyNameEs: settings.companyNameEs || 'Lumerra Marble',
      companyNameFr: settings.companyNameFr || 'Lumerra Marble',
      description: settings.description || 'Leading marble and granite export company from Egypt',
      descriptionAr: settings.descriptionAr || 'شركة رائدة في تصدير الرخام والجرانيت من مصر',
      descriptionEs: settings.descriptionEs || 'Empresa líder en exportación de mármol y granito desde Egipto',
      descriptionFr: settings.descriptionFr || 'Entreprise leader dans l\'exportation de marbre et granit depuis l\'Égypte',
      
      phone: settings.phone || '+20 111 312 1444',
      email: settings.email || 'info@lumerramarble.com',
      whatsapp: settings.whatsapp || '+20 111 312 1444',
      address: settings.address || 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
      addressAr: settings.addressAr || 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
      addressEs: settings.addressEs || 'Egipto - El Cairo - Zona Industrial Shaq Al-Thuban',
      addressFr: settings.addressFr || 'Égypte - Le Caire - Zone Industrielle Shaq Al-Thuban',
      
      facebook: settings.facebook || undefined,
      instagram: settings.instagram || undefined,
      linkedin: settings.linkedin || undefined,
      youtube: settings.youtube || undefined,
      
      metaTitle: settings.metaTitle || undefined,
      metaTitleAr: settings.metaTitleAr || undefined,
      metaTitleEs: settings.metaTitleEs || undefined,
      metaTitleFr: settings.metaTitleFr || undefined,
      metaDescription: settings.metaDescription || undefined,
      metaDescriptionAr: settings.metaDescriptionAr || undefined,
      metaDescriptionEs: settings.metaDescriptionEs || undefined,
      metaDescriptionFr: settings.metaDescriptionFr || undefined,
      keywords: settings.keywords || undefined,
      keywordsAr: settings.keywordsAr || undefined,
      keywordsEs: settings.keywordsEs || undefined,
      keywordsFr: settings.keywordsFr || undefined,
      
      businessHours: settings.businessHours || undefined,
      businessHoursAr: settings.businessHoursAr || undefined,
      businessHoursEs: settings.businessHoursEs || undefined,
      businessHoursFr: settings.businessHoursFr || undefined,
      
      smtpHost: settings.smtpHost || undefined,
      smtpPort: settings.smtpPort || undefined,
      smtpUser: settings.smtpUser || undefined,
      smtpPassword: settings.smtpPassword || undefined,
      smtpSecure: settings.smtpSecure || undefined,
      emailFrom: settings.emailFrom || undefined,
      emailFromName: settings.emailFromName || undefined,
      notificationEmail: settings.notificationEmail || undefined,
      
      maxImageSize: settings.maxImageSize || undefined,
      allowedImageTypes: settings.allowedImageTypes || undefined,
      imageQuality: settings.imageQuality || undefined,
      autoOptimize: settings.autoOptimize ?? undefined,
      thumbnailWidth: settings.thumbnailWidth || undefined,
      thumbnailHeight: settings.thumbnailHeight || undefined,
      maxWidth: settings.maxWidth || undefined,
      maxHeight: settings.maxHeight || undefined,
      
      googleAnalyticsId: settings.googleAnalyticsId || undefined,
      googleTagManagerId: settings.googleTagManagerId || undefined,
      facebookPixelId: settings.facebookPixelId || undefined,
      linkedinPartnerId: settings.linkedinPartnerId || undefined,
      tiktokPixelId: settings.tiktokPixelId || undefined,
      bingAdsId: settings.bingAdsId || undefined,
      seoIndexing: settings.seoIndexing ?? true,
      seoFollowLinks: settings.seoFollowLinks ?? true,
      canonicalUrl: settings.canonicalUrl || undefined,
      robotsTxt: settings.robotsTxt || undefined,
      
      privacyPolicyAr: settings.privacyPolicyAr || undefined,
      privacyPolicyEn: settings.privacyPolicyEn || undefined,
      privacyPolicyEs: settings.privacyPolicyEs || undefined,
      privacyPolicyFr: settings.privacyPolicyFr || undefined,
      termsConditionsAr: settings.termsConditionsAr || undefined,
      termsConditionsEn: settings.termsConditionsEn || undefined,
      termsConditionsEs: settings.termsConditionsEs || undefined,
      termsConditionsFr: settings.termsConditionsFr || undefined,
      copyrightText: settings.copyrightText || '© 2024 Lumerra Marble. All rights reserved.',
      
      fontFamily: settings.fontFamily || 'Inter',
      fontSize: settings.fontSize || '16px',
      borderRadius: settings.borderRadius || '8px',
      boxShadow: settings.boxShadow || '0 1px 3px rgba(0,0,0,0.1)',
      buttonStyle: settings.buttonStyle || 'rounded',
      animationsEnabled: settings.animationsEnabled ?? true,
      darkModeEnabled: settings.darkModeEnabled ?? false,
      
      enableRecaptcha: settings.enableRecaptcha ?? true,
      recaptchaSiteKey: settings.recaptchaSiteKey || undefined,
      recaptchaSecretKey: settings.recaptchaSecretKey || undefined,
      maxLoginAttempts: settings.maxLoginAttempts || 5,
      sessionTimeout: settings.sessionTimeout || 480,
      enableTwoFactor: settings.enableTwoFactor ?? false,
      allowedIPs: settings.allowedIPs || undefined,
      blockedIPs: settings.blockedIPs || undefined,
      
      whatsappAutoReply: settings.whatsappAutoReply || undefined,
      whatsappGreeting: settings.whatsappGreeting || 'مرحباً! كيف يمكنني مساعدتك؟',
      whatsappButtonText: settings.whatsappButtonText || 'تواصل عبر واتساب',
      whatsappShowOnMobile: settings.whatsappShowOnMobile ?? true,
      whatsappShowOnDesktop: settings.whatsappShowOnDesktop ?? true,
      whatsappPosition: settings.whatsappPosition || 'bottom-right',
      
      primaryColor: settings.primaryColor || '#f59000',
      secondaryColor: settings.secondaryColor || '#2c3e50',
      tertiaryColor: settings.tertiaryColor || '#34495e',
      quaternaryColor: settings.quaternaryColor || '#2c3e50',
      quinaryColor: settings.quinaryColor || '#ffffff',
    }

    // Update cache
    settingsCache = siteSettings
    lastCacheUpdate = now

    return siteSettings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return getDefaultSettings()
  }
}

/**
 * Get default settings as fallback
 */
function getDefaultSettings(): SiteSettings {
  return {
    companyName: 'Lumerra Marble',
    companyNameAr: 'شركة لوميرا للرخام',
    companyNameEs: 'Lumerra Marble',
    companyNameFr: 'Lumerra Marble',
    description: 'Leading marble and granite export company from Egypt',
    descriptionAr: 'شركة رائدة في تصدير الرخام والجرانيت من مصر',
    descriptionEs: 'Empresa líder en exportación de mármol y granito desde Egipto',
    descriptionFr: 'Entreprise leader dans l\'exportation de marbre et granit depuis l\'Égypte',
    
    phone: '+20 111 312 1444',
    email: 'info@lumerramarble.com',
    whatsapp: '+20 111 312 1444',
    address: 'Egypt - Cairo - Shaq Al-Thuban Industrial Zone',
    addressAr: 'مصر - القاهرة - المنطقة الصناعية شق الثعبان',
    addressEs: 'Egipto - El Cairo - Zona Industrial Shaq Al-Thuban',
    addressFr: 'Égypte - Le Caire - Zone Industrielle Shaq Al-Thuban',
    
    copyrightText: '© 2024 Lumerra Marble. All rights reserved.',
    
    fontFamily: 'Inter',
    fontSize: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    buttonStyle: 'rounded',
    animationsEnabled: true,
    darkModeEnabled: false,
    
    seoIndexing: true,
    seoFollowLinks: true,
    
    whatsappGreeting: 'مرحباً! كيف يمكنني مساعدتك؟',
    whatsappButtonText: 'تواصل عبر واتساب',
    whatsappShowOnMobile: true,
    whatsappShowOnDesktop: true,
    whatsappPosition: 'bottom-right',
    
    primaryColor: '#f59000',
    secondaryColor: '#2c3e50',
    tertiaryColor: '#34495e',
    quaternaryColor: '#2c3e50',
    quinaryColor: '#ffffff',
  }
}

/**
 * Clear settings cache (useful after updating settings)
 */
export function clearSettingsCache() {
  settingsCache = null
  lastCacheUpdate = 0
}
