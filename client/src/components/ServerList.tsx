import React from 'react';
import { Server } from '../types';
import { Map, Users, Signal, Calendar, ExternalLink } from 'lucide-react';

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

  const countryCodeToFlag = (countryCode: string): string => {
    // Convert country code to regional indicator symbols
    const codePoints = [...countryCode.toUpperCase()].map(char => 
      127397 + char.charCodeAt(0)
    );
    return String.fromCodePoint(...codePoints);
  };

  const getCountryFlag = (country: string): string => {
    const countryMap: { [key: string]: string } = {
      'US': 'US',
      'GB': 'GB',
      'DE': 'DE',
      'FR': 'FR',
      'IT': 'IT',
      'ES': 'ES',
      'PT': 'PT',
      'NL': 'NL',
      'BE': 'BE',
      'CH': 'CH',
      'AT': 'AT',
      'SE': 'SE',
      'NO': 'NO',
      'DK': 'DK',
      'FI': 'FI',
      'IE': 'IE',
      'PL': 'PL',
      'CZ': 'CZ',
      'SK': 'SK',
      'HU': 'HU',
      'RO': 'RO',
      'BG': 'BG',
      'GR': 'GR',
      'HR': 'HR',
      'RS': 'RS',
      'SI': 'SI',
      'EE': 'EE',
      'LV': 'LV',
      'LT': 'LT',
      'UA': 'UA',
      'BY': 'BY',
      'RU': 'RU',
      'CA': 'CA',
      'MX': 'MX',
      'BR': 'BR',
      'AR': 'AR',
      'CL': 'CL',
      'PE': 'PE',
      'CO': 'CO',
      'VE': 'VE',
      'AU': 'AU',
      'NZ': 'NZ',
      'JP': 'JP',
      'KR': 'KR',
      'CN': 'CN',
      'IN': 'IN',
      'SG': 'SG',
      'ID': 'ID',
      'MY': 'MY',
      'TH': 'TH',
      'VN': 'VN',
      'PH': 'PH',
      'TR': 'TR',
      'IL': 'IL',
      'AE': 'AE',
      'SA': 'SA',
      'ZA': 'ZA'
    };

    const code = countryMap[country] || country;
    return countryCodeToFlag(code);
  };

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {servers.map((server) => {
        // Create a unique key by combining IP and name
        const serverKey = `${server.ip}-${server.name.replace(/\s+/g, '-')}`;
        
        return (
          <div key={serverKey} className={`rounded-lg shadow-lg overflow-hidden transition-all hover:scale-[1.02] ${
            isDark 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className={`font-bold text-lg truncate flex-1 ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {server.name}
                </h3>
                <a
                  href={server.map.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ExternalLink size={16} className={isDark ? 'text-pink-400' : 'text-indigo-600'} />
                </a>
              </div>

              <div className="space-y-2">
                <div className={`grid grid-cols-2 gap-4 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{server.playerCount} players</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl" title={server.country}>
                      {getCountryFlag(server.country)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Signal size={16} />
                    <span>{server.ping}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Last Wipe: {new Date(server.wipeDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className={`mt-4 pt-4 border-t ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Map size={16} className={isDark ? 'text-pink-400' : 'text-indigo-600'} />
                    <span className={`font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Map Size: {server.map.size}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}