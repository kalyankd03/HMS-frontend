import type {
  DoctorSearchResponse,
  DoctorWithUser,
  CreateDoctorForm,
  UpdateDoctorForm,
  Doctor,
  Department,
} from '@hms/core';
import type { HttpClient } from '../client/http-client';

export class DoctorsApi {
  constructor(private readonly client: HttpClient, private readonly baseUrl: string) {}

  async searchDoctors(query: string, token: string, limit = 10): Promise<DoctorSearchResponse> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return authenticatedClient.request<DoctorSearchResponse>(`${this.baseUrl}/api/doctors/search?${params.toString()}`);
  }

  async getDoctor(doctorId: number, token: string): Promise<DoctorWithUser> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<DoctorWithUser>(`/api/doctors/${doctorId}`);
  }

  async getAllDoctors(token: string, options?: {
    hospital_id?: number;
    dept?: string;
    speciality?: string;
  }): Promise<{ doctors: DoctorWithUser[] }> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams();
    
    if (options?.hospital_id) params.append('hospital_id', options.hospital_id.toString());
    if (options?.dept) params.append('dept', options.dept);
    if (options?.speciality) params.append('speciality', options.speciality);
    
    const queryString = params.toString();
    const url = queryString ? `/api/doctors?${queryString}` : '/api/doctors';
    
    return authenticatedClient.request<{ doctors: DoctorWithUser[] }>(url);
  }

  async createDoctor(doctorData: CreateDoctorForm, token: string): Promise<Doctor> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<Doctor>('/api/doctors', { method: 'POST', data: doctorData });
  }

  async updateDoctor(doctorId: number, updates: UpdateDoctorForm, token: string): Promise<Doctor> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<Doctor>(`/api/doctors/${doctorId}`, { method: 'PUT', data: updates });
  }

  async deactivateDoctor(doctorId: number, token: string): Promise<{ message: string; doctor: Doctor }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string; doctor: Doctor }>(`/api/doctors/${doctorId}`, { method: 'DELETE' });
  }

  async getDepartments(token: string, hospitalId?: number): Promise<{ departments: Department[] }> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams();
    
    if (hospitalId) params.append('hospital_id', hospitalId.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/api/doctors/meta/departments?${queryString}` : '/api/doctors/meta/departments';
    
    return authenticatedClient.request<{ departments: Department[] }>(url);
  }

  async getSpecialities(token: string, options?: {
    hospital_id?: number;
    dept?: string;
  }): Promise<{ specialities: string[] }> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams();
    
    if (options?.hospital_id) params.append('hospital_id', options.hospital_id.toString());
    if (options?.dept) params.append('dept', options.dept);
    
    const queryString = params.toString();
    const url = queryString ? `/api/doctors/meta/specialities?${queryString}` : '/api/doctors/meta/specialities';
    
    return authenticatedClient.request<{ specialities: string[] }>(url);
  }

  async indexDoctors(token: string): Promise<{ message: string }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string }>(`${this.baseUrl}/api/doctors/index`, { method: 'POST' });
  }
}

export function createDoctorsApi(client: HttpClient, baseUrl: string): DoctorsApi {
  return new DoctorsApi(client, baseUrl);
}