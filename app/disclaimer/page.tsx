import React from "react";
import { Metadata } from 'next'
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";

export const metadata: Metadata = {
  title: "Disclaimer - Astrokiran Astrology Services",
  description: "Important disclaimer about Astrokiran's astrology services. Read about service limitations, entertainment purposes, and professional advice guidelines.",
  keywords: ["astrology disclaimer", "service limitations", "entertainment purposes", "professional advice"],
  alternates: {
    canonical: "https://astrokiran.com/disclaimer",
  },
}

export default function DisclaimerPage() {
    return (
        <div>
            <NavBar />

            <section className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-foreground text-center mb-6">Disclaimer</h1>
                <Card className="max-w-4xl mx-auto p-6 shadow-lg">
                    <CardContent className="space-y-6">
                        <p>
                            The information and data contained on the Astrokiran website and WhatsApp services are to be treated purely for entertainment purposes only. Any prediction or message that you receive is not a substitute for advice, programs, or treatment that you would normally receive from a licensed professional such as a lawyer, doctor, psychiatrist, or financial advisor. Accordingly, Astrokiran provides no guarantees, implied warranties, or assurances of any kind and will not be responsible for any interpretation made or use by the recipient of the information and data mentioned above.
                        </p>

                        <p>
                            Moreover, Astrokiran is a product of Pixelforge Tech PVT LTD. All transactions and gathered data are accessed and managed by Astrokiran in accordance with our privacy policy and terms of service.
                        </p>

                        <p>
                            For any concerns or inquiries, please contact us at <strong>support@astrokiran.com</strong>.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* SEO Content Section */}
            <section className="bg-white dark:bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Main Content */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    Understanding Astrology Services - Important Guidelines
                                </h2>
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                    Astrology services including kundli analysis, daily horoscope predictions, numerology calculations, and palmistry readings are deeply rooted in ancient Vedic traditions and should be understood within their proper context. Our comprehensive astrology platform provides authentic insights based on traditional astrological principles while maintaining transparency about the nature of these services.
                                </p>
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                    Whether you're exploring today's kanya rashi predictions, seeking numerology calculation guidance, or understanding your makar rashi forecast, it's important to approach astrological insights as complementary wisdom rather than definitive life directions. Our expert astrologers provide interpretations based on planetary positions, birth chart analysis, and traditional Vedic methodologies.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Responsible Use of Astrological Services
                                </h3>
                                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span><strong>Educational Purpose:</strong> Our kundli analysis, daily horoscope, and numerology calculations are designed to provide insights into cosmic influences and traditional astrological interpretations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span><strong>Cultural Heritage:</strong> Astrology represents thousands of years of Vedic wisdom and cultural knowledge passed down through generations of scholars and practitioners</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span><strong>Personal Reflection:</strong> Astrological guidance including rashi predictions, name numerology, and palmistry readings can serve as tools for self-reflection and personal growth</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span><strong>Complementary Guidance:</strong> Our astrology services complement but never replace professional medical, legal, financial, or psychological advice from licensed practitioners</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-orange-500 mt-1">•</span>
                                        <span><strong>Individual Interpretation:</strong> Astrological predictions including today's panchang, rashi forecasts, and kundli matching should be interpreted considering personal circumstances and free will</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar Content */}
                        <div className="space-y-8">
                            <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Our Astrology Services
                                </h3>
                                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-3">
                                        <span className="text-orange-500">📊</span>
                                        <span>Detailed Kundli Analysis & Birth Chart Reading</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-orange-500">🌟</span>
                                        <span>Daily Horoscope for All Rashis (Kanya, Makar, Tula, Meen)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-orange-500">🔢</span>
                                        <span>Numerology Calculation & Name Analysis</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-orange-500">✋</span>
                                        <span>Palmistry & Hastrekha Reading Services</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-orange-500">💕</span>
                                        <span>Kundli Matching & Marriage Compatibility</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-orange-500">📅</span>
                                        <span>Aaj Ka Panchang & Muhurat Timing</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Service Guidelines & Ethics
                                </h3>
                                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                                    <p>
                                        <strong>Professional Standards:</strong> Our certified astrologers follow traditional Vedic principles and maintain ethical standards in all consultations and readings.
                                    </p>
                                    <p>
                                        <strong>Transparency:</strong> We clearly communicate the nature and limitations of astrological services, ensuring clients understand the cultural and educational context.
                                    </p>
                                    <p>
                                        <strong>Confidentiality:</strong> All personal information shared during consultations, kundli analysis, and WhatsApp interactions remains strictly confidential.
                                    </p>
                                    <p>
                                        <strong>Respectful Guidance:</strong> Our astrologers provide insights with respect for individual beliefs, cultural backgrounds, and personal circumstances.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Contact & Support
                                </h3>
                                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                                    <p>
                                        For questions about our astrology services, kundli analysis, horoscope predictions, or any concerns regarding our platform:
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-green-500">📧</span>
                                        <span>support@astrokiran.com</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-green-500">📱</span>
                                        <span>WhatsApp: +91-8197503574</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-green-500">🏢</span>
                                        <span>Pixelforge Tech PVT LTD, Bangalore</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Understanding Vedic Astrology & Its Applications
                            </h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
                                Vedic astrology is an ancient science that studies the influence of celestial bodies on human life. Our platform brings this traditional knowledge to modern seekers while maintaining respect for its cultural significance and appropriate application.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-orange-100 dark:bg-orange-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🕉️</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Traditional Wisdom
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Our astrology services including kundli analysis, numerology calculation, and rashi predictions are based on authentic Vedic traditions and classical astrological texts.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Educational Approach
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    We provide astrological insights including daily horoscope, panchang updates, and palmistry readings as educational content to help understand cosmic influences and cultural heritage.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⚖️</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Ethical Standards
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Our platform maintains high ethical standards, ensuring that all astrology services, consultations, and predictions are provided with honesty, transparency, and respect for individual free will.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}