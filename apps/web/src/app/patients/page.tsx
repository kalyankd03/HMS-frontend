'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, Search, Ticket, X } from 'lucide-react';
import { CreatePatientForm } from '@/components/forms/CreatePatientForm';
import { CreateOpTicketForm } from '@/components/forms/CreateOpTicketForm';

type ActiveForm = 'none' | 'patient' | 'opticket';

export default function PatientsPage() {
  const [activeForm, setActiveForm] = useState<ActiveForm>('none');

  const handleFormSuccess = (data: any) => {
    console.log('Form submitted successfully:', data);
    // You can add additional logic here like refreshing patient lists
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
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">
                Recent patient activities will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {renderActiveForm()}
    </>
  );
}
