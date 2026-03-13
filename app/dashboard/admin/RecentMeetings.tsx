import { prisma } from "@/lib/prisma";
import MeetingRow from "@/app/components/admindashboard/MeetingRow";
import Link from "next/link";

export default async function RecentMeetings() {
  const meetings = await prisma.meetings.findMany({
    orderBy: { MeetingDate: "desc" },
    take: 5,
    include: { meetingtype: true }
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
              <th className="px-6 py-4">Meeting Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Venue</th>
              <th className="px-6 py-4 text-right">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {meetings.map((meeting) => (
              <MeetingRow
                key={meeting.MeetingID}
                id={meeting.MeetingID}
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