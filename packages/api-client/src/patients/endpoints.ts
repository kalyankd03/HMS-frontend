import type {
  Patient,
  CreatePatientForm,
  CreateOpTicketForm,
  OpTicket,
  DoctorSearchResponse,
} from '@hms/core';
import type { HttpClient } from '../client/http-client';

export class PatientsApi {
  constructor(private readonly client: HttpClient, private readonly baseUrl: string) {}

  async createPatient(data: CreatePatientForm, token: string): Promise<Patient> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<Patient>(`${this.baseUrl}/api/patients`, { method: 'POST', data });
  }

  async createOpTicket(data: CreateOpTicketForm, token: string): Promise<OpTicket> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<OpTicket>(`${this.baseUrl}/api/op-tickets`, { method: 'POST', data });
  }

  async searchPatients(query: string, token: string, limit = 10): Promise<{ results: Patient[] }> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return authenticatedClient.request<{ results: Patient[] }>(`${this.baseUrl}/api/patients/search?${params.toString()}`);
  }

  async getPatient(patientId: number, token: string): Promise<Patient> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<Patient>(`${this.baseUrl}/api/patients/${patientId}`);
  }

  async updatePatient(patientId: number, data: Partial<CreatePatientForm>, token: string): Promise<Patient> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<Patient>(`${this.baseUrl}/api/patients/${patientId}`, { method: 'PUT', data });
  }

  async deletePatient(patientId: number, token: string): Promise<{ message: string }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string }>(`${this.baseUrl}/api/patients/${patientId}`, { method: 'DELETE' });
  }

  async searchDoctors(query: string, token: string, limit = 10): Promise<DoctorSearchResponse> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return authenticatedClient.request<DoctorSearchResponse>(`${this.baseUrl}/api/doctors/search?${params.toString()}`);
  }
}

export function createPatientsApi(client: HttpClient, baseUrl: string): PatientsApi {
  return new PatientsApi(client, baseUrl);
}