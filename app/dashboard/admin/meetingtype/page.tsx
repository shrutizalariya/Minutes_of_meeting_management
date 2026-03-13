import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/app/ui/DeleteButton";
import PaginationControls from "@/app/ui/PaginationControls";
import {
  Plus,
  Search,
  Edit,
  RotateCcw,
  FileText,
  ClipboardList,
  SlidersHorizontal,
  Eye,
} from "lucide-react";


import MasterCheckbox from "@/app/ui/MasterCheckbox";
import BulkDeleteButton from "@/app/ui/BulkDeleteButtonForMeetingTypes";

const PAGE_SIZE = 10;

interface SearchParams {
  keyword?: string;
  page?: string;
}

export default async function GetAll({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const keyword = params?.keyword ?? "";
  const page = Number(params?.page ?? "1");

  const where: any = {};
  if (keyword) {
    where.OR = [
      { MeetingTypeName: { contains: keyword } },
      { Remarks: { contains: keyword } },
    ];
  }

  const [totalAll, activeCount, filteredTotal] = await Promise.all([
    prisma.meetingtype.count(),
    prisma.meetingtype.count({ where: { meetings: { some: {} } } }),
    prisma.meetingtype.count({ where }),
  ]);

  const inactiveCount = totalAll - activeCount;
  const totalPages = Math.max(1, Math.ceil(filteredTotal / PAGE_SIZE));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const skip = (safePage - 1) * PAGE_SIZE;

  const rows = await prisma.meetingtype.findMany({
    where,
    orderBy: { MeetingTypeID: "desc" },
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
        .sl { font-size:.72rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
        .sv { font-size:1.45rem; font-weight:700; color:#0f172a; font-family:'JetBrains Mono',monospace; line-height:1.1; }

        .fc { background:#fff; border:1px solid #e2e8f0; border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,.04); overflow:hidden; }
        .fh { padding:1.1rem 1.6rem; border-bottom:1px solid #f1f5f9; background:#fafbfe; display:flex; align-items:center; gap:.75rem; }
        .fh-icon { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#eff6ff,#dbeafe); display:flex; align-items:center; justify-content:center; color:#1d4ed8; flex-shrink:0; }
        .fh h2 { font-size:.88rem; font-weight:700; color:#1e293b; margin:0; }
        .fb { padding:1.5rem 1.6rem; display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:1.25rem; align-items:end; }
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
        .rm { font-size:.7rem; color:#94a3b8; margin-top:.2rem; font-weight:500; }

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
            <span style={{ color: "#475569" }}>Meeting Types</span>
          </nav>

          <div className="hrow">
            <h1 className="ptitle">
              Meeting Types
              <span>Manage classifications for your meetings</span>
            </h1>
            <Link href="/dashboard/admin/meetingtype/add" className="btn-add">
              <Plus size={16} />
              Add Meeting Type
            </Link>
          </div>
        </div>

        <div className="ss" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="sc">
            <div className="si blue"><ClipboardList size={20} /></div>
            <div>
              <div className="sl">Total Types</div>
              <div className="sv">{totalAll}</div>
            </div>
          </div>
          <div className="sc">
            <div className="si blue" style={{ background: '#f0fdf4', color: '#16a34a' }}><ClipboardList size={20} /></div>
            <div>
              <div className="sl">Active</div>
              <div className="sv">{activeCount}</div>
            </div>
          </div>
          <div className="sc">
            <div className="si blue" style={{ background: '#fef2f2', color: '#dc2626' }}><ClipboardList size={20} /></div>
            <div>
              <div className="sl">Inactive</div>
              <div className="sv">{inactiveCount}</div>
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
                    placeholder="Search by name or remarks…"
                    className="fctl hi"
                  />
                </div>
              </div>
            </div>
            <div className="fa" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="abg" style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-search">
                  <Search size={14} /> Search
                </button>
                <Link href="/dashboard/admin/meetingtype" className="btn-reset">
                  <RotateCcw size={14} /> Reset
                </Link>
              </div>
              <BulkDeleteButton />
            </div>
          </form>
        </div>

        <div className="tc">
          <div className="th">
            <h3>Type List</h3>
            <span className="rb">{filteredTotal} Records</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th className="chk-cell">
                    <MasterCheckbox />
                  </th>
                  <th>Meeting Type</th>
                  <th>Remarks</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="es">
                        <div className="es-icon"><ClipboardList size={28} /></div>
                        <h4>No meeting types found</h4>
                        <p>Try searching for a different name or remarks.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((m) => (
                    <tr key={m.MeetingTypeID}>
                      <td className="chk-cell">
                        <input
                          type="checkbox"
                          className="row-checkbox"
                          value={m.MeetingTypeID}
                        />
                      </td>
                      <td>
                        <div className="rt">{m.MeetingTypeName}</div>
                      </td>
                      <td>
                        <div className="rm">{m.Remarks || "—"}</div>
                      </td>
                      <td>
                        <div className="ar">
                          <Link
                            href={`/dashboard/admin/meetingtype/${m.MeetingTypeID}`}
                            className="bti view"
                            title="View"
                          >
                            <Eye size={17} />
                          </Link>
                          <div className="adiv" />
                          <Link
                            href={`/dashboard/admin/meetingtype/edit/${m.MeetingTypeID}`}
                            className="bti edit"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </Link>
                          <div className="adiv" />
                          <div className="bti del">
                            <DeleteButton id={m.MeetingTypeID} />
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
