"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { DeleteStaffAction } from "../actions/staff/DeleteStaffAction";

interface DeleteButtonProps {
  id: number;
  className?: string;       // optional extra button styling
  iconClassName?: string;   // optional icon styling
}

function DeleteButtonForStaff({ id, className, iconClassName }: DeleteButtonProps) {
  return (
    <button
      onClick={() => DeleteStaffAction(id)}
      className={`flex items-center justify-center p-2 rounded-lg transition hover:bg-red-100 ${className}`}
      title="Delete Staff"
    >
      <Trash2 className={`text-red-600 ${iconClassName || "w-5 h-5"}`} />
    </button>
  );
}

export default DeleteButtonForStaff;
