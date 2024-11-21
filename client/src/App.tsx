import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Heart, Moon, Sun } from 'lucide-react';
import FilterBuilder from './components/filter/FilterBuilder';
import ServerList from './components/server/ServerList';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';
import { fetchServers, refreshData } from './services/api';

export default function App() {
  const [filterText, setFilterText] = useState('');
  const [isDark, setIsDark] = useState(true);
  const queryClient = useQueryClient();
  const { toasts, addToast, removeToast } = useToast();

  const { data: servers, isLoading, error } = useQuery(
    ['servers', filterText],
    () => fetchServers(filterText),
    { enabled: !!filterText }
  );

  const handleRefresh = async () => {
    try {
      const result = await refreshData();
      addToast(result.message, result.success ? 'success' : 'error');
      
      if (result.success && filterText) {
        await queryClient.invalidateQueries(['servers', filterText]);
      }
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : 'Failed to refresh servers',
        'error'
      );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="container mx-auto px-4 py-8 flex-grow">
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
          <FilterBuilder 
            onApplyFilter={setFilterText} 
            isDark={isDark} 
            onRefresh={handleRefresh}
          />
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
      <Footer isDark={isDark} />
      
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          isDark={isDark}
        />
      ))}
    </div>
  );
}