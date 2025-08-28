"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

type QueueItem = {
  tokenNumber: number;
  patientName: string;
  scheduledTime: string;
  status: "waiting" | "in_progress" | "done";
};

export default function QueuePage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!token || !isAuthenticated()) router.push("/");
  }, [token, isAuthenticated, router]);

  const items: QueueItem[] = useMemo(
    () => [
      { tokenNumber: 1, patientName: "John Doe", scheduledTime: "09:00", status: "waiting" },
      { tokenNumber: 2, patientName: "Aisha Khan", scheduledTime: "09:10", status: "in_progress" },
      { tokenNumber: 3, patientName: "Wei Chen", scheduledTime: "09:20", status: "waiting" },
      { tokenNumber: 4, patientName: "Maria Garcia", scheduledTime: "09:30", status: "waiting" },
      { tokenNumber: 5, patientName: "Sam Patel", scheduledTime: "09:40", status: "done" },
    ],
    []
  );

  return (
    <AppShell active="queue">
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Doctor&apos;s Queue</h1>
              <p className="text-sm text-gray-600">Today&apos;s appointments</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="date" className="input" aria-label="Select date" />
              <select className="input" aria-label="Filter status">
                <option value="all">All</option>
                <option value="waiting">Waiting</option>
                <option value="in_progress">In progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="hidden md:grid grid-cols-6 text-xs uppercase tracking-wide text-gray-500 px-4 py-2 bg-gray-50">
            <div>Token</div>
            <div className="col-span-2">Patient</div>
            <div>Scheduled</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          <ul className="divide-y">
            {items.map((q) => (
              <li key={q.tokenNumber} className="grid grid-cols-2 md:grid-cols-6 items-center px-4 py-3 gap-2">
                <div className="font-semibold">#{q.tokenNumber}</div>
                <div className="md:col-span-2">
                  <div className="text-gray-900 font-medium">{q.patientName}</div>
                  <div className="text-xs text-gray-500 md:hidden">{q.scheduledTime} • {q.status.replace('_', ' ')}</div>
                </div>
                <div className="hidden md:block">{q.scheduledTime}</div>
                <div className="hidden md:block">
                  <span
                    className={
                      q.status === "waiting"
                        ? "inline-flex items-center px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800"
                        : q.status === "in_progress"
                        ? "inline-flex items-center px-2 py-1 text-xs rounded bg-blue-100 text-blue-800"
                        : "inline-flex items-center px-2 py-1 text-xs rounded bg-green-100 text-green-800"
                    }
                  >
                    {q.status.replace("_", " ")}
                  </span>
                </div>
                <div className="text-right">
                  <button className="btn-secondary">View</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}


