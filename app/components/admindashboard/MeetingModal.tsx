"use client";

import { X, Calendar, MapPin, Clock, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

export type Meeting = {
  MeetingID: number;
  MeetingDate: Date;
  MeetingDescription: string | null;
  Status: string;
  Location?: string | null;
};

export default function Modal({
  meeting,
  isNew = false,
  date,
  onClose,
}: {
  meeting?: Meeting;
  isNew?: boolean;
  date?: string;
  onClose: () => void;
}) {
  const fmtDate = (d: any) => {
    if (!d) return "Pending";
    return new Date(d).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fmtTime = (d: any) => {
    if (!d) return "00:00";
    return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 transition-all animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[2.5rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.2)] max-w-lg w-full overflow-hidden border border-white/20 transform animate-in zoom-in-95 duration-300"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {/* Header Ribbon */}
        <div className={`h-2 ${isNew ? 'bg-blue-500' : 'bg-emerald-500'}`} />

        <div className="p-8 sm:p-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 h-10 w-10 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all hover:bg-slate-100 active:scale-90 border border-slate-100"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-6 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em]">
            <Calendar size={14} strokeWidth={3} /> {isNew ? 'Scheduling' : 'Meeting Details'}
          </div>

          {isNew ? (
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4">Schedule a New Meeting</h2>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                You selected <span className="text-blue-600 font-bold">{date}</span>. Continue to the scheduling page to add participants and documents.
              </p>

              <Link
                href={`/dashboard/admin/meetings/add?date=${date}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-[0.98]"
              >
                <Plus size={18} /> Schedule for {date}
              </Link>
            </div>
          ) : meeting && (
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                {meeting.MeetingDescription || "Untitled Corporate Meeting"}
              </h2>

              <div className="flex items-center gap-2 mb-8 mt-1">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${meeting.Status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                  {meeting.Status}
                </span>
              </div>

              <div className="space-y-4 mb-10">
                <DetailRow icon={<Clock className="text-blue-500" size={16} />} label="Date & Time" value={`${fmtDate(meeting.MeetingDate)} at ${fmtTime(meeting.MeetingDate)}`} />
                <DetailRow icon={<MapPin className="text-rose-500" size={16} />} label="Venue Location" value={meeting.Location || "Main Conference Hall"} />
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/dashboard/admin/meetings/${meeting.MeetingID}`}
                  className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-4 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-[0.98] uppercase tracking-widest"
                >
                  <ExternalLink size={16} /> View Full
                </Link>
                <Link
                  href={`/dashboard/admin/meetings/edit/${meeting.MeetingID}`}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold py-4 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98] uppercase tracking-widest"
                >
                  Edit Entry
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}