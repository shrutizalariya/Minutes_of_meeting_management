import React from "react";
import { Bell } from "lucide-react";
import { getNotifications } from "@/app/actions/notification/NotificationActions";
import NotificationClient from "./NotificationClient";

export default async function NotificationsPage() {
    const notifications = await getNotifications();

    return (
        <div className="max-w-6xl mx-auto space-y-10 py-8 px-4" style={{ fontFamily: "'Sora', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
            `}</style>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        <Bell size={12} strokeWidth={3} className="animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Management Hub</span>
                    </div>
                    <h1 className="text-4xl font-[900] text-slate-900 tracking-tight leading-none">
                        Activity Stream
                    </h1>
                    <p className="text-slate-400 text-sm font-medium italic">
                        Real-time system updates and communication logs.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-12 w-[1px] bg-slate-100 hidden md:block" />
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 justify-end">
                            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Feed Active
                        </p>
                    </div>
                </div>
            </div>

            <NotificationClient initialNotifications={notifications} />
        </div>
    );
}
