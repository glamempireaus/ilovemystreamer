import React, { useState, useRef, useEffect } from 'react';
import { FilterType } from '../types';
import { MonumentEnum } from '../constants/monuments';

interface MonumentInputProps {
  value: string[];
  onChange: (monuments: string[]) => void;
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

  const filteredMonuments = monuments
    .filter(monument => 
      monument.label.includes(inputValue.toLowerCase()) &&
      !value.includes(monument.value)
    )
    .slice(0, 5);

  const handleSelectMonument = (monumentValue: string) => {
    let newMonuments = [...value];
    if (type === 'relational') {
      if (position === 'left') {
        newMonuments = [monumentValue, newMonuments[1] || ''];
      } else if (position === 'right') {
        newMonuments = [newMonuments[0] || '', monumentValue];
      }
    } else {
      newMonuments.push(monumentValue);
    }
    onChange(newMonuments);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeMonument = (monumentToRemove: string) => {
    if (type === 'relational') {
      const newMonuments = [...value];
      if (position === 'left') {
        newMonuments[0] = '';
      } else if (position === 'right') {
        newMonuments[1] = '';
      }
      onChange(newMonuments);
    } else {
      onChange(value.filter(m => m !== monumentToRemove));
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

  const getRelevantMonuments = () => {
    if (type === 'relational') {
      return position === 'left' ? [value[0]] : [value[1]];
    }
    return value;
  };

  const canAddMore = type === 'relational' 
    ? (position === 'left' ? !value[0] : !value[1])
    : true;

  const displayedMonuments = getRelevantMonuments().filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {displayedMonuments.map((monument, index) => (
        <div
          key={index}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-colors ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300'
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
      
      {canAddMore && (
        <div className="relative" ref={inputRef}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="add monument..."
            className={`px-2 py-1 border rounded w-32 transition-colors ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                : 'bg-white border-gray-300 placeholder-gray-500'
            }`}
          />
          
          {showSuggestions && filteredMonuments.length > 0 && (
            <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg ${
              isDark 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-white border-gray-200'
            }`}>
              {filteredMonuments.map((monument, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectMonument(monument.value)}
                  className={`w-full px-3 py-2 text-left first:rounded-t-md last:rounded-b-md ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {monument.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}