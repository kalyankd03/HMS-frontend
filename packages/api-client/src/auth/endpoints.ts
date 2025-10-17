import type {
  LoginForm,
  RegisterForm,
  LoginResponse,
  RegisterResponse,
  UserProfile,
  Hospital,
} from '@hms/core';
import type { HttpClient } from '../client/http-client';

export class AuthApi {
  constructor(private readonly client: HttpClient) {}

  async login(credentials: LoginForm): Promise<LoginResponse> {
    // Password should be base64 encoded by the calling code before passing to this method
    return this.client.request<LoginResponse>('/api/auth/login', { method: 'POST', data: credentials });
  }

  async register(userData: RegisterForm): Promise<RegisterResponse> {
    // Password should be base64 encoded by the calling code before passing to this method
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...apiData } = userData;
    return this.client.request<RegisterResponse>('/api/auth/register', { method: 'POST', data: apiData });
  }

  async getProfile(token: string): Promise<UserProfile> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<UserProfile>('/api/auth/me');
  }

  async getHospital(hospitalId: number, token: string): Promise<Hospital> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<Hospital>(`/api/hospitals/${hospitalId}`);
  }
}

export function createAuthApi(client: HttpClient): AuthApi {
  return new AuthApi(client);
}