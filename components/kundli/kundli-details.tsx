"use client";

import React, { useMemo, useState, useCallback } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import RasiChartSVG from "./RasiChartSvg"; // Correctly named import
import type { ChartPlanet, RasiChartData } from "./RasiChartSvg"; // Import types if needed


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

  const curMD = mahaRows[0];
  const curAD = curMD?.sub_periods?.[0];

  return (
    <div id="kundli-tab-content-section" className="space-y-6">
      {/* ================== TOP: South + North Charts ================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Card 1: Lagna Chart */}
        <div className="bg-card rounded-xl shadow-lg border p-6 transform transition-all hover:scale-[1.01] duration-300">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-4 pb-2 border-b border-orange-200 text-center">
            Lagna / Ascendant / Basic Birth Chart
          </h3>
          <div className="w-full flex justify-center">
            {rasiChartSvgString ? (
              <div
                className="w-full max-w-md"
                dangerouslySetInnerHTML={{ __html: rasiChartSvgString }}
              />
            ) : (
              <div className="text-center text-muted-foreground p-8">Rasi Chart not available.</div>
            )}
          </div>
        </div>

        {/* Card 2: Navamsa Chart */}
        <div className="bg-card rounded-xl shadow-lg border p-6 transform transition-all hover:scale-[1.01] duration-300">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-4 pb-2 border-b border-orange-200 text-center">
            Navamsa
          </h3>
          <div className="w-full flex justify-center">
            {navamsaChartSvgString ? (
              <div
                className="w-full max-w-md"
                dangerouslySetInnerHTML={{ __html: navamsaChartSvgString }}
              />
            ) : (
              <div className="text-center text-muted-foreground p-8">Navamsa Chart not available.</div>
            )}
          </div>
        </div>
      </div>

      {/* ================== PLANETS TABLE ================== */}
      <div className="bg-card rounded-xl shadow-lg border p-6 transform transition-all hover:scale-[1.01] duration-300">
        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-5 pb-3 border-b border-orange-200">Planets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3">Planet</th>
                <th className="px-4 py-3">Sign</th>
                <th className="px-4 py-3">Sign Lord</th>
                <th className="px-4 py-3">Nakshatra</th>
                <th className="px-4 py-3">Naksh Lord</th>
                <th className="px-4 py-3">Degree</th>
                <th className="px-4 py-3">Retro(R)</th>
                <th className="px-4 py-3">Combust</th>
                <th className="px-4 py-3">Avastha</th>
                <th className="px-4 py-3">House</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {planetaryPositions.map((p, index) => (
                <tr
                  key={index}
                  className="bg-card border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-orange-600 whitespace-nowrap">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-foreground font-medium">{p.sign}</td>
                  <td className="px-4 py-3 text-foreground">{p.signLord}</td>
                  <td className="px-4 py-3 text-foreground">{p.nakshatra}</td>
                  <td className="px-4 py-3 text-foreground">{p.nakshatraLord}</td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">
                    {p.fullDegree}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {p.isRetro === "true" ? "Retro" : "Direct"}
                  </td>
                  <td className="px-4 py-3 text-foreground">{p.is_planet_set ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-foreground">{p.planet_awastha}</td>
                  <td className="px-4 py-3 text-foreground">{p.house?.toString()}</td>
                  <td className="px-4 py-3 text-foreground">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================== CURRENT DASHA DETAILS ================== */}
      {curMD && (
        <div className="bg-card rounded-xl shadow-lg border p-6 transform transition-all hover:scale-[1.01] duration-300">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-5 pb-3 border-b border-orange-200">
            Current Dasha Details
          </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/30 p-4 rounded-lg shadow-sm hover:bg-accent transition-colors duration-200">
              <h4 className="text-lg font-medium text-foreground mb-2">
                Mahadasha
              </h4>
              <p className="text-foreground"><span className="font-semibold text-orange-600">Planet:</span> {curMD.planet}</p>
              <p className="text-foreground"><span className="font-semibold text-orange-600">Start Date:</span> {formatDate(curMD.start)}</p>
              <p className="text-foreground"><span className="font-semibold text-orange-600">End Date:</span> {formatDate(curMD.end)}</p>
              {curMD.sub_periods?.length ? (
                <p className="text-foreground">
                  <span className="font-semibold text-orange-600">Total Years:</span> {curMD.sub_periods[0].duration_years}
                </p>
              ) : null}
            </div>

            {curAD && (
              <div className="bg-muted/30 p-4 rounded-lg shadow-sm hover:bg-accent transition-colors duration-200">
                <h4 className="text-lg font-medium text-foreground mb-2">
                  Antardasha
                </h4>
                <p className="text-foreground"><span className="font-semibold text-orange-600">Planet:</span> {curAD.planet}</p>
                <p className="text-foreground"><span className="font-semibold text-orange-600">Start Date:</span> {formatDate(curAD.start_date)}</p>
                <p className="text-foreground"><span className="font-semibold text-orange-600">End Date:</span> {formatDate(curAD.end_date)}</p>
                <p className="text-foreground"><span className="font-semibold text-orange-600">Duration (Years):</span> {curAD.duration_years}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================== VIMSHOTTARI DASHA ================== */}
      <div className="bg-card rounded-xl shadow-lg border p-6 transform transition-all hover:scale-[1.01] duration-300">
        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-5 pb-3 border-b border-orange-200">
          Vimshottari Dasha
        </h3>

        {/* Tabs */}
        <div className="flex items-center gap-4 text-sm font-semibold mb-4">
          <button
            className={`px-1 pb-1 ${
              activeTab === "mahadasa"
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setActiveTab("mahadasa");
              setSelectedMahaIndex(null);
            }}
          >
            1&nbsp;Mahadasha
          </button>
          <span className="text-muted-foreground">—</span>
          <button
            className={`px-1 pb-1 ${
              activeTab === "antardasha"
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("antardasha")}
          >
            2&nbsp;Antardasha
          </button>
          {/* <span className="text-gray-300">—</span>
          <span className="px-1 text-gray-400">3&nbsp;Pratyantardasha</span>
          <span className="text-gray-300">—</span>
          <span className="px-1 text-gray-400">4&nbsp;Sookshmadasha</span> */}
        </div>

        {activeTab === "antardasha" && selectedMahaIndex != null && (
          <button
            onClick={handleAntarBack}
            className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={14} />
            Back to Mahadasha
          </button>
        )}

        {activeTab === "mahadasa" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border rounded-md">
              <thead className="text-xs text-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3">Planet</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                </tr>
              </thead>
              <tbody>
                {mahaRows.map((d, idx) => (
                  <tr
                    key={idx}
                    className="bg-card border-b hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleMahaArrow(idx)}
                  >
                    <td className="px-4 py-3 font-semibold text-orange-600">
                      {d.planet}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {idx === 0 ? "Birth" : formatDate(d.start)}
                    </td>
                    <td className="px-4 py-3 flex justify-between items-center text-foreground">
                      {formatDate(d.end)}
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
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
              <div className="text-sm text-muted-foreground mb-2">
                Showing Antardasha under{" "}
                <span className="font-semibold text-orange-600">
                  {mahaRows[selectedMahaIndex]?.planet}
                </span>{" "}
                Mahadasha.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border rounded-md">
                <thead className="text-xs text-foreground uppercase bg-muted/30">
                  <tr>
                    <th className="px-4 py-3">Planet</th>
                    <th className="px-4 py-3">Start Date</th>
                    <th className="px-4 py-3">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {antarRows.map((row, i) => (
                    <tr
                      key={i}
                      className="bg-card border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-orange-600 whitespace-nowrap">
                        {shortPlanet(row.mahaPlanet)}-{shortPlanet(row.planet)}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {row.mahaIdx === 0 && i === 0 && selectedMahaIndex != null
                          ? "Birth"
                          : formatDate(row.start_date)}
                      </td>
                      <td className="px-4 py-3 flex justify-between items-center text-foreground">
                        {formatDate(row.end_date)}
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                      </td>
                    </tr>
                  ))}
                  {!antarRows.length && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-muted-foreground italic"
                      >
                        No Antardasha data.
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