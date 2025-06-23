"use client";

import React, { useEffect, useState } from 'react';
import KundliReportPage from '@/components/kundli/result-kundli';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { ServicesSection } from "@/components/services-section"
import { LoadingScreen } from "@/components/banners/LoadingScreen";
import Link from 'next/link';


interface KundliApiInputParams {
  name: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
}

interface ApiPanchangDetails {
  day: string;
  tithi: string;
  nakshatra: string;
  yog: string;
  karan: string;
  sunrise: string;
  sunset: string;
  vedic_sunrise: string;
  vedic_sunset: string;
}

interface ApiHoroscopeData {
  name: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  timezone: string;
  latitude: number;
  longitude: number;
  ayanamsha: number;
  sunrise: string;
  sunset: string;
  panchang: ApiPanchangDetails;
}

interface BirthDetailsApiResponse {
  status: "success" | "error";
  code: number;
  message: string;
  data?: ApiHoroscopeData;
}

interface ApiPlanetDataItem {
  id: number;
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  nakshatra_pad: number;
  house: number;
  is_planet_set: boolean;
  planet_awastha: string;
  state: string;
}

interface ApiDashaData {
  planet_id: number;
  planet: string;
  start: string;
  end: string;
}

interface ApiDoshaData {
  manglik: {
    manglik_present_rule: {
      based_on_aspect: string[];
      based_on_house: string[];
    };
    manglik_cancel_rule: string[];
    is_mars_manglik_cancelled: boolean;
    manglik_status: string;
    percentage_manglik_present: number;
    percentage_manglik_after_cancellation: number;
    manglik_report: string;
    is_present: boolean;
  };
  kalsarpa: {
    present: boolean;
    type: string;
    one_line: string;
    name: string;
    report: {
      house_id: number;
      report: string;
    };
  };
}

interface DoshaApiResponse {
    status: "success" | "error";
    code: number;
    message: string;
    data?: ApiDoshaData;
}

interface ReportPageData {
  birthDetailsResponse: BirthDetailsApiResponse | null;
  planetsResponse?: ApiPlanetDataItem[] | null;
  svgChartResponse?: string | null;
  svgChartResponse2?: string | null;
  dashaResponse?: ApiDashaData[] | null;
  doshaResponse?: ApiDoshaData | null; 
}


export default function ReportDisplayPage() {
  const [reportData, setReportData] = useState<ReportPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        const birthDetailsRequestBody = {
            name: params.name,
            date_of_birth: params.date_of_birth,
            time_of_birth: params.time_of_birth,
            place_of_birth: params.place_of_birth,
        };

        const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;

        const [
          birthDetailsRes, 
          planetsRes, 
          dashaRes, 
          doshaRes, 
          svgChartRes, 
          svgChart2Res
        ] = await Promise.all([
          fetch(`${apiBaseUrl}/horoscope/birth-details`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(birthDetailsRequestBody) }),
          fetch(`${apiBaseUrl}/horoscope/planets`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(birthDetailsRequestBody) }),
          fetch(`${apiBaseUrl}/horoscope/vimshottari-dasha`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(birthDetailsRequestBody) }),
          fetch(`${apiBaseUrl}/horoscope/dosha`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(birthDetailsRequestBody) }),
          fetch(`${apiBaseUrl}/horoscope/chart`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(birthDetailsRequestBody) }),
          fetch(`${apiBaseUrl}/horoscope/chart?chartType=navamsa`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(birthDetailsRequestBody) })
        ]);

        if (!birthDetailsRes.ok) throw new Error('Failed to fetch birth details');
        const birthDetailsResponse: BirthDetailsApiResponse = await birthDetailsRes.json();
        if (birthDetailsResponse.status !== 'success' || !birthDetailsResponse.data) throw new Error(birthDetailsResponse.message || 'Invalid birth details data');

        if (!planetsRes.ok) throw new Error('Failed to fetch planets data');
        const planetsResponse: ApiPlanetDataItem[] = await planetsRes.json();

        if (!dashaRes.ok) throw new Error('Failed to fetch Dasha data');
        const dashaResponse: ApiDashaData[] = await dashaRes.json();

        if (!doshaRes.ok) throw new Error('Failed to fetch Dosha data');
        const doshaApiResponse: DoshaApiResponse = await doshaRes.json();
        if (doshaApiResponse.status !== 'success') throw new Error(doshaApiResponse.message || 'Invalid dosha data');
        const doshaResponseData = doshaApiResponse.data; 

        if (!svgChartRes.ok) throw new Error('Failed to fetch birth chart');
        const svgChartResponse = await svgChartRes.text();

        if (!svgChart2Res.ok) throw new Error('Failed to fetch Navamsa chart');
        const svgChartResponse2 = await svgChart2Res.text();
        
        setReportData({
          birthDetailsResponse: birthDetailsResponse,
          planetsResponse: planetsResponse,
          dashaResponse: dashaResponse,
          doshaResponse: doshaResponseData, 
          svgChartResponse: svgChartResponse,
          svgChartResponse2: svgChartResponse2
        });

      } catch (err) {
        console.error("Error fetching Kundli details from API:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKundliDetails();
  }, []);

    if (isLoading) {
        return <LoadingScreen />; 
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <NavBar />
                <main className="flex-grow container mx-auto px-4 py-8 text-center">
                    <p className="text-xl text-red-600 mb-4">Error: {error}</p>
                    <Link href="/free-kundli" className="text-indigo-600 hover:text-indigo-800">
                        Try Generating Kundli Again
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />
            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {reportData ? (
                    <KundliReportPage 
                        kundliData={{
                            data: reportData.birthDetailsResponse?.data,
                            planets: reportData.planetsResponse,
                            svgChart: reportData.svgChartResponse,
                            svgChart2: reportData.svgChartResponse2,
                            dasha: reportData.dashaResponse,
                            dosha: reportData.doshaResponse,
                        }} 
                    />
                ) : (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-700">No Kundli data found to display.</p>
                        <p className="mt-4">
                            <Link href="/free-kundli" className="text-indigo-600 hover:text-indigo-800">
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