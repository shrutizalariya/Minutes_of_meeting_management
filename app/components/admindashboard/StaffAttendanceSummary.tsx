import { prisma } from "@/lib/prisma";
import SendAlertButton from "@/app/ui/SendAlertButton";
import PaginationControls from "@/app/ui/PaginationControls";
import { Suspense } from "react";
import { Activity, CheckCircle } from "lucide-react";
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
      <div className="tc">
        <div className="th" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Attendance Summary</h3>
            <span className="rb">{totalRecords} Records</span>
          </div>
          <ExportExcelButton
            data={exportRows}
            columns={attendanceColumns}
            fileName="staff_attendance_comprehensive"
          />
        </div>

        <div className="overflow-x-auto" style={{ borderRadius: '16px', border: '1px solid #f1f5f9' }}>
          <table id="attendance-report" style={{ borderCollapse: 'separate', borderSpacing: '0 0.5rem', background: 'transparent' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '1rem 1.5rem', borderRadius: '16px 0 0 0' }}>Staff Member</th>
                <th style={{ padding: '1rem 1.5rem' }}>Attendance Performance</th>
                <th className="c" style={{ padding: '1rem 1.5rem' }}>Session Count</th>
                <th className="r" style={{ padding: '1rem 1.5rem', borderRadius: '0 16px 0 0' }}>Engagement Action</th>
              </tr>
            </thead>
            <tbody style={{ background: 'transparent' }}>
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

                return (
                  <tr key={staff.StaffID} className="group" style={{ background: '#fff', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.02)' }}>
                    <td style={{ padding: '1.2rem 1.5rem', borderRadius: '12px 0 0 12px', borderBottom: '1px solid #f8fafc' }}>
                      <div className="ri">
                        <div className="rav" style={{
                          background: percentage >= 80 ? '#f0fdf4' : (percentage >= 50 ? '#fffbeb' : '#fff1f2'),
                          color: percentage >= 80 ? '#10b981' : (percentage >= 50 ? '#f59e0b' : '#f43f5e'),
                          borderRadius: '12px',
                          width: '44px',
                          height: '44px'
                        }}>
                          <Activity size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="rt" style={{ fontSize: '0.95rem', fontWeight: 800 }}>{staff.StaffName}</div>
                          <div className="rm" style={{ fontSize: '0.75rem', marginTop: '2px', opacity: 0.7 }}>
                            {staff.EmailAddress || "No email"} &nbsp;·&nbsp; {staff.MobileNo || "No contact"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #f8fafc' }}>
                      <div className="flex flex-col gap-2.5 w-full max-w-[180px]">
                        <div className="flex justify-between items-end">
                          <span className={`text-[10px] font-black ${textColor} uppercase tracking-[0.05em]`}>
                            Performance Index
                          </span>
                          <span className={`text-xs font-black ${textColor}`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full ${barColor} shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="c" style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #f8fafc' }}>
                      <div className="inline-flex flex-col items-center px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <span className="sv" style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b' }}>
                          {attended} <span className="text-slate-300 font-medium mx-0.5">/</span> {totalMeetings}
                        </span>
                        <span className="sl" style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Total Sessions
                        </span>
                      </div>
                    </td>
                    <td className="r" style={{ padding: '1.2rem 1.5rem', borderRadius: '0 12px 12px 0', borderBottom: '1px solid #f8fafc' }}>
                      {attended === 0 && totalMeetings > 0 ? (
                        <SendAlertButton
                          staffID={staff.StaffID}
                          staffName={staff.StaffName}
                          staffEmail={staff.EmailAddress || ""}
                        />
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
                          <CheckCircle size={12} strokeWidth={3} />
                          Good Standing
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {staffData.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="es">
                      <div className="es-icon"><Activity size={28} /></div>
                      <h4>No records found</h4>
                      <p>Try searching for a different staff member.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER (Pagination) */}
        <div className="tf">
          <p className="pi">
            Page {safePage} of {totalPages || 1} &nbsp;·&nbsp; {totalRecords} total records
          </p>

          <Suspense fallback={<div style={{ height: 32 }} />}>
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
