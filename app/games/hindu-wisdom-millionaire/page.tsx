import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import HinduWisdomMillionaire from "@/components/games/HinduWisdomMillionaire"

export const metadata: Metadata = {
  title: "Hindu Wisdom Millionaire Game - Vedic Knowledge Quiz | AstroKiran",
  description: "Play the ultimate Hindu Wisdom Millionaire game! Test your knowledge of Vedic astrology, Hindu mythology, sacred scriptures, gods & goddesses. Free bilingual quiz game with 15 challenging questions. Earn wisdom levels from Seeker to Enlightened Master.",
  keywords: [
    "hindu wisdom millionaire", "vedic astrology quiz", "hindu mythology game", "ancient knowledge test",
    "spiritual quiz game", "hindu gods quiz", "vedic knowledge game", "sanskrit quiz", "hinduism trivia",
    "bhagavad gita quiz", "ramayana quiz", "mahabharata questions", "hindu philosophy game",
    "astrology quiz online", "free hindu quiz", "dharma quiz", "karma quiz", "moksha quiz",
    "indian mythology game", "hindu culture quiz", "vedic wisdom test", "hindu festival quiz",
    "chakra knowledge test", "mantra quiz", "yoga philosophy quiz", "ayurveda quiz",
    "hindu calendar quiz", "panchang quiz", "nakshatra quiz", "rashi quiz"
  ],
  authors: [{ name: "AstroKiran", url: "https://astrokiran.com" }],
  creator: "AstroKiran",
  publisher: "AstroKiran",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "Games",
  classification: "Educational Game",
  alternates: {
    canonical: "https://astrokiran.com/games/hindu-wisdom-millionaire",
    languages: {
      'en': 'https://astrokiran.com/games/hindu-wisdom-millionaire',
      'hi': 'https://astrokiran.com/games/hindu-wisdom-millionaire?lang=hi'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://astrokiran.com/games/hindu-wisdom-millionaire',
    title: 'Hindu Wisdom Millionaire Game - Ultimate Vedic Knowledge Quiz',
    description: 'Test your Hindu wisdom with this engaging millionaire-style quiz! Features Vedic astrology, mythology, scriptures & more. Play in English or Hindi. Free online game.',
    siteName: 'AstroKiran',
  },
  twitter: {
    card: 'summary',
    site: '@astrokiran',
    creator: '@astrokiran',
    title: 'Hindu Wisdom Millionaire - Free Vedic Knowledge Quiz Game',
    description: 'Play the ultimate Hindu wisdom quiz! Test knowledge of Vedic astrology, mythology, scriptures. Bilingual game with 15 levels. Earn wisdom from Seeker to Enlightened Master!',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function HinduWisdomMillionairePage() {
    // Structured data for the game
    const gameStructuredData = {
        "@context": "https://schema.org",
        "@type": "Game",
        "name": "Hindu Wisdom Millionaire",
        "description": "Interactive quiz game testing knowledge of Vedic astrology, Hindu mythology, sacred scriptures, gods and goddesses. Features 15 challenging questions with difficulty levels from beginner to advanced.",
        "url": "https://astrokiran.com/games/hindu-wisdom-millionaire",
        "genre": ["Educational", "Quiz", "Trivia"],
        "gamePlatform": ["Web Browser"],
        "applicationCategory": "Game",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "publisher": {
            "@type": "Organization",
            "name": "AstroKiran",
            "url": "https://astrokiran.com"
        },
        "inLanguage": ["en", "hi"],
        "audience": {
            "@type": "Audience",
            "audienceType": "People interested in Hindu culture, Vedic knowledge, astrology, and spiritual learning"
        },
        "educationalUse": "Knowledge testing and learning about Hindu wisdom, Vedic astrology, mythology, and sacred texts",
        "learningResourceType": "Interactive Game",
        "teaches": [
            "Vedic Astrology",
            "Hindu Mythology",
            "Sanskrit Knowledge",
            "Hindu Philosophy",
            "Sacred Hindu Texts",
            "Hindu Gods and Goddesses",
            "Hindu Festivals and Culture"
        ]
    };

    const breadcrumbStructuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://astrokiran.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Games",
                "item": "https://astrokiran.com/games"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Hindu Wisdom Millionaire",
                "item": "https://astrokiran.com/games/hindu-wisdom-millionaire"
            }
        ]
    };

    const websiteStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Hindu Wisdom Millionaire Game - Vedic Knowledge Quiz",
        "description": "Play the ultimate Hindu Wisdom Millionaire game! Test your knowledge of Vedic astrology, Hindu mythology, sacred scriptures, gods & goddesses.",
        "url": "https://astrokiran.com/games/hindu-wisdom-millionaire",
        "isPartOf": {
            "@type": "WebSite",
            "name": "AstroKiran",
            "url": "https://astrokiran.com"
        },
        "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://astrokiran.com/favicon.ico"
        },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": "AstroKiran"
        }
    };

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(gameStructuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
            />

            <div className="min-h-screen">
                <NavBar />
                <main role="main" aria-label="Hindu Wisdom Millionaire Game">
                    <article>
                        <header>
                            <h1 className="sr-only">Hindu Wisdom Millionaire - Ultimate Vedic Knowledge Quiz Game</h1>
                        </header>
                        <section aria-label="Interactive Hindu Wisdom Quiz Game">
                            <HinduWisdomMillionaire />
                        </section>
                    </article>
                </main>
                <Footer />
            </div>
        </>
    )
}