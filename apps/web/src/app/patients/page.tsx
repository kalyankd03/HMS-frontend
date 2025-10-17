'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, Search, Ticket, X, CheckCircle, Phone, Calendar, ClipboardList, Settings } from 'lucide-react';
import { CreatePatientForm } from '@/components/forms/CreatePatientForm';
import { CreateOpTicketForm } from '@/components/forms/CreateOpTicketForm';
import type { Patient, OpTicket } from '@hms/core';

type ActiveForm = 'none' | 'patient' | 'opticket';

export default function PatientsPage() {
  const [activeForm, setActiveForm] = useState<ActiveForm>('none');
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [recentOpTickets, setRecentOpTickets] = useState<OpTicket[]>([]);

  const handleFormSuccess = (data: unknown) => {
    console.log('Form submitted successfully:', data);
    
    // Handle patient creation response
    if (activeForm === 'patient' && data && typeof data === 'object' && 'name' in data) {
      const patient = data as Patient;
      setRecentPatients(prev => [patient, ...prev.slice(0, 4)]); // Keep latest 5 patients
    }
    
    // Handle OP ticket creation response
    if (activeForm === 'opticket' && data && typeof data === 'object' && 'op_id' in data) {
      const opTicket = data as OpTicket;
      setRecentOpTickets(prev => [opTicket, ...prev.slice(0, 4)]); // Keep latest 5 tickets
    }
    
    setActiveForm('none');
  };

  const handleFormCancel = () => {
    setActiveForm('none');
  };

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'patient':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 z-10 bg-white shadow-md hover:bg-gray-100"
                onClick={handleFormCancel}
              >
                <X className="h-4 w-4" />
              </Button>
              <CreatePatientForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        );
      case 'opticket':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 z-10 bg-white shadow-md hover:bg-gray-100"
                onClick={handleFormCancel}
              >
                <X className="h-4 w-4" />
              </Button>
              <CreateOpTicketForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Patient Desk</h2>
            <p className="text-sm text-muted-foreground">
              Register patients, create OP tickets, and pre-select billable services in one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Quick Search
            </Button>
            <Button variant="outline" onClick={() => setActiveForm('patient')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
            <Button onClick={() => setActiveForm('opticket')}>
              <Ticket className="mr-2 h-4 w-4" />
              Create OP Ticket
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Patient Registry
              </CardTitle>
              <CardDescription>
                Onboard new patients and keep demographic information up to date.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                Maintain a clean roster by registering visitors before their consultation. Quick search helps avoid duplicate records.
              </div>
              {recentPatients.length > 0 && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  {recentPatients.length} patient{recentPatients.length === 1 ? '' : 's'} added in this session
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Find Patient
                </Button>
                <Button onClick={() => setActiveForm('patient')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Patient
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-green-500" />
                OP Tickets & Billing
              </CardTitle>
              <CardDescription>
                Generate visit tickets and pre-select billable services for the patient.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                Choose the consulting doctor and optionally attach hospital services. Selected services are sent with the ticket for billing automation.
              </div>
              {recentOpTickets.length > 0 && (
                <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
                  <CheckCircle className="h-4 w-4" />
                  {recentOpTickets.length} OP ticket{recentOpTickets.length === 1 ? '' : 's'} created recently
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => setActiveForm('opticket')}>
                  <Ticket className="mr-2 h-4 w-4" />
                  Create OP Ticket
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-500" />
                Service Catalog
              </CardTitle>
              <CardDescription>
                Keep the service catalog current for accurate ticket billing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Administrators can manage consultation and procedure services from the Admin tab. Any changes are immediately available while creating OP tickets.
              </p>
              <Button variant="outline" asChild>
                <Link href="/admin" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Open Service Management
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Recent patient registrations and OP tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPatients.length === 0 && recentOpTickets.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Recent patient activities will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPatients.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Users className="mr-2 h-4 w-4 text-blue-500" />
                      Recently Added Patients
                    </h4>
                    <div className="space-y-2">
                      {recentPatients.map((patient) => (
                        <div key={patient.patient_id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <div className="font-medium text-gray-900">{patient.name}</div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {patient.phone}
                                </span>
                                {patient.date_of_birth && (
                                  <span className="flex items-center">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Just created
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recentOpTickets.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Ticket className="mr-2 h-4 w-4 text-green-500" />
                      Recently Created OP Tickets
                    </h4>
                    <div className="space-y-2">
                      {recentOpTickets.map((ticket) => (
                        <div key={ticket.op_id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                            <div>
                              <div className="font-medium text-gray-900">OP Ticket #{ticket.op_id}</div>
                              <div className="text-sm text-gray-500">
                                Patient ID: {ticket.patient_id} • Doctor ID: {ticket.allotted_doctor_id}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            Just created
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {renderActiveForm()}
    </>
  );
}
