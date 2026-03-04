import { prisma } from "@/lib/prisma";

export default async function StaffAttendanceSummary() {
  const staffData = await prisma.staff.findMany({
    include: {
      meetingmember: true,
    },
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="font-semibold text-slate-800 text-base">
          Staff Attendance Summary
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Overview of participation across all scheduled meetings
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-3">Staff Member</th>
              <th className="px-6 py-3">Attendance Rate</th>
              <th className="px-6 py-3 text-right">Count (Attended/Total)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffData.map((staff) => {
              const total = staff.meetingmember.length;
              const attended = staff.meetingmember.filter((m) => m.IsPresent).length;
              const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

              // Logic for color coding
              const barColor = 
                percentage >= 80 ? "bg-emerald-500" : 
                percentage >= 50 ? "bg-amber-500" : "bg-rose-500";

              return (
                <tr key={staff.StaffID} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 border border-slate-200 uppercase">
                        {staff.StaffName.substring(0, 2)}
                      </div>
                      <span className="font-medium text-slate-700">{staff.StaffName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${percentage < 50 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${barColor} transition-all duration-500`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-slate-700">
                        {attended} <span className="text-slate-300 mx-0.5">/</span> {total}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase">
                        Sessions
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}

            {staffData.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-400 text-sm italic">
                  No staff attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}