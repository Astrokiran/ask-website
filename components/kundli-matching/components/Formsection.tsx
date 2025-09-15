// pages/kundli-match/components/FormSection.tsx

import React, { useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

// Use the same types/constants from the parent component
// In a real app, you'd share these from a central types file
interface BirthInputState {
  name: string; day: string; month: string; year: string; hour: string;
  minute: string; second: string; ampm: string; pob: string;
}

const monthOptions = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
];
const dayOptions = Array.from({ length: 31 }, (_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }));
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 100 }, (_, i) => ({ value: (currentYear - i).toString(), label: (currentYear - i).toString() }));
const hourOptions = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString().padStart(2, '0'), label: (i + 1).toString().padStart(2, '0') }));
const minuteOptions = Array.from({ length: 60 }, (_, i) => ({ value: i.toString().padStart(2, '0'), label: i.toString().padStart(2, '0') }));
const secondOptions = Array.from({ length: 60 }, (_, i) => ({ value: i.toString().padStart(2, '0'), label: i.toString().padStart(2, '0') }));


interface FormSectionProps {
    personType: 'man' | 'woman';
    data: BirthInputState;
    errors: Record<string, string>;
    handleInputChange: (field: keyof BirthInputState, value: string) => void;
    isGoogleMapsLoaded: boolean;
}

// Animation variants removed - using regular CSS instead

export const FormSection: React.FC<FormSectionProps> = ({
    personType, data, errors, handleInputChange, isGoogleMapsLoaded
}) => {
    const [autocompleteInstance, setAutocompleteInstance] = React.useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
        setAutocompleteInstance(autocomplete);
    };

    const onPlaceChanged = () => {
        if (autocompleteInstance !== null) {
            const place = autocompleteInstance.getPlace();
            handleInputChange('pob', place.formatted_address || '');
        }
    };
    
    // Ensure the input value is updated when switching tabs
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = data.pob;
        }
    }, [data.pob]);

    return (
        <div className="space-y-4 sm:space-y-5">
            <div>
                <FormInput
                    label="Full Name"
                    value={data.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={personType === 'man' ? "Your name" : "Your partner's name"}
                    error={errors.name}
                    autoComplete="off" 
                />
            </div>

            <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    <FormSelect name="day" value={data.day} onChange={(e) => handleInputChange('day', e.target.value)} options={dayOptions} placeholder="Day" error={!!errors.dob} />
                    <FormSelect name="month" value={data.month} onChange={(e) => handleInputChange('month', e.target.value)} options={monthOptions} placeholder="Month" error={!!errors.dob} />
                    <FormSelect name="year" className="col-span-2 sm:col-span-1" value={data.year} onChange={(e) => handleInputChange('year', e.target.value)} options={yearOptions} placeholder="Year" error={!!errors.dob} />
                </div>
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>

            <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Time of Birth</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <FormSelect name="hour" value={data.hour} onChange={(e) => handleInputChange('hour', e.target.value)} options={hourOptions} placeholder="Hour" error={!!errors.tob} />
                    <FormSelect name="minute" value={data.minute} onChange={(e) => handleInputChange('minute', e.target.value)} options={minuteOptions} placeholder="Minute" error={!!errors.tob} />
                    <FormSelect name="second" value={data.second} onChange={(e) => handleInputChange('second', e.target.value)} options={secondOptions} placeholder="Second" />
                    <FormSelect name="ampm" value={data.ampm} onChange={(e) => handleInputChange('ampm', e.target.value)} options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]} error={!!errors.tob} />
                </div>
                {errors.tob && <p className="text-red-500 text-xs mt-1">{errors.tob}</p>}
            </div>

            <div>
                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                 {isGoogleMapsLoaded ? (
                     <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged} options={{ types: ['(cities)'] }}>
                         <input
                            ref={inputRef}
                            type="text"
                            defaultValue={data.pob}
                            onChange={(e) => handleInputChange('pob', e.target.value)}
                            placeholder="Type and select a city"
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 text-sm sm:text-base ${errors.pob ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'}`}
                         />
                     </Autocomplete>
                 ) : (
                     <input type="text" placeholder="Map is loading..." disabled className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg bg-gray-100 text-sm sm:text-base"/>
                 )}
                 {errors.pob && <p className="text-red-500 text-xs mt-1">{errors.pob}</p>}
            </div>
        </div>
    );
};