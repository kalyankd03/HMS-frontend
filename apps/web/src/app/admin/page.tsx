import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Users, Settings, Shield, Database } from 'lucide-react';

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
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Administration</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Administrative Functions</CardTitle>
          <CardDescription>
            Manage users, roles, and system configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {adminActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.title}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Admin Activity */}
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
  );
}
