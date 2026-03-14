import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Download,
  Search,
  Eye,
  RotateCcw,
  FileText,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  SlidersHorizontal,
  ClipboardList,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";

export default async function GetAll({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const { q, category, page } = await searchParams;
  const keyword = q || "";
  const cat = category || "all";
  const currentPage = parseInt(page || "1");
  const pageSize = 10;

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) redirect("/");

  const payload: any = await verifyToken(tokenCookie.value);
  if (!payload || !payload.id) redirect("/");

  // Find staff record
  const staff = await prisma.staff.findUnique({
    where: { UserID: payload.id }
  });

  if (!staff) {
    return <div className="p-8 text-center text-amber-500 font-bold">No staff profile found for your account.</div>;
  }

  const staffId = staff.StaffID;

  // Fetch both meetings and events with keyword filtering
  const meetingAssignments = await prisma.meetingmember.findMany({
    where: { 
      StaffID: staffId,
      meetings: {
        OR: [
          { MeetingDescription: { contains: keyword } },
          { Location: { contains: keyword } }
        ]
      }
    },
    include: { meetings: { include: { meetingtype: true } } },
  });

  const eventAssignments = await prisma.eventmember.findMany({
    where: { 
      StaffID: staffId,
      events: {
        OR: [
          { EventDescription: { contains: keyword } },
          { Location: { contains: keyword } }
        ]
      }
    },
    include: { events: { include: { eventtype: true } } },
  });

  // Map to common structure
  const meetingsList = meetingAssignments.map(m => ({
    id: m.MeetingMemberID,
    description: m.meetings?.MeetingDescription || "Untitled Meeting",
    date: m.meetings?.MeetingDate,
    time: m.meetings?.MeetingDate ? new Date(m.meetings.MeetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
    venue: m.meetings?.Location || "N/A",
    document: m.meetings?.DocumentPath,
    category: "Meeting",
    type: m.meetings?.meetingtype?.MeetingTypeName || "Standard",
  }));

  const eventsList = eventAssignments.map(e => ({
    id: e.EventMemberID,
    description: e.events?.EventDescription || "Untitled Event",
    date: e.events?.EventDate,
    time: e.events?.EventDate ? new Date(e.events.EventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
    venue: e.events?.Location || "N/A",
    document: e.events?.DocumentPath,
    category: "Event",
    type: e.events?.eventtype?.EventTypeName || "Standard",
  }));

  // Filter by category
  let allRecords = [...meetingsList, ...eventsList];
  if (cat === "meeting") allRecords = meetingsList;
  if (cat === "event") allRecords = eventsList;

  // Final sort
  allRecords = allRecords.sort((a, b) => 
    new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );

  const totalRecords = allRecords.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedRecords = allRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .meetings-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* ---- HEADER ---- */
        .header-block {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.72rem;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .breadcrumb a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.15s;
        }
        .breadcrumb a:hover { color: #1e40af; }
        .breadcrumb-sep { color: #cbd5e1; }

        .header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.25rem;
        }
        .page-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }
        .page-title span {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #64748b;
          letter-spacing: 0.01em;
          margin-top: 0.2rem;
        }

        /* ---- STATS STRIP ---- */
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .stat-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 1.15rem 1.4rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s;
        }
        .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
        .stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon.blue  { background: #eff6ff; color: #1d4ed8; }
        .stat-icon.green { background: #f0fdf4; color: #16a34a; }
        .stat-icon.amber { background: #fffbeb; color: #d97706; }
        .stat-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .stat-value {
          font-size: 1.45rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.1;
          font-variant-numeric: tabular-nums;
          font-family: 'JetBrains Mono', monospace;
        }

        /* ---- FILTER CARD ---- */
        .filter-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .filter-header {
          padding: 1.1rem 1.6rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #fafbfe;
        }
        .filter-header-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1d4ed8;
        }
        .filter-header h2 {
          font-size: 0.88rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .filter-body {
          padding: 1.5rem 1.6rem;
        }
        
        .filter-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          align-items: end;
        }

        .form-group { display: flex; flex-direction: column; gap: 0.45rem; }
        .form-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .form-control {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          padding: 0.6rem 0.9rem;
          font-size: 0.82rem;
          font-family: 'Sora', sans-serif;
          color: #1e293b;
          outline: none;
          transition: all 0.15s;
          width: 100%;
          box-sizing: border-box;
        }
        .form-control:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }
        .form-control.has-icon { padding-left: 2.25rem; }

        .btn-search {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 9px;
          padding: 0.6rem 1.2rem;
          font-size: 0.8rem;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.01em;
          height: 38px;
        }
        .btn-search:hover { background: #1e293b; transform: translateY(-1px); }
        .btn-reset {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          text-decoration: none;
        }
        .btn-reset:hover { background: #f1f5f9; border-color: #cbd5e1; color: #1e293b; }

        /* ---- TABLE CARD ---- */
        .table-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .table-header {
          padding: 1rem 1.6rem;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbfe;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .table-header h3 {
          font-size: 0.88rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .record-badge {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #1d4ed8;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.25rem 0.7rem;
          border-radius: 20px;
          letter-spacing: 0.05em;
          font-family: 'JetBrains Mono', monospace;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }
        thead tr {
          background: #f8fafc;
        }
        th {
          font-size: 0.67rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.9rem 1.6rem;
          border-bottom: 1px solid #f1f5f9;
          white-space: nowrap;
        }
        th.center { text-align: center; }
        th.right  { text-align: right; }

        tbody tr {
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #fafcff; }

        td { padding: 1rem 1.6rem; vertical-align: middle; }
        td.center { text-align: center; }
        td.right  { text-align: right; }

        .row-identity {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }
        .row-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        tbody tr:hover .row-avatar {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #1d4ed8;
        }
        .row-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
          transition: color 0.15s;
        }
        tbody tr:hover .row-title { color: #1d4ed8; }
        
        .row-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.7rem;
          font-weight: 500;
          color: #94a3b8;
          margin-top: 0.3rem;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .btn-download {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          border-radius: 7px;
          padding: 0.4rem 0.9rem;
          font-size: 0.74rem;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          text-decoration: none;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .btn-download:hover {
          background: #16a34a;
          color: #fff;
          border-color: #16a34a;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(22,163,74,0.25);
        }
        .no-doc {
          font-size: 0.72rem;
          color: #cbd5e1;
          font-style: italic;
        }

        .category-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .category-meeting { background: #eff6ff; color: #1d4ed8; }
        .category-event { background: #fffbeb; color: #d97706; }

        .btn-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s;
          color: #94a3b8;
        }
        .btn-icon:hover { background: #f1f5f9; color: #1e293b; }

        .table-footer {
          padding: 1rem 1.6rem;
          border-top: 1px solid #f1f5f9;
          background: #fafbfe;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .page-info {
          font-size: 0.72rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.03em;
        }
        .pagination {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .page-link {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #64748b;
          transition: all 0.15s;
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
        }
        .page-link:hover { background: #0f172a; color: #fff; border-color: #0f172a; }
        .page-link.active { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
        .page-link.disabled { opacity: 0.3; pointer-events: none; }

        @media (max-width: 900px) {
          .stats-strip { grid-template-columns: 1fr; }
          .filter-form { grid-template-columns: 1fr; }
        }
      `}</style>

      <div>
        <div className="meetings-inner">
          <div className="header-block">
            <nav className="breadcrumb">
              <Link href="/dashboard/staff">Dashboard</Link>
              <span className="breadcrumb-sep">/</span>
              <span style={{ color: "#475569" }}>My Schedule</span>
            </nav>
            <div className="header-row">
              <h1 className="page-title">
                My Personalized Schedule
                <span>Track all meetings and events you are involved in</span>
              </h1>
            </div>
          </div>

          <div className="stats-strip">
            <div className="stat-card">
              <div className="stat-icon blue">
                <ClipboardList size={20} />
              </div>
              <div>
                <div className="stat-label">Total Assignments</div>
                <div className="stat-value">{totalRecords}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <FileText size={20} />
              </div>
              <div>
                <div className="stat-label">Meetings</div>
                <div className="stat-value">{meetingsList.length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">
                <Calendar size={20} />
              </div>
              <div>
                <div className="stat-label">Events</div>
                <div className="stat-value">{eventsList.length}</div>
              </div>
            </div>
          </div>

          <div className="filter-card">
            <div className="filter-header">
              <div className="filter-header-icon">
                <SlidersHorizontal size={16} />
              </div>
              <h2>Search My Records</h2>
            </div>
            <div className="filter-body">
              <form action="" method="GET" className="filter-form">
                <div className="form-group">
                  <label className="form-label">Keyword</label>
                  <div className="input-wrap">
                    <Search className="input-icon" size={15} />
                    <input 
                      type="text" 
                      name="q" 
                      placeholder="Meeting description or venue..." 
                      className="form-control has-icon" 
                      defaultValue={keyword}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-control" defaultValue={cat}>
                    <option value="all">All Categories</option>
                    <option value="meeting">Meetings Only</option>
                    <option value="event">Events Only</option>
                  </select>
                </div>
                <div className="form-group">
                  <div className="flex gap-2">
                    <button type="submit" className="btn-search flex-1">
                      <Search size={14} /> Search
                    </button>
                    <Link href="/dashboard/staff/meetings" className="btn-reset" title="Reset Filters">
                      <RotateCcw size={14} />
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h3>Action Items & Agenda</h3>
              <span className="record-badge">{totalRecords} Records</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th className="center">Type</th>
                    <th className="center">Attachment</th>
                    <th className="right">View</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.length > 0 ? paginatedRecords.map((r: any) => (
                    <tr key={`${r.category}-${r.id}`}>
                      <td>
                        <div className="row-identity">
                          <div className="row-avatar">
                            {r.category === 'Meeting' ? <FileText size={18} /> : <Calendar size={18} />}
                          </div>
                          <div>
                            <div className="row-title">{r.description}</div>
                            <div className="row-meta">
                              <span className="meta-item">
                                <Clock size={12} /> 
                                {r.date ? new Date(r.date).toLocaleDateString() : 'N/A'} {r.time}
                              </span>
                              <span className="meta-item"><MapPin size={12} /> {r.venue}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`category-badge ${r.category === 'Meeting' ? 'category-meeting' : 'category-event'}`}>
                          {r.category}
                        </span>
                      </td>
                      <td className="center">
                        <span className="text-xs font-medium text-slate-500">{r.type}</span>
                      </td>
                      <td className="center">
                        {r.document ? (
                          <a href={r.document} download className="btn-download">
                            <Download size={13} /> PDF
                          </a>
                        ) : (
                          <span className="no-doc">None</span>
                        )}
                      </td>
                      <td className="right">
                        <Link href={`/dashboard/${r.category === 'Meeting' ? 'staff/meetings' : 'staff/meetings'}`} className="btn-icon">
                          <Eye size={17} />
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <SlidersHorizontal size={32} className="text-slate-200" />
                          <p className="text-slate-400 font-medium italic">No matching records found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords}
                </p>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/dashboard/staff/meetings?q=${keyword}&category=${cat}&page=${currentPage - 1}`}
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
                        href={`/dashboard/staff/meetings?q=${keyword}&category=${cat}&page=${i + 1}`}
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
                    href={`/dashboard/staff/meetings?q=${keyword}&category=${cat}&page=${currentPage + 1}`}
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
      </div>
    </>
  );
}