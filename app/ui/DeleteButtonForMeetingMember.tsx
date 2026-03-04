"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { DeleteMeetingMemberAction } from "../actions/meetingmember/DeleteMeetingMemberAction";

interface DeleteButtonProps {
  id: number;
  className?: string;       
  iconClassName?: string;   
}

function DeleteButtonForMeetingMember({ id, className, iconClassName }: DeleteButtonProps) {
  return (
    <button
      onClick={() => DeleteMeetingMemberAction(id)}
      className={`flex items-center justify-center p-2 rounded-lg transition hover:bg-red-100 ${className}`}
      title="Delete Member"
    >
      <Trash2 className={`text-red-600 ${iconClassName || "w-5 h-5"}`} />
    </button>
  );
}

export default DeleteButtonForMeetingMember;
