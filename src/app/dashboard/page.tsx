"use client";

import AppShell from "@/components/AppShell";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/");
  }, [isAuthenticated, router]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell active="dashboard">
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">{currentDate}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">—</div>
              <div className="text-sm text-gray-600">Patients Today</div>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">—</div>
              <div className="text-sm text-gray-600">Appointments</div>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">—</div>
              <div className="text-sm text-gray-600">In Queue</div>
            </div>
          </div>
        </div>

        <div className="card">
          <p className="text-gray-700">This page will be designed later. Use the tabs to the left to manage Patients and view Queue.</p>
        </div>
      </div>
    </AppShell>
  );
}
