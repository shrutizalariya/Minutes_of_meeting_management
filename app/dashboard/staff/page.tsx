// app/dashboard/staff/page.tsx
import StaffDashboard from "./StaffDashboard";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getStaffDashboard } from "./StaffDashboardService";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function StaffDashboardPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) {
    redirect("/");
  }

  const payload: any = await verifyToken(tokenCookie.value);
  if (!payload || !payload.id) {
    redirect("/");
  }

  // Find staff record associated with this user
  let staff = await prisma.staff.findUnique({
    where: { UserID: payload.id }
  });

  // Proactive fix: If user has 'staff' role but no record, create one
  if (!staff && payload.role === 'staff') {
    const user = await prisma.users.findUnique({ where: { Id: payload.id } });
    if (user) {
      staff = await prisma.staff.create({
        data: {
          UserID: user.Id,
          StaffName: user.Email?.split('@')[0] || "Staff Member",
          EmailAddress: user.Email,
          MobileNo: "", // Placeholder
        }
      });
    }
  }

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md text-center">
          <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-slate-500 font-medium mb-6">No staff profile is associated with your account. Please contact your administrator to link your profile.</p>
          <button onClick={() => redirect("/")} className="w-full bg-slate-900 text-white rounded-xl py-3 font-bold hover:bg-slate-800 transition-colors">Return Home</button>
        </div>
      </div>
    );
  }

  const dashboardData = await getStaffDashboard(staff.StaffID);
  const staffName = staff.StaffName;

  return <StaffDashboard {...dashboardData} staffName={staffName} />;
}