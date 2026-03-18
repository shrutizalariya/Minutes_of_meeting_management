"use client";

import React, { useState } from "react";
import { 
  Calendar, Users, ClipboardList, Clock, CheckCircle, 
  Eye, Edit, XCircle, UserCheck, Plus, FileUp, 
  BarChart3, Filter, Search, ChevronRight, BellRing,
  Activity, ArrowRight, Zap, Target, LayoutDashboard
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

interface InitialData {
  kpis: {
    total: number;
    upcoming: number;
    cancelled: number;
    staff: number;
  };
  meetings: any[];
  meetingTypes: string[];
  notifications: any[];
  chartData: any[];
}

export default function ConvenerDashboardClient({ initialData }: { initialData: InitialData }) {
  const [meetings, setMeetings] = useState(initialData.meetings);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMeetings = meetings.filter(m => {
    return (filterType === "" || m.type === filterType) &&
           (filterStatus === "" || m.status === filterStatus) &&
           (m.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
            m.location.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-8" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
            <Activity size={14} strokeWidth={3} /> Meeting Hub
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Meeting Facilitator Console</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Capture minutes, refine agendas, and assign follow-ups across the organization.</p>
        </div>
        <div className="flex gap-3">
          <ActionButton 
            label="Schedule New" 
            icon={<Plus size={18} strokeWidth={3} />} 
            href="/dashboard/convener/meetings/add" 
            primary 
          />
        </div>
      </div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard 
          label="Total Meetings" 
          value={initialData.kpis.total} 
          icon={<ClipboardList size={22} />} 
          color="blue"
          trend="Total"
          chartLabel="Aggregated"
        />
        <KPICard 
          label="Upcoming" 
          value={initialData.kpis.upcoming} 
          icon={<Clock size={22} />} 
          color="amber"
          trend="Urgent"
          chartLabel="Scheduled"
        />
        <KPICard 
          label="Cancelled" 
          value={initialData.kpis.cancelled} 
          icon={<XCircle size={22} />} 
          color="rose"
          trend="Closed"
          chartLabel="Voided"
        />
        <KPICard 
          label="Staff Directory" 
          value={initialData.kpis.staff} 
          icon={<Users size={22} />} 
          color="emerald"
          trend="Active"
          chartLabel="Quorum"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* 3. Quick Actions */}
          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
               <Zap size={16} className="text-indigo-600" />
               Express Operations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ActionButton 
                label="Upload Docs" 
                icon={<FileUp size={18} />} 
                href="/dashboard/convener/meetings" 
              />
              <ActionButton 
                label="Attendance Report" 
                icon={<BarChart3 size={18} />} 
                href="/dashboard/convener/attendance" 
              />
            </div>
          </section>

          {/* 2 & 7. Upcoming Meetings Table with Filters */}
          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Target size={18} className="text-indigo-600" />
                  Upcoming Schedule
                </h2>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search location..." 
                      className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-40"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter Type */}
                  <select 
                    className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {initialData.meetingTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>

                  {/* Filter Status */}
                  <select 
                    className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/10">
                    <th className="px-8 py-5">Facilitation Details</th>
                    <th className="px-6 py-5">Timestamps</th>
                    <th className="px-6 py-5 text-center">Quorum</th>
                    <th className="px-8 py-5 text-right">Drafting Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredMeetings.map((m) => (
                    <tr key={m.id} className="hover:bg-indigo-50/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">#{m.id} - {m.type}</span>
                          <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter italic">Loc: {m.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-bold text-slate-500 text-xs">
                        {new Date(m.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="inline-flex items-center justify-center h-8 w-12 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">
                          {m.memberCount}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                           <ActionIcon icon={<Eye size={14} />} tooltip="View" />
                           <ActionIcon icon={<Edit size={14} />} tooltip="Edit" />
                           <ActionIcon icon={<UserCheck size={14} />} tooltip="Attendance" />
                           <ActionIcon icon={<XCircle size={14} />} tooltip="Cancel" red />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMeetings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold text-sm">
                         No facilitation records found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Attendance Overview Chart */}
          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
             <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity size={18} className="text-indigo-600" />
                  Presence Analytics
                </h2>
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Efficiency Flow</span>
             </div>
             <div className="h-[300px] w-full px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={initialData.chartData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    />
                    <Tooltip 
                      cursor={{fill: '#F8FAFC'}} 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                    <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} name="Present" />
                    <Bar dataKey="absent" fill="#fda4af" radius={[4, 4, 0, 0]} barSize={24} name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </section>

        </div>

        {/* Right Column (Sidebar Elements) */}
        <div className="space-y-8">
          
          {/* 6. Mini Calendar Preview Component */}
          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 px-2">
               <LayoutDashboard size={18} className="text-indigo-600" />
               Upcoming Timeline
            </h2>
            <div className="space-y-4 px-2">
               {initialData.meetings.slice(0, 3).map((m, i) => (
                 <div key={i} className="flex gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="h-10 w-10 flex-shrink-0 bg-indigo-50 rounded-xl flex flex-col items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                       <span className="text-[10px] font-bold uppercase leading-none">{new Date(m.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                       <span className="text-sm font-black mt-0.5">{new Date(m.date).getDate()}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <p className="text-xs font-bold truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{m.type}</p>
                       <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase italic leading-none">{m.location}</p>
                    </div>
                 </div>
               ))}
               <a 
                 href="/dashboard/convener/meetings"
                 className="w-full block text-center py-3.5 mt-2 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-indigo-600 hover:text-white transition-all no-underline"
               >
                  Open Timeline View
               </a>
            </div>
          </section>


        </div>

      </div>
    </div>
  );
}

function KPICard({ label, value, icon, color, trend, chartLabel }: any) {
  const colorMap: any = {
    blue: 'from-blue-50 to-blue-100/30 text-blue-600 border-blue-100',
    indigo: 'from-indigo-50 to-indigo-100/30 text-indigo-600 border-indigo-100',
    amber: 'from-amber-50 to-amber-100/30 text-amber-600 border-amber-100',
    emerald: 'from-emerald-50 to-emerald-100/30 text-emerald-600 border-emerald-100',
    rose: 'from-rose-50 to-rose-100/30 text-rose-600 border-rose-100',
  };

  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_45px_rgb(0,0,0,0.04)] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value.toString().padStart(2, '0')}</h3>
          <span className="text-[10px] text-slate-400 font-medium">/ {chartLabel}</span>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, icon, href, primary = false }: any) {
  return (
    <a 
      href={href}
      className={`
        flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all
        ${primary 
          ? "bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white shadow-[0_4px_12px_rgba(29,78,216,0.3)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] hover:-translate-y-1" 
          : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 hover:shadow-md"
        }
      `}
    >
      {icon}
      {label}
    </a>
  );
}

function ActionIcon({ icon, tooltip, red = false }: any) {
  return (
    <div className={`
      h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer group/icon relative
      ${red 
        ? "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white" 
        : "bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white"
      }
    `}>
      {icon}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[9px] font-black text-white px-2 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity uppercase pointer-events-none tracking-tighter">
        {tooltip}
      </span>
    </div>
  );
}
