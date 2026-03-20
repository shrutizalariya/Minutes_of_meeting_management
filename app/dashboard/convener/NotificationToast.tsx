"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, ArrowRight } from "lucide-react";

type ToastProps = {
  notification: any;
  onClose: () => void;
  onClick: () => void;
};

export default function NotificationToast({ notification, onClose, onClick }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for exit animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!notification) return null;

  return (
    <div 
      className={`fixed bottom-8 right-8 z-[100] w-80 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 p-6 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 animate-bounce">
          <Bell size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Meeting Update</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="text-slate-300 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          <h4 className="text-xs font-black text-slate-800 mb-1 truncate">{notification.Title}</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{notification.Message}</p>
          
          <button 
            onClick={onClick}
            className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:gap-3 transition-all border-none bg-transparent cursor-pointer"
          >
            Review Details <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
