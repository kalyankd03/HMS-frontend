'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { useTokenExpiration } from '@/lib/hooks/useTokenExpiration';
import { getHospital } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TabType = 'dashboard' | 'patients' | 'queue' | 'admin';

interface AppShellProps {
  readonly active?: TabType;
  readonly children: React.ReactNode;
}

// Helper function to determine current active tab
function getCurrentTab(pathname: string | null, active?: string): TabType {
  if (active) return active as TabType;
  if (pathname?.startsWith('/admin')) return 'admin';
  if (pathname?.startsWith('/patients')) return 'patients';
  if (pathname?.startsWith('/queue')) return 'queue';
  return 'dashboard';
}

// NavLink component for navigation items
const NavLink = ({ href, label, tab, current }: { 
  href: Route; 
  label: string; 
  tab: TabType;
  current: string;
}) => (
  <Button
    asChild
    variant={current === tab ? "default" : "ghost"}
    className={cn(
      "w-full justify-start",
      current === tab && "bg-primary text-primary-foreground"
    )}
  >
    <Link href={href} aria-current={current === tab ? 'page' : undefined}>
    {label}
  </Link>
  </Button>
);

// Fallback hospital names for when API is unavailable
const FALLBACK_HOSPITAL_NAMES: Record<number, string> = {
  1: 'City General Hospital',
  2: 'Metro Health Center', 
  3: 'Regional Medical Center',
  4: 'University Hospital',
  5: 'Community Health Clinic'
};

export default function AppShell({ active, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, hospital, setHospital, token } = useAuthStore();
  const current = getCurrentTab(pathname, active);

  // Monitor token expiration and auto-logout
  useTokenExpiration();

  // Fetch hospital information if we have user but no hospital data
  useEffect(() => {
    const fetchHospitalData = async () => {
      if (user?.hospital_id && !hospital && token) {
        try {
          console.info(`Fetching hospital data for hospital_id: ${user.hospital_id}`);
          const hospitalData = await getHospital(user.hospital_id, token);
          setHospital(hospitalData);
        } catch (error) {
          console.warn(`Failed to fetch hospital data for ID ${user.hospital_id}:`, error);
          // Fallback will be used below
        }
      }
    };

    fetchHospitalData();
  }, [user, hospital, token, setHospital]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Use hospital name from API or fallback to hardcoded mapping or generic name
  const hospitalName = hospital?.name || 
    (user?.hospital_id ? FALLBACK_HOSPITAL_NAMES[user.hospital_id] || `Hospital #${user.hospital_id}` : 'Hospital');

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with hospital name, logo, and logout */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
        {/* Left: Hospital Name */}
        <div className="flex-1 min-w-0">
            <div className="text-sm font-medium md:text-base truncate">
            {hospitalName}
          </div>
            <div className="text-xs text-muted-foreground hidden md:block">
            Hospital Management System
          </div>
        </div>

        {/* Center: HMS Logo */}
        <div className="flex-1 flex justify-center px-4">
          <div className="flex items-center gap-2">
            {/* HMS Logo */}
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-sm md:text-base">HMS</span>
            </div>
            <div className="hidden md:block">
                <div className="text-lg font-bold">HMS</div>
                <div className="text-xs text-muted-foreground -mt-1">Medical Portal</div>
            </div>
          </div>
        </div>

        {/* Right: User info and logout */}
        <div className="flex-1 flex justify-end items-center gap-2 md:gap-4 min-w-0">
          {user && (
            <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-muted-foreground truncate">
                Welcome, {user.name}
              </span>
                <Button
                  variant="outline"
                  size="sm"
                onClick={handleLogout}
                  className="flex-shrink-0"
              >
                Logout
                </Button>
            </div>
          )}
          {/* Mobile: Show user name and logout icon */}
          {user && (
            <div className="md:hidden flex items-center gap-2">
                <span className="text-xs text-muted-foreground truncate max-w-20">
                {user.name}
              </span>
                <Button
                  variant="ghost"
                  size="sm"
                onClick={handleLogout}
                  className="flex-shrink-0 p-2"
                aria-label="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                </Button>
            </div>
          )}
          </div>
        </div>
      </header>

      <div className="container grid grid-cols-1 md:grid-cols-4 gap-6 py-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex md:col-span-1 flex-col gap-2">
          <div className="space-y-1">
          <NavLink href="/dashboard" label="Dashboard" tab="dashboard" current={current} />
          <NavLink href="/patients" label="Patients" tab="patients" current={current} />
          <NavLink href="/queue" label="Doctor's Queue" tab="queue" current={current} />
            <NavLink href="/admin" label="Admin" tab="admin" current={current} />
          </div>
        </aside>

        {/* Content */}
        <main className="md:col-span-3">{children}</main>
      </div>

      {/* Bottom tab bar (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-background border-t backdrop-blur supports-[backdrop-filter]:bg-background/60 grid grid-cols-4">
        <Link 
          href="/dashboard" 
          className={cn(
            'py-3 text-center text-xs transition-colors',
            current === 'dashboard' ? 'text-primary font-medium' : 'text-muted-foreground'
          )}
        >
          Dashboard
        </Link>
        <Link 
          href="/patients" 
          className={cn(
            'py-3 text-center text-xs transition-colors',
            current === 'patients' ? 'text-primary font-medium' : 'text-muted-foreground'
          )}
        >
          Patients
        </Link>
        <Link 
          href="/queue" 
          className={cn(
            'py-3 text-center text-xs transition-colors',
            current === 'queue' ? 'text-primary font-medium' : 'text-muted-foreground'
          )}
        >
          Queue
        </Link>
        <Link 
          href="/admin" 
          className={cn(
            'py-3 text-center text-xs transition-colors',
            current === 'admin' ? 'text-primary font-medium' : 'text-muted-foreground'
          )}
        >
          Admin
        </Link>
      </nav>
    </div>
  );
}


