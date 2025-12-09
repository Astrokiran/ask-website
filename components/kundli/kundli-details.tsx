"use client";

import React, { useMemo, useState, useCallback } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import RasiChartSVG from "./RasiChartSvg"; // Correctly named import
import type { ChartPlanet, RasiChartData } from "./RasiChartSvg"; // Import types if needed
import { useTranslation } from 'react-i18next';


/* ------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------ */
interface ApiPlanetDataItem {
  id?: number;
  name: string;
  fullDegree?: string;
  normDegree?: number;
  speed?: number;
  isRetro: string;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  nakshatra_pad?: number;
  house?: number;
  is_planet_set?: boolean;
  planet_awastha: string;
  status?: string;
}

interface ApiAntarSubPeriod {
  planet: string;
  start_date: string;
  end_date: string;
  duration_years: number;
}

interface ApiMahadashaDataItem {
  planet_id?: number;
  planet: string;
  start: string;
  end: string;
  sub_periods?: ApiAntarSubPeriod[];
}

interface KundliData {
  planets?: ApiPlanetDataItem[] | null;
  rasiChartData?: RasiChartData;
  dasha?: ApiMahadashaDataItem[] | null;
  lagna?: { sign: string; degree: number };
  lagna_degree?: number | null;
  rasi_chart_svg?: string;
  navamsa_chart_svg?: string;
}

interface KundliTabContentProps {
  kundliData: KundliData;
}

/* ------------------------------------------------------------------
 * Utils
 * ------------------------------------------------------------------ */
const shortPlanet = (name: string): string => {
  const n = name.toLowerCase();
  switch (n) {
    case "sun": return "Su";
    case "moon": return "Mo";
    case "mars": return "Ma";
    case "mercury": return "Me";
    case "jupiter": return "Ju";
    case "venus": return "Ve";
    case "saturn": return "Sa";
    case "rahu": return "Ra";
    case "ketu": return "Ke";
    case "lagna":
    case "asc":
    case "ascendant": return "Asc";
    default: return name.slice(0, 2);
  }
};

function formatDate(d: string | undefined | null, { birthLabel = false } = {}): string {
  if (birthLabel && !d) return "Birth";
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/ /g, "-");
}

function buildChartPlanets(planets?: ApiPlanetDataItem[] | null): ChartPlanet[] {
  if (!Array.isArray(planets)) return [];
  return planets.map((p) => ({
    name: p.name,
    sign: p.sign,
    fullDegree: p.fullDegree, // Assign the string
    normDegree: p.normDegree, // Assign the number
  }));
}

/* ------------------------------------------------------------------
 * Main Component
 * ------------------------------------------------------------------ */
const KundliTabContent: React.FC<KundliTabContentProps> = ({ kundliData }) => {
  const { t } = useTranslation();
  const planetaryPositions: ApiPlanetDataItem[] = kundliData?.planets || [];
  const vimshottariDashaData: ApiMahadashaDataItem[] = kundliData?.dasha || [];
  const lagnaSign = kundliData?.lagna?.sign || "Aries";
  const lagnaDegree = kundliData?.lagna?.degree ?? undefined;
  const rasiChartSvgString = kundliData?.rasi_chart_svg;
  const navamsaChartSvgString = kundliData?.navamsa_chart_svg;

  const chartPlanets = useMemo(
    () => buildChartPlanets(planetaryPositions),
    [planetaryPositions],
  );

  type TabType = "mahadasa" | "antardasha";
  const [activeTab, setActiveTab] = useState<TabType>("mahadasa");
  const [selectedMahaIndex, setSelectedMahaIndex] = useState<number | null>(null);

  const handleMahaArrow = useCallback((idx: number) => {
    setSelectedMahaIndex(idx);
    setActiveTab("antardasha");
  }, []);

  const handleAntarBack = useCallback(() => {
    setSelectedMahaIndex(null);
    setActiveTab("mahadasa");
  }, []);

  const mahaRows = vimshottariDashaData;

  const antarRows = useMemo(() => {
    if (selectedMahaIndex == null) {
      return mahaRows.flatMap((md, i) =>
        (md.sub_periods ?? []).map((sub) => ({
          mahaIdx: i,
          mahaPlanet: md.planet,
          ...sub,
        }))
      );
    }
    const md = mahaRows[selectedMahaIndex];
    return (md?.sub_periods ?? []).map((sub) => ({
      mahaIdx: selectedMahaIndex,
      mahaPlanet: md.planet,
      ...sub,
    }));
  }, [selectedMahaIndex, mahaRows]);

  return (
    <div id="kundli-tab-content-section" className="space-y-6">
      {/* ================== TOP: South + North Charts ================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Card 1: Lagna Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 border-gray-200 dark:border-gray-700 text-center">
            {t('kundliDetails.lagnaChart')}
          </h3>
          <div className="w-full flex justify-center">
            {rasiChartSvgString ? (
              <div
                className="w-full max-w-md"
                dangerouslySetInnerHTML={{ __html: rasiChartSvgString }}
              />
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400 p-8">{t('kundliDetails.rasiChartNotAvailable')}</div>
            )}
          </div>
        </div>

        {/* Card 2: Navamsa Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 border-gray-200 dark:border-gray-700 text-center">
            {t('kundliDetails.navamsa')}
          </h3>
          <div className="w-full flex justify-center">
            {navamsaChartSvgString ? (
              <div
                className="w-full max-w-md"
                dangerouslySetInnerHTML={{ __html: navamsaChartSvgString }}
              />
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400 p-8">{t('kundliDetails.navamsaChartNotAvailable')}</div>
            )}
          </div>
        </div>
      </div>

      {/* ================== PLANETS TABLE ================== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-200 hover:shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">{t('kundliDetails.planets')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
            <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 w-[70px]">{t('kundliDetails.planet')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[60px]">{t('kundliDetails.sign')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[80px]">{t('kundliDetails.signLord')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[120px] text-center">{t('kundliDetails.nakshatra')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[110px] text-center">{t('kundliDetails.nakshatraLord')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[100px] text-center">{t('kundliDetails.degree')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[70px] text-center">{t('kundliDetails.retro')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[70px] text-center">{t('kundliDetails.combust')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[80px] text-center">{t('kundliDetails.avastha')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[60px] text-center">{t('kundliDetails.house')}</th>
                <th className="px-1 sm:px-3 py-3 whitespace-nowrap w-[70px] text-center">{t('kundliDetails.status')}</th>
              </tr>
            </thead>
            <tbody>
              {planetaryPositions.map((p, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-1 sm:px-3 py-3 font-medium text-orange-600 dark:text-orange-400 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-800 z-10 w-[70px] text-xs sm:text-sm">
                    {p.name}
                  </td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white font-medium whitespace-nowrap w-[60px] text-xs sm:text-sm">{p.sign}</td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap w-[80px] text-xs sm:text-sm">{p.signLord}</td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap w-[120px] text-center text-xs sm:text-sm">{p.nakshatra}</td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap w-[110px] text-center text-xs sm:text-sm">{p.nakshatraLord}</td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap w-[100px] text-center text-xs sm:text-sm">
                    {p.fullDegree}
                  </td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap w-[70px] text-center text-xs sm:text-sm">
                    {p.isRetro === "true" ? t('kundliDetails.retrograde') : t('kundliDetails.direct')}
                  </td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap w-[70px] text-center text-xs sm:text-sm">{p.is_planet_set ? t('kundliDetails.yes') : t('kundliDetails.no')}</td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap w-[80px] text-center text-xs sm:text-sm">{p.planet_awastha}</td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap w-[60px] text-center text-xs sm:text-sm">{p.house?.toString()}</td>
                  <td className="px-1 sm:px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap w-[70px] text-center text-xs sm:text-sm">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================== VIMSHOTTARI DASHA ================== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700 border-gray-200 dark:border-gray-700">
          {t('kundliDetails.vimshottariDasha')}
        </h3>

        {/* Tabs */}
        <div className="flex items-center gap-4 text-sm font-semibold mb-4">
          <button
            className={`px-1 pb-1 ${
              activeTab === "mahadasa"
                ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => {
              setActiveTab("mahadasa");
              setSelectedMahaIndex(null);
            }}
          >
            1&nbsp;{t('kundliDetails.mahadasha')}
          </button>
          <span className="text-gray-600 dark:text-gray-400">—</span>
          <button
            className={`px-1 pb-1 ${
              activeTab === "antardasha"
                ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => setActiveTab("antardasha")}
          >
            2&nbsp;{t('kundliDetails.antardasha')}
          </button>
          {/* <span className="text-gray-300">—</span>
          <span className="px-1 text-gray-400">3&nbsp;Pratyantardasha</span>
          <span className="text-gray-300">—</span>
          <span className="px-1 text-gray-400">4&nbsp;Sookshmadasha</span> */}
        </div>

        {activeTab === "antardasha" && selectedMahaIndex != null && (
          <button
            onClick={handleAntarBack}
            className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
          >
            <ArrowLeft size={14} />
            {t('kundliDetails.backToMahadasha')}
          </button>
        )}

        {activeTab === "mahadasa" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border rounded-md">
              <thead className="text-xs text-gray-900 dark:text-white uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3">{t('kundliDetails.planet')}</th>
                  <th className="px-4 py-3">{t('kundliDetails.startDate')}</th>
                  <th className="px-4 py-3">{t('kundliDetails.endDate')}</th>
                </tr>
              </thead>
              <tbody>
                {mahaRows.map((d, idx) => (
                  <tr
                    key={idx}
                    className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleMahaArrow(idx)}
                  >
                    <td className="px-4 py-3 font-semibold text-orange-600 dark:text-orange-400">
                      {d.planet}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {idx === 0 ? t('kundliDetails.birth') : formatDate(d.start)}
                    </td>
                    <td className="px-4 py-3 flex justify-between items-center text-gray-900 dark:text-white">
                      {formatDate(d.end)}
                      <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 ml-2" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "antardasha" && (
          <>
            {selectedMahaIndex != null && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('kundliDetails.showingAntardasha')}{" "}
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {mahaRows[selectedMahaIndex]?.planet}
                </span>{" "}
                {t('kundliDetails.mahadasha')}.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border rounded-md">
                <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3">{t('kundliDetails.planet')}</th>
                    <th className="px-4 py-3">{t('kundliDetails.startDate')}</th>
                    <th className="px-4 py-3">{t('kundliDetails.endDate')}</th>
                  </tr>
                </thead>
                <tbody>
                  {antarRows.map((row, i) => (
                    <tr
                      key={i}
                      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                        {shortPlanet(row.mahaPlanet)}-{shortPlanet(row.planet)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {row.mahaIdx === 0 && i === 0 && selectedMahaIndex != null
                          ? t('kundliDetails.birth')
                          : formatDate(row.start_date)}
                      </td>
                      <td className="px-4 py-3 flex justify-between items-center text-gray-900 dark:text-white">
                        {formatDate(row.end_date)}
                        <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 ml-2" />
                      </td>
                    </tr>
                  ))}
                  {!antarRows.length && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-gray-600 dark:text-gray-400 italic"
                      >
                        {t('kundliDetails.noDashaData')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KundliTabContent;