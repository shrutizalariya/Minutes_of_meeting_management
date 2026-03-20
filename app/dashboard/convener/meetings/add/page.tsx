import { AddMeetingAction } from "@/app/actions/AddMeetingAction";
import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Tag, FileText, ArrowLeft, Plus, Target, Mic2 } from "lucide-react"; 
import ConfirmationForm from "@/app/components/ConfirmationForm";

export default async function AddMeeting() {
  const m = await prisma.meetingtype.findMany({
    select: { MeetingTypeID: true, MeetingTypeName: true },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
              <Plus size={22} strokeWidth={3} />
            </div>
            <div>
               <h1 className="text-xl font-black text-slate-900 tracking-tight">Initiate Facilitation</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">New Meeting Record</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <ConfirmationForm 
          action={AddMeetingAction} 
          message="Are you sure you want to schedule this new meeting?"
          className="p-10 space-y-8"
        >
          <input type="hidden" name="redirectTo" value="/dashboard/convener/meetings" />
          
          <div className="space-y-6">
            {/* Meeting Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} className="text-blue-500" /> Session Schedule
              </label>
              <input
                type="datetime-local"
                name="MeetingDate"
                required
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-bold text-slate-700"
              />
            </div>

            {/* Meeting Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Tag size={12} className="text-blue-500" /> Facilitation Type
              </label>
              <div className="relative">
                <select
                  name="MeetingTypeID"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-black text-slate-700 cursor-pointer appearance-none"
                >
                  <option value="">Select Category</option>
                  {m.map((type) => (
                    <option key={type.MeetingTypeID} value={type.MeetingTypeID}>
                      {type.MeetingTypeName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <Target size={16} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mic2 size={12} className="text-blue-500" /> Agenda Topic
              </label>
              <input
                type="text"
                name="MeetingDescription"
                required
                placeholder="High-level meeting summary..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm font-bold text-slate-700"
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Archive Initial Document</label>
               <div className="px-5 py-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all group">
                <input
                  type="file"
                  name="DocumentPath"
                  accept=".pdf,.doc,.docx"
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer file:uppercase file:tracking-widest"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 flex items-center justify-between gap-4">
            <Link 
              href="/dashboard/convener/meetings" 
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all no-underline"
            >
              <ArrowLeft size={16} strokeWidth={3} />
              Discard
            </Link>

            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0B1324] text-white border-none rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:bg-slate-800 hover:-translate-y-1 active:scale-95"
            >
              <Plus size={18} strokeWidth={3} />
              Save Record
            </button>
          </div>
        </ConfirmationForm>
      </div>
    </div>
  );
}
