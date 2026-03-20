import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteMeeting from "@/app/ui/DeleteButtonForMeetings";
import MasterCheckbox from "@/app/ui/MasterCheckbox";
import BulkDeleteButton from "@/app/ui/BulkDeleteButtonForMeetings";
import PaginationControls from "@/app/ui/PaginationControls";
import AutoRefresh from "@/app/ui/AutoRefresh";
import ExportExcelButton from "@/app/ui/ExportExcelButton";
import {
  Plus,
  Download,
  Search,
  Eye,
  Edit,
  RotateCcw,
  FileText,
  CalendarDays,
  ClipboardList,
  MapPin,
  Clock,
  SlidersHorizontal,
} from "lucide-react";

const PAGE_SIZE = 10;

// ─── Types ────────────────────────────────────────────────────────────────────
interface SearchParams {
  keyword?: string;
  venue?: string;
  type?: string;
  status?: string;
  staff?: string;
  cancelled?: string;
  from?: string;
  to?: string;
  limit?: string;
  page?: string;
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const keyword = params?.keyword ?? "";
  const venue = params?.venue ?? "";
  const type = params?.type ?? "";
  const status = params?.status ?? "";
  const staff = params?.staff ?? "";
  const cancelled = params?.cancelled ?? "";
  const from = params?.from ?? "";
  const to = params?.to ?? "";
  const limit = params?.limit ?? "all";
  const page = Number(params?.page ?? "1");

  // ── WHERE clause ──────────────────────────────────────────────────────────
  const where: Record<string, unknown> = {};
  const andClauses: Record<string, unknown>[] = [];

  if (keyword) {
    andClauses.push({
      OR: [
        { MeetingDescription: { contains: keyword } },
        { Location: { contains: keyword } },
        { meetingtype: { MeetingTypeName: { contains: keyword } } },
      ],
    });
  }
  if (venue)
    andClauses.push({ Location: { contains: venue } });
  if (type)
    andClauses.push({ MeetingTypeID: Number(type) });
  if (status)
    andClauses.push({ Status: status });
  if (cancelled === "yes")
    andClauses.push({ IsCancelled: true });
  else if (cancelled === "no")
    andClauses.push({ IsCancelled: false });
  if (from || to) {
    andClauses.push({
      MeetingDate: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      },
    });
  }
  if (staff) {
    andClauses.push({
      meetingmember: { some: { StaffID: Number(staff) } },
    });
  }

  if (andClauses.length > 0) where.AND = andClauses;

  // ── Counts ────────────────────────────────────────────────────────────────
  const [totalAll, scheduledCount, completedCount, cancelledCount, filteredTotal, meetingTypes] = await Promise.all([
    prisma.meetings.count(),
    prisma.meetings.count({ where: { Status: "Scheduled" } }),
    prisma.meetings.count({ where: { Status: "Completed" } }),
    prisma.meetings.count({ where: { Status: "Cancelled" } }),
    prisma.meetings.count({ where }),
    prisma.meetingtype.findMany({ orderBy: { MeetingTypeName: "asc" } }),
  ]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const hardLimit = limit !== "all" ? Number(limit) : null;
  const effectiveTotal = hardLimit ? Math.min(hardLimit, filteredTotal) : filteredTotal;
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / PAGE_SIZE));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const skip = (safePage - 1) * PAGE_SIZE;

  // ── Query ─────────────────────────────────────────────────────────────────
  const rows = await prisma.meetings.findMany({
    where,
    include: {
      meetingtype: true,
      meetingmember: { include: { staff: true } },
    },
    orderBy: { MeetingID: "desc" },
    take: PAGE_SIZE,
    skip: skip,
  });

  // helper
  const fmtDate = (d: Date | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      })
      : "N/A";

  const statusClass = (s: string | null) =>
    s === "Scheduled" ? "scheduled" : s === "Completed" ? "completed" : "cancelled";

  const meetingColumns = [
    { header: "ID", key: "MeetingID" },
    { header: "Title", key: "MeetingDescription" },
    { header: "Type", key: "meetingtype.MeetingTypeName" },
    { header: "Location", key: "Location" },
    { header: "Date", key: "MeetingDate" },
    { header: "Time", key: "MeetingTime" },
    { header: "Status", key: "Status" },
    { header: "Agenda", key: "Agenda" },
    { header: "Discussion", key: "Discussion" },
    { header: "Conclusions", key: "Conclusions" },
    { header: "Participants", key: "participantsList" },
    { header: "Cancelled", key: "IsCancelled" },
    { header: "Cancellation Reason", key: "CancellationReason" },
    { header: "Created At", key: "Created" },
    { header: "Modified At", key: "Modified" },
  ];

  const exportRows = rows.map(r => ({
    ...r,
    MeetingDate: fmtDate(r.MeetingDate),
    participantsList: r.meetingmember?.map(mm => mm.staff?.StaffName).join(", ") || "",
    IsCancelled: r.IsCancelled ? "Yes" : "No",
    Created: r.Created ? new Date(r.Created).toLocaleString() : "—",
    Modified: r.Modified ? new Date(r.Modified).toLocaleString() : "—",
  }));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .mi { /* meetings-inner */
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          font-family: 'Sora', sans-serif;
        }

        /* ── BREADCRUMB ── */
        .bc { display:flex; align-items:center; gap:.375rem; font-size:.72rem;
              font-weight:500; color:#94a3b8; letter-spacing:.04em;
              text-transform:uppercase; }
        .bc a { color:#94a3b8; text-decoration:none; }
        .bc a:hover { color:#1e40af; }
        .bc-sep { color:#cbd5e1; }

        /* ── HEADER ROW ── */
        .hrow { display:flex; align-items:center; justify-content:space-between;
                flex-wrap:wrap; gap:1rem; margin-top:.25rem; }
        .ptitle { font-size:1.65rem; font-weight:700; color:#0f172a;
                  letter-spacing:-.03em; line-height:1.2; margin:0; }
        .ptitle span { display:block; font-size:.8rem; font-weight:500;
                       color:#64748b; letter-spacing:.01em; margin-top:.2rem; }

        /* ── BUTTONS ── */
        .btn-add {
          display:inline-flex; align-items:center; gap:.5rem;
          background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%);
          color:#fff; border:none; border-radius:10px;
          padding:.65rem 1.3rem; font-size:.82rem; font-weight:600;
          font-family:'Sora',sans-serif; cursor:pointer; text-decoration:none;
          box-shadow:0 2px 8px rgba(29,78,216,.35);
          transition:all .2s;
        }
        .btn-add:hover { transform:translateY(-1px);
          box-shadow:0 6px 20px rgba(29,78,216,.4); }

        .btn-search {
          display:inline-flex; align-items:center; gap:.45rem;
          background:#0f172a; color:#fff; border:none; border-radius:9px;
          padding:.6rem 1.2rem; font-size:.8rem; font-weight:700;
          font-family:'Sora',sans-serif; cursor:pointer; transition:all .15s;
        }
        .btn-search:hover { background:#1e293b; }

        .btn-reset {
          display:inline-flex; align-items:center; gap:.45rem;
          background:transparent; color:#64748b;
          border:1.5px solid #e2e8f0; border-radius:9px;
          padding:.6rem 1.2rem; font-size:.8rem; font-weight:600;
          font-family:'Sora',sans-serif; cursor:pointer;
          text-decoration:none; transition:all .15s;
        }
        .btn-reset:hover { background:#f8fafc; color:#475569; }

        /* ── STATS STRIP ── */
        .ss { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
        .sc { background:#fff; border:1px solid #e2e8f0; border-radius:14px;
              padding:1.15rem 1.4rem; display:flex; align-items:center; gap:1rem;
              box-shadow:0 1px 3px rgba(0,0,0,.04); transition:box-shadow .2s; }
        .sc:hover { box-shadow:0 4px 16px rgba(0,0,0,.07); }
        .si { width:42px; height:42px; border-radius:10px;
              display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .si.blue  { background:#eff6ff; color:#1d4ed8; }
        .si.green { background:#f0fdf4; color:#16a34a; }
        .si.amber { background:#fffbeb; color:#d97706; }
        .sl { font-size:.72rem; font-weight:600; color:#94a3b8;
              text-transform:uppercase; letter-spacing:.06em; }
        .sv { font-size:1.45rem; font-weight:700; color:#0f172a;
              font-family:'JetBrains Mono',monospace; line-height:1.1; }

        /* ── FILTER CARD ── */
        .fc { background:#fff; border:1px solid #e2e8f0; border-radius:16px;
              box-shadow:0 1px 4px rgba(0,0,0,.04); overflow:hidden; }
        .fh { padding:1.1rem 1.6rem; border-bottom:1px solid #f1f5f9;
              display:flex; align-items:center; gap:.75rem; background:#fafbfe; }
        .fh-icon { width:32px; height:32px; border-radius:8px;
                   background:linear-gradient(135deg,#eff6ff,#dbeafe);
                   display:flex; align-items:center; justify-content:center;
                   color:#1d4ed8; flex-shrink:0; }
        .fh h2 { font-size:.88rem; font-weight:700; color:#1e293b; margin:0; }
        .fb { padding:1.5rem 1.6rem;
              display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr));
              gap:1.25rem; align-items:end; }
        .fg { display:flex; flex-direction:column; gap:.45rem; }
        .flabel { font-size:.68rem; font-weight:700; color:#64748b;
                  text-transform:uppercase; letter-spacing:.08em; }
        .fctl {
          background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:9px;
          padding:.6rem .9rem; font-size:.82rem; font-family:'Sora',sans-serif;
          color:#1e293b; outline:none; transition:all .15s;
          width:100%;
        }
        .fctl:focus { border-color:#3b82f6; background:#fff;
                      box-shadow:0 0 0 3px rgba(59,130,246,.1); }
        .iw { position:relative; }
        .ii { position:absolute; left:.75rem; top:50%;
              transform:translateY(-50%); color:#94a3b8; pointer-events:none; }
        .fctl.hi { padding-left:2.25rem; }
        .fa { padding:1rem 1.6rem 1.4rem; border-top:1px solid #f1f5f9;
              display:flex; justify-content:space-between; align-items:center;
              gap:.75rem; flex-wrap:wrap; }
        .abg { display:flex; gap:.75rem; }

        /* ── TABLE CARD ── */
        .tc { background:#fff; border:1px solid #e2e8f0; border-radius:16px;
              box-shadow:0 1px 4px rgba(0,0,0,.04); overflow:hidden; }
        .th { padding:1rem 1.6rem; border-bottom:1px solid #f1f5f9;
              background:#fafbfe; display:flex; align-items:center;
              justify-content:space-between; }
        .th h3 { font-size:.88rem; font-weight:700; color:#1e293b; margin:0; }
        .rb { background:linear-gradient(135deg,#eff6ff,#dbeafe); color:#1d4ed8;
              font-size:.68rem; font-weight:800; padding:.25rem .7rem;
              border-radius:20px; letter-spacing:.05em;
              font-family:'JetBrains Mono',monospace; }

        table { width:100%; border-collapse:collapse; }
        thead tr { background:#f8fafc; }
        th { font-size:.67rem; font-weight:700; color:#94a3b8;
             text-transform:uppercase; letter-spacing:.1em;
             padding:.9rem 1.6rem; border-bottom:1px solid #f1f5f9;
             white-space:nowrap; }
        th.c { text-align:center; }
        th.r { text-align:right; }
        tbody tr { border-bottom:1px solid #f8fafc; transition:background .15s; }
        tbody tr:last-child { border-bottom:none; }
        tbody tr:hover { background:#fafcff; }
        td { padding:1rem 1.6rem; vertical-align:middle; }
        td.c { text-align:center; }
        td.r { text-align:right; }

        .ri { display:flex; align-items:center; gap:.9rem; }
        .rav { width:40px; height:40px;
               background:linear-gradient(135deg,#f1f5f9,#e2e8f0);
               border-radius:10px; display:flex; align-items:center;
               justify-content:center; color:#94a3b8; flex-shrink:0;
               transition:all .2s; }
        tbody tr:hover .rav { background:linear-gradient(135deg,#eff6ff,#dbeafe);
                              color:#1d4ed8; }
        .rt { font-size:.85rem; font-weight:600; color:#1e293b;
              line-height:1.3; transition:color .15s; }
        tbody tr:hover .rt { color:#1d4ed8; }
        .rm { display:flex; align-items:center; flex-wrap:wrap; gap:.5rem;
              font-size:.7rem; font-weight:500; color:#94a3b8; margin-top:.3rem; }
        .mi-item { display:flex; align-items:center; gap:.25rem; }
        .tbadge { background:#f1f5f9; color:#475569; font-size:.68rem;
                  font-weight:600; padding:.2rem .55rem; border-radius:6px; }

        .sbadge { display:inline-flex; align-items:center; font-size:.68rem;
                  font-weight:700; padding:.25rem .7rem; border-radius:20px; }
        .sbadge.scheduled { background:#eff6ff; color:#1d4ed8; }
        .sbadge.completed { background:#f0fdf4; color:#16a34a; }
        .sbadge.cancelled { background:#fef2f2; color:#dc2626; }

        .btn-dl {
          display:inline-flex; align-items:center; gap:.4rem;
          background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0;
          border-radius:7px; padding:.4rem .9rem; font-size:.74rem;
          font-weight:700; font-family:'Sora',sans-serif;
          text-decoration:none; transition:all .15s; white-space:nowrap;
        }
        .btn-dl:hover { background:#16a34a; color:#fff; border-color:#16a34a;
                        transform:translateY(-1px); }
        .no-doc { font-size:.72rem; color:#cbd5e1; font-style:italic; }

        .ar { display:flex; align-items:center; justify-content:flex-end; gap:.35rem; }
        .bti { width:34px; height:34px; border-radius:8px;
               display:flex; align-items:center; justify-content:center;
               background:transparent; border:none; cursor:pointer;
               text-decoration:none; transition:all .15s; }
        .bti.view { color:#1d4ed8; }
        .bti.edit { color:#16a34a; }
        .bti.del  { color:#dc2626; }
        .bti.view:hover { background:#eff6ff; color:#1e40af; }
        .bti.edit:hover { background:#f0fdf4; color:#15803d; }
        .bti.del:hover  { background:#fef2f2; color:#dc2626; }
        .adiv { width:1px; height:16px; background:#f1f5f9; }

        /* ── TABLE FOOTER ── */
        .tf { padding:.9rem 1.6rem; border-top:1px solid #f1f5f9;
              background:#fafbfe; display:flex; align-items:center;
              justify-content:space-between; flex-wrap:wrap; gap:.75rem; }
        .pi { font-size:.72rem; font-weight:600; color:#94a3b8; }

        .page-btn {
          width:32px; height:32px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          border:1.5px solid #e2e8f0; background:#fff; color:#64748b;
          cursor:pointer; transition:all .15s;
          font-size:.78rem; font-weight:600; font-family:'Sora',sans-serif;
        }
        .page-btn:hover { background:#0f172a; color:#fff; border-color:#0f172a; }
        .page-btn.active { background:#1d4ed8; color:#fff; border-color:#1d4ed8; }
        .page-btn:disabled { opacity:.4; cursor:not-allowed; pointer-events:none; }

        /* ── CHECKBOX ── */
        .chk-cell { width:40px; padding-right:0; }
        tbody .chk-cell input[type="checkbox"] {
          width:16px; height:16px; accent-color:#1d4ed8;
          cursor:pointer; opacity:0; transition:opacity .2s;
        }
        thead .chk-cell input[type="checkbox"] {
          width:16px; height:16px; accent-color:#1d4ed8; cursor:pointer;
        }
        tbody tr:hover .chk-cell input[type="checkbox"],
        tbody .chk-cell input[type="checkbox"]:checked { opacity:1; }

        /* ── EMPTY STATE ── */
        .es { padding:4rem 2rem; text-align:center; }
        .es-icon { width:64px; height:64px; background:#f1f5f9;
                   border-radius:16px; display:flex; align-items:center;
                   justify-content:center; margin:0 auto 1rem; color:#94a3b8; }
        .es h4 { font-size:1rem; font-weight:700; color:#1e293b; margin:0 0 .4rem; }
        .es p  { font-size:.82rem; color:#94a3b8; margin:0; }

        /* ── RESPONSIVE ── */
        @media (max-width:900px) {
          .ss  { grid-template-columns:1fr; }
          .fb  { grid-template-columns:1fr; }
          .hrow{ flex-direction:column; align-items:flex-start; }
          .fa  { flex-direction:column; align-items:stretch; }
          .abg { justify-content:center; }
        }
      `}</style>

      <div className="mi" key={JSON.stringify(searchParams)}>
        <AutoRefresh intervalMs={5000} />
        {/* ══════════════════ HEADER ══════════════════ */}
        <div>
          <nav className="bc">
            <Link href="/">Home</Link>
            <span className="bc-sep">/</span>
            <Link href="/dashboard/admin">Dashboard</Link>
            <span className="bc-sep">/</span>
            <span style={{ color: "#475569" }}>Meetings</span>
          </nav>

          <div className="hrow">
            <h1 className="ptitle">
              Meeting Management
              <span>Oversee, search, and manage all recorded meetings</span>
            </h1>
            <Link href="/dashboard/admin/meetings/add" className="btn-add">
              <Plus size={16} />
              Add New Meeting
            </Link>
          </div>
        </div>

        {/* ══════════════════ STATS ══════════════════ */}
        <div className="ss">
          <div className="sc">
            <div className="si blue"><Clock size={20} /></div>
            <div>
              <div className="sl">Scheduled</div>
              <div className="sv">{scheduledCount}</div>
            </div>
          </div>
          <div className="sc">
            <div className="si green"><ClipboardList size={20} /></div>
            <div>
              <div className="sl">Completed</div>
              <div className="sv">{completedCount}</div>
            </div>
          </div>
          <div className="sc">
            <div className="si amber"><CalendarDays size={20} /></div>
            <div>
              <div className="sl">Cancelled</div>
              <div className="sv">{cancelledCount}</div>
            </div>
          </div>
        </div>

        {/* ══════════════════ FILTER ══════════════════ */}
        <div className="fc">
          <div className="fh">
            <div className="fh-icon"><SlidersHorizontal size={16} /></div>
            <h2>Search &amp; Filter</h2>
          </div>

          <form method="GET">
            <div className="fb">
              {/* Keyword */}
              <div className="fg">
                <label className="flabel">Keyword</label>
                <div className="iw">
                  <Search className="ii" size={14} />
                  <input
                    name="keyword"
                    defaultValue={keyword}
                    type="text"
                    placeholder="Search description…"
                    className="fctl hi"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="fg">
                <label className="flabel">Location</label>
                <div className="iw">
                  <MapPin className="ii" size={14} />
                  <input
                    name="venue"
                    defaultValue={venue}
                    type="text"
                    placeholder="Search by location…"
                    className="fctl hi"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="fg">
                <label className="flabel">Meeting Type</label>
                <select name="type" defaultValue={type} className="fctl">
                  <option value="">All Types</option>
                  {meetingTypes.map((t) => (
                    <option key={t.MeetingTypeID} value={String(t.MeetingTypeID)}>
                      {t.MeetingTypeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="fg">
                <label className="flabel">Status</label>
                <select name="status" defaultValue={status} className="fctl">
                  <option value="">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Cancelled */}
              <div className="fg">
                <label className="flabel">Cancelled?</label>
                <select name="cancelled" defaultValue={cancelled} className="fctl">
                  <option value="">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Staff */}
              <div className="fg">
                <label className="flabel">Staff ID</label>
                <input
                  name="staff"
                  defaultValue={staff}
                  type="number"
                  placeholder="e.g. 42"
                  className="fctl"
                />
              </div>

              {/* From */}
              <div className="fg">
                <label className="flabel">From Date</label>
                <div className="iw">
                  <CalendarDays className="ii" size={14} />
                  <input
                    name="from"
                    defaultValue={from}
                    type="date"
                    className="fctl hi"
                  />
                </div>
              </div>

              {/* To */}
              <div className="fg">
                <label className="flabel">To Date</label>
                <div className="iw">
                  <CalendarDays className="ii" size={14} />
                  <input
                    name="to"
                    defaultValue={to}
                    type="date"
                    className="fctl hi"
                  />
                </div>
              </div>

              {/* Limit */}
              <div className="fg">
                <label className="flabel">Result Limit</label>
                <select name="limit" defaultValue={limit} className="fctl">
                  <option value="all">All Records</option>
                  <option value="10">Top 10</option>
                  <option value="25">Top 25</option>
                  <option value="50">Top 50</option>
                </select>
              </div>
            </div>

            <div className="fa">
              <div className="abg">
                <button type="submit" className="btn-search">
                  <Search size={14} /> Search Records
                </button>
                <Link href="/dashboard/admin/meetings" className="btn-reset">
                  <RotateCcw size={14} /> Reset
                </Link>
                <ExportExcelButton
                  data={exportRows}
                  columns={meetingColumns}
                  fileName="meetings_comprehensive_data"
                />
              </div>
              {/* ✅ Client Component — no event handler in server */}
              <BulkDeleteButton />
            </div>
          </form>
        </div>

        {/* ══════════════════ TABLE ══════════════════ */}
        <div className="tc">
          <div className="th">
            <h3>Record List</h3>
            <span className="rb">{effectiveTotal} Records</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table id="report-table">
              <thead>
                <tr>
                  <th className="chk-cell" data-html2canvas-ignore>
                    {/* ✅ Client Component — no onChange in server */}
                    <MasterCheckbox />
                  </th>
                  <th>Meeting Details</th>
                  <th className="c">Status</th>
                  <th className="c">Attachment</th>
                  <th className="r" data-html2canvas-ignore>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="es">
                        <div className="es-icon"><ClipboardList size={28} /></div>
                        <h4>No meetings found</h4>
                        <p>Try adjusting your filters or add a new meeting.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((m: any) => (
                    <tr key={m.MeetingID}>
                      <td className="chk-cell" data-html2canvas-ignore>
                        <input
                          type="checkbox"
                          className="row-checkbox"
                          value={m.MeetingID}
                        />
                      </td>

                      <td>
                        <div className="ri">
                          <div className="rav"><FileText size={18} /></div>
                          <div>
                            <div className="rt">
                              {m.MeetingDescription || "Untitled Meeting"}
                            </div>
                            <div className="rm">
                              <span className="mi-item">
                                <Clock size={11} />
                                {fmtDate(m.MeetingDate as Date | null)}
                              </span>
                              <span className="mi-item">
                                <MapPin size={11} />
                                {m.Location || "Not specified"}
                              </span>
                              {m.meetingtype && (
                                <span className="tbadge">
                                  {m.meetingtype.MeetingTypeName}
                                </span>
                              )}
                            </div>
                            {m.meetingmember && m.meetingmember.length > 0 && (
                              <div className="rm" style={{ marginTop: ".15rem" }}>
                                <span className="mi-item">
                                  👥{" "}
                                  {m.meetingmember
                                    .map(
                                      (mm: { staff?: { StaffName?: string }; StaffID: number }) =>
                                        mm.staff?.StaffName ?? `#${mm.StaffID}`
                                    )
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="c">
                        {m.Status ? (
                          <span className={`sbadge ${statusClass(m.Status)}`}>
                            {m.Status}
                          </span>
                        ) : (
                          <span className="no-doc">—</span>
                        )}
                      </td>

                      <td className="c">
                        {m.DocumentPath ? (
                          <a
                            href={m.DocumentPath.startsWith('http') ? m.DocumentPath : `/uploads/meeting_docs/${m.DocumentPath.split(/[\\/]/).pop()}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-dl"
                          >
                            <Download size={13} /> Download
                          </a>
                        ) : (
                          <span className="no-doc">No attachment</span>
                        )}
                      </td>

                      <td className="r" data-html2canvas-ignore>
                        <div className="ar">
                          <Link
                            href={`/dashboard/admin/meetings/${m.MeetingID}`}
                            className="bti view"
                            title="View"
                          >
                            <Eye size={17} />
                          </Link>
                          <div className="adiv" />
                          <Link
                            href={`/dashboard/admin/meetings/edit/${m.MeetingID}`}
                            className="bti edit"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </Link>
                          <div className="adiv" />
                          <div className="bti del">
                            <DeleteMeeting id={m.MeetingID} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── FOOTER ── */}
          <div className="tf">
            <p className="pi">
              Page {safePage} of {totalPages} &nbsp;·&nbsp; {effectiveTotal} total records
            </p>

            {/* ✅ Suspense required for useSearchParams() inside PaginationControls */}
            <Suspense fallback={<div style={{ height: 32 }} />}>
              <PaginationControls
                totalRecords={effectiveTotal}
                pageSize={PAGE_SIZE}
                currentPage={safePage}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
