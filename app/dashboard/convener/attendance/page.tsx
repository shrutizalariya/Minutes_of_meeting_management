import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  BarChart2, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Users, 
  Clock, 
  Calendar,
  Activity,
  Target,
  Download
} from "lucide-react";
import ConvenerAttendanceChart from "./ConvenerAttendanceChart";
import ExportExcelButton from "@/app/ui/ExportExcelButton";

export default async function AttendancePage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) redirect("/");

  const payload: any = await verifyToken(tokenCookie.value);
  if (!payload || !payload.id) redirect("/");

  // Fetch 10 most recent completed meetings for the chart and list
  const recentMeetings = await prisma.meetings.findMany({
    where: { 
        Status: "Completed"
    },
    take: 10,
    orderBy: { MeetingDate: "desc" },
    include: {
      _count: {
        select: { meetingmember: true }
      },
      meetingmember: {
        select: { IsPresent: true }
      },
      meetingtype: true
    }
  });

  const chartData = recentMeetings.map(m => ({
    name: m.MeetingDescription ? m.MeetingDescription.substring(0, 10) + "..." : "Meeting",
    present: m.meetingmember.filter(mm => mm.IsPresent).length,
    absent: m.meetingmember.filter(mm => !mm.IsPresent).length,
    total: m._count.meetingmember
  })).reverse();

  // Prepare export data for ExportExcelButton
  const exportColumns = [
    { header: "Meeting", key: "name" },
    { header: "Type", key: "type" },
    { header: "Date", key: "date" },
    { header: "Present", key: "present" },
    { header: "Absent", key: "absent" },
    { header: "Total Members", key: "total" },
    { header: "Quorum Rate", key: "rate" },
  ];

  const exportData = recentMeetings.map(m => ({
    name: m.MeetingDescription || "Meeting",
    type: m.meetingtype?.MeetingTypeName || "General",
    date: new Date(m.MeetingDate).toLocaleDateString(),
    present: m.meetingmember.filter(mm => mm.IsPresent).length,
    absent: m.meetingmember.filter(mm => !mm.IsPresent).length,
    total: m._count.meetingmember,
    rate: m._count.meetingmember > 0
      ? `${Math.round((m.meetingmember.filter(mm => mm.IsPresent).length / m._count.meetingmember) * 100)}%`
      : "0%",
  }));

  const aggregateStats = {
    totalMeetings: recentMeetings.length,
    avgPresence: recentMeetings.length > 0 
      ? Math.round((recentMeetings.reduce((acc, m) => acc + (m.meetingmember.filter(mm => mm.IsPresent).length / m._count.meetingmember || 0), 0) / recentMeetings.length) * 100)
      : 0,
    totalStaffTally: recentMeetings.reduce((acc, m) => acc + m._count.meetingmember, 0),
    totalPresentTally: recentMeetings.reduce((acc, m) => acc + m.meetingmember.filter(mm => mm.IsPresent).length, 0)
  };

  return (
    <div className="space-y-10" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/convener" className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 no-underline hover:text-blue-700 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Attendance Analytics</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium">Monitoring organizational participation and quorum trends across all facilitations.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <BarChart2 size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reports Status</div>
            <div className="text-sm font-black text-slate-900">Synchronized (Live)</div>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <KPIStat 
          label="Avg. Quorum Rate"
          value={`${aggregateStats.avgPresence}%`}
          subtext="Participation Success"
          icon={<Target size={22} />}
          color="blue"
        />
        <KPIStat 
          label="Total Staff Tracked"
          value={aggregateStats.totalStaffTally}
          subtext="Aggregated Reach"
          icon={<Users size={22} />}
          color="indigo"
        />
        <KPIStat 
          label="Sessions Evaluated"
          value={aggregateStats.totalMeetings}
          subtext="Completed Analysis"
          icon={<Activity size={22} />}
          color="emerald"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Quorum Performance</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Cross-session comparison of staff presence vs. absence.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-slate-200"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Absent</span>
            </div>
          </div>
        </div>
        <div className="h-[400px]">
          <ConvenerAttendanceChart data={chartData} />
        </div>
      </div>

      {/* Historical Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
         <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">Historical Quorum Logs</h3>
            <ExportExcelButton
              data={exportData}
              columns={exportColumns}
              fileName="Attendance_Report"
            />
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10">
                 <th className="px-10 py-5">Meeting Description</th>
                 <th className="px-6 py-5">Facilitation Type</th>
                 <th className="px-6 py-5">Date</th>
                 <th className="px-6 py-5 text-center">Quorum Rate</th>
                 <th className="px-10 py-5 text-right">Raw Stats</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {recentMeetings.map((m) => {
                 const presenceRate = m._count.meetingmember > 0 
                   ? Math.round((m.meetingmember.filter(mm => mm.IsPresent).length / m._count.meetingmember) * 100) 
                   : 0;
                 return (
                   <tr key={m.MeetingID} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-10 py-6">
                        <span className="text-sm font-bold text-slate-800">{m.MeetingDescription || "Untitled Record"}</span>
                     </td>
                     <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter border border-blue-100">
                          {m.meetingtype?.MeetingTypeName || "General"}
                        </span>
                     </td>
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                           <Calendar size={14} className="text-slate-300" />
                           {new Date(m.MeetingDate).toLocaleDateString()}
                        </div>
                     </td>
                     <td className="px-6 py-6 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 border text-[10px] font-black uppercase text-slate-700">
                           <Activity size={12} strokeWidth={3} className={presenceRate > 75 ? "text-emerald-500" : "text-amber-500"} />
                           {presenceRate}%
                        </div>
                     </td>
                     <td className="px-10 py-6 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-xs font-black text-slate-900">{m.meetingmember.filter(mm => mm.IsPresent).length} / {m._count.meetingmember}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Present Status</span>
                        </div>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}

function KPIStat({ label, value, subtext, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`h-14 w-14 rounded-2xl ${colors[color]} flex items-center justify-center border group-hover:scale-110 transition-transform shadow-sm`}>
          {icon}
        </div>
        <div className="text-[10px] font-black text-slate-200 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Metric</div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          <span className="text-[10px] text-slate-400 font-medium italic">{subtext}</span>
        </div>
      </div>
    </div>
  );
}
