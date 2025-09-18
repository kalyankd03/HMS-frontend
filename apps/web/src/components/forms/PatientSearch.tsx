'use client';

import { useState, useEffect } from 'react';
import { getStoredToken } from '@hms/core';
import type { Patient } from '@hms/core';
import { patientsApi } from '@/lib/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, User, Phone, Calendar, Loader2 } from 'lucide-react';

interface PatientSearchProps {
  readonly onPatientSelect: (patient: Patient) => void;
  readonly selectedPatient?: Patient | null;
  readonly placeholder?: string;
}

export function PatientSearch({ onPatientSelect, selectedPatient, placeholder = "Search for a patient..." }: PatientSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const searchPatients = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setResults([]);
      setShowResults(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = getStoredToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await patientsApi.searchPatients(searchQuery, token, 10);
      setResults(response.results);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching patients:', error);
      setError(error instanceof Error ? error.message : 'Failed to search patients');
      setResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search - only search if no patient is selected or query doesn't match selected patient
  useEffect(() => {
    if (selectedPatient && query === selectedPatient.name) {
      return; // Don't search if we're showing the selected patient name
    }
    
    const timeoutId = setTimeout(() => {
      searchPatients(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedPatient]);

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    setQuery(patient.name);
    setShowResults(false);
    setResults([]);
    setError(null);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {selectedPatient && (
        <Card className="mt-2">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <h4 className="font-medium">{selectedPatient.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Phone className="mr-1 h-3 w-3" />
                    {selectedPatient.phone}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    DOB: {formatDate(selectedPatient.date_of_birth)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {results.map((patient) => (
              <Button
                key={patient.patient_id}
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left hover:bg-gray-50"
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <User className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{patient.name}</div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {patient.phone}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        DOB: {formatDate(patient.date_of_birth)}
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && results.length === 0 && query.length >= 3 && !isLoading && !error && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1">
          <CardContent className="p-4 text-center text-gray-500">
            No patients found for &quot;{query}&quot;
          </CardContent>
        </Card>
      )}
    </div>
  );
}
