import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FilterType } from '../../types';

interface DraggableFunctionProps {
  id: string;
  type: FilterType;
  isDark?: boolean;
}

export default function DraggableFunction({ id, type, isDark }: DraggableFunctionProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { type }
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const getColorClass = () => {
    if (isDark) {
      switch (type) {
        case 'cluster': return 'bg-blue-600 hover:bg-blue-700';
        case 'absolute': return 'bg-green-600 hover:bg-green-700';
        case 'relational': return 'bg-purple-600 hover:bg-purple-700';
      }
    }
    switch (type) {
      case 'cluster': return 'bg-blue-500 hover:bg-blue-600';
      case 'absolute': return 'bg-green-500 hover:bg-green-600';
      case 'relational': return 'bg-purple-500 hover:bg-purple-600';
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${getColorClass()} text-white px-4 py-2 rounded-lg cursor-move shadow-md transition-colors duration-200`}
      style={style}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </div>
  );
}