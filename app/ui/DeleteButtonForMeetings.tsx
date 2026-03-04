"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { DeleteMeetingAction } from "../actions/DeleteMeetingAction";

interface DeleteButtonProps {
  id: number;
  className?: string;        // optional class for button styling
  iconClassName?: string;    // optional class for icon size/color
}

function DeleteButtonForMeetings({ id, className, iconClassName }: DeleteButtonProps) {
  return (
    <button
      onClick={() => DeleteMeetingAction(id)}
      className={`flex items-center justify-center p-2 rounded-lg transition hover:bg-red-100 ${className}`}
      title="Delete Meeting"
    >
      <Trash2 className={`text-red-600 ${iconClassName || "w-5 h-5"}`} />
    </button>
  );
}

export default DeleteButtonForMeetings;
