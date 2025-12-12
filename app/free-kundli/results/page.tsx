"use client";

import React, { useEffect, useState } from 'react';
import KundliReportPage from '@/components/kundli/result-kundli';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { ServicesSection } from "@/components/services-section";
import { LoadingScreen } from "@/components/banners/LoadingScreen";
import Link from 'next/link';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useLanguageStore } from '@/stores/languageStore';

// Interfaces
interface ApiPlanetDataItem {
  id?: number;
  name: string;
  fullDegree?: string; // Full degree in DMS format
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
  status: string;
}

interface ApiMahadashaDataItem {
  planet_id?: number;
  planet: string;
  start: string;
  end: string;
  sub_periods?: { planet: string; start_date: string; end_date: string; duration_years: number }[];
}

interface KundliData {
  data: {
    name?: string;
    date_of_birth?: string;
    time_of_birth?: string;
    place_of_birth?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    sunrise?: string;
    sunset?: string;
    ayanamsha?: number;
    panchanga?: {
      day?: string;
      tithi?: string;
      nakshatra?: string;
      yog?: string;
      karan?: string;
      sunrise?: string;
      sunset?: string;
    };
  } | null;
  planets?: ApiPlanetDataItem[] | null;
  svgChart?: string | null;
  svgChart2?: string | null;
  rasiChartData?: { [key: number]: string[] };
  rasi_chart_svg?: string; // Added for Lagna chart data
  navamsa_chart_svg?: string; // Added for Navamsa chart data
  dasha?: ApiMahadashaDataItem[] | null;
  s3_key?: string | null;
  charts?: ChartsResponse | null;
  yogas?: YogasResponse | null;
  summary?: SummaryResponse | null;
  report?: Report | null;
  ashtakavarga_svg?: string ;
  ashtakavarga_data?: AshtakavargaData | null;
  basic_details?: BirthDetailsApiResponse | null;
}

interface KundliApiInputParams {
  name: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  language?: string; // Optional language parameter
}

interface KundliApiResponse {
  name: string;
  lagna: string;
  lagna_degree: number;
  planets: {
    planet: string;
    sign: string;
    degree: number;
    retrograde: boolean;
    house: number;
    degree_dms: string;
    sign_lord: string;
    nakshatra_lord: string;
    nakshatra_name: string;
    planet_awasta: string;
  }[];
  rasi_chart: { [key: number]: string[] };
  moon_nakshatra: { name: string; pada: number; lord: string };
  vimshottari_dasha: {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
    sub_periods: { planet: string; start_date: string; end_date: string; duration_years: number }[];
  }[];
  current_dasha_detailed: {
    maha_dasha: { planet: string; start_date: string; end_date: string; total_years: number };
    antar_dasha: { planet: string; start_date: string; end_date: string; duration_years: number };
  };
  rasi_chart_svg: string;
  navamsa_chart_svg: string;
}

interface ChartData {
  [key: string]: string[];
}

interface NavamsaPosition {
  sign: string;
  degree: number;
  navamsa_number: number;
  original_sign: string;
  original_degree: number;
}

interface NavamsaChart {
  navamsa_lagna?: { sign: string };
  navamsa_chart: ChartData;
  navamsa_positions: { [planet: string]: NavamsaPosition };
}

interface VargaChart {
  [sign: string]: string[];
}

interface VargaStrengths {
  [varga_name: string]: { [planet: string]: string };
}

interface AdditionalVargaChart {
  occupied_signs: string[];
  most_populated_signs: string[];
}

interface VargaAnalysisSummary {
  strength_distribution: { [key: string]: number };
  key_observations: string[];
}

interface ChartsResponse {
  rasi_chart: ChartData;
  navamsa_chart: NavamsaChart;
  varga_strengths: VargaStrengths;
  additional_varga_charts: { [key: string]: AdditionalVargaChart };
  varga_analysis_summary: VargaAnalysisSummary;
  varga_divisions: { [key: string]: string };
}
interface YogaDetail {
  name: string;
  description: string;
  strength: "Weak" | "Moderate" | "Strong";
  planets_involved: string[];
  houses_involved: number[];
  significance: string;
  effects: string[];
}

interface YogaSummary {
  total_yogas: number;
  strong_yogas: string[];
  moderate_yogas: string[];
  weak_yogas: string[];
  most_significant: string;
}

interface YogasResponse {
  detected_yogas: YogaDetail[];
  yoga_summary: YogaSummary;
}

interface Summary{
  name: string;
  interpretation: string;
}

interface Report{
  report:string;
}

interface SummaryResponse{
  summary: Summary[];
}

interface AshtakavargaData {
  bhinna_ashtakavarga: {
    Sun: number[];
    Moon: number[];
    Mars: number[];
    Mercury: number[];
    Jupiter: number[];
    Venus: number[];
    Saturn: number[];
  };
  sarvashtakavarga: number[];
}

interface AshtakavargaResponse {
  ashtakavarga: AshtakavargaData;
}

interface EnhancedPanchangaDetails {
  tithi: { name: string; number: number; end_time: string; paksha: string; };
  nakshatra: { name: string; number: number; end_time: string; lord: string; pada: number; };
  yoga: { name: string; number: number; end_time: string; };
  karana: { name: string; number: number; };
  vaara: { name: string; number: number; lord: string; };
  masa: { name: string; number: number; type: string; };
  ritu: { name: string; number: number; };
  samvatsara: { name: string; number: number; };
  sunrise: { time: string; };
  sunset: { time: string; };
  day_duration: { hours: number; ghatikas: number; };
}

interface BirthInfo {
  datetime: string;
  timezone: string;
  latitude: number;
  longitude: number;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
}

// This is the main interface for the /birth-details endpoint
interface BirthDetailsApiResponse {
  name: string;
  birth_info: BirthInfo;
  panchanga: any; // We can ignore the simple panchanga, as we use the enhanced one
  enhanced_panchanga: EnhancedPanchangaDetails;
}

export default function ReportDisplayPage() {
  const [reportData, setReportData] = useState<KundliData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguageStore(); // Get language from store

  useEffect(() => {
    const fetchKundliDetails = async () => {
      const paramsString = sessionStorage.getItem('kundliApiInputParams');
      if (!paramsString) {
        setError("Kundli input parameters not found. Please generate Kundli again.");
        setIsLoading(false);
        return;
      }

      try {
        const params: KundliApiInputParams = JSON.parse(paramsString);

        const [day, month, year] = params.date_of_birth.split('/');
        if (!day || !month || !year) throw new Error("Invalid date format in input");
        const formattedDate = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
        const formattedTime = params.time_of_birth.replace(/(\d{1,2}):(\d{2})(AM|PM)/i, (match, hour, minute, period) => {
          let h = parseInt(hour);
          if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
          if (period.toUpperCase() === 'AM' && h === 12) h = 0;
          return `${h.toString().padStart(2, '0')}:${minute}:00`;
        }) || '00:00:00';

        const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        if (isNaN(date.getTime())) throw new Error("Invalid date provided");

        const fallbackPlace = "Bengaluru, Karnataka, India";
        const kundliRequestBody = {
          name: params.name || "Unknown",
          date_of_birth: formattedDate,
          time_of_birth: formattedTime,
          place_of_birth: params.place_of_birth || fallbackPlace,
          language: language, // Use current language from store
          fields: [
            'name',
            'planets.planet',
            'planets.sign',
            'planets.degree',
            'planets.retrograde',
            'planets.house',
            'planets.degree_dms',
            'planets.sign_lord',
            'planets.nakshatra_lord',
            'planets.nakshatra_name',
            'planets.planet_awasta',
            'rasi_chart',
            'rasi_chart_svg',
            'navamsa_chart_svg',
            'vimshottari_dasha.planet',
            'vimshottari_dasha.start_date',
            'vimshottari_dasha.end_date',
            'vimshottari_dasha.duration_years',
            'vimshottari_dasha.sub_periods.planet',
            'vimshottari_dasha.sub_periods.start_date',
            'vimshottari_dasha.sub_periods.end_date',
            'vimshottari_dasha.sub_periods.duration_years'
          ].join(',')
        };

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

        // Recursive function to transform vimshottari_dasha preserving all 5 levels
        function transformVimshottariDasha(dashaData: any[]): ApiMahadashaDataItem[] {
          return dashaData.map(d => ({
            planet: d.planet,
            start: d.start_date,
            end: d.end_date,
            sub_periods: d.sub_periods ? transformSubPeriods(d.sub_periods) : []
          }));
        }

        function transformSubPeriods(periods: any[]): ApiMahadashaDataItem[] {
          return periods.map(p => ({
            planet: p.planet,
            start_date: p.start_date,
            end_date: p.end_date,
            duration_years: p.duration_years,
            sub_periods: p.sub_periods ? transformSubPeriods(p.sub_periods) : []
          }));
        }

        // Split kundli request into minimal data first
      const minimalKundliRequest = {
        ...kundliRequestBody,
        response_type: 'minimal', // Custom flag for backend
        exclude_large_fields: true // Custom flag for backend
      };

      // Critical data first - basic and minimal kundli info for immediate display
      const [basicRes, kundliRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/birth-details`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br' // Request compressed response
          },
          body: JSON.stringify(kundliRequestBody),
        }),
        fetch(`${apiBaseUrl}/api/kundli`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br' // Request compressed response
          },
          body: JSON.stringify(minimalKundliRequest),
        }),
      ]);

        if (!basicRes.ok) throw new Error(`Failed to fetch Basic details: ${basicRes.status} - ${basicRes.statusText}`);
        if (!kundliRes.ok) throw new Error(`Failed to fetch Kundli details: ${kundliRes.status} - ${kundliRes.statusText}`);

        const basicResponse: BirthDetailsApiResponse = await basicRes.json();
        const kundliResponse: KundliApiResponse = await kundliRes.json();

        // Set basic data immediately to show content faster
        const initialData: KundliData = {
          data: {
            name: kundliResponse.name,
            date_of_birth: formattedDate,
            time_of_birth: formattedTime,
            place_of_birth: params.place_of_birth || fallbackPlace,
          },
          planets: kundliResponse.planets.map(p => ({
            name: p.planet,
            isRetro: p.retrograde ? "true" : "false",
            sign: p.sign,
            signLord: p.sign_lord,
            nakshatra: p.nakshatra_name,
            nakshatraLord: p.nakshatra_lord,
            planet_awastha: p.planet_awasta,
            house: p.house,
            status: (p as any).status || 'normal',
            id: undefined,
            fullDegree: p.degree_dms,
            normDegree: p.degree,
            speed: undefined,
            is_planet_set: undefined,
            state: undefined,
          })),
          svgChart: undefined,
          svgChart2: undefined,
          rasiChartData: kundliResponse.rasi_chart,
          rasi_chart_svg: kundliResponse.rasi_chart_svg,
          navamsa_chart_svg: kundliResponse.navamsa_chart_svg,
          dasha: transformVimshottariDasha(kundliResponse.vimshottari_dasha),
          s3_key: null,
          charts: null,
          yogas: null,
          summary: null,
          report: null,
          ashtakavarga_svg: null,
          ashtakavarga_data: null,
          basic_details: basicResponse,
        };

        setReportData(initialData);

        // Fetch additional data in background
        try {
          const additionalDataPromises = Promise.all([
            fetch(`${apiBaseUrl}/api/charts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br'
              },
              body: JSON.stringify(kundliRequestBody),
            }),
            fetch(`${apiBaseUrl}/api/yogas`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br'
              },
              body: JSON.stringify(kundliRequestBody),
            }),
            fetch(`${apiBaseUrl}/api/ashtakavarga-svg`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br'
              },
              body: JSON.stringify(kundliRequestBody),
            }),
            fetch(`${apiBaseUrl}/api/ashtakavarga-data`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br'
              },
              body: JSON.stringify(kundliRequestBody),
            }),
            fetch(`${apiBaseUrl}/api/report`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br'
              },
              body: JSON.stringify(kundliRequestBody),
            }),
          ]);

          const [chartsRes, yogasRes, ashatakavargaRes, ashtakavargaDataRes, reportRes] = await additionalDataPromises;

          // Check additional API responses
          if (!chartsRes.ok) throw new Error(`Failed to fetch Charts details: ${chartsRes.status} - ${chartsRes.statusText}`);
          if (!yogasRes.ok) throw new Error(`Failed to fetch Yogas details: ${yogasRes.status} - ${yogasRes.statusText}`);
          if (!ashatakavargaRes.ok) throw new Error(`Failed to fetch Ashtakavarga details: ${ashatakavargaRes.status} - ${ashatakavargaRes.statusText}`);
          if (!ashtakavargaDataRes.ok) throw new Error(`Failed to fetch Ashtakavarga Data details: ${ashtakavargaDataRes.status} - ${ashtakavargaDataRes.statusText}`);
          if (!reportRes.ok) throw new Error(`Failed to fetch Report details: ${reportRes.status} - ${reportRes.statusText}`);

          const chartsResponse: ChartsResponse = await chartsRes.json();
          const YogasResponse: YogasResponse = await yogasRes.json();
          const ashatakavargaSvgText = await ashatakavargaRes.text();
          const ashtakavargaDataResponse: AshtakavargaResponse = await ashtakavargaDataRes.json();
          const reportResponse: Report = await reportRes.json();

          // Update with additional data
          const updatedData: KundliData = {
            ...initialData,
            charts: chartsResponse,
            yogas: YogasResponse,
            report: reportResponse,
            ashtakavarga_svg: ashatakavargaSvgText,
            ashtakavarga_data: ashtakavargaDataResponse.ashtakavarga,
          };

          setReportData(updatedData);
        } catch (additionalError) {
          console.warn("Some additional data failed to load, but basic kundli is available:", additionalError);
          // Don't throw the error, just log it since we have basic data
        }

      } catch (err) {
        console.error("Error fetching Kundli details from API:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKundliDetails();
  }, [language]); // Refetch when language changes

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-red-600 mb-4">Error: {error}</p>
          <Link href="/free-kundli" className="text-primary hover:text-primary/80">
            Try Generating Kundli Again
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>

        {reportData ? (
          <KundliReportPage kundliData={reportData} />
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-foreground">No Kundli data found to display.</p>
            <p className="mt-4">
              <Link href="/free-kundli" className="text-primary hover:text-primary/80">
                Generate a new Kundli
              </Link>
            </p>
          </div>
        )}
      </main>
      <ServicesSection />
      <Footer />
    </div>
  );
}