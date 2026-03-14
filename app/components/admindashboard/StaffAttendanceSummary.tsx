import { prisma } from "@/lib/prisma";
import SendAlertButton from "@/app/ui/SendAlertButton";
import PaginationControls from "@/app/ui/PaginationControls";
import { Suspense } from "react";
import { Activity, CheckCircle, SearchX } from "lucide-react";
import ExportExcelButton from "@/app/ui/ExportExcelButton";

const PAGE_SIZE = 10;

export default async function StaffAttendanceSummary({ keyword = "", page = 1 }: { keyword?: string; page?: number }) {
  const where: any = {};
  if (keyword) {
    where.OR = [
      { StaffName: { contains: keyword } },
      { MobileNo: { contains: keyword } },
    ];
  }

  const [totalRecords, staffData] = await Promise.all([
    prisma.staff.count({ where }),
    prisma.staff.findMany({
      where,
      include: {
        meetingmember: {
          include: {
            meetings: true
          }
        },
      },
      orderBy: { StaffName: "asc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);
  const safePage = Math.max(1, Math.min(page, totalPages));

  const attendanceColumns = [
    { header: "Staff Name", key: "StaffName" },
    { header: "Email", key: "EmailAddress" },
    { header: "Mobile", key: "MobileNo" },
    { header: "Total Sessions", key: "totalMeetings" },
    { header: "Attended", key: "attended" },
    { header: "Attendance Rate (%)", key: "percentage" },
  ];

  const exportRows = staffData.map((staff: any) => {
    const attended = staff.meetingmember.filter((m: any) => m.IsPresent).length;
    const totalMeetings = staff.meetingmember.length;
    const percentage = totalMeetings > 0 ? Math.round((attended / totalMeetings) * 100) : 0;
    return {
      ...staff,
      attended,
      totalMeetings,
      percentage
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100/60">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Attendance Summary</h3>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 mt-2">
              {totalRecords} Records Found
            </span>
          </div>
          <ExportExcelButton
            data={exportRows}
            columns={attendanceColumns}
            fileName="staff_attendance_comprehensive"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4 min-w-[200px]">Attendance Performance</th>
                  <th className="px-6 py-4 text-center">Session Count</th>
                  <th className="px-6 py-4 text-right">Engagement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {staffData.map((staff: any) => {
                  const attended = staff.meetingmember.filter((m: any) => m.IsPresent).length;
                  const totalMeetings = staff.meetingmember.length;
                  const percentage = totalMeetings > 0 ? Math.round((attended / totalMeetings) * 100) : 0;

                  const barColor =
                    percentage >= 80 ? "bg-emerald-500" :
                    percentage >= 50 ? "bg-amber-500" : "bg-rose-500";

                  const textColor =
                    percentage >= 80 ? "text-emerald-600" :
                    percentage >= 50 ? "text-amber-600" : "text-rose-600";
                  
                  const bgColor = 
                    percentage >= 80 ? "bg-emerald-50 text-emerald-600" :
                    percentage >= 50 ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500";

                  return (
                    <tr key={staff.StaffID} className="hover:bg-slate-50/50 transition-colors duration-200 group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${bgColor}`}>
                            <Activity size={20} strokeWidth={2.5} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{staff.StaffName}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {staff.EmailAddress || "No email"} <span className="mx-1 text-slate-300">·</span> {staff.MobileNo || "No contact"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2 w-full max-w-[180px]">
                          <div className="flex justify-between items-end">
                            <span className={`text-[10px] font-bold ${textColor} uppercase tracking-[0.05em]`}>
                              Performance Index
                            </span>
                            <span className={`text-xs font-black ${textColor}`}>
                              {percentage}%
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`h-full rounded-full ${barColor} shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex flex-col items-center px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100/80 group-hover:bg-white transition-colors duration-200">
                          <span className="text-lg font-black text-slate-800">
                            {attended} <span className="text-slate-300 font-medium mx-0.5">/</span> {totalMeetings}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Total Sessions
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right flex justify-end">
                        {attended === 0 && totalMeetings > 0 ? (
                          <SendAlertButton
                            staffID={staff.StaffID}
                            staffName={staff.StaffName}
                            staffEmail={staff.EmailAddress || ""}
                          />
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-bold border border-emerald-100/50 uppercase tracking-wider">
                            <CheckCircle size={14} strokeWidth={2.5} />
                            Good Standing
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {staffData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <SearchX size={32} className="text-slate-300" />
                        </div>
                        <h4 className="text-base font-bold text-slate-700">No records found</h4>
                        <p className="text-sm mt-1">Try searching for a different staff member.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER (Pagination) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-500">
            Page <span className="font-bold text-slate-700">{safePage}</span> of <span className="font-bold text-slate-700">{totalPages || 1}</span>
            <span className="mx-2 text-slate-300">·</span>
            <span className="font-bold text-slate-700">{totalRecords}</span> total records
          </p>

          <Suspense fallback={<div className="h-10 w-32 bg-slate-50 rounded-xl animate-pulse" />}>
            <PaginationControls
              totalRecords={totalRecords}
              pageSize={PAGE_SIZE}
              currentPage={safePage}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
