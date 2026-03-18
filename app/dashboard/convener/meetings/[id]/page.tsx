import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import {
  Calendar, Tag, FileText, Info, Clock, ArrowLeft,
  CheckCircle, XCircle, Paperclip, MapPin, Users
} from "lucide-react";
import ExportExcelButton from "@/app/ui/ExportExcelButton";

export default async function ConvenerMeetingViewPage({
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
          <Link href="/dashboard/convener/meetings" className="text-blue-600 text-sm font-bold mt-4 inline-block hover:underline">
            Return to meetings
          </Link>
        </div>
      </div>
    );
  }

  const presentCount = data.meetingmember.filter(m => m.IsPresent).length;
  const totalMembers = data.meetingmember.length;
  const presenceRate = totalMembers > 0 ? Math.round((presentCount / totalMembers) * 100) : 0;

  const exportColumns = [
    { header: "Meeting ID", key: "MeetingID" },
    { header: "Title", key: "MeetingDescription" },
    { header: "Type", key: "typeName" },
    { header: "Date", key: "formattedDate" },
    { header: "Location", key: "Location" },
    { header: "Status", key: "Status" },
    { header: "Total Members", key: "totalMembers" },
    { header: "Present", key: "presentCount" },
    { header: "Presence Rate", key: "presenceRate" },
  ];

  const exportData = [{
    ...data,
    typeName: data.meetingtype?.MeetingTypeName || "General",
    formattedDate: new Date(data.MeetingDate).toLocaleDateString(),
    totalMembers,
    presentCount,
    presenceRate: `${presenceRate}%`,
  }];

  return (
    <div className="space-y-8" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/convener/meetings" className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 no-underline hover:text-blue-700 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Meetings
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Meeting Details</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Record #{data.MeetingID}</p>
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
          <ExportExcelButton
            data={exportData}
            columns={exportColumns}
            fileName={`Meeting_${data.MeetingID}`}
          />
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} className="text-blue-500" /> Date & Time
            </p>
            <p className="text-sm font-bold text-slate-700">
              {new Date(data.MeetingDate).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Tag size={12} className="text-blue-500" /> Type
            </p>
            <p className="text-sm font-bold text-slate-700">{data.meetingtype?.MeetingTypeName ?? "General"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={12} className="text-blue-500" /> Location
            </p>
            <p className="text-sm font-bold text-slate-700">{data.Location || "Not specified"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Users size={12} className="text-blue-500" /> Quorum
            </p>
            <p className="text-sm font-bold text-slate-700">{presentCount} / {totalMembers} ({presenceRate}%)</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FileText size={12} className="text-blue-500" /> Description
          </p>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {data.MeetingDescription || "No description provided"}
          </p>
        </div>

        {/* Document */}
        <div className="mt-8 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Document</p>
          {data.DocumentPath ? (
            <a
              href={data.DocumentPath.startsWith("http") ? data.DocumentPath : `/uploads/meeting_docs/${data.DocumentPath.split(/[\\/]/).pop()}`}
              target="_blank"
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group no-underline"
            >
              <div className="flex items-center gap-2 text-slate-600 group-hover:text-blue-600">
                <Paperclip size={14} />
                <span className="text-xs font-bold uppercase tracking-tight">View / Download Document</span>
              </div>
              <ArrowLeft size={14} className="rotate-180 text-slate-300 group-hover:text-blue-400" />
            </a>
          ) : (
            <p className="text-xs text-slate-400 italic bg-slate-50/50 p-4 rounded-2xl border border-dashed">
              No document attached
            </p>
          )}
        </div>

        {/* Cancellation Info */}
        {data.IsCancelled && (
          <div className="mt-8 p-6 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-2">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Cancellation Details</p>
            <p className="text-xs text-rose-700 font-medium leading-relaxed">
              <span className="opacity-70">Reason:</span> {data.CancellationReason || "No reason specified"}
            </p>
            <p className="text-[10px] text-rose-400 font-semibold italic">
              {data.CancellationDateTime ? new Date(data.CancellationDateTime).toLocaleString() : ""}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
              <Clock size={10} /> Created
            </p>
            <p className="text-[11px] font-medium text-slate-500 italic">
              {data.Created ? new Date(data.Created).toLocaleString() : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
              <Clock size={10} /> Modified
            </p>
            <p className="text-[11px] font-medium text-slate-500 italic">
              {data.Modified ? new Date(data.Modified).toLocaleString() : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {data.meetingmember.length > 0 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Users size={16} className="text-blue-600" /> Attendance Register
            </h3>
            <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 tracking-widest">
              {presentCount} / {totalMembers} Present
            </span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10">
                <th className="px-10 py-5">#</th>
                <th className="px-6 py-5">Staff Name</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-10 py-5 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.meetingmember.map((mm, idx) => (
                <tr key={mm.MeetingMemberID} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-5 text-xs font-bold text-slate-400">{(idx + 1).toString().padStart(2, "0")}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-800">{mm.staff.StaffName}</td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-medium">{mm.staff.EmailAddress || "—"}</td>
                  <td className="px-6 py-5 text-center">
                    {mm.IsPresent ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                        <CheckCircle size={10} strokeWidth={3} /> Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100">
                        <XCircle size={10} strokeWidth={3} /> Absent
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-5 text-right text-xs text-slate-400 italic">{mm.Remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
