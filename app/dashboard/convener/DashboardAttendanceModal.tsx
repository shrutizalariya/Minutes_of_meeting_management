"use client";

import React, { useState, useEffect } from "react";
import { X, UserCheck, CheckCircle, XCircle, Loader2, Save, Info } from "lucide-react";
import { EditMeetingMemberAction } from "@/app/actions/meetingmember/EditMeetingMemberAction";

interface Member {
  MeetingMemberID: number;
  StaffID: number;
  StaffName: string;
  IsPresent: boolean;
  Remarks: string | null;
}

interface Props {
  meetingId: number;
  meetingTitle: string;
  onClose: () => void;
}

export default function DashboardAttendanceModal({ meetingId, meetingTitle, onClose }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(`/api/meeting/${meetingId}/members`);
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [meetingId]);

  const handleToggle = async (member: Member) => {
    setSaving(member.MeetingMemberID);
    const formData = new FormData();
    formData.append("MeetingMemberID", member.MeetingMemberID.toString());
    formData.append("StaffID", member.StaffID.toString());
    formData.append("MeetingID", meetingId.toString());
    formData.append("IsPresent", (!member.IsPresent ? "on" : "off"));
    formData.append("Remarks", member.Remarks || "");
    formData.append("redirectTo", "/dashboard/convener");

    try {
      await EditMeetingMemberAction(formData);
      setMembers(prev => prev.map(m => 
        m.MeetingMemberID === member.MeetingMemberID 
          ? { ...m, IsPresent: !m.IsPresent } 
          : m
      ));
    } catch (error) {
       console.error("Failed to update attendance:", error);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Rapid Attendance</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{meetingTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
               <Loader2 size={40} className="animate-spin mb-4" />
               <p className="text-xs font-bold uppercase tracking-widest">Loading quorum details...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.length === 0 ? (
                <div className="text-center py-10">
                   <Info size={40} className="mx-auto text-slate-100 mb-4" />
                   <p className="text-slate-400 font-bold text-sm italic">No members assigned to this meeting.</p>
                </div>
              ) : (
                members.map((m) => (
                  <div key={m.MeetingMemberID} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs ${m.IsPresent ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                          {m.StaffName[0]}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-800">{m.StaffName}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{m.IsPresent ? 'Present' : 'Absent'}</p>
                       </div>
                    </div>
                    
                    <button
                      onClick={() => handleToggle(m)}
                      disabled={saving === m.MeetingMemberID}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer
                        ${m.IsPresent 
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-600" 
                          : "bg-slate-200 text-slate-500 hover:bg-rose-500 hover:text-white"
                        }
                      `}
                    >
                      {saving === m.MeetingMemberID ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : m.IsPresent ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {m.IsPresent ? "Present" : "Mark Present"}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {members.filter(m => m.IsPresent).length} / {members.length} Present
           </div>
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-[#0B1324] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all border-none cursor-pointer shadow-lg"
           >
             Finish Marking
           </button>
        </div>
      </div>
    </div>
  );
}
