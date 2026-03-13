
import React from "react";
import { Settings as SettingsIcon, User, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Tabs (UI only for now) */}
                <div className="space-y-2">
                    <TabButton icon={<User size={18} />} label="Profile Info" active />
                    <TabButton icon={<Bell size={18} />} label="Notifications" />
                    <TabButton icon={<Shield size={18} />} label="Security" />
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Profile Details</h3>

                        <form className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Admin User"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="admin@minutecore.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="pt-4">
                                <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Preferences</h3>
                        <div className="space-y-4">
                            <ToggleSwitch label="Email Notifications" description="Receive updates about new meetings via email." defaultChecked />
                            <ToggleSwitch label="Desktop Alerts" description="Get notified instantly on your browser." defaultChecked />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TabButton({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100'}`}>
            {icon}
            {label}
        </button>
    );
}

function ToggleSwitch({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
            <div>
                <p className="text-sm font-bold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 font-medium">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
}
