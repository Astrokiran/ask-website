
import React from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: boolean;
    
}

export const FormSelect: React.FC<FormSelectProps> = ({ options, placeholder, error, ...props }) => (
    <select
        {...props}
        className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
            error
                ? 'border-red-500 ring-red-200'
                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
        } ${props.value === '' ? 'text-gray-400' : ''}`}
    >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);