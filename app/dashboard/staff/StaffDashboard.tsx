"use client";

import React from "react";
import { CheckCircle, Clock, Calendar, AlertCircle, ArrowRight, UserCheck } from "lucide-react";

export type MeetingType = {
  MeetingTypeID: number;
  MeetingTypeName: string;
};

export type Meeting = {
  MeetingID: number;
  MeetingDate: string;
  MeetingDescription?: string;
  meetingtype?: MeetingType;
  category?: "Meeting" | "Event";
};

export type MeetingMember = {
  MeetingMemberID: number;
  MeetingID: number;
  StaffID: number;
  IsPresent?: boolean;
  Remarks?: string;
  Created?: Date;
  Modified?: Date;
  meetings?: Meeting;
  category?: "Meeting" | "Event";
};

export type StaffDashboardData = {
  assignedActions: number;
  pendingDeadline: number;
  meetingsThisWeek: number;
  attendanceRate: number;
  tasks: MeetingMember[];
  schedules: Meeting[];
  staffName?: string;
};

type Props = StaffDashboardData;

export default function StaffDashboard({
  assignedActions,
  pendingDeadline,
  meetingsThisWeek,
  attendanceRate,
  tasks,
  schedules,
  staffName = "User",
}: Props) {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
             <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-2xl text-[10px] uppercase font-black tracking-widest animate-pulse">Staff Active</span>
             Personal Workspace
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">
            Welcome back, <span className="text-slate-900 font-black not-italic">{staffName}</span>! You have {tasks.length} recent assignments requiring attention.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Total Assignments" value={assignedActions} icon={<CheckCircle className="text-emerald-600" />} />
        <KPICard label="Pending (Scheduled)" value={pendingDeadline} icon={<Clock className="text-amber-600" />} />
        <KPICard label="Schedule This Week" value={meetingsThisWeek} icon={<Calendar className="text-blue-600" />} />
        <KPICard label="Attendance Rate" value={`${attendanceRate}%`} icon={<UserCheck className="text-indigo-600" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Tasks Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-extrabold text-slate-800 uppercase tracking-widest text-xs">Recent Assignments</h2>
            <Link href="/dashboard/staff/meetings" className="text-xs font-bold text-emerald-600 hover:underline no-underline">View Full Schedule</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-8 py-5">Assignment</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.length > 0 ? tasks.map((task) => (
                  <StaffTaskRow
                    key={`${task.category}-${task.MeetingMemberID}`}
                    id={task.MeetingID}
                    description={task.meetings?.MeetingDescription || "No description"}
                    category={task.category || "Meeting"}
                    deadline={new Date(task.meetings?.MeetingDate || "").toLocaleDateString()}
                    priority={task.meetings?.MeetingDate && new Date(task.meetings.MeetingDate) < new Date()}
                  />
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-medium">No recent assignments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-6">Upcoming Agenda</h2>
          <div className="space-y-4">
            {schedules.length > 0 ? schedules.map((item, index) => (
              <MiniScheduleCard
                key={`${item.category}-${item.MeetingID}`}
                id={item.MeetingID}
                title={item.MeetingDescription || "No Title"}
                time={new Date(item.MeetingDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                date={new Date(item.MeetingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                type={item.meetingtype?.MeetingTypeName || item.category}
                category={item.category}
                active={index === 0}
              />
            )) : (
              <p className="text-sm text-slate-400 text-center py-4 italic">No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KPICard({ label, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  );
}

// Task Row
function StaffTaskRow({ id, description, category, deadline, priority = false }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer text-sm">
      <td className="px-8 py-5">
        <Link href={`/dashboard/staff/meetings/${id}`} className="flex items-center gap-3 no-underline">
          {priority ? <AlertCircle size={16} className="text-amber-500" /> : <div className="h-2 w-2 rounded-full bg-slate-200" />}
          <span className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{description}</span>
        </Link>
      </td>
      <td className="px-6 py-5">
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${category === 'Event' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
          {category}
        </span>
      </td>
      <td className="px-6 py-5 text-slate-500 font-medium">{deadline}</td>
      <td className="px-8 py-5 text-right">
        <Link href={`/dashboard/staff/meetings/${id}`} className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 transition-all">
          <ArrowRight size={16} />
        </Link>
      </td>
    </tr>
  );
}

// Mini Schedule Card
function MiniScheduleCard({ id, title, time, date, type, category, active = false }: any) {
  return (
    <Link href={`/dashboard/staff/meetings/${id}`} className="no-underline block">
      <div className={`p-4 rounded-xl border transition-all ${active ? "bg-emerald-50 border-emerald-100 shadow-sm" : "bg-slate-50 border-slate-100"}`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-tighter ${active ? "text-emerald-600" : "text-slate-400"}`}>
            {type} {category && <span className="opacity-50 ml-1">• {category}</span>}
          </span>
          <span className={`text-[10px] font-bold ${active ? "text-emerald-600" : "text-slate-400"}`}>{date}, {time}</span>
        </div>
        <p className={`text-sm font-bold ${active ? "text-emerald-900" : "text-slate-800"}`}>{title}</p>
      </div>
    </Link>
  );
}

import Link from "next/link";