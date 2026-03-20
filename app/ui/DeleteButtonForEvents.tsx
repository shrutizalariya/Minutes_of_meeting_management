"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { DeleteEventAction } from "../actions/DeleteEventAction";

interface DeleteButtonProps {
  id: number;
  className?: string;
  iconClassName?: string;
}

import { useToast } from "./Toast";

function DeleteButtonForEvents({ id, className, iconClassName }: DeleteButtonProps) {
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event? All member records for this event will also be removed.")) {
      const result = await DeleteEventAction(id);
      if (result?.error) {
        showToast(result.error, "error");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`flex items-center justify-center p-2 rounded-lg transition hover:bg-rose-50 border border-transparent hover:border-rose-100 group ${className}`}
      title="Delete Event"
    >
      <Trash2 className={`text-slate-400 group-hover:text-rose-600 transition-colors ${iconClassName || "w-4 h-4"}`} />
    </button>
  );
}

export default DeleteButtonForEvents;

