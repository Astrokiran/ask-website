'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useJsApiLoader } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { ServicesSection } from "@/components/services-section";
import { FormSection } from './components/FormSection'; 
import Image from 'next/image';
import { DailyHoroscopeCta } from "@/components/banners/Daily-horoscope";

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

  const tabs = [{ id: 'man', label: 'Boy Details' }, { id: 'woman', label: 'Girl Details' }];

  return (
    <div className="min-h-screen flex flex-col font-sans">
             <NavBar />
             <DailyHoroscopeCta phoneNumber={"918197503574"}/>
        <main className="flex-grow container mx-auto px-4 pt-4 pb-12 md:pt-6 md:pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* COLUMN 1: Form Container */}
              <motion.div
                className="w-full max-w-lg mx-auto lg:max-w-none lg:mx-0"
                initial={{ opacity: 0, x: -50 }} // Animate from left
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="flex relative border-b border-gray-200">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'man' | 'woman')}
                        className={`${activeTab === tab.id ? 'text-orange-600' : 'text-gray-500 hover:text-orange-500'}
                            w-1/2 py-4 text-center font-bold text-lg transition-colors duration-300 relative focus:outline-none`}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600"
                            layoutId="underline"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
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
                      </motion.div>
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                    >
                      {loading ? 'Calculating...' : 'Match Kundli'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>

              {/* COLUMN 2: Image and Text */}
              <div className="hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: 50 }} // Animate from right
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Seeking a Harmonious Union?
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Unveil your potential for marital bliss with our detailed Kundli Matching analysis. Discover key insights into compatibility, relationship dynamics, and potential challenges.
                    </p>
                  </div>
                  <Image
                    src="/kundli-match2.png"
                    alt="Couple getting married"
                    width={500}
                    height={350}
                    className="rounded-lg shadow-md"
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                </motion.div>
              </div>
            </div>
          </main>
      <ServicesSection />
      <Footer />
    </div>
  );
}