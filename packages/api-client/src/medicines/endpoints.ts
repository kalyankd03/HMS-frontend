import type { MedicineSearchResponse } from '@hms/core';
import type { HttpClient } from '../client/http-client';

export class MedicinesApi {
  constructor(private readonly client: HttpClient, private readonly baseUrl: string) {}

  async searchMedicines(query: string, token: string, limit = 10): Promise<MedicineSearchResponse> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return authenticatedClient.request<MedicineSearchResponse>(`${this.baseUrl}/api/medicines/search?${params.toString()}`);
  }
}

export function createMedicinesApi(client: HttpClient, baseUrl: string): MedicinesApi {
  return new MedicinesApi(client, baseUrl);
}
