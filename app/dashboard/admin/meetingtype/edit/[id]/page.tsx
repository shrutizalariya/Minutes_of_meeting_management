import { prisma } from '@/lib/prisma'
import React from 'react'
import Link from 'next/link';
import { EditMeetingTypeAction } from '@/app/actions/EditMeetingTypeAction';
import { Tag, FileText, ArrowLeft, Save } from "lucide-react";

async function EditMeetingType({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    const data = await prisma.meetingtype.findFirst({
        where: { MeetingTypeID: Number(id) }
    })

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl font-semibold text-gray-500">Meeting type not found</p>
            </div>
        );
    }

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
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Edit Meeting Type</h1>
                    </div>
                </div>

                <form action={EditMeetingTypeAction} className="p-6 space-y-5">
                    <input type="hidden" name="MeetingTypeID" value={data.MeetingTypeID} />

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Tag size={12} className="text-blue-500" /> Meeting Type Name
                            </label>
                            <input
                                type="text"
                                name="MeetingTypeName"
                                defaultValue={data.MeetingTypeName}
                                required
                                placeholder="e.g. Weekly Sync"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FileText size={12} className="text-blue-500" /> Remarks
                            </label>
                            <input
                                type="text"
                                name="Remarks"
                                defaultValue={data.Remarks ?? ""}
                                placeholder="Optional notes..."
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-4 w-full">
                        <Link
                            href="/dashboard/admin/meetingtype"
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
                            Update Type
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMeetingType;
