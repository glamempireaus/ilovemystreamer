import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { FilterType, FilterConfig } from '../../types';
import DraggableFunction from './DraggableFunction';
import FilterDropZone from './FilterDropZone';
import { RefreshCw } from 'lucide-react';

interface FilterBuilderProps {
  onApplyFilter: (filterText: string) => void;
  onRefresh: () => void;
  isDark?: boolean;
}

export default function FilterBuilder({ onApplyFilter, onRefresh, isDark }: FilterBuilderProps) {
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'filter-dropzone') {
      const type = active.data.current?.type as FilterType;
      setFilters([...filters, {
        type,
        monuments: type === 'relational' ? [[], []] : [],
        direction: '',
        ...(type === 'cluster' || type === 'relational' ? { radius: 0 } : {})
      }]);
    }
  };

  const updateFilter = (index: number, updates: Partial<FilterConfig>) => {
    setFilters(filters.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const isFilterValid = (filter: FilterConfig): boolean => {
    if (filter.type === 'relational') {
      const [leftMonuments, rightMonuments] = filter.monuments as [string[], string[]];
      return leftMonuments.length > 0 && rightMonuments.length > 0 && !!filter.direction;
    }
    if (filter.type === 'absolute') {
      return (filter.monuments as string[]).length > 0 && !!filter.direction;
    }
    return (filter.monuments as string[]).length > 0;
  };

  const areAllFiltersValid = (): boolean => {
    return filters.length > 0 && filters.every(isFilterValid);
  };

  const buildFilterString = () => {
    return filters.map(filter => {
      if (filter.type === 'cluster') {
        const parts = [(filter.monuments as string[]).join(', ')];
        if (filter.direction) {
          parts.push(filter.direction);
        }
        if (filter.radius && filter.radius !== 1000) {
          parts.push(filter.radius.toString());
        }
        return `cluster(${parts.join(', ')})`;
      } else if (filter.type === 'absolute') {
        return `absolute(${(filter.monuments as string[]).join(', ')}, ${filter.direction})`;
      } else {
        const [leftMonuments, rightMonuments] = filter.monuments as [string[], string[]];
        return `relational(${leftMonuments.join(', ')}, ${filter.direction}, ${rightMonuments.join(', ')}, ${filter.radius || 1000})`;
      }
    }).join(', ');
  };

  return (
    <div className="space-y-6">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <DraggableFunction id="cluster" type="cluster" isDark={isDark} />
            <DraggableFunction id="absolute" type="absolute" isDark={isDark} />
            <DraggableFunction id="relational" type="relational" isDark={isDark} />
          </div>
          <button
            onClick={onRefresh}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            <RefreshCw size={16} />
            Refresh Servers
          </button>
        </div>

        <FilterDropZone
          filters={filters}
          onUpdateFilter={updateFilter}
          onRemoveFilter={removeFilter}
          isDark={isDark}
        />
      </DndContext>

      {filters.length > 0 && (
        <button
          onClick={() => onApplyFilter(buildFilterString())}
          disabled={!areAllFiltersValid()}
          className={`w-full py-2 rounded-md transition-colors ${
            areAllFiltersValid()
              ? isDark
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              : isDark
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}