import React from 'react';

// --- TypeScript Interface for the component's props ---
// This defines the structure of the data this component expects to receive.
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
      report: string; // This can contain HTML
    };
  };
}

interface DoshaDetailsProps {
    dosha: ApiDoshaData | null | undefined;
}


// --- SVG Icons (self-contained within the component) ---

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- Reusable Sub-Component for Displaying Rules ---

interface DoshaRuleListProps {
  title: string;
  rules: string[] | undefined;
}

const DoshaRuleList: React.FC<DoshaRuleListProps> = ({ title, rules }) => {
  if (!rules || rules.length === 0) {
    return null;
  }
  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold text-gray-700">{title}</h4>
      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
        {rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
    </div>
  );
};


// --- Main Dosha Details Component ---

const DoshaDetails: React.FC<DoshaDetailsProps> = ({ dosha }) => {
    if (!dosha) {
        return (
            <div className="p-6 text-center text-gray-500">
                <p>Dosha details are not available or are still loading.</p>
            </div>
        );
    }
    
    const { manglik, kalsarpa } = dosha;

    if (!manglik && !kalsarpa) {
        return (
            <div className="text-center py-10">
                <p>Dosha details are empty.</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 space-y-8">
            
            {/* Manglik Dosha Card */}
            {manglik && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center border-b pb-3 mb-4">
                        {manglik.is_present ? <ExclamationCircleIcon /> : <CheckCircleIcon />}
                        <h2 className="text-2xl font-bold text-gray-800">
                            Manglik Dosha
                        </h2>
                    </div>

                    {/* FIX: Main content area now a grid for image and text */}
                    <div className="mt-6 grid md:grid-cols-3 gap-8 items-start">
                        {/* Image Column */}
                        <div className="md:col-span-1">
                            <img 
                                src="/manglik.png" 
                                alt="Manglik Dosha representation of Mars"
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                        </div>

                        {/* Text Details Column */}
                        <div className="md:col-span-2">
                             <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-lg font-semibold text-gray-800">
                                    Status: 
                                    <span className={`ml-2 px-3 py-1 text-sm rounded-full ${
                                        manglik.is_present 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                        {manglik.manglik_status}
                                    </span>
                                </p>
                                <p className="mt-2 text-gray-700">{manglik.manglik_report}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Dosha Calculation</h3>
                                    <DoshaRuleList title="Reasons (Based on House):" rules={manglik.manglik_present_rule?.based_on_house} />
                                    <DoshaRuleList title="Reasons (Based on Aspect):" rules={manglik.manglik_present_rule?.based_on_aspect} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Cancellation Details</h3>
                                    {manglik.manglik_cancel_rule && manglik.manglik_cancel_rule.length > 0 ? (
                                        <DoshaRuleList title="Cancellation Rules:" rules={manglik.manglik_cancel_rule} />
                                    ) : (
                                        <p className="mt-3 text-gray-600 italic">No cancellation rules were found.</p>
                                    )}
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm text-gray-600"><strong>Original Manglik Presence:</strong> {manglik.percentage_manglik_present}%</p>
                                        <p className="text-sm text-gray-600"><strong>Presence After Cancellation:</strong> {manglik.percentage_manglik_after_cancellation}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Kalsarpa Dosha Card */}
            {kalsarpa && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center border-b pb-3 mb-4">
                        {kalsarpa.present ? <ExclamationCircleIcon /> : <CheckCircleIcon />}
                        <h2 className="text-2xl font-bold text-gray-800">
                            Kalsarpa Dosha
                        </h2>
                    </div>
                     
                    {/* FIX: Main content area now a grid for image and text */}
                     <div className="mt-6 grid md:grid-cols-3 gap-8 items-start">
                        {/* Image Column */}
                        <div className="md:col-span-1">
                             <img 
                                src="/kalasarp.png" 
                                alt="Kalsarpa Dosha representation of a snake"
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                        </div>

                         {/* Text Details Column */}
                        <div className="md:col-span-2">
                             <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-lg font-semibold text-gray-800">
                                    Status: 
                                    <span className={`ml-2 px-3 py-1 text-sm rounded-full ${
                                        kalsarpa.present 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                        {kalsarpa.present ? `Present (${kalsarpa.name} - ${kalsarpa.type})` : 'Not Present'}
                                    </span>
                                </p>
                                {kalsarpa.present && (
                                    <p className="mt-2 text-gray-700">{kalsarpa.one_line}</p>
                                )}
                            </div>
                            
                            {kalsarpa.present && kalsarpa.report && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-800">Detailed Report for {kalsarpa.name} Kalsarpa Dosha</h3>
                                    <div 
                                        className="mt-2 prose prose-sm max-w-none text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: kalsarpa.report.report }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoshaDetails;