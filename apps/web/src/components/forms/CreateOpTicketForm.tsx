'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOpTicketSchema, getStoredToken } from '@hms/core';
import type { CreateOpTicketForm as CreateOpTicketFormData, Patient, DoctorWithUser } from '@hms/core';
import { patientsApi } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Ticket, CheckCircle, AlertCircle } from 'lucide-react';
import { PatientSearch } from './PatientSearch';
import { DoctorSearch } from './DoctorSearch';

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

  const form = useForm<CreateOpTicketFormData>({
    resolver: zodResolver(createOpTicketSchema),
    defaultValues: {
      patient_id: undefined,
      allotted_doctor_id: undefined,
      referral_doctor: '',
    },
  });

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
      form.reset();
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
    form.reset();
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
