export default function LocalBusinessSchema() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "AstroKiran - Online Astrology Services India",
    "description": "Complete astrology services including FREE ₹1000 kundli, tarot card reading, prashna kundali, palmistry, hastrekha reading, numerology, kundali milan, and expert WhatsApp consultations across India.",
    "url": "https://astrokiran.com",
    "telephone": "+91-8197503574",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "12.9716",
      "longitude": "77.5946"
    },
    "openingHours": "Mo-Su 09:00-21:00",
    "priceRange": "₹₹",
    "serviceArea": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Astrology Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Free ₹1000 Kundli Report",
            "description": "Complete detailed birth chart analysis with planetary positions worth ₹1000 absolutely free"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Tarot Card Reading",
            "description": "Professional tarot card readings for guidance and predictions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Prashna Kundali",
            "description": "Vedic question-based astrology for specific life queries"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Palmistry & Hastrekha Reading",
            "description": "Hand analysis and palm reading for life insights"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Numerology Analysis",
            "description": "Name and birth date numerology for life guidance"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Kundali Milan",
            "description": "Marriage compatibility analysis using traditional methods"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "WhatsApp Consultations",
            "description": "Instant astrology consultations via WhatsApp with expert astrologers"
          }
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  )
}