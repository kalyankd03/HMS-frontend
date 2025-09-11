'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AuthGuard } from '../auth/AuthGuard';

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            open={sidebarOpen}
            collapsed={sidebarCollapsed}
            onClose={() => setSidebarOpen(false)}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content */}
          <main 
            className={`flex-1 transition-all duration-300 bg-gray-50 min-h-screen ${
              sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
            }`}
          >
            <div className="pt-16 relative z-10"> {/* Account for fixed header */}
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <button 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden border-0 p-0 m-0"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}
      </div>
    </AuthGuard>
  );
}
