
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            {...props}
            className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
                error
                    ? 'border-red-500 ring-red-200'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
            }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);