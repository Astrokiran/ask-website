import React, { useState, useEffect,useRef } from 'react';
import { Share2, ChevronRight, Download } from 'lucide-react';

import BasicDetailsContent from '@/components/kundli/basic-details';
import KundliTabContent from '@/components/kundli/kundli-details';
import { generateKundliPdf } from './pdf-export';
import DoshaDetails from './dosha-details'; // The corrected component
import { WhatsAppCtaBanner } from '@/components/banners/Whatsapp-banner'; // Import the new banner


// Define a type for the main prop for better type safety
interface KundliDataForReport {
    data: any; // You can use the specific ApiHoroscopeData interface here
    planets: any[] | null | undefined;
    svgChart: string | null | undefined;
    svgChart2: string | null | undefined;
    dasha: any[] | null | undefined;
    dosha: any | null | undefined; // This is the crucial part for the Dosha tab
}

interface KundliReportPageProps {
    kundliData: KundliDataForReport;
}

export default function KundliReportPage({ kundliData }: KundliReportPageProps) {
  const [activeTab, setActiveTab] = useState('Basic');
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRenderTrigger = useRef(0); // Using useRef to avoid re-renders

  const tabs = ['Basic', 'Kundli', 'Dosha'];

  const renderContent = () => {
    if (!kundliData) {
        return <div className="text-center p-10 bg-white rounded-lg shadow-md mt-6">Please generate a Kundli to see the details.</div>;
    }
      
    switch (activeTab) {
      case 'Basic':
        return (
        <div>
          <WhatsAppCtaBanner phoneNumber="918197503574" />

          <BasicDetailsContent kundliData={kundliData} />;
        </div>
        );
      case 'Kundli':
        return (
        <div>
          <WhatsAppCtaBanner phoneNumber="918197503574" />

          <KundliTabContent kundliData={kundliData} />
        </div>

        );

      case 'Dosha':
        return (
        <div>
          <WhatsAppCtaBanner phoneNumber="918197503574" />

          <DoshaDetails dosha={kundliData.dosha} />

         </div> 
        );
      default:
        return <div className="text-center p-10 bg-white rounded-lg shadow-md mt-6"> {activeTab} Coming Soon.</div>;
    }
  };

  const handleDownloadPdf = async () => {
    if (!kundliData || !kundliData.data) {
      console.error("No Kundli data available to download.");
      alert("No Kundli data available to download.");
      return;
    }

    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      await generateKundliPdf(kundliData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">   
        {/* Header with Breadcrumbs and Share Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <a href="/free-kundli" className="hover:text-indigo-600">Free Kundli</a>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="font-semibold text-gray-700">Kundli Details</span>
          </div>
          <div className="flex gap-3 self-start sm:self-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading || !kundliData}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-green-500 text-white rounded-lg shadow-md text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto p-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-3 px-4 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none ${
                    activeTab === tab
                      ? 'bg-orange-400 text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:bg-orange-100 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content - Visible on screen */}
        <div className="mt-4">
          {renderContent()}
        </div>

        {/* Off-screen content for PDF generation */}
        {isDownloading && kundliData && (
          <div 
            style={{
              position: 'absolute',
              left: '-9999px',
              top: '-9999px',
              width: '1024px',
              backgroundColor: 'white',
              zIndex: -1,
            }}
            key={pdfRenderTrigger.current}
          >
            <BasicDetailsContent kundliData={kundliData} />
            <KundliTabContent kundliData={kundliData} />
          </div>
        )}
      </div>
    </div>
  );
}