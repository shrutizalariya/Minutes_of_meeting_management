import { AddMeetingAction } from "@/app/actions/AddMeetingAction";
import { prisma } from "@/lib/prisma";

export default async function AddMeetingPage() {
  // Fetch meeting types from DB
  const meetingTypes = await prisma.meetingtype.findMany();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        action={AddMeetingAction}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Add Meeting</h2>

        {/* Meeting Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Meeting Date</label>
          <input
            type="datetime-local"
            name="MeetingDate"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Meeting Type */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Meeting Type</label>
          <select
            name="MeetingTypeID"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a meeting type</option>
            {meetingTypes.map((mt) => (
              <option key={mt.MeetingTypeID} value={mt.MeetingTypeID}>
                {mt.MeetingTypeName}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <textarea
            name="MeetingDescription"
            rows={3}
            placeholder="Optional description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Document Path */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Document Path</label>
          <input
            type="text"
            name="DocumentPath"
            placeholder="Optional file path or URL"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Is Cancelled */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="IsCancelled"
            id="isCancelled"
            className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500"
          />
          <label htmlFor="isCancelled" className="text-gray-700">
            Is Cancelled
          </label>
        </div>

        {/* Cancellation Date & Reason */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Cancellation Date & Time</label>
          <input
            type="datetime-local"
            name="CancellationDateTime"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Cancellation Reason</label>
          <input
            type="text"
            name="CancellationReason"
            placeholder="Optional reason"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Meeting
        </button>
      </form>
    </div>
  );
}
