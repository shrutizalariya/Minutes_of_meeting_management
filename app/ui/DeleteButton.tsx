"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { DeleteMeetingTypeAction } from "../actions/DeleteMeetingTypeAction";

interface DeleteButtonProps {
  id: number;
  className?: string;        
  iconClassName?: string;   
}

import { useToast } from "./Toast";

function DeleteButton({ id, className, iconClassName }: DeleteButtonProps) {
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this meeting type?")) {
      const result = await DeleteMeetingTypeAction(id);
      if (result?.error) {
        showToast(result.error, "error");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`flex items-center justify-center p-2 rounded-lg transition hover:bg-rose-50 border border-transparent hover:border-rose-100 group ${className}`}
      title="Delete Meeting Type"
    >
      <Trash2 className={`text-slate-400 group-hover:text-rose-600 transition-colors ${iconClassName || "w-4 h-4"}`} />
    </button>
  );
}

export default DeleteButton;
