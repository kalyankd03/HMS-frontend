'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw, Users, AlertCircle, Play, RotateCcw, CheckCircle } from 'lucide-react';
import { doctorsApi } from '@/lib/api';
import { getStoredToken } from '@hms/core';
import type { QueueResponse, QueueVisit } from '@hms/api-client';

export default function QueuePage() {
  const [queueData, setQueueData] = useState<QueueResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchQueueData = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const token = getStoredToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const data = await doctorsApi.getQueue(token, refresh);
      setQueueData(data);
    } catch (err) {
      console.error('Failed to fetch queue data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch queue data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQueueData();
  }, [fetchQueueData]);

  const handleRefresh = () => {
    fetchQueueData(true);
  };

  const handleStartVisit = async (opId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [opId]: true }));
      
      const token = getStoredToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await doctorsApi.startVisit(opId, token);
      
      // Show success message
      setSuccessMessage('Visit started successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh queue data after successful action
      await fetchQueueData(true);
    } catch (err) {
      console.error('Failed to start visit:', err);
      setError(err instanceof Error ? err.message : 'Failed to start visit');
    } finally {
      setActionLoading(prev => ({ ...prev, [opId]: false }));
    }
  };

  const handleResumeVisit = async (opId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [opId]: true }));
      
      const token = getStoredToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await doctorsApi.resumeVisit(opId, token);
      
      // Show success message
      setSuccessMessage('Visit resumed successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh queue data after successful action
      await fetchQueueData(true);
    } catch (err) {
      console.error('Failed to resume visit:', err);
      setError(err instanceof Error ? err.message : 'Failed to resume visit');
    } finally {
      setActionLoading(prev => ({ ...prev, [opId]: false }));
    }
  };

  const getPriorityLevel = (visit: QueueVisit): 'high' | 'medium' | 'low' => {
    // Determine priority based on wait time (this is just an example logic)
    if (visit.wait_time_minutes > 20) return 'high';
    if (visit.wait_time_minutes > 10) return 'medium';
    return 'low';
  };

  const getStatusDisplay = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'waiting': return 'waiting';
      case 'active': return 'in-progress';
      case 'in_progress': return 'in-progress';
      case 'visit_started': return 'in-progress';
      case 'paused': return 'paused';
      default: return status;
    }
  };

  const getPriorityVariant = (priority: 'high' | 'medium' | 'low') => {
    if (priority === 'high') return 'destructive';
    if (priority === 'medium') return 'default';
    return 'secondary';
  };

  const getStatusVariant = (status: string) => {
    if (status === 'in-progress') return 'default';
    if (status === 'paused') return 'secondary';
    return 'outline';
  };

  const renderActionButton = (visit: QueueVisit) => {
    const status = visit.visit_status.toLowerCase();
    const isLoadingAction = actionLoading[visit.op_id] || false;

    console.log(`Rendering button for ${visit.patient_name} with status: ${status}`);

    if (status === 'waiting') {
      console.log(`Rendering START button for ${visit.patient_name}`);
      return (
        <Button
          size="sm"
          onClick={() => handleStartVisit(visit.op_id)}
          disabled={isLoadingAction}
          className="bg-green-600 hover:bg-green-700 text-white"
          style={{ minWidth: '80px' }}
        >
          {isLoadingAction ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Start
        </Button>
      );
    }

    if (status === 'paused') {
      console.log(`Rendering RESUME button for ${visit.patient_name}`);
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleResumeVisit(visit.op_id)}
          disabled={isLoadingAction}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
          style={{ minWidth: '80px' }}
        >
          {isLoadingAction ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="mr-2 h-4 w-4" />
          )}
          Resume
        </Button>
      );
    }

    if (status === 'active' || status === 'in_progress' || status === 'visit_started') {
      console.log(`Rendering IN PROGRESS badge for ${visit.patient_name}`);
      return (
        <Badge variant="default" className="bg-blue-600 text-white px-3 py-1">
          In Progress
        </Badge>
      );
    }

    // For any other status, show a debug message and render start button
    console.log(`Unknown status "${status}" for ${visit.patient_name}, rendering fallback START button`);
    return (
      <Button
        size="sm"
        onClick={() => handleStartVisit(visit.op_id)}
        disabled={isLoadingAction}
        className="bg-green-600 hover:bg-green-700 text-white"
        style={{ minWidth: '80px' }}
      >
        {isLoadingAction ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Play className="mr-2 h-4 w-4" />
        )}
        Start
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading queue data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Patient Queue</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Queue</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalInQueue = queueData ? queueData.stats.total_waiting + queueData.stats.total_active + queueData.stats.total_paused : 0;
  const averageWaitTime = queueData && queueData.visits.length > 0 
    ? Math.round(queueData.visits.reduce((sum, visit) => sum + visit.wait_time_minutes, 0) / queueData.visits.length)
    : 0;
  const currentlyServing = queueData ? queueData.stats.total_active : 0;

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <p className="text-sm font-medium text-green-800">{successMessage}</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Patient Queue</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInQueue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageWaitTime} min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Serving</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentlyServing}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
          <CardDescription>
            Patients currently waiting for service
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!queueData || queueData.visits.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Patients in Queue</h3>
              <p className="text-muted-foreground">The queue is currently empty.</p>
            </div>
          ) : (
          <div className="space-y-4">
              {queueData.visits.map((visit) => {
                const priority = getPriorityLevel(visit);
                const status = getStatusDisplay(visit.visit_status);
                
                return (
                  <div key={visit.op_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                          {visit.patient_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                        <p className="font-medium">{visit.patient_name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: P{visit.patient_id.toString().padStart(3, '0')} • Age: {visit.patient_age}
                          {visit.patient_gender && ` • ${visit.patient_gender}`}
                        </p>
                        {visit.chief_complaint && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Complaint: {visit.chief_complaint}
                          </p>
                        )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                      <Badge variant={getPriorityVariant(priority)}>
                        {priority} priority
                  </Badge>
                      <Badge variant={getStatusVariant(status)}>
                        {status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                        Wait: {visit.wait_time_minutes} min
                  </span>
                  <div className="flex items-center">
                    {renderActionButton(visit)}
                  </div>
                </div>
              </div>
                );
              })}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
