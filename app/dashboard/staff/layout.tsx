// app/dashboard/staff/layout.tsx
import React from "react";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import NotificationBell from "./NotificationBell";
import SidebarNavigation from "./SidebarNavigation";
import SearchForm from "./SearchForm";

import {
  CheckSquare,
  LogOut,
} from "lucide-react";
import LogoutButton from "@/app/ui/LogoutButton";

import { prisma } from "@/lib/prisma";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  let userName = "User";
  let initial = "U";
  let userId = 0;

  if (token) {
    const payload: any = await verifyToken(token.value);

    if (payload?.id) {
      userId = payload.id;
      
      // Fetch official staff name from database
      const staff = await prisma.staff.findUnique({
        where: { UserID: userId },
        select: { StaffName: true }
      });

      if (staff?.StaffName) {
        userName = staff.StaffName;
      } else if (payload.email) {
        const namePart = payload.email.split("@")[0];
        userName = namePart
          .replace(/[0-9]/g, "")
          .split(/[._]/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      initial = userName.charAt(0).toUpperCase();
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex text-slate-900 selection:bg-emerald-100 antialiased">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1324] flex flex-col fixed h-full z-50">

        {/* Logo */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <CheckSquare size={20} strokeWidth={2.5} />
            </div>

            <span className="text-white font-bold tracking-tight text-xl uppercase">
              Minute<span className="text-emerald-500">Staff</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <SidebarNavigation />

        {/* User Info */}
        <div className="p-6 border-t border-slate-800">

          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4 overflow-hidden">

            {/* Avatar */}
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white uppercase flex-shrink-0">
              {initial}
            </div>

            {/* Name */}
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {userName}
              </p>

              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Staff Account
              </p>
            </div>

          </div>

          {/* Logout */}
          <LogoutButton className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-bold w-full px-4 py-2 text-left border-none bg-transparent cursor-pointer group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> <span>Sign Out</span>
          </LogoutButton>

        </div>

      </aside>

      {/* Workspace */}
      <div className="flex-1 ml-64 flex flex-col">

        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-10 flex items-center justify-between">

          {/* Search */}
          <SearchForm />

          {/* Notification */}
          <div className="flex items-center gap-5">

            <NotificationBell userId={userId} />

          </div>

        </header>

        {/* Page Content */}
        <main className="p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>

      </div>
    </div>
  );
}