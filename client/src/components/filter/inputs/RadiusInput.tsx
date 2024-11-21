import React, { useState } from 'react';

interface RadiusInputProps {
  value?: number;
  onChange: (value: number) => void;
  isDark?: boolean;
}

export default function RadiusInput({ value, onChange, isDark }: RadiusInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const commonRadii = [
    { value: 0, label: 'no radius' },
    { value: 400, label: '400m' },
    { value: 500, label: '500m' },
    { value: 600, label: '600m' },
    { value: 800, label: '800m' },
    { value: 1000, label: '1000m' },
    { value: 1200, label: '1200m' },
    { value: 1500, label: '1500m' }
  ];

  const baseStyles = isDark
    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
    : 'bg-white border-gray-300 hover:bg-gray-50';

  const textStyles = isDark
    ? value ? 'text-gray-200' : 'text-gray-500'
    : value ? 'text-gray-900' : 'text-gray-500';

  return (
    <div className="relative">
      <button
        onClick={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={`px-2 py-1 rounded border transition-colors w-24 text-left ${baseStyles} ${textStyles}`}
      >
        {value ? `${value}m` : 'radius'}
      </button>
      
      {showSuggestions && (
        <div className={`absolute z-10 w-24 mt-1 border rounded-md shadow-lg ${
          isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          {commonRadii.map(({ value: radiusValue, label }) => (
            <button
              key={radiusValue}
              onClick={() => {
                onChange(radiusValue);
                setShowSuggestions(false);
              }}
              className={`w-full px-3 py-2 text-left first:rounded-t-md last:rounded-b-md transition-colors ${
                isDark 
                  ? 'text-gray-200 hover:bg-gray-600' 
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}