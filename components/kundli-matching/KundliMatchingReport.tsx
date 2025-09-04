'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useAnimation, AnimatePresence } from 'framer-motion';
import { ChevronRight, Download, CheckCircle, XCircle, User, Heart, Gem, BrainCircuit, Magnet, Star, Zap, MessageSquare, Shield, Users, Dna } from 'lucide-react';
import { WhatsAppCtaBanner } from '@/components/banners/Whatsapp-banner';
import { DailyHoroscopeCta } from '../banners/Daily-horoscope';

// --- TYPE DEFINITIONS ---
interface KootaDetail {
    obtained_points: number;
    max_points: number;
    description: string;
}
interface MangalDoshaAnalysis {
    is_compatible: boolean;
    report: string;
    groom_status: string;
    bride_status: string;
}
interface KundliMatchingData {
    total_points_obtained: number;
    maximum_points: number;
    conclusion: string;
    mangal_dosha_analysis: MangalDoshaAnalysis;
    koota_details: { [key: string]: KootaDetail };
}
interface PersonDetails {
    name: string;
    date_of_birth: string;
    time_of_birth: string;
    place_of_birth: string;
}
interface InputData {
    groom: PersonDetails;
    bride: PersonDetails;
}

// --- ANIMATED HELPER COMPONENTS ---
const useAnimatedCounter = (to: number) => {
    const ref = React.useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 25 });
    useEffect(() => {
        if (isInView) {
            spring.set(to);
        }
    }, [isInView, spring, to]);
    useEffect(() => {
        spring.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = latest.toFixed(1);
            }
        });
    }, [spring]);
    return ref;
};

const ScoreGauge: React.FC<{ score: number; maxScore: number }> = ({ score, maxScore }) => {
    const percentage = (score / maxScore) * 100;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const animatedCounterRef = useAnimatedCounter(score);

    return (
        <motion.div
            className="relative w-48 h-48 mx-auto md:mx-0 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" /> {/* Lighter orange/yellow */}
                        <stop offset="100%" stopColor="#f97316" /> {/* Brighter orange */}
                    </linearGradient>
                </defs>
                <circle className="text-orange-100" strokeWidth="20" stroke="currentColor" fill="transparent" r={radius} cx="100" cy="100" />
                <motion.circle
                    stroke="url(#scoreGradient)"
                    strokeWidth="20"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="100"
                    cy="100"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-orange-900">
                <motion.span
                    ref={animatedCounterRef}
                    className="text-5xl font-extrabold"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    0.0
                </motion.span>
                <span className="text-xl text-orange-600">/ {maxScore}</span>
            </div>
        </motion.div>
    );
};

const ImageSlideshow: React.FC<{ imageSources: string[] }> = ({ imageSources }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (imageSources.length <= 1) return;
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imageSources.length);
        }, 3000);
        return () => clearInterval(intervalId);
    }, [imageSources.length]);

    return (
        <div className="flex flex-col items-center text-center">
            <motion.div
                className="relative w-64 h-64 rounded-xl overflow-hidden border-4 border-orange-300 bg-orange-100 flex items-center justify-center shadow-lg" // Increased size, added shadow, changed to rounded-xl
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 200 }}
            >
                <AnimatePresence>
                    <motion.img
                        key={currentIndex}
                        src={imageSources[currentIndex]}
                        alt="Kundli Matching"
                        className="absolute w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                    />
                </AnimatePresence>
            </motion.div>
            <p className="mt-4 text-sm text-orange-700 max-w-xs">
                Symbolizing the harmony and compatibility between the couple.
            </p>
        </div>
    );
};


const KootaCard: React.FC<{ name: string; points: string; maxPoints: string; description: string; icon: React.ReactNode }> = ({ name, points, maxPoints, description, icon }) => (
    <motion.div
        className="bg-white/90 backdrop-blur-md border border-orange-200 rounded-lg p-4 shadow-md transition-all hover:shadow-orange-300/30 hover:-translate-y-1"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
    >
        <div className="flex flex-col items-center text-center">
            <div className="p-2 rounded-full bg-orange-100 text-orange-600 mb-2">{icon}</div>
            <h4 className="text-lg font-semibold text-orange-900 mb-1">{name}</h4>
            <div className="w-full bg-orange-200 h-2 rounded-full mb-2 overflow-hidden">
                <motion.div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `${(parseInt(points) / parseInt(maxPoints.replace('/',''))) * 100}%` }}
                />
            </div>
            <span className="text-md font-bold text-orange-800 mb-2">{points}</span>
            <p className="text-xs text-orange-700 leading-tight">{description}</p>
        </div>
    </motion.div>
);

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-orange-900 relative inline-block">
            {children}
            <motion.span
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" // Adjusted gradient for header underline
                initial={{ width: 0 }}
                whileInView={{ width: '75%' }}
                transition={{ duration: 0.8 }}
            />
        </h2>
    </div>
);

const MatchSummaryHeader: React.FC<{ inputData: InputData }> = ({ inputData }) => {
    const { groom, bride } = inputData;
    
    const formatDateTime = (dateStr: string, timeStr: string) => {
        if (!dateStr || !timeStr) return "N/A";
        const [day, month, year] = dateStr.split('/');
        if (!day || !month || !year) return dateStr;
        const date = new Date(`${year}-${month}-${day}`);
        const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        return `${formattedDate}, ${timeStr}`;
    };

    const DetailCard: React.FC<{ person: PersonDetails }> = ({ person }) => (
        <motion.div
            className="bg-gradient-to-br from-orange-100 to-yellow-100 border border-orange-200 rounded-2xl shadow-lg w-full text-center p-6" // Adjusted gradient and border
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200 }}
        >
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-600 mb-2">{person.name}</h3> {/* Adjusted gradient for text */}
            <div className="text-left space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                    <span className="font-medium text-orange-600">Birth Details</span>
                    <span className="text-orange-800 text-right">{formatDateTime(person.date_of_birth, person.time_of_birth)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-orange-600">Birth Place</span>
                    <span className="text-orange-800 text-right">{person.place_of_birth}</span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="mb-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="w-full md:w-5/12"
                >
                    <DetailCard person={groom} />
                </motion.div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                >
                    <Heart className="w-14 h-14 text-orange-500" fill="currentColor" /> {/* Changed heart color */}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="w-full md:w-5/12"
                >
                    <DetailCard person={bride} />
                </motion.div>
            </div>
        </div>
    );
};

export function MatchingResults({ data: reportData }: { data: KundliMatchingData }) {
    const [inputData, setInputData] = useState<InputData | null>(null);
    
    useEffect(() => {
        const storedInput = sessionStorage.getItem('kundliMatchingApiInput');
        if (storedInput) {
            setInputData(JSON.parse(storedInput));
        }
    }, []);

    const kootaMap: { [key: string]: { name: string; icon: React.ReactNode; description: string } } = {
        varna: { name: "Ego & Work", icon: <BrainCircuit size={24} />, description: "Your Varna: Vaisya, Partner Varna: Vaisya. Compatibility is based on spiritual development." },
        vashya: { name: "Attraction", icon: <Magnet size={24} />, description: "Your Vashya: Chatushpada, Partner Vashya: Jalachara. Indicates mutual attraction and control." },
        tara: { name: "Destiny", icon: <Star size={24} />, description: "Tara check between 'Rohini' and 'Shravana'. Assesses health and well-being." },
        yoni: { name: "Intimacy", icon: <Zap size={24} />, description: "Your Yoni: Sarpa, Partner Yoni: Vanara. Level of genuine understanding, vulnerability, and authentic bond between partners." },
        graha_maitri: { name: "Mental Match", icon: <MessageSquare size={24} />, description: "Your Rasi Lord: Venus, Partner's Rasi Lord: Saturn. Measures mental and intellectual compatibility." },
        gana: { name: "Temperament", icon: <Shield size={24} />, description: "Your Gana: Manushya, Partner Gana: Deva. Reflects temperament and core nature." },
        bhakoot: { name: "Emotional Bond", icon: <Users size={24} />, description: "Distance between Moon signs is 9/4. Assesses overall emotional compatibility." },
        nadi: { name: "Health", icon: <Dna size={24} />, description: "Your Nadi: Antya, Partner Nadi: Antya. The partnership's potential for long-term stability, mutual growth, and lasting success." }
    };

    const mangalStatus = reportData.mangal_dosha_analysis.is_compatible;

    return (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 text-orange-900 min-h-screen p-4 sm:p-6 lg:p-10 font-sans"> {/* Adjusted background gradient */}
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center text-sm text-orange-600 mb-6">
                        <a href="/kundli-match" className="hover:text-orange-700 transition-colors">Kundli Matching</a>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        <span className="font-semibold text-orange-800">Matching Report</span>
                    </div>
                </motion.div>

                {inputData && <MatchSummaryHeader inputData={inputData} />}

                <motion.div
                    className="bg-white/70 backdrop-blur-xl border border-orange-200 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl" // Adjusted border color
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.3 } } }}
                >
                    <motion.header
                        className="text-center mb-12"
                        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600"> {/* Adjusted gradient for text */}
                            Kundli Matching Report
                        </h1>
                    </motion.header>

                    <motion.section
                        className="py-8 mb-12"
                        variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                    >
                        <SectionHeader>Final Compatibility Score</SectionHeader>
                        <div className="flex flex-col md:flex-row items-center justify-evenly gap-8 md:gap-16 mt-6">
                            {/* Left Side: Score Gauge */}
                            <div className="flex-shrink-0">
                                <ScoreGauge score={reportData.total_points_obtained} maxScore={reportData.maximum_points} />
                            </div>
                            
                            {/* Right Side: Image Slideshow */}
                            <ImageSlideshow imageSources={['/kundli-report.jpg', '/kundli-report2.jpg']} />
                        </div>
                        
                        {/* Conclusion Text below */}
                        <motion.p 
                            className="mt-10 text-center text-lg font-medium text-orange-800 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {reportData.conclusion}
                        </motion.p>
                    </motion.section>

                    <motion.section
                        className={`rounded-2xl p-8 text-center mb-12 border ${mangalStatus ? 'bg-emerald-50/50 border-emerald-200' : 'bg-orange-50/50 border-orange-200'}`} // Adjusted border for negative mangal dosha
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    >
                        <div className={`flex items-center justify-center gap-3 text-2xl font-bold ${mangalStatus ? 'text-emerald-700' : 'text-orange-700'}`}> {/* Adjusted text color for negative mangal dosha */}
                            {mangalStatus ? <CheckCircle /> : <XCircle />}
                            <span>Mangal Dosha Analysis</span>
                        </div>
                        <p className={`mt-4 text-md max-w-3xl mx-auto ${mangalStatus ? 'text-emerald-800' : 'text-orange-800'}`}> {/* Adjusted text color for negative mangal dosha */}
                            {reportData.mangal_dosha_analysis.report}
                        </p>
                    </motion.section>

                    <motion.section
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    >
                        <SectionHeader>Ashtakoota Breakdown</SectionHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(reportData.koota_details).map(([key, details]) => (
                                <KootaCard
                                    key={key}
                                    name={kootaMap[key].name}
                                    points={`${details.obtained_points}/${details.max_points}`}
                                    maxPoints={details.max_points.toString()}
                                    description={kootaMap[key].description}
                                    icon={kootaMap[key].icon}
                                />
                            ))}
                        </div>
                    </motion.section>
                </motion.div>

                <div className="mt-8 space-y-6">
                    <DailyHoroscopeCta phoneNumber='918197503574' />
                </div>
            </div>
        </div>
    );
}