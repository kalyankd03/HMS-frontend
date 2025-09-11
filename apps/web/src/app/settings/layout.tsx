import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function SettingsLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
