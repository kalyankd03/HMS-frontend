import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  Activity, 
  Bell, 
  Plus,
  ArrowUpRight,
  Clock
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Hospital management dashboard with real-time analytics',
};

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              8 completed, 34 remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              24 doctors, 4 nurses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Average wait time: 12 min
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Patients */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>
              Latest patient registrations and check-ins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'John Doe', time: '2 minutes ago', status: 'checked-in', id: 'P001' },
                { name: 'Jane Smith', time: '5 minutes ago', status: 'waiting', id: 'P002' },
                { name: 'Robert Johnson', time: '8 minutes ago', status: 'in-consultation', id: 'P003' },
                { name: 'Emily Davis', time: '12 minutes ago', status: 'completed', id: 'P004' },
              ].map((patient) => (
                <div key={patient.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {patient.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        patient.status === 'completed' ? 'secondary' : 
                        patient.status === 'in-consultation' ? 'destructive' : 'default'
                      }
                    >
                      {patient.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {patient.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used actions and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/patients/new">
                <Plus className="mr-2 h-4 w-4" />
                Register New Patient
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/queue">
                <Clock className="mr-2 h-4 w-4" />
                Manage Queue
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                View Appointments
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/staff">
                <Users className="mr-2 h-4 w-4" />
                Staff Management
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/reports">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Generate Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts/Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border-l-4 border-l-yellow-500 bg-yellow-50 p-3 rounded">
              <p className="text-sm font-medium">Lab results pending</p>
              <p className="text-xs text-muted-foreground">3 lab reports are awaiting doctor review</p>
            </div>
            <div className="border-l-4 border-l-red-500 bg-red-50 p-3 rounded">
              <p className="text-sm font-medium">Emergency patient</p>
              <p className="text-xs text-muted-foreground">Critical patient admitted to ER - requires immediate attention</p>
            </div>
            <div className="border-l-4 border-l-blue-500 bg-blue-50 p-3 rounded">
              <p className="text-sm font-medium">System update</p>
              <p className="text-xs text-muted-foreground">Scheduled maintenance tonight at 2:00 AM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}