'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Building2 as Hospital, Users, Calendar, Activity } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Hospital Management System
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Streamline your healthcare operations with our comprehensive hospital management platform. 
          Manage patients, staff, and appointments all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/register">Register Hospital</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Register and manage patient records, medical history, and treatment plans efficiently.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Appointment Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schedule and manage appointments with automated reminders and queue management.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Hospital className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Staff Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage doctors, nurses, and administrative staff with role-based access control.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Activity className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate comprehensive reports and analytics to improve hospital operations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-muted rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Join hundreds of healthcare facilities already using our platform.
        </p>
        <Button asChild size="lg">
          <Link href="/register">Start Free Trial</Link>
        </Button>
      </section>
    </main>
  );
}