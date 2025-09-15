export default function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Astrokiran",
    "description": "Complete online astrology services including FREE ₹1000 kundli, tarot card reading, prashna kundali, palmistry, hastrekha reading, numerology, kundali milan, and WhatsApp consultations available across India.",
    "url": "https://astrokiran.com",
    "logo": "https://astrokiran.com/logo.png",
    "image": "https://astrokiran.com/astrokiran-banner.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "addressCountry": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8197503574",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi", "Kannada"]
    },
    "sameAs": [
      "https://wa.me/918197503574"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceType": [
      "Astrology Consultation",
      "Free Kundli Generation",
      "Tarot Card Reading",
      "Prashna Kundali",
      "Palmistry Reading",
      "Hastrekha Reading",
      "Numerology Analysis",
      "Kundali Milan",
      "Detailed Horoscope",
      "WhatsApp Consultations"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  )
}