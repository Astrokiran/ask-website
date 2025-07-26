// components/kundli-matching/KundliMatchingReport.tsx

'use client';

import React, { useState, useEffect } from 'react';
// FINAL FIX: Replaced the non-existent icon with 'Gem', which is a valid Lucide icon.
import { ChevronRight, Download, CheckCircle, XCircle, User, Heart, Gem } from 'lucide-react';

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

// Interface for the input data from the form
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

// --- HELPER COMPONENTS ---

const ScoreGauge: React.FC<{ score: number; maxScore: number }> = ({ score, maxScore }) => {
    const percentage = (score / maxScore) * 100;
    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-56 h-56 mx-auto mb-5">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle className="text-gray-200" strokeWidth="20" stroke="currentColor" fill="transparent" r={radius} cx="100" cy="100" />
                <circle
                    className="text-orange-500"
                    strokeWidth="20"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="100"
                    cy="100"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-gray-800">{score.toFixed(1)}</span>
                <span className="text-xl text-gray-500">/ {maxScore}</span>
            </div>
        </div>
    );
};

const KootaCard: React.FC<{ name: string; details: KootaDetail }> = ({ name, details }) => {
    const { obtained_points, max_points, description } = details;
    const percentage = max_points > 0 ? (obtained_points / max_points) * 100 : 0;
    const scoreColor = percentage < 50 ? 'text-red-600' : 'text-green-600';
    const progressColor = percentage < 50 ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-bold text-gray-800">{name}</h4>
                <span className={`text-lg font-bold ${scoreColor}`}>{obtained_points} / {max_points}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                <div className={`${progressColor} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
};

// --- SUMMARY HEADER COMPONENT ---
const MatchSummaryHeader: React.FC<{ inputData: InputData }> = ({ inputData }) => {
    const { groom, bride } = inputData;
    
    const formatDateTime = (dateStr: string, timeStr: string) => {
        const [day, month, year] = dateStr.split('/');
        if (!day || !month || !year) return dateStr;
        const date = new Date(`${year}-${month}-${day}`);
        const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        return `${formattedDate} | ${timeStr}`;
    };

    return (
        <div className="mb-10">
            <div className="flex items-center justify-center space-x-4 mb-8">
                <span className="font-bold text-xl text-gray-800 bg-orange-100 border border-orange-300 rounded-md px-4 py-1">{groom.name}</span>
                <div className="relative flex items-center -space-x-4">
                     {/* FIX: Using the correct <Gem /> component twice */}
                    <Gem className="w-12 h-12 text-orange-500" />
                    <Gem className="w-12 h-12 text-orange-500" />
                    <Heart className="w-6 h-6 text-red-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="currentColor" />
                </div>
                <span className="font-bold text-xl text-gray-800 bg-orange-100 border border-orange-300 rounded-md px-4 py-1">{bride.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Groom's Details */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-orange-400 text-gray-800 p-3 flex items-center font-bold">
                        <User className="w-5 h-5 mr-2" />
                        Basic Details
                        <span className="ml-auto text-sm bg-gray-800 text-white rounded-full px-3 py-0.5">Male</span>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-gray-600">Name</span>
                            <span className="text-gray-800">{groom.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-gray-600">Birth Date & Time</span>
                            <span className="text-gray-800 text-right">{formatDateTime(groom.date_of_birth, groom.time_of_birth)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Birth Place</span>
                            <span className="text-gray-800 text-right">{groom.place_of_birth}</span>
                        </div>
                    </div>
                </div>

                {/* Bride's Details */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-orange-400 text-gray-800 p-3 flex items-center font-bold">
                        <User className="w-5 h-5 mr-2" />
                        Basic Details
                        <span className="ml-auto text-sm bg-gray-800 text-white rounded-full px-3 py-0.5">Female</span>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-gray-600">Name</span>
                            <span className="text-gray-800">{bride.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold text-gray-600">Birth Date & Time</span>
                            <span className="text-gray-800 text-right">{formatDateTime(bride.date_of_birth, bride.time_of_birth)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-600">Birth Place</span>
                            <span className="text-gray-800 text-right">{bride.place_of_birth}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Report Display Component ---
export function MatchingResults({ data: reportData }: { data: KundliMatchingData }) {
    const [isProcessingPdf, setIsProcessingPdf] = useState(false);
    const [inputData, setInputData] = useState<InputData | null>(null);

    useEffect(() => {
        const storedInput = sessionStorage.getItem('kundliMatchingApiInput');
        if (storedInput) {
            setInputData(JSON.parse(storedInput));
        }
    }, []);
    
    const generateMatchingReportPdf = async (reportData: KundliMatchingData) => {
        setIsProcessingPdf(true);
        console.log("Generating PDF for matching report:", reportData);
        alert("PDF download for matching reports is a work in progress!");
        setIsProcessingPdf(false);
    };

    const kootaNames: { [key: string]: string } = {
        varna: "🧠 Ego & Work Compatibility", vashya: "🤝 Mutual Attraction", tara: "❤️‍🩹 Destiny & Well-being",
        yoni: "🔥 Physical Intimacy", graha_maitri: "💬 Mental Compatibility", gana: "🎭 Core Temperament",
        bhakoot: "💞 Emotional Connection", nadi: "🧬 Health & Genetics"
    };

    const mangalStatus = reportData.mangal_dosha_analysis.is_compatible;

    return (
        <div className="bg-orange-50/50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                            <a href="/kundli-match" className="hover:text-orange-600">Kundli Matching</a>
                            <ChevronRight className="h-4 w-4 mx-1" />
                            <span className="font-semibold text-gray-700">Matching Report</span>
                        </div>
                    </div>
                    
                </div>
                
                {inputData && <MatchSummaryHeader inputData={inputData} />}

                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-12">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                            Kundli Matching Report
                        </h1>
                    </header>
                    <section className="text-center py-8 mb-8 border-y border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Compatibility Score</h2>
                        <ScoreGauge score={reportData.total_points_obtained} maxScore={reportData.maximum_points} />
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-4">
                            {reportData.conclusion}
                        </p>
                    </section>
                    <section className={`rounded-lg p-6 text-center mb-12 ${mangalStatus ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                        <div className={`flex items-center justify-center gap-3 text-2xl font-bold ${mangalStatus ? 'text-green-700' : 'text-red-700'}`}>
                            {mangalStatus ? <CheckCircle /> : <XCircle />}
                            <span>Mangal Dosha Analysis</span>
                        </div>
                        <p className={`mt-2 text-md ${mangalStatus ? 'text-green-800' : 'text-red-800'}`}>
                            {reportData.mangal_dosha_analysis.report}
                        </p>
                    </section>
                    <section>
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Compatibility Breakdown</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(reportData.koota_details).map(([key, details]) => (
                                <KootaCard key={key} name={kootaNames[key] || key} details={details} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}