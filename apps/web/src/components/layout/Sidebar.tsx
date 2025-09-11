'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  UserCheck, 
  Clock, 
  BarChart3, 
  Settings,
  Home,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  readonly open: boolean;
  readonly collapsed: boolean;
  readonly onClose: () => void;
  readonly onToggleCollapse: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Patients',
    href: '/patients',
    icon: Users,
  },
  {
    name: 'Patient Queue',
    href: '/queue',
    icon: Clock,
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: UserCheck,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 lg:block shadow-sm",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <nav className="flex flex-col h-full p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  "hover:bg-gray-100 hover:text-gray-900",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-gray-600",
                  collapsed ? "justify-center" : "justify-start"
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                {!collapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:hidden shadow-lg",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.hospital_name || 'Hospital Management System'}
              </h2>
              <p className="text-xs text-gray-500">
                Healthcare Management
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose} // Close sidebar when navigating on mobile
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                  "hover:bg-gray-100 hover:text-gray-900",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-gray-600"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {user?.name ? (
                <span className="text-xs font-medium text-gray-600">
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              ) : (
                <Users className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.name || 'Loading...'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role_name || 'Unknown Role'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
