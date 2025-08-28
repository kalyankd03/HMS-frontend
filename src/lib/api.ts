import { 
  LoginForm, 
  RegisterForm, 
  LoginResponse, 
  RegisterResponse, 
  User,
  Hospital,
  Doctor,
  Patient,
  OpTicket,
  DoctorWithUser,
  CreateDoctorForm,
  RosterUser,
  InviteUserRequest,
  HospitalInfo,
  Department,
  CreateOpTicketForm,
  CreatePatientForm,
  UpdateDoctorForm,
  DoctorSearchResponse,
  isApiError,
  API_ENDPOINTS 
} from './types';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001';
const PATIENT_URL = process.env.NEXT_PUBLIC_PATIENT_URL || 'http://localhost:3002';

// Generate request ID for logging
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Generic HTTP client
async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const requestId = generateRequestId();
  const url = `${AUTH_URL}${path}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.info(`[${requestId}] ${config.method || 'GET'} ${path}`);
    
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      if (isApiError(data)) {
        console.warn(`[${requestId}] API Error: ${data.error.code} - ${data.error.message}`);
        throw new Error(data.error.message);
      }
      console.error(`[${requestId}] HTTP Error: ${response.status} ${response.statusText}`);
      throw new Error(response.statusText || 'Request failed');
    }

    console.info(`[${requestId}] Success`);
    return data;
  } catch (error) {
    console.error(`[${requestId}] Request failed:`, error);
    throw error;
  }
}

// Authentication API
export async function login(credentials: LoginForm): Promise<LoginResponse> {
  return http<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(userData: RegisterForm): Promise<RegisterResponse> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirmPassword, ...apiData } = userData;
  return http<RegisterResponse>(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(apiData),
  });
}

export async function getProfile(token: string): Promise<User> {
  return http<User>(API_ENDPOINTS.PROFILE, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getHospital(hospitalId: number, token: string): Promise<Hospital> {
  return http<Hospital>(`/api/hospitals/${hospitalId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Doctors API
export async function getDoctor(doctorId: number, token: string): Promise<DoctorWithUser> {
  return http<DoctorWithUser>(`/api/doctors/${doctorId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAllDoctors(token: string, options?: {
  hospital_id?: number;
  dept?: string;
  speciality?: string;
}): Promise<{ doctors: DoctorWithUser[] }> {
  const params = new URLSearchParams();
  if (options?.hospital_id) params.append('hospital_id', options.hospital_id.toString());
  if (options?.dept) params.append('dept', options.dept);
  if (options?.speciality) params.append('speciality', options.speciality);
  
  const queryString = params.toString();
  const url = `/api/doctors${queryString ? `?${queryString}` : ''}`;
  
  return http<{ doctors: DoctorWithUser[] }>(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createDoctor(doctorData: CreateDoctorForm, token: string): Promise<Doctor> {
  return http<Doctor>('/api/doctors', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(doctorData),
  });
}

export async function updateDoctor(doctorId: number, updates: UpdateDoctorForm, token: string): Promise<Doctor> {
  return http<Doctor>(`/api/doctors/${doctorId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
}

export async function deactivateDoctor(doctorId: number, token: string): Promise<{ message: string; doctor: Doctor }> {
  return http<{ message: string; doctor: Doctor }>(`/api/doctors/${doctorId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getDepartments(token: string, hospitalId?: number): Promise<{ departments: Department[] }> {
  const params = new URLSearchParams();
  if (hospitalId) params.append('hospital_id', hospitalId.toString());
  
  const queryString = params.toString();
  const url = `/api/doctors/meta/departments${queryString ? `?${queryString}` : ''}`;
  
  return http<{ departments: Department[] }>(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getSpecialities(token: string, options?: {
  hospital_id?: number;
  dept?: string;
}): Promise<{ specialities: string[] }> {
  const params = new URLSearchParams();
  if (options?.hospital_id) params.append('hospital_id', options.hospital_id.toString());
  if (options?.dept) params.append('dept', options.dept);
  
  const queryString = params.toString();
  const url = `/api/doctors/meta/specialities${queryString ? `?${queryString}` : ''}`;
  
  return http<{ specialities: string[] }>(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Auth API helper (using AUTH_URL)
async function httpAuth<T>(path: string, options: RequestInit = {}): Promise<T> {
  const requestId = generateRequestId();
  const url = `${AUTH_URL}${path}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.info(`[${requestId}] ${config.method || 'GET'} ${path}`);
    
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      if (isApiError(data)) {
        console.warn(`[${requestId}] API Error: ${data.error.code} - ${data.error.message}`);
        throw new Error(data.error.message);
      }
      console.error(`[${requestId}] HTTP Error: ${response.status} ${response.statusText}`);
      throw new Error(response.statusText || 'Request failed');
    }

    console.info(`[${requestId}] Success`);
    return data;
  } catch (error) {
    console.error(`[${requestId}] Request failed:`, error);
    throw error;
  }
}

// Patient API
async function httpPatient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const requestId = generateRequestId();
  const url = `${PATIENT_URL}${path}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.info(`[${requestId}] ${config.method || 'GET'} ${path}`);
    
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      if (isApiError(data)) {
        console.warn(`[${requestId}] API Error: ${data.error.code} - ${data.error.message}`);
        throw new Error(data.error.message);
      }
      console.error(`[${requestId}] HTTP Error: ${response.status} ${response.statusText}`);
      throw new Error(response.statusText || 'Request failed');
    }

    console.info(`[${requestId}] Success`);
    return data;
  } catch (error) {
    console.error(`[${requestId}] Request failed:`, error);
    throw error;
  }
}

export async function createPatient(data: CreatePatientForm, token: string) {
  return httpPatient<import('./types').Patient>('/api/patients', { 
    method: 'POST', 
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

export async function createOpTicket(data: CreateOpTicketForm, token: string) {
  return httpPatient<OpTicket>('/api/op-tickets', { 
    method: 'POST', 
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

export async function searchPatients(q: string, token: string, limit = 10) {
  const params = new URLSearchParams({ q, limit: String(limit) });
  return httpPatient<{ results: Patient[] }>(`/api/patients/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function searchDoctors(q: string, token: string, limit = 10): Promise<DoctorSearchResponse> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  return httpPatient<DoctorSearchResponse>(`/api/doctors/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function indexDoctors(token: string): Promise<{ message: string }> {
  return httpPatient<{ message: string }>('/api/doctors/index', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

// Roster management APIs
export async function getHospitalRoster(token: string): Promise<{ roster: RosterUser[] }> {
  return httpAuth<{ roster: RosterUser[] }>('/api/admin/roster', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function inviteUser(data: InviteUserRequest, token: string): Promise<{ message: string; user: User }> {
  return httpAuth<{ message: string; user: User }>('/api/admin/invite', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
}

// Public APIs (no auth required)
export async function getHospitals(): Promise<{ hospitals: HospitalInfo[] }> {
  return httpAuth<{ hospitals: HospitalInfo[] }>('/api/public/hospitals');
}

export async function checkInvitation(email: string, hospitalId: number): Promise<{
  invited: boolean;
  message: string;
  user?: { first_name: string; last_name: string; email: string };
}> {
  const params = new URLSearchParams({ 
    email, 
    hospital_id: String(hospitalId) 
  });
  return httpAuth<{
    invited: boolean;
    message: string;
    user?: { first_name: string; last_name: string; email: string };
  }>(`/api/public/invitation/check?${params.toString()}`);
}

export async function completeRegistration(data: {
  invitation_token: string;
  password: string;
  confirm_password: string;
}): Promise<{ message: string; user: User }> {
  return httpAuth<{ message: string; user: User }>('/api/public/registration/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
