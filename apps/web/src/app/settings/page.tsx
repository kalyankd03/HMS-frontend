import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell, Shield, Database, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Configure system and user settings',
};

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      icon: User,
      settings: ['Personal Information', 'Password & Security', 'Email Preferences']
    },
    {
      title: 'Notifications',
      description: 'Configure notification preferences and alerts',
      icon: Bell,
      settings: ['Email Notifications', 'SMS Alerts', 'Push Notifications']
    },
    {
      title: 'Security',
      description: 'Security settings and access controls',
      icon: Shield,
      settings: ['Two-Factor Authentication', 'Session Management', 'Login History']
    },
    {
      title: 'System',
      description: 'Hospital-wide system configurations',
      icon: Database,
      settings: ['General Settings', 'Data Backup', 'Integration Settings']
    },
    {
      title: 'Appearance',
      description: 'Customize the look and feel of the application',
      icon: Palette,
      settings: ['Theme Settings', 'Language', 'Display Options']
    }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            Reset to Default
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid gap-6">
        {settingsCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon className="mr-3 h-5 w-5" />
                  {category.title}
                </CardTitle>
                <CardDescription>
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.settings.map((setting) => (
                    <div
                      key={setting}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div>
                        <p className="font-medium">{setting}</p>
                        <p className="text-sm text-muted-foreground">
                          Configure {setting.toLowerCase()} options
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
          <CardDescription>
            Frequently used settings and toggles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Email Notifications', description: 'Receive email alerts for important events', enabled: true },
              { label: 'Auto-save Changes', description: 'Automatically save form changes', enabled: true },
              { label: 'Dark Mode', description: 'Use dark theme for the interface', enabled: false },
              { label: 'Show Tooltips', description: 'Display helpful tooltips throughout the app', enabled: true },
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                      setting.enabled ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
