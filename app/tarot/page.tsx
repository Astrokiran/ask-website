import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Tarot Card Reading Services - Expert Tarot Consultation | Astrokiran",
  description: "Professional tarot card reading services. Get insights into your future, relationships, career through expert tarot consultation. Online tarot readings available on WhatsApp.",
  keywords: ["tarot card reading", "tarot consultation", "tarot cards", "fortune telling", "tarot spread", "major arcana", "minor arcana", "love tarot", "career tarot", "future prediction"],
  alternates: {
    canonical: "https://astrokiran.com/tarot",
  },
}

export default function TarotPage() {
    return (
        <div className="min-h-screen">
            <NavBar />
            <main>
                {/* What is Tarot Section - Now First */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                    What is Tarot Card Reading?
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                    Tarot is an ancient divination practice that uses a deck of 78 cards to provide insights into your past, present, and future situations.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                            Sacred Symbolism
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Each tarot card contains rich symbolism and meaning that speaks to universal human experiences. The cards serve as a mirror to your subconscious mind, revealing hidden truths and potential paths forward.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                            Intuitive Guidance
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Our experienced tarot readers combine traditional card meanings with intuitive insights to provide personalized guidance for your unique situation and life journey.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <img
                                        src="/tarot.png"
                                        alt="Tarot Card Reading"
                                        className="w-full max-w-md rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hero Section - Now Second */}
                <div className="relative bg-gray-50 dark:bg-gray-900 py-16 overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        {/* Badge */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 rounded-full px-4 py-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mystical Tarot Guidance</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 leading-tight text-gray-900 dark:text-white">
                            Tarot Card Reading
                            <br />
                            <span className="text-2xl md:text-4xl font-medium text-gray-700 dark:text-gray-300">
                                Divine Guidance & Insights
                            </span>
                        </h1>

                        {/* Description */}
                        <div className="max-w-4xl mx-auto text-center mb-8">
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                Unlock the mysteries of your future through our expert tarot card readings.
                                Gain <span className="font-semibold text-orange-600 dark:text-orange-400">clarity, guidance, and divine insights</span> for your life's most important questions.
                            </p>

                            {/* Service highlights */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Love Tarot</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Relationship Guidance</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Career Tarot</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Professional Insights</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Future Reading</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Predictive Guidance</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Spiritual Guidance</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Life Path Clarity</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How Tarot Works Section */}
                <section className="py-16 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                    How Does Tarot Reading Work?
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                    Tarot readings involve drawing cards from a specially designed deck and interpreting their meanings in context of your questions.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🔮</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Major Arcana
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center">
                                        The 22 Major Arcana cards represent major life themes, spiritual lessons, and significant events that shape your journey through life.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🃏</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Minor Arcana
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center">
                                        The 56 Minor Arcana cards deal with everyday situations and represent the four elements: Cups (emotions), Wands (passion), Swords (thoughts), and Pentacles (material).
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🌟</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Card Spreads
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center">
                                        Different card layouts like Celtic Cross, Three-Card spread, or custom spreads are used based on your questions and the depth of reading required.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Types of Tarot Readings Section */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                    Types of Tarot Readings
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                    Choose from various specialized tarot reading types based on your specific needs and questions.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                                    <div className="text-center mb-4">
                                        <span className="text-3xl mb-3 block">💕</span>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Love & Relationship</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                                        Get insights into your romantic life, relationship compatibility, and love potential.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                                    <div className="text-center mb-4">
                                        <span className="text-3xl mb-3 block">💼</span>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Career & Finance</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                                        Discover career opportunities, financial prospects, and professional growth paths.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                                    <div className="text-center mb-4">
                                        <span className="text-3xl mb-3 block">🌙</span>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spiritual Guidance</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                                        Explore your spiritual path, life purpose, and connection with higher consciousness.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-800/20 dark:to-amber-800/20 rounded-xl p-6 border border-orange-300 dark:border-orange-700">
                                    <div className="text-center mb-4">
                                        <span className="text-3xl mb-3 block">🏠</span>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Family & Health</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                                        Get guidance on family matters, health concerns, and personal well-being.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-800/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-300 dark:border-amber-700">
                                    <div className="text-center mb-4">
                                        <span className="text-3xl mb-3 block">⭐</span>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Year Ahead</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                                        Comprehensive reading covering all aspects of your life for the coming year.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-800/20 dark:to-orange-800/20 rounded-xl p-6 border border-yellow-300 dark:border-yellow-700">
                                    <div className="text-center mb-4">
                                        <span className="text-3xl mb-3 block">❓</span>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Decision Making</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                                        Get clarity on important decisions and understand potential outcomes of your choices.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                                Frequently Asked Questions
                            </h2>

                            <div className="space-y-6">
                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        What is Tarot Card Reading? Complete Guide
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Tarot card reading is a form of divination using a deck of 78 cards divided into Major Arcana (22 cards) and Minor Arcana (56 cards). Each card contains symbolic imagery representing life situations, emotions, and spiritual guidance. Professional tarot readers interpret card combinations to provide insights into past, present, and future situations for personal growth and decision-making.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Tarot Card Meanings: Major Arcana vs Minor Arcana
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        <strong>Major Arcana</strong> cards like The Fool, Death, The World represent major life themes and spiritual lessons. <strong>Minor Arcana</strong> includes four suits: Cups (emotions/relationships), Wands (creativity/passion), Swords (thoughts/communication), and Pentacles (material/career). Each suit contains Ace through 10, plus Court cards (Page, Knight, Queen, King) representing personality types and approaches.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Types of Tarot Spreads and Card Layouts
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Popular tarot spreads include the <strong>Three-Card Spread</strong> (past-present-future), <strong>Celtic Cross</strong> (comprehensive 10-card reading), <strong>Relationship Spread</strong> (love and partnership insights), and <strong>Career Spread</strong> (professional guidance). Single card draws provide daily guidance, while complex spreads like the Zodiac Spread offer detailed annual predictions covering all life aspects.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        How Accurate are Tarot Predictions?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Tarot reading accuracy depends on the reader's experience, intuitive abilities, and connection with the querent. While not scientifically proven, many find tarot helpful for self-reflection and decision-making. Professional tarot readers combine traditional card meanings with psychological insights, providing guidance that helps clarify thoughts and reveal unconscious patterns rather than predicting fixed futures.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Love Tarot Reading: Relationship Guidance
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Love tarot readings focus on romantic relationships, soulmate connections, and emotional healing. Cards like The Lovers, Two of Cups, and Queen of Hearts indicate positive relationships, while challenging cards suggest areas for growth. Love spreads examine compatibility, communication patterns, future potential, and timing of romantic events. Professional readers provide guidance on finding love, improving relationships, and healing from heartbreak.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Career and Finance Tarot Reading
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Career tarot readings using cards like The Emperor, Ace of Pentacles, and Ten of Pentacles provide insights into job opportunities, business ventures, and financial growth. Professional tarot consultations help with career changes, workplace conflicts, entrepreneurial decisions, and investment timing. Money tarot spreads reveal financial patterns, abundance blocks, and prosperity potential.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Online Tarot Reading vs In-Person Consultation
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Online tarot readings via WhatsApp, video calls, or chat provide convenience and accessibility while maintaining reading quality. Many professional tarot readers offer digital consultations with photo card reveals and detailed interpretations. In-person readings allow for energy exchange and physical card handling. Both formats provide valuable guidance when conducted by experienced readers who connect intuitively with clients' questions and energy.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Free Tarot Reading vs Professional Consultation
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        While free tarot readings provide basic insights, professional consultations offer personalized interpretations, detailed analysis, and follow-up guidance. Expert tarot readers consider card positions, combinations, reversed meanings, and intuitive impressions to provide comprehensive readings. Professional services include question clarification, meditation guidance, and actionable advice for implementing tarot insights in daily life.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}