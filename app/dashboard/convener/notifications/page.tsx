import React from "react";
import { Bell, Search, Filter, CheckCircle2, Trash2, Calendar, Clock, Inbox, ChevronRight } from "lucide-react";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getNotifications } from "@/app/actions/notification/NotificationActions";
import Link from "next/link";

export default async function ConvenerNotificationsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId = 0;

    if (token) {
        try {
            const payload = await verifyToken(token) as { id: number; email: string; role: string };
            userId = payload.id;
        } catch (e) {
            console.error("Auth error:", e);
        }
    }

    const notifications = await getNotifications(userId);

    return (
        <div className="space-y-10" style={{ fontFamily: "'Sora', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
            `}</style>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                        <Bell size={14} strokeWidth={3} /> System Alerts
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Notifications</h1>
                    <p className="text-slate-500 text-sm mt-3 font-medium max-w-xl leading-relaxed">
                        Stay updated on meeting assignments, absentee alerts, and system-wide facilitation updates.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                        <Trash2 size={14} strokeWidth={2.5} /> Clear All
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                        <CheckCircle2 size={14} strokeWidth={2.5} /> Mark All Read
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Statistics Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Activity Snapshot</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
                                    <p className="text-2xl font-black text-slate-900">{notifications.filter(n => n.IsNew).length}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Unread Alerts</p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
                                    <p className="text-2xl font-black text-slate-900">{notifications.length}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Total History</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Facilitation Priority</h3>
                            <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <div className="flex justify-between items-center mt-2 px-1">
                                <span className="text-[9px] font-bold text-slate-300 uppercase">Attention Flow</span>
                                <span className="text-[10px] font-black text-blue-600 uppercase">Corrective</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="lg:col-span-2 space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((notif, index) => (
                            <div 
                                key={notif.Id} 
                                className={`group bg-white p-6 rounded-[2rem] border transition-all duration-300 flex items-start gap-5 cursor-pointer hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 ${notif.IsNew ? 'border-blue-100 shadow-[0_4px_20px_rgba(37,99,235,0.05)]' : 'border-slate-100 shadow-sm opacity-80'}`}
                            >
                                <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${notif.IsNew ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] animate-pulse' : 'bg-slate-200'}`}></div>
                                
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-60">System Update</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase">
                                                <Calendar size={12} className="opacity-60" /> {new Date(notif.CreatedAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase">
                                                <Clock size={12} className="opacity-60" /> {new Date(notif.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{notif.Title}</h3>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">{notif.Message}</p>
                                </div>

                                <div className="self-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="h-24 w-24 bg-slate-50 rounded-[2.52rem] flex items-center justify-center text-slate-200 mb-8 transform rotate-3 hover:rotate-0 transition-all duration-500">
                                <Inbox size={48} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">System Clear</h3>
                            <p className="text-slate-400 font-medium max-w-xs uppercase text-[10px] tracking-widest leading-relaxed">You've reached notification parity. No pending alerts in the facilitate queue.</p>
                            <Link href="/dashboard/convener" className="mt-8 px-8 py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all no-underline">
                                Return to Console
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
