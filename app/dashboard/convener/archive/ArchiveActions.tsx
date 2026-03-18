"use client";

import React, { useState } from "react";
import { UserCheck, XCircle, X, CheckCircle, Eye, Edit, Download } from "lucide-react";
import Link from "next/link";
import { CancelMeetingAction } from "@/app/actions/meeting/CancelMeetingAction";

interface MeetingMember {
  StaffName: string;
  EmailAddress: string;
  IsPresent: boolean;
}

interface Props {
  meetingId: number;
  meetingDescription: string;
  meetingDate: string;
  isCancelled: boolean;
  members: MeetingMember[];
}

export default function ArchiveActionButtons({
  meetingId, meetingDescription, meetingDate, isCancelled, members
}: Props) {
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const result = await CancelMeetingAction(meetingId, cancelReason);
      if (result.success) {
        setCancelOpen(false);
        setCancelReason("");
        window.location.reload();
      } else {
        alert("Failed to cancel meeting");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setCancelling(false);
    }
  };

  const presentCount = members.filter(m => m.IsPresent).length;

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {/* View */}
        <Link href={`/dashboard/convener/meetings/${meetingId}`} title="View Details">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white relative group/icon">
            <Eye size={14} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[9px] font-black text-white px-2 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity uppercase pointer-events-none tracking-tighter whitespace-nowrap z-10">View</span>
          </div>
        </Link>

        {/* Edit */}
        <Link href={`/dashboard/convener/meetings/edit/${meetingId}`} title="Edit Meeting">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white relative group/icon">
            <Edit size={14} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[9px] font-black text-white px-2 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity uppercase pointer-events-none tracking-tighter whitespace-nowrap z-10">Edit</span>
          </div>
        </Link>

        {/* Attendance */}
        <button 
          onClick={() => setAttendanceOpen(true)} 
          title="View Attendance"
          className="h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white relative group/icon border-none"
        >
          <UserCheck size={14} />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[9px] font-black text-white px-2 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity uppercase pointer-events-none tracking-tighter whitespace-nowrap z-10">Attendance</span>
        </button>

        {/* Cancel */}
        {!isCancelled && (
          <button 
            onClick={() => setCancelOpen(true)} 
            title="Cancel Meeting"
            className="h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white relative group/icon border-none"
          >
            <XCircle size={14} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[9px] font-black text-white px-2 py-1 rounded-md opacity-0 group-hover/icon:opacity-100 transition-opacity uppercase pointer-events-none tracking-tighter whitespace-nowrap z-10">Cancel</span>
          </button>
        )}
      </div>

      {/* Attendance Modal */}
      {attendanceOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setAttendanceOpen(false)}>
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Attendance Register</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {meetingDescription || "Meeting"} — {new Date(meetingDate).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setAttendanceOpen(false)} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[55vh]">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/10 sticky top-0 bg-white">
                    <th className="px-8 py-4">#</th>
                    <th className="px-6 py-4">Staff Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-8 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {members.map((mm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 text-xs font-bold text-slate-400">{(idx + 1).toString().padStart(2, '0')}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{mm.StaffName}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{mm.EmailAddress || "—"}</td>
                      <td className="px-8 py-4 text-center">
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
                    </tr>
                  ))}
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold text-sm italic">
                        No members assigned to this meeting.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {presentCount} / {members.length} Present
              </span>
              <button onClick={() => setAttendanceOpen(false)} className="px-6 py-2.5 bg-[#0B1324] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all border-none cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setCancelOpen(false); setCancelReason(""); }}>
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-slate-50">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <XCircle size={20} className="text-rose-500" /> Cancel Meeting
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                This will mark &quot;{meetingDescription || "this meeting"}&quot; as cancelled.
              </p>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cancellation Reason</label>
                <textarea
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="Provide a reason for cancellation..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none resize-none h-24"
                />
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-50 flex items-center justify-end gap-3">
              <button onClick={() => { setCancelOpen(false); setCancelReason(""); }} className="px-6 py-3 bg-slate-50 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border-none cursor-pointer">
                Back
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-6 py-3 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
