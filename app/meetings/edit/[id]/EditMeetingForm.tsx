"use client";

import { useState } from "react";
import { EditMeetingAction } from "@/app/actions/EditMeetingAction";

export default function EditMeetingForm({
  meeting,
  meetingTypes,
}: {
  meeting: any;
  meetingTypes: any[];
}) {
  const [isCancelled, setIsCancelled] = useState(meeting.IsCancelled);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action={EditMeetingAction}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold">Edit Meeting</h2>

        <input type="hidden" name="MeetingID" value={meeting.MeetingID} />

        {/* Meeting Date */}
        <div>
          <label>Meeting Date</label>
          <input
            type="date"
            name="MeetingDate"
            defaultValue={meeting.MeetingDate.toISOString().split("T")[0]}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Meeting Type */}
        <div>
          <label>Meeting Type</label>
          <select
            name="MeetingType"
            defaultValue={meeting.MeetingTypeID}
            className="w-full border px-3 py-2 rounded"
            required
          >
            {meetingTypes.map((type) => (
              <option key={type.MeetingTypeID} value={type.MeetingTypeID}>
                {type.MeetingTypeName}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <input
            type="text"
            name="MeetingDescription"
            defaultValue={meeting.MeetingDescription ?? ""}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Cancel Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="IsCancelled"
            checked={isCancelled}
            onChange={(e) => setIsCancelled(e.target.checked)}
          />
          <label>Meeting Cancelled</label>
        </div>

        {/* ONLY SHOW WHEN CHECKED */}
        {isCancelled && (
          <>
            <div>
              <label>Cancellation Date & Time</label>
              <input
                type="datetime-local"
                name="CancellationDateTime"
                defaultValue={
                  meeting.CancellationDateTime
                    ? new Date(meeting.CancellationDateTime)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label>Cancellation Reason</label>
              <input
                type="text"
                name="CancellationReason"
                defaultValue={meeting.CancellationReason ?? ""}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}
