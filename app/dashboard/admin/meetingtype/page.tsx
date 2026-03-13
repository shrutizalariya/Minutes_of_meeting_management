import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/app/ui/DeleteButton";

export default async function GetAll() {
  const rows = await prisma.meetingtype.findMany();
    
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Meeting Types
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Meeting Type</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((m: any) => (
                <tr
                  key={m.MeetingTypeID}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{m.MeetingTypeID}</td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {m.MeetingTypeName}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {m.Remarks}
                  </td>

                  {/* View */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/meetingtype/${m.MeetingTypeID}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>

                  {/* Edit */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/meetingtype/edit/${m.MeetingTypeID}`}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3">
                    <DeleteButton id={m.MeetingTypeID} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No meeting types found.
          </p>
        )}
      </div>
    </div>
  );
}