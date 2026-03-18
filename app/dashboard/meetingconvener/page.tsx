"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit3, Users, CheckCircle, Clock, 
  MoreVertical, FileText, ArrowRight, Video, MapPin
} from "lucide-react";

export default function ConvenerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/convener");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.metrics || { convenedSessions: "00", draftMinutes: "00", avgAttendance: "0%", resolvedItems: "00" };
  const meetings = data?.meetings || [];
  const assignments = data?.assignments || [];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight italic">Convener <span className="text-slate-400 font-thin italic">Desk</span></h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Capture minutes, refine agendas, and assign follow-ups.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
             Draft Agenda
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Plus size={18} strokeWidth={3} /> Start New Session
          </button>
        </div>
      </div>

      {/* Management Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="My Convened Sessions" value={stats.convenedSessions} icon={<Video className="text-indigo-600" />} />
        <KPICard label="Draft Minutes" value={stats.draftMinutes} icon={<Edit3 className="text-amber-600" />} />
        <KPICard label="Avg. Attendance" value={stats.avgAttendance} icon={<Users className="text-emerald-600" />} />
        <KPICard label="Resolved Items" value={stats.resolvedItems} icon={<CheckCircle className="text-blue-600" />} />
      </div>

      {/* Convener Workflow */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Active Session Management */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-extrabold text-slate-400 uppercase tracking-widest text-[11px]">Pending Documentation</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {meetings.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                    <th className="px-8 py-5">Meeting Topic</th>
                    <th className="px-6 py-5">Attendance</th>
                    <th className="px-6 py-5">Action Items</th>
                    <th className="px-8 py-5 text-right">Draft State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {meetings.map((m: any) => (
                    <ConvenerRow 
                      key={m.id}
                      title={m.title} 
                      members={m.members} 
                      actions={m.actions} 
                      state={m.state} 
                      location={m.location}
                      urgent={m.urgent} 
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-slate-400 font-medium">
                No pending documentation found.
              </div>
            )}
          </div>
        </div>

        {/* Assignments Sidebar */}
        <div className="space-y-6">
          <h2 className="font-extrabold text-slate-400 uppercase tracking-widest text-[11px] px-2">Recent Assignments</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
             {assignments.length > 0 ? (
               assignments.map((a: any, idx: number) => (
                 <AssignmentCard key={idx} staff={a.staff} task={a.task} deadline={a.deadline} />
               ))
             ) : (
               <p className="text-slate-400 text-xs text-center py-4">No recent assignments.</p>
             )}
             
             <button className="w-full py-3 mt-4 text-[11px] font-black uppercase text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                View All Assignments
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
  );
}

function ConvenerRow({ title, members, actions, state, location, urgent = false }: any) {
  return (
    <tr className="hover:bg-indigo-50/30 transition-colors group cursor-pointer text-sm">
      <td className="px-8 py-6">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-none">{title}</span>
          <span className="text-[10px] text-slate-400 font-bold mt-2 flex items-center gap-1">
             <MapPin size={10} /> {location}
          </span>
        </div>
      </td>
      <td className="px-6 py-6 font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {members}
        </div>
      </td>
      <td className="px-6 py-6 font-bold text-slate-400">{actions} Items</td>
      <td className="px-8 py-6 text-right">
        <div className="flex items-center justify-end gap-3">
          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
            urgent ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-500'
          }`}>
            {state}
          </span>
          <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
        </div>
      </td>
    </tr>
  );
}

function AssignmentCard({ staff, task, deadline }: any) {
  return (
    <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
      <div className="h-8 w-8 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
        {staff.split(' ')[0][0]}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-xs font-bold text-slate-800 truncate">{task}</p>
        <p className="text-[10px] text-slate-400 mt-1">To: <span className="font-bold">{staff}</span> • <span className="italic">{deadline}</span></p>
      </div>
    </div>
  );
}
