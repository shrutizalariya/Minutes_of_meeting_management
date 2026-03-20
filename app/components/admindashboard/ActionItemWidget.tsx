"use client";

import React from "react";
import { Eye } from "lucide-react";
import Link from "next/link";

interface ActionItemWidgetProps {
  id: number;
  task: string;
  assigned: string;
  deadline: string;
  overdue: boolean;
  priority?: 'red' | 'yellow' | 'green';
}

const ActionItemWidget: React.FC<ActionItemWidgetProps> = ({ id, task, assigned, deadline, overdue, priority = 'yellow' }) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Determine styles based on priority
  const colorMap = {
    red: { bg: "bg-rose-50/30", border: "border-rose-100", accent: "text-rose-600", label: "URGENT", labelBg: "bg-rose-100" },
    yellow: { bg: "bg-amber-50/30", border: "border-amber-100", accent: "text-amber-600", label: "PENDING", labelBg: "bg-amber-100" },
    green: { bg: "bg-emerald-50/30", border: "border-emerald-100", accent: "text-emerald-600", label: "RESOLVED", labelBg: "bg-emerald-100" },
  };

  const styles = colorMap[priority] || colorMap.yellow;

  return (
    <div className={`p-5 border rounded-3xl ${styles.bg} ${styles.border} transition-all duration-300 relative group hover:shadow-sm hover:border-slate-200`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
             <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${styles.labelBg} ${styles.accent} uppercase tracking-widest`}>
                {styles.label}
             </span>
          </div>
          <p className="font-bold text-sm tracking-tight text-slate-800 leading-snug">{task}</p>
          
          <div className="flex flex-col gap-1 mt-3">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                Assigned: <span className="text-slate-600 font-black">{assigned}</span>
             </div>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                Due: <span className={overdue ? 'text-rose-600 font-black' : 'text-slate-600'}>
                   {deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
             </div>
          </div>
        </div>
        <Link
          href={`/dashboard/admin/meetings/`}
          className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-xl bg-white text-slate-400 hover:text-blue-600 border border-slate-100 transition-all shadow-sm hover:shadow-md"
          title="View"
        >
          <Eye size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ActionItemWidget;