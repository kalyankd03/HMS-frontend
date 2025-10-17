'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOpTicketSchema, getStoredToken } from '@hms/core';
import type {
  CreateOpTicketForm as CreateOpTicketFormData,
  Patient,
  DoctorWithUser,
  ServiceCatalogItem,
} from '@hms/core';
import { patientsApi, servicesApi } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Ticket, CheckCircle, AlertCircle, ClipboardList } from 'lucide-react';
import { PatientSearch } from './PatientSearch';
import { DoctorSearch } from './DoctorSearch';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const formatPrice = (value: number) => currencyFormatter.format(Number.isFinite(value) ? value : 0);

const normalizeService = (service: ServiceCatalogItem): ServiceCatalogItem => ({
  ...service,
  default_price: Number(service.default_price ?? 0),
});

interface CreateOpTicketFormProps {
  readonly onSuccess?: (opTicket: unknown) => void;
  readonly onCancel?: () => void;
}

export function CreateOpTicketForm({ onSuccess, onCancel }: CreateOpTicketFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithUser | null>(null);
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const form = useForm<CreateOpTicketFormData>({
    resolver: zodResolver(createOpTicketSchema),
    defaultValues: {
      patient_id: undefined,
      allotted_doctor_id: undefined,
      referral_doctor: '',
      service_ids: [],
    },
  });

  useEffect(() => {
    const loadServices = async () => {
      const token = getStoredToken();
      if (!token) {
        setServices([]);
        setServicesError('Unable to load services. Please log in again.');
        return;
      }

      try {
        setIsLoadingServices(true);
        setServicesError(null);
        const data = await servicesApi.listServices(token);
        setServices(data.map(normalizeService));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load services';
        setServicesError(message);
      } finally {
        setIsLoadingServices(false);
      }
    };

    void loadServices();
  }, []);

  const onSubmit = async (data: CreateOpTicketFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const token = getStoredToken();
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      console.log('Creating OP ticket with data:', data);
      
      // Call the createOpTicket API
      const opTicket = await patientsApi.createOpTicket(data, token);
      
      console.log('OP ticket created successfully:', opTicket);
      
      setSuccessMessage(`OP ticket created successfully! Ticket ID: ${opTicket.op_id}`);
      
      // Reset form and selections
      form.reset({
        patient_id: undefined,
        allotted_doctor_id: undefined,
        referral_doctor: '',
        service_ids: [],
      });
      setSelectedPatient(null);
      setSelectedDoctor(null);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(opTicket);
      }
      
    } catch (error) {
      console.error('Error creating OP ticket:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset({
      patient_id: undefined,
      allotted_doctor_id: undefined,
      referral_doctor: '',
      service_ids: [],
    });
    setSelectedPatient(null);
    setSelectedDoctor(null);
    setError(null);
    setSuccessMessage(null);
    if (onCancel) {
      onCancel();
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue('patient_id', patient.patient_id);
  };

  const handleDoctorSelect = (doctor: DoctorWithUser) => {
    setSelectedDoctor(doctor);
    form.setValue('allotted_doctor_id', doctor.id);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Ticket className="mr-2 h-5 w-5" />
          Create OP Ticket
        </CardTitle>
        <CardDescription>
          Create a new outpatient ticket for consultation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                {successMessage}
              </div>
            )}

            {/* Patient Selection */}
            <FormField
              control={form.control}
              name="patient_id"
              render={() => (
                <FormItem>
                  <FormLabel>Patient Selection *</FormLabel>
                  <FormControl>
                    <PatientSearch
                      onPatientSelect={handlePatientSelect}
                      selectedPatient={selectedPatient}
                      placeholder="Search and select a patient..."
                    />
                  </FormControl>
                  <FormMessage />
                  {!selectedPatient && (
                    <p className="text-sm text-gray-500">Please search and select a patient from the list above</p>
                  )}
                </FormItem>
              )}
            />

            {/* Doctor Selection */}
            <FormField
              control={form.control}
              name="allotted_doctor_id"
              render={() => (
                <FormItem>
                  <FormLabel>Assign Doctor *</FormLabel>
                  <FormControl>
                    <DoctorSearch
                      onDoctorSelect={handleDoctorSelect}
                      selectedDoctor={selectedDoctor}
                      placeholder="Search and select a doctor..."
                    />
                  </FormControl>
                  <FormMessage />
                  {!selectedDoctor && (
                    <p className="text-sm text-gray-500">Please search and select a doctor from the list above</p>
                  )}
                </FormItem>
              )}
            />

            {/* Service Selection */}
            <FormField
              control={form.control}
              name="service_ids"
              render={({ field }) => {
                const selected = field.value ?? [];
                const toggleService = (serviceId: number) => {
                  if (selected.includes(serviceId)) {
                    field.onChange(selected.filter((id) => id !== serviceId));
                  } else {
                    field.onChange([...selected, serviceId]);
                  }
                };

                return (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Services for this OP Ticket
                    </FormLabel>
                    <FormDescription>
                      Select optional services to include when creating the billing record. You can update services later from the billing section.
                    </FormDescription>
                    <div className="mt-3 rounded-lg border border-border/60 bg-muted/10 p-3">
                      {isLoadingServices ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading available services...
                        </div>
                      ) : servicesError ? (
                        <p className="text-sm text-red-600">{servicesError}</p>
                      ) : services.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No services have been configured yet. Ask an administrator to add services from the Admin tab.
                        </p>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {services.map((service) => {
                            const isSelected = selected.includes(service.id);
                            return (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => toggleService(service.id)}
                                className={`flex w-full flex-col rounded-lg border p-3 text-left transition hover:border-primary ${
                                  isSelected ? 'border-primary bg-primary/10' : 'border-border/60 bg-background'
                                }`}
                              >
                                <span className="text-sm font-semibold">{service.service_name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {service.service_code} • {formatPrice(service.default_price)}
                                </span>
                                {service.is_default_opd_service ? (
                                  <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                    Default OPD service
                                  </span>
                                ) : null}
                                {isSelected ? (
                                  <span className="mt-2 text-xs font-medium text-primary">
                                    Selected
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {selected.length > 0 ? (
                      <p className="pt-2 text-xs text-muted-foreground">
                        {selected.length} service{selected.length > 1 ? 's' : ''} selected
                      </p>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Referral Doctor */}
            <FormField
              control={form.control}
              name="referral_doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Doctor (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter referring doctor's name (if any)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating OP Ticket...
                  </>
                ) : (
                  <>
                    <Ticket className="mr-2 h-4 w-4" />
                    Create OP Ticket
                  </>
                )}
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
