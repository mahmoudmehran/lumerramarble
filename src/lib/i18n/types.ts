// Types for the internationalization system

export type Locale = 'ar' | 'en' | 'es' | 'fr'

export interface LocaleInfo {
  code: Locale
  name: string
  nativeName: string
  flag: string
  dir: 'ltr' | 'rtl'
}

// Translation keys structure - organized by sections
export interface TranslationKeys {
  // Common UI elements
  common: {
    loading: string
    save: string
    cancel: string
    edit: string
    delete: string
    submit: string
    back: string
    next: string
    previous: string
    close: string
    search: string
    filter: string
    clear: string
    viewAll: string
    learnMore: string
    readMore: string
    getStarted: string
    contact: string
    about: string
    services: string
    products: string
    home: string
    blog: string
    export: string
    quote: string
  }

  // Navigation
  navigation: {
    home: string
    products: string
    about: string
    export: string
    blog: string
    contact: string
    admin: string
    login: string
    logout: string
  }

  // Homepage content
  homepage: {
    hero: {
      title: string
      subtitle: string
      primaryButton: string
      secondaryButton: string
    }
    stats: {
      title: string
      experience: string
      countries: string
      projects: string
      satisfaction: string
    }
    categories: {
      title: string
      subtitle: string
      marble: string
      granite: string
      quartz: string
      special: string
    }
    features: {
      title: string
      quality: {
        title: string
        description: string
      }
      export: {
        title: string
        description: string
      }
      team: {
        title: string
        description: string
      }
      experience: {
        title: string
        description: string
      }
    }
    cta: {
      title: string
      subtitle: string
      button: string
    }
  }

  // About page
  about: {
    hero: {
      title: string
      subtitle: string
    }
    mission: {
      title: string
      vision: string
      mission: string
    }
    values: {
      title: string
      quality: {
        title: string
        description: string
      }
      trust: {
        title: string
        description: string
      }
      excellence: {
        title: string
        description: string
      }
      teamwork: {
        title: string
        description: string
      }
    }
    location: {
      title: string
      address: string
      description: string
    }
    stats: {
      title: string
      experience: string
      countries: string
      projects: string
      satisfaction: string
    }
  }

  // Export page
  export: {
    hero: {
      title: string
      subtitle: string
      cta: string
    }
    services: {
      title: string
      subtitle: string
      packaging: {
        title: string
        description: string
      }
      shipping: {
        title: string
        description: string
      }
      documentation: {
        title: string
        description: string
      }
      quality: {
        title: string
        description: string
      }
    }
    process: {
      title: string
      subtitle: string
      inquiry: {
        title: string
        description: string
      }
      quotation: {
        title: string
        description: string
      }
      production: {
        title: string
        description: string
      }
      delivery: {
        title: string
        description: string
      }
    }
    countries: {
      title: string
      subtitle: string
    }
    cta: {
      title: string
      subtitle: string
      button: string
    }
  }

  // Products page
  products: {
    title: string
    subtitle: string
    categories: {
      all: string
      marble: string
      granite: string
      quartz: string
      special: string
    }
    filters: {
      category: string
      search: string
      color: string
      thickness: string
      finish: string
    }
    productCard: {
      viewDetails: string
      requestQuote: string
      specifications: string
      origin: string
      thickness: string
      finishes: string
    }
  }

  // Blog page
  blog: {
    title: string
    subtitle: string
    readMore: string
    author: string
    date: string
    categories: {
      all: string
      industry: string
      tips: string
      projects: string
      news: string
    }
    featured: string
    recent: string
  }

  // Contact page
  contact: {
    title: string
    subtitle: string
    form: {
      name: string
      email: string
      phone: string
      company: string
      subject: string
      message: string
      send: string
    }
    info: {
      address: string
      phone: string
      email: string
      hours: string
    }
    success: string
    error: string
  }

  // Quote page
  quote: {
    title: string
    subtitle: string
    steps: {
      personal: string
      project: string
      product: string
      review: string
    }
    form: {
      personalInfo: {
        fullName: string
        email: string
        phone: string
        company: string
        country: string
        city: string
      }
      projectInfo: {
        projectType: string
        projectName: string
        expectedDate: string
        budget: string
      }
      productInfo: {
        productType: string
        quantity: string
        thickness: string
        finish: string
        dimensions: string
        color: string
      }
      additionalInfo: {
        message: string
        attachments: string
      }
    }
    success: string
    error: string
  }

  // Admin panel
  admin: {
    dashboard: {
      title: string
      welcome: string
      lastUpdate: string
      language: string
    }
    products: {
      title: string
      add: string
      edit: string
      delete: string
      search: string
      category: string
      featured: string
      active: string
    }
    quotes: {
      title: string
      status: string
      date: string
      customer: string
      project: string
      amount: string
      actions: string
    }
    blog: {
      title: string
      add: string
      edit: string
      publish: string
      draft: string
      featured: string
    }
    settings: {
      title: string
      siteInfo: string
      contact: string
      social: string
      seo: string
    }
  }

  // Error messages
  errors: {
    required: string
    invalid: string
    networkError: string
    serverError: string
    notFound: string
    unauthorized: string
    forbidden: string
  }

  // Success messages
  success: {
    saved: string
    updated: string
    deleted: string
    sent: string
    published: string
  }
}

// Partial translations for dynamic loading
export type TranslationsPartial = Partial<TranslationKeys>
export type TranslationNamespace = keyof TranslationKeys