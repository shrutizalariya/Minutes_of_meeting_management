import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";

async function GetById({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const data = await prisma.meetingmember.findFirst({
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">
          Meeting Member not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Meeting Member Details
        </h2>

        <div className="space-y-4">
          {/* Meeting Member ID */}
          <div>
            <p className="text-sm text-gray-500">Meeting Member ID</p>
            <p className="text-lg font-medium text-gray-800">
              {data.MeetingMemberID}
            </p>
          </div>

          {/* Meeting Date */}
          <div>
            <p className="text-sm text-gray-500">Meeting Date</p>
            <p className="text-gray-700">
              {new Date(
                data.meetings.MeetingDate
              ).toLocaleDateString()}
            </p>
          </div>

          {/* Meeting Type */}
          <div>
            <p className="text-sm text-gray-500">Meeting Type</p>
            <p className="text-gray-700 font-medium">
              {data.meetings.meetingtype.MeetingTypeName}
            </p>
          </div>

          {/* Staff Name */}
          <div>
            <p className="text-sm text-gray-500">Staff Name</p>
            <p className="text-gray-700 font-medium">
              {data.staff.StaffName}
            </p>
          </div>

          {/* Presence */}
          <div>
            <p className="text-sm text-gray-500">Presence Status</p>
            {data.IsPresent ? (
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Present
              </span>
            ) : (
              <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                Absent
              </span>
            )}
          </div>

          {/* Remarks */}
          <div>
            <p className="text-sm text-gray-500">Remarks</p>
            <p className="text-gray-700">
              {data.Remarks || "—"}
            </p>
          </div>

          {/* Created / Modified */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-gray-700 text-sm">
                {data.Created
                  ? new Date(data.Created).toLocaleString()
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Modified</p>
              <p className="text-gray-700 text-sm">
                {data.Modified
                  ? new Date(data.Modified).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link
          href="/meetingmember"
          className="inline-block mt-6 text-center w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          ← Back to Meeting Members
        </Link>
      </div>
    </div>
  );
}

export default GetById;
