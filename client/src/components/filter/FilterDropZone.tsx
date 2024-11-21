import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FilterConfig } from '../../types';
import { Sparkles } from 'lucide-react';
import FilterCard from './FilterCard';

interface FilterDropZoneProps {
  filters: FilterConfig[];
  onUpdateFilter: (index: number, updates: Partial<FilterConfig>) => void;
  onRemoveFilter: (index: number) => void;
  isDark?: boolean;
}

export default function FilterDropZone({ filters, onUpdateFilter, onRemoveFilter, isDark }: FilterDropZoneProps) {
  const { setNodeRef } = useDroppable({
    id: 'filter-dropzone'
  });

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
            <FilterCard
              key={index}
              filter={filter}
              onUpdate={(updates) => onUpdateFilter(index, updates)}
              onRemove={() => onRemoveFilter(index)}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  );
}