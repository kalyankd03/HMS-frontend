import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PaymentsLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
