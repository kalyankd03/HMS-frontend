'use client';

import AppShell from '@/components/AppShell';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPatient, createOpTicket, searchPatients, searchDoctors } from '@/lib/api';
import type { CreatePatientForm, CreateOpTicketForm, Patient, DoctorSearchResult } from '@/lib/types';

export default function PatientsPage() {
  const router = useRouter();
  const { token, isAuthenticated, user } = useAuthStore();
  const [formBusy, setFormBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !isAuthenticated()) router.push('/');
  }, [token, isAuthenticated, router]);

  const initialPatientForm: CreatePatientForm = useMemo(() => ({ 
    name: '', 
    date_of_birth: '', 
    phone: '', 
    hospital_id: user?.hospital_id || 1 
  }), [user?.hospital_id]);
  const [patientForm, setPatientForm] = useState<CreatePatientForm>(initialPatientForm);

  const initialTicketForm: CreateOpTicketForm = useMemo(() => ({ patient_id: 0, allotted_doctor_id: user?.user_id ?? 0, referral_doctor: '' }), [user?.user_id]);
  const [ticketForm, setTicketForm] = useState<CreateOpTicketForm>(initialTicketForm);

  // Patient autocomplete state
  const [patientQuery, setPatientQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Patient[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchBusy, setSearchBusy] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Doctor autocomplete state
  const [doctorQuery, setDoctorQuery] = useState('');
  const [doctorSuggestions, setDoctorSuggestions] = useState<DoctorSearchResult[]>([]);
  const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false);
  const [doctorSearchBusy, setDoctorSearchBusy] = useState(false);
  const [doctorSearchTimeout, setDoctorSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleSearchPatients = useCallback(async (q: string) => {
    if (!q || !token) { 
      setSuggestions([]); 
      return; 
    }
    
    // Only search if query has at least 3 characters
    if (q.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    
    setSearchBusy(true);
    try {
      console.info(`Patient search: "${q}" (${q.length} chars)`);
      const res = await searchPatients(q, token, 8);
      setSuggestions(res.results);
    } catch (error) {
      console.warn('Patient search failed', error);
      setSuggestions([]);
    } finally { 
      setSearchBusy(false); 
    }
  }, [token]);

  const handleSearchDoctors = useCallback(async (q: string) => {
    if (!q || !token) { 
      setDoctorSuggestions([]); 
      return; 
    }
    
    // Only search if query has at least 2 characters
    if (q.trim().length < 2) {
      setDoctorSuggestions([]);
      return;
    }
    
    setDoctorSearchBusy(true);
    try {
      console.info(`Doctor search: "${q}" (${q.length} chars)`);
      const res = await searchDoctors(q, token, 8);
      setDoctorSuggestions(res.results);
    } catch (error) {
      console.warn('Doctor search failed', error);
      setDoctorSuggestions([]);
    } finally { 
      setDoctorSearchBusy(false); 
    }
  }, [token]);

  // Debounced search functions
  const debouncedSearch = useCallback((query: string) => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for search
    const timeout = setTimeout(() => {
      handleSearchPatients(query);
    }, 300); // 300ms debounce delay
    
    setSearchTimeout(timeout);
  }, [handleSearchPatients, searchTimeout]);

  const debouncedDoctorSearch = useCallback((query: string) => {
    // Clear any existing timeout
    if (doctorSearchTimeout) {
      clearTimeout(doctorSearchTimeout);
    }
    
    // Set new timeout for search
    const timeout = setTimeout(() => {
      handleSearchDoctors(query);
    }, 300); // 300ms debounce delay
    
    setDoctorSearchTimeout(timeout);
  }, [handleSearchDoctors, doctorSearchTimeout]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      if (doctorSearchTimeout) {
        clearTimeout(doctorSearchTimeout);
      }
    };
  }, [searchTimeout, doctorSearchTimeout]);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setNotice('');
    if (!patientForm.name || !patientForm.phone) { 
      setError('Name and phone are required'); 
      return; 
    }
    setFormBusy(true);
    try {
      const created = await createPatient({
        name: patientForm.name,
        date_of_birth: patientForm.date_of_birth || undefined,
        phone: patientForm.phone,
      }, token!);
      setNotice(`Patient added: #${created.patient_id} ${created.name}`);
      setTicketForm({ patient_id: created.patient_id, allotted_doctor_id: user?.user_id ?? 0, referral_doctor: '' });
      setPatientForm(initialPatientForm);
      setPatientQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      setDoctorQuery('');
      setDoctorSuggestions([]);
      setShowDoctorSuggestions(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add patient');
    } finally { setFormBusy(false); }
  };

  const handleCreateOpTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setNotice('');
    if ((!ticketForm.patient_id && !patientQuery) || !ticketForm.allotted_doctor_id) { 
      setError('Select a patient or enter Patient ID, and provide Allotted Doctor ID'); return; }
    setFormBusy(true);
    try {
      const payload = ticketForm.patient_id ? {
        patient_id: Number(ticketForm.patient_id),
        allotted_doctor_id: Number(ticketForm.allotted_doctor_id),
        referral_doctor: ticketForm.referral_doctor || undefined,
      } : {
        patient_query: patientQuery,
        allotted_doctor_id: Number(ticketForm.allotted_doctor_id),
        referral_doctor: ticketForm.referral_doctor || undefined,
      };
      const created = await createOpTicket(payload, token!);
      setNotice(`OP ticket created: #${created.op_id} for patient #${created.patient_id}`);
      setTicketForm(initialTicketForm);
      setPatientQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      setDoctorQuery('');
      setDoctorSuggestions([]);
      setShowDoctorSuggestions(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create OP ticket');
    } finally { setFormBusy(false); }
  };

  return (
    <AppShell active="patients">
      <div className="space-y-6">
        <div className="card">
          <h1 className="text-xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-600">Register new patients and create OP tickets.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">New Patient</h2>
            {notice && <div className="mb-3 text-sm text-green-700">{notice}</div>}
            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div>
                <label className="label" htmlFor="p-name">Full Name</label>
                <input 
                  id="p-name" 
                  className="input" 
                  required 
                  value={patientForm.name} 
                  onChange={(e)=>setPatientForm({...patientForm, name:e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="p-dob">Date of Birth</label>
                  <input 
                    id="p-dob" 
                    type="date" 
                    className="input" 
                    value={patientForm.date_of_birth} 
                    onChange={(e)=>setPatientForm({...patientForm, date_of_birth:e.target.value})} 
                  />
                </div>
                <div>
                  <label className="label" htmlFor="p-phone">Phone *</label>
                  <input 
                    id="p-phone" 
                    className="input" 
                    required
                    type="tel"
                    value={patientForm.phone} 
                    onChange={(e)=>setPatientForm({...patientForm, phone:e.target.value})} 
                  />
                </div>
              </div>
              <button type="submit" className="btn w-full" disabled={formBusy} aria-label={formBusy? 'Adding...' : 'Add Patient'}>{formBusy? 'Adding...' : 'Add Patient'}</button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">New OP Ticket</h2>
            <form onSubmit={handleCreateOpTicket} className="space-y-4">
              <div className="relative">
                <label className="label" htmlFor="op-search">Search Patient (name or phone)</label>
                <input
                  id="op-search"
                  className="input"
                  placeholder="Type at least 3 characters to search..."
                  value={patientQuery}
                  onChange={(e)=>{ 
                    const value = e.target.value;
                    setPatientQuery(value); 
                    setShowSuggestions(true); 
                    debouncedSearch(value);
                  }}
                  onFocus={()=>{ if (patientQuery && patientQuery.length >= 3) setShowSuggestions(true); }}
                  aria-autocomplete="list"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-50 mt-2 w-full border rounded bg-white max-h-56 overflow-auto shadow-lg border-gray-300">
                    {suggestions.map(s => (
                      <li key={s.patient_id}>
                        <button type="button" className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0" onClick={()=>{ setTicketForm({...ticketForm, patient_id: s.patient_id}); setPatientQuery(`${s.name} (${s.phone})`); setShowSuggestions(false); }}>
                          <span className="font-medium text-gray-900">{s.name}</span> <span className="text-gray-600 ml-2">({s.phone})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* Search status messages */}
                <div className="mt-1 text-xs">
                  {searchBusy && <span className="text-blue-600">Searching…</span>}
                  {!searchBusy && patientQuery && patientQuery.trim().length > 0 && patientQuery.trim().length < 3 && (
                    <span className="text-gray-500">
                      Type {3 - patientQuery.trim().length} more character{3 - patientQuery.trim().length === 1 ? '' : 's'} to search
                    </span>
                  )}
                  {!searchBusy && patientQuery && patientQuery.trim().length >= 3 && suggestions.length === 0 && !showSuggestions && (
                    <span className="text-gray-500">No patients found</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">Or enter patient ID directly</div>
              <div>
                <label className="label" htmlFor="op-pid">Patient ID</label>
                <input id="op-pid" type="number" className="input" value={ticketForm.patient_id || ''} onChange={(e)=>setTicketForm({...ticketForm, patient_id:Number(e.target.value)})} />
              </div>
              <div className="relative">
                <label className="label" htmlFor="op-doc">Allotted Doctor</label>
                <input
                  id="op-doc"
                  className="input"
                  placeholder="Type doctor name, department, or speciality..."
                  value={doctorQuery}
                  onChange={(e)=>{ 
                    const value = e.target.value;
                    setDoctorQuery(value); 
                    setShowDoctorSuggestions(true); 
                    debouncedDoctorSearch(value);
                  }}
                  onFocus={()=>{ if (doctorQuery && doctorQuery.length >= 2) setShowDoctorSuggestions(true); }}
                  aria-autocomplete="list"
                />
                {showDoctorSuggestions && doctorSuggestions.length > 0 && (
                  <ul className="absolute z-50 mt-2 w-full border rounded bg-white max-h-56 overflow-auto shadow-lg border-gray-300">
                    {doctorSuggestions.map(d => (
                      <li key={d.id}>
                        <button type="button" className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0" onClick={()=>{ setTicketForm({...ticketForm, allotted_doctor_id: d.id}); setDoctorQuery(`Dr. ${d.name} - ${d.dept}`); setShowDoctorSuggestions(false); }}>
                          <div className="font-medium text-gray-900">Dr. {d.name}</div>
                          <div className="text-sm text-gray-600">{d.dept} • {d.speciality}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* Search status messages */}
                <div className="mt-1 text-xs">
                  {doctorSearchBusy && <span className="text-blue-600">Searching doctors…</span>}
                  {!doctorSearchBusy && doctorQuery && doctorQuery.trim().length > 0 && doctorQuery.trim().length < 2 && (
                    <span className="text-gray-500">
                      Type {2 - doctorQuery.trim().length} more character{2 - doctorQuery.trim().length === 1 ? '' : 's'} to search
                    </span>
                  )}
                  {!doctorSearchBusy && doctorQuery && doctorQuery.trim().length >= 2 && doctorSuggestions.length === 0 && !showDoctorSuggestions && (
                    <span className="text-gray-500">No doctors found</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">Or enter doctor ID directly</div>
              <div>
                <label className="label" htmlFor="op-doc-id">Doctor ID (if known)</label>
                <input id="op-doc-id" type="number" className="input" value={ticketForm.allotted_doctor_id || ''} onChange={(e)=>setTicketForm({...ticketForm, allotted_doctor_id:Number(e.target.value)})} />
              </div>
              <div>
                <label className="label" htmlFor="op-ref">Referral Doctor (optional)</label>
                <input id="op-ref" className="input" value={ticketForm.referral_doctor || ''} onChange={(e)=>setTicketForm({...ticketForm, referral_doctor:e.target.value})} />
              </div>
              <button type="submit" className="btn w-full" disabled={formBusy} aria-label={formBusy? 'Creating...' : 'Create OP Ticket'}>{formBusy? 'Creating...' : 'Create OP Ticket'}</button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}


