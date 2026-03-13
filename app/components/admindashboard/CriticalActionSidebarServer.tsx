import { prisma } from "@/lib/prisma"; // your prisma client
import ActionItemWidget from "./ActionItemWidget";

export type CriticalActionItem = {
  MeetingMemberID: number;
  IsPresent: boolean | null;
  meetings: {
    MeetingDate: Date;
    MeetingDescription: string | null;
  };
  staff: {
    StaffName: string;
  };
};

export default async function CriticalActionSidebar() {
  // Fetch critical/unattended meetings
  const items: CriticalActionItem[] = await prisma.meetingmember.findMany({
    where: {
      OR: [
        { IsPresent: false },
        { meetings: { Status: "Scheduled" } },
      ],
    },
    include: {
      meetings: true,
      staff: true,
    },
    orderBy: {
      meetings: { MeetingDate: "asc" },
    },
    take: 10,
  });

  return (
    <div>
      <h2 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-6 opacity-50">
        Critical Action Items
      </h2>

      <div className="space-y-4">
        {items.map((item) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const meetingDate = new Date(item.meetings.MeetingDate);
          meetingDate.setHours(0, 0, 0, 0);

          const isOverdue = !item.IsPresent && meetingDate <= today;

          return (
            <ActionItemWidget
              key={item.MeetingMemberID}
              id={item.MeetingMemberID}
              task={item.meetings.MeetingDescription || "No description"}
              assigned={item.staff.StaffName}
              deadline={item.meetings.MeetingDate.toISOString()}
              overdue={isOverdue}
            />
          );
        })}
      </div>
    </div>
  );
}