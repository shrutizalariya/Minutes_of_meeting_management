import { prisma } from "@/lib/prisma";
import MeetingRow from "@/app/components/admindashboard/MeetingRow";
import Link from "next/link"

export default async function RecentMeetings() {
  const meetings = await prisma.meetings.findMany({
    orderBy: { MeetingDate: "desc" },
    take: 5,
    include: { meetingtype: true } // fetch related type
  });

  return (
    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Recent Meetings</h2>
        <button className="text-xs font-bold text-blue-600 hover:underline"><Link href="/meetings">View All</Link></button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-8 py-4">Meeting Details</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-8 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {meetings.map((meeting) => (
              <MeetingRow
                key={meeting.MeetingID}
                title={meeting.MeetingDescription || "No description"}
                date={meeting.MeetingDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                type={meeting.meetingtype?.MeetingTypeName || "General"}
                location={meeting.Location || "TBD"}
                status={meeting.Status}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}