import React from 'react';

/**
 * Interface for a single detected yoga.
 */
interface YogaDetail {
  name: string;
  description: string;
  strength: "Weak" | "Moderate" | "Strong";
  planets_involved: string[];
  houses_involved: number[];
  significance: string;
  effects: string[];
}

/**
 * Interface for the summary of yogas.
 */
interface YogaSummary {
  total_yogas: number;
  strong_yogas: string[];
  moderate_yogas: string[];
  weak_yogas: string[];
  most_significant: string;
}

/**
 * Interface for the entire API response containing detected yogas and their summary.
 */
interface KundliData {
  detected_yogas: YogaDetail[];
  yoga_summary: YogaSummary;
}

interface YogasDetailsProps {
  kundliData: KundliData | null;
}

const YogasDetails: React.FC<YogasDetailsProps> = ({ kundliData }) => {
  if (!kundliData) {
    return (
      <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg shadow-md">
        <p className="text-gray-600 text-lg">No yoga data available to display.</p>
      </div>
    );
  }

  const { detected_yogas, yoga_summary } = kundliData;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Strong':
        return 'text-green-600';
      case 'Moderate':
        return 'text-yellow-600';
      case 'Weak':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStrengthRingColor = (strength: string) => {
    switch (strength) {
      case 'Strong':
        return 'ring-green-500';
      case 'Moderate':
        return 'ring-yellow-500';
      case 'Weak':
        return 'ring-red-500';
      default:
        return 'ring-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen font-sans">
      <div className="mb-8">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
          Astrological Yogas Analysis
        </h3>
        <p className="mt-2 text-md text-gray-600">
          An analysis of the significant yogas (planetary combinations) in your kundli that influence various aspects of your life.
        </p>
      </div>
      
      {detected_yogas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {detected_yogas.map((yoga, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-indigo-400 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl md:text-2xl font-bold text-gray-900">
                    {yoga.name}
                  </h4>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ring-2 ${getStrengthRingColor(yoga.strength)} ${getStrengthColor(yoga.strength)}`}>
                    {yoga.strength}
                  </span>
              </div>
              <p className="text-gray-600 mb-4 italic">"{yoga.description}"</p>

              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <span className="font-semibold text-gray-800">Significance: </span>
                  <span>{yoga.significance}</span>
                </div>

                {yoga.planets_involved && yoga.planets_involved.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-800">Planets Involved: </span>
                    <span>{yoga.planets_involved.join(', ')}</span>
                  </div>
                )}

                {yoga.houses_involved && yoga.houses_involved.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-800">Houses Involved: </span>
                    <span>{yoga.houses_involved.join(', ')}</span>
                  </div>
                )}
              </div>

              {yoga.effects && yoga.effects.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Effects:</h5>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    {yoga.effects.map((effect, effectIndex) => (
                      <li key={effectIndex}>{effect}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-32 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No detailed yogas to display.</p>
        </div>
      )}

      {/* Yoga Summary Section */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-12 border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Yoga Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <div className="mr-4">
              <p className="text-3xl font-bold text-indigo-600">{yoga_summary.total_yogas}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Total Yogas Detected</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <div className="mr-4">
               <p className="text-xl font-bold text-purple-600">{yoga_summary.most_significant || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Most Significant Yoga</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-700 mb-2">Strong Yogas:</p>
            <p className="text-green-700 font-medium">{yoga_summary.strong_yogas.length > 0 ? yoga_summary.strong_yogas.join(', ') : 'None'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-700 mb-2">Moderate Yogas:</p>
            <p className="text-yellow-700 font-medium">{yoga_summary.moderate_yogas.length > 0 ? yoga_summary.moderate_yogas.join(', ') : 'None'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <p className="font-semibold text-gray-700 mb-2">Weak Yogas:</p>
            <p className="text-red-700 font-medium">{yoga_summary.weak_yogas.length > 0 ? yoga_summary.weak_yogas.join(', ') : 'None'}</p>
          </div>
        </div>
      </div>

      {/* Detected Yogas Details Section */}
      
    </div>
  );
};

export default YogasDetails;