'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { login, register, getProfile } from '@/lib/api';
import { LoginForm, RegisterForm, USER_ROLES, ROLE_NAMES } from '@/lib/types';
import clsx from 'clsx';

export default function AuthPage() {
  const router = useRouter();
  const { token, user, setToken, setUser, setLoading, isLoading, isAuthenticated } = useAuthStore();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string>('');
  
  const [loginData, setLoginData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  
  const [registerData, setRegisterData] = useState<RegisterForm>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: USER_ROLES.FRONTDESK,
  });

  // If already authenticated, show welcome screen
  if (isAuthenticated()) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-sm text-blue-600 font-medium">
                {user?.role_id ? ROLE_NAMES[user.role_id] : 'Unknown Role'}
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn w-full"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await login(loginData);
      setToken(response.token);
      
      const userProfile = await getProfile(response.token);
      setUser(userProfile);
      
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.first_name || !registerData.last_name || !registerData.email || !registerData.password) {
      setError('All fields are required');
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(registerData);
      // After registration, direct to login
      setMode('login');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">HMS</h1>
        <p className="text-gray-600 mt-2">Hospital Management System</p>
      </div>

      {/* Auth Form */}
      <div className="card">
        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={clsx(
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              mode === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={clsx(
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              mode === 'register'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                className="input"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                className="input"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full"
              aria-label={isLoading ? 'Logging in...' : 'Login'}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="register-first-name" className="label">
                  First Name
                </label>
                <input
                  id="register-first-name"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="input"
                  value={registerData.first_name}
                  onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label htmlFor="register-last-name" className="label">
                  Last Name
                </label>
                <input
                  id="register-last-name"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="input"
                  value={registerData.last_name}
                  onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="label">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                className="input"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="register-role" className="label">
                Role
              </label>
              <select
                id="register-role"
                required
                className="input"
                value={registerData.role_id}
                onChange={(e) => setRegisterData({ ...registerData, role_id: Number(e.target.value) })}
              >
                {Object.entries(ROLE_NAMES).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="register-password" className="label">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                required
                className="input"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="register-confirm" className="label">
                Confirm Password
              </label>
              <input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                required
                className="input"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full"
              aria-label={isLoading ? 'Creating account...' : 'Create Account'}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
