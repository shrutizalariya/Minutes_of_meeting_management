"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, CheckSquare, Users, 
  Settings, Bell, LogOut, ChevronRight, LayoutDashboard,
  Mic2, BookOpen, Menu, X, Search, Activity, Command
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getNotifications } from "@/app/actions/notification/NotificationActions";
import { globalSearch } from "@/app/actions/search/GlobalSearch";

export default function ConvenerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();

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

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifs() {
      if (!profile?.id) return;
      try {
        const data = await getNotifications(profile.id);
        setNotifications(data);
      } catch (e) {
        console.error("Failed to fetch notifications:", e);
      }
    }
    fetchNotifs();
  }, [profile]);

  const userName = profile?.name || "Convener";
  const userInitials = profile?.initials || "C";
  const userRole = profile?.role || "Meeting Facilitator";

  const isActive = (path: string) => {
    if (path === "/dashboard/convener") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const navigation = [
    { name: "Overview", href: "/dashboard/convener", icon: LayoutDashboard },
    { name: "Meetings", href: "/dashboard/convener/meetings", icon: Calendar },
    { name: "Archive", href: "/dashboard/convener/archive", icon: BookOpen },
    { name: "Attendance", href: "/dashboard/convener/attendance", icon: Activity },
    { name: "Staff Directory", href: "/dashboard/convener/staff", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex text-slate-900 selection:bg-blue-100" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
      `}</style>
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-[60] bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Fixed */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1324] flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-8">
          <Link href="/dashboard/convener" className="flex items-center gap-3 no-underline">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/20 transform -rotate-3 hover:rotate-0 transition-transform">
              <Mic2 size={20} strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold tracking-tight text-xl uppercase">Minute<span className="text-blue-500">Edit</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="no-underline">
              <SidebarLink 
                icon={<item.icon size={18} />} 
                label={item.name} 
                active={isActive(item.href)} 
              />
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-800/50 opacity-40">
            <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</p>
          </div>

          <Link href="/dashboard/convener/settings" className="no-underline">
            <SidebarLink icon={<Settings size={18} />} label="Settings" active={isActive("/dashboard/convener/settings")} />
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="h-8 w-8 rounded-xl bg-blue-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{userRole}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-bold w-full px-4 text-left border-none bg-transparent cursor-pointer"
          >
            <LogOut size={18} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
          <form
            className="relative w-72 lg:w-96 group hidden sm:block"
            action={globalSearch}
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={16}
            />
            <input
              name="q"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              placeholder="Search meetings or staff..."
            />
          </form>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md transition-all cursor-pointer relative"
              >
                 <Bell size={20} />
                 {notifications.filter(n => n.IsNew).length > 0 && (
                   <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                 )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-50 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Notifications</h3>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{notifications.filter(n => n.IsNew).length} New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 8).map((n) => (
                        <div key={n.Id} className={`px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${n.IsNew ? '' : 'opacity-60'}`}>
                          <p className="text-xs font-bold text-slate-800 leading-snug">{n.Title}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-2">{n.Message}</p>
                          <span className="text-[9px] font-bold text-slate-300 uppercase mt-1 block">{n.Time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden lg:block" />
            <div className="flex items-center gap-3 px-1 py-1 pr-3 bg-slate-50 rounded-full border border-slate-100">
              <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-blue-600 uppercase">
                {userInitials}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden lg:block">{userName}</span>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
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
