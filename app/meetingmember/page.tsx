import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButtonForMeetingMember from "../ui/DeleteButtonForMeetingMember";

export default async function GetAll() {
  const rows = await prisma.meetingmember.findMany({
    include: {
      staff: true,
      meetings: {
        include: {
          meetingtype: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Meeting Members
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="px-4 py-3">MeetingMemberID</th>
                <th className="px-4 py-3">Meeting Date</th>
                <th className="px-4 py-3">Meeting Type</th>
                <th className="px-4 py-3">Staff Name</th>
                <th className="px-4 py-3">Is Present</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Modified</th>
                <th className="px-4 py-3">View</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((mm:any) => (
                <tr
                  key={mm.MeetingMemberID}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* MeetingMemberID */}
                  <td className="px-4 py-3 text-gray-700">
                    {mm.MeetingMemberID}
                  </td>

                  {/* Meeting Date */}
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(mm.meetings.MeetingDate).toLocaleDateString()}
                  </td>

                  {/* Meeting Type */}
                  <td className="px-4 py-3 text-gray-700">
                    {mm.meetings.meetingtype.MeetingTypeName}
                  </td>

                  {/* Staff Name */}
                  <td className="px-4 py-3 text-gray-700">
                    {mm.staff.StaffName}
                  </td>

                  {/* IsPresent */}
                  <td className="px-4 py-3">
                    {mm.IsPresent ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Yes
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        No
                      </span>
                    )}
                  </td>

                  {/* Remarks */}
                  <td className="px-4 py-3 max-w-xs truncate text-gray-700">
                    {mm.Remarks || "—"}
                  </td>

                  {/* Created */}
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {mm.Created
                      ? new Date(mm.Created).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* Modified */}
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {mm.Modified
                      ? new Date(mm.Modified).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* View */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/meetingmember/${mm.MeetingMemberID}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>

                  {/* Edit */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/meetingmember/edit/${mm.MeetingMemberID}`}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3">
                    <DeleteButtonForMeetingMember id={mm.MeetingMemberID} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No meeting members found.
          </p>
        )}
      </div>
    </div>
  );
}
