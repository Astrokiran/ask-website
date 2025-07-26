import React from 'react';

// --- INTERFACES ---

interface PlanetPosition {
  sign: string;
  degree: number;
  original_sign: string;
  original_degree: number;
  [key: string]: any;
}

interface PlanetDetail {
  name: string;
  degree?: number;
}

type ChartData = { [key: string]: string[] };
type FormattedChartData = { [key: string]: PlanetDetail[] };

interface KundliData {
  rasi_chart_svg: string | null;
  navamsa_chart_svg: string | null;
  navamsa_positions: { [planet: string]: PlanetPosition } | null;
  major_varga_charts: { [key: string]: ChartData } | null; // This might still hold raw data if needed for analysis
  major_varga_charts_svg: string | null; // ADDED: New field for the combined SVG string
  [key: string]: any;
}

interface ChartDetailsProps {
  kundliData: KundliData;
}


// --- DATA HELPERS & CONSTANTS ---

const ZODIAC_SIGNS: string[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra',
  'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const PLANET_ABBREVIATIONS: { [key: string]: string } = {
  'Lagna': 'Asc', 'Ascendant': 'Asc', 'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma',
  'Mercury': 'Me', 'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
  'Rahu': 'Ra', 'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne',
  'Pluto': 'Pl', 'Navamsa Lagna': 'Asc'
};

const PLANET_COLORS: { [key: string]: string } = {
  'Asc': '#000000', 'Su': '#ff6f00', 'Mo': '#333333', 'Ma': '#e53935',
  'Me': '#43a047', 'Ju': '#fdd835', 'Ve': '#9c27b0', 'Sa': '#1e88e5',
  'Ra': '#5d4037', 'Ke': '#757575', 'Ur': '#00acc1', 'Ne': '#303f9f',
  'Pl': '#6a1b9a', 'Default': '#424242'
};


// These formatting functions might become redundant if Rasi/Navamsa are always pre-generated SVG
// But keeping them for now in case major_varga_charts (other D-charts) still use this logic
const formatChartWithDegrees = (
  chart: ChartData,
  positions: { [key: string]: PlanetPosition } | null,
  chartType: 'rasi' | 'navamsa'
): FormattedChartData => {
  const formattedData: FormattedChartData = {};
  for (const house in chart) {
    if (Array.isArray(chart[house])) { // Ensure it's an array of planet names
      formattedData[house] = (chart[house] as string[]).map(planetName => {
        const positionInfo = positions ? positions[planetName] : null;
        let degree: number | undefined;
        if (planetName.toLowerCase().includes('lagna')) {
          const house1Planets = chart['1'];
          const refPlanet = house1Planets && Array.isArray(house1Planets) 
                            ? house1Planets.find(p => positions && positions[p]) : undefined;
          degree = refPlanet && positions ? (chartType === 'rasi' ? positions[refPlanet].original_degree : positions[refPlanet].degree) : undefined;
        } else if (positionInfo) {
          degree = chartType === 'rasi' ? positionInfo.original_degree : positionInfo.degree;
        }
        return { name: planetName, degree };
      });
    }
  }
  return formattedData;
};

const formatVargaChart = (signData: ChartData, lagnaSign: string): FormattedChartData => {
  const houseData: FormattedChartData = {};
  const startIndex = ZODIAC_SIGNS.indexOf(lagnaSign);
  if (startIndex === -1) return {};
  for (let i = 0; i < 12; i++) {
    const houseNumber = (i + 1).toString();
    const signIndex = (startIndex + i) % 12;
    const signName = ZODIAC_SIGNS[signIndex];
    houseData[houseNumber] = (signData[signName] || []).map(name => ({ name }));
  }
  return houseData;
};


// --- SVG CHART COMPONENT (NorthIndianSVGChart - assuming this is ONLY for North Indian charts now) ---
// This component should not be used for South Indian charts (Rasi, Navamsa, Varga charts from backend)
interface NorthIndianSVGChartProps {
  chartData: FormattedChartData;
  title: string;
  width?: number;
  height?: number;
}

const NorthIndianSVGChart: React.FC<NorthIndianSVGChartProps> = ({
  chartData,
  title,
  width = 300,
  height = 300
}) => {
  const W = width;
  const H = height;
  const C = { x: W / 2, y: H / 2 };

  // Coordinates for house numbers
  const houseNumberCoords = {
    '1': { x: C.x, y: C.y - 35 },
    '2': { x: C.x - 25, y: C.y - 15 },
    '3': { x: C.x - 25, y: C.y + 15 },
    '4': { x: C.x / 2, y: C.y },
    '5': { x: C.x - 15, y: C.y + 25 },
    '6': { x: C.x + 15, y: C.y + 25 },
    '7': { x: C.x, y: C.y + 35 },
    '8': { x: C.x + 25, y: C.y + 15 },
    '9': { x: C.x + 25, y: C.y - 15 },
    '10': { x: C.x * 1.5, y: C.y },
    '11': { x: C.x + 15, y: C.y - 25 },
    '12': { x: C.x - 15, y: C.y - 25 },
  };
    
  // Coordinates for the block of planet text in each house
  const planetTextCoords = {
      '1': { x: C.x, y: C.y / 2 }, '2': { x: C.x / 4, y: C.y / 2 }, '3': { x: C.x / 4, y: C.y },
      '4': { x: C.x / 2, y: C.y + C.y / 2 }, '5': { x: C.x, y: C.y + C.y / 2 }, '6': { x: C.x + C.x / 2, y: C.y + C.y/2 },
      '7': { x: C.x * 1.5, y: C.y }, '8': { x: C.x * 1.5, y: C.y / 2 }, '9': { x: C.x * 1.5, y: C.y / 4 },
      '10': { x: C.x + (C.x/2), y: C.y }, '11': { x: C.x / 2, y: C.y / 4 }, '12': { x: C.x / 4, y: C.y }
  };

  const getPlanetText = (p: PlanetDetail): string => {
    const abbr = PLANET_ABBREVIATIONS[p.name] || p.name.substring(0, 2);
    if (p.degree !== undefined) {
      return `${abbr}-${p.degree.toFixed(2)}°`;
    }
    return abbr;
  };
    
  return (
    <div className="flex flex-col items-center">
        <h4 className="text-xl font-semibold mb-2 text-gray-700">{title}</h4>
        <svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
            {/* Background */}
            <rect x="0" y="0" width={W} height={H} fill="#FFFDF6" />

            {/* Outer square border and darker line color */}
            <rect x="0" y="0" width={W} height={H} fill="none" stroke="#333333" strokeWidth="1.5" />
            <path d={`M 0 0 L ${W} ${H}`} stroke="#333333" strokeWidth="1.5" />
            <path d={`M ${W} 0 L 0 ${H}`} stroke="#333333" strokeWidth="1.5" />
            <path d={`M ${C.x} 0 L ${W} ${C.y} L ${C.x} ${H} L 0 ${C.y} Z`} stroke="#333333" strokeWidth="1.5" fill="none" />
            
            {/* House Numbers */}
            {Object.entries(houseNumberCoords).map(([houseNum, { x, y }]) => (
                <text key={`num-${houseNum}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#9E9E9E">
                    {houseNum}
                </text>
            ))}

            {/* Planets */}
            {Object.entries(chartData).map(([house, planets]) => {
                if (!planets || planets.length === 0) return null;
                const { x, y } = planetTextCoords[house as keyof typeof planetTextCoords];
                const startY = y - ((planets.length - 1) * 14) / 2;

                return (
                    <text key={`planets-${house}`} textAnchor="middle" fontSize="12" fontFamily="sans-serif">
                        {planets.map((p, index) => (
                            <tspan key={p.name} x={x} y={startY + index * 14} fill={PLANET_COLORS[PLANET_ABBREVIATIONS[p.name] || 'Default']}>
                                {getPlanetText(p)}
                            </tspan>
                        ))}
                    </text>
                );
            })}
        </svg>
    </div>
  );
};


// --- MAIN COMPONENT ---

const ChartDetails: React.FC<ChartDetailsProps> = ({ kundliData }) => {
  const {
    rasi_chart_svg,
    navamsa_chart_svg,
    // navamsa_positions, // No longer directly used for rendering the SVG charts here
    // major_varga_charts, // No longer directly used for rendering the SVG charts here
    major_varga_charts_svg, // ADDED: The combined SVG string for other charts
  } = kundliData;

  // The formatting functions and NorthIndianSVGChart are only used if you have other D-charts
  // that are still being processed as raw data in the frontend.
  // Based on your current setup, it seems Rasi/Navamsa are always SVG, and
  // major_varga_charts_svg is for the rest.
  // Therefore, the below formatting calls become redundant IF all charts are backend-generated SVGs.
  // If you still have *other* types of charts (e.g., specific North Indian charts) that
  // use these formatting functions, keep them. Otherwise, they can be removed.

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-3">
        Astrological Charts
      </h2>
      
      {/* Main Charts: Rasi (D1) and Navamsa (D9) - Directly injecting SVG string */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {rasi_chart_svg ? (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
            <h4 className="text-xl font-semibold mb-2 text-gray-700">Rasi Chart (D1)</h4>
            {/* DANGER: Using dangerouslySetInnerHTML. Ensure SVG is sanitized if from untrusted source */}
            <div dangerouslySetInnerHTML={{ __html: rasi_chart_svg }} />
          </div>
        ) : null}
        
        {navamsa_chart_svg ? (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
            <h4 className="text-xl font-semibold mb-2 text-gray-700">Navamsa Chart (D9)</h4>
            {/* DANGER: Using dangerouslySetInnerHTML. Ensure SVG is sanitized if from untrusted source */}
            <div dangerouslySetInnerHTML={{ __html: navamsa_chart_svg }} />
          </div>
        ) : null}
      </div>

      {/* Divisional Charts (Hora, Drekkana, etc.) - Displaying the single combined SVG grid */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Divisional (Varga) Charts
        </h3>
        {major_varga_charts_svg ? (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
            {/* No individual titles needed here, as the backend SVG already includes them */}
            {/* DANGER: Using dangerouslySetInnerHTML. Ensure SVG is sanitized if from untrusted source */}
            <div dangerouslySetInnerHTML={{ __html: major_varga_charts_svg }} />
          </div>
        ) : (
          <p className="text-center text-gray-600">No other Varga Charts available.</p>
        )}
      </div>

      {/* If you have any remaining North Indian charts that are NOT part of major_varga_charts_svg
          and still require `major_varga_charts` (raw data) to be processed on the frontend,
          you would uncomment and adjust this section.
          Based on your goal, this section is likely no longer needed for rendering charts.
          It might be needed for displaying other textual analysis data.
      */}
      {/*
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Other (Frontend Generated) Divisional Charts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kundliData.major_varga_charts &&
            Object.entries(kundliData.major_varga_charts)
              .filter(([name]) => !name.includes('Navamsa (D9)') && !name.includes('Rasi (D1)')) // Filter out Rasi/Navamsa too
              .map(([vargaName, signData]) => {
                const houseData = formatVargaChart(signData, 'Aries'); // Assuming 'Aries' as a placeholder lagna
                return (
                  <div key={vargaName} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                    <NorthIndianSVGChart chartData={houseData} title={vargaName} />
                  </div>
                );
              })}
        </div>
      </div>
      */}

    </div>
  );
};

export default ChartDetails;