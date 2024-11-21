import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Heart, Moon, Sun } from 'lucide-react';
import FilterBuilder from './components/FilterBuilder';
import ServerList from './components/ServerList';
import { Server } from './types';

async function fetchServers(filterText: string): Promise<Server[]> {
  if (!filterText) return [];
  
  const response = await fetch(`https://4327-117-20-68-163.ngrok-free.app/api/filter?filter=${encodeURIComponent(filterText)}`, {
    headers: {
      'ngrok-skip-browser-warning': '69420'
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch servers: ' + await response.text());
  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.message || 'Failed to fetch servers');
  }
  
  return data.data;
}

export default function App() {
  const [filterText, setFilterText] = useState('');
  const [isDark, setIsDark] = useState(true);

  const { data: servers, isLoading, error } = useQuery(
    ['servers', filterText],
    () => fetchServers(filterText),
    { enabled: !!filterText }
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-3xl font-bold flex items-center gap-2 ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              ilovemystreamer <Heart className="text-pink-500 animate-pulse" />
            </h1>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full transition-colors ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <FilterBuilder onApplyFilter={setFilterText} isDark={isDark} />
        </div>

        {filterText && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-800'
            }`}>
              <h2 className="text-lg font-semibold text-white mb-2">Current Filter:</h2>
              <code className="text-green-400">{filterText}</code>
            </div>
            <ServerList
              servers={servers || []}
              isLoading={isLoading}
              error={error as Error}
              isDark={isDark}
            />
          </div>
        )}
      </div>
    </div>
  );
}