"use client";

import React, { useState } from "react";
import { UserPlus, X, Calendar, MapPin, Target, CheckCircle } from "lucide-react";
import { AddMeetingMemberAction } from "@/app/actions/meetingmember/AddMeetingMemberAction";

interface Meeting {
  MeetingID: number;
  MeetingDescription: string | null;
  MeetingDate: Date;
  Location: string | null;
  meetingtype: {
    MeetingTypeName: string;
  } | null;
}

interface Props {
  staffId: number;
  staffName: string;
  upcomingMeetings: Meeting[];
}

export default function InviteStaffButton({ staffId, staffName, upcomingMeetings }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="w-full mt-8 py-3.5 bg-slate-50 text-slate-400 group-hover:bg-[#0B1324] group-hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-none cursor-pointer"
      >
         Invite to Meeting
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Invite to Meeting</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select a session for {staffName}</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {upcomingMeetings.length === 0 ? (
                <div className="text-center py-10">
                  <Calendar size={40} className="mx-auto text-slate-100 mb-4" />
                  <p className="text-slate-400 font-bold text-sm italic">No upcoming meetings found.</p>
                </div>
              ) : (
                upcomingMeetings.map((m) => (
                  <form key={m.MeetingID} action={AddMeetingMemberAction}>
                    <input type="hidden" name="MeetingID" value={m.MeetingID} />
                    <input type="hidden" name="StaffID" value={staffId} />
                    <input type="hidden" name="redirectTo" value="/dashboard/convener/staff" />
                    
                    <button 
                      type="submit"
                      className="w-full text-left p-6 bg-slate-50 rounded-[2rem] border border-transparent hover:border-blue-200 hover:bg-blue-50/30 transition-all group/item cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                         <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-50">
                           {m.meetingtype?.MeetingTypeName || "General"}
                         </span>
                         <span className="text-[10px] font-black text-slate-300 uppercase italic">#{m.MeetingID}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 group-hover/item:text-blue-600 transition-colors line-clamp-1 mb-3">
                        {m.MeetingDescription || "Untitled Meeting"}
                      </h4>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500/50" /> {new Date(m.MeetingDate).toLocaleDateString()}</div>
                        <div className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-500/50" /> {m.Location || "TBD"}</div>
                      </div>
                    </button>
                  </form>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-10 py-6 border-t border-slate-50 bg-slate-50/30">
               <button 
                 onClick={() => setOpen(false)}
                 className="w-full py-4 bg-white text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all border border-slate-100 cursor-pointer"
               >
                 Cancel Operation
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
