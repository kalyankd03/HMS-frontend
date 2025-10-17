import type {
  ServiceCatalogItem,
  CreateServiceInput,
  UpdateServiceInput,
} from '@hms/core';
import type { HttpClient } from '../client/http-client';

interface ServicesListResponse {
  services: ServiceCatalogItem[];
}

interface SetDefaultResponse {
  message: string;
}

export class ServicesApi {
  constructor(private readonly client: HttpClient, private readonly baseUrl: string) {}

  async listServices(token: string): Promise<ServiceCatalogItem[]> {
    const authenticatedClient = this.client.withAuth(token);
    const response = await authenticatedClient.request<ServicesListResponse>(`${this.baseUrl}/api/services`);
    return response.services;
  }

  async createService(data: CreateServiceInput, token: string): Promise<ServiceCatalogItem> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<ServiceCatalogItem>(`${this.baseUrl}/api/services`, {
      method: 'POST',
      data,
    });
  }

  async updateService(id: number, data: UpdateServiceInput, token: string): Promise<ServiceCatalogItem> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<ServiceCatalogItem>(`${this.baseUrl}/api/services/${id}`, {
      method: 'PUT',
      data,
    });
  }

  async deleteService(id: number, token: string): Promise<void> {
    const authenticatedClient = this.client.withAuth(token);
    await authenticatedClient.request<void>(`${this.baseUrl}/api/services/${id}`, {
      method: 'DELETE',
    });
  }

  async setDefaultService(id: number, token: string): Promise<SetDefaultResponse> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<SetDefaultResponse>(`${this.baseUrl}/api/services/${id}/set-default-opd`, {
      method: 'PUT',
    });
  }
}

export function createServicesApi(client: HttpClient, baseUrl: string): ServicesApi {
  return new ServicesApi(client, baseUrl);
}
