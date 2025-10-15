"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';

// --- CONSTANTS ---
const SIGN_NAMES = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
const PLANET_KEYS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

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
    const { t } = useTranslation();

    // Get translated info card content
    const getInfoCardContent = () => {
        return [
            {
                title: t('ashtakavarga.infoCards.whatIsAshtakavarga.title'),
                content: t('ashtakavarga.infoCards.whatIsAshtakavarga.content'),
            },
            {
                title: t('ashtakavarga.infoCards.howCalculated.title'),
                content: t('ashtakavarga.infoCards.howCalculated.content'),
                listItems: t('ashtakavarga.infoCards.howCalculated.listItems', { returnObjects: true }) as string[],
            },
            {
                title: t('ashtakavarga.infoCards.benefitsInPredictions.title'),
                content: t('ashtakavarga.infoCards.benefitsInPredictions.content'),
                listItems: t('ashtakavarga.infoCards.benefitsInPredictions.listItems', { returnObjects: true }) as string[],
            }
        ];
    };

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
                {t('ashtakavarga.title')}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column: Table and Charts */}
                <div className="space-y-6 sm:space-y-8">
                    {/* --- RESPONSIVE TABLE --- */}
                    {isLoading ? (
                        <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    ) : tableData ? (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse min-w-[700px]">
                                <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-1 sm:px-3 py-3 text-left font-medium whitespace-nowrap sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 w-[80px]">{t('ashtakavarga.rashi')}</th>
                                        {PLANET_KEYS.map(p => (
                                            <th key={p} scope="col" className="px-1 sm:px-2 py-3 text-center font-medium whitespace-nowrap w-[45px]">
                                                {t(`ashtakavarga.${p.toLowerCase()}`)}
                                            </th>
                                        ))}
                                        <th scope="col" className="px-1 sm:px-3 py-3 text-center font-medium whitespace-nowrap w-[55px]">{t('ashtakavarga.total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800">
                                    {SIGN_NAMES.map((signName, index) => (
                                        <tr key={signName} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-1 sm:px-3 py-3 whitespace-nowrap font-medium text-orange-600 dark:text-orange-400 sticky left-0 bg-white dark:bg-gray-800 z-10 w-[80px] text-xs sm:text-sm">
                                                {t(`ashtakavarga.signs.${signName}`)}
                                            </td>
                                            {PLANET_KEYS.map(planet => (
                                                <td key={`${planet}-${index}`} className="px-1 sm:px-2 py-3 whitespace-nowrap text-center text-gray-900 dark:text-white w-[45px] text-xs sm:text-sm">
                                                    {tableData.bhinna_ashtakavarga[planet]?.[index] ?? '-'}
                                                </td>
                                            ))}
                                            <td className="px-1 sm:px-3 py-3 whitespace-nowrap text-center font-semibold text-orange-600 dark:text-orange-400 w-[55px] text-xs sm:text-sm">
                                                {tableData.sarvashtakavarga?.[index] ?? '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                         <div className="text-gray-600 dark:text-gray-400 text-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                            {t('ashtakavarga.tableNotAvailable')}
                        </div>
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
                        <div className="text-gray-600 dark:text-gray-400 text-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                            {t('ashtakavarga.chartNotAvailable')}
                        </div>
                    )}
                </div>

                {/* Right Column: Information Grid */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 content-start">
                    {getInfoCardContent().map((info) => (
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
