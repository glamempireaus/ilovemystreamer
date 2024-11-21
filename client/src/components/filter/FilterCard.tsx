import React from 'react';
import { X } from 'lucide-react';
import { FilterConfig } from '../../types';
import MonumentInput from './inputs/MonumentInput';
import DirectionSelect from './inputs/DirectionSelect';
import RadiusInput from './inputs/RadiusInput';

interface FilterCardProps {
  filter: FilterConfig;
  onUpdate: (updates: Partial<FilterConfig>) => void;
  onRemove: () => void;
  isDark?: boolean;
}

export default function FilterCard({ filter, onUpdate, onRemove, isDark }: FilterCardProps) {
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
    <div className={`rounded-lg border ${getFilterColor(filter.type)} p-4 transition-colors duration-200`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-md text-sm font-medium ${getTypeColor(filter.type)}`}>
              {filter.type}
            </span>
            <button
              onClick={onRemove}
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
                    onChange={(monuments) => onUpdate({ monuments })}
                    type={filter.type}
                    position="left"
                    isDark={isDark}
                  />
                  <DirectionSelect
                    value={filter.direction}
                    onChange={(direction) => onUpdate({ direction })}
                    isDark={isDark}
                  />
                  <MonumentInput
                    value={filter.monuments}
                    onChange={(monuments) => onUpdate({ monuments })}
                    type={filter.type}
                    position="right"
                    isDark={isDark}
                  />
                  <RadiusInput
                    value={filter.radius}
                    onChange={(radius) => onUpdate({ radius })}
                    isDark={isDark}
                  />
                </>
              ) : (
                <>
                  <MonumentInput
                    value={filter.monuments}
                    onChange={(monuments) => onUpdate({ monuments })}
                    type={filter.type}
                    isDark={isDark}
                  />
                  {(filter.type === 'absolute' || filter.type === 'cluster') && (
                    <DirectionSelect
                      value={filter.direction}
                      onChange={(direction) => onUpdate({ direction })}
                      required={filter.type === 'absolute'}
                      isDark={isDark}
                    />
                  )}
                  {filter.type === 'cluster' && (
                    <RadiusInput
                      value={filter.radius}
                      onChange={(radius) => onUpdate({ radius })}
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
  );
}