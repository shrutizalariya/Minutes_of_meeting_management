import React from "react";
import { CheckCircle, Clock, Calendar, AlertCircle, MoreVertical, ArrowRight, UserCheck } from "lucide-react";
// import { getStaffKPIs } from "@/lib/staff/kpis";
// import StaffKPICards from "@/app/components/staffdashboard/StaffKPICards";

export default async function StaffDashboard() {

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personal Workspace</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">You have 3 action items requiring attention today.</p>
        </div>
      </div>

      {/* KPI Grid - Emerald Focused */} 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
        <KPICard label="Assigned Actions" value="12" icon={<CheckCircle className="text-emerald-600" />} /> 
        <KPICard label="Pending Deadline" value="03" icon={<Clock className="text-amber-600" />} /> 
        <KPICard label="Meetings This Week" value="05" icon={<Calendar className="text-blue-600" />} /> 
        <KPICard label="Attendance Rate" value="98%" icon={<UserCheck className="text-indigo-600" />} /> 
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Actions Table - Matches Admin Table UI */}
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
                <StaffTaskRow 
                  description="Update Technical Architecture diagrams" 
                  meeting="System Sync V2" 
                  deadline="Today" 
                  priority 
                />
                <StaffTaskRow 
                  description="Finalize Q1 Budget Requests" 
                  meeting="Finance Review" 
                  deadline="Feb 28" 
                />
                <StaffTaskRow 
                  description="Review Personnel Handbook" 
                  meeting="HR Policy Sync" 
                  deadline="Mar 05" 
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Sidebar - Consistent with Pro UI */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-6">Upcoming Schedule</h2>
          <div className="space-y-4">
            <MiniScheduleCard title="Weekly Engineering Sync" time="14:00" type="Engineering" active />
            <MiniScheduleCard title="Sprint Planning" time="09:00 (Tomorrow)" type="Agile" />
            <MiniScheduleCard title="Staff Wellness Hall" time="11:30 (Friday)" type="HR" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
        {icon}
      </div>
      <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  );
}

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

function MiniScheduleCard({ title, time, type, active = false }: any) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${active ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{type}</span>
        <span className={`text-[10px] font-bold ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{time}</span>
      </div>
      <p className={`text-sm font-bold ${active ? 'text-emerald-900' : 'text-slate-800'}`}>{title}</p>
    </div>
  );
}

