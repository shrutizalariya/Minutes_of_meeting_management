import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButtonForStaff from "@/app/ui/DeleteButtonForStaff";

function formatMobile(mobile?: string | null) {
  if (!mobile) return "—";
  return `${mobile.slice(0, mobile.length - 10)} ${mobile.slice(-10)}`;
}

export default async function GetAll() {
  const rows = await prisma.staff.findMany({
      include: {
        user: true, 
      },  
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Staff Details
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="px-4 py-3">StaffID</th>
                <th className="px-4 py-3">Staff Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Mobile No.</th>
                <th className="px-4 py-3">Linked User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Modified</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s: any) => (
                <tr key={s.StaffID} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{s.StaffID}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.StaffName}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.EmailAddress}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{formatMobile(s.MobileNo)}</td>
                  <td className="px-4 py-3">{s.user ? s.user.Name : "—"}</td>
                  <td className="px-4 py-3">{s.user ? s.user.Role : "—"}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.Remarks}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{s.Created ? new Date(s.Created).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{s.Modified ? new Date(s.Modified).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3"><Link href={`/dashboard/admin/staff/${s.StaffID}`} className="text-blue-600 hover:underline">View</Link></td>
                  <td className="px-4 py-3"><Link href={`/dashboard/admin/staff/edit/${s.StaffID}`} className="text-green-600 hover:underline">Edit</Link></td>
                  <td className="px-4 py-3"><DeleteButtonForStaff id={s.StaffID} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No staff found.</p>
        )}
      </div>
    </div>
  );
}
