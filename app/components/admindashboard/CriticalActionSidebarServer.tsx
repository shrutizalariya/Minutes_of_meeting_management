import { prisma } from "@/lib/prisma"; // your prisma client
import ActionItemWidget from "./ActionItemWidget";

export type CriticalActionItem = {
  MeetingMemberID: number;
  IsPresent: boolean | null;
  meetings: {
    MeetingDate: Date;
    MeetingDescription: string | null;
    Status: string | null;
  };
  staff: {
    StaffName: string;
  };
};

export default async function CriticalActionSidebar() {
  // Fetch critical items
  const items: CriticalActionItem[] = await prisma.meetingmember.findMany({
    where: {
      OR: [
        { IsPresent: false },
        { meetings: { Status: { in: ["Scheduled", "Completed"] } } },
      ],
    },
    include: {
      meetings: true,
      staff: true,
    },
    orderBy: {
      meetings: { MeetingDate: "desc" },
    },
    take: 15,
  });

  const overdueItems = items.filter(item => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meetingDate = new Date(item.meetings.MeetingDate);
    meetingDate.setHours(0, 0, 0, 0);
    return !item.IsPresent && meetingDate < today && item.meetings.Status !== "Completed";
  });

  const pendingItems = items.filter(item => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meetingDate = new Date(item.meetings.MeetingDate);
    meetingDate.setHours(0, 0, 0, 0);
    return item.meetings.Status === "Scheduled" && meetingDate >= today;
  });

  const resolvedItems = items.filter(item => item.meetings.Status === "Completed").slice(0, 3);

  return (
    <div className="space-y-8">
      {/* RED - CRITICAL */}
      {overdueItems.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <h3 className="font-black text-rose-600 text-[10px] uppercase tracking-widest">Critical Overdue</h3>
          </div>
          <div className="space-y-3">
            {overdueItems.map((item) => (
              <ActionItemWidget
                key={item.MeetingMemberID}
                id={item.MeetingMemberID}
                task={item.meetings.MeetingDescription || "No description"}
                assigned={item.staff.StaffName}
                deadline={item.meetings.MeetingDate.toISOString()}
                overdue={true}
                priority="red"
              />
            ))}
          </div>
        </section>
      )}

      {/* YELLOW - PENDING */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <h3 className="font-black text-amber-600 text-[10px] uppercase tracking-widest">Pending Sync</h3>
        </div>
        <div className="space-y-3">
          {pendingItems.length > 0 ? pendingItems.map((item) => (
            <ActionItemWidget
              key={item.MeetingMemberID}
              id={item.MeetingMemberID}
              task={item.meetings.MeetingDescription || "No description"}
              assigned={item.staff.StaffName}
              deadline={item.meetings.MeetingDate.toISOString()}
              overdue={false}
              priority="yellow"
            />
          )) : (
            <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No Pending Tasks</p>
            </div>
          )}
        </div>
      </section>

      {/* GREEN - RESOLVED */}
      {resolvedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="font-black text-emerald-600 text-[10px] uppercase tracking-widest">Recently Resolved</h3>
          </div>
          <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {resolvedItems.map((item) => (
              <ActionItemWidget
                key={item.MeetingMemberID}
                id={item.MeetingMemberID}
                task={item.meetings.MeetingDescription || "No description"}
                assigned={item.staff.StaffName}
                deadline={item.meetings.MeetingDate.toISOString()}
                overdue={false}
                priority="green"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}