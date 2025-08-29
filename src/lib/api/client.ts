import axios from 'axios';

const API_CONFIG = {
  baseURL: 'https://api.spacexdata.com/v4',
  timeout: 30000,
} as const;

export interface ApiError extends Error {
  isApiError: true;
  statusCode?: number;
  errorCode?: string;
  timestamp: string;
  isNetworkError: boolean;
  isTimeoutError: boolean;
  isRateLimitError: boolean;
}

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    (config as any).metadata = { startTime: Date.now() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    const apiError: ApiError = {
      name: 'ApiError',
      message: error.message,
      isApiError: true,
      statusCode: error.response?.status,
      errorCode: error.code,
      timestamp: new Date().toISOString(),
      isNetworkError: !error.response,
      isTimeoutError: error.code === 'ECONNABORTED',
      isRateLimitError: error.response?.status === 429,
    };

    return Promise.reject(apiError);
  }
);

export const apiRequest = {
  get: <T = any>(url: string, config?: any) => 
    apiClient.get<T>(url, config),
    
  post: <T = any>(url: string, data?: any, config?: any) => 
    apiClient.post<T>(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: any) => 
    apiClient.put<T>(url, data, config),
    
  delete: <T = any>(url: string, config?: any) => 
    apiClient.delete<T>(url, config),
    
  patch: <T = any>(url: string, data?: any, config?: any) => 
    apiClient.patch<T>(url, data, config),
};

export const createCancelToken = () => {
  const controller = new AbortController();
  return {
    token: controller.signal,
    cancel: (reason?: string) => controller.abort(reason),
  };
};

export const apiUtils = {
  isApiError: (error: unknown): error is ApiError => {
    return typeof error === 'object' && error !== null && 'isApiError' in error;
  },
  
  getErrorMessage: (error: unknown): string => {
    if (apiUtils.isApiError(error)) {
      if (error.isRateLimitError) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      if (error.isNetworkError) {
        return 'Network connection failed. Please check your internet connection.';
      }
      if (error.isTimeoutError) {
        return 'Request timed out. Please try again.';
      }
      if (error.statusCode === 404) {
        return 'The requested resource was not found.';
      }
      if (error.statusCode && error.statusCode >= 500) {
        return 'Server error. Please try again later.';
      }
      return error.message || 'An API error occurred';
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  },

  isRetryableError: (error: unknown): boolean => {
    if (!apiUtils.isApiError(error)) return false;
    return (
      error.isNetworkError ||
      error.isTimeoutError ||
      error.isRateLimitError ||
      (error.statusCode !== undefined && error.statusCode >= 500)
    );
  },
};

export { apiClient };