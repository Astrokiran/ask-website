import React from "react";
import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms & Conditions - Astrokiran Astrology Services",
  description: "Read Astrokiran's terms and conditions for astrology services, WhatsApp consultations, kundli generation, and horoscope readings. Complete service terms and policies.",
  keywords: ["astrology terms", "service conditions", "astrokiran policies", "astrology service agreement"],
  alternates: {
    canonical: "https://astrokiran.com/terms",
  },
}

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-background to-purple-50 dark:from-indigo-950 dark:via-background dark:to-purple-950">
            <NavBar />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 py-16">
                <div className="absolute inset-0 bg-black opacity-10 dark:opacity-30"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <div className="animate-fade-in-up">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Terms & Conditions
                        </h1>
                        <p className="text-xl text-indigo-100 dark:text-indigo-200 max-w-2xl mx-auto leading-relaxed">
                            Understanding our service policies and your rights as an Astrokiran user
                        </p>
                    </div>
                </div>
            </div>

            <main className="relative">
                {/* Floating background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <section className="relative container mx-auto py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="backdrop-blur-sm bg-card/90 shadow-2xl border-0 rounded-3xl overflow-hidden animate-fade-in-up transition-all duration-700 hover:shadow-3xl">

                            <div className="p-8 md:p-12">
                                {/* Introduction Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl border-l-4 border-indigo-500 dark:border-indigo-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-indigo-600 dark:text-indigo-400 mr-2">📋</span>
                                        Agreement Overview
                                    </h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>
                                            Astrokiran is an online platform offered by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Pixelforge Tech Private Limited</span> (hereinafter referred to as "Astrokiran", "We", "Us", or "Our") that enables users ("You") to use our astrology services over WhatsApp, website, and mobile applications.
                                        </p>
                                        <p>
                                            These Terms of Service for Astrokiran ("Terms"), along with Astrokiran's Privacy Policy ("Privacy Policy") (together, "Platform Policies"), govern the relationship between You and Us. The Terms and Privacy Policy form a binding legal agreement based on which You may visit, access, or use the Astrokiran product, website, mobile applications, and related services ("Services").
                                        </p>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded-r-lg">
                                            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                                                ⚠️ <strong>Important:</strong> Your use of the Services indicates Your acceptance of the Platform Policies. You are advised to read the Platform Policies carefully before using Our Services.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Services Overview Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border-l-4 border-blue-500 dark:border-blue-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-blue-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-blue-600 dark:text-blue-400 mr-2">🔮</span>
                                        Overview of Services
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Astrokiran offers comprehensive astrological services including astrology consultations, tarot card reading, prashna kundali, palmistry, hastrekha reading, numerology, kundali milan, detailed horoscope reports, telephone/video consultations, WhatsApp consultations, and a <span className="font-semibold text-blue-600 dark:text-blue-400">FREE kundali worth ₹1000</span>.
                                    </p>
                                </div>

                                {/* Registration and Eligibility Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-l-4 border-purple-500 dark:border-purple-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-purple-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-purple-600 dark:text-purple-400 mr-2">👥</span>
                                        Registration and Eligibility
                                    </h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>
                                            Only individuals legally capable of entering into binding contracts under the Indian Contract Act, 1872, may access the Platform and use Our Services. Minors under the age of 18 (eighteen) years are prohibited from registering or using Our Services. We reserve the right to refuse or terminate access to Our Services if it is discovered that You are not legally competent to contract.
                                        </p>
                                        <p>
                                            You may access Our Services via WhatsApp using Your phone number ("Login Details"). However, You are expressly prohibited from:
                                        </p>
                                        <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-purple-200 dark:border-purple-600">
                                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                                <li>Providing false or misleading personal information or creating an account on behalf of someone else without their explicit consent.</li>
                                                <li>Using another person's Login Details with the intention of impersonating them.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Usage of Services Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border-l-4 border-green-500 dark:border-green-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-green-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-green-600 dark:text-green-400 mr-2">📱</span>
                                        Usage of Services
                                    </h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>
                                            You can use the Services via WhatsApp, website, or mobile applications available on Google Play and the Apple App Store.
                                        </p>
                                        <p>
                                            When You access Our Services and/or create an Astrokiran account, We may collect, use, share, and store Your information, including personal and sensitive information, to ensure effective service delivery. The collection and usage of such information are governed by the Privacy Policy.
                                        </p>
                                        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-500 p-4 rounded-r-lg">
                                            <p className="text-amber-800 dark:text-amber-200">
                                                📞 <strong>Important:</strong> By agreeing to these Terms, You consent to Us arranging a call with You on Your mobile number, even if it is registered under a Do Not Disturb (DND) service.
                                            </p>
                                        </div>
                                        <p>
                                            You agree to receive promotional and service messages from Us and Our affiliates via SMS, email, calls, and push notifications. You may withdraw consent by emailing <a href="mailto:support@astrokiran.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">support@astrokiran.com</a>.
                                        </p>
                                        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-r-lg">
                                            <p className="text-red-800 dark:text-red-200">
                                                ⚠️ <strong>Disclaimer:</strong> We are not responsible for connectivity issues, local internet disruptions, or device-related problems affecting Your usage of Our Services. You are responsible for protecting Your devices from malware, viruses, spyware, and other harmful software.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Restrictions on Use Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 rounded-2xl border-l-4 border-red-500 dark:border-red-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-red-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-red-600 dark:text-red-400 mr-2">🚫</span>
                                        Restrictions on Use
                                    </h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p className="font-medium">You shall not:</p>
                                        <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-red-200 dark:border-red-600">
                                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                                <li>Upload, distribute, transmit, publish, or share content that is defamatory, obscene, invasive of privacy, misleading, or violates any applicable law.</li>
                                                <li>Infringe any patent, trademark, copyright, or proprietary rights.</li>
                                                <li>Impersonate another person or engage in fraudulent activities.</li>
                                                <li>Host, intercept, emulate, or redirect Our proprietary communication protocols.</li>
                                                <li>Frame Our Services, impose editorial comments, or alter content.</li>
                                                <li>Use Our Services for commercial purposes without authorization.</li>
                                                <li>Engage in fraudulent payment activities.</li>
                                                <li>Send spam emails or unsolicited communications to other users.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Payments Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-2xl border-l-4 border-cyan-500 dark:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-cyan-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-cyan-600 dark:text-cyan-400 mr-2">💳</span>
                                        Payments
                                    </h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>
                                            You agree to pay applicable fees for accessing Our Services. Fees are subject to periodic review and revision. Your network provider may impose additional charges.
                                        </p>
                                        <div className="bg-cyan-50 dark:bg-cyan-900/30 border-l-4 border-cyan-400 dark:border-cyan-500 p-4 rounded-r-lg">
                                            <p className="text-cyan-800 dark:text-cyan-200">
                                                🇮🇳 <strong>Currency:</strong> All payments must be made in Indian Rupees (INR). Payments via credit/debit cards, net banking, and other methods are processed through third-party payment gateways.
                                            </p>
                                        </div>
                                        <p>
                                            We are not responsible for payment delays or denials at the payment gateway's end. Pixelforge Tech Pvt Ltd will issue a GST-compliant invoice, which will be sent to Your WhatsApp number.
                                        </p>
                                    </div>
                                </div>

                                {/* Refund Policy Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-2xl border-l-4 border-yellow-500 dark:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-yellow-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-yellow-600 dark:text-yellow-400 mr-2">↩️</span>
                                        Refund Policy
                                    </h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p className="font-medium text-green-700 dark:text-green-300">✅ Refunds may be requested under the following conditions:</p>
                                        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-600">
                                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                                <li>Network issues that disrupted the chat or call, including weak signal, background noise, or inaudibility of the astrologer.</li>
                                                <li>The astrologer was unable to communicate fluently in the listed language.</li>
                                                <li>The astrologer took excessive time to respond.</li>
                                                <li>The astrologer provided irrelevant responses.</li>
                                            </ul>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 p-4 rounded-r-lg">
                                            <p className="text-blue-800 dark:text-blue-200">
                                                ⏰ <strong>Processing:</strong> Refund requests must be raised within 180 days of payment. Once received, refunds will be processed within two (2) weeks and credited to the original payment source after deducting applicable transaction fees.
                                            </p>
                                        </div>

                                        <p className="font-medium text-red-700 dark:text-red-300">❌ Refunds will NOT be granted if:</p>
                                        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200">
                                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                                <li>The order has already entered processing (an astrologer has been assigned).</li>
                                                <li>Incorrect information was provided by You.</li>
                                                <li>The provided contact number was unreachable at the time of the call session.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Disclaimer, Indemnity, and Limitation of Liability Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-2xl border-l-4 border-gray-500 dark:border-gray-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-gray-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                                        <span className="text-gray-600 dark:text-gray-400 mr-2">⚖️</span>
                                        Disclaimer, Indemnity, and Limitation of Liability
                                    </h2>
                                    <div className="text-muted-foreground space-y-6 leading-relaxed">
                                        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-r-lg">
                                            <p className="text-red-800 dark:text-red-200 font-medium">
                                                ⚠️ <strong>General Disclaimer:</strong> Astrokiran is not liable for any loss, damages, or expenses incurred by You in connection with Our Services.
                                            </p>
                                        </div>

                                        <div className="bg-white/70 dark:bg-gray-800/70 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <h4 className="font-semibold text-foreground mb-3">🛡️ Indemnification</h4>
                                            <p className="mb-3">To the maximum extent permitted by law, you agree to indemnify and hold harmless the Company, its officers, directors, and employees from and against any losses, damages, costs, expenses, and claims arising from:</p>
                                            <ol className="list-[lower-roman] pl-6 space-y-1 text-muted-foreground">
                                                <li>Your use of the Services;</li>
                                                <li>Your violation of these Terms of Use or the Privacy Policy;</li>
                                                <li>Any infringement of intellectual property or other rights belonging to the Company or a third party; or</li>
                                                <li>Your non-compliance with any applicable laws.</li>
                                            </ol>
                                        </div>

                                        <div className="bg-white/70 dark:bg-gray-800/70 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <h4 className="font-semibold text-foreground mb-3">📊 Limitation of Liability</h4>
                                            <p className="mb-3">To the fullest extent permitted by law, the Company and its affiliates shall not be liable for any direct, indirect, special, incidental, punitive, exemplary, or consequential damages related to the Platform and/or Services, regardless of the legal basis, including warranty, contract, or tort (such as negligence), even if the Company has been advised of the possibility of such damages.</p>
                                            <p className="mb-3 font-medium">You acknowledge that under no circumstances, including negligence, shall the Company be liable to you or any other person or entity for any direct or indirect damages, including but not limited to loss of profits, goodwill, data, or any other intangible losses, arising from:</p>
                                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                <li>Your use or inability to use the Platform and/or Services;</li>
                                                <li>Your reliance on statements or representations made by the Company while providing the Services; or</li>
                                                <li>Any other matter relating to the Platform and/or Services.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Intellectual Property Rights Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl border-l-4 border-teal-500 dark:border-teal-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-teal-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-teal-600 dark:text-teal-400 mr-2">📝</span>
                                        Intellectual Property Rights
                                    </h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>
                                            Astrokiran and its affiliates exclusively own all intellectual property, including trademarks, copyrights, patents, and proprietary technology related to the Platform. You are granted a <strong className="text-teal-700 dark:text-teal-300">limited, non-transferable right</strong> to use Our Services but have no ownership over any intellectual property.
                                        </p>
                                        <div className="bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-400 dark:border-orange-500 p-4 rounded-r-lg">
                                            <p className="text-orange-800 dark:text-orange-200">
                                                🚫 <strong>Restriction:</strong> You may not reverse-engineer, modify, or distribute any part of Our Services without Our written consent.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Complaints and Disputes Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl border-l-4 border-violet-500 dark:border-violet-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-violet-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-violet-600 dark:text-violet-400 mr-2">📞</span>
                                        Complaints and Disputes
                                    </h2>
                                    <div className="bg-white/70 dark:bg-gray-800/70 p-5 rounded-lg border border-violet-200 dark:border-violet-600">
                                        <h4 className="font-semibold text-violet-800 dark:text-violet-200 mb-3">👨‍💼 Grievance Officer</h4>
                                        <div className="text-muted-foreground space-y-1">
                                            <p><strong>Name:</strong> Ankit Gupta</p>
                                            <p><strong>Designation:</strong> CEO</p>
                                            <p><strong>Email:</strong> <a href="mailto:ankit@pixelforgetechnology.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">ankit@pixelforgetechnology.com</a></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Governing Law Section */}
                                <div className="mb-10 p-6 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl border-l-4 border-rose-500 dark:border-rose-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-rose-400">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <span className="text-rose-600 dark:text-rose-400 mr-2">🏛️</span>
                                        Governing Law, Dispute Resolution & Jurisdiction
                                    </h2>
                                    <div className="text-muted-foreground space-y-4 leading-relaxed">
                                        <p>
                                            The Platform Policies are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of civil courts in Bengaluru, Karnataka.
                                        </p>
                                        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 p-4 rounded-r-lg">
                                            <p className="text-blue-800 dark:text-blue-200">
                                                ⚖️ <strong>Dispute Process:</strong> Disputes must first be notified in writing. If unresolved within 30 days, arbitration will be conducted before a three-member tribunal in Bangalore, per the Arbitration and Conciliation Act, 1996. The decision will be final and binding.
                                            </p>
                                        </div>
                                        <p className="text-sm">
                                            Astrokiran may seek injunctive relief in a court of competent jurisdiction.
                                        </p>
                                    </div>
                                </div>

                                {/* Final Agreement Section */}
                                <div className="mb-8 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl border-2 border-indigo-300 dark:border-indigo-600 text-center">
                                    <p className="text-lg font-bold text-indigo-800 dark:text-indigo-200 mb-2">
                                        ✅ AGREEMENT CONFIRMATION
                                    </p>
                                    <p className="text-indigo-700 dark:text-indigo-300 font-medium">
                                        YOU HAVE FULLY READ AND UNDERSTOOD THESE TERMS AND VOLUNTARILY AGREE TO ALL PROVISIONS
                                    </p>
                                </div>

                                <div className="text-center">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                                        Last updated: 25th February 2025
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default TermsPage;