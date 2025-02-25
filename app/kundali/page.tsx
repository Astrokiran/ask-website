"use client"

import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { NavBar } from "@/components/nav-bar"
import { Calendar, LineChart } from "lucide-react"

export default function KundaliPage() {
    return (
        <div className="min-h-screen">
            <NavBar />
            <main>
                <HeroSection />
                <div className="flex flex-col items-center">
                    {/* Hero Section */}
                    {/* <div className="w-full bg-[#1a1b2e] text-center py-16">
                        <img src="/kundali-icon.png" alt="Kundali Icon" className="mx-auto w-16 h-16 mb-4" />
                        <h1 className="text-4xl font-bold text-white mb-3">Kundali Analysis</h1>
                        <p className="text-gray-300 mb-8">Unlock the secrets of your destiny through ancient Vedic astrology</p>
                        <div className="flex gap-4 justify-center">
                            <Button className="bg-[#ff6b6b] hover:bg-[#ff5252]">Get Your Kundali Analysis</Button>
                            <Button variant="outline" className="text-white border-white hover:bg-white/10">Talk to Expert</Button>
                        </div>
                    </div> */}

                    {/* Understanding Section */}
                    <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img src="/kundali-image.png" alt="Kundali Understanding" className="rounded-lg w-full" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Understanding Your Kundali</h2>
                            <p className="text-gray-600 mb-6">
                                A Kundali is your cosmic blueprint - a snapshot of the celestial positions at the exact moment of your birth. It reveals your life path, potential, and opportunities.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <span className="text-[#ff6b6b]">✨</span>
                                    Discover your true potential and life purpose
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-[#ff6b6b]">🌙</span>
                                    Understand your relationships and compatibility
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-[#ff6b6b]">⚡</span>
                                    Navigate career decisions with cosmic guidance
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-[#ff6b6b]">⭐</span>
                                    Find auspicious timings for important decisions
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Process Steps */}
                    <div className="w-full bg-[#1a1b2e] py-16">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-12 text-white">How to Get Your Kundali Analysis</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Step 1 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src="/social.png" alt="WhatsApp" className="w-8 h-8" />
                                        <h3 className="font-semibold text-xl">Connect on WhatsApp</h3>
                                    </div>
                                    <p className="text-gray-600">Start a conversation with our expert astrologers through WhatsApp for instant guidance.</p>
                                </div>
                                {/* Step 2 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Calendar className="w-8 h-8 text-[#ff6b6b]" />
                                        <h3 className="font-semibold text-xl">Share Birth Details</h3>
                                    </div>
                                    <p className="text-gray-600">Provide your exact birth date, time, and location for accurate Kundali creation.</p>
                                </div>
                                {/* Step 3 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <LineChart className="w-8 h-8 text-[#ff6b6b]" />
                                        <h3 className="font-semibold text-xl">Receive Expert Analysis</h3>
                                    </div>
                                    <p className="text-gray-600">Get detailed insights and predictions from our experienced astrologers.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    {/* <div className="w-full mx-auto px-4 py-16 bg-[#1a1b2e]">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-8 text-white">Begin Your Astrological Journey</h2>
                            <form className="space-y-4">
                                <div>
                                    <Input type="text" placeholder="Enter your name" className="w-full" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input type="text" placeholder="yyyy / mm / dd" />
                                    <Input type="text" placeholder="Birth Time" />
                                </div>
                                <div>
                                    <Input type="text" placeholder="Enter birth place" className="w-full" />
                                </div>
                                <Button className="w-full bg-[#ff6b6b] hover:bg-[#ff5252]">
                                    Get Your Kundali Analysis
                                </Button>
                            </form>
                        </div>
                    </div> */}

                    {/* Features Grid */}
                    <div className="w-full bg-white py-16">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-12">What You'll Discover</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Feature 1 */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">Life Path & Purpose</h3>
                                    <p className="text-gray-600">Understand your destiny and life mission through planetary positions.</p>
                                </div>
                                {/* Feature 2 */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">Career & Wealth</h3>
                                    <p className="text-gray-600">Get insights about your professional life and financial prospects.</p>
                                </div>
                                {/* Feature 3 */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">Relationships & Marriage</h3>
                                    <p className="text-gray-600">Learn about your compatibility and romantic relationships.</p>
                                </div>
                                {/* Feature 4 */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">Health & Wellness</h3>
                                    <p className="text-gray-600">Discover potential health aspects and preventive measures.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
            <Footer />
        </div>
    )
}