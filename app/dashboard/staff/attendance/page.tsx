import React from "react";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStaffAttendance } from "../StaffDashboardService";
import AttendanceChart from "./AttendanceChart";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  ArrowLeft,
  Activity,
  UserCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const pageSize = 10;

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) redirect("/");

  const payload: any = await verifyToken(tokenCookie.value);
  if (!payload || !payload.id) redirect("/");

  const staff = await prisma.staff.findUnique({
    where: { UserID: payload.id }
  });

  if (!staff) {
    return <div className="p-8 text-center text-amber-500 font-bold">No staff profile found for your account.</div>;
  }

  const attendanceData = await getStaffAttendance(staff.StaffID, currentPage, pageSize);
  const totalPages = Math.ceil(attendanceData.totalRecords / pageSize);

  return (
    <div className="space-y-10" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/staff" className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 no-underline hover:text-emerald-700 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Workspace
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Attendance Registry</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Detailed tracking of your participation in meetings and events.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
          <Activity size={20} className="text-emerald-500" />
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</div>
            <div className="text-sm font-black text-slate-900">Active Profile</div>
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-2">
          <AttendanceChart data={attendanceData.monthlyData} />
        </div>

        {/* Mini Stats Column */}
        <div className="space-y-6">
          <KPIStat 
            label="Attendance Rate" 
            value={`${attendanceData.attendanceRate}%`} 
            subtext="Overall Participation"
            icon={<UserCheck size={22} />} 
            color="emerald" 
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm">
              <div className="text-emerald-500 mb-2"><CheckCircle size={20} /></div>
              <div className="text-2xl font-black text-slate-900">{attendanceData.totalPresent}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Present</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm">
              <div className="text-amber-500 mb-2"><XCircle size={20} /></div>
              <div className="text-2xl font-black text-slate-900">{attendanceData.totalAbsent}</div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Absent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
            <Clock size={18} className="text-emerald-600" />
            Participation Log
          </h2>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">
            {attendanceData.totalRecords} Total Sessions
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendanceData.records.length > 0 ? attendanceData.records.map((record) => (
                <tr key={`${record.category}-${record.id}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-800">{record.description}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      record.category === 'Event' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {record.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                      <Calendar size={14} className="opacity-40" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {record.isPresent ? (
                      <div className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                        <CheckCircle size={12} strokeWidth={3} /> Present
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-slate-400 bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-slate-200">
                        <AlertCircle size={12} strokeWidth={3} /> Absent
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs text-slate-500 font-medium italic max-w-xs truncate" title={record.remarks}>
                      {record.remarks}
                    </p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                        <Calendar size={24} />
                      </div>
                      <p className="text-slate-400 font-medium italic">No attendance records found yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, attendanceData.totalRecords)} of {attendanceData.totalRecords}
            </p>
            <div className="flex items-center gap-2">
              <Link 
                href={`/dashboard/staff/attendance?page=${currentPage - 1}`}
                className={`p-2 rounded-xl transition-all ${
                  currentPage <= 1 
                  ? 'text-slate-200 pointer-events-none' 
                  : 'text-slate-400 hover:bg-white hover:text-emerald-600 shadow-sm'
                }`}
              >
                <ChevronLeft size={20} />
              </Link>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <Link
                    key={i + 1}
                    href={`/dashboard/staff/attendance?page=${i + 1}`}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${
                      currentPage === i + 1
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:bg-white'
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>
              <Link 
                href={`/dashboard/staff/attendance?page=${currentPage + 1}`}
                className={`p-2 rounded-xl transition-all ${
                  currentPage >= totalPages 
                  ? 'text-slate-200 pointer-events-none' 
                  : 'text-slate-400 hover:bg-white hover:text-emerald-600 shadow-sm'
                }`}
              >
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KPIStat({ label, value, subtext, icon, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_4px_12px_rgba(16,185,129,0.1)]',
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-[0_4px_12px_rgba(59,130,246,0.1)]',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-[0_4px_12px_rgba(245,158,11,0.1)]',
  };

  return (
    <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:shadow-[0_15px_45px_rgb(0,0,0,0.04)] transition-all duration-300">
      <div className="flex justify-between items-start mb-5">
        <div className={`h-14 w-14 rounded-2xl ${colors[color]} flex items-center justify-center border group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Stats</div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          <span className="text-[10px] text-slate-400 font-medium">{subtext}</span>
        </div>
      </div>
    </div>
  );
}
