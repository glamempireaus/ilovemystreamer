import { Server } from '../types';

const API_BASE_URL = 'https://4327-117-20-68-163.ngrok-free.app/api';

export async function fetchServers(filterText: string): Promise<Server[]> {
  if (!filterText) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/filter?filter=${encodeURIComponent(filterText)}`, {
      headers: {
        'ngrok-skip-browser-warning': '69420'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch servers: ' + await response.text());
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'Failed to fetch servers');
    }
    
    return data.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch servers');
  }
}

export async function refreshData(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/refreshdata`, {
      headers: {
        'ngrok-skip-browser-warning': '69420'
      }
    });
    
    const data = await response.json();
    
    return {
      success: !data.error,
      message: data.message || (data.error ? 'Failed to refresh data' : 'Data refreshed successfully')
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to refresh data'
    };
  }
}