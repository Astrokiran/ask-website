import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import HinduWisdomMillionaire from "@/components/games/HinduWisdomMillionaire"

export const metadata: Metadata = {
  title: "Hindu Wisdom Millionaire - Vedic Quiz Game | AstroKiran",
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

            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <NavBar />
                <main role="main" aria-label="Hindu Wisdom Millionaire Game" className="flex-1">
                    <article>
                        {/* Header Section */}
                        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 sm:py-6">
                            <div className="max-w-4xl mx-auto px-4 text-center">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-gray-900 dark:text-white">
                                    Hindu Wisdom Millionaire
                                </h1>
                            </div>
                        </header>

                        {/* Main Game Component - moved to top */}
                        <section aria-label="Interactive Hindu Wisdom Quiz Game" className="mb-8 sm:mb-12">
                            <HinduWisdomMillionaire />
                        </section>

                        {/* Informational Content - moved below game */}
                        <section className="bg-white dark:bg-gray-800 py-8 sm:py-12">
                            <div className="max-w-4xl mx-auto px-4 text-center">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
                                    Ultimate Vedic Knowledge Quiz Game
                                </h2>
                                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                                    Embark on an enlightening journey through ancient Hindu wisdom with our comprehensive quiz game. Test your knowledge of Vedic astrology, Hindu mythology, sacred scriptures, and spiritual teachings. This interactive millionaire-style game challenges you with 15 carefully crafted questions spanning the vast depths of Hindu philosophy, from basic concepts to advanced spiritual insights.
                                </p>
                                <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                                    Whether you're a spiritual seeker beginning your journey or a devoted practitioner of Hindu traditions, this game offers an engaging way to deepen your understanding of principles, divine narratives, and timeless wisdom. Progress through different wisdom levels - from Seeker to Enlightened Master - as you demonstrate your mastery of topics including Vedic astrology, Hindu gods and goddesses, ancient scriptures like the Bhagavad Gita and Ramayana, cultural festivals, philosophical concepts, and practical spiritual applications.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                                        <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-2 text-sm sm:text-base">15 Challenging Questions</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Progressive difficulty levels testing your Hindu knowledge comprehensively</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                                        <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-2 text-sm sm:text-base">Wisdom Levels</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Advance from Seeker to Enlightened Master based on your performance</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                                        <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-2 text-sm sm:text-base">Bilingual Support</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Play in both English and Hindi for better understanding</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </article>
                </main>
                <Footer />
            </div>
        </>
    )
}