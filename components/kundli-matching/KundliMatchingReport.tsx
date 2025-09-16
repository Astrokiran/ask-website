'use client';
import React, { useState, useEffect, useRef } from 'react';
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
    const [count, setCount] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            let start = 0;
            const increment = to / 20;
            const counter = setInterval(() => {
                start += increment;
                if (start >= to) {
                    setCount(to);
                    clearInterval(counter);
                } else {
                    setCount(start);
                }
            }, 50);
            return () => clearInterval(counter);
        }, 300);
        return () => clearTimeout(timer);
    }, [to]);

    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = count.toFixed(1);
        }
    }, [count]);

    return ref;
};

const ScoreGauge: React.FC<{ score: number; maxScore: number }> = ({ score, maxScore }) => {
    const percentage = (score / maxScore) * 100;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const animatedCounterRef = useAnimatedCounter(score);

    return (
        <div
            className="relative w-48 h-48 mx-auto md:mx-0 flex-shrink-0"
        >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" /> {/* Lighter blue */}
                        <stop offset="100%" stopColor="#2563eb" /> {/* Brighter blue */}
                    </linearGradient>
                </defs>
                <circle className="text-muted/30" strokeWidth="20" stroke="currentColor" fill="transparent" r={radius} cx="100" cy="100" />
                <circle
                    stroke="url(#scoreGradient)"
                    strokeWidth="20"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="100"
                    cy="100"
                    style={{
                        strokeDashoffset: circumference - (percentage / 100) * circumference,
                        transition: 'stroke-dashoffset 1.8s ease-out 0.3s'
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground">
                <span
                    ref={animatedCounterRef}
                    className="text-5xl font-extrabold"
                >
                    0.0
                </span>
                <span className="text-xl text-blue-600 dark:text-blue-400">/ {maxScore}</span>
            </div>
        </div>
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
            <div
                className="relative w-64 h-64 rounded-xl overflow-hidden border-4 border-blue-500/30 bg-muted/20 flex items-center justify-center shadow-lg"
            >
                    <img
                        key={currentIndex}
                        src={imageSources[currentIndex]}
                        alt="Kundli Matching"
                        className="absolute w-full h-full object-cover"
                    />
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                Symbolizing the harmony and compatibility between the couple.
            </p>
        </div>
    );
};


const KootaCard: React.FC<{ name: string; points: string; maxPoints: string; description: string; icon: React.ReactNode }> = ({ name, points, maxPoints, description, icon }) => (
    <div
        className="bg-card/90 backdrop-blur-md border border rounded-lg p-4 shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
    >
        <div className="flex flex-col items-center text-center">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 mb-2">{icon}</div>
            <h4 className="text-lg font-semibold text-foreground mb-1">{name}</h4>
            <div className="w-full bg-muted h-2 rounded-full mb-2 overflow-hidden">
                <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${(parseInt(points) / parseInt(maxPoints.replace('/',''))) * 100}%` }}
                />
            </div>
            <span className="text-md font-bold text-blue-600 dark:text-blue-400 mb-2">{points}</span>
            <p className="text-xs text-muted-foreground leading-tight">{description}</p>
        </div>
    </div>
);

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground relative inline-block">
            {children}
            <span
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" // Adjusted gradient for header underline
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
        <div
            className="bg-card border border rounded-2xl shadow-lg w-full text-center p-6"
        >
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 mb-2">{person.name}</h3> {/* Adjusted gradient for text */}
            <div className="text-left space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="font-medium text-blue-600 dark:text-blue-400">Birth Details</span>
                    <span className="text-foreground text-right">{formatDateTime(person.date_of_birth, person.time_of_birth)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-600 dark:text-blue-400">Birth Place</span>
                    <span className="text-foreground text-right">{person.place_of_birth}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="mb-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div
                    className="w-full md:w-5/12"
                >
                    <DetailCard person={groom} />
                </div>
                <div
                >
                    <Heart className="w-14 h-14 text-blue-500 dark:text-blue-400" fill="currentColor" />
                </div>
                <div
                    className="w-full md:w-5/12"
                >
                    <DetailCard person={bride} />
                </div>
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
        <div className="bg-background text-foreground min-h-screen p-4 sm:p-6 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                <div
                >
                    <div className="flex items-center text-sm text-muted-foreground mb-6">
                        <a href="/kundli-match" className="hover:text-blue-500 transition-colors">Kundli Matching</a>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        <span className="font-semibold text-foreground">Matching Report</span>
                    </div>
                </div>

                {inputData && <MatchSummaryHeader inputData={inputData} />}

                <div
                    className="bg-card/70 backdrop-blur-xl border border rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl"
                >
                    <header
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
                            Kundli Matching Report
                        </h1>
                    </header>

                    <section
                        className="py-8 mb-12"
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
                        <p 
                            className="mt-10 text-center text-lg font-medium text-foreground max-w-3xl mx-auto"
                        >
                            {reportData.conclusion}
                        </p>
                    </section>

                    <section
                        className={`rounded-2xl p-8 text-center mb-12 border bg-card ${mangalStatus ? 'border-emerald-500/30' : 'border-blue-500/30'}`}
                    >
                        <div className={`flex items-center justify-center gap-3 text-2xl font-bold ${mangalStatus ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                            {mangalStatus ? <CheckCircle /> : <XCircle />}
                            <span>Mangal Dosha Analysis</span>
                        </div>
                        <p className={`mt-4 text-md max-w-3xl mx-auto text-foreground`}>
                            {reportData.mangal_dosha_analysis.report}
                        </p>
                    </section>

                    <section
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
                    </section>
                </div>

                <div className="mt-8 space-y-6">
                    <DailyHoroscopeCta phoneNumber='918197503574' />
                </div>
            </div>
        </div>
    );
}
