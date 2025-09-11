import type {
  LoginForm,
  RegisterForm,
  LoginResponse,
  RegisterResponse,
  User,
  Hospital,
} from '@hms/core';
import type { HttpClient } from '../client/http-client';

export class AuthApi {
  constructor(private readonly client: HttpClient) {}

  async login(credentials: LoginForm): Promise<LoginResponse> {
    return this.client.request<LoginResponse>('/api/auth/login', { method: 'POST', data: credentials });
  }

  async register(userData: RegisterForm): Promise<RegisterResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...apiData } = userData;
    return this.client.request<RegisterResponse>('/api/auth/register', { method: 'POST', data: apiData });
  }

  async getProfile(token: string): Promise<User> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<User>('/api/auth/me');
  }

  async getHospital(hospitalId: number, token: string): Promise<Hospital> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<Hospital>(`/api/hospitals/${hospitalId}`);
  }
}

export function createAuthApi(client: HttpClient): AuthApi {
  return new AuthApi(client);
}