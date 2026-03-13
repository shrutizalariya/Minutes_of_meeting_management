// app/dashboard/staff/page.tsx
import StaffDashboard from "./StaffDashboard";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { getStaffDashboard } from "./StaffDashboardService";

export default async function StaffDashboardPage() {
  const cookieStore =  cookies();
  const tokenCookie = (await cookieStore).get("token");

  if (!tokenCookie) return <p>Please login</p>;

  const payload: any = verifyJwt(tokenCookie.value);
  if (!payload) return <p>Invalid token</p>;

  const staffId = payload.staffId;
  const dashboardData = await getStaffDashboard(staffId);

  return <StaffDashboard {...dashboardData} />;
}