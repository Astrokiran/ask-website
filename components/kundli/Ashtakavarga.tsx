"use client";

import React from 'react';

// --- CONSTANTS ---
const SIGN_NAMES = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
const PLANET_KEYS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

const ASHTAKAVARGA_INFO_CONTENT = [
    {
        title: "What is Ashtakavarga?",
        content: "Ashtakavarga is a unique system in Vedic astrology for evaluating a planet's strength. It assigns points (Bindus) to houses based on planetary positions, providing a nuanced score. 'Ashta' means eight, referring to the seven planets plus the Ascendant (Lagna) as points of reference.",
    },
    {
        title: "How It's Calculated & Used",
        content: "The system generates a Sarvashtakavarga (SAV) score for each house by totaling the benefic points given by the eight sources. This score indicates the house's overall strength and potential to deliver results.",
        listItems: [
            "A score <strong>above 30 Bindus</strong> is considered very strong, promising auspicious results.",
            "A score between <strong>25 and 30</strong> is good and indicates favorable conditions.",
            "A score <strong>below 25</strong> suggests weakness, pointing to potential challenges in that area of life."
        ]
    },
    {
        title: "Benefits in Predictions",
        content: "Astrologers use Ashtakavarga to make precise predictions and recommendations. It helps to:",
        listItems: [
            "<strong>Assess House Strength:</strong> Quickly identify which areas of life (career, wealth, relationships) are fortified or vulnerable.",
            "<strong>Time Events:</strong> Pinpoint favorable periods by analyzing planetary transits over high-scoring houses.",
            "<strong>Refine Judgements:</strong> Determine if a planet will act as a benefic or malefic in a specific chart, beyond its natural tendencies."
        ]
    }
];

// --- TYPES ---
interface AshtakavargaData {
    bhinna_ashtakavarga: { [key: string]: number[] };
    sarvashtakavarga: number[];
}

interface AshtakavargaAnalysisProps {
    /** The single, composite SVG string for all charts from the API. */
    compositeSvgString: string | null;
    /** The data for the Ashtakavarga table. */
    tableData: AshtakavargaData | null;
    /** A boolean to indicate if the chart data is being loaded. */
    isLoading?: boolean;
    renderForPdf?: boolean;
}

interface InfoCardProps {
    title: string;
    content: string;
    listItems?: string[];
}


// --- CHILD COMPONENT ---
const InfoCard: React.FC<InfoCardProps> = ({ title, content, listItems }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 space-y-2 sm:space-y-3 h-full">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{content}</p>
        {listItems && (
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 pl-1">
                {listItems.map((item, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
            </ul>
        )}
    </div>
);


// --- MAIN COMPONENT ---
const AshtakavargaAnalysis: React.FC<AshtakavargaAnalysisProps> = ({ compositeSvgString, tableData, isLoading = false, renderForPdf = false }) => {

    if (renderForPdf) {
        // Simple rendering for PDF generation
        return (
            <div>
                 {tableData && (
                    <div className="overflow-x-auto p-4 mb-8">
                        {/* Simplified table for PDF might be needed */}
                    </div>
                 )}
                 {compositeSvgString && <div dangerouslySetInnerHTML={{ __html: compositeSvgString }} />}
            </div>
        );
    }

    return (
        <div className="mt-4 sm:mt-6 p-4 sm:p-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8">
                Ashtakavarga Analysis
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column: Table and Charts */}
                <div className="space-y-6 sm:space-y-8">
                    {/* --- RESPONSIVE TABLE --- */}
                    {isLoading ? (
                        <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    ) : tableData ? (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 min-w-[600px]">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 min-w-[80px]">Rashi</th>
                                        {PLANET_KEYS.map(p => (
                                            <th key={p} scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider min-w-[50px] whitespace-nowrap">{p.slice(0, 2)}</th>
                                        ))}
                                        <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider min-w-[60px]">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {SIGN_NAMES.map((signName, index) => (
                                        <tr key={signName} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10 min-w-[80px]">{signName}</td>
                                            {PLANET_KEYS.map(planet => (
                                                <td key={`${planet}-${index}`} className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-400 min-w-[50px]">
                                                    {tableData.bhinna_ashtakavarga[planet]?.[index] ?? '-'}
                                                </td>
                                            ))}
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm text-center font-semibold text-blue-600 dark:text-blue-400 min-w-[60px]">
                                                {tableData.sarvashtakavarga?.[index] ?? '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                         <div className="text-gray-600 dark:text-gray-400 text-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">Table data not available.</div>
                    )}

                    {/* --- SVG CHARTS --- */}
                    {isLoading ? (
                        <div className="w-full h-[600px] md:h-[900px] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    ) : compositeSvgString ? (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                            <div
                                className="w-full max-w-4xl"
                                dangerouslySetInnerHTML={{ __html: compositeSvgString }}
                            />
                        </div>
                    ) : (
                        <div className="text-gray-600 dark:text-gray-400 text-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">Chart data not available.</div>
                    )}
                </div>

                {/* Right Column: Information Grid */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 content-start">
                    {ASHTAKAVARGA_INFO_CONTENT.map((info) => (
                        <InfoCard
                            key={info.title}
                            title={info.title}
                            content={info.content}
                            listItems={info.listItems}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AshtakavargaAnalysis;