import type {
  DoctorWithUser,
  CreateDoctorForm,
  UpdateDoctorForm,
  Doctor,
  Department,
  EMRData,
} from '@hms/core';
import type { HttpClient } from '../client/http-client';

// Queue-related types
export interface QueueVisit {
  op_id: number;
  patient_id: number;
  allotted_doctor_id: number;
  patient_name: string;
  patient_age: string;
  patient_gender: string | null;
  visit_status: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  chief_complaint: string | null;
  primary_diagnosis_code: string | null;
  primary_diagnosis_name: string | null;
  wait_time_minutes: number;
}

export interface QueueStats {
  total_waiting: number;
  total_active: number;
  total_paused: number;
}

export interface QueueResponse {
  visits: QueueVisit[];
  stats: QueueStats;
}

export interface NextPatientResponse {
  next_patient: {
    op_id: number;
    patient_name: string;
    wait_time_minutes: number;
    chief_complaint: string;
  } | null;
}

export class DoctorsApi {
  constructor(private readonly client: HttpClient, private readonly baseUrl: string) {}



  async getDoctor(doctorId: number, token: string): Promise<DoctorWithUser> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<DoctorWithUser>(`${this.baseUrl}/api/doctors/${doctorId}`);
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
    const url = queryString ? `${this.baseUrl}/api/doctors?${queryString}` : `${this.baseUrl}/api/doctors`;
    
    return authenticatedClient.request<{ doctors: DoctorWithUser[] }>(url);
  }

  async createDoctor(doctorData: CreateDoctorForm, token: string): Promise<Doctor> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<Doctor>(`${this.baseUrl}/api/doctors`, { method: 'POST', data: doctorData });
  }

  async updateDoctor(doctorId: number, updates: UpdateDoctorForm, token: string): Promise<Doctor> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<Doctor>(`${this.baseUrl}/api/doctors/${doctorId}`, { method: 'PUT', data: updates });
  }

  async deactivateDoctor(doctorId: number, token: string): Promise<{ message: string; doctor: Doctor }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string; doctor: Doctor }>(`${this.baseUrl}/api/doctors/${doctorId}`, { method: 'DELETE' });
  }

  async getDepartments(token: string, hospitalId?: number): Promise<{ departments: Department[] }> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams();
    
    if (hospitalId) params.append('hospital_id', hospitalId.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/api/doctors/meta/departments?${queryString}` : `${this.baseUrl}/api/doctors/meta/departments`;
    
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
    const url = queryString ? `${this.baseUrl}/api/doctors/meta/specialities?${queryString}` : `${this.baseUrl}/api/doctors/meta/specialities`;
    
    return authenticatedClient.request<{ specialities: string[] }>(url);
  }

  async indexDoctors(token: string): Promise<{ message: string }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string }>(`${this.baseUrl}/api/doctors/index`, { method: 'POST' });
  }

  // Queue Management Methods
  async getQueue(token: string, refresh?: boolean): Promise<QueueResponse> {
    const authenticatedClient = this.client.withAuth(token);
    const params = new URLSearchParams();
    if (refresh) params.append('refresh', 'true');
    
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/api/queue?${queryString}` : `${this.baseUrl}/api/queue`;
    
    return authenticatedClient.request<QueueResponse>(url);
  }

  async getNextPatient(token: string): Promise<NextPatientResponse> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<NextPatientResponse>(`${this.baseUrl}/api/queue/next`);
  }

  async refreshQueue(token: string): Promise<QueueResponse> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<QueueResponse>(`${this.baseUrl}/api/queue/refresh`, { method: 'POST' });
  }

  async startVisit(opId: number, token: string): Promise<{ message: string; visit: any }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string; visit: any }>(`${this.baseUrl}/api/visits/start`, {
      method: 'POST',
      data: { op_id: opId }
    });
  }

  async pauseVisit(opId: number, token: string, data?: {
    reason?: string;
    notes?: string;
    clinical_data?: any;
  }): Promise<{ message: string }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string }>(`${this.baseUrl}/api/visits/${opId}/pause`, {
      method: 'POST',
      data
    });
  }

  async resumeVisit(opId: number, token: string): Promise<{ message: string; visit: any; cached_data: any }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string; visit: any; cached_data: any }>(`${this.baseUrl}/api/visits/${opId}/resume`, {
      method: 'POST'
    });
  }

  async completeVisit(opId: number, token: string, clinicalData: {
    primary_diagnosis_code?: string;
    primary_diagnosis_name?: string;
    diagnosis_category?: string;
    treatment_plan?: string;
    visit_outcome?: string;
    follow_up_required?: boolean;
    clinical_notes?: string;
  }): Promise<{ message: string }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string }>(`${this.baseUrl}/api/visits/${opId}/complete`, {
      method: 'POST',
      data: { clinical_data: clinicalData }
    });
  }

  async getVisitDetails(opId: number, token: string): Promise<any> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<any>(`${this.baseUrl}/api/visits/${opId}`);
  }

  async updateClinicalData(opId: number, token: string, data: {
    chief_complaint?: string;
    primary_diagnosis_code?: string;
    primary_diagnosis_name?: string;
    diagnosis_category?: string;
    treatment_plan?: string;
    clinical_notes?: string;
  }): Promise<{ message: string }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string }>(`${this.baseUrl}/api/visits/${opId}/clinical-data`, {
      method: 'PATCH',
      data
    });
  }

  // EMR Data Management
  async saveEMRData(opId: number, token: string, emrData: Partial<EMRData>): Promise<{ message: string; emr: EMRData }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string; emr: EMRData }>(`${this.baseUrl}/api/emr/${opId}`, {
      method: 'POST',
      data: emrData
    });
  }

  async getEMRData(opId: number, token: string): Promise<EMRData> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<EMRData>(`${this.baseUrl}/api/emr/${opId}`);
  }

  async updateEMRData(opId: number, token: string, emrData: Partial<EMRData>): Promise<{ message: string; emr: EMRData }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string; emr: EMRData }>(`${this.baseUrl}/api/emr/${opId}`, {
      method: 'PUT',
      data: emrData
    });
  }

  async generatePrescription(opId: number, token: string): Promise<{ message: string; prescriptionUrl: string }> {
    const authenticatedClient = this.client.withAuth(token);
    return authenticatedClient.request<{ message: string; prescriptionUrl: string }>(`${this.baseUrl}/api/emr/${opId}/prescription`, {
      method: 'POST'
    });
  }
}

export function createDoctorsApi(client: HttpClient, baseUrl: string): DoctorsApi {
  return new DoctorsApi(client, baseUrl);
}