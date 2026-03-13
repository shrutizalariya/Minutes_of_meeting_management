"use client";

import React from "react";
import { Eye } from "lucide-react";
import Link from "next/link";

interface ActionItemWidgetProps {
  id: number;
  task: string;
  assigned: string;
  deadline: string; // ISO string or Date string
  overdue: boolean;
}

const ActionItemWidget: React.FC<ActionItemWidgetProps> = ({ id, task, assigned, deadline, overdue }) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Determine background and border color
  let bgColor = "bg-white border-slate-200 text-slate-800";

  if (overdue && deadlineDate <= today) {
    bgColor = "bg-red-50 border-red-200 text-red-800"; // overdue/today
  } else if (deadlineDate > today) {
    bgColor = "bg-green-50 border-green-200 text-green-800"; // future
  } else {
    bgColor = "bg-amber-50 border-amber-200 text-amber-800"; // attended today or normal
  }

  return (
    <div className={`p-4 border rounded-2xl ${bgColor} transition-all duration-200 relative group hover:shadow-md`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <p className="font-bold text-sm tracking-tight">{task}</p>
          <p className="text-[10px] font-semibold opacity-70 mt-1 uppercase tracking-wider">
            Assigned: {assigned}
          </p>
          <p className="text-[10px] font-bold mt-0.5 uppercase tracking-widest">
            Due: {deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
        <Link
          href={`/dashboard/admin/meetingmember/${id}`}
          className="p-2 rounded-xl bg-white/50 hover:bg-white text-slate-400 hover:text-blue-600 border border-slate-100 transition-all duration-200 shadow-sm"
          title="View Entry"
        >
          <Eye size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ActionItemWidget;