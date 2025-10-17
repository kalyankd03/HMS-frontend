import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Users, Settings, Shield, Database, RefreshCw } from 'lucide-react';
import { ServiceCatalogManager } from '@/components/admin/ServiceCatalogManager';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Administrative functions and system management',
};

export default function AdminPage() {
  const adminStats = [
    { title: 'Total Users', value: '45', icon: Users, change: '+2 this week' },
    { title: 'Active Sessions', value: '12', icon: UserCheck, change: 'Currently online' },
    { title: 'System Health', value: '98%', icon: Shield, change: 'All systems operational' },
    { title: 'Database Size', value: '2.4GB', icon: Database, change: '+150MB this month' },
  ];

  const adminActions = [
    { title: 'User Management', description: 'Add, edit, or remove user accounts', icon: Users },
    { title: 'Role Management', description: 'Configure user roles and permissions', icon: Shield },
    { title: 'System Settings', description: 'Configure hospital and system settings', icon: Settings },
    { title: 'Backup & Recovery', description: 'Manage data backups and recovery', icon: Database },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Administration</h2>
          <p className="text-sm text-muted-foreground">
            Configure operational services, manage users, and monitor system health.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <ServiceCatalogManager />

          <Card>
            <CardHeader>
              <CardTitle>Administrative Functions</CardTitle>
              <CardDescription>
                Manage user access, roles, and infrastructure settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {adminActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.title}
                      className="flex items-start gap-4 rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Snapshot</CardTitle>
              <CardDescription>Quick metrics for administration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {adminStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.title}
                      className="rounded-lg border border-border/60 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </span>
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="mt-2 text-2xl font-semibold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest administrative actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New user created', user: 'Dr. Sarah Johnson', time: '2 hours ago' },
                  { action: 'System backup completed', user: 'System', time: '4 hours ago' },
                  { action: 'User role updated', user: 'Nurse Mary Wilson', time: '1 day ago' },
                  { action: 'Database maintenance', user: 'System', time: '2 days ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
