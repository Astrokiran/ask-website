
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input
            {...props}
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 text-sm sm:text-base text-gray-900 dark:text-white ${
                error
                    ? 'border-red-500 ring-red-200'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-800'
            }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);