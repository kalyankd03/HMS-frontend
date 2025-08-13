# Shared Types & Backend Integration

## Backend Data Models
These types should match the HMS-app backend exactly:

```typescript
// Core user types from HMS auth-service
interface User {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}

interface Role {
  role_id: number;
  name: 'admin' | 'doctor' | 'frontdesk' | 'labtech' | 'pharmacist';
  description?: string;
}

// API response types
interface LoginResponse {
  user: User;
  token: string;
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## Logging Integration
Match HMS-app logging patterns:

```typescript
// Frontend logging interface (console only, no Pino)
interface LogContext {
  requestId?: string;
  userId?: number;
  route?: string;
  action?: string;
}

// Never log these fields
type PIIFields = 'password' | 'token' | 'email' | 'phone' | 'ssn';
```

## Environment Variables
```typescript
interface AppConfig {
  NEXT_PUBLIC_AUTH_URL: string;  // HMS auth-service endpoint
  NODE_ENV: 'development' | 'production' | 'test';
}
```

## API Client Patterns
- **Error Handling**: Match backend error format exactly
- **Headers**: `Content-Type: application/json`, `Authorization: Bearer {token}`
- **Request IDs**: Generate UUID for request tracking
- **Timeouts**: 30s for auth requests, 10s for profile requests
- **Retries**: No automatic retries (let user retry manually)

## Type Guards
```typescript
function isApiError(response: unknown): response is ApiError {
  return typeof response === 'object' && 
         response !== null && 
         'error' in response;
}

function isLoginResponse(response: unknown): response is LoginResponse {
  return typeof response === 'object' && 
         response !== null && 
         'user' in response && 
         'token' in response;
}
```

## Constants
```typescript
const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  PROFILE: '/auth/me',
} as const;

const STORAGE_KEYS = {
  AUTH_TOKEN: 'hms_auth_token',
} as const;

const USER_ROLES = {
  ADMIN: 1,
  DOCTOR: 2, 
  FRONTDESK: 3,
  LABTECH: 4,
  PHARMACIST: 5,
} as const;
```
