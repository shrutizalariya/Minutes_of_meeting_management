import React from "react";
import { Settings, Shield, User, Bell, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-10" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <div>
        <Link href="/dashboard/convener" className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 no-underline hover:text-blue-700 transition-colors">
          <ArrowLeft size={14} strokeWidth={3} /> Dashboard
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Console Settings</h1>
        <p className="text-slate-500 text-sm mt-3 font-medium">Customize your facilitation workspace and security preferences.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10 max-w-2xl">
        <div className="space-y-8">
           <div className="flex items-start gap-6 group">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                 <User size={22} />
              </div>
              <div className="flex-1">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Facilitator Profile</h3>
                 <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Update your identity and display information.</p>
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Edit</button>
           </div>

           <div className="h-[1px] bg-slate-50"></div>

           <div className="flex items-start gap-6 group">
              <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                 <Bell size={22} />
              </div>
              <div className="flex-1">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Communication</h3>
                 <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Manage real-time alerts and session notifications.</p>
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Configure</button>
           </div>

           <div className="h-[1px] bg-slate-50"></div>

           <div className="flex items-start gap-6 group">
              <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                 <Shield size={22} />
              </div>
              <div className="flex-1">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Security Vault</h3>
                 <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Update authentication protocols and primary password.</p>
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Secure</button>
           </div>
        </div>

        <button className="w-full mt-12 py-4 bg-[#0B1324] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
           <Save size={16} strokeWidth={3} /> 
           Synchronize Preferences
        </button>
      </div>
    </div>
  );
}
