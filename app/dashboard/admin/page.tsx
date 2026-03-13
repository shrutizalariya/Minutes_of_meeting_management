import React from "react";
import { prisma } from "@/lib/prisma";
import { 
  FileText, Users, CheckCircle, Clock, 
  MoreVertical, Plus, Calendar as CalendarIcon, MapPin 
} from "lucide-react";
import Link from "next/link";
import RecentMeetings from "./RecentMeetings";
import CriticalActionSidebarServer from "@/app/components/admindashboard/CriticalActionSidebarServer";
import MeetingChart from "@/app/components/admindashboard/MeetingChart";
import { getMeetingStatusStats } from "@/lib/admin/meetingStatus";

export type Meeting = {
  MeetingID: number;
  MeetingDate: string;
  MeetingDescription: string | null;
  Status: string;
  Location?: string | null;
};

export default async function DashboardPage() {

  const totalMeetings = await prisma.meetings.count();
  const totalStaff = await prisma.staff.count();
  const chartData = await getMeetingStatusStats();

  const pendingMeetings = await prisma.meetings.count({
    where:{Status:"Scheduled"}
  });

  const completedMeeings = await prisma.meetings.count({
    where:{Status:"Completed"}
  });

  const percent = totalMeetings === 0 ? 0 :
  Math.round((completedMeeings/totalMeetings)*100);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage meetings, track minutes, and assign action items.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
          <Plus size={18} strokeWidth={3} /> <Link href="/dashboard/admin/meetings/add">Schedule Meeting</Link>
        </button>
      </div>

{/* Dashboard Section */}


  {/* LEFT SIDE – KPI Cards */}
  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4">
    
    <KPICard
      label="Total Meetings"
      value={totalMeetings}
      icon={<FileText className="text-blue-500 w-5 h-5" />}
      color="blue"
      small
    />

    <KPICard
      label="Total Staff"
      value={totalStaff}
      icon={<Users className="text-indigo-500 w-5 h-5" />}
      color="indigo"
      small
    />

    <KPICard
      label="Pending Meetings"
      value={pendingMeetings}
      icon={<Clock className="text-amber-500 w-5 h-5" />}
      color="amber"
      small
    />

    <KPICard
      label="Completed"
      value={percent + "%"}
      icon={<CheckCircle className="text-emerald-500 w-5 h-5" />}
      color="emerald"
      small
    />

  </div>

  {/* RIGHT SIDE – Chart */}
  <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
    <MeetingChart data={chartData} />
  </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Recent Meetings Table - Maps to Meeting model */}
         <RecentMeetings />
      </div>

        {/* Action Items Sidebar - Maps to ActionItem model */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          
            <CriticalActionSidebarServer />
         
        </div>
      </div>
  );
}

function KPICard({ label, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className={`h-10 w-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  );
}

function ActionItemWidget({ task, assigned, deadline, overdue = false }: any) {
  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
      <p className="text-sm font-bold text-slate-800 mb-1">{task}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-slate-500 uppercase">{assigned}</span>
        <span className={`text-[10px] font-bold ${overdue ? 'text-red-500' : 'text-slate-400'}`}>{deadline}</span>
      </div>
    </div>
  );
}

async function getMeetings(): Promise<Meeting[]> {
  const meetings = await prisma.meetings.findMany({
    orderBy: { MeetingDate: "asc" },
    take: 100,
    select: {
      MeetingID: true,
      MeetingDate: true,
      MeetingDescription: true,
      Status: true,
      Location: true,
    },
  });

  return meetings.map((m) => ({
    ...m,
    MeetingDate: m.MeetingDate.toISOString(),  // convert Date to string
  }));
}
