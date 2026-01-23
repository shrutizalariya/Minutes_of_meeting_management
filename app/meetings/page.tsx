import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButtonForMeetings from "../ui/DeleteButtonForMeetings";

export default async function GetAll() {
    const rows = await prisma.meetings.findMany({  include: {
            meetingtype: true,
    },});
    
    return (
        <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Meetings
            </h2>

            <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-200 text-gray-700 text-left">
                    <th className="px-4 py-3">MeetingID</th>
                    <th className="px-4 py-3">Meeting Date</th>
                    <th className="px-4 py-3">MeetingType</th>
                    <th className="px-4 py-3">MeetingDescription</th>
                    <th className="px-4 py-3">DocumentPath</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Modified</th>
                    <th className="px-4 py-3">IsCancelled</th>
                    <th className="px-4 py-3">CancellationDateTime</th>
                    <th className="px-4 py-3">CancellationReason</th>
                    <th className="px-4 py-3">view</th>
                    <th className="px-4 py-3">Edit</th>
                    <th className="px-4 py-3">Delete</th>
                </tr>
                </thead>

                <tbody>
                    {rows.map((m: any) => (
                        <tr
                        key={m.MeetingID}
                        className="border-b hover:bg-gray-50 transition"
                        >
                        {/* MeetingID */}
                        <td className="px-4 py-3 text-gray-700">
                            {m.MeetingID}
                        </td>

                        {/* Meeting Date */}
                        <td className="px-4 py-3 text-gray-700">
                            {new Date(m.MeetingDate).toLocaleDateString()}
                        </td>

                        {/* MeetingTypeID */}
                        <td className="px-4 py-3 text-gray-700">
                            {m.meetingtype?.MeetingTypeName}
                        </td>

                        {/* Meeting Description */}
                        <td className="px-4 py-3 max-w-xs truncate text-gray-800">
                            {m.MeetingDescription}
                        </td>

                        {/* Document Path */}
                        <td className="px-4 py-3">
                            {m.DocumentPath ? (
                            <a
                                href={m.DocumentPath}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                            >
                                View File
                            </a>
                            ) : (
                            <span className="text-gray-400">—</span>
                            )}
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3 text-gray-600 text-sm">
                            {new Date(m.Created).toLocaleDateString()}
                        </td>

                        {/* Modified */}
                        <td className="px-4 py-3 text-gray-600 text-sm">
                            {m.Modified
                            ? new Date(m.Modified).toLocaleDateString()
                            : "—"}
                        </td>

                        {/* IsCancelled */}
                        <td className="px-4 py-3">
                            {m.IsCancelled ? (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                                Yes
                            </span>
                            ) : (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                No
                            </span>
                            )}
                        </td>

                        {/* CancellationDateTime */}
                        <td className="px-4 py-3 text-sm text-gray-600">
                            {m.CancellationDateTime
                            ? new Date(m.CancellationDateTime).toLocaleString()
                            : "—"}
                        </td>

                        {/* CancellationReason */}
                        <td className="px-4 py-3 max-w-xs truncate text-gray-700">
                            {m.CancellationReason || "—"}
                        </td>

                        {/* View */}
                        <td className="px-4 py-3">
                            <Link
                            href={`/meetings/${m.MeetingID}`}
                            className="text-blue-600 hover:underline"
                            >
                            View
                            </Link>
                        </td>

                        {/* Edit */}
                        <td className="px-4 py-3">
                            <Link
                            href={`/meetings/edit/${m.MeetingID}`}
                            className="text-green-600 hover:underline"
                            >
                            Edit
                            </Link>
                        </td>

                        {/* Delete */}
                        <td className="px-4 py-3">
                            <DeleteButtonForMeetings id={m.MeetingID} />
                        </td>
                        </tr>
                    ))}
                </tbody>

            </table>
            </div>

            {rows.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
                No meeting found.
            </p>
            )}
        </div>
        </div>
    );
}