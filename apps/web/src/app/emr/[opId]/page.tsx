'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, FileText, X, Heart, Activity, Stethoscope, Pill, FlaskConical, FileHeart, CheckCircle } from 'lucide-react';
import { doctorsApi, medicinesApi, authApi } from '@/lib/api';
import { buildPrescriptionPdf, downloadPrescriptionPdf } from '@/lib/prescription-pdf';
import type { PrescriptionGenerationPayload } from '@/lib/prescription-pdf';
import { getStoredToken } from '@hms/core';
import type { QueueVisit } from '@hms/api-client';
import type { MedicineSearchResult, DoctorWithUser, Hospital } from '@hms/core';
import type jsPDF from 'jspdf';
import { getUserFromStorage } from '@/lib/auth-storage';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EMREntryDetails {
  [key: string]: string;
}

interface EMREntryMeta {
  subtitle?: string;
  caption?: string;
}

interface EMREntry {
  id: string;
  text: string;
  details?: EMREntryDetails;
  meta?: EMREntryMeta;
}

interface EMRFormData {
  vitals: EMREntry[];
  medicalHistory: EMREntry[];
  symptoms: EMREntry[];
  diagnosis: EMREntry[];
  medications: EMREntry[];
  investigations: EMREntry[];
}

type SectionKey = keyof EMRFormData;

interface SectionField {
  key: string;
  label: string;
  placeholder?: string;
  className?: string;
  columnWidth?: string;
}

const sectionFieldConfigs: Partial<Record<SectionKey, SectionField[]>> = {
  symptoms: [
    { key: 'since', label: 'Since', placeholder: 'e.g. 2 days' },
    { key: 'severity', label: 'Severity', placeholder: 'e.g. Mild' },
  ],
  diagnosis: [
    { key: 'since', label: 'Since', placeholder: 'e.g. 2021' },
    { key: 'severity', label: 'Severity', placeholder: 'e.g. Stage 1' },
  ],
  medications: [
    { key: 'dose', label: 'Dose', placeholder: 'e.g. 1 tablet' },
    { key: 'frequency', label: 'Frequency', placeholder: 'e.g. 1-0-1' },
    { key: 'duration', label: 'Duration', placeholder: 'e.g. 7 days' },
    {
      key: 'instructions',
      label: 'Instructions',
      placeholder: 'Any custom instructions',
      columnWidth: 'minmax(220px, 2fr)',
    },
  ],
};

const primaryColumnLabels: Partial<Record<SectionKey, string>> = {
  medications: 'Medicine',
};

export default function EMRPage() {
  const params = useParams();
  const router = useRouter();
  const opId = parseInt(params.opId as string);

  const [patientData, setPatientData] = useState<QueueVisit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const pdfDocumentRef = useRef<jsPDF | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<DoctorWithUser | null>(null);
  const [hospitalInfo, setHospitalInfo] = useState<Hospital | null>(null);
  const currentUser = getUserFromStorage();

  const defaultFormData: EMRFormData = {
    vitals: [],
    medicalHistory: [],
    symptoms: [],
    diagnosis: [],
    medications: [],
    investigations: [],
  };

  const [formData, setFormDataState] = useState<EMRFormData>(defaultFormData);

  const [inputs, setInputs] = useState({
    vitals: '',
    medicalHistory: '',
    symptoms: '',
    diagnosis: '',
    medications: '',
    investigations: '',
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [pauseError, setPauseError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const updateFormData = useCallback((
    updater: EMRFormData | ((prev: EMRFormData) => EMRFormData),
    options?: { markDirty?: boolean }
  ) => {
    const { markDirty = true } = options ?? {};
    let shouldMarkDirty = false;

    setFormDataState(prev => {
      const next = typeof updater === 'function'
        ? (updater as (value: EMRFormData) => EMRFormData)(prev)
        : updater;

      if (markDirty && next !== prev) {
        shouldMarkDirty = true;
      }

      return next;
    });

    if (shouldMarkDirty) {
      setIsDirty(true);
    }
  }, [setFormDataState, setIsDirty]);

  // Medicine search state
  const [medicineSearchResults, setMedicineSearchResults] = useState<MedicineSearchResult[]>([]);
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [isSearchingMedicine, setIsSearchingMedicine] = useState(false);
  const medicineDropdownRef = useRef<HTMLDivElement>(null);
  const hasHydratedFromCache = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storageKey = `emr-draft-${opId}`;
    const storedDraft = sessionStorage.getItem(storageKey);

    if (!storedDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(storedDraft) as Partial<EMRFormData> | undefined;
      if (parsedDraft) {
        const hydratedDraft: EMRFormData = {
          vitals: parsedDraft.vitals ?? [],
          medicalHistory: parsedDraft.medicalHistory ?? [],
          symptoms: parsedDraft.symptoms ?? [],
          diagnosis: parsedDraft.diagnosis ?? [],
          medications: parsedDraft.medications ?? [],
          investigations: parsedDraft.investigations ?? [],
        };
        updateFormData(() => hydratedDraft, { markDirty: false });
        hasHydratedFromCache.current = true;
      }
    } catch (storageError) {
      console.warn('Failed to hydrate EMR draft from session storage:', storageError);
    } finally {
      sessionStorage.removeItem(storageKey);
    }
  }, [opId, updateFormData]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = getStoredToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const visitData = await doctorsApi.getVisitDetails(opId, token);
        setPatientData(visitData);
      } catch (err) {
        console.error('Failed to fetch patient data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch patient data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [opId]);

  useEffect(() => {
    const fetchDoctorAndHospital = async () => {
      const userFromStorage = getUserFromStorage();
      const token = getStoredToken() ?? '';
      console.log("userFromStorage", userFromStorage);
    

      const doctorId = Number(userFromStorage?.user_id);
      const hospitalId = Number(userFromStorage?.hospital_id);


      console.log("doctorId", doctorId);
      console.log("hospitalId", hospitalId);


      const doctor = await doctorsApi.getDoctor(doctorId, token);
      setDoctorInfo(doctor);
     

      if (Number.isFinite(hospitalId) && hospitalId > 0) {
        try {
          const hospital = await authApi.getHospital(hospitalId, token);
          setHospitalInfo(hospital);
        } catch (err) {
          console.error('Failed to fetch hospital information:', err);
        }
      }
    };

    fetchDoctorAndHospital();
  }, []);

  // Handle click outside to close medicine dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (medicineDropdownRef.current && !medicineDropdownRef.current.contains(event.target as Node)) {
        setShowMedicineDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search medicines with debounce
  useEffect(() => {
    const searchMedicines = async () => {

      const query = inputs.medications.trim();
      if (query.length < 2) {
        setMedicineSearchResults([]);
        setShowMedicineDropdown(false);
        return;
      }

      setIsSearchingMedicine(true);
      try {
        const token = getStoredToken();
        if (!token) return;

        const response = await medicinesApi.searchMedicines(query, token, 10);

        // Handle the data property from API response
        const results = response.data || [];
        setMedicineSearchResults(results);
        setShowMedicineDropdown(results.length > 0);
      } catch (err) {
        console.error('Failed to search medicines:', err);
        setMedicineSearchResults([]);
        setShowMedicineDropdown(false);
      } finally {
        setIsSearchingMedicine(false);
      }
    };

    const timeoutId = setTimeout(searchMedicines, 300);
    return () => clearTimeout(timeoutId);
  }, [inputs.medications]);

  useEffect(() => {
    if (!patientData || hasHydratedFromCache.current) {
      return;
    }

    const cachedClinicalData = patientData.clinical_data as { form_state?: EMRFormData } | null | undefined;
    const cachedFormData = cachedClinicalData?.form_state;

    if (cachedFormData) {
      const hydratedFormData: EMRFormData = {
        vitals: cachedFormData.vitals ?? [],
        medicalHistory: cachedFormData.medicalHistory ?? [],
        symptoms: cachedFormData.symptoms ?? [],
        diagnosis: cachedFormData.diagnosis ?? [],
        medications: cachedFormData.medications ?? [],
        investigations: cachedFormData.investigations ?? [],
      };

      updateFormData(() => hydratedFormData, { markDirty: false });
    }

    hasHydratedFromCache.current = true;
  }, [patientData, updateFormData]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

const createEntry = (section: SectionKey, text: string): EMREntry => {
  const fields = sectionFieldConfigs[section];
  const details = fields
    ? fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.key] = '';
        return acc;
      }, {})
    : undefined;

  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    details,
  };
};

const handleSelectMedicine = (medicine: MedicineSearchResult) => {
  // Include salt composition or manufacturer name as additional info
  const entry = createEntry('medications', medicine.name);
  entry.meta = {
    subtitle: medicine.dosage_form ?? undefined,
    caption: medicine.salt_composition ?? undefined,
  };
  updateFormData(prev => ({
    ...prev,
    medications: [...prev.medications, entry],
  }));
  setInputs(prev => ({ ...prev, medications: '' }));
  setShowMedicineDropdown(false);
};

const handleAddEntry = (section: keyof EMRFormData) => {
  const value = inputs[section].trim();
  if (value) {
    const newEntry = createEntry(section, value);
    updateFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newEntry],
    }));
    setInputs(prev => ({ ...prev, [section]: '' }));
  }
};

const handleRemoveEntry = (section: keyof EMRFormData, id: string) => {
  updateFormData(prev => ({
    ...prev,
    [section]: prev[section].filter(entry => entry.id !== id),
  }));
};

const handleKeyPress = (e: React.KeyboardEvent, section: keyof EMRFormData) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleAddEntry(section);
  }
};

const handleDetailChange = (section: SectionKey, id: string, fieldKey: string, value: string) => {
  updateFormData(prev => ({
    ...prev,
    [section]: prev[section].map(entry =>
      entry.id === id
        ? {
            ...entry,
            details: {
              ...(entry.details ?? {}),
              [fieldKey]: value,
            },
          }
        : entry
    ),
  }));
};

const handleBackClick = () => {
  setPauseError(null);
  setIsPauseDialogOpen(true);
};

const handlePauseVisit = async (shouldSaveDraft: boolean) => {
  try {
    setPauseError(null);
    setIsPausing(true);

    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const payload = shouldSaveDraft
      ? {
          clinical_data: {
            form_state: formData,
            saved_at: new Date().toISOString(),
          },
        }
      : undefined;

    await doctorsApi.pauseVisit(opId, token, payload);
    setIsDirty(false);
    setIsPauseDialogOpen(false);
    router.push('/queue');
  } catch (err) {
    console.error('Failed to pause visit:', err);
    setPauseError(err instanceof Error ? err.message : 'Failed to pause visit');
  } finally {
    setIsPausing(false);
  }
};

const handleEndVisit = async () => {
  try {
    setIsCompleting(true);
    const token = getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const primaryDiagnosis = formData.diagnosis[0]?.text;
    await doctorsApi.completeVisit(opId, token, {
      primary_diagnosis_name: primaryDiagnosis,
      clinical_notes: JSON.stringify(formData),
    });

    if (typeof window !== 'undefined') {
      const storageKey = `emr-draft-${opId}`;
      sessionStorage.removeItem(storageKey);
    }

    setIsDirty(false);
    router.push('/queue');
  } catch (err) {
    console.error('Failed to complete visit:', err);
    setError(err instanceof Error ? err.message : 'Failed to complete visit');
  } finally {
    setIsCompleting(false);
  }
};

const handleSaveEMR = async () => {
    try {
      setIsSaving(true);
      const token = getStoredToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // TODO: Implement actual save API call
      console.log('Saving EMR data:', formData);
      alert('EMR data saved successfully');
    } catch (err) {
      console.error('Failed to save EMR data:', err);
      setError(err instanceof Error ? err.message : 'Failed to save EMR data');
    } finally {
      setIsSaving(false);
    }
  };

  const formatEntryWithDetails = (entry: EMREntry, detailKeys: string[]): string => {
    const detailParts = detailKeys
      .map((key) => {
        const value = entry.details?.[key];
        if (!value) return null;
        return `${key.replace(/^\w/, (ch) => ch.toUpperCase())}: ${value}`;
      })
      .filter(Boolean);

    if (detailParts.length === 0) {
      return entry.text;
    }

    return `${entry.text} (${detailParts.join(', ')})`;
  };

  const buildPdfPayload = (): PrescriptionGenerationPayload => {
    const symptomsLines = formData.symptoms.map((entry) =>
      formatEntryWithDetails(entry, ['since', 'severity'])
    );
    const diagnosisLines = formData.diagnosis.map((entry) =>
      formatEntryWithDetails(entry, ['since', 'severity'])
    );

    const doctorName = doctorInfo?.name ?? currentUser?.name ?? '';
    const hospitalName = hospitalInfo?.name ?? '';

    const payload: PrescriptionGenerationPayload = {
      patient: patientData,
      medicalHistory: formData.medicalHistory.map((entry) => entry.text),
      symptoms: symptomsLines,
      diagnosis: diagnosisLines,
      vitals: formData.vitals.map((entry) => entry.text),
      investigations: formData.investigations.map((entry) => entry.text),
      medications: formData.medications.map((entry) => ({
        name: entry.text,
        form: entry.meta?.subtitle,
        composition: entry.meta?.caption,
        dose: entry.details?.dose,
        frequency: entry.details?.frequency,
        duration: entry.details?.duration,
        instructions: entry.details?.instructions,
      })),
    };

    payload.doctor = {
      name: doctorName || 'Attending Physician',
      speciality: doctorInfo?.speciality,
      department: doctorInfo?.dept,
    };

    payload.hospital = {
      name: hospitalName || `Hospital ID: ${currentUser?.hospital_id ?? 'N/A'}`,
      address: hospitalInfo?.address || '',
      phone: hospitalInfo?.phone || '',
    };

    return payload;
  };

  const handleGeneratePrescription = () => {
    const payload = buildPdfPayload();
    const doc = buildPrescriptionPdf(payload);
    pdfDocumentRef.current = doc;
    const dataUrl = doc.output('datauristring');
    setPdfPreviewUrl(dataUrl);
    setIsPreviewOpen(true);
  };

  const handleDownloadPrescription = () => {
    const payload = buildPdfPayload();
    if (!pdfDocumentRef.current) {
      downloadPrescriptionPdf(payload);
      return;
    }
    pdfDocumentRef.current.save(`prescription-${payload.patient?.op_id ?? 'patient'}.pdf`);
    setIsPreviewOpen(false);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPdfPreviewUrl(null);
    pdfDocumentRef.current = null;
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading patient data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => router.push('/queue')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Queue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const sections: Array<{
    key: keyof EMRFormData;
    title: string;
    placeholder: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      key: 'vitals',
      title: 'Vitals',
      placeholder: 'Type vital signs...',
      icon: <FileHeart className="h-5 w-5" />,
      color: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300',
    },
    {
      key: 'medicalHistory',
      title: 'Patient Medical History',
      placeholder: 'Type medical history...',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300',
    },
    {
      key: 'symptoms',
      title: 'Symptoms',
      placeholder: 'Start typing Symptoms / Chief Complaints',
      icon: <Activity className="h-5 w-5" />,
      color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    },
    {
      key: 'diagnosis',
      title: 'Diagnosis',
      placeholder: 'Start typing Diagnosis',
      icon: <Stethoscope className="h-5 w-5" />,
      color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    },
    {
      key: 'medications',
      title: 'Medications',
      placeholder: 'Search medicine',
      icon: <Pill className="h-5 w-5" />,
      color: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300',
    },
    {
      key: 'investigations',
      title: 'Lab Investigations',
      placeholder: 'Start typing Lab test / Radiology',
      icon: <FlaskConical className="h-5 w-5" />,
      color: 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300',
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleBackClick} disabled={isPausing || isCompleting}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Electronic Medical Record</h2>
          </div>
          {patientData && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground ml-10">
              <span className="font-medium">{patientData.patient_name}</span>
              <span>ID: P{patientData.patient_id.toString().padStart(3, '0')}</span>
              <span>Age: {patientData.patient_age}</span>
              {patientData.patient_gender && (
                <Badge variant="outline">{patientData.patient_gender}</Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="destructive"
            onClick={handleEndVisit}
            disabled={isPausing || isCompleting}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isCompleting ? 'Ending...' : 'End Visit'}
          </Button>
          <Button onClick={handleSaveEMR} disabled={isSaving || isPausing || isCompleting}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save EMR'}
          </Button>
          <Button variant="outline" onClick={handleGeneratePrescription} disabled={isPausing || isCompleting}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Prescription
          </Button>
        </div>
      </div>

      {/* EMR Form Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const fields = sectionFieldConfigs[section.key];
          return (
            <div key={section.key} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-md ${section.color} flex items-center justify-center`}>
                {section.icon}
              </div>
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative" ref={section.key === 'medications' ? medicineDropdownRef : null}>
                    <Input
                      placeholder={section.placeholder}
                      value={inputs[section.key]}
                      onChange={(e) => setInputs(prev => ({ ...prev, [section.key]: e.target.value }))}
                      onKeyPress={(e) => handleKeyPress(e, section.key)}
                      className="border-muted"
                      autoComplete="off"
                    />
                    {section.key === 'medications' && showMedicineDropdown && medicineSearchResults.length > 0 && (
                      <div
                        className="absolute z-50 w-full mt-1 rounded-lg shadow-2xl max-h-60 overflow-hidden"
                        style={{ backgroundColor: 'white' }}
                      >
                        <div className="overflow-y-auto max-h-60 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a1a]">
                          {medicineSearchResults.map((medicine) => (
                            <button
                              key={medicine.id}
                              onClick={() => handleSelectMedicine(medicine)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-800 border-b last:border-b-0 border-gray-200 dark:border-gray-700 transition-colors bg-white dark:bg-[#1a1a1a]"
                            >
                              <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{medicine.name}</div>
                              {medicine.salt_composition && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {medicine.salt_composition}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.key === 'medications' && isSearchingMedicine && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                  {formData[section.key].length > 0 && (
                    fields ? (
                      <div className="space-y-2">
                        {(() => {
                          const columnTemplate = [
                            'minmax(220px, 2fr)',
                            ...fields.map((field) => field.columnWidth ?? 'minmax(140px, 1fr)'),
                            '36px',
                          ].join(' ');
                          const primaryColumnLabel = primaryColumnLabels[section.key] ?? '';
                          return (
                            <>
                              <div
                                className="hidden gap-3 rounded-md border border-border bg-muted/40 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid"
                                style={{ gridTemplateColumns: columnTemplate }}
                              >
                                <span>{primaryColumnLabel || '\u00a0'}</span>
                                {fields.map((field) => (
                                  <span key={field.key}>{field.label}</span>
                                ))}
                                <span className="text-right">Remove</span>
                              </div>
                              <div className="space-y-2">
                                {formData[section.key].map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="grid gap-3 rounded-md border border-border bg-muted/20 p-3"
                                    style={{ gridTemplateColumns: columnTemplate }}
                                  >
                                    <div className="space-y-1">
                                      <div className="text-sm font-medium text-foreground">
                                        {entry.text}
                                        {entry.meta?.subtitle && (
                                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                                            {entry.meta.subtitle}
                                          </span>
                                        )}
                                      </div>
                                      {entry.meta?.caption && (
                                        <div className="text-xs text-muted-foreground">
                                          {entry.meta.caption}
                                        </div>
                                      )}
                                    </div>
                                    {fields.map((field) => (
                                      <div
                                        key={field.key}
                                        className={['space-y-1', field.className].filter(Boolean).join(' ')}
                                      >
                                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:hidden">
                                          {field.label}
                                        </span>
                                        <Input
                                          value={entry.details?.[field.key] ?? ''}
                                          placeholder={field.placeholder}
                                          onChange={(e) =>
                                            handleDetailChange(section.key, entry.id, field.key, e.target.value)
                                          }
                                          className="h-9"
                                        />
                                      </div>
                                    ))}
                                    <div className="flex items-start justify-end">
                                      <button
                                        onClick={() => handleRemoveEntry(section.key, entry.id)}
                                        className="text-muted-foreground transition-colors hover:text-destructive"
                                        aria-label={`Remove ${section.title}`}
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {formData[section.key].map((entry) => (
                          <Badge
                            key={entry.id}
                            variant="secondary"
                            className="flex items-center space-x-1 px-3 py-1"
                          >
                            <span>{entry.text}</span>
                            <button
                              onClick={() => handleRemoveEntry(section.key, entry.id)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      <Dialog
        open={isPauseDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!isPausing) {
            if (!open) {
              setPauseError(null);
            }
            setIsPauseDialogOpen(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause this visit?</DialogTitle>
            <DialogDescription>
              You can resume the visit from the queue later. Choose whether to keep the current EMR draft before pausing.
            </DialogDescription>
          </DialogHeader>
          {pauseError && (
            <p className="text-sm text-destructive">
              {pauseError}
            </p>
          )}
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setPauseError(null);
                setIsPauseDialogOpen(false);
              }}
              disabled={isPausing}
            >
              Continue Editing
            </Button>
            <Button
              variant="ghost"
              onClick={() => handlePauseVisit(false)}
              disabled={isPausing}
            >
              Pause without Saving
            </Button>
            <Button onClick={() => handlePauseVisit(true)} disabled={isPausing}>
              {isPausing ? 'Pausing...' : 'Save & Pause'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative flex w-full max-w-4xl flex-col rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-semibold">Prescription Preview</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleClosePreview}>
                  Close
                </Button>
                <Button onClick={handleDownloadPrescription}>
                  Download
                </Button>
              </div>
            </div>
            <div className="h-[70vh] overflow-hidden p-4">
              {pdfPreviewUrl ? (
                <iframe
                  title="Prescription Preview"
                  src={pdfPreviewUrl}
                  className="h-full w-full rounded-md border"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Generating preview...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
