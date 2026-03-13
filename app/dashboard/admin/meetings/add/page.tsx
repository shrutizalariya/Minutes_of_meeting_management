import { AddMeetingAction } from "@/app/actions/AddMeetingAction";
import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Tag, FileText, ArrowLeft, Plus } from "lucide-react"; 

export default async function AddMeeting() {
  const m = await prisma.meetingtype.findMany({
    select: { MeetingTypeID: true, MeetingTypeName: true },
  });

  return (
    // Solid Dashboard Background
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      
      {/* 1. Decreased Form Size: max-w-lg (approx 512px) for a tighter look */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
        
        {/* Header Section - More compact padding */}
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Add New Meeting</h1>
          </div>
        </div>

        {/* Form Body - Reduced padding to p-6 */}
        <form action={AddMeetingAction} className="p-6 space-y-5">
          
          {/* Stacked Layout for better spacing in smaller width */}
          <div className="space-y-5">
            {/* Meeting Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} className="text-blue-500" /> Date & Time
              </label>
              <input
                type="datetime-local"
                name="MeetingDate"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700"
              />
            </div>

            {/* Meeting Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Tag size={12} className="text-blue-500" /> Classification
              </label>
              <select
                name="MeetingTypeID"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700 cursor-pointer appearance-none"
              >
                <option value="">Select Type</option>
                {m.map((type) => (
                  <option key={type.MeetingTypeID} value={type.MeetingTypeID}>
                    {type.MeetingTypeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText size={12} className="text-blue-500" /> Description
              </label>
              <input
                type="text"
                name="MeetingDescription"
                required
                placeholder="Meeting agenda..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700"
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Attachment</label>
               <div className="px-3.5 py-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all">
                <input
                  type="file"
                  name="DocumentPath"
                  accept=".pdf,.doc,.docx"
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Footer - Balanced & Equal Size */}
          <div className="pt-4 flex items-center justify-between gap-4 w-full">
           <Link 
    href="/dashboard/admin/meetings" 
    className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-[10px] px-4 py-[0.65rem] text-[0.82rem] font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97] no-underline"
    style={{ fontFamily: "'Sora', sans-serif" }}
  >
    <ArrowLeft size={15} strokeWidth={2.5} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
    Cancel
  </Link>

            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white border-none rounded-[10px] px-[1.3rem] py-[0.65rem] text-[0.82rem] font-semibold transition-all duration-200 cursor-pointer no-underline shadow-[0_4px_12px_rgba(29,78,216,0.35)] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(29,78,216,0.4)] active:scale-[0.97] tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}