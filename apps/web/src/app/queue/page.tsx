import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Patient Queue',
  description: 'Manage patient queue and waiting times',
};

export default function QueuePage() {
  const queueData = [
    { id: 'P001', name: 'John Doe', waitTime: '15 min', priority: 'high', status: 'waiting' },
    { id: 'P002', name: 'Jane Smith', waitTime: '8 min', priority: 'medium', status: 'in-progress' },
    { id: 'P003', name: 'Bob Johnson', waitTime: '22 min', priority: 'low', status: 'waiting' },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Patient Queue</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Serving</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
          <CardDescription>
            Patients currently waiting for service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queueData.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={
                      patient.priority === 'high' ? 'destructive' :
                      patient.priority === 'medium' ? 'default' : 'secondary'
                    }
                  >
                    {patient.priority} priority
                  </Badge>
                  <Badge
                    variant={patient.status === 'in-progress' ? 'default' : 'outline'}
                  >
                    {patient.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Wait: {patient.waitTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
