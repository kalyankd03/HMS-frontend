import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Suspense } from 'react';

function LoginMessage() {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get('message');
  
  if (!message) return null;
  
  return (
    <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
      {message}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Hospital Management System account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={null}>
              <LoginMessage />
            </Suspense>
            <LoginForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-primary hover:text-primary/80">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}