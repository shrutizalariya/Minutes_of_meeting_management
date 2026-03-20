import React from "react";
import { prisma } from "@/lib/prisma";
import {
  FileText, Users, CheckCircle, Clock,
  MapPin, Plus, ArrowRight, LayoutDashboard,
  Target, Zap, Activity
} from "lucide-react";
import Link from "next/link";
import RecentMeetings from "./RecentMeetings";
import CriticalActionSidebarServer from "@/app/components/admindashboard/CriticalActionSidebarServer";
import MeetingChart from "@/app/components/admindashboard/MeetingChart";
import { getMeetingStatusStats } from "@/lib/admin/meetingStatus";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function DashboardPage() {
  const totalMeetings = await prisma.meetings.count();
  const totalStaff = await prisma.staff.count();
  const chartData = await getMeetingStatusStats();

  const pendingMeetings = await prisma.meetings.count({
    where: { 
      Status: "Scheduled",
      IsCancelled: false // Exclude cancelled ones from awaiting action
    }
  });

  const completedMeetings = await prisma.meetings.count({
    where: { Status: "Completed" }
  });

  // Calculate percentage of purely completed meetings against total scheduled (not cancelled)
  const nonCancelledMeetings = await prisma.meetings.count({
    where: { IsCancelled: false }
  });

  const percent = nonCancelledMeetings === 0 ? 0 : Math.round((completedMeetings / nonCancelledMeetings) * 100);

  // Fetch admin name for greeting
  let adminName = "Admin";
  const token = (await cookies()).get("token")?.value;
  if (token) {
    try {
      const payload = await verifyToken(token) as { id: number; email: string; role: string };
      const user = await prisma.users.findUnique({ where: { Id: payload.id }, select: { Name: true } });
      if (user?.Name) adminName = user.Name.split(" ")[0];
    } catch (e) {}
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
            <Activity size={14} strokeWidth={3} /> Welcome back, {adminName}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic">Administrative Dashboard</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium max-w-2xl leading-relaxed">
            Manage meetings, audit system logs, and oversee organizational facilitation itemized by priority.
          </p>
        </div>
        <Link
          href="/dashboard/admin/meetings/add"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white rounded-xl px-6 py-3 text-sm font-bold shadow-[0_4px_12px_rgba(29,78,216,0.3)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] hover:-translate-y-[1px] transition-all no-underline"
        >
          <Plus size={18} strokeWidth={3} /> Schedule Meeting
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total Meetings"
          value={totalMeetings}
          icon={<FileText size={22} />}
          chartLabel="Aggregated"
          color="blue"
          trend="+4.5%"
        />
        <KPICard
          label="Staff Directory"
          value={totalStaff}
          icon={<Users size={22} />}
          chartLabel="Active"
          color="indigo"
          trend="Steady"
        />
        <KPICard
          label="Awaiting Action"
          value={pendingMeetings}
          icon={<Clock size={22} />}
          chartLabel="Scheduled"
          color="amber"
          trend="Urgent"
        />
        <KPICard
          label="Completion Rate"
          value={`${percent}%`}
          icon={<CheckCircle size={22} />}
          chartLabel="Efficiency"
          color="emerald"
          trend="Optimal"
        />
      </div>

      {/* Main Content Sections - Classic Vertical & Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Meeting Distribution Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Target size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Meeting Status Overview</h2>
          </div>
          <div className="h-[350px] w-full">
            <MeetingChart data={chartData} />
          </div>
        </div>

        {/* Priority Matrix Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Critical Matrix</h2>
          </div>
          <div className="custom-scrollbar overflow-y-auto max-h-[350px] pr-2">
            <CriticalActionSidebarServer />
          </div>
        </div>
      </div>

      {/* Recent Activity Section - Full Width Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600">
               <Zap size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Activity</h2>
          </div>
          <Link href="/dashboard/admin/meetings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="p-4">
          <RecentMeetings showActions={true} />
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'indigo' | 'amber' | 'emerald';
  trend: string;
  chartLabel: string;
}

function KPICard({ label, value, icon, color, trend, chartLabel }: KPICardProps) {
  const colorMap = {
    blue: 'from-blue-50 to-blue-100/30 text-blue-600 border-blue-100',
    indigo: 'from-indigo-50 to-indigo-100/30 text-indigo-600 border-indigo-100',
    amber: 'from-amber-50 to-amber-100/30 text-amber-600 border-amber-100',
    emerald: 'from-emerald-50 to-emerald-100/30 text-emerald-600 border-emerald-100',
  };

  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_45px_rgb(0,0,0,0.04)] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
          <span className="text-[10px] text-slate-400 font-medium">/ {chartLabel}</span>
        </div>
      </div>
    </div>
  );
}
