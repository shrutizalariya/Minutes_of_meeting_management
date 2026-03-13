import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import { Calendar, Tag, User, Info, Clock, ArrowLeft, ShieldCheck, ShieldAlert } from "lucide-react";

async function GetById({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const data = await prisma.meetingmember.findFirst({
    where: {
      MeetingMemberID: Number(id),
    },
    include: {
      staff: true,
      meetings: {
        include: {
          meetingtype: true,
        },
      },
    },
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Error</p>
          <p className="text-slate-600 text-lg font-semibold">Meeting Member not found</p>
          <Link href="/meetingmember" className="text-blue-600 text-sm font-bold mt-4 inline-block hover:underline">Return to list</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <User size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">Member Details</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {data.MeetingMemberID}</p>
            </div>
          </div>
          
          {data.IsPresent ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <ShieldCheck size={12} strokeWidth={3} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Present</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
              <ShieldAlert size={12} strokeWidth={3} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Absent</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 gap-5">
            {/* Staff Info */}
            <div className="flex items-start gap-4 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400">
                <User size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Staff Member</p>
                <p className="text-sm font-bold text-slate-700">{data.staff.StaffName}</p>
              </div>
            </div>

            {/* Meeting Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 ml-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} className="text-blue-500" /> Date
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {new Date(data.meetings.MeetingDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              </div>
              <div className="space-y-1.5 ml-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Tag size={12} className="text-blue-500" /> Category
                </p>
                <p className="text-sm font-semibold text-slate-700">{data.meetings.meetingtype.MeetingTypeName}</p>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5 ml-1 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Info size={12} className="text-blue-500" /> Remarks
              </p>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {data.Remarks || "No additional remarks provided."}
              </p>
            </div>

            {/* Audit Timestamps */}
            <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={10} /> Created
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  {data.Created ? new Date(data.Created).toLocaleString() : "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={10} /> Modified
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  {data.Modified ? new Date(data.Modified).toLocaleString() : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer - High-End Button UI */}
<div className="pt-4 flex items-center justify-between gap-4 w-full">
  
  {/* Refined Back Button */}
  <Link 
    href="/meetingmember" 
    className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-[12px] px-4 py-[0.7rem] text-[0.82rem] font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97]"
    style={{ fontFamily: "'Sora', sans-serif" }}
  >
    <ArrowLeft size={15} strokeWidth={2.5} className="text-slate-400" />
    Return to List
  </Link>

  {/* Matching Primary Action (Edit) */}
  <Link
    href={`/meetingmember/edit/${data.MeetingMemberID}`}
    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white border-none rounded-[12px] px-4 py-[0.7rem] text-[0.82rem] font-semibold transition-all duration-200 shadow-[0_4px_12px_rgba(29,78,216,0.3)] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] active:scale-[0.97] tracking-tight"
    style={{ fontFamily: "'Sora', sans-serif" }}
  >
    <User size={15} strokeWidth={2.5} />
    Edit Member
  </Link>

</div>
        </div>
      </div>
    </div>
  );
}

export default GetById;