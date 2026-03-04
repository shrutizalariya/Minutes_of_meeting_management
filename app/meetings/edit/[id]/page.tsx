import React from "react";
import { prisma } from "@/lib/prisma";
import { EditMeetingAction } from "@/app/actions/EditMeetingAction";
import { Calendar, FileText, Info } from "lucide-react";

export default async function EditMeeting({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await prisma.meetings.findFirst({
    where: { MeetingID: Number(id) },
  });

  const types = await prisma.meetingtype.findMany({
    select: {
      MeetingTypeID: true,
      MeetingTypeName: true,
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full p-8 space-y-6">

        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <FileText className="w-12 h-12 text-blue-600" />
        </div>

        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Edit Meeting
        </h2>

        {/* FORM */}
        <form
          action={EditMeetingAction}
          encType="multipart/form-data"
          className="space-y-5"
        >

          {/* Hidden Fields */}
          <input type="hidden" name="MeetingID" value={data?.MeetingID} />
          <input
            type="hidden"
            name="OldDocumentPath"
            value={data?.DocumentPath ?? ""}
          />

          {/* Meeting Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meeting Date
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                name="MeetingDate"
                required
                defaultValue={
                  data?.MeetingDate
                    ? new Date(data.MeetingDate).toISOString().slice(0, 16)
                    : ""
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Meeting Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meeting Type
            </label>
            <select
              name="MeetingType"
              required
              defaultValue={data?.MeetingTypeID}
              className="w-full border border-gray-300 rounded-lg p-3 h-36 overflow-y-auto focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Meeting Type</option>
              {types.map((t) => (
                <option key={t.MeetingTypeID} value={t.MeetingTypeID}>
                  {t.MeetingTypeName}
                </option>
              ))}
            </select>
          </div>

          {/* Meeting Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meeting Description
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3">
                <Info className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="MeetingDescription"
                required
                defaultValue={data?.MeetingDescription ?? ""}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          

          {/* Existing Document */}
          {data?.DocumentPath && (
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-600 mb-1">Current Document:</p>
              <a
                href={data.DocumentPath}
                target="_blank"
                className="text-blue-600 font-medium hover:underline"
              >
                View Document
              </a>
            </div>
          )}

          {/* Upload New Document */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload New Document
            </label>
            <input
              type="file"
              name="DocumentPath"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Update Meeting
          </button>

        </form>
      </div>
    </div>
  );
}