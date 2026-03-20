"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Check, Trash2, Clock, Inbox } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from "@/app/actions/notification/NotificationActions";
import NotificationToast from "./NotificationToast";

export default function ConvenerNotificationBell({ userId }: { userId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDot, setShowDot] = useState(false);
  const [activeToast, setActiveToast] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastNotifIdRef = useRef<number | null>(null);

  useEffect(() => {
    fetchNotifications(true); 
    const interval = setInterval(() => fetchNotifications(false), 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async (isInitial: boolean) => {
    const data = await getNotifications(userId);
    setNotifications(data);
    setShowDot(data.some((n: any) => n.IsNew));

    if (data.length > 0) {
      const topNotif = data[0];
      if (!isInitial && topNotif.IsNew && topNotif.Id !== lastNotifIdRef.current && !isOpen) {
        setActiveToast(topNotif);
      }
      lastNotifIdRef.current = topNotif.Id;
    }
  };

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    fetchNotifications(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(userId);
    fetchNotifications(false);
  };

  const handleClearAll = async () => {
    await clearNotifications();
    fetchNotifications(false);
  };

  // Helper to format time/date
  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md transition-all cursor-pointer relative group"
      >
        <Bell size={20} className={showDot ? "text-blue-600 animate-[wiggle_1s_infinite]" : "group-hover:scale-110 transition-transform"} />
        {showDot && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-blue-600 rounded-full border-2 border-white shadow-sm" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200 origin-top-right">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Bell size={14} className="text-blue-600" />
              Notifications
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); handleMarkAllAsRead(); }}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                title="Mark all as read"
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleClearAll(); }}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border-none bg-transparent cursor-pointer"
                title="Clear all"
              >
                <Trash2 size={14} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.Id} 
                    className={`p-5 hover:bg-slate-50/50 transition-colors cursor-pointer relative group ${notif.IsNew ? 'bg-blue-50/10' : ''}`}
                    onClick={() => handleMarkAsRead(notif.Id)}
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${notif.IsNew ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-slate-200'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-60">
                            Facilitation Alert
                          </span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase flex items-center gap-1">
                            <Clock size={8} /> {formatTime(notif.CreatedAt)}
                          </span>
                        </div>
                        <h4 className={`text-xs font-bold text-slate-800 mb-1 truncate ${notif.IsNew ? 'text-blue-900' : ''}`}>{notif.Title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{notif.Message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-200 mb-4 group-hover:bg-slate-100 transition-colors">
                  <Inbox size={32} />
                </div>
                <p className="text-xs font-bold text-slate-800 mb-1 uppercase tracking-widest">Quorum Maintained</p>
                <p className="text-[10px] text-slate-400 font-medium">No new system notifications at the moment.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex flex-col gap-2">
            <Link 
              href="/dashboard/convener/notifications" 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-white hover:bg-blue-600 transition-all text-center border border-blue-100 rounded-xl bg-white no-underline shadow-sm active:scale-95"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}

      {activeToast && (
        <NotificationToast 
          notification={activeToast} 
          onClose={() => setActiveToast(null)} 
          onClick={() => { setIsOpen(true); setActiveToast(null); }}
        />
      )}
      
      <style jsx global>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
