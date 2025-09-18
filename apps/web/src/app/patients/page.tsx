'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, Search, Ticket, X, CheckCircle, Phone, Calendar } from 'lucide-react';
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
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search Patients
            </Button>
            <Button onClick={() => setActiveForm('opticket')}>
              <Ticket className="mr-2 h-4 w-4" />
              Create OP Ticket
            </Button>
            <Button onClick={() => setActiveForm('patient')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Patient Management
              </CardTitle>
              <CardDescription>
                Add new patients and manage patient records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-blue-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Manage Patients</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add new patients to the system and manage their information.
                </p>
                {recentPatients.length > 0 && (
                  <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    {recentPatients.length} patient{recentPatients.length === 1 ? '' : 's'} added recently
                  </div>
                )}
                <div className="mt-6">
                  <Button onClick={() => setActiveForm('patient')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Patient
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="mr-2 h-5 w-5" />
                OP Tickets
              </CardTitle>
              <CardDescription>
                Create outpatient tickets for consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Ticket className="mx-auto h-12 w-12 text-green-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Create OP Tickets</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate tickets for outpatient consultations with doctors.
                </p>
                {recentOpTickets.length > 0 && (
                  <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    {recentOpTickets.length} ticket{recentOpTickets.length === 1 ? '' : 's'} created recently
                  </div>
                )}
                <div className="mt-6">
                  <Button onClick={() => setActiveForm('opticket')}>
                    <Ticket className="mr-2 h-4 w-4" />
                    Create OP Ticket
                  </Button>
                </div>
              </div>
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
