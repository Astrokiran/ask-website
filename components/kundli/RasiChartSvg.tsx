"use client";

import React from "react";

// --- INTERFACES ---
export interface PlanetDetail {
  name: string;
  degree?: number;
}

// Data structure for the North Indian chart (house-based)
interface NorthIndianHouseData {
  planets: PlanetDetail[];
}
export type FormattedNorthIndianChartData = {
  [houseNum: string]: NorthIndianHouseData;
};

// Data structure for the South Indian chart (sign-based)
type FormattedSouthIndianChartData = {
    [signName: string]: PlanetDetail[];
};


export interface ChartPlanet {
  name: string;
  sign: string;
  degree?: number;
}

export interface RasiChartData {
  [houseNum: number]: string[];
  [houseNum: string]: string[];
}

// The 'layout' prop is now used to select the chart style
export interface RasiChartSVGProps {
  layout: "south" | "north";
  planets?: ChartPlanet[];
  lagnaSign: string;
  lagnaDegree?: number;
  title?: string;
  size?: number;
}

interface Point {
  x: number;
  y: number;
}

// --- CONSTANTS & HELPERS ---
const ZODIAC_SIGNS: string[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra',
  'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const PLANET_ABBREVIATIONS: { [key: string]: string } = {
  'Lagna': 'Asc', 'Ascendant': 'Asc', 'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma',
  'Mercury': 'Me', 'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
  'Rahu': 'Ra', 'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl'
};

const PLANET_COLORS: { [key: string]: string } = {
    'Asc': '#333333', 'Su': '#E67E22', 'Mo': '#2C3E50', 'Ma': '#E74C3C',
    'Me': '#27AE60', 'Ju': '#F1C40F', 'Ve': '#2ECC71', 'Sa': 'teal',
    'Ra': '#795548', 'Ke': '#9E9E9E', 'Ur': '#3498DB', 'Ne': '#34495E',
    'Pl': '#8E44AD', 'Default': '#424242'
};

const getPlanetText = (p: PlanetDetail): string => {
  const abbr = PLANET_ABBREVIATIONS[p.name] || p.name.substring(0, 2);
  if (p.degree !== undefined && !isNaN(p.degree)) {
    return `${abbr} ${p.degree.toFixed(2)}°`;
  }
  return abbr;
};

// --- DATA FORMATTERS (One for each chart type) ---

/**
 * Formats data for the North Indian chart (fixed houses, rotating signs).
 */
function formatNorthIndianData(
    planets: ChartPlanet[] = [],
    lagnaSign: string,
    lagnaDegree?: number
): FormattedNorthIndianChartData {
    const formattedData: FormattedNorthIndianChartData = {};
    const planetsBySign: { [key: string]: PlanetDetail[] } = {};

    ZODIAC_SIGNS.forEach(sign => { planetsBySign[sign] = []; });
    planets.forEach(p => { if (planetsBySign[p.sign]) planetsBySign[p.sign].push(p); });

    if (planetsBySign[lagnaSign]) {
        planetsBySign[lagnaSign].unshift({ name: 'Ascendant', degree: lagnaDegree });
    }

    const startSignIndex = ZODIAC_SIGNS.indexOf(lagnaSign);
    if (startSignIndex === -1) return {};

    for (let i = 0; i < 12; i++) {
        const houseNumber = i + 1;
        const signIndex = (startSignIndex + i) % 12;
        const currentSign = ZODIAC_SIGNS[signIndex];
        formattedData[houseNumber] = { planets: planetsBySign[currentSign] || [] };
    }
    return formattedData;
}

/**
 * Formats data for the South Indian chart (fixed signs, rotating houses).
 */
function formatSouthIndianData(
    planets: ChartPlanet[] = [],
    lagnaSign: string,
    lagnaDegree?: number
): FormattedSouthIndianChartData {
    const dataBySign: FormattedSouthIndianChartData = {};
    ZODIAC_SIGNS.forEach(sign => { dataBySign[sign] = []; });

    planets.forEach(p => { if (dataBySign[p.sign]) dataBySign[p.sign].push(p); });

    if (dataBySign[lagnaSign]) {
        dataBySign[lagnaSign].unshift({ name: 'Ascendant', degree: lagnaDegree });
    }
    return dataBySign;
}


// ==================================================================
//  --- SOUTH INDIAN CHART COMPONENT (SQUARE GRID) ---
// ==================================================================
const SouthIndianChart: React.FC<{
    dataBySign: FormattedSouthIndianChartData;
    lagnaSign: string;
    title: string;
    size: number;
}> = ({ dataBySign, lagnaSign, title, size }) => {
    const W = size;
    const H = size;
    const boxSize = W / 3;

    // Fixed positions for signs in a South Indian chart
    const signBoxPositions: { [key: string]: Point } = {
        'Aries':     { x: boxSize * 1.5, y: boxSize * 0.5 }, 'Taurus':  { x: boxSize * 0.5, y: boxSize * 0.5 },
        'Gemini':    { x: boxSize * 0.5, y: boxSize * 1.5 }, 'Cancer':    { x: boxSize * 0.5, y: boxSize * 2.5 },
        'Leo':       { x: boxSize * 1.5, y: boxSize * 2.5 }, 'Virgo':   { x: boxSize * 2.5, y: boxSize * 2.5 },
        'Pisces':    { x: W - boxSize * 2.5, y: H - boxSize * 2.5 }, 'Aquarius': { x: W - boxSize * 1.5, y: H - boxSize * 2.5 },
        'Capricorn': { x: W - boxSize * 0.5, y: H - boxSize * 2.5 }, 'Sagittarius': { x: W - boxSize * 0.5, y: H - boxSize * 1.5 },
        'Scorpio':   { x: W - boxSize * 0.5, y: H - boxSize * 0.5 }, 'Libra': { x: W - boxSize * 1.5, y: H - boxSize * 0.5 },
    };

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${W} ${H}`} fontFamily="sans-serif">
                <rect x="0" y="0" width={W} height={H} fill="#fdfbf3" />
                <rect x="0" y="0" width={W} height={H} fill="none" stroke="#d1c5b7" strokeWidth="2" />
                <path d={`M 0 ${boxSize} L ${W} ${boxSize}`} stroke="#d1c5b7" strokeWidth="1" />
                <path d={`M 0 ${boxSize*2} L ${W} ${boxSize*2}`} stroke="#d1c5b7" strokeWidth="1" />
                <path d={`M ${boxSize} 0 L ${boxSize} ${H}`} stroke="#d1c5b7" strokeWidth="1" />
                <path d={`M ${boxSize*2} 0 L ${boxSize*2} ${H}`} stroke="#d1c5b7" strokeWidth="1" />
                <path d={`M 0 0 L ${W} ${H}`} stroke="#d1c5b7" strokeWidth="1.5" />
                <path d={`M ${W} 0 L 0 ${H}`} stroke="#d1c5b7" strokeWidth="1.5" />

                {/* Highlight Lagna House */}
                {(() => {
                    const lagnaBox = signBoxPositions[lagnaSign];
                    if (!lagnaBox) return null;
                    const x1 = lagnaBox.x - boxSize/2; const y1 = lagnaBox.y - boxSize/2;
                    return <path d={`M ${x1 + 3} ${y1 + 3} L ${x1 + boxSize - 3} ${y1 + 3}`} stroke="#E74C3C" strokeWidth="1.5" />;
                })()}

                {Object.entries(signBoxPositions).map(([sign, center]) => {
                    const planets = dataBySign[sign] || [];
                    if (planets.length === 0) return null;
                    const lineHeight = 14;
                    const startY = center.y - (planets.length -1) * lineHeight / 2;
                    return (
                        <g key={`planets-in-${sign}`}>
                            {planets.map((p, pIndex) => (
                                <text key={p.name} x={center.x} y={startY + pIndex * lineHeight} textAnchor="middle" dominantBaseline="central" fontSize="11px" fill={PLANET_COLORS[PLANET_ABBREVIATIONS[p.name] || 'Default']}>
                                    {getPlanetText(p)}
                                </text>
                            ))}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// ==================================================================
//  --- NORTH INDIAN CHART COMPONENT (DIAMOND) ---
// ==================================================================
const NorthIndianChart: React.FC<{
    chartData: FormattedNorthIndianChartData;
    title: string;
    size: number;
}> = ({ chartData, title, size }) => {
    const W = size;
    const H = size;
    const C = { x: W / 2, y: H / 2 };

    const houseCenters: { [key: string]: Point } = {
        '1': { x: W * 0.5, y: H * 0.25 },   '2': { x: W * 0.25, y: H * 0.25 }, '3': { x: W * 0.25, y: H * 0.5 },   '4': { x: W * 0.25, y: H * 0.75 },
        '5': { x: W * 0.5, y: H * 0.75 },   '6': { x: W * 0.75, y: H * 0.75 }, '7': { x: W * 0.75, y: H * 0.5 },   '8': { x: W * 0.75, y: H * 0.25 },
        '9': { x: W * 0.625, y: H * 0.375 }, '10': { x: W * 0.625, y: H * 0.625 }, '11': { x: W * 0.375, y: H * 0.625 }, '12': { x: W * 0.375, y: H * 0.375 },
    };

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${W} ${H}`} fontFamily="sans-serif">
                <rect x="0" y="0" width={W} height={H} fill="#fdfbf3" />
                <rect x="0" y="0" width={W} height={H} fill="none" stroke="#d1c5b7" strokeWidth="1" />
                <path d={`M 0 0 L ${W} ${H}`} stroke="#d1c5b7" strokeWidth="1.5" />
                <path d={`M ${W} 0 L 0 ${H}`} stroke="#d1c5b7" strokeWidth="1.5" />
                <path d={`M ${C.x} 0 L ${W} ${C.y} L ${C.x} ${H} L 0 ${C.y} Z`} stroke="#d1c5b7" strokeWidth="1.5" fill="none" />

                {Object.entries(chartData).map(([houseNum, houseInfo]) => {
                    const center = houseCenters[houseNum];
                    const planets = houseInfo.planets;
                    if (!center || !planets || planets.length === 0) return null;
                    const lineHeight = 14;
                    const startY = center.y - (planets.length - 1) * lineHeight / 2;
                    return (
                        <g key={`planets-in-${houseNum}`}>
                            {planets.map((p, pIndex) => (
                                <text key={p.name} x={center.x} y={startY + pIndex * lineHeight} textAnchor="middle" dominantBaseline="central" fontSize="11px" fill={PLANET_COLORS[PLANET_ABBREVIATIONS[p.name] || 'Default']}>
                                    {getPlanetText(p)}
                                </text>
                            ))}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// ==================================================================
// --- WRAPPER COMPONENT (with layout switching) ---
// ==================================================================
export const RasiChartSVG: React.FC<RasiChartSVGProps> = (props) => {
  const {
    layout, planets = [], lagnaSign, lagnaDegree,
    title = "", // Title is now handled by the parent
    size = 400,
  } = props;

  if (layout === 'south') {
      const dataBySign = formatSouthIndianData(planets, lagnaSign, lagnaDegree);
      return <SouthIndianChart dataBySign={dataBySign} lagnaSign={lagnaSign} title={title} size={size} />;
  }

  // Default to North Indian Chart
  const chartData = formatNorthIndianData(planets, lagnaSign, lagnaDegree);
  return <NorthIndianChart chartData={chartData} title={title} size={size} />;
};

export default RasiChartSVG;