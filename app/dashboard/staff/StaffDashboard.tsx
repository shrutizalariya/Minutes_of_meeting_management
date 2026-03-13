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
};

export type MeetingMember = {
  MeetingMemberID: number;
  StaffID: number;
  IsPresent?: boolean;
  Remarks?: string;
  Created?: Date;
  Modified?: Date;
  meetings?: Meeting;
};

export type StaffDashboardData = {
  assignedActions: number;
  pendingDeadline: number;
  meetingsThisWeek: number;
  attendanceRate: number;
  tasks: MeetingMember[];
  schedules: Meeting[];
};

type Props = StaffDashboardData;

export default function StaffDashboard({
  assignedActions,
  pendingDeadline,
  meetingsThisWeek,
  attendanceRate,
  tasks,
  schedules,
}: Props) {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personal Workspace</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">
            You have {tasks.length} action items requiring attention today.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Assigned Actions" value={assignedActions} icon={<CheckCircle className="text-emerald-600" />} />
        <KPICard label="Pending Deadline" value={pendingDeadline} icon={<Clock className="text-amber-600" />} />
        <KPICard label="Meetings This Week" value={meetingsThisWeek} icon={<Calendar className="text-blue-600" />} />
        <KPICard label="Attendance Rate" value={`${attendanceRate}%`} icon={<UserCheck className="text-indigo-600" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Tasks Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-extrabold text-slate-800 uppercase tracking-widest text-xs">Assigned Action Items</h2>
            <button className="text-xs font-bold text-emerald-600 hover:underline">View Task Board</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-8 py-5">Task Description</th>
                  <th className="px-6 py-5">Origin Meeting</th>
                  <th className="px-6 py-5">Deadline</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.map((task) => (
                  <StaffTaskRow
                    key={task.MeetingMemberID}
                    description={task.meetings?.MeetingDescription || "No description"}
                    meeting={task.meetings?.MeetingDescription || "Meeting"}
                    deadline={new Date(task.meetings?.MeetingDate || "").toDateString()}
                    priority={task.meetings?.MeetingDate && new Date(task.meetings.MeetingDate) < new Date()}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-6">Upcoming Schedule</h2>
          <div className="space-y-4">
            {schedules.map((meeting, index) => (
              <MiniScheduleCard
                key={meeting.MeetingID}
                title={meeting.MeetingDescription || "No Title"}
                time={new Date(meeting.MeetingDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                type={meeting.meetingtype?.MeetingTypeName}
                active={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KPICard({ label, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">{icon}</div>
      <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  );
}

// Task Row
function StaffTaskRow({ description, meeting, deadline, priority = false }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer text-sm">
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          {priority ? <AlertCircle size={16} className="text-amber-500" /> : <div className="h-2 w-2 rounded-full bg-slate-200" />}
          <span className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{description}</span>
        </div>
      </td>
      <td className="px-6 py-5 font-semibold text-slate-500">{meeting}</td>
      <td className="px-6 py-5 text-slate-500 font-medium">{deadline}</td>
      <td className="px-8 py-5 text-right">
        <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 transition-all">
          <ArrowRight size={16} />
        </button>
      </td>
    </tr>
  );
}

// Mini Schedule Card
function MiniScheduleCard({ title, time, type, active = false }: any) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${active ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{type}</span>
        <span className={`text-[10px] font-bold ${active ? "text-emerald-600" : "text-slate-400"}`}>{time}</span>
      </div>
      <p className={`text-sm font-bold ${active ? "text-emerald-900" : "text-slate-800"}`}>{title}</p>
    </div>
  );
}