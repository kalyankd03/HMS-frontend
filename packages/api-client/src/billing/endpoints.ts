import type {
  BillingDocument,
  BillingDocumentFilters,
  PaymentFilters,
  PaymentRecord,
} from '@hms/core';
import type { HttpClient } from '../client/http-client';

interface BillingDocumentsResponse {
  documents: BillingDocument[];
}

interface PaymentsResponse {
  payments: PaymentRecord[];
}

export class BillingApi {
  constructor(private readonly client: HttpClient, private readonly baseUrl: string) {}

  async listDocuments(filters: BillingDocumentFilters | undefined, token: string): Promise<BillingDocument[]> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams();

    if (filters?.status) params.set('status', filters.status);
    if (filters?.from_date) params.set('from_date', filters.from_date);
    if (filters?.to_date) params.set('to_date', filters.to_date);
    if (filters?.patient_id) params.set('patient_id', String(filters.patient_id));

    const query = params.toString();
    const endpoint = query ? `${this.baseUrl}/api/billing/documents?${query}` : `${this.baseUrl}/api/billing/documents`;

    const response = await authenticatedClient.request<BillingDocumentsResponse>(endpoint);
    return response.documents ?? [];
  }

  async listPayments(filters: PaymentFilters | undefined, token: string): Promise<PaymentRecord[]> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams();

    if (filters?.status) params.set('status', filters.status);
    if (filters?.from_date) params.set('from_date', filters.from_date);
    if (filters?.to_date) params.set('to_date', filters.to_date);
    if (filters?.patient_id) params.set('patient_id', String(filters.patient_id));

    const query = params.toString();
    const endpoint = query ? `${this.baseUrl}/api/billing/payments?${query}` : `${this.baseUrl}/api/billing/payments`;

    const response = await authenticatedClient.request<PaymentsResponse>(endpoint);
    return response.payments ?? [];
  }
}

export function createBillingApi(client: HttpClient, baseUrl: string): BillingApi {
  return new BillingApi(client, baseUrl);
}
