// components/kundli-matching/KundliMatchingReport.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
// Icons for a richer UI
import { ChevronRight, Download, CheckCircle, XCircle, User, Heart, Gem, BrainCircuit, Magnet, Star, Zap, MessageSquare, Shield, Users, Dna } from 'lucide-react';
import { WhatsAppCtaBanner } from '@/components/banners/Whatsapp-banner';

// --- TYPE DEFINITIONS (Unchanged) ---
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


// --- ANIMATED HELPER COMPONENTS (with Theme changes) ---

// Custom hook for an animated number counter
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
    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const animatedCounterRef = useAnimatedCounter(score);

    return (
        <div className="relative w-40 h-40 mx-auto md:mx-0 mb-5 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" /> {/* yellow-500 */}
                        <stop offset="100%" stopColor="#ef4444" /> {/* red-500 */}
                    </linearGradient>
                </defs>
                {/* THEME CHANGE: Light gray background circle */}
                <circle className="text-gray-200" strokeWidth="20" stroke="currentColor" fill="transparent" r={radius} cx="100" cy="100" />
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
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
            </svg>
            {/* THEME CHANGE: Dark text for readability on light BG */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                <span ref={animatedCounterRef} className="text-5xl font-bold">0.0</span>
                <span className="text-xl text-slate-500">/ {maxScore}</span>
            </div>
        </div>
    );
};

const KootaCard: React.FC<{ name: string; details: KootaDetail; icon: React.ReactNode }> = ({ name, details, icon }) => {
    const { obtained_points, max_points } = details;
    const percentage = max_points > 0 ? (obtained_points / max_points) * 100 : 0;

    return (
        <motion.div 
            className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-5 shadow-lg transition-all hover:shadow-orange-500/20 hover:-translate-y-1 hover:border-orange-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className=" p-2 rounded-lg text-orange-600">{icon}</div>
                    <h4 className="text-lg font-bold text-slate-800">{name}</h4>
                </div>
                <span className="text-lg font-bold text-slate-700">{obtained_points}<span className="text-sm text-slate-500">/{max_points}</span></span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                <motion.div 
                    className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500" 
                    initial={{ width: '0%' }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    viewport={{ once: true }}
                />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{details.description}</p>
        </motion.div>
    );
};

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 relative inline-block">
            {children}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
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

    const DetailCard: React.FC<{ person: PersonDetails, gender: 'Male' | 'Female' }> = ({ person, gender }) => (
        <div className="bg-gradient-to-br from-orange-200 via-yellow-100 to-orange-400 border border-gray-200 rounded-xl shadow-lg w-full text-center p-6">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-600 mb-1">{person.name}</h3>
            <p className="font-semibold text-slate-700 mb-4">{gender}</p>
            <div className="text-left space-y-2 text-sm">
            <div className="flex justify-between items-center border-b border-gray-200 pb-1">
            <span className="font-medium text-slate-500">Birth Details</span>
            <span className="text-slate-800 text-right">{formatDateTime(person.date_of_birth, person.time_of_birth)}</span>
            </div>
            <div className="flex justify-between items-center">
            <span className="font-medium text-slate-500">Birth Place</span>
            <span className="text-slate-800 text-right">{person.place_of_birth}</span>
            </div>
            </div>
            </div>
    );

    return (
        <div className="mb-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="w-full md:w-5/12">
                    <DetailCard person={groom} gender="Male" />
                </motion.div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}>
                    <Heart className="w-12 h-12 text-red-500" fill="currentColor" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="w-full md:w-5/12">
                    <DetailCard person={bride} gender="Female" />
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

    const kootaMap: { [key: string]: { name: string; icon: React.ReactNode } } = {
        varna: { name: "Ego & Work", icon: <BrainCircuit size={24} /> },
        vashya: { name: "Attraction", icon: <Magnet size={24} /> },
        tara: { name: "Destiny", icon: <Star size={24} /> },
        yoni: { name: "Intimacy", icon: <Zap size={24} /> },
        graha_maitri: { name: "Mental Match", icon: <MessageSquare size={24} /> },
        gana: { name: "Temperament", icon: <Shield size={24} /> },
        bhakoot: { name: "Emotional Bond", icon: <Users size={24} /> },
        nadi: { name: "Health", icon: <Dna size={24} /> }
    };

    const mangalStatus = reportData.mangal_dosha_analysis.is_compatible;

    return (
        <div className="bg-gradient-to-br from-white to-orange-50 text-slate-800 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex items-center text-sm text-slate-500 mb-6">
                        <a href="/kundli-match" className="hover:text-orange-600">Kundli Matching</a>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        <span className="font-semibold text-slate-700">Matching Report</span>
                    </div>
                </motion.div>

                {inputData && <MatchSummaryHeader inputData={inputData} />}

                <motion.div 
                    className="bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-2xl"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.3 } } }}
                >
                    <motion.header 
                        className="text-center mb-10"
                        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
                            Kundli Matching Report
                        </h1>
                    </motion.header>

                    <motion.section 
                        className="py-8 mb-12"
                        variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                    >
                        <SectionHeader>Final Compatibility Score</SectionHeader>
                         <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mt-6">
                            <ScoreGauge score={reportData.total_points_obtained} maxScore={reportData.maximum_points} />
                            
                            <p className="text-lg text-slate-700 text-center md:text-left">
                                {reportData.conclusion}
                            </p>
                        </div>
                         <div className="mt-10">
                            <WhatsAppCtaBanner phoneNumber={"918197503574"}/>
                            </div>

                    </motion.section>

                    {/* THEME CHANGE: Light theme for Mangal Dosha section */}
                    <motion.section 
                        className={`rounded-xl p-6 text-center mb-12 border ${mangalStatus ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    >
                        <div className={`flex items-center justify-center gap-3 text-2xl font-bold ${mangalStatus ? 'text-green-700' : 'text-red-700'}`}>
                            {mangalStatus ? <CheckCircle /> : <XCircle />}
                            <span>Mangal Dosha Analysis</span>
                        </div>
                        <p className={`mt-3 text-md max-w-3xl mx-auto ${mangalStatus ? 'text-green-800' : 'text-red-800'}`}>
                            {reportData.mangal_dosha_analysis.report}
                        </p>
                    </motion.section>

                    <motion.section variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                        <SectionHeader>Ashtakoota Breakdown</SectionHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(reportData.koota_details).map(([key, details]) => (
                                <KootaCard key={key} name={kootaMap[key]?.name || key} details={details} icon={kootaMap[key]?.icon || <Gem />} />
                            ))}
                        </div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );
}