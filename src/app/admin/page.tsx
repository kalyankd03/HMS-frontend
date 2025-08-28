'use client';

import AppShell from '@/components/AppShell';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { 
  createDoctor, 
  getAllDoctors, 
  getDepartments, 
  indexDoctors,
  getHospitalRoster,
  inviteUser
} from '@/lib/api';
import type { 
  CreateDoctorForm, 
  DoctorWithUser, 
  RosterUser, 
  InviteUserRequest,
  Department
} from '@/lib/types';
import { USER_ROLES } from '@/lib/types';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

export default function AdminPage() {
  const router = useRouter();
  const { token, isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'roster' | 'doctors'>('roster');
  
  // Common state
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  // Roster state
  const [roster, setRoster] = useState<RosterUser[]>([]);
  const [rosterBusy, setRosterBusy] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteUserRequest>({
    email: '',
    first_name: '',
    last_name: '',
    role_id: 1,
    department_id: undefined,
    speciality: ''
  });
  const [inviteBusy, setInviteBusy] = useState(false);

  // Doctor state
  const [formBusy, setFormBusy] = useState(false);
  const [indexBusy, setIndexBusy] = useState(false);
  const [doctorForm, setDoctorForm] = useState<CreateDoctorForm>({
    id: 0,
    dept: '',
    speciality: '',
    is_active: true,
  });
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentObjects, setDepartmentObjects] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<DoctorWithUser[]>([]);

  // Check authentication
  useEffect(() => {
    if (!token || !isAuthenticated()) {
      router.push('/');
    }
  }, [token, isAuthenticated, router]);

  // Load roster data
  const loadRoster = useCallback(async () => {
    if (!token) return;
    setRosterBusy(true);
    try {
      const data = await getHospitalRoster(token);
      setRoster(data.roster);
    } catch (err) {
      console.error('Failed to load roster:', err);
      setError('Failed to load hospital roster');
    } finally {
      setRosterBusy(false);
    }
  }, [token]);

  // Load doctor data
  const loadDoctorData = useCallback(async () => {
    if (!token) return;
    
    try {
      const [deptData, doctorData] = await Promise.all([
        getDepartments(token),
        getAllDoctors(token, { hospital_id: user?.hospital_id })
      ]);
      
      // deptData now contains full department objects with id, name, code
      setDepartmentObjects(deptData.departments);
      setDoctors(doctorData.doctors);
      
      // For backward compatibility, extract department names
      setDepartments(deptData.departments.map(d => d.name));
    } catch (err) {
      console.error('Failed to load doctor data:', err);
      setError('Failed to load doctor data');
    }
  }, [token, user?.hospital_id]);

  // No need to load specialities - it's a free text field

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'roster') {
      loadRoster();
    } else if (activeTab === 'doctors') {
      loadDoctorData();
    }
  }, [activeTab, loadRoster, loadDoctorData]);

  // Handle invite user
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || inviteBusy) return;

    setInviteBusy(true);
    setError('');
    setNotice('');

    try {
      await inviteUser(inviteForm, token);
      setNotice('User invited successfully');
      setInviteForm({
        email: '',
        first_name: '',
        last_name: '',
        role_id: 1,
        department_id: undefined,
        speciality: ''
      });
      loadRoster(); // Reload roster
    } catch (err) {
      console.error('Failed to invite user:', err);
      setError('Failed to invite user');
    } finally {
      setInviteBusy(false);
    }
  };

  // Handle create doctor
  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || formBusy) return;

    setFormBusy(true);
    setError('');
    setNotice('');

    try {
      await createDoctor(doctorForm, token);
      setNotice('Doctor created successfully');
      setDoctorForm({ id: 0, dept: '', speciality: '', is_active: true });
      loadDoctorData(); // Reload doctors
    } catch (err) {
      console.error('Failed to create doctor:', err);
      setError('Failed to create doctor');
    } finally {
      setFormBusy(false);
    }
  };

  // Handle index doctors
  const handleIndexDoctors = async () => {
    if (!token || indexBusy) return;

    setIndexBusy(true);
    try {
      await indexDoctors(token);
      setNotice('Doctor indexing initiated');
    } catch (err) {
      console.error('Failed to index doctors:', err);
      setError('Failed to index doctors');
    } finally {
      setIndexBusy(false);
    }
  };

  const getRoleName = (roleId: number) => {
    const roleNames = {
      [USER_ROLES.ADMIN]: 'Admin',
      [USER_ROLES.DOCTOR]: 'Doctor',
      [USER_ROLES.FRONTDESK]: 'Front Desk',
      [USER_ROLES.PHARMACIST]: 'Pharmacist'
    };
    return roleNames[roleId as keyof typeof roleNames] || 'Unknown';
  };

  const getStatusBadgeVariant = (status: string): 'warning' | 'success' | 'destructive' | 'secondary' => {
    const variants: Record<string, 'warning' | 'success' | 'destructive' | 'secondary'> = {
      invited: 'warning',
      active: 'success',
      inactive: 'destructive'
    };
    return variants[status] || 'secondary';
  };

  return (
    <AppShell>
      <div className="container mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage hospital roster and doctors
          </p>
        </div>

        {/* Notifications */}
        {notice && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
            <p className="text-green-800">{notice}</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'roster' | 'doctors')} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="roster">Hospital Roster</TabsTrigger>
            <TabsTrigger value="doctors">Doctor Management</TabsTrigger>
          </TabsList>

          <TabsContent value="roster" className="space-y-6">
            {/* Invite User Form */}
            <Card>
              <CardHeader>
                <CardTitle>Invite New User</CardTitle>
                <CardDescription>
                  Send an invitation to add a new user to the hospital roster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInviteUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                      type="email"
                      required
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                        placeholder="user@example.com"
                    />
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={inviteForm.role_id.toString()} onValueChange={(value) => setInviteForm({ ...inviteForm, role_id: Number(value) })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={USER_ROLES.FRONTDESK.toString()}>Front Desk</SelectItem>
                          <SelectItem value={USER_ROLES.DOCTOR.toString()}>Doctor</SelectItem>
                          <SelectItem value={USER_ROLES.PHARMACIST.toString()}>Pharmacist</SelectItem>
                          <SelectItem value={USER_ROLES.ADMIN.toString()}>Admin</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                      type="text"
                      required
                      value={inviteForm.first_name}
                      onChange={(e) => setInviteForm({ ...inviteForm, first_name: e.target.value })}
                        placeholder="John"
                    />
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                      type="text"
                      required
                      value={inviteForm.last_name}
                      onChange={(e) => setInviteForm({ ...inviteForm, last_name: e.target.value })}
                        placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Doctor-specific fields */}
                {inviteForm.role_id === USER_ROLES.DOCTOR && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={inviteForm.department_id?.toString() || ""} onValueChange={(value) => setInviteForm({ ...inviteForm, department_id: Number(value) })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                        {departmentObjects.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                              </SelectItem>
                        ))}
                          </SelectContent>
                        </Select>
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="speciality">Speciality</Label>
                        <Input
                          id="speciality"
                        type="text"
                        required
                        value={inviteForm.speciality}
                        onChange={(e) => setInviteForm({ ...inviteForm, speciality: e.target.value })}
                        placeholder="e.g., Pediatric Cardiology"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={inviteBusy}>
                    {inviteBusy ? 'Inviting...' : 'Send Invitation'}
                    </Button>
                </div>
              </form>
              </CardContent>
            </Card>

            {/* Hospital Roster */}
            <Card>
              <CardHeader>
                <CardTitle>Hospital Roster</CardTitle>
                <CardDescription>
                  View and manage all users in the hospital system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rosterBusy && (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">Loading roster...</p>
                  </div>
                )}
                {!rosterBusy && roster.length === 0 && (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">No users found</p>
              </div>
                )}
                {!rosterBusy && roster.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Added</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roster.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                              {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleName(user.role_id)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-6">
            {/* Create Doctor Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Doctor</CardTitle>
                <CardDescription>
                  Add a new doctor profile to an existing user account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateDoctor} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userId">User ID</Label>
                      <Input
                        id="userId"
                      type="number"
                      required
                      value={doctorForm.id || ''}
                      onChange={(e) => setDoctorForm({ ...doctorForm, id: Number(e.target.value) })}
                        placeholder="Enter user ID"
                    />
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={doctorForm.dept} onValueChange={(value) => setDoctorForm({ ...doctorForm, dept: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                      {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                      ))}
                        </SelectContent>
                      </Select>
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctorSpeciality">Speciality</Label>
                      <Input
                        id="doctorSpeciality"
                      type="text"
                      required
                      value={doctorForm.speciality}
                      onChange={(e) => setDoctorForm({ ...doctorForm, speciality: e.target.value })}
                        placeholder="e.g., Pediatric Cardiology"
                    />
                  </div>
                </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                    type="button"
                      variant="outline"
                    onClick={handleIndexDoctors}
                    disabled={indexBusy}
                  >
                    {indexBusy ? 'Indexing...' : 'Index Doctors'}
                    </Button>
                    <Button type="submit" disabled={formBusy}>
                    {formBusy ? 'Creating...' : 'Create Doctor'}
                    </Button>
                </div>
              </form>
              </CardContent>
            </Card>

            {/* Existing Doctors */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Doctors</CardTitle>
                <CardDescription>
                  View all doctors currently registered in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {doctors.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">No doctors found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Speciality</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">
                              Dr. {doctor.name}
                          </TableCell>
                          <TableCell>{doctor.email}</TableCell>
                          <TableCell>{doctor.dept}</TableCell>
                          <TableCell>{doctor.speciality}</TableCell>
                          <TableCell>
                            <Badge variant={doctor.is_active ? 'success' : 'destructive'}>
                              {doctor.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}