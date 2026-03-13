import React from "react";
import { prisma } from "@/lib/prisma";
import { EditStaffAction } from "@/app/actions/staff/EditStaffAction";

// Helper to split country code from number
function splitMobile(mobile?: string | null) {
  if (!mobile) return { code: "+91", number: "" };
  const number = mobile.slice(-10);
  const code = mobile.slice(0, mobile.length - 10) || "+91";
  return { code, number };
}

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params; // unwrap promise
  const id = Number(idStr);
  if (isNaN(id)) throw new Error("Invalid StaffID");

  // Fetch staff first
  const staff = await prisma.staff.findUnique({
    where: { StaffID: id },
  });

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Staff not found</p>
      </div>
    );
  }

  // Fetch users for dropdown (unassigned users + current linked user)
  const userFilter = staff.UserID
  ? { OR: [{ staff: null }, { Id: staff.UserID }] }
  : { staff: null };

  const users = await prisma.users.findMany({
    where: userFilter,
    select: { Id: true, Name: true, Email: true },
  });

  const { code, number } = splitMobile(staff.MobileNo);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action={EditStaffAction}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">Edit Staff</h2>

        <input type="hidden" name="StaffID" value={staff.StaffID} />

        <div>
          <label className="block text-sm text-gray-600 mb-1">Staff Name</label>
          <input
            type="text"
            name="StaffName"
            defaultValue={staff.StaffName}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Mobile No.</label>
          <div className="flex gap-2">
            <select
              name="CountryCode"
              defaultValue={code}
              className="w-28 border border-gray-300 rounded-md px-2 py-2"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+971">🇦🇪 +971</option>
            </select>
            <input
              type="tel"
              name="MobileNo"
              defaultValue={number}
              pattern="[0-9]{10}"
              required
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            name="EmailAddress"
            defaultValue={staff.EmailAddress ?? ""}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Linked User</label>
          <select
            name="UserID"
            defaultValue={staff.UserID ?? ""}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            {users.map((u) => (
              <option key={u.Id} value={u.Id}>
                {u.Name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Remarks</label>
          <input
            type="text"
            name="Remarks"
            defaultValue={staff.Remarks ?? ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}