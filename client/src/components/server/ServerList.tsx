import React from 'react';
import { Server } from '../../types';
import ServerCard from './ServerCard';

interface ServerListProps {
  servers: Server[];
  isLoading: boolean;
  error: Error | null;
  isDark?: boolean;
}

export default function ServerList({ servers, isLoading, error, isDark = true }: ServerListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          isDark ? 'border-pink-500' : 'border-indigo-600'
        }`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border rounded-lg p-4 ${
        isDark 
          ? 'bg-red-900/30 border-red-800 text-red-300' 
          : 'bg-red-50 border-red-200 text-red-700'
      }`}>
        Error loading servers: {error.message}
      </div>
    );
  }

  if (!servers.length) {
    return (
      <div className={`border rounded-lg p-8 text-center ${
        isDark 
          ? 'bg-gray-800/50 border-gray-700 text-gray-400' 
          : 'bg-gray-50 border-gray-200 text-gray-500'
      }`}>
        No servers match your filter criteria
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {servers.map((server, index) => (
        <ServerCard
          key={`${server.ip}-${server.name}-${index}`}
          server={server}
          isDark={isDark}
        />
      ))}
    </div>
  );
}