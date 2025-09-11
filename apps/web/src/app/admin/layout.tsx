import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
