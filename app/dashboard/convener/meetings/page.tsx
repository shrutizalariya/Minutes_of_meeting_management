import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Download, Search, RotateCcw, FileText,
  ChevronLeft, ChevronRight,
  Clock, Plus, Target, Activity, CheckCircle, XCircle, MapPin
} from "lucide-react";
import ArchiveActionButtons from "../archive/ArchiveActions";

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status, page } = await searchParams;
  const keyword = q || "";
  const currentStatus = status || "all";
  const currentPage = parseInt(page || "1");
  const pageSize = 10;

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) redirect("/");

  const payload: any = await verifyToken(tokenCookie.value);
  if (!payload || !payload.id) redirect("/");

  const meetings = await prisma.meetings.findMany({
    where: {
      AND: [
        keyword ? {
          OR: [
            { MeetingDescription: { contains: keyword } },
            { Location: { contains: keyword } }
          ]
        } : {},
        currentStatus !== "all" ? { Status: currentStatus } : {}
      ]
    },
    include: {
      meetingtype: true,
      _count: {
        select: { meetingmember: true }
      },
      meetingmember: {
        include: {
          staff: { select: { StaffName: true, EmailAddress: true } }
        }
      }
    },
    orderBy: { MeetingDate: "desc" }
  });

  const totalRecords = meetings.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedMeetings = meetings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = {
    total: totalRecords,
    scheduled: meetings.filter(m => m.Status === "Scheduled").length,
    completed: meetings.filter(m => m.Status === "Completed").length,
    cancelled: meetings.filter(m => m.IsCancelled).length
  };

  return (
    <div className="space-y-8" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
            <Activity size={14} strokeWidth={3} /> Facilitation Center
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Meeting Repository</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Coordinate, track, and manage all organizational facilitation records.</p>
        </div>
        <Link
          href="/dashboard/convener/meetings/add"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white rounded-xl px-6 py-3 text-sm font-bold shadow-[0_4px_12px_rgba(29,78,216,0.3)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] hover:-translate-y-[1px] transition-all no-underline"
        >
          <Plus size={18} strokeWidth={3} /> Create Meeting
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Total Records" value={stats.total} icon={<FileText size={22} />} chartLabel="Aggregated" color="blue" trend="Archive" />
        <KPICard label="Upcoming" value={stats.scheduled} icon={<Clock size={22} />} chartLabel="Scheduled" color="amber" trend="Urgent" />
        <KPICard label="Completed" value={stats.completed} icon={<CheckCircle size={22} />} chartLabel="Finalized" color="emerald" trend="Steady" />
        <KPICard label="Cancelled" value={stats.cancelled} icon={<XCircle size={22} />} chartLabel="Voided" color="rose" trend="System" />
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6">
        <form action="" method="GET" className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                name="q" 
                placeholder="Search description or location..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                defaultValue={keyword}
              />
            </div>
          </div>
          <div className="w-full md:w-64 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lifecycle Status</label>
            <select 
              name="status" 
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              defaultValue={currentStatus}
            >
              <option value="all">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button type="submit" className="flex-1 md:flex-none bg-[#0B1324] text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md">
              Filter
            </button>
            <Link href="/dashboard/convener/meetings" className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all border border-slate-100">
              <RotateCcw size={20} />
            </Link>
          </div>
        </form>
      </div>

      {/* Meetings Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Target size={18} className="text-blue-600" />
            Facilitation Logs
          </h2>
          <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 tracking-widest">
            {totalRecords} Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/10">
                <th className="px-8 py-5">Session Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Quorum</th>
                <th className="px-6 py-5 text-center">Documentation</th>
                <th className="px-8 py-5 text-right">Drafting Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedMeetings.map((m) => (
                <tr key={m.MeetingID} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1">
                        {m.MeetingDescription || "Untitled Facilitation"}
                      </span>
                      <div className="flex items-center gap-3 mt-1.5 font-bold italic text-[9px] uppercase tracking-tighter">
                         <span className="text-slate-400 flex items-center gap-1"><Clock size={10} /> {new Date(m.MeetingDate).toLocaleDateString()}</span>
                         <span className="text-slate-300">|</span>
                         <span className="text-slate-400 flex items-center gap-1"><MapPin size={10} /> {m.Location || "TBD"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-100 text-[10px] font-black uppercase">
                       {m.meetingtype?.MeetingTypeName || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-6 font-black text-slate-900 text-sm">
                    {m._count.meetingmember.toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-6 text-center">
                    {m.DocumentPath ? (
                      <a 
                        href={m.DocumentPath.startsWith("http") ? m.DocumentPath : `/uploads/meeting_docs/${m.DocumentPath.split(/[\\/]/).pop()}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold text-[10px] uppercase no-underline"
                      >
                        <Download size={14} /> PDF
                      </a>
                    ) : (
                      <span className="text-[9px] text-slate-300 font-bold uppercase italic">No Minutes</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <ArchiveActionButtons
                      meetingId={m.MeetingID}
                      meetingDescription={m.MeetingDescription || "Untitled"}
                      meetingDate={m.MeetingDate.toISOString()}
                      isCancelled={m.IsCancelled ?? false}
                      members={m.meetingmember.map(mm => ({
                        StaffName: mm.staff.StaffName,
                        EmailAddress: mm.staff.EmailAddress || "",
                        IsPresent: mm.IsPresent ?? false,
                      }))}
                    />
                  </td>
                </tr>
              ))}
              {paginatedMeetings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold text-sm italic">
                    No facilitation records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-5 bg-slate-50/10 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
              Displaying {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords}
            </p>
            <div className="flex items-center gap-2">
              <Link 
                href={`?q=${keyword}&status=${currentStatus}&page=${currentPage - 1}`}
                className={`p-2 rounded-xl transition-all ${currentPage <= 1 ? 'text-slate-200 pointer-events-none' : 'text-slate-400 hover:bg-blue-600 hover:text-white shadow-md'}`}
              >
                <ChevronLeft size={20} />
              </Link>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <Link
                    key={i + 1}
                    href={`?q=${keyword}&status=${currentStatus}&page=${i + 1}`}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>
              <Link 
                href={`?q=${keyword}&status=${currentStatus}&page=${currentPage + 1}`}
                className={`p-2 rounded-xl transition-all ${currentPage >= totalPages ? 'text-slate-200 pointer-events-none' : 'text-slate-400 hover:bg-blue-600 hover:text-white shadow-md'}`}
              >
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KPICard({ label, value, icon, color, trend, chartLabel }: any) {
  const colorMap: any = {
    blue: 'from-blue-50 to-blue-100/30 text-blue-600 border-blue-100',
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
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300`}>
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
