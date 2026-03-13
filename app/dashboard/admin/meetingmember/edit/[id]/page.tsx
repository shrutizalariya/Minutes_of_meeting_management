import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import { EditMeetingMemberAction } from "@/app/actions/meetingmember/EditMeetingMemberAction";

async function EditMeetingMember({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const meetingMember = await prisma.meetingmember.findFirst({
    where: {
      MeetingMemberID: Number(id),
    },
    include: {
      staff: true,
      meetings: {
        include: {
          meetingtype: true,
        },
      },
    },
  });

  if (!meetingMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">
          Meeting Member not found
        </p>
      </div>
    );
  }

  const staffList = await prisma.staff.findMany({
    orderBy: { StaffName: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Edit Meeting Member
        </h2>

        <form action={EditMeetingMemberAction} className="space-y-4">
          {/* Hidden ID */}
          <input
            type="hidden"
            name="MeetingMemberID"
            value={meetingMember.MeetingMemberID}
          />

          {/* Meeting (Read-only) */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Meeting
            </label>
            <input
              type="text"
              disabled
              value={`${new Date(
                meetingMember.meetings.MeetingDate
              ).toLocaleDateString()} - ${
                meetingMember.meetings.meetingtype.MeetingTypeName
              }`}
              className="w-full border rounded-md p-2 bg-gray-100"
            />
          </div>

          {/* Staff */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Staff
            </label>
            <select
              name="StaffID"
              defaultValue={meetingMember.StaffID}
              required
              className="w-full border rounded-md p-2"
            >
              {staffList.map((s) => (
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
              defaultChecked={meetingMember.IsPresent ?? false}
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
              defaultValue={meetingMember.Remarks ?? ""}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Update
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

export default EditMeetingMember;
