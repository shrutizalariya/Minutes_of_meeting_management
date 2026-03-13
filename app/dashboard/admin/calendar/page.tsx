import React from "react";
import MeetingCalendar from "@/app/components/admindashboard/MeetingCalendar";
import { getMeetingsForCalendar } from "@/lib/admin/meetingCalendar";
import { Activity } from "lucide-react";

export default async function CalendarPage() {
  const meetings = await getMeetingsForCalendar();
  return (
    <div className="space-y-8" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
            <Activity size={14} strokeWidth={3} /> Schedule Viewer
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Meeting Calendar</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Visualized schedule of all past and upcoming corporate meetings.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] p-4 sm:p-8">
        <MeetingCalendar meetings={meetings} />
      </div>
    </div>
  );
}