import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardLayoutWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
