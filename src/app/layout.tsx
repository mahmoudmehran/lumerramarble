import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { getSiteSettings } from "@/lib/settings";
import { InitialTheme } from "@/components/InitialTheme";
import { ThemeCache } from "@/components/ThemeCache";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "لوميرا ماربل - Lumerra Marble - Premium Marble & Granite Export from Egypt",
  description: "Leading exporter of premium marble, granite, and quartz from Egypt to worldwide markets. Quality natural stones for construction and interior design.",
  keywords: "marble, granite, quartz, export, Egypt, natural stone, construction materials, lumerra marble, لوميرا ماربل",
  authors: [{ name: "Lumerra Marble" }],
  creator: "Lumerra Marble",
  publisher: "Lumerra Marble",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lumerramarble.com",
    siteName: "Lumerra Marble",
    title: "لوميرا ماربل - Lumerra Marble - Premium Marble & Granite Export",
    description: "Leading exporter of premium marble, granite, and quartz from Egypt to worldwide markets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "لوميرا ماربل - Lumerra Marble - Premium Marble & Granite Export",
    description: "Leading exporter of premium marble, granite, and quartz from Egypt to worldwide markets.",
    creator: "@lumerramarble",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load settings for initial theme
  const settings = await getSiteSettings();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeCache />
        <InitialTheme settings={settings} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f59000" />
      </head>
      <body
        className={`${cairo.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
