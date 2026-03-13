"use client";

import React, { useState, useTransition } from "react";
import {
    Bell, Calendar, CheckCircle, Info, Trash2,
    Clock, Check, Filter, Loader2, Sparkles,
    LayoutGrid, ListFilter
} from "lucide-react";
import { clearNotifications, markAsRead, markAllAsRead } from "@/app/actions/notification/NotificationActions";

interface Notification {
    Id: number;
    Type: string;
    Title: string;
    Message: string;
    Time: string;
    Color: string;
    IsNew: boolean;
}

interface NotificationClientProps {
    initialNotifications: Notification[];
}

export default function NotificationClient({ initialNotifications }: NotificationClientProps) {
    const [filter, setFilter] = useState<string>("all");
    const [isPending, startTransition] = useTransition();

    const filteredNotifications = initialNotifications.filter(n =>
        filter === "all" ? true : n.Type === filter
    );

    const handleClearAll = () => {
        if (!confirm("Remove all notifications forever?")) return;
        startTransition(async () => {
            await clearNotifications();
        });
    };

    const handleMarkAllRead = () => {
        startTransition(async () => {
            await markAllAsRead();
        });
    };

    const handleMarkRead = (id: number) => {
        startTransition(async () => {
            await markAsRead(id);
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-2xl">
                    <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="All" count={initialNotifications.length} />
                    <FilterButton active={filter === "meeting"} onClick={() => setFilter("meeting")} label="Meetings" icon={<Calendar size={14} />} />
                    <FilterButton active={filter === "system"} onClick={() => setFilter("system")} label="System" icon={<CheckCircle size={14} />} />
                    <FilterButton active={filter === "alert"} onClick={() => setFilter("alert")} label="Alerts" icon={<Info size={14} />} />
                </div>

                <div className="flex items-center gap-3 pr-2">
                    {initialNotifications.some(n => n.IsNew) && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={isPending}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Check size={14} /> Mark all read
                        </button>
                    )}
                    {initialNotifications.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            disabled={isPending}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif) => (
                        <NotificationItem
                            key={notif.Id}
                            notification={notif}
                            onMarkRead={() => handleMarkRead(notif.Id)}
                        />
                    ))
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative z-10">
                            <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-inner">
                                <Sparkles size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Pure Inbox Bliss</h3>
                            <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                                {filter === "all"
                                    ? "Your communication center is completely clear. Enjoy the organized workspace!"
                                    : `No ${filter} notifications found in your history.`}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {filteredNotifications.length > 0 && (
                <div className="flex items-center justify-center gap-3 text-slate-300 py-12">
                    <div className="h-[1px] w-12 bg-slate-100" />
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">End of Recent Activity</span>
                    <div className="h-[1px] w-12 bg-slate-100" />
                </div>
            )}
        </div>
    );
}

function FilterButton({ active, onClick, label, icon, count }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 ${active ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
        >
            {icon}
            {label}
            {count !== undefined && <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] ${active ? 'bg-blue-100' : 'bg-slate-200'}`}>{count}</span>}
        </button>
    );
}

function NotificationItem({ notification, onMarkRead }: { notification: Notification; onMarkRead: () => void }) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600 border-blue-100/50",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
        amber: "bg-amber-50 text-amber-600 border-amber-100/50",
        rose: "bg-rose-50 text-rose-600 border-rose-100/50",
    };

    const icons: any = {
        meeting: <Calendar size={20} />,
        system: <CheckCircle size={20} />,
        alert: <Info size={20} />,
    };

    return (
        <div
            onClick={notification.IsNew ? onMarkRead : undefined}
            className={`group relative bg-white p-7 rounded-[2.5rem] border transition-all duration-500 cursor-pointer ${notification.IsNew ? 'border-blue-200 shadow-[0_15px_40px_-15px_rgba(59,130,246,0.12)] ring-1 ring-blue-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/30'}`}
        >
            {notification.IsNew && (
                <div className="absolute top-8 right-8 h-3 w-3 bg-blue-500 rounded-full border-[3px] border-white shadow-sm animate-pulse" />
            )}

            <div className="flex gap-6">
                <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center border-2 ${colors[notification.Color] || colors.blue} transition-all duration-700 group-hover:rounded-[1rem] group-hover:rotate-[-8deg] group-hover:scale-105 shadow-sm`}>
                    {icons[notification.Type] || <Bell size={20} />}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <h4 className={`font-black text-[16px] tracking-tight transition-colors duration-300 ${notification.IsNew ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-600 group-hover:text-slate-900'}`}>{notification.Title}</h4>
                            {notification.IsNew && (
                                <span className="bg-blue-600 text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm shadow-blue-500/20">New</span>
                            )}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{notification.Time}</span>
                    </div>
                    <p className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${notification.IsNew ? 'text-slate-500' : 'text-slate-400 group-hover:text-slate-500'}`}>{notification.Message}</p>

                    {!notification.IsNew && (
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                            <CheckCircle size={12} /> Viewed
                        </div>
                    )}
                </div>

                {notification.IsNew && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <div className="bg-slate-100 p-2 rounded-full text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                            <Check size={16} strokeWidth={3} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
