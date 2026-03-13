"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { DeleteEventAction } from "../actions/DeleteEventAction";

interface DeleteButtonProps {
  id: number;
  className?: string;
  iconClassName?: string;
}

function DeleteButtonForEvents({ id, className, iconClassName }: DeleteButtonProps) {
  return (
    <button
      onClick={() => DeleteEventAction(id)}
      className={`flex items-center justify-center p-2 rounded-lg transition hover:bg-red-100 ${className}`}
      title="Delete Event"
    >
      <Trash2 className={`text-red-600 ${iconClassName || "w-5 h-5"}`} />
    </button>
  );
}

export default DeleteButtonForEvents;

