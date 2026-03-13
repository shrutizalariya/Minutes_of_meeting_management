import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import { AddMeetingMemberAction } from "@/app/actions/meetingmember/AddMeetingMemberAction";

export default async function AddMeetingMember() {
  const meetings = await prisma.meetings.findMany({
    include: {
      meetingtype: true,
    },
    orderBy: {
      MeetingDate: "desc",
    },
  });

  const staff = await prisma.staff.findMany({
    orderBy: {
      StaffName: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Add Meeting Member
        </h2>

        <form action={AddMeetingMemberAction} className="space-y-4">

          {/* Meeting */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Meeting
            </label>
            <select
              name="MeetingID"
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Meeting</option>
              {meetings.map((m) => (
                <option key={m.MeetingID} value={m.MeetingID}>
                  {new Date(m.MeetingDate).toLocaleDateString()} –{" "}
                  {m.meetingtype.MeetingTypeName}
                </option>
              ))}
            </select>
          </div>

          {/* Staff */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Staff
            </label>
            <select
              name="StaffID"
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Staff</option>
              {staff.map((s) => (
                <option key={s.StaffID} value={s.StaffID}>
                  {s.StaffName}
                </option>
              ))}
            </select>
          </div>

          {/* Is Present */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="IsPresent"
              className="h-4 w-4"
            />
            <label className="text-sm text-gray-700">
              Is Present
            </label>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Remarks
            </label>
            <textarea
              name="Remarks"
              rows={3}
              className="w-full border rounded-md p-2"
              placeholder="Optional remarks"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save
            </button>

            <Link
              href="/meetingmember"
              className="flex-1 text-center bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
