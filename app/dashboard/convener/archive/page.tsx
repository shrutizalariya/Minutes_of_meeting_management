import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  BookOpen, ArrowLeft, Search, RotateCcw, Clock, MapPin, FileText,
  Download, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Eye, Edit, UserCheck, Users
} from "lucide-react";
import ExportExcelButton from "@/app/ui/ExportExcelButton";
import ArchiveActionButtons from "./ArchiveActions";

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const keyword = q || "";
  const currentPage = parseInt(page || "1");
  const pageSize = 10;

  const where: any = {
    AND: [
      {
        OR: [
          { Status: "Completed" },
          { IsCancelled: true }
        ]
      },
      keyword ? {
        OR: [
          { MeetingDescription: { contains: keyword } },
          { Location: { contains: keyword } }
        ]
      } : {}
    ]
  };

  const [meetings, totalRecords] = await Promise.all([
    prisma.meetings.findMany({
      where,
      include: {
        meetingtype: true,
        meetingmember: {
          include: {
            staff: { select: { StaffName: true, EmailAddress: true } }
          }
        }
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: { MeetingDate: "desc" }
    }),
    prisma.meetings.count({ where })
  ]);

  const totalPages = Math.ceil(totalRecords / pageSize);

  // Prepare export data for CSV/Excel
  const exportColumns = [
    { header: "Meeting ID", key: "MeetingID" },
    { header: "Description", key: "MeetingDescription" },
    { header: "Type", key: "typeName" },
    { header: "Date", key: "formattedDate" },
    { header: "Location", key: "Location" },
    { header: "Status", key: "statusLabel" },
    { header: "Members", key: "memberCount" },
    { header: "Present", key: "presentCount" },
  ];

  const exportData = meetings.map(m => ({
    MeetingID: m.MeetingID,
    MeetingDescription: m.MeetingDescription || "Untitled",
    typeName: m.meetingtype?.MeetingTypeName || "General",
    formattedDate: new Date(m.MeetingDate).toLocaleDateString(),
    Location: m.Location || "Remote",
    statusLabel: m.IsCancelled ? "Cancelled" : "Completed",
    memberCount: m.meetingmember.length,
    presentCount: m.meetingmember.filter(mm => mm.IsPresent).length,
  }));



  return (
    <div className="space-y-10" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/convener" className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 no-underline hover:text-blue-700 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Facilitation Archive</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium">Historical repository of all past, finalized, and cancelled organizational meeting records.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportExcelButton
            data={exportData}
            columns={exportColumns}
            fileName="Archive_Meetings"
          />
          <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <BookOpen size={24} />
             </div>
             <div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Vault Storage</div>
                <div className="text-2xl font-black text-slate-900">{totalRecords}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <form method="GET" className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Search Vault</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                name="q" 
                placeholder="Search by topic, keyword or location..." 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                defaultValue={keyword}
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button type="submit" className="flex-1 md:flex-none bg-[#0B1324] text-white px-10 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] hover:bg-slate-800 transition-all shadow-md">
              Retrieve
            </button>
            <Link href="/dashboard/convener/archive" className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all border border-slate-100">
              <RotateCcw size={22} />
            </Link>
          </div>
        </form>
      </div>

      {/* Archive Grid/Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10">
              <th className="px-10 py-5">Record Identifier</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Final Status</th>
              <th className="px-6 py-5 text-center">Minutes</th>
              <th className="px-10 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {meetings.map((m, idx) => (
              <tr key={m.MeetingID} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-10 py-6">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1">{m.MeetingDescription || "Untitled Record"}</span>
                      <div className="flex items-center gap-3 mt-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
                         <span className="flex items-center gap-1"><Clock size={10} /> {new Date(m.MeetingDate).toLocaleDateString()}</span>
                         <span className="text-slate-200">|</span>
                         <span className="flex items-center gap-1"><MapPin size={10} /> {m.Location || "Remote"}</span>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-6 font-black text-[10px] text-slate-400 uppercase tracking-widest">
                   {m.meetingtype?.MeetingTypeName || "General"}
                </td>
                <td className="px-6 py-6">
                   {m.IsCancelled ? (
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100">
                        <XCircle size={10} strokeWidth={3} /> Cancelled
                     </span>
                   ) : (
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                        <CheckCircle size={10} strokeWidth={3} /> Completed
                     </span>
                   )}
                </td>
                <td className="px-6 py-6 text-center">
                   {m.DocumentPath ? (
                     <a 
                       href={m.DocumentPath.startsWith("http") ? m.DocumentPath : `/uploads/meeting_docs/${m.DocumentPath.split(/[\\/]/).pop()}`} 
                       target="_blank"
                       className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all no-underline"
                     >
                        <Download size={12} /> PDF
                     </a>
                   ) : (
                     <span className="text-[9px] font-bold text-slate-300 uppercase italic">Not Filed</span>
                   )}
                </td>
                <td className="px-10 py-6 text-right">
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
            {meetings.length === 0 && (
              <tr>
                 <td colSpan={5} className="py-20 text-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-4">
                       <BookOpen size={30} />
                    </div>
                    <p className="text-slate-400 font-bold text-lg italic tracking-tight">The vault is empty for this query.</p>
                 </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
           <Link 
             href={`?q=${keyword}&page=${currentPage - 1}`}
             className={`h-10 w-10 rounded-xl flex items-center justify-center border border-slate-100 transition-all ${currentPage <= 1 ? "text-slate-200 pointer-events-none" : "text-slate-400 hover:bg-blue-600 hover:text-white shadow-md"}`}
           >
              <ChevronLeft size={20} />
           </Link>
           <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Link
                  key={i + 1}
                  href={`?q=${keyword}&page=${i + 1}`}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${currentPage === i + 1 ? "bg-[#0B1324] text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"}`}
                >
                  {i + 1}
                </Link>
              ))}
           </div>
           <Link 
             href={`?q=${keyword}&page=${currentPage + 1}`}
             className={`h-10 w-10 rounded-xl flex items-center justify-center border border-slate-100 transition-all ${currentPage >= totalPages ? "text-slate-200 pointer-events-none" : "text-slate-400 hover:bg-blue-600 hover:text-white shadow-md"}`}
           >
              <ChevronRight size={20} />
           </Link>
        </div>
      )}
    </div>
  );
}
