import { AddStaffAction } from "@/app/actions/staff/AddStaffAction";

export default function AddStaff() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action={AddStaffAction}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Add Staff 
        </h2>

        {/* Meeting Type Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Staff Name
          </label>
          <input
            type="text"
            name="StaffName"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Mobile No.
          </label>
          <input
            type="text"
            name="MobileNo"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            EmailAddress
          </label>
          <input
            type="text"
            name="EmailAddress"
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