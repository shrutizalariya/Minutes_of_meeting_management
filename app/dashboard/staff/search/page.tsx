import React from "react";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Search, 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  Eye,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;
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

  const staffId = staff.StaffID;
  const normalizedQuery = query?.trim().toLowerCase() || "";

  // Search in Meetings
  const matchingMeetings = await prisma.meetingmember.findMany({
    where: {
      StaffID: staffId,
      meetings: {
        OR: [
          { MeetingDescription: { contains: normalizedQuery } },
          { Location: { contains: normalizedQuery } },
        ]
      }
    },
    include: { meetings: { include: { meetingtype: true } } }
  });

  // Search in Events
  const matchingEvents = await prisma.eventmember.findMany({
    where: {
      StaffID: staffId,
      events: {
        OR: [
          { EventDescription: { contains: normalizedQuery } },
          { Location: { contains: normalizedQuery } },
        ]
      }
    },
    include: { events: { include: { eventtype: true } } }
  });

  const results = [
    ...matchingMeetings.map(m => ({
      id: m.MeetingID,
      title: m.meetings?.MeetingDescription || "Untitled Meeting",
      date: m.meetings?.MeetingDate,
      location: m.meetings?.Location || "N/A",
      category: "Meeting" as const,
      type: m.meetings?.meetingtype?.MeetingTypeName || "Standard",
    })),
    ...matchingEvents.map(e => ({
      id: e.EventID,
      title: e.events?.EventDescription || "Untitled Event",
      date: e.events?.EventDate,
      location: e.events?.Location || "N/A",
      category: "Event" as const,
      type: e.events?.eventtype?.EventTypeName || "Standard",
    }))
  ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  return (
    <div className="space-y-8" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <div>
        <Link href="/dashboard/staff" className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 no-underline hover:text-emerald-700 transition-colors w-fit">
          <ArrowLeft size={14} strokeWidth={3} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
          Search Results 
          {query && <span className="text-emerald-500 ml-3">"{query}"</span>}
        </h1>
        <p className="text-slate-500 text-sm mt-3 font-medium">
          Found {results.length} results matching your search criteria.
        </p>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 gap-4">
        {results.length > 0 ? results.map((result, idx) => (
          <div key={`${result.category}-${result.id}`} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${
                result.category === 'Meeting' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {result.category === 'Meeting' ? <FileText size={24} /> : <Calendar size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    result.category === 'Meeting' ? 'text-blue-500' : 'text-amber-500'
                  }`}>
                    {result.category}
                  </span>
                  <span className="text-slate-200 text-xs">•</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{result.type}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                  {result.title}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock size={14} className="opacity-40" />
                    {new Date(result.date || 0).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin size={14} className="opacity-40" />
                    {result.location}
                  </div>
                </div>
              </div>
            </div>
            
            <Link 
              href={`/dashboard/staff/meetings`} 
              className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300"
            >
              <Eye size={20} />
            </Link>
          </div>
        )) : (
          <div className="bg-white py-20 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6">
              <Search size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No results found</h2>
            <p className="text-slate-500 font-medium max-w-xs px-6">
              We couldn't find any meetings or tasks matching your query. Maybe try different keywords?
            </p>
            <Link href="/dashboard/staff" className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-colors no-underline">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
