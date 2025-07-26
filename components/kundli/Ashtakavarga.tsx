"use client";

import React, { useMemo } from 'react';

// --- CONSTANTS ---
// Informational content for the right-side cards.
const ASHTAKAVARGA_INFO_CONTENT = [
  {
    emoji: "🪐",
    title: "What is Ashtakavarga?",
    content: "Ashtakavarga is a unique system in Vedic astrology for evaluating a planet's strength. It assigns points (Bindus) to houses based on planetary positions, providing a nuanced score. 'Ashta' means eight, referring to the seven planets plus the Ascendant (Lagna) as points of reference.",
  },
  {
    emoji: "💡",
    title: "How It's Calculated & Used",
    content: "The system generates a Sarvashtakavarga (SAV) score for each house by totaling the benefic points given by the eight sources. This score indicates the house's overall strength and potential to deliver results.",
    listItems: [
      "A score <strong>above 30 Bindus</strong> is considered very strong, promising auspicious results.",
      "A score between <strong>25 and 30</strong> is good and indicates favorable conditions.",
      "A score <strong>below 25</strong> suggests weakness, pointing to potential challenges in that area of life."
    ]
  },
  {
    emoji: "🎯",
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
interface AshtakavargaAnalysisProps {
  /** The single, composite SVG string for all charts from the API. */
  compositeSvgString: string | null;
  /** A boolean to indicate if the chart data is being loaded. */
  isLoading?: boolean;
  renderForPdf?: boolean;
}

interface InfoCardProps {
  emoji: string;
  title: string;
  content: string;
  listItems?: string[];
}

// --- CHILD COMPONENTS ---
/**
 * A card component to display a piece of information.
 */
const InfoCard: React.FC<InfoCardProps> = ({ emoji, title, content, listItems }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-3 h-full">
    <h3 className="text-xl font-bold text-gray-800">
      <span className="mr-2">{emoji}</span> {title}
    </h3>
    <p className="text-gray-600">{content}</p>
    {listItems && (
      <ul className="list-disc list-inside text-gray-600 space-y-1 pl-1">
        {listItems.map((item, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    )}
  </div>
);


// --- MAIN COMPONENT ---
/**
 * Renders a responsive Ashtakavarga chart from a single composite SVG string,
 * alongside informational cards.
 */
const AshtakavargaAnalysis: React.FC<AshtakavargaAnalysisProps> = ({ compositeSvgString, isLoading = false,renderForPdf = false }) => {
  
  // This hook processes the SVG string to make it responsive.
  // It runs only when the compositeSvgString prop changes.
  const processedSvg = useMemo(() => {
    if (!compositeSvgString) {
      return null;
    }
    // This makes the SVG scalable by:
    // 1. Removing the fixed width and height attributes.
    // 2. Adding a viewBox attribute based on the original dimensions.
    return compositeSvgString
      .replace(/width="\d+"/, '')
      .replace(/height="\d+"/, '')
      .replace('<svg', '<svg viewBox="0 0 460 980"');
  }, [compositeSvgString]);

   if (renderForPdf) {
    return processedSvg ? <div dangerouslySetInnerHTML={{ __html: processedSvg }} /> : null;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Ashtakavarga Analysis
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: A single container for the composite SVG */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex justify-center items-center">
            {isLoading ? (
              <div className="w-full max-w-md h-[500px] bg-gray-200 rounded-md animate-pulse" />
            ) : processedSvg ? (
              <div
                className="w-full max-w-md" // Constrains width for a better look on large screens
                dangerouslySetInnerHTML={{ __html: processedSvg }}
              />
            ) : (
              <div className="text-gray-500 text-center py-20">
                Chart data is not available.
              </div>
            )}
          </div>

          {/* Right Column: Information Grid */}
          <div className="grid grid-cols-1 gap-6 content-start">
            {ASHTAKAVARGA_INFO_CONTENT.map((info) => (
              <InfoCard
                key={info.title}
                emoji={info.emoji}
                title={info.title}
                content={info.content}
                listItems={info.listItems}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AshtakavargaAnalysis;