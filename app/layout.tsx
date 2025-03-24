import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react" // Import React
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AstroKiran - Discover Your Cosmic Path",
  description: "Connect with expert astrologers for personalized guidance",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-97R5TTNY4G" />
    </html>
  )
}



import './globals.css'