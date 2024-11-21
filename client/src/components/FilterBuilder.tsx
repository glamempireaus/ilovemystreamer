import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { FilterType, FilterConfig } from '../types';
import DraggableFunction from './DraggableFunction';
import FilterDropZone from './FilterDropZone';

interface FilterBuilderProps {
  onApplyFilter: (filterText: string) => void;
  isDark?: boolean;
}

export default function FilterBuilder({ onApplyFilter, isDark }: FilterBuilderProps) {
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'filter-dropzone') {
      const type = active.data.current?.type as FilterType;
      setFilters([...filters, {
        type,
        monuments: [],
        direction: 'north',
        ...(type === 'cluster' ? { radius: 1000 } : {})
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
      return filter.monuments.length === 2 && 
             filter.monuments[0] !== '' && 
             filter.monuments[1] !== '';
    }
    return filter.monuments.length > 0 && 
           filter.monuments.every(monument => monument !== '');
  };

  const areAllFiltersValid = (): boolean => {
    return filters.length > 0 && filters.every(isFilterValid);
  };

  const buildFilterString = () => {
    return filters.map(filter => {
      if (filter.type === 'cluster') {
        return `cluster(${filter.monuments.join(', ')}, ${filter.direction}, ${filter.radius})`;
      } else if (filter.type === 'absolute') {
        return `absolute(${filter.monuments.join(', ')}, ${filter.direction})`;
      } else {
        return `relational(${filter.monuments[0]}, ${filter.direction}, ${filter.monuments[1]})`;
      }
    }).join(', ');
  };

  return (
    <div className="space-y-6">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 mb-6">
          <DraggableFunction id="cluster" type="cluster" isDark={isDark} />
          <DraggableFunction id="absolute" type="absolute" isDark={isDark} />
          <DraggableFunction id="relational" type="relational" isDark={isDark} />
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