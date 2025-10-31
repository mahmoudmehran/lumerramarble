/**
 * Error Handling Utilities
 * وظائف مساعدة للتعامل مع الأخطاء
 */

/**
 * أنواع الأخطاء المختلفة
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  NETWORK = 'NETWORK_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

/**
 * Error class مخصص للـ API
 */
export class APIError extends Error {
  type: ErrorType
  statusCode: number
  details?: unknown

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode: number = 500,
    details?: unknown
  ) {
    super(message)
    this.name = 'APIError'
    this.type = type
    this.statusCode = statusCode
    this.details = details
  }
}

/**
 * معالجة الأخطاء من API responses
 */
export function handleAPIError(error: unknown): APIError {
  // إذا كان الخطأ من نوع APIError بالفعل
  if (error instanceof APIError) {
    return error
  }

  // إذا كان الخطأ من نوع Error عادي
  if (error instanceof Error) {
    return new APIError(
      error.message,
      ErrorType.UNKNOWN,
      500
    )
  }

  // إذا كان الخطأ من Fetch API
  if (typeof error === 'object' && error !== null) {
    const err = error as { status?: number; message?: string }
    
    if (err.status === 404) {
      return new APIError(
        'المورد المطلوب غير موجود',
        ErrorType.NOT_FOUND,
        404
      )
    }

    if (err.status === 401) {
      return new APIError(
        'يجب تسجيل الدخول أولاً',
        ErrorType.AUTHENTICATION,
        401
      )
    }

    if (err.status === 403) {
      return new APIError(
        'غير مصرح لك بالوصول',
        ErrorType.AUTHORIZATION,
        403
      )
    }

    if (err.status === 429) {
      return new APIError(
        'تجاوزت الحد المسموح من الطلبات',
        ErrorType.RATE_LIMIT,
        429
      )
    }

    if (err.status && err.status >= 500) {
      return new APIError(
        'خطأ في الخادم',
        ErrorType.SERVER,
        err.status
      )
    }
  }

  // خطأ غير معروف
  return new APIError(
    'حدث خطأ غير متوقع',
    ErrorType.UNKNOWN,
    500,
    error
  )
}

/**
 * تنسيق رسالة الخطأ للمستخدم
 */
export function formatErrorMessage(error: unknown, locale: string = 'ar'): string {
  const apiError = handleAPIError(error)

  const messages: Record<ErrorType, Record<string, string>> = {
    [ErrorType.VALIDATION]: {
      ar: 'البيانات المدخلة غير صحيحة',
      en: 'Invalid input data',
      es: 'Datos de entrada no válidos',
      fr: 'Données d\'entrée non valides'
    },
    [ErrorType.AUTHENTICATION]: {
      ar: 'يجب تسجيل الدخول للمتابعة',
      en: 'Please login to continue',
      es: 'Por favor inicie sesión para continuar',
      fr: 'Veuillez vous connecter pour continuer'
    },
    [ErrorType.AUTHORIZATION]: {
      ar: 'غير مصرح لك بالوصول لهذه الصفحة',
      en: 'You are not authorized to access this page',
      es: 'No está autorizado para acceder a esta página',
      fr: 'Vous n\'êtes pas autorisé à accéder à cette page'
    },
    [ErrorType.NOT_FOUND]: {
      ar: 'المورد المطلوب غير موجود',
      en: 'The requested resource was not found',
      es: 'El recurso solicitado no se encontró',
      fr: 'La ressource demandée n\'a pas été trouvée'
    },
    [ErrorType.SERVER]: {
      ar: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً',
      en: 'Server error. Please try again later',
      es: 'Error del servidor. Por favor intente más tarde',
      fr: 'Erreur du serveur. Veuillez réessayer plus tard'
    },
    [ErrorType.NETWORK]: {
      ar: 'خطأ في الاتصال بالإنترنت',
      en: 'Network connection error',
      es: 'Error de conexión de red',
      fr: 'Erreur de connexion réseau'
    },
    [ErrorType.RATE_LIMIT]: {
      ar: 'تجاوزت الحد المسموح من الطلبات. حاول مرة أخرى بعد قليل',
      en: 'Too many requests. Please try again later',
      es: 'Demasiadas solicitudes. Inténtelo de nuevo más tarde',
      fr: 'Trop de demandes. Veuillez réessayer plus tard'
    },
    [ErrorType.UNKNOWN]: {
      ar: 'حدث خطأ غير متوقع',
      en: 'An unexpected error occurred',
      es: 'Ocurrió un error inesperado',
      fr: 'Une erreur inattendue s\'est produite'
    }
  }

  return messages[apiError.type]?.[locale] || apiError.message
}

/**
 * Log error للـ console أو monitoring service
 */
export function logError(error: unknown, context?: string) {
  const apiError = handleAPIError(error)

  const errorLog = {
    message: apiError.message,
    type: apiError.type,
    statusCode: apiError.statusCode,
    context,
    timestamp: new Date().toISOString(),
    details: apiError.details
  }

  // Log للـ console
  console.error('Error Log:', errorLog)

  // يمكن إضافة error tracking service هنا
  // مثال: Sentry.captureException(apiError, { contexts: { error: errorLog } })

  return errorLog
}

/**
 * Retry function للـ failed requests
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // إذا كان آخر محاولة، اطرح الخطأ
      if (i === maxRetries - 1) {
        throw error
      }

      // انتظر قبل المحاولة التالية (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }

  throw lastError
}

/**
 * Safe async function wrapper
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<{ data: T | null; error: APIError | null }> {
  try {
    const data = await fn()
    return { data, error: null }
  } catch (error) {
    const apiError = handleAPIError(error)
    logError(apiError, 'safeAsync')
    return { data: fallback ?? null, error: apiError }
  }
}
