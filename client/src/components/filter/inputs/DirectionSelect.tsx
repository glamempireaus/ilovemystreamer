import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';

const DirectionIcon = ({ direction }: { direction: string }) => {
  switch (direction) {
    case 'north': return <ArrowUp className="w-4 h-4" />;
    case 'south': return <ArrowDown className="w-4 h-4" />;
    case 'east': return <ArrowRight className="w-4 h-4" />;
    case 'west': return <ArrowLeft className="w-4 h-4" />;
    default: return null;
  }
};

interface DirectionSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  isDark?: boolean;
}

export default function DirectionSelect({ value, onChange, required, isDark }: DirectionSelectProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const directions = [
    { value: '', label: 'no direction' },
    { value: 'north', label: 'north' },
    { value: 'south', label: 'south' },
    { value: 'east', label: 'east' },
    { value: 'west', label: 'west' }
  ];

  const baseStyles = isDark
    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
    : 'bg-white border-gray-300 hover:bg-gray-50';

  const textStyles = isDark
    ? value ? 'text-gray-200' : 'text-gray-500'
    : value ? 'text-gray-900' : 'text-gray-500';

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        onClick={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={`px-2 py-1 rounded border transition-colors w-28 text-left ${baseStyles} ${textStyles}`}
      >
        {value || 'direction'}
      </button>
      {value && <DirectionIcon direction={value} />}
      
      {showSuggestions && (
        <div className={`absolute z-10 w-28 mt-1 top-full left-0 border rounded-md shadow-lg ${
          isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          {directions
            .filter(d => !required || d.value !== '')
            .map(({ value: dirValue, label }) => (
              <button
                key={dirValue}
                onClick={() => {
                  onChange(dirValue);
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