import { 
  LoginForm, 
  RegisterForm, 
  LoginResponse, 
  RegisterResponse, 
  User, 
  ApiError, 
  isApiError,
  API_ENDPOINTS 
} from './types';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001';

// Generate request ID for logging
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Generic HTTP client
async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const requestId = generateRequestId();
  const url = `${AUTH_URL}${path}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.info(`[${requestId}] ${config.method || 'GET'} ${path}`);
    
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      if (isApiError(data)) {
        console.warn(`[${requestId}] API Error: ${data.error.code} - ${data.error.message}`);
        throw new Error(data.error.message);
      }
      console.error(`[${requestId}] HTTP Error: ${response.status} ${response.statusText}`);
      throw new Error(response.statusText || 'Request failed');
    }

    console.info(`[${requestId}] Success`);
    return data;
  } catch (error) {
    console.error(`[${requestId}] Request failed:`, error);
    throw error;
  }
}

// Authentication API
export async function login(credentials: LoginForm): Promise<LoginResponse> {
  return http<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(userData: RegisterForm): Promise<RegisterResponse> {
  const { confirmPassword, ...apiData } = userData;
  return http<RegisterResponse>(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(apiData),
  });
}

export async function getProfile(token: string): Promise<User> {
  return http<User>(API_ENDPOINTS.PROFILE, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
