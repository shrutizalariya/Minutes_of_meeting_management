"use client"

import React, { useState } from "react";
import { 
  LayoutDashboard, FileText, Users, Settings, 
  Bell, Search, ChevronRight, LogOut, Command,
  ClipboardCheck, Layers
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/app/ui/LogoutButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex text-slate-900 selection:bg-blue-100">
      {/* Sidebar - Fixed */}
      <aside className="w-64 bg-[#0B1324] flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold tracking-tight text-xl uppercase">Minute<span className="text-blue-500">Core</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">

          <Link href="/dashboard/admin">
            <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" active />
          </Link>

          <Link href="/meetingtype">
            <SidebarLink icon={<Layers size={18} />} label="Meeting Types" />
          </Link>

          <Link href="/meetings">
            <SidebarLink icon={<FileText size={18} />} label="Meetings" />
          </Link>

          <Link href="/meetingmember">
            <SidebarLink icon={<ClipboardCheck size={18} />} label="Meeting Members" />
          </Link>

          <Link href="/staff">
            <SidebarLink icon={<Users size={18} />} label="Staff Directory" />
          </Link>

          <Link href="/settings">
            <SidebarLink icon={<Settings size={18} />} label="Settings" />
          </Link>

        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">AD</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Admin User</p>
              <p className="text-[10px] text-slate-400 uppercase">System Admin</p>
            </div>
          </div>
          <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-medium w-full px-4">
            <LogOut size={18} /> <LogoutButton/>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="relative w-96 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="Search meetings or staff..."
            />

          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
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
    <button className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
      <div className="flex items-center gap-3 font-semibold text-sm">
        {icon}
        {label}
      </div>
      {active && <ChevronRight size={14} className="opacity-60" />}
    </button>
  );
}