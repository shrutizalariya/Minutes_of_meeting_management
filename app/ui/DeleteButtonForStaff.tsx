"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { DeleteStaffAction } from "../actions/staff/DeleteStaffAction";

interface DeleteButtonProps {
  id: number;
  className?: string;       // optional extra button styling
  iconClassName?: string;   // optional icon styling
}

import { useToast } from "./Toast";

interface DeleteButtonProps {
  id: number;
  className?: string;       // optional extra button styling
  iconClassName?: string;   // optional icon styling
}

function DeleteButtonForStaff({ id, className, iconClassName }: DeleteButtonProps) {
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this staff member? This will also remove their associated meeting and event records.")) {
      try {
        await DeleteStaffAction(id);
        // The redirect in DeleteStaffAction will trigger the ToastTrigger success
      } catch (error) {
        showToast("An error occurred while deleting staff.", "error");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`flex items-center justify-center p-2 rounded-lg transition hover:bg-rose-50 group border border-transparent hover:border-rose-100 ${className}`}
      title="Delete Staff"
    >
      <Trash2 className={`text-slate-400 group-hover:text-rose-600 transition-colors ${iconClassName || "w-4 h-4"}`} />
    </button>
  );
}

export default DeleteButtonForStaff;
