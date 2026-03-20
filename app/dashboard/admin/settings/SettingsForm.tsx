"use client";

import React, { useState } from "react";
import { User, Bell, Shield, Save, Loader2, CheckCircle2, Lock } from "lucide-react";
import { useToast } from "@/app/ui/Toast";
import { updateProfile } from "@/app/actions/user/UpdateProfile";
import { updateSecurity } from "@/app/actions/user/UpdateSecurity";

interface SettingsFormProps {
    user: {
        Id: number;
        Name: string | null;
        Email: string | null;
        EmailNotifications: boolean;
        DesktopAlerts: boolean;
    };
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");
    const [loading, setLoading] = useState(false);

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!window.confirm("Are you sure you want to update your profile settings?")) return;

        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append("id", user.Id.toString());

        const result = await updateProfile(formData);
        if (result.success) {
            showToast("Profile updated successfully!", "success");
        } else {
            showToast(result.error || "Failed to update profile.", "error");
        }
        setLoading(false);
    };

    const handleSecuritySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!window.confirm("Are you sure you want to update your password?")) return;

        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append("id", user.Id.toString());

        const result = await updateSecurity(formData);
        if (result.success) {
            showToast("Password updated successfully!", "success");
            (e.target as HTMLFormElement).reset();
        } else {
            showToast(result.error || "Failed to update security settings.", "error");
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Tabs */}
            <div className="space-y-2">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === "profile" ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <User size={18} /> Profile Info
                </button>
                <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === "notifications" ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <Bell size={18} /> Notifications
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === "security" ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <Shield size={18} /> Security
                </button>
            </div>

            {/* Content Area */}
            <div className="md:col-span-2 space-y-6">
                {activeTab === "profile" && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                            Profile Details
                        </h3>

                        <form className="space-y-5" onSubmit={handleProfileSubmit}>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={user.Name || ""}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    defaultValue={user.Email || ""}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {loading ? "Saving Changes..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                            Preferences
                        </h3>
                        <form className="space-y-4" onSubmit={handleProfileSubmit}>
                            {/* Reusing profile submit as it handles toggles too */}
                            <input type="hidden" name="name" defaultValue={user.Name || ""} />
                            <input type="hidden" name="email" defaultValue={user.Email || ""} />

                            <ToggleSwitch
                                name="emailNotifications"
                                label="Email Notifications"
                                description="Receive updates about new meetings via email."
                                defaultChecked={user.EmailNotifications}
                            />
                            <ToggleSwitch
                                name="desktopAlerts"
                                label="Desktop Alerts"
                                description="Get notified instantly on your browser."
                                defaultChecked={user.DesktopAlerts}
                            />

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {loading ? "Update Preferences" : "Update Preferences"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === "security" && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                            Access & Password
                        </h3>

                        <form className="space-y-5" onSubmit={handleSecuritySubmit}>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Current Password</label>
                                <input
                                    name="currentPassword"
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">New Password</label>
                                <input
                                    name="newPassword"
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Confirm New Password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-10 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                                    {loading ? "Updating Password..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

function ToggleSwitch({ name, label, description, defaultChecked = false }: { name: string; label: string; description: string; defaultChecked?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
            <div>
                <p className="text-sm font-bold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 font-medium">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input name={name} type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
}
