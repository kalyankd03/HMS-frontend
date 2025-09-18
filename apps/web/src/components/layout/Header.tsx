'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  User,
  Heart
} from 'lucide-react';

interface HeaderProps {
  readonly onMenuClick: () => void;
  readonly sidebarCollapsed: boolean;
  readonly onToggleCollapse: () => void;
}

export function Header({ onMenuClick, sidebarCollapsed, onToggleCollapse }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Simulate logout API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the logout function from useAuth hook
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="header-fixed fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm" style={{ backgroundColor: 'white', zIndex: 9999 }}>
      <div className="flex items-center justify-between px-4 py-3 h-16 bg-white w-full">
        {/* Left Side - Hospital Name & Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={onToggleCollapse}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>

          {/* Hospital Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">
                {user?.hospital_name || 'Hospital Management System'}
              </h1>
              <p className="text-xs text-gray-500">
                Healthcare Management
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - User Info & Logout */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || 'Loading...'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role_name || 'Unknown Role'}
            </p>
          </div>
          
          {/* User Avatar */}
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            {user?.name ? (
              <span className="text-sm font-medium text-gray-600">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </span>
            ) : (
              <User className="h-4 w-4 text-gray-600" />
            )}
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
