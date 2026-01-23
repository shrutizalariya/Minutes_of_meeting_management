import { AddMeetingTypeAction } from "@/app/actions/AddMeetingTypeAction";

export default function AddMeetingType() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action={AddMeetingTypeAction}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Add Meeting Member 
        </h2>

        {/* Meeting Member Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Member Name
          </label>
          <input
            type="text"
            name="MemberName"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Meeting Type */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Meeting Type
          </label>
          <input
            type="text"
            name="MeetingType"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Staff Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Staff Name
          </label>
          <input
            type="text"
            name="StaffName"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* IsPresent */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            IsPresent
          </label>
          <input
            type="text"
            name="IsPresent"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* IsPresent */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            IsPresent
          </label>
          <input
            type="text"
            name="IsPresent"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* IsPresent */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            IsPresent
          </label>
          <input
            type="text"
            name="IsPresent"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

         {/* IsPresent */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            IsPresent
          </label>
          <input
            type="text"
            name="IsPresent"
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