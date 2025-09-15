import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Astrology Blog - Expert Insights & Spiritual Guidance | AstroKiran",
  description: "Discover expert astrology insights, vedic wisdom, horoscope tips, daily predictions, and spiritual guidance. Read comprehensive guides on palmistry, numerology, tarot, and kundli analysis.",
  keywords: ["astrology blog", "vedic astrology", "horoscope tips", "spiritual guidance", "palmistry", "numerology", "tarot reading", "kundli analysis", "daily horoscope", "astrology insights"],
  alternates: {
    canonical: "https://astrokiran.com/blog",
  },
  openGraph: {
    title: "Astrology Blog - Expert Insights & Spiritual Guidance | AstroKiran",
    description: "Discover expert astrology insights, vedic wisdom, horoscope tips, daily predictions, and spiritual guidance.",
    url: "https://astrokiran.com/blog",
    siteName: "AstroKiran",
    type: "website",
    images: [
      {
        url: "/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AstroKiran Astrology Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrology Blog - Expert Insights & Spiritual Guidance | AstroKiran",
    description: "Discover expert astrology insights, vedic wisdom, horoscope tips, daily predictions, and spiritual guidance.",
    images: ["/blog-og-image.jpg"],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}