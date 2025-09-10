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
  constructor(private client: HttpClient) {}

  async login(credentials: LoginForm): Promise<LoginResponse> {
    return this.client.post<LoginResponse>('/api/auth/login', credentials);
  }

  async register(userData: RegisterForm): Promise<RegisterResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...apiData } = userData;
    return this.client.post<RegisterResponse>('/api/auth/register', apiData);
  }

  async getProfile(token: string): Promise<User> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.get<User>('/api/auth/me');
  }

  async getHospital(hospitalId: number, token: string): Promise<Hospital> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.get<Hospital>(`/api/hospitals/${hospitalId}`);
  }
}

export function createAuthApi(client: HttpClient): AuthApi {
  return new AuthApi(client);
}