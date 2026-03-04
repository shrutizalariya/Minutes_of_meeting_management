import React from "react";
import { 
  CheckSquare, Calendar, User, LogOut, 
  Bell, LayoutDashboard, Clock, ChevronRight, Search, Command
} from "lucide-react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F7FE] flex text-slate-900 selection:bg-emerald-100 antialiased">
      {/* Power Sidebar (Dark Mode) */}
      <aside className="w-64 bg-[#0B1324] flex flex-col fixed h-full z-50 transition-all">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
              <CheckSquare size={20} strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold tracking-tight text-xl uppercase">Minute<span className="text-emerald-500">Staff</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="My Workspace" active />
          <SidebarLink icon={<Calendar size={18} />} label="My Meetings" />
          <SidebarLink icon={<CheckSquare size={18} />} label="My Actions" />
          <SidebarLink icon={<Clock size={18} />} label="Attendance" />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">JD</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">John Doe</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Product Dept</p>
            </div>
          </div>
          <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-medium w-full px-4">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Workspace */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
            <input 
              className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none" 
              placeholder="Search meetings or tasks..." 
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 items-center bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400">
              <Command size={10} /> K
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white" />
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
    <button className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${active ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
      <div className="flex items-center gap-3 font-semibold text-sm">
        {icon}
        {label}
      </div>
      {active && <ChevronRight size={14} className="opacity-60" />}
    </button>
  );
}