"use client";

import { Trash2 } from "lucide-react";
import { DeleteMeetingAction } from "../actions/DeleteMeetingAction";
import { useToast } from "./Toast";

interface DeleteButtonProps {
  id: number;
  className?: string;        // optional class for button styling
  iconClassName?: string;    // optional class for icon size/color
}

function DeleteButtonForMeetings({ id, className, iconClassName }: DeleteButtonProps) {
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this meeting? This action cannot be undone.")) {
      try {
        const result = await DeleteMeetingAction(id);
        // DeleteMeetingAction redirects on success, but if it returns an error object:
        if (result && !result.success) {
           showToast(result.error || "Failed to delete meeting", "error");
        }
        // Success toast will be handled by the redirect triggering ToastTrigger if it stays on same page or similar
      } catch (error) {
        showToast("An unexpected error occurred", "error");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`flex items-center justify-center p-2 rounded-lg transition hover:bg-red-50 group ${className}`}
      title="Delete Meeting"
    >
      <Trash2 className={`${iconClassName || "w-4 h-4 text-red-500 hover:text-red-700"} transition-colors`} />
    </button>
  );
}

export default DeleteButtonForMeetings;
