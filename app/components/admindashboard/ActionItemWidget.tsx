"use client";

import React from "react";

interface ActionItemWidgetProps {
  task: string;
  assigned: string;
  deadline: string; // ISO string or Date string
  overdue: boolean;
}

const ActionItemWidget: React.FC<ActionItemWidgetProps> = ({ task, assigned, deadline, overdue }) => {
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
    <div className={`p-4 border rounded-lg ${bgColor} transition-colors`}>
      <p className="font-semibold text-sm">{task}</p>
      <p className="text-xs">
        Assigned: {assigned} | Deadline: {deadlineDate.toDateString()}
      </p>
    </div>
  );
};

export default ActionItemWidget;