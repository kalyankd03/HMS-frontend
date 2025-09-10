import type {
  Patient,
  CreatePatientForm,
  CreateOpTicketForm,
  OpTicket,
} from '@hms/core';
import type { HttpClient } from '../client/http-client';

export class PatientsApi {
  constructor(private client: HttpClient, private baseUrl: string) {}

  async createPatient(data: CreatePatientForm, token: string): Promise<Patient> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.post<Patient>(`${this.baseUrl}/api/patients`, data);
  }

  async createOpTicket(data: CreateOpTicketForm, token: string): Promise<OpTicket> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.post<OpTicket>(`${this.baseUrl}/api/op-tickets`, data);
  }

  async searchPatients(query: string, token: string, limit = 10): Promise<{ results: Patient[] }> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return authenticatedClient.get<{ results: Patient[] }>(`${this.baseUrl}/api/patients/search?${params.toString()}`);
  }

  async getPatient(patientId: number, token: string): Promise<Patient> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.get<Patient>(`${this.baseUrl}/api/patients/${patientId}`);
  }

  async updatePatient(patientId: number, data: Partial<CreatePatientForm>, token: string): Promise<Patient> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.put<Patient>(`${this.baseUrl}/api/patients/${patientId}`, data);
  }

  async deletePatient(patientId: number, token: string): Promise<{ message: string }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.delete<{ message: string }>(`${this.baseUrl}/api/patients/${patientId}`);
  }
}

export function createPatientsApi(client: HttpClient, baseUrl: string): PatientsApi {
  return new PatientsApi(client, baseUrl);
}