import { AddMeetingTypeAction } from "@/app/actions/AddMeetingTypeAction";

export default function AddMeetingType() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action={AddMeetingTypeAction}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Add Meeting Type
        </h2>

        {/* Meeting Type Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Meeting Type Name
          </label>
          <input
            type="text"
            name="MeetingTypeName"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Remarks
          </label>
          <input
            type="text"
            name="Remarks"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}