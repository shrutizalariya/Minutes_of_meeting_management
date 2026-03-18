"use client";

import React, { useState, useEffect } from "react";
import { 
  FileEdit, Calendar, CheckSquare, Users, 
  Settings, Bell, Search, LogOut, ChevronRight, LayoutDashboard,
  Mic2, BookOpen
} from "lucide-react";

export default function ConvenerLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/dashboard/convener");
        const json = await res.json();
        setProfile(json.userProfile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
    fetchProfile();
  }, []);

  const userName = profile?.name || "Convener";
  const userInitials = profile?.initials || "C";
  const userRole = profile?.role || "Meeting Facilitator";

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex text-slate-900 selection:bg-indigo-100 antialiased">
      {/* Power Sidebar (Dark Mode) */}
      <aside className="w-64 bg-[#0B1324] flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
              <Mic2 size={20} strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold tracking-tight text-xl uppercase">Minute<span className="text-indigo-500 font-black">Edit</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Deliberation Hub" active />
          <SidebarLink icon={<Calendar size={18} />} label="Schedule Manager" />
          <SidebarLink icon={<BookOpen size={18} />} label="Minutes Archive" />
          <SidebarLink icon={<CheckSquare size={18} />} label="Action Tracking" />
          <SidebarLink icon={<Users size={18} />} label="Staff Quorum" />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">{userInitials}</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium italic leading-none">{userRole}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-medium w-full px-4"
          >
            <LogOut size={18} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* Workspace */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Active Facilitation Mode
            </span>
          </div>

          <div className="flex items-center gap-5">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{userName}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase">Dept: Operations</p>
              </div>
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-indigo-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <main className="p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
      <div className="flex items-center gap-3 font-semibold text-sm">
        {icon}
        {label}
      </div>
      {active && <ChevronRight size={14} className="opacity-60" />}
    </button>
  );
}