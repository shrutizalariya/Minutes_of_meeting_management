import { AddMeetingAction } from "@/app/actions/AddMeetingAction";
import React from "react";
import { prisma } from "@/lib/prisma";
import { Calendar, Info, FileText } from "lucide-react"; 
export default async function AddMeeting() {
  const m = await prisma.meetingtype.findMany({
    select: {
      MeetingTypeID: true,
      MeetingTypeName: true,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" /> Add Meeting
        </h2>

        <form action={AddMeetingAction} className="space-y-5">
          {/* Meeting Date */}
          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" /> Meeting Date
            </label>
            <input
              type="datetime-local"
              name="MeetingDate"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Meeting Type */}
          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Info className="w-4 h-4 text-gray-500" /> Meeting Type
            </label>
            <select
              name="MeetingTypeID"
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Meeting Type</option>
              {m.map((type) => (
                <option key={type.MeetingTypeID} value={type.MeetingTypeID}>
                  {type.MeetingTypeName}
                </option>
              ))}
            </select>
          </div>

          {/* Meeting Description */}
          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 text-gray-500" /> Description
            </label>
            <input
              type="text"
              name="MeetingDescription"
              placeholder="Enter description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Document Upload */}
          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 text-gray-500" /> Upload Document
            </label>
            <input
              type="file"
              name="DocumentPath"
              accept=".pdf,.doc,.docx"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
          >
            Add Meeting
          </button>
        </form>
      </div>
    </div>
  );
}
