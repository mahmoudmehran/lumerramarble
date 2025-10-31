/**
 * Not Found Page (404)
 * يظهر عند عدم وجود الصفحة المطلوبة
 */

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-[var(--color-primary-600)] mb-4">
            404
          </div>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            الصفحة غير موجودة
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>
          <p className="text-lg text-gray-500">
            Page Not Found - La página no se encuentra - Page introuvable
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ar"
              className="px-8 py-4 bg-[var(--color-primary-600)] text-white rounded-lg hover:bg-[var(--color-primary-700)] transition-all active:scale-95 font-semibold"
            >
              🏠 العودة للصفحة الرئيسية
            </Link>
            
            <Link
              href="/ar/products"
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all active:scale-95 font-semibold"
            >
              🪨 تصفح المنتجات
            </Link>
          </div>

          <Link
            href="/ar/contact"
            className="inline-block text-[var(--color-primary-600)] hover:underline"
          >
            أو تواصل معنا للمساعدة →
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            روابط سريعة:
          </h3>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/ar" className="text-gray-600 hover:text-[var(--color-primary-600)]">
              الرئيسية
            </Link>
            <Link href="/ar/about" className="text-gray-600 hover:text-[var(--color-primary-600)]">
              من نحن
            </Link>
            <Link href="/ar/products" className="text-gray-600 hover:text-[var(--color-primary-600)]">
              المنتجات
            </Link>
            <Link href="/ar/blog" className="text-gray-600 hover:text-[var(--color-primary-600)]">
              المدونة
            </Link>
            <Link href="/ar/quote" className="text-gray-600 hover:text-[var(--color-primary-600)]">
              طلب عرض سعر
            </Link>
            <Link href="/ar/contact" className="text-gray-600 hover:text-[var(--color-primary-600)]">
              اتصل بنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
