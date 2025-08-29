import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPACEX_API_BASE_URL || 'https://api.spacexdata.com/v4',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const apiRequest = {
  get: <T = unknown>(url: string, config?: unknown) => 
    apiClient.get<T>(url, config as never),
    
  post: <T = unknown>(url: string, data?: unknown, config?: unknown) => 
    apiClient.post<T>(url, data, config as never),
    
  put: <T = unknown>(url: string, data?: unknown, config?: unknown) => 
    apiClient.put<T>(url, data, config as never),
    
  delete: <T = unknown>(url: string, config?: unknown) => 
    apiClient.delete<T>(url, config as never),
    
  patch: <T = unknown>(url: string, data?: unknown, config?: unknown) => 
    apiClient.patch<T>(url, data, config as never),
};

export { apiClient };