'use client';

import { useState, useEffect } from 'react';
import { getToken } from '@hms/core';
import type { DoctorWithUser } from '@hms/core';
import { doctorsApi } from '@/lib/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserCheck, Building2, Stethoscope, Loader2 } from 'lucide-react';

interface DoctorSearchProps {
  readonly onDoctorSelect: (doctor: DoctorWithUser) => void;
  readonly selectedDoctor?: DoctorWithUser | null;
  readonly placeholder?: string;
}

export function DoctorSearch({ onDoctorSelect, selectedDoctor, placeholder = "Search for a doctor..." }: DoctorSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DoctorWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const searchDoctors = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await doctorsApi.searchDoctors(searchQuery, token, 10);
      setResults(response.results);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching doctors:', error);
      setError(error instanceof Error ? error.message : 'Failed to search doctors');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchDoctors(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleDoctorSelect = (doctor: DoctorWithUser) => {
    onDoctorSelect(doctor);
    setQuery(doctor.name);
    setShowResults(false);
    setResults([]);
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

      {selectedDoctor && (
        <Card className="mt-2">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div className="flex-1">
                <h4 className="font-medium">{selectedDoctor.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Building2 className="mr-1 h-3 w-3" />
                    {selectedDoctor.dept}
                  </span>
                  <span className="flex items-center">
                    <Stethoscope className="mr-1 h-3 w-3" />
                    {selectedDoctor.speciality}
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
            {results.map((doctor) => (
              <Button
                key={doctor.id}
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left hover:bg-gray-50"
                onClick={() => handleDoctorSelect(doctor)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <UserCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{doctor.name}</div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Building2 className="mr-1 h-3 w-3" />
                        {doctor.dept}
                      </span>
                      <span className="flex items-center">
                        <Stethoscope className="mr-1 h-3 w-3" />
                        {doctor.speciality}
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && results.length === 0 && query.length >= 2 && !isLoading && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1">
          <CardContent className="p-4 text-center text-gray-500">
            No doctors found for "{query}"
          </CardContent>
        </Card>
      )}
    </div>
  );
}
