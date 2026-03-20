"use client";

import React, { useState } from "react";
import { User, Bell, Shield, Save, Loader2, CheckCircle2, Lock, ArrowLeft, Settings } from "lucide-react";
import { useToast } from "@/app/ui/Toast";
import { updateProfile } from "@/app/actions/user/UpdateProfile";
import { updateSecurity } from "@/app/actions/user/UpdateSecurity";
import Link from "next/link";

interface Props {
  user: {
    Id: number;
    Name: string | null;
    Email: string | null;
    EmailNotifications: boolean;
    DesktopAlerts: boolean;
  };
}

export default function ConvenerSettingsForm({ user }: Props) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to update your profile settings?")) return;

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("id", user.Id.toString());

    const result = await updateProfile(formData);
    if (result.success) {
      showToast("Profile updated successfully!", "success");
    } else {
      showToast(result.error || "Failed to update profile.", "error");
    }
    setLoading(false);
  };

  const handleSecuritySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to update your password?")) return;

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("id", user.Id.toString());

    const result = await updateSecurity(formData);
    if (result.success) {
      showToast("Password updated successfully!", "success");
      (e.target as HTMLFormElement).reset();
    } else {
      showToast(result.error || "Failed to update security settings.", "error");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/convener" className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 no-underline hover:text-indigo-700 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Console Settings</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium">Customize your facilitation workspace and security preferences.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm self-start">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${activeTab === "profile" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${activeTab === "security" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            Security
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side: Illustration or Info */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <Settings size={40} className="mb-6 opacity-80" strokeWidth={2.5} />
              <h3 className="text-xl font-black mb-4 tracking-tight">Facilitator Privileges</h3>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed opacity-90">
                You are currently managing the Minutes of Meeting system. Keep your profile updated to ensure correct attribution in all official records.
              </p>
              <div className="mt-8 pt-8 border-t border-white/10">
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Session Secure</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Forms */}
        <div className="lg:col-span-2">
          {activeTab === "profile" ? (
             <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <User size={18} className="text-indigo-600" />
                    Identity Management
                  </h3>
                </div>

                <form className="space-y-6" onSubmit={handleProfileSubmit}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                         <input 
                           name="name"
                           defaultValue={user.Name || ""}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                           placeholder="Enter your full name"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                         <input 
                           name="email"
                           defaultValue={user.Email || ""}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                           placeholder="email@example.com"
                         />
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-50">
                      <div className="flex items-center justify-between mb-6">
                         <div>
                            <p className="text-sm font-black text-slate-800">Email Notifications</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Receive quorum alerts and schedule updates</p>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input name="emailNotifications" type="checkbox" defaultChecked={user.EmailNotifications} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                         </label>
                      </div>

                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-sm font-black text-slate-800">Desktop Alerts</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Real-time facilitation notifications</p>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input name="desktopAlerts" type="checkbox" defaultChecked={user.DesktopAlerts} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                         </label>
                      </div>
                   </div>

                   <button 
                     type="submit"
                     disabled={loading}
                     className="w-full mt-4 py-4 bg-[#0B1324] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                   >
                     {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                     {loading ? "Synchronizing..." : "Update Facilitator Profile"}
                   </button>
                </form>
             </div>
          ) : (
             <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Shield size={18} className="text-rose-500" />
                    Security Protocol
                  </h3>
                </div>

                <form className="space-y-6" onSubmit={handleSecuritySubmit}>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Current Password</label>
                      <input 
                        name="currentPassword"
                        type="password"
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                        placeholder="••••••••"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Password</label>
                         <input 
                           name="newPassword"
                           type="password"
                           required
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                           placeholder="••••••••"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Verify New Password</label>
                         <input 
                           name="confirmPassword"
                           type="password"
                           required
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                           placeholder="••••••••"
                         />
                      </div>
                   </div>

                   <button 
                     type="submit"
                     disabled={loading}
                     className="w-full mt-4 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-900/10 active:scale-[0.98]"
                   >
                     {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                     {loading ? "Encrypting..." : "Forge New Password"}
                   </button>
                </form>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
