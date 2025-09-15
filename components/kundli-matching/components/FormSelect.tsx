
import React from 'react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: boolean;
    
}

export const FormSelect: React.FC<FormSelectProps> = ({ options, placeholder, error, ...props }) => (
    <select
        {...props}
        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-muted border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 text-foreground text-sm sm:text-base ${
            error
                ? 'border-destructive ring-destructive/20'
                : 'border-input focus:border-orange-500 focus:ring-orange-200'
        } ${props.value === '' ? 'text-muted-foreground' : ''}`}
    >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);