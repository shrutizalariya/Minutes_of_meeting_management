import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import { EditMeetingMemberAction } from "@/app/actions/meetingmember/EditMeetingMemberAction";
import { Users, Calendar, FileText, CheckCircle2, ArrowLeft, Save } from "lucide-react";
import ConfirmationForm from "@/app/components/ConfirmationForm";

async function EditMeetingMember({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const meetingMember = await prisma.meetingmember.findFirst({
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

  if (!meetingMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-[Sora]">
        <p className="text-gray-600 text-lg font-semibold">Member record not found</p>
      </div>
    );
  }

  const staffList = await prisma.staff.findMany({
    orderBy: { StaffName: "asc" },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden" style={{ fontFamily: "'Sora', sans-serif" }}>

        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg text-green-700">
              <Save size={18} strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Edit Member Record</h1>
          </div>
        </div>

        <ConfirmationForm 
          action={EditMeetingMemberAction} 
          message="Are you sure you want to update this member record?"
          className="p-6 space-y-5"
        >
          <input type="hidden" name="MeetingMemberID" value={meetingMember.MeetingMemberID} />

          <div className="space-y-5">
            {/* Meeting (Read-only Info) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} className="text-blue-500" /> Linked Meeting
              </label>
              <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium">
                {new Date(meetingMember.meetings.MeetingDate).toLocaleDateString()} – {meetingMember.meetings.meetingtype.MeetingTypeName}
              </div>
            </div>

            {/* Staff Member Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Users size={12} className="text-blue-500" /> Staff Member
              </label>
              <select
                name="StaffID"
                defaultValue={meetingMember.StaffID}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700 cursor-pointer appearance-none"
              >
                {staffList.map((s) => (
                  <option key={s.StaffID} value={s.StaffID}>
                    {s.StaffName}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Toggle */}
            <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="IsPresent"
                  id="IsPresent"
                  defaultChecked={meetingMember.IsPresent ?? false}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white checked:border-blue-600 checked:bg-blue-600 transition-all"
                />
                <CheckCircle2 size={12} className="absolute left-1 top-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <label htmlFor="IsPresent" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                Mark as Present
              </label>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText size={12} className="text-blue-500" /> Member Remarks
              </label>
              <textarea
                name="Remarks"
                rows={3}
                defaultValue={meetingMember.Remarks ?? ""}
                placeholder="Participant notes, follow-ups..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4 w-full">
            <Link
              href="/dashboard/admin/meetingmember"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-[10px] px-4 py-[0.65rem] text-[0.82rem] font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97] no-underline"
            >
              <ArrowLeft size={15} strokeWidth={2.5} className="text-slate-400" />
              Cancel
            </Link>

            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#166534] to-[#15803d] text-white border-none rounded-[10px] px-[1.3rem] py-[0.65rem] text-[0.82rem] font-semibold transition-all duration-200 cursor-pointer shadow-[0_4px_12px_rgba(21,128,61,0.35)] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(21,128,61,0.4)] active:scale-[0.97]"
            >
              <Save size={16} strokeWidth={2.5} />
              Update Record
            </button>
          </div>
        </ConfirmationForm>
      </div>
    </div>
  );
}

export default EditMeetingMember;
