'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getHospitals, checkInvitation, completeRegistration } from '@/lib/api';
import type { HospitalInfo } from '@/lib/types';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState<'hospital' | 'check' | 'register'>('hospital');
  const [hospitals, setHospitals] = useState<HospitalInfo[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [invitation, setInvitation] = useState<{
    invited: boolean;
    message: string;
    user?: { first_name: string; last_name: string; email: string };
  } | null>(null);
  
  const [registrationForm, setRegistrationForm] = useState({
    password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load hospitals on mount
  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const data = await getHospitals();
        setHospitals(data.hospitals);
      } catch (err) {
        console.error('Failed to load hospitals:', err);
        setError('Failed to load hospitals');
      }
    };
    
    loadHospitals();
  }, []);

  // If token is provided, skip to registration step
  useEffect(() => {
    if (token) {
      setStep('register');
    }
  }, [token]);

  const handleHospitalSelect = () => {
    if (!selectedHospital) {
      setError('Please select a hospital');
      return;
    }
    setStep('check');
    setError('');
  };

  const handleCheckInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedHospital) return;

    setLoading(true);
    setError('');
    
    try {
      const result = await checkInvitation(email, selectedHospital);
      setInvitation(result);
      
      if (result.invited) {
        setStep('register');
      }
    } catch (err) {
      console.error('Failed to check invitation:', err);
      setError('Failed to check invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registrationForm.password || !registrationForm.confirm_password) {
      setError('Please fill in all fields');
      return;
    }

    if (registrationForm.password !== registrationForm.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (registrationForm.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const registrationToken = token || ''; // In real app, you'd get this from the invitation flow
    if (!registrationToken) {
      setError('Invalid registration token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await completeRegistration({
        invitation_token: registrationToken,
        password: registrationForm.password,
        confirm_password: registrationForm.confirm_password
      });
      
      setSuccess('Registration completed successfully! You can now log in.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error('Failed to complete registration:', err);
      setError('Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Join Hospital Management System
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Complete your registration to access the system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex-1 border-t-2 ${step === 'hospital' ? 'border-blue-500' : 'border-gray-300'}`}></div>
              <div className={`mx-2 w-3 h-3 rounded-full ${step === 'hospital' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`flex-1 border-t-2 ${step === 'check' ? 'border-blue-500' : 'border-gray-300'}`}></div>
              <div className={`mx-2 w-3 h-3 rounded-full ${step === 'check' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`flex-1 border-t-2 ${step === 'register' ? 'border-blue-500' : 'border-gray-300'}`}></div>
              <div className={`mx-2 w-3 h-3 rounded-full ${step === 'register' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>
            <div className="flex justify-between text-xs mt-2 text-gray-500">
              <span>Hospital</span>
              <span>Check</span>
              <span>Register</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Step 1: Select Hospital */}
          {step === 'hospital' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Select Your Hospital</h2>
              <div className="space-y-3">
                {hospitals.map((hospital) => (
                  <div key={hospital.id} className="flex items-center">
                    <input
                      id={`hospital-${hospital.id}`}
                      type="radio"
                      name="hospital"
                      value={hospital.id}
                      checked={selectedHospital === hospital.id}
                      onChange={(e) => setSelectedHospital(Number(e.target.value))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor={`hospital-${hospital.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                      <div>{hospital.name}</div>
                      <div className="text-gray-500 text-xs">{hospital.address}</div>
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={handleHospitalSelect}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Check Invitation */}
          {step === 'check' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Check Your Invitation</h2>
              <form onSubmit={handleCheckInvitation} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'Check Invitation'}
                </button>
              </form>

              {invitation && !invitation.invited && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">{invitation.message}</p>
                </div>
              )}

              <button
                onClick={() => setStep('hospital')}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Hospital Selection
              </button>
            </div>
          )}

          {/* Step 3: Complete Registration */}
          {step === 'register' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Set Your Password</h2>
              
              {invitation?.user && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800 text-sm">
                    Welcome, {invitation.user.first_name} {invitation.user.last_name}!
                  </p>
                  <p className="text-blue-600 text-xs">{invitation.user.email}</p>
                </div>
              )}

              <form onSubmit={handleCompleteRegistration} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={registrationForm.password}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, password: e.target.value })}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    type="password"
                    required
                    value={registrationForm.confirm_password}
                    onChange={(e) => setRegistrationForm({ ...registrationForm, confirm_password: e.target.value })}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Completing Registration...' : 'Complete Registration'}
                </button>
              </form>

              {!token && (
                <button
                  onClick={() => setStep('check')}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Check Invitation
                </button>
              )}
            </div>
          )}

          {/* Link to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
