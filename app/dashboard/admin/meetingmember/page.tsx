import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButtonForMeetingMember from "@/app/ui/DeleteButtonForMeetingMember";
import PaginationControls from "@/app/ui/PaginationControls";
import {
  Plus,
  Search,
  Edit,
  RotateCcw,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  FileText,
  Eye,
} from "lucide-react";


import MasterCheckbox from "@/app/ui/MasterCheckbox";
import BulkDeleteButton from "@/app/ui/BulkDeleteButtonForMeetingMembers";

const PAGE_SIZE = 10;

interface SearchParams {
  keyword?: string;
  isPresent?: string;
  page?: string;
}

export default async function GetAll({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const keyword = params?.keyword ?? "";
  const isPresentParam = params?.isPresent ?? "";
  const page = Number(params?.page ?? "1");

  const where: any = {};
  const andClauses: any[] = [];

  if (keyword) {
    andClauses.push({
      OR: [
        { staff: { StaffName: { contains: keyword } } },
        { meetings: { MeetingDescription: { contains: keyword } } },
      ],
    });
  }

  if (isPresentParam === "yes") {
    andClauses.push({ IsPresent: true });
  } else if (isPresentParam === "no") {
    andClauses.push({ IsPresent: false });
  }

  if (andClauses.length > 0) where.AND = andClauses;

  const [totalAll, presentCount, absentCount, filteredTotal] = await Promise.all([
    prisma.meetingmember.count(),
    prisma.meetingmember.count({ where: { IsPresent: true } }),
    prisma.meetingmember.count({ where: { IsPresent: false } }),
    prisma.meetingmember.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredTotal / PAGE_SIZE));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const skip = (safePage - 1) * PAGE_SIZE;

  const rows = await prisma.meetingmember.findMany({
    where,
    include: {
      staff: true,
      meetings: {
        include: {
          meetingtype: true,
        },
      },
    },
    orderBy: { MeetingMemberID: "desc" },
    take: PAGE_SIZE,
    skip: skip,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .mi {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          font-family: 'Sora', sans-serif;
        }

        .bc { display:flex; align-items:center; gap:.375rem; font-size:.72rem;
              font-weight:500; color:#94a3b8; letter-spacing:.04em;
              text-transform:uppercase; }
        .bc a { color:#94a3b8; text-decoration:none; transition:color .15s; }
        .bc a:hover { color:#1d4ed8; }
        .bc-sep { color:#cbd5e1; }

        .hrow { display:flex; align-items:center; justify-content:space-between;
                flex-wrap:wrap; gap:1rem; margin-top:.25rem; }
        .ptitle { font-size:1.65rem; font-weight:700; color:#0f172a;
                  letter-spacing:-.03em; line-height:1.2; margin:0; }
        .ptitle span { display:block; font-size:.8rem; font-weight:500;
                       color:#64748b; letter-spacing:.01em; margin-top:.2rem; }

        .btn-add {
          display:inline-flex; align-items:center; gap:.5rem;
          background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%);
          color:#fff; border:none; border-radius:10px;
          padding:.65rem 1.3rem; font-size:.82rem; font-weight:600;
          cursor:pointer; text-decoration:none;
          box-shadow:0 2px 8px rgba(29,78,216,.35);
          transition:all .2s;
        }
        .btn-add:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(29,78,216,.4); }

        .btn-search {
          display:inline-flex; align-items:center; gap:.45rem;
          background:#0f172a; color:#fff; border:none; border-radius:9px;
          padding:.6rem 1.2rem; font-size:.8rem; font-weight:700;
          cursor:pointer; transition:all .15s; font-family:'Sora',sans-serif;
        }
        .btn-search:hover { background:#1e293b; }

        .btn-reset {
          display:inline-flex; align-items:center; gap:.45rem;
          background:transparent; color:#64748b;
          border:1.5px solid #e2e8f0; border-radius:9px;
          padding:.6rem 1.2rem; font-size:.8rem; font-weight:600;
          text-decoration:none; transition:all .15s; font-family:'Sora',sans-serif;
        }
        .btn-reset:hover { background:#f8fafc; color:#475569; }

        .ss { display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; }
        .sc { background:#fff; border:1px solid #e2e8f0; border-radius:14px;
              padding:1.15rem 1.4rem; display:flex; align-items:center; gap:1rem;
              box-shadow:0 1px 3px rgba(0,0,0,.04); transition:box-shadow .2s; }
        .sc:hover { box-shadow:0 4px 16px rgba(0,0,0,.07); }
        .si { width:42px; height:42px; border-radius:10px;
              display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .si.blue  { background:#eff6ff; color:#1d4ed8; }
        .si.green { background:#f0fdf4; color:#16a34a; }
        .sl { font-size:.72rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
        .sv { font-size:1.45rem; font-weight:700; color:#0f172a; font-family:'JetBrains Mono',monospace; line-height:1.1; }

        .fc { background:#fff; border:1px solid #e2e8f0; border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,.04); overflow:hidden; }
        .fh { padding:1.1rem 1.6rem; border-bottom:1px solid #f1f5f9; background:#fafbfe; display:flex; align-items:center; gap:.75rem; }
        .fh-icon { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#eff6ff,#dbeafe); display:flex; align-items:center; justify-content:center; color:#1d4ed8; flex-shrink:0; }
        .fh h2 { font-size:.88rem; font-weight:700; color:#1e293b; margin:0; }
        .fb { padding:1.5rem 1.6rem; display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1.25rem; align-items:end; }
        .fctl { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:9px; padding:.6rem .9rem; font-size:.82rem; font-family:'Sora',sans-serif; color:#1e293b; width:100%; outline:none; transition:all .15s; }
        .fctl:focus { border-color:#3b82f6; background:#fff; box-shadow:0 0 0 3px rgba(59,130,246,.1); }
        .fctl.hi { padding-left:2.25rem; }
        .iw { position:relative; }
        .ii { position:absolute; left:.75rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; }
        .fa { padding:1rem 1.6rem 1.4rem; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; gap:.75rem; flex-wrap:wrap; }
        .abg { display:flex; gap:.75rem; }

        .tc { background:#fff; border:1px solid #e2e8f0; border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,.04); overflow:hidden; }
        .th { padding:1rem 1.6rem; border-bottom:1px solid #f1f5f9; background:#fafbfe; display:flex; align-items:center; justify-content:space-between; }
        .th h3 { font-size:.88rem; font-weight:700; color:#1e293b; margin:0; }
        .rb { background:linear-gradient(135deg,#eff6ff,#dbeafe); color:#1d4ed8; font-size:.68rem; font-weight:800; padding:.25rem .7rem; border-radius:20px; letter-spacing:.05em; font-family:'JetBrains Mono',monospace; }

        table { width:100%; border-collapse:collapse; }
        thead tr { background:#f8fafc; }
        th { font-size:.67rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.1em; padding:.9rem 1.6rem; border-bottom:1px solid #f1f5f9; text-align:left; white-space:nowrap; }
        th.r { text-align:right; }
        tbody tr { border-bottom:1px solid #f8fafc; transition:background .15s; }
        tbody tr:hover { background:#fafcff; }
        td { padding:1rem 1.6rem; vertical-align:middle; }
        td.r { text-align:right; }

        .ri { display:flex; align-items:center; gap:.9rem; }
        .rav { width:40px; height:40px; background:linear-gradient(135deg,#f1f5f9,#e2e8f0); border-radius:10px; display:flex; align-items:center; justify-content:center; color:#94a3b8; flex-shrink:0; transition:all .2s; }
        tbody tr:hover .rav { background:linear-gradient(135deg,#eff6ff,#dbeafe); color:#1d4ed8; }
        .rt { font-size:.85rem; font-weight:600; color:#1e293b; line-height:1.3; transition:color .15s; }
        tbody tr:hover .rt { color:#1d4ed8; }
        .rm { font-size:.7rem; color:#94a3b8; margin-top:.3rem; font-weight:500; display:flex; align-items:center; gap:.4rem; }
        .tbadge { background:#f1f5f9; color:#475569; font-size:.68rem; font-weight:600; padding:.2rem .55rem; border-radius:6px; }

        .sbadge { display:inline-flex; align-items:center; gap:.25rem; font-size:.68rem; font-weight:700; padding:.25rem .7rem; border-radius:20px; }
        .sbadge.present { background:#f0fdf4; color:#16a34a; }
        .sbadge.absent { background:#fef2f2; color:#dc2626; }

        .ar { display:flex; align-items:center; justify-content:flex-end; gap:.35rem; }
        .bti { width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:transparent; border:none; cursor:pointer; text-decoration:none; transition:all .15s; }
        .bti.view { color:#1d4ed8; }
        .bti.view:hover { background:#eff6ff; color:#1e40af; }
        .bti.edit { color:#16a34a; }
        .bti.edit:hover { background:#f0fdf4; color:#15803d; }
        .bti.del { color:#94a3b8; }
        .bti.del:hover { background:#fef2f2; color:#dc2626; }
        .adiv { width:1px; height:16px; background:#f1f5f9; }

        .tf { padding:.9rem 1.6rem; border-top:1px solid #f1f5f9; background:#fafbfe; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:.75rem; }
        .pi { font-size:.72rem; font-weight:600; color:#94a3b8; }
        
        .chk-cell { width:40px; padding-right:0; }
        tbody .chk-cell input[type="checkbox"] { width:16px; height:16px; accent-color:#1d4ed8; cursor:pointer; opacity:0; transition:opacity .2s; }
        thead .chk-cell input[type="checkbox"] { width:16px; height:16px; accent-color:#1d4ed8; cursor:pointer; }
        tbody tr:hover .chk-cell input[type="checkbox"],
        tbody .chk-cell input[type="checkbox"]:checked { opacity:1; }

        .es { padding:4rem 2rem; text-align:center; }
        .es-icon { width:64px; height:64px; background:#f1f5f9; border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; color:#94a3b8; }
        .es h4 { font-size:1rem; font-weight:700; color:#1e293b; margin:0 0 .4rem; }
        .es p { font-size:.82rem; color:#94a3b8; margin:0; }
      `}</style>

      <div className="mi">
        <div>
          <nav className="bc">
            <Link href="/">Home</Link>
            <span className="bc-sep">/</span>
            <Link href="/dashboard/admin">Dashboard</Link>
            <span className="bc-sep">/</span>
            <span style={{ color: "#475569" }}>Meeting Members</span>
          </nav>

          <div className="hrow">
            <h1 className="ptitle">
              Meeting Attendance
              <span>Oversee and manage meeting participants</span>
            </h1>
            <Link href="/dashboard/admin/meetingmember/add" className="btn-add">
              <Plus size={16} />
              Add Member Record
            </Link>
          </div>
        </div>

        <div className="ss" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="sc">
            <div className="si blue"><Users size={20} /></div>
            <div>
              <div className="sl">Total Entries</div>
              <div className="sv">{totalAll}</div>
            </div>
          </div>
          <div className="sc">
            <div className="si green"><CheckCircle2 size={20} /></div>
            <div>
              <div className="sl">Present</div>
              <div className="sv">{presentCount}</div>
            </div>
          </div>
          <div className="sc">
            <div className="si blue" style={{ background: '#fef2f2', color: '#dc2626' }}><XCircle size={20} /></div>
            <div>
              <div className="sl">Absent</div>
              <div className="sv">{absentCount}</div>
            </div>
          </div>
        </div>

        <div className="fc">
          <div className="fh">
            <div className="fh-icon"><SlidersHorizontal size={16} /></div>
            <h2>Search &amp; Filter</h2>
          </div>
          <form method="GET">
            <div className="fb">
              <div className="fg">
                <div className="iw">
                  <Search className="ii" size={14} />
                  <input
                    name="keyword"
                    defaultValue={keyword}
                    type="text"
                    placeholder="Search by staff or meeting description…"
                    className="fctl hi"
                  />
                </div>
              </div>
              <div className="fg">
                <select name="isPresent" defaultValue={isPresentParam} className="fctl">
                  <option value="">All Attendance</option>
                  <option value="yes">Present</option>
                  <option value="no">Absent</option>
                </select>
              </div>
            </div>
            <div className="fa" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="abg" style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-search">
                  <Search size={14} /> Search
                </button>
                <Link href="/dashboard/admin/meetingmember" className="btn-reset">
                  <RotateCcw size={14} /> Reset
                </Link>
              </div>
              <BulkDeleteButton />
            </div>
          </form>
        </div>

        <div className="tc">
          <div className="th">
            <h3>Attendance List</h3>
            <span className="rb">{filteredTotal} Records</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th className="chk-cell">
                    <MasterCheckbox />
                  </th>
                  <th>Staff Member</th>
                  <th>Meeting Details</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="es">
                        <div className="es-icon"><Users size={28} /></div>
                        <h4>No participant records found</h4>
                        <p>Try searching for a different staff or meeting description.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((mm) => (
                    <tr key={mm.MeetingMemberID}>
                      <td className="chk-cell">
                        <input
                          type="checkbox"
                          className="row-checkbox"
                          value={mm.MeetingMemberID}
                        />
                      </td>
                      <td>
                        <div className="ri">
                          <div className="rav">
                            <Users size={18} />
                          </div>
                          <div>
                            <div className="rt">{mm.staff.StaffName}</div>
                            <div className="rm">
                              ID: #{mm.StaffID} &nbsp;·&nbsp; Member ID: #{mm.MeetingMemberID}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="rt" style={{ fontSize: '.75rem' }}>{mm.meetings.MeetingDescription || "Untitled Meeting"}</div>
                        <div className="rm">
                          <Calendar size={12} />
                          {new Date(mm.meetings.MeetingDate).toLocaleDateString()}
                          <span className="tbadge">{mm.meetings.meetingtype.MeetingTypeName}</span>
                        </div>
                      </td>
                      <td>
                        {mm.IsPresent ? (
                          <span className="sbadge present">
                            <CheckCircle2 size={12} /> Present
                          </span>
                        ) : (
                          <span className="sbadge absent">
                            <XCircle size={12} /> Absent
                          </span>
                        )}
                        <div className="rm" style={{ marginTop: '.25rem' }}>
                          <FileText size={12} /> {mm.Remarks || "No remarks"}
                        </div>
                      </td>
                      <td>
                        <div className="ar">
                          <Link
                            href={`/dashboard/admin/meetingmember/${mm.MeetingMemberID}`}
                            className="bti view"
                            title="View"
                          >
                            <Eye size={17} />
                          </Link>
                          <div className="adiv" />
                          <Link
                            href={`/dashboard/admin/meetingmember/edit/${mm.MeetingMemberID}`}
                            className="bti edit"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </Link>
                          <div className="adiv" />
                          <div className="bti del">
                            <DeleteButtonForMeetingMember id={mm.MeetingMemberID} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="tf">
            <p className="pi">
              Page {safePage} of {totalPages} &nbsp;·&nbsp; {filteredTotal} total records
            </p>
            <Suspense fallback={<div style={{ height: 32 }} />}>
              <PaginationControls
                totalRecords={filteredTotal}
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
