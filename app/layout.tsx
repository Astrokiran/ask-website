import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react" // Import React
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "AstroKiran - Discover Your Cosmic Path",
  description: "Connect with expert astrologers for personalized guidance",
  generator: 'v0.dev',
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <GoogleAnalytics gaId="G-97R5TTNY4G" />
      </body>
    </html>
  )
}