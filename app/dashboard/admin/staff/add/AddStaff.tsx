"use client";

import { AddStaffAction } from "@/app/actions/staff/AddStaffAction";
import React from "react";
import Link from "next/link";
import { User, Phone, Mail, Shield, ArrowLeft, Plus, FileText } from "lucide-react";

export default function AddStaff({ users = [] }: any) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden" style={{ fontFamily: "'Sora', sans-serif" }}>

        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Add Staff Member</h1>
          </div>
        </div>

        <form action={AddStaffAction} className="p-6 space-y-5">
          <div className="space-y-5">
            {/* Staff Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <User size={12} className="text-blue-500" /> Staff Name
              </label>
              <input
                type="text"
                name="StaffName"
                required
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700"
              />
            </div>

            {/* Mobile */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Phone size={12} className="text-blue-500" /> Contact Number
              </label>
              <div className="flex gap-2">
                <select
                  name="CountryCode"
                  required
                  className="w-24 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700 cursor-pointer appearance-none"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  type="tel"
                  name="MobileNo"
                  required
                  placeholder="10-digit number"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} className="text-blue-500" /> Email Address
              </label>
              <input
                type="email"
                name="EmailAddress"
                required
                placeholder="email@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700"
              />
            </div>

            {/* User Linked */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Shield size={12} className="text-blue-500" /> Link User Account
              </label>
              <select
                name="UserID"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700 cursor-pointer appearance-none"
              >
                <option value="">-- Select User --</option>
                {users.map((u: any) => (
                  <option key={u.Id} value={u.Id}>
                    {u.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText size={12} className="text-blue-500" /> Remarks
              </label>
              <input
                type="text"
                name="Remarks"
                placeholder="Any additional notes..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-sm text-slate-700"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4 w-full">
            <Link
              href="/dashboard/admin/staff"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-[10px] px-4 py-[0.65rem] text-[0.82rem] font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.97] no-underline"
            >
              <ArrowLeft size={15} strokeWidth={2.5} className="text-slate-400" />
              Cancel
            </Link>

            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] text-white border-none rounded-[10px] px-[1.3rem] py-[0.65rem] text-[0.82rem] font-semibold transition-all duration-200 cursor-pointer shadow-[0_4px_12px_rgba(29,78,216,0.35)] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(29,78,216,0.4)] active:scale-[0.97]"
            >
              <Plus size={16} strokeWidth={2.5} />
              Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
