
import React from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: boolean;
    
}

export const FormSelect: React.FC<FormSelectProps> = ({ options, placeholder, error, ...props }) => (
    <select
        {...props}
        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 hover:border-orange-300 transition-colors duration-200 text-gray-900 dark:text-white text-sm sm:text-base ${
            error
                ? 'border-red-500 ring-red-200'
                : 'border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-200 dark:focus:ring-orange-800'
        } ${props.value === '' ? 'text-gray-500 dark:text-gray-400' : ''}`}
    >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);