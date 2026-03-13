import React, { Suspense } from "react";
import StaffAttendanceSummary from "@/app/components/admindashboard/StaffAttendanceSummary";
import { Activity, SlidersHorizontal, Search, RotateCcw } from "lucide-react";
import Link from "next/link";

interface SearchParams {
  keyword?: string;
  page?: string;
}

export default async function StaffAttendance({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const keyword = params?.keyword ?? "";
  const page = Number(params?.page ?? "1");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .mi { max-width: 1200px; margin: 0 auto; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1.75rem; font-family: 'Sora', sans-serif; }
        .bc { display:flex; align-items:center; gap:.375rem; font-size:.72rem; font-weight:500; color:#94a3b8; letter-spacing:.04em; text-transform:uppercase; }
        .bc a { color:#94a3b8; text-decoration:none; }
        .bc a:hover { color:#1e40af; }
        .bc-sep { color:#cbd5e1; }
        .hrow { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-top:.25rem; }
        .ptitle { font-size:1.65rem; font-weight:700; color:#0f172a; letter-spacing:-.03em; line-height:1.2; margin:0; }
        .ptitle span { display:block; font-size:.8rem; font-weight:500; color:#64748b; letter-spacing:.01em; margin-top:.2rem; }
        
        .fc { background:#fff; border:1px solid #e2e8f0; border-radius:16px; box-shadow:0 1px 4px rgba(0,0,0,.04); overflow:hidden; }
        .fh { padding:1.1rem 1.6rem; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; gap:.75rem; background:#fafbfe; }
        .fh-icon { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#eff6ff,#dbeafe); display:flex; align-items:center; justify-content:center; color:#1d4ed8; flex-shrink:0; }
        .fh h2 { font-size:.88rem; font-weight:700; color:#1e293b; margin:0; }
        .fb { padding:1.5rem 1.6rem; display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:1.25rem; align-items:end; }
        .fg { display:flex; flex-direction:column; gap:.45rem; }
        .flabel { font-size:.68rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.08em; }
        .fctl { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:9px; padding:.6rem .9rem; font-size:.82rem; font-family:'Sora',sans-serif; color:#1e293b; outline:none; transition:all .15s; width:100%; }
        .fctl:focus { border-color:#3b82f6; background:#fff; box-shadow:0 0 0 3px rgba(59,130,246,.1); }
        .iw { position:relative; }
        .ii { position:absolute; left:.75rem; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; }
        .fctl.hi { padding-left:2.25rem; }
        .fa { padding:1rem 1.6rem 1.4rem; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; gap:.75rem; flex-wrap:wrap; }
        .abg { display:flex; gap:.75rem; }
        .btn-search { display:inline-flex; align-items:center; gap:.45rem; background:#0f172a; color:#fff; border:none; border-radius:9px; padding:.6rem 1.2rem; font-size:.8rem; font-weight:700; font-family:'Sora',sans-serif; cursor:pointer; transition:all .15s; }
        .btn-search:hover { background:#1e293b; }
        .btn-reset { display:inline-flex; align-items:center; gap:.45rem; background:transparent; color:#64748b; border:1.5px solid #e2e8f0; border-radius:9px; padding:.6rem 1.2rem; font-size:.8rem; font-weight:600; font-family:'Sora',sans-serif; cursor:pointer; text-decoration:none; transition:all .15s; }
        .btn-reset:hover { background:#f8fafc; color:#475569; }
      `}</style>

      <div className="mi">
        <div>
          <nav className="bc">
            <Link href="/">Home</Link>
            <span className="bc-sep">/</span>
            <Link href="/dashboard/admin">Dashboard</Link>
            <span className="bc-sep">/</span>
            <span style={{ color: "#475569" }}>Staff Attendance</span>
          </nav>

          <div className="hrow">
            <h1 className="ptitle">
              Staff Attendance
              <span>Analyze participation rates across your staff</span>
            </h1>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="fc">
          <div className="fh">
            <div className="fh-icon"><SlidersHorizontal size={16} /></div>
            <h2>Search &amp; Filter</h2>
          </div>
          <form method="GET">
            <div className="fb">
              <div className="fg">
                <label className="flabel">Staff Name</label>
                <div className="iw">
                  <Search className="ii" size={14} />
                  <input
                    name="keyword"
                    defaultValue={keyword}
                    type="text"
                    placeholder="Search by name…"
                    className="fctl hi"
                  />
                </div>
              </div>
            </div>
            <div className="fa">
              <div className="abg">
                <button type="submit" className="btn-search">
                  <Search size={14} /> Search Records
                </button>
                <Link href="/dashboard/admin/staffAttendance" className="btn-reset">
                  <RotateCcw size={14} /> Reset
                </Link>
              </div>
            </div>
          </form>
        </div>

        <Suspense fallback={<div className="p-20 text-center text-slate-400">Loading attendance data...</div>}>
          <StaffAttendanceSummary keyword={keyword} page={page} />
        </Suspense>
      </div>
    </>
  );
}
