"use client";

import React, { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { sendAttendanceAlert } from "@/app/actions/staffAttendance/SendAlert";
import { useToast } from "./Toast";

export default function SendAlertButton({ staffID, staffName, staffEmail }: { staffID: number; staffName: string; staffEmail: string }) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { showToast } = useToast();

    const handleSend = async () => {
        setLoading(true);
        try {
            await sendAttendanceAlert(staffID, staffName, staffEmail);
            showToast(`Alert email sent to ${staffName} successfully!`, "success");
            setShowConfirm(false);
        } catch (error) {
            showToast("Failed to send alert email.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider h-[32px] flex items-center justify-center min-w-[60px]"
                >
                    {loading ? <Loader2 size={12} className="animate-spin" /> : "Confirm"}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider h-[32px]"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 px-3 rounded-lg text-[10px] transition-all border border-rose-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider h-[32px]"
        >
            <Mail size={12} />
            Send Alert
        </button>
    );
}
