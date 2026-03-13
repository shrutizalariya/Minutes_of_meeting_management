import { BarChart2, FileText, Activity, CalendarDays, PieChart, TrendingUp, Users, Search, RotateCcw, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ExportExcelButton from "@/app/ui/ExportExcelButton";
import Link from "next/link";

interface SearchParams {
    from?: string;
    to?: string;
    type?: string;
}

export default async function ReportsDashboard({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const from = params?.from || "";
    const to = params?.to || "";
    const type = params?.type || "";

    const meetingWhere: any = {};
    const eventWhere: any = {};

    if (from || to) {
        const dateRange = {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
        };
        meetingWhere.MeetingDate = dateRange;
        eventWhere.EventDate = dateRange;
    }

    if (type) {
        meetingWhere.MeetingTypeID = Number(type);
        eventWhere.EventTypeID = Number(type); // Assuming types are somewhat aligned or just applied to meetings
    }

    // Fetch high-level stats for reports (unfiltered for context or filtered?)
    // Let's filter stats too if date range is set
    const statsWhere = { ...meetingWhere };
    // Fetch high-level stats for reports
    const [meetingCount, eventCount, staffCount, meetingTypes, eventTypes] = await Promise.all([
        prisma.meetings.count({ where: meetingWhere }),
        prisma.events.count({ where: eventWhere }),
        prisma.staff.count(),
        prisma.meetingtype.findMany({
            include: {
                _count: {
                    select: { meetings: { where: meetingWhere } }
                }
            }
        }),
        prisma.eventtype.findMany()
    ]);

    // Comprehensive Meetings Data for Export
    const allMeetings = await prisma.meetings.findMany({
        where: meetingWhere,
        include: { meetingtype: true, meetingmember: { include: { staff: true } } },
        orderBy: { MeetingDate: "desc" }
    });

    const meetingColumns = [
        { header: "Meeting ID", key: "MeetingID" },
        { header: "Description", key: "MeetingDescription" },
        { header: "Type", key: "meetingtype.MeetingTypeName" },
        { header: "Date", key: "MeetingDate" },
        { header: "Location", key: "Location" },
        { header: "Agenda", key: "Agenda" },
        { header: "Discussion", key: "Discussion" },
        { header: "Conclusions", key: "Conclusions" },
        { header: "Participants", key: "participants" },
    ];

    const exportMeetings = allMeetings.map(m => ({
        ...m,
        MeetingDate: new Date(m.MeetingDate).toLocaleDateString(),
        participants: m.meetingmember.map(mm => mm.staff?.StaffName).join(", ")
    }));

    // Comprehensive Events Data for Export
    const allEvents = await prisma.events.findMany({
        where: eventWhere,
        include: { eventtype: true },
        orderBy: { EventDate: "desc" }
    });

    const eventColumns = [
        { header: "Event ID", key: "EventID" },
        { header: "Description", key: "EventDescription" },
        { header: "Type", key: "eventtype.EventTypeName" },
        { header: "Date", key: "EventDate" },
        { header: "Location", key: "Location" },
        { header: "Status", key: "Status" },
    ];

    const exportEvents = allEvents.map(e => ({
        ...e,
        EventDate: new Date(e.EventDate).toLocaleDateString()
    }));

    return (
        <div className="space-y-8" style={{ fontFamily: "'Sora', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        .report-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 2rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .report-card:hover { transform: translateY(-4px); border-color: #3b82f6; box-shadow: 0 20px 40px -15px rgba(59, 130, 246, 0.1); }
        .icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
      `}</style>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                        <PieChart size={14} strokeWidth={3} /> Insights Center
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Reports & Analytics</h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Generate comprehensive summaries and export entire module datasets.</p>
                </div>
            </div>

            {/* Dynamic Filters Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <Calendar size={16} />
                    </div>
                    <h2 className="text-sm font-bold text-slate-800">Dynamic Report Filters</h2>
                </div>
                <form method="GET" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 align-end">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From Date</label>
                            <input
                                type="date"
                                name="from"
                                defaultValue={from}
                                className="w-full bg-slate-50 border-1.5 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To Date</label>
                            <input
                                type="date"
                                name="to"
                                defaultValue={to}
                                className="w-full bg-slate-50 border-1.5 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category / Type</label>
                            <select
                                name="type"
                                defaultValue={type}
                                className="w-full bg-slate-50 border-1.5 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition-all"
                            >
                                <option value="">All Categories</option>
                                {meetingTypes.map(t => (
                                    <option key={t.MeetingTypeID} value={t.MeetingTypeID}>{t.MeetingTypeName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-50">
                        <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                            <Search size={14} /> Update Reports
                        </button>
                        <Link href="/dashboard/admin/reports" className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
                            <RotateCcw size={14} /> Reset
                        </Link>
                    </div>
                </form>
            </div>

            {/* Report Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">

                {/* Meetings Summary Report */}
                <div className="report-card">
                    <div className="icon-box bg-blue-50 text-blue-600">
                        <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Meetings Summary</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Complete log of all institutional meetings, including agendas, major discussions, and final conclusions.
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{meetingCount} Records Found</span>
                        <ExportExcelButton data={exportMeetings} columns={meetingColumns} fileName="full_meetings_report" />
                    </div>
                </div>

                {/* Events Activity Report */}
                <div className="report-card">
                    <div className="icon-box bg-indigo-50 text-indigo-600">
                        <CalendarDays size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Events Log</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Detailed tracking of all scheduled and completed events, their types, locations, and current execution statuses.
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{eventCount} Records Found</span>
                        <ExportExcelButton data={exportEvents} columns={eventColumns} fileName="full_events_report" />
                    </div>
                </div>

                {/* Meeting Type Distribution */}
                <div className="report-card">
                    <div className="icon-box bg-emerald-50 text-emerald-600">
                        <TrendingUp size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Meeting Distribution</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Analysis of meeting frequency segmented by category (Advisory, Board, Departmental, etc.).
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{meetingTypes.length} Categories</span>
                        <ExportExcelButton
                            data={meetingTypes.map(t => ({ "Type": t.MeetingTypeName, "Meeting Count": t._count.meetings }))}
                            fileName="meeting_type_distribution"
                        />
                    </div>
                </div>

            </div>

            {/* Advanced Analytics Section placeholder */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl font-black mb-4">Institutional Memory Analysis</h2>
                    <p className="text-slate-400 font-medium leading-relaxed mb-8">
                        These reports consolidate months of institutional activity into actionable datasets. Use these exports for official record keeping, audit preparations, or internal strategy reviews.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Impact</span>
                            <span className="text-2xl font-black">{meetingCount + eventCount} Activities Logged</span>
                        </div>
                        <div className="w-[1px] h-10 bg-slate-800" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Staff Coverage</span>
                            <span className="text-2xl font-black">{staffCount} Active Members</span>
                        </div>
                    </div>
                </div>
                <BarChart2 size={300} className="absolute -right-20 -bottom-20 text-blue-600/10 rotate-12" strokeWidth={1} />
            </div>
        </div>
    );
}
