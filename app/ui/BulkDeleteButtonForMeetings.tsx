"use client";

import { Trash2 } from "lucide-react";
import { BulkDeleteMeetingsAction } from "@/app/actions/meeting/BulkDelete";
import { useToast } from "@/app/ui/Toast";

export default function BulkDeleteButtonForMeetings() {
    const { showToast } = useToast();
    const handleDelete = async () => {
        const checkboxes = document.querySelectorAll<HTMLInputElement>(".row-checkbox:checked");
        const ids = Array.from(checkboxes).map((cb) => Number(cb.value));

        if (ids.length === 0) {
            showToast("Please select at least one meeting to delete.", "error");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${ids.length} selected meeting(s)?`)) {
            const result = await BulkDeleteMeetingsAction(ids);

            if (result.success) {
                showToast(`${ids.length} meeting(s) deleted successfully.`, "success");
                checkboxes.forEach((cb) => {
                    cb.checked = false;
                });
                const master = document.getElementById("master-checkbox") as HTMLInputElement | null;
                if (master) master.checked = false;
            } else {
                showToast("Something went wrong during deletion.", "error");
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fee2e2",
                borderRadius: "9px",
                padding: "0.6rem 1.2rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Sora, sans-serif",
                transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#dc2626";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
                (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
            }}
        >
            <Trash2 size={14} />
            Delete Selected
        </button>
    );
}
