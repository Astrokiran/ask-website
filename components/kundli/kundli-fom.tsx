import React, { useState, useEffect, useRef } from 'react';
import { NavBar } from '@/components/nav-bar'; 
import { Footer } from '@/components/footer';
import { useRouter } from 'next/navigation'; 
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { ServicesSection } from "@/components/services-section"
import { WhatsAppCtaBanner } from '@/components/banners/Whatsapp-banner';

interface BirthDetails {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
}
interface KundliData {
  birthDetails: BirthDetails;
  basicInfo: Array<{ label: string; value: string }>;
  planetaryPositions: Array<{ planet: string; sign: string; house: string; degree: string }>;
  predictions: {
    career: string;
    marriage: string;
    health: string;
  };
  remedies: string[];
}

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places'];

export default function KundliPage() { 
  const router = useRouter(); 
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    tob: '',
    pob: '',
  });

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedSecond, setSelectedSecond] = useState(''); 
  const [selectedAmPm, setSelectedAmPm] = useState('AM'); 


  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null);
  const pobSuggestionsRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91'); 
  const [otp, setOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const countryCodes = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+1', name: 'Canada', flag: '🇨🇦' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name==='gender') {
      localStorage.setItem('userGender', value);
    }
    if (errors[name]) {
      setErrors((prevErrors: Record<string, string>) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocompleteInstance(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocompleteInstance !== null) {
      const place = autocompleteInstance.getPlace();
      const formattedAddress = place.formatted_address || '';
      setFormData(prev => ({ ...prev, pob: formattedAddress }));
      if (errors.pob) {
        setErrors(prevErrors => ({ ...prevErrors, pob: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!selectedDay || !selectedMonth || !selectedYear) {
      newErrors.dob = 'Full Date of Birth (Day, Month, Year) is required.';
    } else {
      const year = parseInt(selectedYear, 10);
      const month = parseInt(selectedMonth, 10); 
      const day = parseInt(selectedDay, 10);
      const date = new Date(year, month - 1, day); 

      if (
        !(date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day)
      ) {
        newErrors.dob = 'Invalid date (e.g., Feb 30 is not a valid date).';
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dob)) {
        newErrors.dob = 'Internal error: DOB format incorrect.';
      }
    }

    if (!selectedHour || !selectedMinute) { 
      newErrors.tob = 'Time of Birth (Hour and Minute) is required.';
    } else {
      const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/; 
      if (!timeRegex.test(formData.tob)) {
        newErrors.tob = 'Internal error: TOB format incorrect.';
      }
    }
    if (!formData.pob.trim()) {
      newErrors.pob = 'Place of Birth is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const formattedMonth = selectedMonth.padStart(2, '0');
      const formattedDay = selectedDay.padStart(2, '0');
      setFormData(prev => ({ ...prev, dob: `${selectedYear}-${formattedMonth}-${formattedDay}` }));
      if (errors.dob) {
        setErrors(prevErrors => ({ ...prevErrors, dob: '' }));
      }
    } else {
      if (formData.dob) {
        setFormData(prev => ({ ...prev, dob: '' }));
      }
    }
  }, [selectedDay, selectedMonth, selectedYear, errors.dob, formData.dob]);

  useEffect(() => {
    if (selectedHour && selectedMinute) {
      let hour24 = parseInt(selectedHour, 10);

      if (selectedAmPm === 'PM' && hour24 < 12) {
        hour24 += 12;
      }
      if (selectedAmPm === 'AM' && hour24 === 12) { // Midnight case
        hour24 = 0;
      }

      const formattedHour = hour24.toString().padStart(2, '0');
      const formattedMinute = selectedMinute.padStart(2, '0');
      let tobString = `${formattedHour}:${formattedMinute}`;

      if (selectedSecond) {
        tobString += `:${selectedSecond.padStart(2, '0')}`;
      } else {
        tobString += `:00`; 
      }

      setFormData(prev => ({ ...prev, tob: tobString }));
      if (errors.tob) {
        setErrors(prevErrors => ({ ...prevErrors, tob: '' }));
      }
    } else {
      if (formData.tob) {
        setFormData(prev => ({ ...prev, tob: '' }));
      }
    }
  }, [selectedHour, selectedMinute, selectedSecond, selectedAmPm, errors.tob, formData.tob]);

  const generateKundli = async () => {
    setLoading(true);

    const [year, month, day] = formData.dob.split('-');
    const formattedDobForApi = `${day}/${month}/${year}`;

    const [hourStr, minuteStr] = formData.tob.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10); 
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; 
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0'); 
    const formattedTobForApi = `${formattedHour}:${formattedMinute}${ampm}`;

    const apiInputParams = {
      name: formData.name,
      date_of_birth: formattedDobForApi,
      time_of_birth: formattedTobForApi,
      place_of_birth: formData.pob,
    };

    try {
      sessionStorage.setItem('kundliApiInputParams', JSON.stringify(apiInputParams));
      router.push('/free-kundli/results'); 
    } catch (error) {
      console.error("Error storing Kundli data or navigating:", error);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoggedIn) {
      handleOpenLoginModal();
      return;
    }
    if (validateForm()) {
      generateKundli();
    }
  };

  const handleDatePartChange = (part: 'day' | 'month' | 'year', value: string) => {
    if (part === 'day') setSelectedDay(value);
    if (part === 'month') setSelectedMonth(value);
    if (part === 'year') setSelectedYear(value);

    if (errors.dob) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dob: '',
      }));
    }
  };

    const handleTimePartChange = (part: 'hour' | 'minute' | 'second' | 'ampm', value: string) => {
    if (part === 'hour') setSelectedHour(value);
    if (part === 'minute') setSelectedMinute(value);
    if (part === 'second') setSelectedSecond(value);
    if (part === 'ampm') setSelectedAmPm(value);

    if (errors.tob) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tob: '',
      }));
    }
  };

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
    setPhoneNumber(''); 
    setOtp('');
    setLoginError('');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      setLoginError('Please enter a valid 10-digit phone number.');
      return;
    }
    setLoginError('');
    setLoading(true);

    const phone_number = phoneNumber; 

    try {
      const apiBaseUrl ='http://localhost:9000'; 
      const response = await fetch(`${apiBaseUrl}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number }), 
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send OTP. Please try again.');
      }
      if (!data.success) {
        throw new Error(data.message + (data.whatsapp_api_response?.error ? ` (Reason: ${data.whatsapp_api_response.error})` : ''));
      }

      setShowLoginModal(false);
      setShowOtpModal(true);
    } catch (error) {
      console.error('Send OTP error:', error); 
      setLoginError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    if (!/^\d{4,6}$/.test(otp)) { 
      setLoginError('Please enter a valid OTP.');
      return;
    }
    setLoginError('');
    setLoading(true);

    const fullPhoneNumber = (selectedCountryCode + phoneNumber).replace('+', '');

    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/validate-otp`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              phone_number: fullPhoneNumber,
              otp_code: otp,
          }),
    });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'OTP verification failed. Please try again.');
        }

        if (data.data && data.data.access && data.data.refresh) {
            localStorage.setItem('accessToken', data.data.access);
            localStorage.setItem('refreshToken', data.data.refresh);
            localStorage.setItem('userPhoneNumber', fullPhoneNumber);

            setIsLoggedIn(true);
            setShowOtpModal(false);

            // Automatically submit the form after successful login
            if (validateForm()) {
              generateKundli();
            }

        } else {
            throw new Error('Received an invalid response from the server.');
        }

    } catch (error) {
      console.error('Verify OTP error:', error);
      setLoginError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };


  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowOtpModal(false);
    setLoginError(''); 
  };

  const handleLogout = async () => {
    setLoading(true); 
    const accessToken = localStorage.getItem('accessToken');
    const phoneNumber = localStorage.getItem('userPhoneNumber');
  
    if (accessToken && phoneNumber) {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;

        await fetch(`${apiBaseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ phone_number: phoneNumber }),
        });
      } catch (error) {
        console.error('Failed to logout on server:', error);
      }
    }
  
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userPhoneNumber');
    setIsLoggedIn(false);
    setLoading(false);
    alert("You have been logged out.");
  };
  
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

  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const secondOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));


  if (loadError) {
    console.error("Google Maps API load error:", loadError);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans"> 
      <NavBar />

      
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden md:flex">
          <div className="p-6 sm:p-8 md:w-3/5 flex flex-col justify-center border-r border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-6 text-center">
              Free Kundli Generation
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Enter your birth details to unlock insights into your destiny.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out ${
                    errors['name'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out ${
                    errors['gender'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors['gender'] && <p className="text-red-500 text-xs mt-1">{errors['gender']}</p>}
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    id="dob_day"
                    name="dob_day"
                    value={selectedDay}
                    onChange={(e) => handleDatePartChange('day', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.dob ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    id="dob_month"
                    name="dob_month"
                    value={selectedMonth}
                    onChange={(e) => handleDatePartChange('month', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.dob ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Month</option>
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                  <select
                    id="dob_year"
                    name="dob_year"
                    value={selectedYear}
                    onChange={(e) => handleDatePartChange('year', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.dob ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Year</option>
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {errors['dob'] && <p className="text-red-500 text-xs mt-1 col-span-3">{errors['dob']}</p>}
              </div>

              <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Time of Birth
                         </label>
                         {/* Changed to grid-cols-4 to fit AM/PM */}
                         <div className="grid grid-cols-2 md:gird-cols-4 gap-3">
                           <select
                             id="tob_hour"
                             name="tob_hour"
                             value={selectedHour}
                             onChange={(e) => handleTimePartChange('hour', e.target.value)}
                             className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                               errors.tob ? 'border-red-500' : 'border-gray-300'
                             }`}
                           >
                             <option value="">Hour</option>
                             {hourOptions.map(hour => (
                               <option key={hour} value={hour}>{hour}</option>
                             ))}
                           </select>
                           <select
                             id="tob_minute"
                             name="tob_minute"
                             value={selectedMinute}
                             onChange={(e) => handleTimePartChange('minute', e.target.value)}
                             className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                               errors.tob ? 'border-red-500' : 'border-gray-300'
                             }`}
                           >
                             <option value="">Minute</option>
                             {minuteOptions.map(minute => (
                               <option key={minute} value={minute}>{minute}</option>
                             ))}
                           </select>
                           <select
                             id="tob_second"
                             name="tob_second"
                             value={selectedSecond}
                             onChange={(e) => handleTimePartChange('second', e.target.value)}
                             className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                               errors.tob ? 'border-red-500' : 'border-gray-300' 
                             }`}
                           >
                             <option value="">Second (Optional)</option>
                             {secondOptions.map(second => (
                               <option key={second} value={second}>{second}</option>
                             ))}
                           </select>
                           <select
                             id="tob_ampm"
                             name="tob_ampm"
                             value={selectedAmPm}
                             onChange={(e) => handleTimePartChange('ampm', e.target.value)}
                             className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                               errors.tob ? 'border-red-500' : 'border-gray-300'
                             }`}
                           >
                             <option value="AM">AM</option>
                             <option value="PM">PM</option>
                           </select>
                         </div>
                         {errors['tob'] && <p className="text-red-500 text-xs mt-1 col-span-4">{errors['tob']}</p>}
                       </div>

              <div className="relative" ref={pobSuggestionsRef}>
                <label htmlFor="pob" className="block text-sm font-medium text-gray-700 mb-1">
                  Place of Birth
                </label>
                {isLoaded && !loadError ? (
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                      types: ['(cities)'], 
                    }}
                  >
                    <input
                      type="text"
                      id="pob"
                      name="pob" 
                      defaultValue={formData.pob}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out ${
                        errors['pob'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Type and select your city"
                    />
                  </Autocomplete>
                ) : (
                  <input type="text" id="pob" name="pob" value={formData.pob} onChange={handleChange} placeholder="Enter place of birth (Maps loading...)" className={`w-full px-4 py-2 border rounded-lg ${errors['pob'] ? 'border-red-500' : 'border-gray-300'}`} />
                )}
                {errors['pob'] && <p className="text-red-500 text-xs mt-1">{errors['pob']}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition duration-300 ease-in-out shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Kundli...
                  </span>
                ) : (
                  'Generate My Kundli'
                )}
              </button>
              {errors['form'] && <p className="text-red-500 text-center text-sm mt-2">{errors['form']}</p>}
            </form>
          </div>

          <div className="p-6 sm:p-8 md:w-2/5 flex flex-col justify-center bg-gradient-to-br from-orange-50 to-yellow-100 rounded-r-xl">
            <div className="text-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-center">What is a Kundli?</h2>
                <p className="mb-4 text-sm text-justify">
                    A Kundli, also known as a Janam Kundali or birth chart, is a fundamental tool in Vedic Astrology. It is an astrological chart prepared based on the exact date, time, and place of an individual's birth. This chart serves as a cosmic map, representing the specific positions of the sun, moon, planets, and other celestial bodies at the moment of birth.
                </p>
                <h3 className="text-xl font-semibold mb-3 text-center">Significance of a Kundli</h3>
                <p className="mb-4 text-sm text-justify">
                    It is believed that the planetary positions at your time of birth influence your personality, characteristics, relationships, career, health, and overall life path. A detailed analysis of the Kundli can provide deep insights into your strengths, weaknesses, potential opportunities, and challenges. It is often used for making important life decisions, understanding compatibility, and identifying remedial measures to mitigate negative planetary influences.
                </p>
                <h3 className="text-xl font-semibold mb-3 text-center">How It's Generated</h3>
                <p className="text-sm text-justify">
                    To create an accurate Kundli, three pieces of information are essential: your full date of birth, the precise time of birth, and the city of birth. Our system uses this data to perform complex astrological calculations, determining the Ascendant (Lagna) and the placement of planets across the 12 houses (Bhavas) of the zodiac, providing you with a personalized astrological blueprint.
                </p>
            </div>
        </div>
        </div>
        
      </main>
      
      <ServicesSection />

      <Footer />


      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Sign In</h2>
              <button onClick={handleCloseModals} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
            </div>
            <p className="text-gray-600 mb-5 text-sm">Enter your Whatsapp number. We'll send you an OTP to verify.</p>
            <div className="flex gap-2">
              <div className="w-1/3">
                <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <select
                  id="countryCode"
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className={`w-full px-2 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${loginError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-orange-500'}`}
                >
                  {countryCodes.map(country => (
                    <option key={country.code + country.name} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-2/3">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))} 
                placeholder="Enter mobile number"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out mb-2 ${loginError && !/^\d{10}$/.test(phoneNumber) ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-orange-500'}`}
              />
              </div>
            </div>
            {loginError && <p className="text-red-500 text-xs mb-4">{loginError}</p>}
            <button
              onClick={handleSendOtp} disabled={loading}
              className="w-full bg-orange-500 text-white py-3 mt-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-md disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
             <p className="text-xs text-gray-500 mt-5 text-center">
                By continuing, you agree to our <a href="/terms" className="text-orange-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Verify OTP</h2>
              <button onClick={handleCloseModals} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
            </div>
            <p className="text-gray-600 mb-1 text-sm">
              Check your WhatsApp for OTP.
              We have sent OTP to <span className="font-semibold text-gray-800">{selectedCountryCode}{phoneNumber}</span>.
            </p>
             <button onClick={() => { setShowOtpModal(false); setShowLoginModal(true); setLoginError(''); }} className="text-orange-600 hover:underline text-xs mb-4 block">Change Number?</button>

            <div>
              <label htmlFor="otpInput" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <input
                id="otpInput"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
                placeholder="Enter 6 digit OTP"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ease-in-out mb-2 tracking-widest text-center text-lg ${loginError && !/^\d{4,6}$/.test(otp) ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-orange-500'}`}
                maxLength={6}
              />
            </div>
            {loginError && <p className="text-red-500 text-xs mb-4">{loginError}</p>}
            <button
              onClick={handleVerifyOtp} disabled={loading}
              className="w-full bg-orange-500 text-white py-3 mt-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-md disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              onClick={handleSendOtp} 
              className="w-full text-orange-600 py-2 mt-3 rounded-lg text-sm hover:bg-orange-50 transition duration-300 disabled:opacity-50" disabled={loading}
            >
              {loading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}