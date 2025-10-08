import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from "@/components/theme-provider"
import OrganizationSchema from "@/components/schema/OrganizationSchema"
import LocalBusinessSchema from "@/components/schema/LocalBusinessSchema"
import { ServiceWorker } from "@/components/performance/ServiceWorker"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import { AppDownloadPopup } from "@/components/banners/AppDownloadPopup"
import { CacheBuster } from "./cache-buster"

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'system-ui', 'sans-serif'],
  adjustFontFallback: true,
  preload: true,
  variable: '--font-inter'
})


export const metadata: Metadata = {
  metadataBase: new URL('https://astrokiran.com'),
  title: {
    default: "Free ₹1000 Kundli, Tarot, Palmistry, Numerology & Astrology Services - Astrokiran",
    template: "%s | Astrokiran - Complete Astrology Services India"
  },
  description: "Get FREE detailed kundli worth ₹1000, tarot card reading, prashna kundali, palmistry, hastrekha reading, numerology, kundali milan & WhatsApp consultations across India. Complete astrology services platform.",
  keywords: ["free kundli", "tarot card reading", "prashna kundali", "palmistry", "hastrekha reading", "numerology", "kundali milan", "astrology consultation", "whatsapp astrologer", "detailed horoscope"],
  generator: 'v0.dev',
  openGraph: {
    title: "Astrokiran - Free ₹1000 Kundli, Tarot & Complete Astrology Services India",
    description: "Complete astrology services including FREE ₹1000 kundli, tarot card reading, palmistry, hastrekha, numerology, prashna kundali & WhatsApp consultations across India.",
    url: "https://astrokiran.com",
    siteName: "Astrokiran",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "bsao8SV-Yrt9Dh06rZN6WKx86dnPMM_N4srDx2d01BE",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationSchema />
        <LocalBusinessSchema />
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      </head>
      <body className={`${inter.className} min-h-screen w-full overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CacheBuster />
          <AuthProvider>
            <div className="w-full max-w-full min-h-screen overflow-x-hidden">
              {children}
            </div>
            <AppDownloadPopup />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <ServiceWorker />
        <GoogleAnalytics gaId="G-97R5TTNY4G" />
      </body>
    </html>
  )
}