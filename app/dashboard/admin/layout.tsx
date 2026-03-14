"use client";

import React, { useState } from "react";
import {
  LayoutDashboard, FileText, Users, Settings,
  Bell, Search, ChevronRight, LogOut, Command,
  ClipboardCheck, Layers, CalendarDays, Activity, BarChart2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/app/ui/LogoutButton";
import NotificationBellWrapper from "@/app/components/admindashboard/NotificationBellWrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard/admin") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex text-slate-900 selection:bg-blue-100" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Sidebar - Fixed */}
      <aside className="w-64 bg-[#0B1324] flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold tracking-tight text-xl uppercase">Minute<span className="text-blue-500">Core</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <Link href="/dashboard/admin" className="no-underline">
            <SidebarLink icon={<LayoutDashboard size={18} />} label="Overview" active={isActive("/dashboard/admin")} />
          </Link>

          <Link href="/dashboard/admin/meetingtype" className="no-underline">
            <SidebarLink icon={<Layers size={18} />} label="Meeting Types" active={isActive("/dashboard/admin/meetingtype")} />
          </Link>

          <Link href="/dashboard/admin/meetings" className="no-underline">
            <SidebarLink icon={<FileText size={18} />} label="Meetings" active={isActive("/dashboard/admin/meetings")} />
          </Link>

          <Link href="/dashboard/admin/events" className="no-underline">
            <SidebarLink icon={<CalendarDays size={18} />} label="Events" active={isActive("/dashboard/admin/events")} />
          </Link>

          <Link href="/dashboard/admin/meetingmember" className="no-underline">
            <SidebarLink icon={<ClipboardCheck size={18} />} label="Meeting Members" active={isActive("/dashboard/admin/meetingmember")} />
          </Link>

          <Link href="/dashboard/admin/staff" className="no-underline">
            <SidebarLink icon={<Users size={18} />} label="Staff Directory" active={isActive("/dashboard/admin/staff")} />
          </Link>

          <Link href="/dashboard/admin/calendar" className="no-underline">
            <SidebarLink icon={<CalendarDays size={18} />} label="Calendar" active={isActive("/dashboard/admin/calendar")} />
          </Link>

          <Link href="/dashboard/admin/staffAttendance" className="no-underline">
            <SidebarLink icon={<Activity size={18} />} label="Attendance" active={isActive("/dashboard/admin/staffAttendance")} />
          </Link>

          <Link href="/dashboard/admin/reports" className="no-underline">
            <SidebarLink icon={<BarChart2 size={18} />} label="Reports" active={isActive("/dashboard/admin/reports")} />
          </Link>

          <div className="pt-4 mt-4 border-t border-slate-800/50 opacity-40">
            <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</p>
          </div>

          <Link href="/dashboard/admin/settings" className="no-underline">
            <SidebarLink icon={<Settings size={18} />} label="Settings" active={isActive("/dashboard/admin/settings")} />
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="h-8 w-8 rounded-xl bg-blue-500 flex items-center justify-center text-[10px] font-black text-white">AD</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Admin User</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Admin</p>
            </div>
          </div>
          <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-bold w-full px-4 text-left border-none bg-transparent cursor-pointer">
            <LogOut size={18} /> <LogoutButton />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-10 flex items-center justify-between">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!search.trim()) return;

              const formData = new FormData();
              formData.set("q", search);

              // We use a window.location reset to ensure a fresh search 
              // but the server action will handle the logic.
              // Note: redirect() in server actions works via throw, 
              // but here we are calling it as a function.
              // To make it simple for the user, I'll just use a GET redirect to a search route 
              // that runs the logic, or call it here.

              // Better: Redirect to a dedicated search route that handles the logic on the server side
              window.location.href = `/dashboard/admin/search?q=${encodeURIComponent(search)}`;
            }}
            className="relative w-96 group"
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={16}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              placeholder="Search across all modules..."
            />
          </form>

          <div className="flex items-center gap-4">
            <NotificationBellWrapper />
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 px-1 py-1 pr-3 bg-slate-50 rounded-full border border-slate-100">
              <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-blue-600">AD</div>
              <span className="text-xs font-bold text-slate-700">Admin</span>
            </div>
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
    <div className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/20 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer'}`}>
      <div className="flex items-center gap-3 font-bold text-sm">
        <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </div>
        <span className="tracking-tight">{label}</span>
      </div>
      {active && <ChevronRight size={14} className="opacity-60" />}
    </div>
  );
}
