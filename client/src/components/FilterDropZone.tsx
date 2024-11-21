import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FilterConfig } from '../types';
import MonumentInput from './MonumentInput';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, X, Sparkles } from 'lucide-react';

interface FilterDropZoneProps {
  filters: FilterConfig[];
  onUpdateFilter: (index: number, updates: Partial<FilterConfig>) => void;
  onRemoveFilter: (index: number) => void;
  isDark?: boolean;
}

const DirectionIcon = ({ direction }: { direction: string }) => {
  switch (direction) {
    case 'north': return <ArrowUp className="w-4 h-4" />;
    case 'south': return <ArrowDown className="w-4 h-4" />;
    case 'east': return <ArrowRight className="w-4 h-4" />;
    case 'west': return <ArrowLeft className="w-4 h-4" />;
    default: return null;
  }
};

const RadiusInput = ({ value, onChange, isDark }: {
  value?: number;
  onChange: (value: number) => void;
  isDark?: boolean;
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const commonRadii = [400, 500, 600, 800, 1000, 1200, 1500];

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={`w-24 px-2 py-1 rounded transition-colors ${
            isDark 
              ? 'bg-gray-700 text-gray-200' 
              : 'bg-white border border-gray-300'
          }`}
          placeholder="Radius"
        />
        <span className={isDark ? 'text-gray-400 ml-1' : 'text-gray-500 ml-1'}>
          m
        </span>
      </div>
      
      {showSuggestions && (
        <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg ${
          isDark 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-200'
        }`}>
          {commonRadii.map((radius) => (
            <button
              key={radius}
              onClick={() => {
                onChange(radius);
                setShowSuggestions(false);
              }}
              className={`w-full px-3 py-2 text-left first:rounded-t-md last:rounded-b-md ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {radius}m
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function FilterDropZone({ filters, onUpdateFilter, onRemoveFilter, isDark }: FilterDropZoneProps) {
  const { setNodeRef } = useDroppable({
    id: 'filter-dropzone'
  });

  const getFilterColor = (type: FilterConfig['type']) => {
    if (isDark) {
      switch (type) {
        case 'cluster': return 'border-blue-500 bg-blue-900/30';
        case 'absolute': return 'border-green-500 bg-green-900/30';
        case 'relational': return 'border-purple-500 bg-purple-900/30';
      }
    }
    switch (type) {
      case 'cluster': return 'border-blue-200 bg-blue-50';
      case 'absolute': return 'border-green-200 bg-green-50';
      case 'relational': return 'border-purple-200 bg-purple-50';
    }
  };

  const getTypeColor = (type: FilterConfig['type']) => {
    if (isDark) {
      switch (type) {
        case 'cluster': return 'text-blue-300 bg-blue-900/50';
        case 'absolute': return 'text-green-300 bg-green-900/50';
        case 'relational': return 'text-purple-300 bg-purple-900/50';
      }
    }
    switch (type) {
      case 'cluster': return 'text-blue-700 bg-blue-100';
      case 'absolute': return 'text-green-700 bg-green-100';
      case 'relational': return 'text-purple-700 bg-purple-100';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors duration-200 ${
        isDark 
          ? 'bg-gray-800 border-gray-600' 
          : 'bg-gray-50 border-gray-300'
      }`}
    >
      {filters.length === 0 ? (
        <div className={`flex items-center justify-center h-[192px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Sparkles className="mr-2" />
          Drag functions here to build your filter
          <Sparkles className="ml-2" />
        </div>
      ) : (
        <div className="space-y-4">
          {filters.map((filter, index) => (
            <div 
              key={index} 
              className={`rounded-lg border ${getFilterColor(filter.type)} p-4 transition-colors duration-200`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-md text-sm font-medium ${getTypeColor(filter.type)}`}>
                      {filter.type}
                    </span>
                    <button
                      onClick={() => onRemoveFilter(index)}
                      className="text-gray-400 hover:text-pink-500 ml-auto transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {filter.type === 'relational' ? (
                        <>
                          <MonumentInput
                            value={filter.monuments}
                            onChange={(monuments) => onUpdateFilter(index, { monuments })}
                            type={filter.type}
                            position="left"
                            isDark={isDark}
                          />
                          <div className="flex items-center gap-2">
                            <select
                              value={filter.direction}
                              onChange={(e) => onUpdateFilter(index, { direction: e.target.value })}
                              className={`px-2 py-1 rounded transition-colors ${
                                isDark 
                                  ? 'bg-gray-700 text-gray-200' 
                                  : 'bg-white border border-gray-300'
                              }`}
                            >
                              {['north', 'south', 'east', 'west'].map(dir => (
                                <option key={dir} value={dir}>{dir}</option>
                              ))}
                            </select>
                            <DirectionIcon direction={filter.direction} />
                          </div>
                          <MonumentInput
                            value={filter.monuments}
                            onChange={(monuments) => onUpdateFilter(index, { monuments })}
                            type={filter.type}
                            position="right"
                            isDark={isDark}
                          />
                        </>
                      ) : (
                        <>
                          <MonumentInput
                            value={filter.monuments}
                            onChange={(monuments) => onUpdateFilter(index, { monuments })}
                            type={filter.type}
                            isDark={isDark}
                          />
                          <div className="flex items-center gap-2">
                            <select
                              value={filter.direction}
                              onChange={(e) => onUpdateFilter(index, { direction: e.target.value })}
                              className={`px-2 py-1 rounded transition-colors ${
                                isDark 
                                  ? 'bg-gray-700 text-gray-200' 
                                  : 'bg-white border border-gray-300'
                              }`}
                            >
                              {['north', 'south', 'east', 'west'].map(dir => (
                                <option key={dir} value={dir}>{dir}</option>
                              ))}
                            </select>
                            <DirectionIcon direction={filter.direction} />
                          </div>
                          {filter.type === 'cluster' && (
                            <RadiusInput
                              value={filter.radius}
                              onChange={(radius) => onUpdateFilter(index, { radius })}
                              isDark={isDark}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}