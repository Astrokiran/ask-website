import React, { useState, useEffect, useRef } from 'react';
import { NavBar } from '@/components/nav-bar'; // Assuming this is the correct path
import { Footer } from '@/components/footer';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { ServicesSection } from "@/components/services-section"
import { WhatsAppCtaBanner } from '@/components/banners/Whatsapp-banner'; // Import the new banner

// Define a basic structure for Kundli data for type safety
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

export default function KundliPage() { // Remove onKundliGenerated prop
  const router = useRouter(); // Initialize router
  // State to store form input values
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    tob: '',
    pob: '',
  });

  // State for individual DOB parts
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // State for individual TOB parts
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [selectedSecond, setSelectedSecond] = useState(''); // Optional: can be omitted if seconds are not needed

  // Google Maps Autocomplete state
  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null);
  const pobSuggestionsRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State to manage loading state during Kundli generation
  const [loading, setLoading] = useState(false);

  // State for Login Modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91'); // Default to India
  const [otp, setOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for authentication status

  // A simplified list of country codes for the dropdown
  const countryCodes = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+1', name: 'Canada', flag: '🇨🇦' }, // Note: Canada also uses +1
    // Add more countries as needed
  ];

  // Handle input changes in the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for the current field as user types
    if (errors[name]) {
      setErrors((prevErrors: Record<string, string>) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  // Load Google Maps API Script
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  // Callback for when Autocomplete loads
  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocompleteInstance(autocomplete);
  };

  // Callback for when a place is selected
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

  // Validate form inputs
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Validate DOB parts
    if (!selectedDay || !selectedMonth || !selectedYear) {
      newErrors.dob = 'Full Date of Birth (Day, Month, Year) is required.';
    } else {
      const year = parseInt(selectedYear, 10);
      const month = parseInt(selectedMonth, 10); // 1-12
      const day = parseInt(selectedDay, 10);
      const date = new Date(year, month - 1, day); // Month is 0-indexed in Date constructor

      if (
        !(date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day)
      ) {
        newErrors.dob = 'Invalid date (e.g., Feb 30 is not a valid date).';
      }
      // Check constructed formData.dob format if needed, though useEffect handles construction
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dob)) {
        // This might indicate an issue with useEffect logic if it fires
        newErrors.dob = 'Internal error: DOB format incorrect.';
      }
    }

    // Validate TOB parts
    if (!selectedHour || !selectedMinute) { // Seconds can be optional
      newErrors.tob = 'Time of Birth (Hour and Minute) is required.';
    } else {
      // Basic time format validation (HH:MM)
      const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/; // Allows for optional seconds
      if (!timeRegex.test(formData.tob)) {
        newErrors.tob = 'Internal error: TOB format incorrect.';
      }
    }
    if (!formData.pob.trim()) {
      newErrors.pob = 'Place of Birth is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // useEffect to construct formData.dob from selectedDay, selectedMonth, selectedYear
  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const formattedMonth = selectedMonth.padStart(2, '0');
      const formattedDay = selectedDay.padStart(2, '0');
      setFormData(prev => ({ ...prev, dob: `${selectedYear}-${formattedMonth}-${formattedDay}` }));
      // Clear DOB error if parts are now selected and valid (validation will confirm validity)
      if (errors.dob) {
        setErrors(prevErrors => ({ ...prevErrors, dob: '' }));
      }
    } else {
      // If any part is missing, clear the formData.dob
      // This ensures that an incomplete date isn't accidentally submitted
      if (formData.dob) { // only update if it was previously set
        setFormData(prev => ({ ...prev, dob: '' }));
      }
    }
  }, [selectedDay, selectedMonth, selectedYear, errors.dob, formData.dob]);

  // useEffect to construct formData.tob from selectedHour, selectedMinute, selectedSecond
  useEffect(() => {
    if (selectedHour && selectedMinute) { // Seconds are optional for constructing the base HH:MM
      const formattedHour = selectedHour.padStart(2, '0');
      const formattedMinute = selectedMinute.padStart(2, '0');
      let tobString = `${formattedHour}:${formattedMinute}`;
      if (selectedSecond) { // Append seconds if selected
        tobString += `:${selectedSecond.padStart(2, '0')}`;
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
  }, [selectedHour, selectedMinute, selectedSecond, errors.tob, formData.tob]);

  // Simulate API call for Kundli generation
  const generateKundli = async () => {
    setLoading(true);

    // Prepare parameters for the API call
    // Format date_of_birth from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = formData.dob.split('-');
    const formattedDobForApi = `${day}/${month}/${year}`;

    // Format time_of_birth from HH:MM (24-hour) to HH:MM AM/PM
    const [hourStr, minuteStr] = formData.tob.split(':'); // formData.tob is HH:MM or HH:MM:SS
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10); // Ensure minute is a number
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // Convert hour '0' to '12' for AM/PM
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0'); // Ensure minute is two digits
    const formattedTobForApi = `${formattedHour}:${formattedMinute}${ampm}`;

    const apiInputParams = {
      name: formData.name,
      date_of_birth: formattedDobForApi,
      time_of_birth: formattedTobForApi,
      place_of_birth: formData.pob,
    };

    try {
      sessionStorage.setItem('kundliApiInputParams', JSON.stringify(apiInputParams));
      router.push('/free-kundli/results'); // Navigate to the result page
    } catch (error) {
      console.error("Error storing Kundli data or navigating:", error);
      // Handle error, e.g., show a message to the user
    }
    setLoading(false);
  };

  // Handle form submission
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

  // Handle changes for DOB dropdowns
  const handleDatePartChange = (part: 'day' | 'month' | 'year', value: string) => {
    if (part === 'day') setSelectedDay(value);
    if (part === 'month') setSelectedMonth(value);
    if (part === 'year') setSelectedYear(value);

    // Clear general DOB error as user interacts, validateForm will re-check
    if (errors.dob) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dob: '',
      }));
    }
  };

  // Handle changes for TOB dropdowns
  const handleTimePartChange = (part: 'hour' | 'minute' | 'second', value: string) => {
    if (part === 'hour') setSelectedHour(value);
    if (part === 'minute') setSelectedMinute(value);
    if (part === 'second') setSelectedSecond(value);

    // Clear general TOB error as user interacts
    if (errors.tob) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tob: '',
      }));
    }
  };

  // Login Modal Handlers
  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
    setPhoneNumber(''); // Reset fields when opening
    setOtp('');
    setLoginError('');
  };

  // Check login status on component mount
  useEffect(() => {
    // In a real app, you might want to verify the token with the backend here.
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

  const phone_number = phoneNumber; // This is the 10-digit number from input

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL; // Verify this ENV var
    const response = await fetch(`${apiBaseUrl}/horoscope/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number }), // Sending only the 10-digit number
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
    console.error('Send OTP error:', error); // This is where your error originates
    setLoginError(error instanceof Error ? error.message : 'An unexpected error occurred.');
  } finally {
    setLoading(false);
  }
};
const handleVerifyOtp = async () => {
  if (!/^\d{4,6}$/.test(otp)) { // Basic validation for OTP format
      setLoginError('Please enter a valid OTP.');
      return;
  }
  setLoginError('');
  setLoading(true);

  // Combine country code and phone number, removing the leading '+' from the country code
  const fullPhoneNumber = (selectedCountryCode + phoneNumber).replace('+', '');

  try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/horoscope/validate-otp`, {
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
            // Use the specific error message from the API
            throw new Error(data.error || 'OTP verification failed. Please try again.');
        }

        // OTP Verified, tokens received in the 'data' object
        if (data.data && data.data.access && data.data.refresh) {
            localStorage.setItem('accessToken', data.data.access);
            localStorage.setItem('refreshToken', data.data.refresh);
            // Store the phone number for the logout functionality
            localStorage.setItem('userPhoneNumber', fullPhoneNumber);

            setIsLoggedIn(true);
            setShowOtpModal(false);
        } else {
            // Handle cases where the success response is malformed
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
    setLoginError(''); // Clear errors when closing
  };

  const handleLogout = async () => {
    setLoading(true); // Disable button while logging out
    const accessToken = localStorage.getItem('accessToken');
    const phoneNumber = localStorage.getItem('userPhoneNumber');
  
    if (accessToken && phoneNumber) {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;

        await fetch(`${apiBaseUrl}/horoscope/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ phone_number: phoneNumber }),
        });
        // The API call is fire-and-forget; we log out the client regardless.
      } catch (error) {
        // Log the error but don't block the client-side logout process
        console.error('Failed to logout on server:', error);
      }
    }
  
    // Always clear local storage and update UI state
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userPhoneNumber');
    setIsLoggedIn(false);
    setLoading(false);
    alert("You have been logged out.");
  };
  
  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Month options
  const monthOptions = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];

  // Time options
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const secondOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));


  if (loadError) {
    console.error("Google Maps API load error:", loadError);
    // Optionally, render an error message or fallback input for POB
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans"> {/* Consistent page background and structure */}
      <NavBar />

      {/* Main content area, allowing the card to be centered */}
      
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center"> {/* This line is for context, the change is below */}
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden md:flex">
          {/* Kundli Generation Form Section */}
          <div className="p-6 sm:p-8 md:w-3/5 flex flex-col justify-center border-r border-gray-200"> {/* Adjusted width and added border */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-6 text-center">
              Free Kundli Generation
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Enter your birth details to unlock insights into your destiny.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
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

              {/* Gender */}
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

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Day Dropdown */}
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
                  {/* Month Dropdown */}
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
                  {/* Year Dropdown */}
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

              {/* Time of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
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
                  <select // Optional: Seconds dropdown
                    id="tob_second"
                    name="tob_second"
                    value={selectedSecond}
                    onChange={(e) => handleTimePartChange('second', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.tob ? 'border-red-500' : 'border-gray-300' // Apply error styling if general TOB error exists
                    }`}
                  >
                    <option value="">Second (Optional)</option>
                    {secondOptions.map(second => (
                      <option key={second} value={second}>{second}</option>
                    ))}
                  </select>
                </div>
                {errors['tob'] && <p className="text-red-500 text-xs mt-1 col-span-3">{errors['tob']}</p>}
              </div>

              {/* Place of Birth */}
              <div className="relative" ref={pobSuggestionsRef}>
                <label htmlFor="pob" className="block text-sm font-medium text-gray-700 mb-1">
                  Place of Birth
                </label>
                {isLoaded && !loadError ? (
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                      types: ['(cities)'], // Suggest only cities
                    }}
                  >
                    <input
                      type="text"
                      id="pob"
                      name="pob" // Keep name for handleChange if needed, though Autocomplete handles value
                      value={formData.pob} // Controlled component
                      onChange={handleChange} // Update formData.pob as user types
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

              {/* Form submission button */}
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

          {/* Login Prompt Section - New Column */}
          <div className="p-6 sm:p-8 md:w-2/5 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-100 rounded-r-xl">
            {isLoggedIn ? (
              // Content to show when user is logged in
              <>
                <img src="/ask-logo.png" alt="User avatar or site logo" className="w-20 h-20 mb-4 rounded-full shadow-md opacity-90" />
                <h2 className="text-2xl font-bold text-gray-700 mb-3 text-center">
                  Welcome Back!
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  View your previously generated Kundli reports or manage your account.
                </p>
                {/* Placeholder for previous Kundli list - you'd fetch and display these */}
                <div className="w-full max-w-xs text-center mb-6 p-4 bg-white/50 rounded-lg shadow">
                    <p className="text-gray-700 text-sm">Your previous Kundlis will appear here.</p>
                </div>
                <button
                  onClick={() => router.push('/my-kundlis')} // Example: Navigate to a page for previous kundlis
                  className="w-full max-w-xs bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 mb-3 shadow-lg transform hover:scale-105"
                >
                  View My Kundlis
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full max-w-xs bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300 disabled:opacity-50"
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              // Content to show when user is NOT logged in (original login prompt)
              <>
                <img src="/ask-logo.png" alt="Login illustration or site logo" className="w-24 h-24 mb-6 opacity-80" />
                <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Access Your History</h2>
                <p className="text-gray-600 text-center mb-8">Login to view your previously generated Kundli details and manage your profile.</p>
                <button onClick={handleOpenLoginModal} className="w-full max-w-xs bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 ease-in-out shadow-lg transform hover:scale-105">Login Here</button>
              </>
            )}
          </div>
        </div>
        
      </main>
      
      <ServicesSection />

      <Footer />


      {/* Phone Number Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Sign In</h2>
              <button onClick={handleCloseModals} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
            </div>
            <p className="text-gray-600 mb-5 text-sm">Enter your mobile number. We'll send you an OTP to verify.</p>
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
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))} // Allow only numbers
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

      {/* OTP Verification Modal */}
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
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Allow only numbers
                placeholder="Enter 4 or 6 digit OTP"
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
              onClick={handleSendOtp} // Resend OTP - will call the API again
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