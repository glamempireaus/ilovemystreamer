import React from 'react';
import { Server } from '../../types';
import { Users, Signal, Calendar, ExternalLink, Map } from 'lucide-react';

const countryMap: { [key: string]: string } = {
  'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹',
  'ES': '🇪🇸', 'PT': '🇵🇹', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭',
  'AT': '🇦🇹', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮',
  'IE': '🇮🇪', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'SK': '🇸🇰', 'HU': '🇭🇺',
  'RO': '🇷🇴', 'BG': '🇧🇬', 'GR': '🇬🇷', 'HR': '🇭🇷', 'RS': '🇷🇸',
  'SI': '🇸🇮', 'EE': '🇪🇪', 'LV': '🇱🇻', 'LT': '🇱🇹', 'UA': '🇺🇦',
  'BY': '🇧🇾', 'RU': '🇷🇺', 'CA': '🇨🇦', 'MX': '🇲🇽', 'BR': '🇧🇷',
  'AR': '🇦🇷', 'CL': '🇨🇱', 'PE': '🇵🇪', 'CO': '🇨🇴', 'VE': '🇻🇪',
  'AU': '🇦🇺', 'NZ': '🇳🇿', 'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳',
  'IN': '🇮🇳', 'SG': '🇸🇬', 'ID': '🇮🇩', 'MY': '🇲🇾', 'TH': '🇹🇭',
  'VN': '🇻🇳', 'PH': '🇵🇭', 'TR': '🇹🇷', 'IL': '🇮🇱', 'AE': '🇦🇪',
  'SA': '🇸🇦', 'ZA': '🇿🇦'
};

interface ServerCardProps {
  server: Server;
  isDark?: boolean;
}

export default function ServerCard({ server, isDark }: ServerCardProps) {
  return (
    <div className={`rounded-lg shadow-lg overflow-hidden transition-all hover:scale-[1.02] ${
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
                {countryMap[server.country]}
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
}