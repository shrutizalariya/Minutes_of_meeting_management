"use client";

import { Trash2 } from "lucide-react";
import { BulkDeleteMeetingMembersAction } from "@/app/actions/meetingmember/BulkDelete";

export default function BulkDeleteButtonForMeetingMembers() {
    const handleDelete = async () => {
        const checkboxes = document.querySelectorAll<HTMLInputElement>(".row-checkbox:checked");
        const ids = Array.from(checkboxes).map((cb) => Number(cb.value));

        if (ids.length === 0) {
            alert("Please select at least one member to delete.");
            return;
        }

        if (confirm(`Delete ${ids.length} selected member(s)?`)) {
            const result = await BulkDeleteMeetingMembersAction(ids);

            if (result.success) {
                checkboxes.forEach((cb) => {
                    cb.checked = false;
                });
                const master = document.getElementById("master-checkbox") as HTMLInputElement | null;
                if (master) master.checked = false;
            } else {
                alert("Something went wrong during deletion.");
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
