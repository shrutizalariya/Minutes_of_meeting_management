"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getBellStatus } from "@/app/actions/notification/NotificationActions";

export default function NotificationBellWrapper() {
    const [showDot, setShowDot] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            const status = await getBellStatus();
            setShowDot(status.showDot);
        };
        fetchStatus();
        
        // Optional: poll every 30 seconds
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Link href="/dashboard/admin/notifications" className={`p-2.5 ${showDot ? 'text-blue-500' : 'text-slate-500'} hover:bg-slate-100 rounded-xl relative transition-all active:scale-95 no-underline`}>
            <Bell size={20} />
            {showDot && (
                <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white shadow-sm"></span>
                </span>
            )}
        </Link>
    );
}
