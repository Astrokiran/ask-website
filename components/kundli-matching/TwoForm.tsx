'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useJsApiLoader } from '@react-google-maps/api';
import { ServicesSection } from "@/components/services-section";
import { FormSection } from './components/Formsection'; 
import Image from 'next/image';
import { DailyHoroscopeCta } from "@/components/banners/Daily-horoscope";
import { Briefcase, Heart, Sparkles, Star } from 'lucide-react';


const SectionItem = ({ icon, title, text }) => (
  <div
    className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-sm"
  >
    <div className="flex items-center gap-2 sm:gap-3 mb-2">
      {icon}
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base">
      {text}
    </p>
  </div>
);

const kundaliSections = [
  {
    icon: <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "In Business",
    text: "Just like a marriage, a business partnership thrives on trust, balance, and cooperation. Kundali matching can show whether partners share compatible energies for decision-making, financial growth, and handling challenges. It reduces the chances of conflict and helps align visions for long-term success.",
  },
  {
    icon: <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "In Relationships",
    text: "For friendships, love, or family ties, Kundali matching highlights emotional compatibility, communication styles, and mutual understanding. It helps strengthen bonds by identifying potential areas of friction early on, so they can be addressed with awareness.",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "In Short",
    text: "Kundali matching acts like a cosmic compatibility test ensuring harmony, reducing conflicts, and enhancing the chances of prosperity and happiness in both business and personal life.",
  },
];


interface BirthInputState {
  name: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
  ampm: string;
  pob: string;
}

interface FormattedBirthDetails {
  name: string;
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM:SS (24-hour)
  pob: string;
}

const libraries: ('places')[] = ['places'];
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);
const monthOptions = [
  { value: '1', label: 'January' }, { value: '2', label: 'February' },
  { value: '3', label: 'March' }, { value: '4', label: 'April' },
  { value: '5', label: 'May' }, { value: '6', label: 'June' },
  { value: '7', label: 'July' }, { value: '8', label: 'August' },
  { value: '9', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
];
const dayOptions = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const secondOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

const initialFormState: BirthInputState = {
  name: '', day: '', month: '', year: '', hour: '', minute: '', second: '', ampm: 'AM', pob: '',
};


export default function KundliMatchingPage() {
  const router = useRouter();
  const sharedBanner = <DailyHoroscopeCta phoneNumber={"918197503574"} />;

  
  // --- All your existing state and logic hooks remain here ---
  // (activeTab, manData, womanData, errors, loading, etc.)
  // The logic inside useEffect, validateForm, and handleSubmit is perfectly fine.
  const [activeTab, setActiveTab] = useState<'man' | 'woman'>('man');
  const [manData, setManData] = useState<BirthInputState>(initialFormState);
  const [womanData, setWomanData] = useState<BirthInputState>(initialFormState);
  const [formattedManDetails, setFormattedManDetails] = useState<Partial<FormattedBirthDetails>>({});
  const [formattedWomanDetails, setFormattedWomanDetails] = useState<Partial<FormattedBirthDetails>>({});
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({ man: {}, woman: {} });
  const [loading, setLoading] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // --- All event handlers (handleInputChange, handleSubmit, etc.) and useEffects remain unchanged ---
  useEffect(() => {
    const formatDetails = (data: BirthInputState, setData: React.Dispatch<React.SetStateAction<Partial<FormattedBirthDetails>>>) => {
      const { day, month, year, hour, minute, second, ampm, name, pob } = data;
      
      if (day && month && year) {
        const formattedMonth = month.padStart(2, '0');
        const formattedDay = day.padStart(2, '0');
        setData(prev => ({ ...prev, dob: `${year}-${formattedMonth}-${formattedDay}` }));
      } else {
        setData(prev => ({ ...prev, dob: undefined }));
      }

      if (hour && minute) {
        let hour24 = parseInt(hour, 10);
        if (ampm === 'PM' && hour24 < 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;

        const formattedHour = hour24.toString().padStart(2, '0');
        const formattedMinute = minute.padStart(2, '0');
        const formattedSecond = (second || '00').padStart(2, '0');
        setData(prev => ({ ...prev, tob: `${formattedHour}:${formattedMinute}:${formattedSecond}` }));
      } else {
        setData(prev => ({ ...prev, tob: undefined }));
      }
      
      setData(prev => ({ ...prev, name, pob }));
    };

    formatDetails(manData, setFormattedManDetails);
    formatDetails(womanData, setFormattedWomanDetails);
  }, [manData, womanData]);

  const handleInputChange = (field: keyof BirthInputState, value: string) => {
    const setData = activeTab === 'man' ? setManData : setWomanData;
    setData(prev => ({ ...prev, [field]: value }));
    clearError(field);
  };
  
  const clearError = (field: keyof BirthInputState) => {
    setErrors(prev => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], [field]: '' }
    }));
  }

  const validateForm = () => {
    const newErrors: { man: Record<string, string>, woman: Record<string, string> } = { man: {}, woman: {} };
    const detailsToValidate = [
        { key: 'man' as const, details: formattedManDetails, name: "Boy's" },
        { key: 'woman' as const, details: formattedWomanDetails, name: "Girl's" }
    ];

    let isValid = true;
    for (const item of detailsToValidate) {
        if (!item.details.name?.trim()) {
            newErrors[item.key].name = `${item.name} name is required.`;
            isValid = false;
        }
        if (!item.details.dob) {
            newErrors[item.key].dob = `${item.name} full date of birth is required.`;
            isValid = false;
        }
        if (!item.details.tob) {
            newErrors[item.key].tob = `${item.name} time of birth is required.`;
            isValid = false;
        }
        if (!item.details.pob?.trim()) {
            newErrors[item.key].pob = `${item.name} place of birth is required.`;
            isValid = false;
        }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        const manErrors = Object.keys(errors.man).length > 0 && Object.values(errors.man).some(v => v);
        const womanErrors = Object.keys(errors.woman).length > 0 && Object.values(errors.woman).some(v => v);

        if (manErrors) {
            setActiveTab('man');
        } else if (womanErrors) {
            setActiveTab('woman');
        }
        return;
    }
    setLoading(true);

    try {
        const formatTimeForApi = (hourStr: string, minuteStr: string, ampm: string): string => {
            let hour = parseInt(hourStr, 10);
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
            const formattedHour = hour.toString().padStart(2, '0');
            return `${formattedHour}:${minuteStr}`;
        };

        const apiPayload = {
            groom: {
                name: manData.name,
                date_of_birth: `${manData.day}/${manData.month}/${manData.year}`,
                time_of_birth: formatTimeForApi(manData.hour, manData.minute, manData.ampm),
                place_of_birth: manData.pob,
            },
            bride: {
                name: womanData.name,
                date_of_birth: `${womanData.day}/${womanData.month}/${womanData.year}`,
                time_of_birth: formatTimeForApi(womanData.hour, womanData.minute, womanData.ampm),
                place_of_birth: womanData.pob,
            },
        };
        sessionStorage.setItem('kundliMatchingApiInput', JSON.stringify(apiPayload));
        router.push('/kundli-match/results');
    } catch (error) {
        console.error("Error creating payload or navigating:", error);
        setLoading(false);
    }
  };

  const tabs = [{ id: 'man', label: 'Your Details' }, { id: 'woman', label: "Partner's Details" }];

  return (
    <div className="w-full font-sans">
      <DailyHoroscopeCta phoneNumber={"918197503574"}/>
      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-2 sm:pt-4 pb-8 sm:pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start">
          {/* COLUMN 1: Form Container */}
          <div
            className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto lg:max-w-none lg:mx-0"
          >
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="flex relative border-b border-gray-200 dark:border-gray-700">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'man' | 'woman')}
                        className={`${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}
                            w-1/2 py-3 sm:py-4 text-center font-semibold text-base sm:text-lg transition-colors duration-200 relative focus:outline-none`}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
                      <div
                        key={activeTab}
                        className="transition-all duration-300"
                      >
                        {activeTab === 'man' ? (
                          <FormSection
                            personType="man"
                            data={manData}
                            errors={errors.man}
                            handleInputChange={handleInputChange}
                            isGoogleMapsLoaded={isLoaded && !loadError}
                          />
                        ) : (
                          <FormSection
                            personType="woman"
                            data={womanData}
                            errors={errors.woman}
                            handleInputChange={handleInputChange}
                            isGoogleMapsLoaded={isLoaded && !loadError}
                          />
                        )}
                      </div>

                    <button
                      type="submit"
                      className="w-full mt-6 sm:mt-8 bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      disabled={loading}
                    >
                      {loading ? 'Calculating...' : 'Match Kundli'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="block">
                <div
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white leading-tight">
                      Kundali Matching: Unlock Success in Relationships
                    </h2>
                    <Star className="h-8 w-8 text-blue-600 dark:text-blue-400 hidden md:block" />
                  </div>
                  <p className="text-foreground leading-relaxed text-sm md:text-base mb-6">
                    Kundali matching, also known as horoscope compatibility, is not just for marriage—it can also be a powerful guide in business partnerships and personal relationships. By analyzing the planetary positions in two individuals’ birth charts, Kundali matching helps reveal compatibility, strengths, and challenges between them.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {kundaliSections.map((section, index) => (
                      <SectionItem
                        key={index}
                        icon={section.icon}
                        title={section.title}
                        text={section.text}
                      />
                    ))}
                  </div>
                  
                </div>
              </div>
            </div>
        </main>
      <ServicesSection />
    </div>
  );
}