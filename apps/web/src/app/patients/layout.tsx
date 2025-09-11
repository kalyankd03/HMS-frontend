import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PatientsLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
