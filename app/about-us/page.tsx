import React from "react";
import { NavBar } from "@/components/nav-bar"; // Adjust the path as needed
import { Footer } from "@/components/footer"; // Adjust the path as needed
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AboutUsPage = () => {
    return (
        <div>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">About Us</h1>

                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        <section className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                            <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
                            <p className="text-lg">
                                We are a dedicated team of experienced astrologers and spiritual guides committed to helping
                                you navigate life's journey through the ancient wisdom of astrology. Our platform brings
                                together centuries-old astrological knowledge with modern technology to provide you with
                                accurate and insightful consultations.
                            </p>
                        </section>

                        <section className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
                            <p className="text-lg">
                                We provide personalized astrological consultations, birth chart analysis, compatibility
                                readings, and spiritual guidance. Our expert astrologers use their deep understanding of
                                planetary movements and celestial patterns to offer valuable insights into your life's
                                path, relationships, career, and personal growth.
                            </p>
                        </section>

                        <section className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                            <p className="text-lg">
                                Our mission is to make authentic astrological wisdom accessible to everyone seeking
                                guidance. We strive to empower individuals with cosmic insights that help them make
                                informed decisions and live more fulfilling lives. Through our platform, we aim to bridge
                                the gap between ancient astrological knowledge and modern-day seekers.
                            </p>
                        </section>

                        <section className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                            <p className="text-lg">
                                We envision a world where everyone has access to authentic astrological guidance for
                                personal growth and self-discovery. We aim to create a global community where ancient
                                wisdom meets modern technology, fostering understanding, growth, and harmony in people's
                                lives through the power of astrology.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    );
};

export default AboutUsPage;