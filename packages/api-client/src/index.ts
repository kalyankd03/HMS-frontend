// HTTP Client
export * from './client/http-client';

// API endpoints
export * from './auth/endpoints';
export * from './patients/endpoints';
export * from './doctors/endpoints';
export * from './medicines/endpoints';
export * from './services/endpoints';
export * from './billing/endpoints';

// Export queue-related types
export type { QueueVisit, QueueStats, QueueResponse, NextPatientResponse } from './doctors/endpoints';

// Main API client factory
import { createApiClient, type ApiClientConfig } from './client/http-client';
import { createAuthApi } from './auth/endpoints';
import { createPatientsApi } from './patients/endpoints';
import { createDoctorsApi } from './doctors/endpoints';
import { createMedicinesApi } from './medicines/endpoints';
import { createServicesApi } from './services/endpoints';
import { createBillingApi } from './billing/endpoints';

export interface ApiClientUrls {
  authUrl: string;
  patientUrl: string;
  doctorUrl: string;
  billingUrl: string;
}

export class HmsApiClient {
  private readonly authClient: ReturnType<typeof createApiClient>;
  private readonly patientClient: ReturnType<typeof createApiClient>;
  private readonly doctorClient: ReturnType<typeof createApiClient>;
  private readonly billingClient: ReturnType<typeof createApiClient>;

  public auth: ReturnType<typeof createAuthApi>;
  public patients: ReturnType<typeof createPatientsApi>;
  public doctors: ReturnType<typeof createDoctorsApi>;
  public medicines: ReturnType<typeof createMedicinesApi>;
  public services: ReturnType<typeof createServicesApi>;
  public billing: ReturnType<typeof createBillingApi>;

  constructor(urls: ApiClientUrls, config?: Omit<ApiClientConfig, 'baseUrl'>) {
    this.authClient = createApiClient({ baseUrl: urls.authUrl, ...config });
    this.patientClient = createApiClient({ baseUrl: urls.patientUrl, ...config });
    this.doctorClient = createApiClient({ baseUrl: urls.doctorUrl, ...config });
    this.billingClient = createApiClient({ baseUrl: urls.billingUrl, ...config });

    this.auth = createAuthApi(this.authClient);
    this.patients = createPatientsApi(this.patientClient, urls.patientUrl);
    this.doctors = createDoctorsApi(this.doctorClient, urls.doctorUrl);
    this.medicines = createMedicinesApi(this.patientClient, urls.patientUrl);
    this.services = createServicesApi(this.billingClient, urls.billingUrl);
    this.billing = createBillingApi(this.billingClient, urls.billingUrl);
  }
}

export function createHmsApiClient(urls: ApiClientUrls, config?: Omit<ApiClientConfig, 'baseUrl'>): HmsApiClient {
  return new HmsApiClient(urls, config);
}
