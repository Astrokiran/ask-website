import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Palmistry & Hand Reading Services - Hastrekha Analysis | Astrokiran",
  description: "Professional palmistry and hastrekha reading services. Learn about palm lines, mounts, and hand analysis. Get detailed insights about your life, career, relationships through palm reading.",
  keywords: ["palmistry", "hastrekha reading", "palm reading", "hand analysis", "palm lines", "life line", "heart line", "head line", "mount analysis", "palmistry consultation"],
  alternates: {
    canonical: "https://astrokiran.com/palmistry",
  },
}

export default function PalmistryPage() {
    return (
        <div className="min-h-screen">
            <NavBar />
            <main>
                {/* What is Palmistry Section - Now First */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                    What is Palmistry?
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                    Palmistry, also known as Hastrekha Shastra in Sanskrit, is an ancient practice of fortune-telling through the study of palm lines, hand shape, and mounts.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                            Ancient Wisdom
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Palmistry has been practiced for thousands of years across various cultures, including Hindu, Chinese, and Greek traditions. The lines on your palm are believed to reveal insights about your personality, relationships, health, and future.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                            Scientific Approach
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Our expert palmists combine traditional knowledge with modern understanding to provide accurate readings. We analyze hand shape, finger length, palm lines, and mounts to give you comprehensive insights.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <img
                                        src="/palmist.png"
                                        alt="Palmistry Hand Reading"
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
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ancient Art of Palm Reading</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 leading-tight text-gray-900 dark:text-white">
                            Palmistry & Hand Reading
                            <br />
                            <span className="text-2xl md:text-4xl font-medium text-gray-700 dark:text-gray-300">
                                Hastrekha Analysis
                            </span>
                        </h1>

                        {/* Description */}
                        <div className="max-w-4xl mx-auto text-center mb-8">
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                Discover the secrets hidden in your palms through our expert palmistry services.
                                Learn about your <span className="font-semibold text-orange-600 dark:text-orange-400">life path, relationships, career, and destiny</span> through ancient hastrekha analysis.
                            </p>

                            {/* Service highlights */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Life Line</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Health & Vitality</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Heart Line</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Love & Emotions</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Head Line</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Intelligence & Mind</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Mount Analysis</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Personality Traits</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How Palmistry Works Section */}
                <section className="py-16 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                    How Does Palmistry Work?
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                    Palm reading involves analyzing various aspects of your hands to reveal insights about your life and personality.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">👁️</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Palm Lines Analysis
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center">
                                        We examine the major lines including Life Line, Heart Line, Head Line, and Fate Line to understand your life journey, emotions, intellect, and destiny.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🏔️</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Mount Reading
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center">
                                        The mounts (raised areas) on your palm represent different planetary influences and personality traits like Venus for love, Jupiter for leadership, and Mars for courage.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🤚</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Hand Shape & Fingers
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-center">
                                        The overall shape of your hand and length of fingers provide insights into your basic nature, thinking patterns, and approach to life challenges.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
                                Benefits of Palmistry Reading
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Self-Discovery</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Understand your strengths, weaknesses, and hidden potential through palm analysis.</p>
                                </div>
                                <div className="bg-gradient-to-r from-orange-100 to-yellow-50 dark:from-orange-800/20 dark:to-yellow-900/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Relationship Insights</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Learn about your compatibility, love life, and relationship patterns.</p>
                                </div>
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Career Guidance</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Discover your natural talents and ideal career paths based on hand analysis.</p>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Health Awareness</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Gain insights into your health tendencies and vitality through life line analysis.</p>
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
                                        What is Palmistry? Meaning and Definition
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Palmistry, also known as Chiromancy or Hastrekha Shastra, is the ancient practice of reading palms to gain insights into a person's character, life events, and future. This 5000-year-old art originated in India and China, involving the study of palm lines, hand shape, fingers, mounts, and markings to interpret personality traits, health, relationships, and destiny.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        What are the Major Palm Lines in Palmistry?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        The four major palm lines are: <strong>Life Line</strong> (indicates vitality and life changes), <strong>Heart Line</strong> (reveals emotional nature and relationships), <strong>Head Line</strong> (shows intelligence and thinking patterns), and <strong>Fate Line</strong> (represents career and life direction). These lines, along with minor lines like marriage line, money line, and travel lines, create a comprehensive palm reading.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        How to Read Palm Lines? Palmistry Reading Guide
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Palm reading involves analyzing line depth, length, breaks, and intersections. Start with the dominant hand (shows current state) and non-dominant hand (shows potential). Examine hand shape (Earth, Air, Fire, Water), finger length, nail shape, and mounts (raised areas) under each finger. The combination of these elements provides insights into personality, health, career, and relationships.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Palmistry Benefits: Why Choose Palm Reading?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Palmistry offers self-awareness, relationship guidance, career direction, and health insights. Unlike other divination methods, palm reading is based on physical features that can change over time, reflecting personal growth. Professional palmistry consultations help in decision-making, understanding life patterns, compatibility analysis, and discovering hidden talents through detailed hand analysis.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Hastrekha Shastra: Indian Palmistry Tradition
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Hastrekha Shastra is the ancient Indian science of palmistry mentioned in Vedic texts. It connects palm features with planetary influences, karma, and sanskaras (past life impressions). Indian palmistry includes analysis of fingertips, nail shapes, skin texture, and special markings like tridents, stars, and crosses that indicate specific life events and spiritual inclinations.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Palm Reading Accuracy: Scientific Approach
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Modern palmistry combines traditional knowledge with psychological insights and pattern recognition. While not scientifically proven, dermatoglyphics (study of skin ridge patterns) shows genetic connections between hand features and health conditions. Professional palm readers use systematic analysis, observation skills, and intuitive interpretation to provide meaningful guidance for personal development.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Marriage Line and Love Life in Palmistry
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Marriage lines (located below the little finger) indicate relationship patterns, marriage timing, and love life quality. Multiple lines suggest multiple relationships, while a single clear line indicates one significant partnership. Heart line analysis reveals emotional nature, romantic compatibility, and relationship challenges. Professional palmists also examine Venus mount for passion and Jupiter mount for commitment.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        Career and Money Lines in Palm Reading
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        The fate line (Saturn line) running from wrist to middle finger indicates career path and professional success. Money lines near the little finger suggest financial gains and wealth potential. Sun line (Apollo line) shows fame, creativity, and recognition. Analyzing these lines with hand shape and finger characteristics helps determine suitable career choices and business aptitude.
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