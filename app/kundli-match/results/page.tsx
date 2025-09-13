// app/kundli-match/results/page.tsx

'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { MatchingResults } from '@/components/kundli-matching/KundliMatchingReport';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';

// --- TYPE DEFINITIONS ---
interface KootaDetail {
  obtained_points: number;
  max_points: number;
  description: string;
}

interface MangalDoshaAnalysis {
  is_compatible: boolean;
  report: string;
  groom_status: string;
  bride_status: string;
}

interface KundliMatchingData {
  total_points_obtained: number;
  maximum_points: number;
  conclusion: string;
  mangal_dosha_analysis: MangalDoshaAnalysis;
  koota_details: { [key: string]: KootaDetail };
}

// --- UI COMPONENTS FOR STATES ---
const LoadingState = () => (
    <div className="flex flex-col items-center justify-center text-center p-20 min-h-[50vh]">
        <svg className="animate-spin h-12 w-12 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold text-foreground">Generating Your Matching Report...</p>
        <p className="text-muted-foreground">Please wait a moment.</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-10 min-h-[50vh] flex flex-col justify-center items-center bg-destructive/10 rounded-lg border border-destructive/20">
        <h3 className="text-2xl font-bold text-destructive">An Error Occurred</h3>
        <p className="text-foreground mt-2 mb-6 max-w-md">{message}</p>
        <Link href="/kundli-match" className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition-colors">
            Fill Form Again
        </Link>
    </div>
);

// --- MAIN RESULTS LOGIC ---
function Results() {
  const [kundliMatchingData, setKundliMatchingData] = useState<KundliMatchingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchingData = async () => {
      try {
        const apiInputString = sessionStorage.getItem('kundliMatchingApiInput');
        if (!apiInputString) {
          throw new Error('Matching input data not found in session. Please fill out the form again.');
        }
        
        const apiPayload = JSON.parse(apiInputString);

        // Use environment variable for the API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${apiUrl}/api/kundli-matching`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = "Failed to fetch the matching report from the server.";
            
            // ✅ Better Error Parsing: Handle detailed validation errors from FastAPI/Pydantic
            if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
                const firstError = errorData.detail[0];
                const field = firstError.loc.slice(1).join(' -> ');
                errorMessage = `Invalid input: ${firstError.msg} for field '${field}'.`;
            } else if (typeof errorData.detail === 'string') {
                errorMessage = errorData.detail;
            }
            throw new Error(errorMessage);
        }

        const data: KundliMatchingData = await response.json();
        setKundliMatchingData(data);

      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.message || 'An unexpected error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchingData();
  }, []); // Runs only once on mount

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!kundliMatchingData) {
    return <ErrorState message="No data was returned from the server." />;
  }
  
  return <MatchingResults data={kundliMatchingData} />;
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
        <NavBar />
        <main className="container mx-auto px-4 py-8 flex-grow">
            <Suspense fallback={<LoadingState />}>
                <Results />
            </Suspense>
        </main>
        <Footer />
    </div>
  );
}