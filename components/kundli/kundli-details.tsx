"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import RasiChartSVG from "./RasiChartSvg"; // Correctly named import
import type { ChartPlanet, RasiChartData } from "./RasiChartSvg"; // Import types if needed
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/languageStore';


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

interface ApiDashaSubPeriod {
  planet: string;
  start_date: string;
  end_date: string;
  duration_years: number;
  sub_periods?: ApiDashaSubPeriod[]; // For nested levels (up to 5 levels deep)
}

interface ApiMahadashaDataItem {
  planet_id?: number;
  planet: string;
  start_date: string;
  end_date: string;
  duration_years: number;
  sub_periods?: ApiDashaSubPeriod[]; // Antar dashas
}

interface CurrentDashaDetailed {
  maha_dasha?: {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
  };
  antar_dasha?: {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
  };
  pratyantar_dasha?: {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
  };
  sukshma_dasha?: {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
  };
  prana_dasha?: {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
  };
}

interface KundliData {
  planets?: ApiPlanetDataItem[] | null;
  rasiChartData?: RasiChartData;
  dasha?: ApiMahadashaDataItem[] | null;
  vimshottari_dasha?: ApiMahadashaDataItem[] | null; // New field for the 5-level dasha structure
  current_dasha_detailed?: CurrentDashaDetailed;
  lagna?: { sign: string; degree: number };
  lagna_degree?: number | null;
  rasi_chart_svg?: string;
  navamsa_chart_svg?: string;
  // Request parameters for lazy loading dasha levels
  kundliRequestParams?: {
    name: string;
    date_of_birth: string;
    time_of_birth: string;
    place_of_birth: string;
    language?: string;
  };
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
  const { language } = useLanguageStore(); // Get current language from store

  // Debug log to check if kundliRequestParams is available
  useEffect(() => {
    console.log('KundliTabContent received kundliData:', kundliData);
    console.log('kundliRequestParams:', kundliData?.kundliRequestParams);
    console.log('Current language from store:', language);
  }, [kundliData, language]);

  const planetaryPositions: ApiPlanetDataItem[] = kundliData?.planets || [];
  // Transform dasha data to ensure consistent format and recursively transform all nested levels
  const vimshottariDashaData: ApiMahadashaDataItem[] = useMemo(() => {
    // Use dasha field which now contains the properly transformed 5-level nested structure
    const dasha = kundliData?.dasha || [];
    if (!Array.isArray(dasha)) return [];

    console.log('Using dasha field with', dasha.length, 'Maha dashas');

    function transformSubPeriods(periods: any[]): ApiDashaSubPeriod[] {
      return periods.map((period: any) => ({
        planet: period.planet,
        start_date: period.start_date || period.start,
        end_date: period.end_date || period.end,
        duration_years: period.duration_years,
        sub_periods: period.sub_periods ? transformSubPeriods(period.sub_periods) : []
      }));
    }

    const transformed = dasha.map((period: any) => ({
      planet: period.planet,
      start_date: period.start_date || period.start,
      end_date: period.end_date || period.end,
      duration_years: period.duration_years,
      planet_id: period.planet_id,
      sub_periods: period.sub_periods ? transformSubPeriods(period.sub_periods) : []
    }));

    // Check the first Maha Dasha structure in detail
    if (transformed.length > 0) {
      const firstMaha = transformed[0];
      console.log('=== DASHA STRUCTURE DEBUG ===');
      console.log('First Maha Dasha planet:', firstMaha.planet);
      console.log('First Maha sub_periods count:', firstMaha.sub_periods?.length || 0);

      if (firstMaha.sub_periods && firstMaha.sub_periods.length > 0) {
        const firstAntar = firstMaha.sub_periods[0];
        console.log('First Antar Dasha planet:', firstAntar.planet);
        console.log('First Antar sub_periods count:', firstAntar.sub_periods?.length || 0);

        if (firstAntar.sub_periods && firstAntar.sub_periods.length > 0) {
          const firstPratyantar = firstAntar.sub_periods[0];
          console.log('First Pratyantar Dasha planet:', firstPratyantar.planet);
          console.log('First Pratyantar sub_periods count:', firstPratyantar.sub_periods?.length || 0);

          if (firstPratyantar.sub_periods && firstPratyantar.sub_periods.length > 0) {
            const firstSukshma = firstPratyantar.sub_periods[0];
            console.log('First Sukshma Dasha planet:', firstSukshma.planet);
            console.log('First Sukshma sub_periods count:', firstSukshma.sub_periods?.length || 0);

            if (firstSukshma.sub_periods && firstSukshma.sub_periods.length > 0) {
              const firstPrana = firstSukshma.sub_periods[0];
              console.log('First Prana Dasha planet:', firstPrana.planet);
              console.log('First Prana sub_periods count:', firstPrana.sub_periods?.length || 0);
            }
          }
        }
      }
      console.log('=== END DEBUG ===');
    }

    return transformed;
  }, [kundliData]);
  const lagnaSign = kundliData?.lagna?.sign || "Aries";
  const lagnaDegree = kundliData?.lagna?.degree ?? undefined;
  const rasiChartSvgString = kundliData?.rasi_chart_svg;
  const navamsaChartSvgString = kundliData?.navamsa_chart_svg;

  const chartPlanets = useMemo(
    () => buildChartPlanets(planetaryPositions),
    [planetaryPositions],
  );

  type TabType = "mahadasa" | "antardasha" | "pratyantar" | "sukshma";
  const [activeTab, setActiveTab] = useState<TabType>("mahadasa");
  const [selectedMahaIndex, setSelectedMahaIndex] = useState<number | null>(null);
  const [selectedAntarIndex, setSelectedAntarIndex] = useState<number | null>(null);
  const [selectedPratyantarIndex, setSelectedPratyantarIndex] = useState<number | null>(null);
  const [selectedSukshmaIndex, setSelectedSukshmaIndex] = useState<number | null>(null);

  // Lazy loading states for dasha levels
  const [enhancedVimshottariDasha, setEnhancedVimshottariDasha] = useState<ApiMahadashiDataItem[] | null>(null);
  const [isLoadingPratyantar, setIsLoadingPratyantar] = useState(false);
  const [isLoadingSukshma, setIsLoadingSukshma] = useState(false);
  const [pratyantarError, setPratyantarError] = useState<string | null>(null);
  const [sukshmaError, setSukshmaError] = useState<string | null>(null);

  // Clear enhanced dasha data when language changes to force re-fetch with new language
  useEffect(() => {
    console.log('Language changed to:', language, '- Clearing cached dasha data');
    // Clear the cached enhanced dasha data so it will be re-fetched with new language
    setEnhancedVimshottariDasha(null);
    setPratyantarError(null);
    setSukshmaError(null);
    // Also reset the selection indices to avoid showing stale data
    setSelectedMahaIndex(null);
    setSelectedAntarIndex(null);
    setSelectedPratyantarIndex(null);
    setSelectedSukshmaIndex(null);
    setActiveTab("mahadasa");
  }, [language]);

  // Function to transform vimshottari_dasha response
  const transformVimshottariDasha = useCallback((data: any[]): ApiMahadashaDataItem[] => {
    function transformSubPeriods(periods: any[]): ApiDashaSubPeriod[] {
      return periods.map((period: any) => ({
        planet: period.planet,
        start_date: period.start_date || period.start,
        end_date: period.end_date || period.end,
        duration_years: period.duration_years,
        sub_periods: period.sub_periods ? transformSubPeriods(period.sub_periods) : []
      }));
    }

    return data.map((period: any) => ({
      planet: period.planet,
      start_date: period.start_date || period.start,
      end_date: period.end_date || period.end,
      duration_years: period.duration_years,
      planet_id: period.planet_id,
      sub_periods: period.sub_periods ? transformSubPeriods(period.sub_periods) : []
    }));
  }, []);

  // Function to fetch Pratyantar Dasha (3 levels)
  const fetchPratyantarDasha = useCallback(async () => {
    const requestParams = kundliData.kundliRequestParams;
    if (!requestParams) {
      console.warn('No kundliRequestParams available');
      return;
    }

    // Check if we already have 3 levels (Pratyantar) in either enhanced or base data
    const currentData = enhancedVimshottariDasha || vimshottariDashaData;
    const hasPratyantar = currentData?.some(maha =>
      maha.sub_periods?.some(antar =>
        antar.sub_periods && antar.sub_periods.length > 0
      )
    );

    if (hasPratyantar) {
      console.log('Pratyantar data already exists, skipping fetch');
      return;
    }

    // Use current language from store instead of potentially stale requestParams
    const paramsWithCurrentLanguage = {
      ...requestParams,
      language: language,
    };

    console.log('Fetching Pratyantar dasha with params:', paramsWithCurrentLanguage);
    setIsLoadingPratyantar(true);
    setPratyantarError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiBaseUrl}/api/dasha/pratyantar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paramsWithCurrentLanguage),
      });

      if (!response.ok) throw new Error(`Failed to fetch Pratyantar dasha: ${response.status}`);

      const data = await response.json();
      console.log('Pratyantar API response:', data);
      // Transform and set the enhanced dasha data (3 levels: Maha + Antar + Pratyantar)
      const dashaData = data.vimshottari_dasha || data;
      setEnhancedVimshottariDasha(transformVimshottariDasha(dashaData));
    } catch (error) {
      console.error('Error fetching Pratyantar dasha:', error);
      setPratyantarError(error instanceof Error ? error.message : 'Failed to load Pratyantar dasha');
    } finally {
      setIsLoadingPratyantar(false);
    }
  }, [kundliData.kundliRequestParams, enhancedVimshottariDasha, vimshottariDashaData, transformVimshottariDasha, language]);

  // Function to fetch Sukshma Dasha (4 levels)
  const fetchSukshmaDasha = useCallback(async () => {
    const requestParams = kundliData.kundliRequestParams;
    if (!requestParams) {
      console.warn('No kundliRequestParams available');
      return;
    }

    // Check if we already have 4 levels (Sukshma) in either enhanced or base data
    const currentData = enhancedVimshottariDasha || vimshottariDashaData;
    const hasSukshma = currentData?.some(maha =>
      maha.sub_periods?.some(antar =>
        antar.sub_periods?.some(pratyantar =>
          pratyantar.sub_periods && pratyantar.sub_periods.length > 0
        )
      )
    );

    if (hasSukshma) {
      console.log('Sukshma data already exists, skipping fetch');
      return;
    }

    // Use current language from store instead of potentially stale requestParams
    const paramsWithCurrentLanguage = {
      ...requestParams,
      language: language,
    };

    console.log('Fetching Sukshma dasha with params:', paramsWithCurrentLanguage);
    setIsLoadingSukshma(true);
    setSukshmaError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiBaseUrl}/api/dasha/sukshma`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paramsWithCurrentLanguage),
      });

      if (!response.ok) throw new Error(`Failed to fetch Sukshma dasha: ${response.status}`);

      const data = await response.json();
      console.log('Sukshma API response:', data);
      // Transform and set the enhanced dasha data (4 levels: Maha + Antar + Pratyantar + Sukshma)
      const dashaData = data.vimshottari_dasha || data;
      setEnhancedVimshottariDasha(transformVimshottariDasha(dashaData));
    } catch (error) {
      console.error('Error fetching Sukshma dasha:', error);
      setSukshmaError(error instanceof Error ? error.message : 'Failed to load Sukshma dasha');
    } finally {
      setIsLoadingSukshma(false);
    }
  }, [kundliData.kundliRequestParams, enhancedVimshottariDasha, vimshottariDashaData, transformVimshottariDasha, language]);

  // Load data when tab is clicked
  const handleTabClick = useCallback((tab: TabType) => {
    console.log('Tab clicked:', tab);
    setActiveTab(tab);
    if (tab === "pratyantar") {
      fetchPratyantarDasha();
    } else if (tab === "sukshma") {
      fetchSukshmaDasha();
    }
  }, [fetchPratyantarDasha, fetchSukshmaDasha]);

  const handleMahaArrow = useCallback((idx: number) => {
    setSelectedMahaIndex(idx);
    setSelectedAntarIndex(null);
    setSelectedPratyantarIndex(null);
    setSelectedSukshmaIndex(null);
    setActiveTab("antardasha");
  }, []);

  const handleAntarArrow = useCallback((idx: number) => {
    setSelectedAntarIndex(idx);
    setSelectedPratyantarIndex(null);
    setSelectedSukshmaIndex(null);
    setActiveTab("pratyantar");
    fetchPratyantarDasha(); // Trigger lazy load
  }, [fetchPratyantarDasha]);

  const handlePratyantarArrow = useCallback((idx: number) => {
    setSelectedPratyantarIndex(idx);
    setSelectedSukshmaIndex(null);
    setActiveTab("sukshma");
    fetchSukshmaDasha(); // Trigger lazy load
  }, [fetchSukshmaDasha]);

  const handleBack = useCallback(() => {
    if (activeTab === "sukshma") {
      setActiveTab("pratyantar");
      setSelectedPratyantarIndex(null);
    } else if (activeTab === "pratyantar") {
      setActiveTab("antardasha");
      setSelectedAntarIndex(null);
    } else if (activeTab === "antardasha") {
      setActiveTab("mahadasa");
      setSelectedMahaIndex(null);
    }
  }, [activeTab]);

  // Use enhanced data if available, otherwise fall back to initial 2-level data
  const mahaRows = enhancedVimshottariDasha || vimshottariDashaData;

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

  const pratyantarRows = useMemo(() => {
    if (selectedMahaIndex == null || selectedAntarIndex == null) return [];

    const md = mahaRows[selectedMahaIndex];
    if (!md?.sub_periods?.[selectedAntarIndex]) return [];

    const ad = md.sub_periods[selectedAntarIndex];
    const rows = (ad?.sub_periods ?? []).map((sub) => ({
      mahaIdx: selectedMahaIndex,
      mahaPlanet: md.planet,
      antarIdx: selectedAntarIndex,
      antarPlanet: ad.planet,
      ...sub,
    }));

    console.log('Pratyantar rows:', rows);
    console.log('Selected Maha index:', selectedMahaIndex);
    console.log('Selected Antar index:', selectedAntarIndex);
    console.log('Antar dasha:', ad);

    return rows;
  }, [selectedMahaIndex, selectedAntarIndex, mahaRows]);

  const sukshmaRows = useMemo(() => {
    if (selectedMahaIndex == null || selectedAntarIndex == null || selectedPratyantarIndex == null) return [];

    const md = mahaRows[selectedMahaIndex];
    if (!md?.sub_periods?.[selectedAntarIndex]?.sub_periods?.[selectedPratyantarIndex]) return [];

    const pd = md.sub_periods[selectedAntarIndex].sub_periods[selectedPratyantarIndex];
    return (pd?.sub_periods ?? []).map((sub) => ({
      mahaIdx: selectedMahaIndex,
      mahaPlanet: md.planet,
      antarIdx: selectedAntarIndex,
      antarPlanet: md.sub_periods[selectedAntarIndex].planet,
      pratyantarIdx: selectedPratyantarIndex,
      pratyantarPlanet: pd.planet,
      ...sub,
    }));
  }, [selectedMahaIndex, selectedAntarIndex, selectedPratyantarIndex, mahaRows]);

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
        <div className="flex items-center gap-2 text-sm font-semibold mb-4 flex-wrap">
          <button
            className={`px-2 py-1 ${
              activeTab === "mahadasa"
                ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => {
              setActiveTab("mahadasa");
              setSelectedMahaIndex(null);
              setSelectedAntarIndex(null);
              setSelectedPratyantarIndex(null);
              setSelectedSukshmaIndex(null);
            }}
          >
            1&nbsp;{t('kundliDetails.mahadasha')}
          </button>
          <span className="text-gray-600 dark:text-gray-400">—</span>
          <button
            className={`px-2 py-1 ${
              activeTab === "antardasha"
                ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => setActiveTab("antardasha")}
          >
            2&nbsp;{t('kundliDetails.antardasha')}
          </button>
          <span className="text-gray-600 dark:text-gray-400">—</span>
          <button
            className={`px-2 py-1 ${
              activeTab === "pratyantar"
                ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => handleTabClick("pratyantar")}
          >
            3&nbsp;{t('kundliDetails.pratyantar')}
            {isLoadingPratyantar && <span className="ml-1 text-xs">...</span>}
          </button>
          <span className="text-gray-600 dark:text-gray-400">—</span>
          <button
            className={`px-2 py-1 ${
              activeTab === "sukshma"
                ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => handleTabClick("sukshma")}
          >
            4&nbsp;{t('kundliDetails.sukshma')}
            {isLoadingSukshma && <span className="ml-1 text-xs">...</span>}
          </button>
        </div>

        {/* Back Button */}
        {activeTab !== "current" && activeTab !== "mahadasa" && (
          <button
            onClick={handleBack}
            className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
          >
            <ArrowLeft size={14} />
            {t('kundliDetails.back')}
          </button>
        )}

        
        {/* Maha Dasha View */}
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
                      {idx === 0 ? t('kundliDetails.birth') : formatDate(d.start_date)}
                    </td>
                    <td className="px-4 py-3 flex justify-between items-center text-gray-900 dark:text-white">
                      {formatDate(d.end_date)}
                      <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 ml-2" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Antar Dasha View */}
        {activeTab === "antardasha" && (
          <>
            {selectedMahaIndex != null && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('kundliDetails.showingAntardasha')}{" "}
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {mahaRows[selectedMahaIndex]?.planet}
                </span>{" "}
                {t('kundliDetails.mahaDasha')}
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
                      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => selectedMahaIndex !== null && handleAntarArrow(i)}
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
                        {selectedMahaIndex !== null && <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 ml-2" />}
                      </td>
                    </tr>
                  ))}
                  {!antarRows.length && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-gray-600 dark:text-gray-400 italic">
                        {t('kundliDetails.noDashaData')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pratyantar Dasha View */}
        {activeTab === "pratyantar" && (
          <>
            {selectedMahaIndex != null && selectedAntarIndex != null && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('kundliDetails.showingPratyantar')}{" "}
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {shortPlanet(mahaRows[selectedMahaIndex]?.planet)}-
                  {shortPlanet(mahaRows[selectedMahaIndex]?.sub_periods?.[selectedAntarIndex]?.planet)}
                </span>
              </div>
            )}
            <div className="overflow-x-auto">
              {isLoadingPratyantar ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <p>Loading Pratyantar Dasha...</p>
                </div>
              ) : pratyantarError ? (
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                  <p>Error: {pratyantarError}</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left border border rounded-md">
                  <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3">{t('kundliDetails.planet')}</th>
                      <th className="px-4 py-3">{t('kundliDetails.startDate')}</th>
                      <th className="px-4 py-3">{t('kundliDetails.endDate')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pratyantarRows.map((row, i) => (
                      <tr
                        key={i}
                        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => handlePratyantarArrow(i)}
                      >
                        <td className="px-4 py-3 font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                          {shortPlanet(row.mahaPlanet)}-{shortPlanet(row.antarPlanet)}-{shortPlanet(row.planet)}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{formatDate(row.start_date)}</td>
                        <td className="px-4 py-3 flex justify-between items-center text-gray-900 dark:text-white">
                          {formatDate(row.end_date)}
                          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400 ml-2" />
                        </td>
                      </tr>
                    ))}
                    {!pratyantarRows.length && (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-gray-600 dark:text-gray-400 italic">
                          {t('kundliDetails.noPratyantarDashaData')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Sukshma Dasha View */}
        {activeTab === "sukshma" && (
          <>
            {selectedMahaIndex != null && selectedAntarIndex != null && selectedPratyantarIndex != null && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('kundliDetails.showingSukshma')}{" "}
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {shortPlanet(mahaRows[selectedMahaIndex]?.planet)}-
                  {shortPlanet(mahaRows[selectedMahaIndex]?.sub_periods?.[selectedAntarIndex]?.planet)}-
                  {shortPlanet(mahaRows[selectedMahaIndex]?.sub_periods?.[selectedAntarIndex]?.sub_periods?.[selectedPratyantarIndex]?.planet)}
                </span>
              </div>
            )}
            <div className="overflow-x-auto">
              {isLoadingSukshma ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <p>Loading Sukshma Dasha...</p>
                </div>
              ) : sukshmaError ? (
                <div className="text-center py-8 text-red-600 dark:text-red-400">
                  <p>Error: {sukshmaError}</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left border border rounded-md">
                  <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3">{t('kundliDetails.planet')}</th>
                      <th className="px-4 py-3">{t('kundliDetails.startDate')}</th>
                      <th className="px-4 py-3">{t('kundliDetails.endDate')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sukshmaRows.map((row, i) => (
                      <tr
                        key={i}
                        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap text-xs">
                          {shortPlanet(row.mahaPlanet)}-{shortPlanet(row.antarPlanet)}-
                          {shortPlanet(row.pratyantarPlanet)}-{shortPlanet(row.planet)}
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{formatDate(row.start_date)}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{formatDate(row.end_date)}</td>
                      </tr>
                    ))}
                    {!sukshmaRows.length && (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-gray-600 dark:text-gray-400 italic">
                          {t('kundliDetails.noSukshmaDashaData')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KundliTabContent;