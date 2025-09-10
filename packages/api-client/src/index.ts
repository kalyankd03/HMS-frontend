// HTTP Client
export * from './client/http-client';

// API endpoints
export * from './auth/endpoints';
export * from './patients/endpoints';
export * from './doctors/endpoints';

// Main API client factory
import { createApiClient, type ApiClientConfig } from './client/http-client';
import { createAuthApi } from './auth/endpoints';
import { createPatientsApi } from './patients/endpoints';
import { createDoctorsApi } from './doctors/endpoints';

export interface ApiClientUrls {
  authUrl: string;
  patientUrl: string;
}

export class HmsApiClient {
  private authClient: ReturnType<typeof createApiClient>;
  private patientClient: ReturnType<typeof createApiClient>;

  public auth: ReturnType<typeof createAuthApi>;
  public patients: ReturnType<typeof createPatientsApi>;
  public doctors: ReturnType<typeof createDoctorsApi>;

  constructor(urls: ApiClientUrls, config?: Omit<ApiClientConfig, 'baseUrl'>) {
    this.authClient = createApiClient({ baseUrl: urls.authUrl, ...config });
    this.patientClient = createApiClient({ baseUrl: urls.patientUrl, ...config });

    this.auth = createAuthApi(this.authClient);
    this.patients = createPatientsApi(this.patientClient, urls.patientUrl);
    this.doctors = createDoctorsApi(this.authClient, urls.patientUrl);
  }
}

export function createHmsApiClient(urls: ApiClientUrls, config?: Omit<ApiClientConfig, 'baseUrl'>): HmsApiClient {
  return new HmsApiClient(urls, config);
}