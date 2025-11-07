import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ Remote patterns للصور الخارجية
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'arabiangranite.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // ✅ تحسين الصور - استخدام WebP و AVIF
    formats: ['image/avif', 'image/webp'],
    // ✅ أحجام الأجهزة المدعومة
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // ✅ مدة التخزين المؤقت (سنة واحدة)
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  // ✅ Headers للتخزين المؤقت
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // ✅ تحسين imports
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
    // ✅ Partial Prerendering - uncomment when using Next.js canary
    // ppr: 'incremental',
  },
  // ✅ Compression
  compress: true,
  // ✅ Production Source Maps (معطلة لتقليل حجم الـ bundle)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
