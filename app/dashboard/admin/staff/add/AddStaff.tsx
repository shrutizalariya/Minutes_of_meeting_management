"use client";

import { AddStaffAction } from "@/app/actions/staff/AddStaffAction";

export default function AddStaff({ users = [] }: any) {
  console.log("Users:", users);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action={AddStaffAction}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Add Staff
        </h2>

        {/* Staff Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Staff Name
          </label>
          <input
            type="text"
            name="StaffName"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Mobile No.
          </label>
          <div className="flex gap-2">
            <select
              name="CountryCode"
              required
              className="w-28 border border-gray-300 rounded-md px-2 py-2"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
            </select>

            <input
              type="tel"
              name="MobileNo"
              required
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="EmailAddress"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* User Dropdown */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Select User
          </label>

          <select
            name="UserID"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">-- Select User --</option>

            {users.map((u: any) => (
              <option key={u.Id} value={u.Id}>
                {u.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Remarks
          </label>
          <input
            type="text"
            name="Remarks"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Save
        </button>
      </form>
    </div>
  );
}