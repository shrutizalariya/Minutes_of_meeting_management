"use client";

import { CheckCircle, Clock, Calendar, UserCheck } from "lucide-react";

type KPIs = {
  assignedActions: number;
  pendingDeadline: number;
  meetingsThisWeek: number;
  attendanceRate: number;
};

export default function StaffKPICards({ kpis }: { kpis: KPIs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard label="Assigned Actions" value={kpis.assignedActions} icon={<CheckCircle className="text-emerald-600" />} />
      <KPICard label="Pending Deadline" value={kpis.pendingDeadline} icon={<Clock className="text-amber-600" />} />
      <KPICard label="Meetings This Week" value={kpis.meetingsThisWeek} icon={<Calendar className="text-blue-600" />} />
      <KPICard label="Attendance Rate" value={`${kpis.attendanceRate}%`} icon={<UserCheck className="text-indigo-600" />} />
    </div>
  );
}

function KPICard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow flex items-center gap-3">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}