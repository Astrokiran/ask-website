
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">{label}</label>
        <input
            {...props}
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-muted border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 text-sm sm:text-base ${
                error
                    ? 'border-destructive ring-destructive/20'
                    : 'border-input focus:border-orange-500 focus:ring-orange-200'
            }`}
        />
        {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
);