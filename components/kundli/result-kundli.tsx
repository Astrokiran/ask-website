// File: /components/kundli/result-kundli.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Download, UserCheck, LogOut, ChevronDown, CheckCircle, XCircle, Loader } from 'lucide-react';
import BasicDetailsContent from '@/components/kundli/basic-details';
import KundliTabContent from '@/components/kundli/kundli-details';
import ChartDetails from '@/components/kundli/charts-details';
import YogasDetails from './yoga-details';
import SummaryDetails from './summary-details';
import ReportDetails from './report-details';
import DoshaDetails from './dosha-details';
import AshtakavargaDetails from './Ashtakavarga';
// Import your enhanced PDF export function and S3 uploader
import generateKundliPdf from './pdf-export';
import { uploadPdfToS3 } from './report-pdf';
// --- TYPE DEFINITIONS ---
interface KundliReportPageProps {
    kundliData: KundliData | null;
}
type KundliData = any; // Using 'any' to match your provided code
interface UserStatusProps {
    isLoggedIn: boolean;
    userName?: string;
    onLogout: () => void;
}
type PdfTask = 'download' | 'upload' | null;
// --- UTILITY FUNCTIONS & COMPONENTS ---
// const forceLogout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('userPhoneNumber');
//     alert("Your session has expired. Please log in again.");
//     window.location.href = '/free-kundli';
// };
// const UserStatus: React.FC<UserStatusProps> = ({ isLoggedIn, userName, onLogout }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = React.useRef<HTMLDivElement>(null);
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);
//     if (!isLoggedIn) return null;
//     return (
//         <div ref={dropdownRef} className="relative inline-block text-left mb-2">
//             <div>
//                 <button type="button" onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//                     <UserCheck className="mr-2 h-5 w-5 text-green-500" />
//                     {userName || 'Logged In'}
//                     <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
//                 </button>
//             </div>
//             {isOpen && (
//                 <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
//                     <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
//                         <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
//                             <LogOut className="mr-3 h-5 w-5 text-gray-400" />
//                             <span>Logout</span>
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
const VargaChartsForPdf = ({ svgString }: { svgString: string | null }) => {
    const processedSvg = useMemo(() => {
        if (!svgString) return null;
        return svgString
            .replace(/width="\d+(\.\d+)?"/, '')
            .replace(/height="\d+(\.\d+)?"/, '')
            .replace('<svg', '<svg viewBox="0 0 1260 2250"');
    }, [svgString]);
    if (!processedSvg) return null;
    return <div dangerouslySetInnerHTML={{ __html: processedSvg }} />;
};
const IndividualPdfChart: React.FC<{ svgString: string | null; title?: string }> = ({ svgString, title }) => {
    if (!svgString) return null;
    // This converts the SVG string into a format that is very stable for PDF generation
    const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
    
    // The component now uses the title for the alt text
    return <img src={svgDataUrl} alt={title || 'Chart'} style={{ maxWidth: '100%' }} />;
};
const PdfRenderComponent = ({ kundliData }: { kundliData: KundliData }) => {
    if (!kundliData) return null;
    const vargaCharts = kundliData.charts?.varga_charts_svgs || {};
    return (
        <div style={{ position: 'absolute', left: '-9999px', width: '500px', backgroundColor: 'white', zIndex: -1 }}>
            <div id="pdf-lagna-chart">
                {kundliData.rasi_chart_svg && <div dangerouslySetInnerHTML={{ __html: kundliData.rasi_chart_svg }} />}
            </div>
            <div id="pdf-navamsa-chart">
                {kundliData.navamsa_chart_svg && <div dangerouslySetInnerHTML={{ __html: kundliData.navamsa_chart_svg }} />}
            </div>
            
                {Object.entries(vargaCharts).map(([name, svgString]) => (
                    <div key={name} id={`pdf-varga-${name.replace(/\s+/g, '-')}`}>
                        {typeof svgString === 'string' && <div dangerouslySetInnerHTML={{ __html: svgString }} />}
                    </div>
                ))}
            <div id="pdf-ashtakavarga-chart">
                {kundliData.ashtakavarga_svg && (
                    <AshtakavargaDetails
                        compositeSvgString={kundliData.ashtakavarga_svg}
                        tableData={kundliData.ashtakavarga || {}}
                        renderForPdf={true}
                    />
                )}
            </div>
        </div>
    );
};
// --- MAIN PAGE COMPONENT ---
export default function KundliReportPage({ kundliData }: KundliReportPageProps) {
    const [activeTab, setActiveTab] = useState('Basic');
    const [isProcessingPdf, setIsProcessingPdf] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [autoUploadStatus, setAutoUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [pdfTask, setPdfTask] = useState<PdfTask>(null);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const uploadAttempted = useRef(false);
    const kundliDataRef = useRef(kundliData);
    useEffect(() => {
        kundliDataRef.current = kundliData;
    }, [kundliData]);
    // useEffect(() => {
    //     const token = localStorage.getItem('accessToken');
    //     if (token) {
    //         setIsLoggedIn(true);
    //     } else {
    //         router.push('/free-kundli');
    //     }
    // }, [router]);
    useEffect(() => {
        if (!pdfTask) return;
        const processPdfTask = async () => {
            setIsProcessingPdf(true);
            await new Promise(resolve => setTimeout(resolve, 100));
            const currentKundliData = kundliDataRef.current;
            if (!currentKundliData) {
                console.error("Cannot process PDF: Kundli data is not available.");
                setPdfTask(null);
                setIsProcessingPdf(false);
                return;
            }
            try {
                if (pdfTask === 'download') {
                    await generateKundliPdf(currentKundliData, { outputType: 'save' });
                // } else if (pdfTask === 'upload') {
                //     const userPhoneNumber = localStorage.getItem('userPhoneNumber');
                //     if (!userPhoneNumber) throw new Error("Phone number not found for S3 upload.");
                //     const phone_number = formatPhoneNumberTo10DigitsClient(userPhoneNumber);
                //     setAutoUploadStatus('uploading');
                //     const pdfBlob = await generateKundliPdf(currentKundliData, { outputType: 'blob' });
                //     if (pdfBlob) {
                //         const pdfBaseName = `Kundli-${currentKundliData.data.name?.replace(/\s+/g, '_') || 'Report'}-${Date.now()}.pdf`;
                //         const s3ObjectKey = `kundli-reports/${phone_number}/${pdfBaseName}`;
                //         await uploadPdfToS3(pdfBlob, s3ObjectKey, phone_number);
                //         // const accessToken = localStorage.getItem('accessToken');
                //         // if (!accessToken) {
                //         //     forceLogout();
                //         //     return;
                //         // }
                //         const sendReportResponse = await fetch('/api/send-report', {
                //             method: 'POST',
                //             headers: {
                //                 'Content-Type': 'application/json',
                //                 'Authorization': `Bearer ${accessToken}`
                //             },
                //             body: JSON.stringify({
                //                 phoneNumber: userPhoneNumber,
                //                 s3Key: s3ObjectKey,
                //                 userName: currentKundliData.data.name || 'User',
                //                 pdfFileName: pdfBaseName
                //             }),
                //         });
                //         if (sendReportResponse.status === 401) {
                //             forceLogout();
                //             return;
                //         }
                //         if (!sendReportResponse.ok) {
                //             throw new Error("Sending the report failed.");
                //         }
                //         setAutoUploadStatus('success');
                //     } else {
                //         throw new Error("PDF generation for upload returned no data.");
                //     }
                // }
                }
            } catch (error) {
                console.error(`Failed to process PDF task (${pdfTask}):`, error);
                if (pdfTask === 'download') {
                    alert("An error occurred while generating the PDF. Please try again.");
                // } else {
                //     setAutoUploadStatus('error');
                }
            } finally {
                setIsProcessingPdf(false);
                setPdfTask(null);
            }
        };
        processPdfTask();
    }, [pdfTask]);
    // useEffect(() => {
    //     if (kundliData && !uploadAttempted.current) {
    //         const userPhoneNumber = localStorage.getItem('userPhoneNumber');
    //         if (userPhoneNumber) {
    //             uploadAttempted.current = true;
    //             setPdfTask('upload');
    //         } else {
    //             console.warn("S3 auto-upload skipped: phone number not found in local storage.");
    //         }
    //     }
    // }, [kundliData]);
    
    const handleDownloadPdf = () => {
        if (!kundliData) {
            alert("No Kundli data available to download.");
            return;
        }
        setPdfTask('download');
    };
    // const handleLogout = async () => {
    //     setLoadingLogout(true);
    //     const accessToken = localStorage.getItem('accessToken');
    //     const phoneNumber = localStorage.getItem('userPhoneNumber');
    //     if (accessToken && phoneNumber) {
    //         try {
    //             const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;
    //             await fetch(`${apiBaseUrl}/horoscope/logout`, {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
    //                 body: JSON.stringify({ phone_number: phoneNumber }),
    //             });
    //         } catch (error) { console.error('Failed to logout on server:', error); }
    //     }
        
    //     // forceLogout();
    //     // setLoadingLogout(false);
    // };
    const tabs = ['Basic', 'Kundli', 'Charts', 'Yogas', 'Ashtakvarga', 'Report'];
    const renderContent = () => {
        if (!kundliData) return <div className="text-center p-10">Please generate a Kundli.</div>;
        switch (activeTab) {
            case 'Basic':
                return <div>{kundliData.basic_details && <BasicDetailsContent kundliData={kundliData.basic_details} />}</div>;
            case 'Kundli': return <div><KundliTabContent kundliData={kundliData} /></div>;
            case 'Charts': return <div>{kundliData.charts && <ChartDetails kundliData={kundliData.charts} />}</div>;
            case 'Yogas': return <div>{kundliData.yogas && <YogasDetails kundliData={kundliData.yogas} />}</div>;
            case 'Ashtakvarga':
                return <div>{kundliData && <AshtakavargaDetails compositeSvgString={kundliData.ashtakavarga_svg} tableData={kundliData.ashtakavarga_data} />}</div>;
            // case 'Dosha':
            //     return <div>{kundliData.dosha && <DoshaDetails kundlidata={kundliData.dosha} />}</div>;
            // case 'Summary': return <div><SummaryDetails kundliData={kundliData.summary} /></div>
            case 'Report': return <div>{kundliData.report && <ReportDetails kundliData={kundliData.report} />}</div>;
            default: return <div className="text-center p-10">{activeTab} Coming Soon.</div>;
        }
    };
    // const AutoUploadStatusIndicator = () => {
    //     if (autoUploadStatus === 'uploading' || (isProcessingPdf && pdfTask === 'upload')) return <div className="flex items-center text-sm text-gray-500"><Loader className="animate-spin h-4 w-4 mr-2" />Saving report to your profile...</div>;
    //     if (autoUploadStatus === 'success') return <div className="flex items-center text-sm text-green-600"><CheckCircle className="h-4 w-4 mr-2" />Success! Your report is now available on WhatsApp.</div>;
    //     if (autoUploadStatus === 'error') return <div className="flex items-center text-sm text-red-600"><XCircle className="h-4 w-4 mr-2" />Failed to save report. Please try again.</div>;
    //     return null;
    // };
    return (
        <div className="bg-background min-h-screen p-2 sm:p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                        {/* <UserStatus isLoggedIn={isLoggedIn} userName={kundliData?.data?.name} onLogout={handleLogout} /> */}
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                            <a href="/free-kundli" className="hover:text-orange-600">Free Kundli</a>
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1" />
                            <span className="font-semibold text-gray-700">Kundli Details</span>
                        </div>
                        {/* <div className="mt-2"><AutoUploadStatusIndicator /></div> */}
                    </div>
                    <div className="flex gap-2 sm:gap-3 self-start sm:self-auto">
                        <button
                            onClick={handleDownloadPdf}
                            disabled={!kundliData || isProcessingPdf || loadingLogout}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:px-4 bg-green-500 text-white rounded-lg shadow-md text-xs sm:text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">{isProcessingPdf && pdfTask === 'download' ? 'Downloading...' : 'Download PDF'}</span>
                            <span className="sm:hidden">PDF</span>
                        </button>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto p-1 sm:p-2">
                            {tabs.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none ${activeTab === tab ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400'}`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
                
                <div className="mt-2 sm:mt-4">
                    {renderContent()}
                </div>
                {isProcessingPdf && <PdfRenderComponent kundliData={kundliData} />}
            </div>
        </div>
    );
}