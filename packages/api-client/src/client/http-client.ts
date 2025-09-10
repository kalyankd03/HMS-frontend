import { API_CONFIG, isApiError, getErrorMessage } from '@hms/core';

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

// Generate request ID for logging
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export class HttpClient {
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: API_CONFIG.TIMEOUT,
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const requestId = generateRequestId();
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const requestConfig: RequestInit = {
      method: options.method || 'GET',
      headers: {
        ...this.config.defaultHeaders,
        ...options.headers,
      },
      signal: AbortSignal.timeout(options.timeout || this.config.timeout),
    };

    if (options.body && requestConfig.method !== 'GET') {
      requestConfig.body = JSON.stringify(options.body);
    }

    try {
      console.info(`[${requestId}] ${requestConfig.method} ${endpoint}`);
      
      const response = await fetch(url, requestConfig);
      const data: unknown = await response.json();

      if (!response.ok) {
        if (isApiError(data)) {
          console.warn(`[${requestId}] API Error: ${data.error.code} - ${data.error.message}`);
          throw new Error(data.error.message);
        }
        console.error(`[${requestId}] HTTP Error: ${response.status} ${response.statusText}`);
        throw new Error(response.statusText || 'Request failed');
      }

      console.info(`[${requestId}] Success`);
      return data as T;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`[${requestId}] Request failed:`, message);
      throw new Error(message);
    }
  }

  async get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  // Create authenticated client
  withAuth(token: string): HttpClient {
    return new HttpClient({
      ...this.config,
      defaultHeaders: {
        ...this.config.defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

// Factory functions for creating API clients
export function createApiClient(config: ApiClientConfig): HttpClient {
  return new HttpClient(config);
}

export function createAuthenticatedClient(baseUrl: string, token: string): HttpClient {
  return createApiClient({ baseUrl }).withAuth(token);
}