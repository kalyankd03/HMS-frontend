'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { getProfile } from '@/lib/api';
import { ROLE_NAMES } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, setUser, setLoading, logout, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If no token, redirect to login
    if (!token) {
      router.push('/');
      return;
    }

    // If token but no user, fetch profile
    if (token && !user) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const profile = await getProfile(token);
          setUser(profile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          logout();
          router.push('/');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [token, user, setUser, setLoading, logout, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Show loading while fetching profile
  if (isLoading || (token && !user)) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show redirect message
  if (!isAuthenticated()) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-semibold text-gray-900">Please log in</h1>
            <button
              onClick={() => router.push('/')}
              className="btn"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">{currentDate}</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium text-gray-900">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-900">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium text-blue-600">
              {user?.role_id ? ROLE_NAMES[user.role_id] : 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">User ID:</span>
            <span className="font-medium text-gray-900">{user?.user_id}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-600">Patients Today</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Appointments</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-3">
          <button className="btn w-full justify-start">
            <span>📋</span>
            <span className="ml-2">View Patients</span>
          </button>
          <button className="btn-secondary w-full justify-start">
            <span>📅</span>
            <span className="ml-2">Schedule Appointment</span>
          </button>
          <button className="btn-secondary w-full justify-start">
            <span>🔬</span>
            <span className="ml-2">Lab Results</span>
          </button>
          <button className="btn-secondary w-full justify-start">
            <span>💊</span>
            <span className="ml-2">Prescriptions</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Patient Registration</div>
              <div className="text-xs text-gray-500">John Doe registered - 2 hours ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Lab Result Updated</div>
              <div className="text-xs text-gray-500">Blood test completed - 4 hours ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Appointment Scheduled</div>
              <div className="text-xs text-gray-500">Dr. Smith - Tomorrow 10:00 AM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
