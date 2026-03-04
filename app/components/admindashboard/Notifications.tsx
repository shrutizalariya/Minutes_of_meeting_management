"use client"

import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBell({ notifications }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative"
      >
        <Bell size={20} />

        {/* Red badge */}
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white border rounded-xl shadow-lg p-4 z-50">
          
          <h3 className="font-semibold mb-3">
            Upcoming Meetings
          </h3>

          <div className="space-y-2">
            {notifications.map((n: any) => (
              <div
                key={n.MeetingID}
                className="p-2 bg-slate-50 rounded-lg text-sm"
              >
                📅 {n.MeetingDescription}

                <br />

                <span className="text-xs text-gray-500">
                  {new Date(n.MeetingDate).toDateString()}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}