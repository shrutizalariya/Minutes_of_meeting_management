import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import React from 'react';
import { User, Phone, Mail, FileText, ArrowLeft, Edit, Clock } from 'lucide-react';

async function GetById({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const data = await prisma.staff.findFirst({
    where: { StaffID: Number(id) }
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-[Sora]">
        <div className="text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Error</p>
          <p className="text-slate-600 text-lg font-semibold">Staff member not found</p>
          <Link href="/dashboard/admin/staff" className="text-blue-600 text-sm font-bold mt-4 inline-block hover:underline">Return to list</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden" style={{ fontFamily: "'Sora', sans-serif" }}>

        {/* Header Section */}
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <User size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">Staff Details</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Member ID: {data.StaffID}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-5">
            {/* User Info Card */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-blue-500">
                <User size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                <p className="text-base font-bold text-slate-700">{data.StaffName}</p>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 ml-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={12} className="text-blue-500" /> Phone
                </p>
                <p className="text-sm font-semibold text-slate-700">{data.MobileNo || "Not provided"}</p>
              </div>
              <div className="space-y-1.5 ml-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={12} className="text-blue-500" /> Email
                </p>
                <p className="text-sm font-semibold text-slate-700 truncate">{data.EmailAddress || "Not provided"}</p>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="space-y-1.5 ml-1 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={12} className="text-blue-500" /> Internal Remarks
              </p>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {data.Remarks || "No additional remarks provided."}
              </p>
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t border-slate-50">
              <div className="flex items-center gap-1.5 opacity-60">
                <Clock size={12} className="text-slate-400" />
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Employee Record Since {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4 w-full">
            <Link
              href="/dashboard/admin/staff"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-[12px] px-4 py-[0.7rem] text-[0.82rem] font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97] no-underline"
            >
              <ArrowLeft size={15} strokeWidth={2.5} className="text-slate-400" />
              Return
            </Link>

            <Link
              href={`/dashboard/admin/staff/edit/${data.StaffID}`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white border-none rounded-[12px] px-4 py-[0.7rem] text-[0.82rem] font-semibold transition-all duration-200 shadow-[0_4px_12px_rgba(29,78,216,0.3)] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] active:scale-[0.97] no-underline tracking-tight"
            >
              <Edit size={15} strokeWidth={2.5} />
              Edit Staff
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetById;