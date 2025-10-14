import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
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
  title: "الحوت ماربل - Alhot Marble - Premium Marble & Granite Export from Egypt",
  description: "Leading exporter of premium marble, granite, and quartz from Egypt to worldwide markets. Quality natural stones for construction and interior design.",
  keywords: "marble, granite, quartz, export, Egypt, natural stone, construction materials, alhot marble, الحوت ماربل",
  authors: [{ name: "Alhot Marble" }],
  creator: "Alhot Marble",
  publisher: "Alhot Marble",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alhotmarble.com",
    siteName: "Alhot Marble",
    title: "الحوت ماربل - Alhot Marble - Premium Marble & Granite Export",
    description: "Leading exporter of premium marble, granite, and quartz from Egypt to worldwide markets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "الحوت ماربل - Alhot Marble - Premium Marble & Granite Export",
    description: "Leading exporter of premium marble, granite, and quartz from Egypt to worldwide markets.",
    creator: "@alhotmarble",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f59000" />
      </head>
      <body
        className={`${cairo.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
