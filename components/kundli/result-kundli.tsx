import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Download, UserCheck, LogOut, ChevronDown, CheckCircle, XCircle, Loader } from 'lucide-react';

import BasicDetailsContent from '@/components/kundli/basic-details';
import KundliTabContent from '@/components/kundli/kundli-details';
import { generateKundliPdf, KundliData } from './pdf-export';
import DoshaDetails from './dosha-details';
import { WhatsAppCtaBanner } from '@/components/banners/Whatsapp-banner';
import { uploadPdfToS3 } from './report-pdf';

// --- Interfaces and Components (No changes) ---

interface KundliReportPageProps {
    kundliData: KundliData;
}
interface UserStatusProps {
    isLoggedIn: boolean;
    userName?: string;
    onLogout: () => void;
}
const UserStatus: React.FC<UserStatusProps> = ({ isLoggedIn, userName, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isLoggedIn) return null;

    return (
        <div ref={dropdownRef} className="relative inline-block text-left mb-2">
            <div>
                <button type="button" onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <UserCheck className="mr-2 h-5 w-5 text-green-500" />
                    {userName || 'Logged In'}
                    <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- FIX: A type to define the kind of PDF task to perform ---
type PdfTask = 'download' | 'upload' | null;

// --- Main Page Component ---
export default function KundliReportPage({ kundliData }: KundliReportPageProps) {
    const [activeTab, setActiveTab] = useState('Basic');
    const [isProcessingPdf, setIsProcessingPdf] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [autoUploadStatus, setAutoUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const router = useRouter();
    const uploadAttempted = useRef(false);

    // --- FIX: State to manage the PDF generation task ---
    const [pdfTask, setPdfTask] = useState<PdfTask>(null);
    
    // This ref holds a stable reference to kundliData to avoid useEffect dependency issues.
    const kundliDataRef = useRef(kundliData);
    useEffect(() => {
        kundliDataRef.current = kundliData;
    }, [kundliData]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) setIsLoggedIn(true);
    }, []);
    
    // --- FIX: This new useEffect reliably handles PDF generation ---
    // --- FIX: This new useEffect reliably handles PDF generation ---
    useEffect(() => {
        // Only run if there is a task in the queue
        if (!pdfTask) return;
        function formatPhoneNumberTo10DigitsClient(phone: string): string {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');

    // If the number starts with '91' and is 12 digits long (91 + 10 digits),
    // then remove the '91'.
    if (digitsOnly.startsWith('91') && digitsOnly.length === 12) {
        return digitsOnly.slice(2); // Remove the first two characters ('91')
    }

    // If the number is longer than 10 digits (and didn't match the '91' case),
    // or is exactly 10 digits, return the last 10 digits.
    if (digitsOnly.length >= 10) {
        return digitsOnly.slice(-10);
    }

    // If the number is less than 10 digits, return it as is.
    return digitsOnly;
}

        const processPdfTask = async () => {
            setIsProcessingPdf(true);
            
            // A minimal timeout allows the browser to paint the rendered components before capture.
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
                } else if (pdfTask === 'upload') {
                    const userPhoneNumber = localStorage.getItem('userPhoneNumber');
                    if (!userPhoneNumber) throw new Error("Phone number not found for S3 upload.");
                    const phone_number = formatPhoneNumberTo10DigitsClient(userPhoneNumber)
                    
                    setAutoUploadStatus('uploading');
                    const pdfBlob = await generateKundliPdf(currentKundliData, { outputType: 'blob' });

                    if (pdfBlob) {
                        // **CHANGE 3: Construct the S3 Object Key**
                        // This `pdfBaseName` is just the file name (e.g., Kundli-John_Doe-167888888.pdf)
                        const pdfBaseName = `Kundli-${currentKundliData.data.name?.replace(/\s+/g, '_') || 'Report'}-${Date.now()}.pdf`;
                        
                        // **CRITICAL: Construct the full S3 key (path within your bucket)**
                        // This must match where `uploadPdfToS3` actually places the file,
                        // and what `/api/sent-report` will expect to find.
                        // Example: `kundli-reports/{normalized_phone}/{pdfBaseName}`
                        const s3ObjectKey = `kundli-reports/${phone_number}/${pdfBaseName}`; 
                        await uploadPdfToS3(pdfBlob, s3ObjectKey, phone_number);                         // -> REVIEW AND ADJUST `kundli-reports/` if your S3 bucket structure is different.


                        const sendReportResponse = await fetch('/api/send-report', { // Verify this API endpoint path
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                phoneNumber: userPhoneNumber, // The normalized phone number for the WhatsApp API
                                s3Key: s3ObjectKey,           // Send the S3 Key to the backend for signed URL generation
                                userName: currentKundliData.data.name || 'User',
                                pdfFileName: pdfBaseName      // The filename for the WhatsApp attachment
                            }),
                        });
        
                        setAutoUploadStatus('success');
                    } else {
                        throw new Error("PDF generation for upload returned no data.");
                    }
                }
            } catch (error) {
                console.error(`Failed to process PDF task (${pdfTask}):`, error);
                if (pdfTask === 'upload') {
                    setAutoUploadStatus('error');
                } else {
                    alert("An error occurred while generating the PDF. Please try again.");
                }
            } finally {
                // Reset the task and processing state, which hides the rendering div
                setIsProcessingPdf(false);
                setPdfTask(null);
            }
        };

        processPdfTask();
    }, [pdfTask]); // This effect now ONLY runs when `pdfTask` changes.


    useEffect(() => {
        if (kundliData && !uploadAttempted.current) {
            const userPhoneNumber = localStorage.getItem('userPhoneNumber');
            if (userPhoneNumber) {
                uploadAttempted.current = true;
                // Set the task to 'upload' to kick off the generation and upload process
                setPdfTask('upload');
            } else {
                console.warn("S3 auto-upload skipped: phone number not found in local storage.");
            }
        }
    }, [kundliData]);
        const [downloadingSignedUrl, setDownloadingSignedUrl] = useState(false); 
    const [currentSignedUrlForDownload, setCurrentSignedUrlForDownload] = useState<string | null>(null); 

    const fetchSignedUrlForDownload = async (s3Key: string) => {
        setDownloadingSignedUrl(true);
        try {
            const response = await fetch('/api/generate-signed-url', { // Ensure this API route exists and is correct
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ s3Key, expiresInSeconds: 86400 }), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get signed URL from API.');
            }

            const data = await response.json();
            // console.log(`[CLIENT] Generated Signed URL for Download: ${data.signedUrl}`);

            setCurrentSignedUrlForDownload(data.signedUrl); 
            return data.signedUrl; 

        } catch (error) {
            console.error('Error fetching signed URL for download:', error);
            alert(`Failed to get download link: ${(error as Error).message}`);
            setCurrentSignedUrlForDownload(null);
            return null;
        } finally {
            setDownloadingSignedUrl(false);
        }
    };





    const handleDownloadPdf = () => {
        if (!kundliData) {
            alert("No Kundli data available to download.");
            return;
        }
        // Set the task to 'download', which triggers the main useEffect
        setPdfTask('download');
    };

    // Other functions and UI components remain the same
    const tabs = ['Basic', 'Kundli', 'Dosha'];
    const handleLogout = async () => {
        setLoadingLogout(true);
        const accessToken = localStorage.getItem('accessToken');
        const phoneNumber = localStorage.getItem('userPhoneNumber');
        if (accessToken && phoneNumber) {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;
                await fetch(`${apiBaseUrl}/horoscope/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` }, body: JSON.stringify({ phone_number: phoneNumber }), });
            } catch (error) { console.error('Failed to logout on server:', error); }
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userPhoneNumber');
        setIsLoggedIn(false);
        setLoadingLogout(false);
        alert("You have been logged out successfully.");
        router.push('/');
    };
    const renderContent = () => {
        if (!kundliData) return <div className="text-center p-10 bg-white rounded-lg shadow-md mt-6">Please generate a Kundli to see the details.</div>;
        const sharedBanner = <WhatsAppCtaBanner phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918197503574"} />;
        switch (activeTab) {
            case 'Basic': return <div>{sharedBanner}<BasicDetailsContent kundliData={kundliData} /></div>;
            case 'Kundli': return <div>{sharedBanner}<KundliTabContent kundliData={kundliData} /></div>;
            case 'Dosha': return <div>{sharedBanner}<DoshaDetails dosha={kundliData.dosha} /></div>;
            default: return <div className="text-center p-10 bg-white rounded-lg shadow-md mt-6"> {activeTab} Coming Soon.</div>;
        }
    };
    const AutoUploadStatusIndicator = () => {
        if (autoUploadStatus === 'uploading' || (isProcessingPdf && pdfTask === 'upload')) return <div className="flex items-center text-sm text-gray-500"><Loader className="animate-spin h-4 w-4 mr-2" />Saving report to your profile...</div>;
        if (autoUploadStatus === 'success') return <div className="flex items-center text-sm text-green-600"><CheckCircle className="h-4 w-4 mr-2" />Success! Your report is now available on WhatsApp.</div>;
        if (autoUploadStatus === 'error') return <div className="flex items-center text-sm text-red-600"><XCircle className="h-4 w-4 mr-2" />Failed to save report.</div>;
        return null;
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto"> 
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                    <div>
                        <UserStatus isLoggedIn={isLoggedIn} userName={kundliData?.data?.name} onLogout={handleLogout} />
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <a href="/free-kundli" className="hover:text-indigo-600">Free Kundli</a>
                            <ChevronRight className="h-4 w-4 mx-1" />
                            <span className="font-semibold text-gray-700">Kundli Details</span>
                        </div>
                        <div className="mt-2"><AutoUploadStatusIndicator /></div>
                    </div>
                    <div className="flex gap-3 self-start sm:self-auto">
                        <button onClick={handleDownloadPdf} disabled={isProcessingPdf || !kundliData || loadingLogout} className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-green-500 text-white rounded-lg shadow-md text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed">
                            <Download className="h-4 w-4" />
                            {isProcessingPdf && pdfTask === 'download' ? 'Downloading...' : 'Download PDF'}
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto p-2">
                            {tabs.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-3 px-4 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none ${ activeTab === tab ? 'bg-orange-400 text-gray-800 shadow-sm' : 'text-gray-600 hover:bg-orange-100 hover:text-gray-700' }`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
                <div className="mt-4">
                    {renderContent()}
                </div>

                {/* --- FIX: This hidden div is now reliably controlled by the pdfTask state --- */}
                {pdfTask && (
                    <div style={{ position: 'absolute', left: '-9999px', width: '1024px', zIndex: -1 }}>
                       <KundliTabContent kundliData={kundliData} />
                   </div>
                )}
            </div>
        </div>
    );
}
