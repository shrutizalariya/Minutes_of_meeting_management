import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { getUserSettings } from "@/app/actions/user/UpdateProfile";
import SettingsForm from "./SettingsForm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function SettingsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId = 1;

    if (token) {
        try {
            const payload = await verifyToken(token) as { id: number; email: string; role: string };
            if (payload && payload.id) {
                userId = payload.id;
            }
        } catch (error) {
            console.error("Token verification failed in settings:", error);
        }
    }

    const user = await getUserSettings(userId);

    if (!user) {
        return (
            <div className="p-20 text-center animate-in fade-in duration-700">
                <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <SettingsIcon size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No User Configuration Found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">The system couldn't find any user accounts in the database. Please ensure you have ran the initial database setup.</p>
                <div className="mt-8">
                    <a href="/dashboard/admin" className="text-blue-600 font-bold text-sm hover:underline">Return to Dashboard</a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8" style={{ fontFamily: "'Sora', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
            `}</style>

            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                    <SettingsIcon size={14} strokeWidth={3} /> Configuration
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Settings</h1>
                <p className="text-slate-500 text-sm mt-2 font-medium">Manage your profile, account preferences, and application behavior.</p>
            </div>

            <SettingsForm user={user} />
        </div>
    );
}
