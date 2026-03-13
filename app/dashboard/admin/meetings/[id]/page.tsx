import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import { Calendar, Tag, FileText, Info, Clock, ArrowLeft, CheckCircle, XCircle, Paperclip, Download } from "lucide-react";
import ExportExcelButton from "@/app/ui/ExportExcelButton";

async function GetById({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;

  const data = await prisma.meetings.findFirst({
    where: { MeetingID: Number(id) },
    include: {
      meetingtype: true,
    },
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Error</p>
          <p className="text-slate-600 text-lg font-semibold">Meeting not found</p>
          <Link href="/dashboard/admin/meetings" className="text-blue-600 text-sm font-bold mt-4 inline-block hover:underline">Return to list</Link>
        </div>
      </div>
    );
  }

  const minutesColumns = [
    { header: "Meeting ID", key: "MeetingID" },
    { header: "Title", key: "MeetingDescription" },
    { header: "Type", key: "meetingtype.MeetingTypeName" },
    { header: "Date", key: "formattedDate" },
    { header: "Location", key: "Location" },
    { header: "Agenda", key: "Agenda" },
    { header: "Discussion", key: "Discussion" },
    { header: "Conclusions", key: "Conclusions" },
    { header: "Status", key: "Status" },
  ];

  const exportData = [{
    ...data,
    formattedDate: new Date(data.MeetingDate).toLocaleDateString()
  }];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">

        {/* Header Section */}
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${data.IsCancelled ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"}`}>
              {data.IsCancelled ? <XCircle size={18} strokeWidth={2.5} /> : <Info size={18} strokeWidth={2.5} />}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">Meeting Details</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Record #{data.MeetingID}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${data.IsCancelled
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}>
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {data.IsCancelled ? "Cancelled" : "Active"}
              </span>
            </div>
            <ExportExcelButton
              data={exportData}
              columns={minutesColumns}
              fileName={`Meeting_Minutes_${data.MeetingID}`}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-1 ml-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} className="text-blue-500" /> Date
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {new Date(data.MeetingDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </p>
            </div>
            {/* Type */}
            <div className="space-y-1 ml-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} className="text-blue-500" /> Type
              </p>
              <p className="text-sm font-semibold text-slate-700">{data.meetingtype?.MeetingTypeName ?? "—"}</p>
            </div>
          </div>

          {/* Description Box */}
          <div className="space-y-1.5 ml-1 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={12} className="text-blue-500" /> Description
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {data.MeetingDescription}
            </p>
          </div>

          {/* Document Attachment */}
          <div className="space-y-1.5 ml-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference Document</p>
            {data.DocumentPath ? (
              <a
                href={data.DocumentPath.startsWith('http') ? data.DocumentPath : `/uploads/meeting_docs/${data.DocumentPath.split(/[\\/]/).pop()}`}
                target="_blank"
                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
              >
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-blue-600">
                  <Paperclip size={14} />
                  <span className="text-xs font-bold uppercase tracking-tight">View Attachment</span>
                </div>
                <ArrowLeft size={14} className="rotate-180 text-slate-300 group-hover:text-blue-400" />
              </a>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-50/50 p-3 rounded-xl border border-dashed">No document attached</p>
            )}
          </div>

          {/* Cancellation Info (Only if cancelled) */}
          {data.IsCancelled && (
            <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl space-y-2">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Cancellation Details</p>
              <p className="text-xs text-red-700 font-medium leading-relaxed">
                <span className="opacity-70">Reason:</span> {data.CancellationReason || "No reason specified"}
              </p>
              <p className="text-[10px] text-red-400 font-semibold italic">
                {data.CancellationDateTime ? new Date(data.CancellationDateTime).toLocaleString() : ""}
              </p>
            </div>
          )}

          {/* Audit Timestamps */}
          <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
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

          {/* Action Footer - Return-Style Button */}
          <div className="pt-4">
            <Link
              href="/dashboard/admin/meetings"
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-[10px] px-4 py-[0.7rem] text-[0.82rem] font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97] no-underline"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <ArrowLeft size={15} strokeWidth={2.5} className="text-slate-400" />
              Back to Meetings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetById;