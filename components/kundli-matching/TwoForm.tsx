// pages/kundli-matching.tsx or a similar page file, named TwoForm.tsx per your request

'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { ServicesSection } from "@/components/services-section";

// --- TYPE DEFINITIONS ---
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

// --- CONSTANTS ---
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

// --- INITIAL STATE ---
const initialFormState: BirthInputState = {
  name: '',
  day: '',
  month: '',
  year: '',
  hour: '',
  minute: '',
  second: '',
  ampm: 'AM',
  pob: '',
};

// --- MAIN PAGE COMPONENT ---
export default function KundliMatchingPage() {
  const router = useRouter();
  
  // State for active tab and form data
  const [activeTab, setActiveTab] = useState<'man' | 'woman'>('man');
  const [manData, setManData] = useState<BirthInputState>(initialFormState);
  const [womanData, setWomanData] = useState<BirthInputState>(initialFormState);

  // State for formatted data, validation, and loading
  const [formattedManDetails, setFormattedManDetails] = useState<Partial<FormattedBirthDetails>>({});
  const [formattedWomanDetails, setFormattedWomanDetails] = useState<Partial<FormattedBirthDetails>>({});
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({ man: {}, woman: {} });
  const [loading, setLoading] = useState(false);

  // Google Maps Autocomplete state
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });
  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- DATA FORMATTING EFFECTS ---
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
  
  // --- GOOGLE MAPS AUTOCOMPLETE HANDLERS ---
  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocompleteInstance(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocompleteInstance !== null) {
      const place = autocompleteInstance.getPlace();
      const formattedAddress = place.formatted_address || '';
      const setData = activeTab === 'man' ? setManData : setWomanData;
      setData(prev => ({ ...prev, pob: formattedAddress }));
      clearError('pob');
    }
  };

  // --- FORM HANDLERS ---
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
        { key: 'man' as const, details: formattedManDetails, name: "Man's" },
        { key: 'woman' as const, details: formattedWomanDetails, name: "Woman's" }
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
        if (Object.keys(errors.man).some(k => !!errors.man[k])) {
            setActiveTab('man');
        } else if (Object.keys(errors.woman).some(k => !!errors.woman[k])) {
            setActiveTab('woman');
        }
        return;
    }
    setLoading(true);

    try {
        // Helper function to format time to HH:MM (24-hour)
        const formatTimeForApi = (hourStr: string, minuteStr: string, ampm: string): string => {
            let hour = parseInt(hourStr, 10);
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) { // Handle midnight case
                hour = 0;
            }
            const formattedHour = hour.toString().padStart(2, '0');
            return `${formattedHour}:${minuteStr}`;
        };

        // Create the payload with the correct date (DD/MM/YYYY) and time (HH:MM) formats
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

        // Store the correctly formatted payload and navigate
        sessionStorage.setItem('kundliMatchingApiInput', JSON.stringify(apiPayload));
        router.push('/kundli-match/results');

    } catch (error) {
        console.error("Error creating payload or navigating:", error);
        setLoading(false);
    }
};
  // Effect to handle Autocomplete input on tab switch
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = activeTab === 'man' ? manData.pob : womanData.pob;
    }
  }, [activeTab, manData.pob, womanData.pob]);

  // --- RENDER FUNCTION for form fields ---
  const renderFormFields = (person: 'man' | 'woman') => {
    const data = person === 'man' ? manData : womanData;
    const errorSet = errors[person] || {};

    return (
        <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errorSet.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={`Enter ${person === 'man' ? 'man' : 'woman'}'s name`}
              />
              {errorSet.name && <p className="text-red-500 text-xs mt-1">{errorSet.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <div className="grid grid-cols-3 gap-3">
                <select value={data.day} onChange={(e) => handleInputChange('day', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errorSet.dob ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Day</option>
                  {dayOptions.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
                <select value={data.month} onChange={(e) => handleInputChange('month', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errorSet.dob ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Month</option>
                  {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <select value={data.year} onChange={(e) => handleInputChange('year', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errorSet.dob ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Year</option>
                  {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              {errorSet.dob && <p className="text-red-500 text-xs mt-1 col-span-3">{errorSet.dob}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time of Birth</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select value={data.hour} onChange={(e) => handleInputChange('hour', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errorSet.tob ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Hour</option>
                  {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={data.minute} onChange={(e) => handleInputChange('minute', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errorSet.tob ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Minute</option>
                  {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={data.second} onChange={(e) => handleInputChange('second', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border-gray-300`}>
                  <option value="">Second</option>
                  {secondOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={data.ampm} onChange={(e) => handleInputChange('ampm', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errorSet.tob ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              {errorSet.tob && <p className="text-red-500 text-xs mt-1 col-span-4">{errorSet.tob}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
              {isLoaded && !loadError ? (
                <Autocomplete
                  onLoad={onLoadAutocomplete}
                  onPlaceChanged={onPlaceChanged}
                  options={{ types: ['(cities)'] }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    defaultValue={data.pob}
                    onChange={(e) => handleInputChange('pob', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errorSet.pob ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Type and select a city"
                  />
                </Autocomplete>
              ) : (
                <input type="text" placeholder="Map is loading..." disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100"/>
              )}
              {errorSet.pob && <p className="text-red-500 text-xs mt-1">{errorSet.pob}</p>}
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <NavBar />

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center space-y-10">
        <div className="text-center max-w-3xl">
             <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-4">
                Kundli Matching
             </h1>
             {/* <p className="text-gray-600 text-lg">
                Check the cosmic compatibility between you and your partner. Enter the birth details for both individuals to generate a detailed horoscope matching report.
             </p> */}
        </div>

        {/* --- Form Container --- */}
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex">
                <button
                    onClick={() => setActiveTab('man')}
                    className={`w-1/2 py-4 text-center font-bold text-lg transition-colors duration-300 ${activeTab === 'man' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Boy Details
                </button>
                <button
                    onClick={() => setActiveTab('woman')}
                    className={`w-1/2 py-4 text-center font-bold text-lg transition-colors duration-300 ${activeTab === 'woman' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Girl Details
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                {activeTab === 'man' ? renderFormFields('man') : renderFormFields('woman')}
                
                <button
                  type="submit"
                  className="w-full mt-8 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition duration-300 ease-in-out shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Matching Kundli...
                    </span>
                  ) : (
                    'Match Kundli'
                  )}
                </button>
            </form>
        </div>
      </main>

      <ServicesSection />
      <Footer />
    </div>
  );
}