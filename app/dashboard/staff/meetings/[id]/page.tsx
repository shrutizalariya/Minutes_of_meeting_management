import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import {
  Calendar, Tag, FileText, Info, Clock, ArrowLeft,
  CheckCircle, XCircle, Paperclip, MapPin, Users
} from "lucide-react";

export default async function StaffMeetingViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await prisma.meetings.findFirst({
    where: { MeetingID: Number(id) },
    include: {
      meetingtype: true,
      meetingmember: {
        include: {
          staff: {
            select: { StaffName: true, EmailAddress: true },
          },
        },
      },
    },
  });

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Error</p>
          <p className="text-slate-600 text-lg font-semibold mt-2">Meeting not found</p>
          <Link href="/dashboard/staff/meetings" className="text-emerald-600 text-sm font-bold mt-4 inline-block hover:underline">
            Return to workspace
          </Link>
        </div>
      </div>
    );
  }

  const presentCount = data.meetingmember.filter(m => m.IsPresent).length;
  const totalMembers = data.meetingmember.length;
  const presenceRate = totalMembers > 0 ? Math.round((presentCount / totalMembers) * 100) : 0;

  return (
    <div className="space-y-8" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/staff/meetings" className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 no-underline hover:text-emerald-700 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> My Meetings
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Meeting Overview</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">Viewing details for scheduled discussion #{data.MeetingID}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            data.IsCancelled
              ? "bg-rose-50 text-rose-600 border-rose-100"
              : data.Status === "Completed"
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-blue-50 text-blue-600 border-blue-100"
          }`}>
            {data.IsCancelled ? <XCircle size={12} /> : <CheckCircle size={12} />}
            {data.IsCancelled ? "Cancelled" : data.Status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={12} className="text-emerald-500" /> Date & Time
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                    {new Date(data.MeetingDate).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={12} className="text-emerald-500" /> Classification
                    </p>
                    <p className="text-sm font-bold text-slate-700">{data.meetingtype?.MeetingTypeName ?? "General"}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} className="text-emerald-500" /> Venue
                    </p>
                    <p className="text-sm font-bold text-slate-700">{data.Location || "Not specified"}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Users size={12} className="text-emerald-500" /> Quorum Status
                    </p>
                    <p className="text-sm font-bold text-slate-700">{presentCount} / {totalMembers} Participants</p>
                </div>
                </div>

                {/* Description */}
                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={12} className="text-emerald-500" /> Briefings & Minutes
                </p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {data.MeetingDescription || "No description provided"}
                </p>
                </div>

                {/* Document */}
                <div className="mt-8 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Materials</p>
                {data.DocumentPath ? (
                    <a
                    href={data.DocumentPath.startsWith("http") ? data.DocumentPath : `/uploads/meeting_docs/${data.DocumentPath.split(/[\\/]/).pop()}`}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group no-underline"
                    >
                    <div className="flex items-center gap-2 text-slate-600 group-hover:text-emerald-600">
                        <Paperclip size={14} />
                        <span className="text-xs font-bold uppercase tracking-tight">Review Meeting Documentation</span>
                    </div>
                    <ArrowLeft size={14} className="rotate-180 text-slate-300 group-hover:text-emerald-400" />
                    </a>
                ) : (
                    <p className="text-xs text-slate-400 italic bg-slate-50/50 p-4 rounded-2xl border border-dashed">
                    No attachments provided for this session
                    </p>
                )}
                </div>
            </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
             <div className="bg-[#0B1324] rounded-[2.5rem] p-8 text-white shadow-xl">
                 <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-2">
                     <Users size={14} /> Participants
                 </h3>
                 <div className="space-y-4">
                     {data.meetingmember.map((mm) => (
                         <div key={mm.MeetingMemberID} className="flex items-center gap-3">
                             <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black border ${mm.IsPresent ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                 {mm.staff.StaffName.charAt(0)}
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-slate-100">{mm.staff.StaffName}</p>
                                 <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{mm.IsPresent ? "Attended" : "Invited"}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             {data.IsCancelled && (
                <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest">
                        <XCircle size={14} /> Cancellation Notice
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {data.CancellationReason || "Meeting has been cancelled by the facilitator."}
                    </p>
                </div>
             )}
        </div>
      </div>
    </div>
  );
}
