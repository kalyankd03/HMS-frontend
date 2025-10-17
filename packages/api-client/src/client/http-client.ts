import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, isApiError, getErrorMessage } from '@hms/core';

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      requestId: string;
    };
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

// Generate request ID for logging
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders,
      },
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use((config) => {
      const requestId = generateRequestId();
      config.metadata = { requestId };
      console.info(`[${requestId}] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // Add response interceptor for error handling and logging
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const requestId = response.config.metadata?.requestId;
        console.info(`[${requestId}] Success`);
        return response;
      },
      (error: AxiosError) => {
        const requestId = error.config?.metadata?.requestId;
        
        // Handle authentication errors (401/403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn(`[${requestId}] Authentication error: ${error.response.status}`);
          // Create enhanced error with auth flag
          const authError = new Error(error.response.statusText || 'Authentication failed');
          (authError as any).status = error.response.status;
          (authError as any).isAuthError = true;
          throw authError;
        }
        
        if (error.response?.data && isApiError(error.response.data)) {
          const apiError = error.response.data;
          console.warn(`[${requestId}] API Error: ${apiError.error.code} - ${apiError.error.message}`);
          const enhancedError = new Error(apiError.error.message);
          (enhancedError as any).status = error.response.status;
          throw enhancedError;
        }
        
        if (error.response) {
          console.error(`[${requestId}] HTTP Error: ${error.response.status} ${error.response.statusText}`);
          const enhancedError = new Error(error.response.statusText || 'Request failed');
          (enhancedError as any).status = error.response.status;
          throw enhancedError;
        }
        
        const message = getErrorMessage(error);
        console.error(`[${requestId}] Request failed:`, message);
        throw new Error(message);
      }
    );
  }

  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const config: AxiosRequestConfig = {
      url: endpoint,
      method: options.method || 'GET',
      data: options.data,
      headers: options.headers,
      timeout: options.timeout,
    };

    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }

  // Create authenticated client
  withAuth(token: string): HttpClient {
    const currentHeaders = this.axiosInstance.defaults.headers.common as Record<string, string>;
    const newClient = new HttpClient({
      baseUrl: this.axiosInstance.defaults.baseURL || '',
      timeout: this.axiosInstance.defaults.timeout,
      defaultHeaders: {
        ...currentHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
    return newClient;
  }
}

// Factory functions for creating API clients
export function createApiClient(config: ApiClientConfig): HttpClient {
  return new HttpClient(config);
}

export function createAuthenticatedClient(baseUrl: string, token: string): HttpClient {
  return createApiClient({ baseUrl }).withAuth(token);
}