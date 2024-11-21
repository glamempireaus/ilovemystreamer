import React, { useState, useRef, useEffect } from 'react';
import { FilterType } from '../../../types';
import { MonumentEnum } from '../../../constants/monuments';
import { Plus } from 'lucide-react';

interface MonumentInputProps {
  value: string[] | [string[], string[]];
  onChange: (monuments: string[] | [string[], string[]]) => void;
  type: FilterType;
  position?: 'left' | 'right';
  isDark?: boolean;
}

export default function MonumentInput({ value, onChange, type, position, isDark }: MonumentInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const monuments = Object.values(MonumentEnum)
    .filter(m => m !== 'NONE')
    .map(monument => ({
      value: monument.toLowerCase().replace(/_/g, ' '),
      label: monument.toLowerCase().replace(/_/g, ' ')
    }));

  const getCurrentMonuments = (): string[] => {
    if (type === 'relational') {
      const [leftMonuments, rightMonuments] = value as [string[], string[]];
      return position === 'left' ? leftMonuments : rightMonuments;
    }
    return value as string[];
  };

  const filteredMonuments = monuments
    .filter(monument => 
      monument.label.includes(inputValue.toLowerCase()) &&
      !getCurrentMonuments().includes(monument.value)
    )
    .slice(0, 5);

  const handleSelectMonument = (monumentValue: string) => {
    if (type === 'relational') {
      const [leftMonuments, rightMonuments] = value as [string[], string[]];
      if (position === 'left') {
        onChange([[...leftMonuments, monumentValue], rightMonuments]);
      } else {
        onChange([leftMonuments, [...rightMonuments, monumentValue]]);
      }
    } else {
      onChange([...(value as string[]), monumentValue]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeMonument = (monumentToRemove: string) => {
    if (type === 'relational') {
      const [leftMonuments, rightMonuments] = value as [string[], string[]];
      if (position === 'left') {
        onChange([leftMonuments.filter(m => m !== monumentToRemove), rightMonuments]);
      } else {
        onChange([leftMonuments, rightMonuments.filter(m => m !== monumentToRemove)]);
      }
    } else {
      onChange((value as string[]).filter(m => m !== monumentToRemove));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayedMonuments = getCurrentMonuments();
  const hasMonuments = displayedMonuments.length > 0;

  const baseStyles = isDark
    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
    : 'bg-white border-gray-300 hover:bg-gray-50';

  const textStyles = isDark
    ? inputValue ? 'text-gray-200' : 'text-gray-500'
    : inputValue ? 'text-gray-900' : 'text-gray-500';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {displayedMonuments.map((monument, index) => (
        <div
          key={index}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border ${baseStyles} ${
            isDark ? 'text-gray-200' : 'text-gray-900'
          }`}
        >
          <span>{monument}</span>
          <button
            onClick={() => removeMonument(monument)}
            className="ml-1 text-gray-400 hover:text-pink-500 transition-colors"
          >
            ×
          </button>
        </div>
      ))}
      
      <div className="relative" ref={inputRef}>
        <button
          onClick={() => inputRef.current?.focus()}
          className={`px-2 py-1 border rounded transition-colors cursor-pointer ${baseStyles} ${textStyles} ${
            hasMonuments ? 'w-8 flex items-center justify-center' : 'w-32'
          }`}
        >
          {hasMonuments ? (
            <Plus className="w-4 h-4" />
          ) : (
            inputValue || 'add monument...'
          )}
        </button>
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="absolute inset-0 w-full px-2 py-1 opacity-0 cursor-pointer"
        />
        
        {showSuggestions && filteredMonuments.length > 0 && (
          <div className={`absolute z-10 w-32 mt-1 border rounded-md shadow-lg ${
            isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          }`}>
            {filteredMonuments.map((monument, index) => (
              <button
                key={index}
                onClick={() => handleSelectMonument(monument.value)}
                className={`w-full px-3 py-2 text-left first:rounded-t-md last:rounded-b-md transition-colors ${
                  isDark 
                    ? 'text-gray-200 hover:bg-gray-600' 
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                {monument.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}