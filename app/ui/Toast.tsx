"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto flex items-center gap-3 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl px-5 py-4 min-w-[300px] animate-in slide-in-from-right fade-in duration-300"
                    >
                        <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                toast.type === 'error' ? 'bg-rose-50 text-rose-600' :
                                    toast.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                                        'bg-blue-50 text-blue-600'
                            }`}>
                            {toast.type === 'success' && <CheckCircle size={18} strokeWidth={2.5} />}
                            {toast.type === 'error' && <XCircle size={18} strokeWidth={2.5} />}
                            {toast.type === 'warning' && <AlertCircle size={18} strokeWidth={2.5} />}
                            {toast.type === 'info' && <Info size={18} strokeWidth={2.5} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
                                {toast.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-slate-50 text-slate-300 hover:text-slate-500 rounded-lg transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
