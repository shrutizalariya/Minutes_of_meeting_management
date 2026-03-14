"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  ChevronRight 
} from "lucide-react";

export default function SidebarNavigation() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/staff", label: "My Workspace", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/staff/meetings", label: "My Meetings", icon: <Calendar size={18} /> },
    { href: "/dashboard/staff/attendance", label: "Attendance", icon: <Clock size={18} /> },
  ];

  return (
    <nav className="flex-1 px-4 space-y-1">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/dashboard/staff" && pathname.startsWith(link.href));
        
        return (
          <Link key={link.href} href={link.href} className="no-underline block">
            <div
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-3 font-semibold text-sm">
                <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-400"} transition-colors`}>
                  {link.icon}
                </span>
                {link.label}
              </div>

              {isActive && <ChevronRight size={14} className="opacity-60" />}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
