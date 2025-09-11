import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function QueueLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
