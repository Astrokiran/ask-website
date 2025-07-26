"use client";

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Info, Ban, TrendingUp, TrendingDown, Zap, ShieldQuestion } from 'lucide-react';

// --- Type Definitions ---
interface MangalDoshaData {
  is_present: boolean;
  is_cancelled: boolean;
  report: string;
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
}

interface KalasarpaReportDetail {
  house_id: number;
  report: string;
}

interface KalasarpaDoshaData {
  is_present: boolean;
  present: boolean;
  type: string;
  one_line: string;
  name: string;
  report_detail: KalasarpaReportDetail;
}

interface KundliDataForDoshaDetails {
  mangal_dosha: MangalDoshaData;
  kalasarpa_dosha: KalasarpaDoshaData;
}

interface DoshaDetailsProps {
  kundlidata: KundliDataForDoshaDetails | null | undefined;
}

// --- Reusable Helper Components ---

const ProgressBar: React.FC<{ value: number; colorClass: string }> = ({ value, colorClass }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
  </div>
);

const InfoBlock: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
    <h4 className="font-semibold text-blue-800 flex items-center mb-1">
      <Info className="w-5 h-5 mr-2" />
      {title}
    </h4>
    <p className="text-sm text-blue-700">{content}</p>
  </div>
);

const DoshaAnalysisCard: React.FC<{
  status: string;
  report: string;
  rules?: string[];
  impact?: {
    label: string;
    value: number;
    icon: React.ElementType;
    color: 'red' | 'yellow' | 'green';
  }[];
  details?: { label: string; value: React.ReactNode }[];
}> = ({ status, report, rules, impact, details }) => {
  let statusColor = "text-gray-600 bg-gray-100 ring-gray-300";
  let StatusIcon = ShieldQuestion;

  if (status.toLowerCase().includes("not present")) {
    StatusIcon = ShieldCheck;
    statusColor = "text-green-800 bg-green-100 ring-green-300";
  } else if (status.toLowerCase().includes("present")) {
    StatusIcon = ShieldAlert;
    statusColor = "text-red-800 bg-red-100 ring-red-300";
    if (status.toLowerCase().includes("cancelled")) {
      statusColor = "text-yellow-800 bg-yellow-100 ring-yellow-300";
    }
  } else if (status.toLowerCase().includes("not applicable")) {
    StatusIcon = Ban;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all">
      {/* Verdict Section */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500 mb-2">Verdict</p>
        <div className={`flex items-center gap-3 p-3 rounded-lg ring-1 ${statusColor}`}>
          <StatusIcon className="w-6 h-6" />
          <p className="text-lg font-bold">{status}</p>
        </div>
      </div>

      {/* Report Section */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4">{report}</p>

      {/* Impact Assessment Section */}
      {impact && impact.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-md font-semibold text-gray-700 mb-3">Impact Assessment</p>
          <div className="space-y-4">
            {impact.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-600 flex items-center">
                    <item.icon className={`w-4 h-4 mr-2 text-${item.color}-500`} />
                    {item.label}
                  </p>
                  <p className={`text-sm font-bold text-${item.color}-600`}>{item.value.toFixed(2)}%</p>
                </div>
                <ProgressBar value={item.value} colorClass={`bg-${item.color}-500`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules Section */}
      {rules && rules.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-md font-semibold text-gray-700 mb-2">Key Astrological Factors</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {rules.map((rule, index) => <li key={index}>{rule}</li>)}
          </ul>
        </div>
      )}

      {/* Additional Details Section */}
      {details && details.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-md font-semibold text-gray-700 mb-2">Additional Details</p>
          <ul className="text-sm text-gray-600 space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{detail.label}:</span>
                <span className="text-gray-800 font-semibold">{detail.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


// --- Main Exported Component ---
const DoshaDetails: React.FC<DoshaDetailsProps> = ({ kundlidata }) => {
  const [activeTab, setActiveTab] = useState('mangal');

  if (!kundlidata || !kundlidata.mangal_dosha || !kundlidata.kalasarpa_dosha) {
    return (
      <div className="bg-white min-h-[200px] p-8 rounded-lg shadow-md flex items-center justify-center">
        <p className="text-lg text-gray-600">No Dosha data available to display.</p>
      </div>
    );
  }

  const { mangal_dosha, kalasarpa_dosha } = kundlidata;

  // Prepare data for Mangal Dosha Card
  const mangalRules = [
    ...mangal_dosha.manglik_present_rule.based_on_house.map(rule => `Presence due to house placement: ${rule}`),
    ...mangal_dosha.manglik_present_rule.based_on_aspect.map(rule => `Presence due to aspect: ${rule}`),
    ...mangal_dosha.manglik_cancel_rule.map(rule => `Cancellation factor: ${rule}`),
  ];

  const mangalImpact = [
    { label: 'Initial Dosha Intensity', value: mangal_dosha.percentage_manglik_present, icon: Zap, color: 'red' as 'red' },
    { label: 'Intensity After Cancellation', value: mangal_dosha.percentage_manglik_after_cancellation, icon: ShieldCheck, color: 'yellow' as 'yellow' },
  ];

  // Prepare data for Kalasarpa Dosha Card
  const kalasarpaStatus = kalasarpa_dosha.is_present ? `Present (${kalasarpa_dosha.name})` : "Not Present";
  const kalasarpaDetails = kalasarpa_dosha.is_present ? [
    { label: 'Type', value: kalasarpa_dosha.type },
    { label: 'Name', value: kalasarpa_dosha.name },
  ] : [];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Dosha Analysis</h2>
            <p className="mt-2 text-md text-gray-600">
                An evaluation of specific planetary alignments, known as Doshas, which can indicate unique challenges and strengths in your life path.
            </p>
        </div>

        {/* General Information Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoBlock
              title="About Mangal Dosha (Manglik)"
              content="This dosha is caused by a specific placement of Mars (Mangal) in the birth chart. It is primarily considered for its influence on marital life, potentially causing delays or discord. However, many astrological factors can cancel or reduce its effects."
            />
            <InfoBlock
              title="About Kalasarpa Dosha"
              content="This dosha occurs when all seven planets are hemmed between the lunar nodes Rahu (North Node) and Ketu (South Node). It can indicate a life of unique challenges and extraordinary potential, often linked to karmic patterns. Its effects vary greatly based on the houses involved."
            />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-gray-300">
            <button
                onClick={() => setActiveTab('mangal')}
                className={`py-2 px-4 text-lg font-semibold ${activeTab === 'mangal' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            >
                Mangal Dosha 
            </button>
            <button
                onClick={() => setActiveTab('kalasarpa')}
                className={`py-2 px-4 text-lg font-semibold ${activeTab === 'kalasarpa' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
            >
                Kalasarpa Dosha
            </button>
        </div>

        {/* Tab Content */}
        <div>
            {activeTab === 'mangal' && (
                <DoshaAnalysisCard
                    status={mangal_dosha.manglik_status}
                    report={mangal_dosha.manglik_report}
                    rules={mangalRules}
                    impact={mangalImpact}
                />
            )}
            {activeTab === 'kalasarpa' && (
                <DoshaAnalysisCard
                    status={kalasarpaStatus}
                    report={kalasarpa_dosha.report_detail?.report || kalasarpa_dosha.one_line}
                    details={kalasarpaDetails}
                />
            )}
        </div>
    </div>
  );
};

export default DoshaDetails;