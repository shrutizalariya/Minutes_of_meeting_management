
import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteMeeting from "@/app/ui/DeleteButtonForMeetings";
import {
  Plus,
  Download,
  Search,
  Eye,
  Edit,
  RotateCcw,
  FileText,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  SlidersHorizontal,
  ClipboardList,
  MapPin,
  Clock,
  Trash2,
} from "lucide-react";

export default async function GetAll() {
  const rows = await prisma.meetings.findMany({
    orderBy: { MeetingID: "desc" },
  });

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

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.65rem 1.3rem;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(29,78,216,0.35), 0 1px 2px rgba(0,0,0,0.08);
          transition: all 0.2s;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(29,78,216,0.4), 0 1px 2px rgba(0,0,0,0.08);
        }
        .btn-primary:active { transform: scale(0.97); }

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

        .filter-actions {
          padding: 1rem 1.6rem 1.4rem;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
        }
        .action-btns-group { display: flex; gap: 0.75rem; }
        
        .btn-search {
          display: inline-flex;
          align-items: center;
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
        }
        .btn-search:hover { background: #1e293b; transform: translateY(-1px); }
        .btn-reset {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          color: #64748b;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          padding: 0.6rem 1.2rem;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-reset:hover { background: #f8fafc; border-color: #cbd5e1; color: #475569; }

        .btn-bulk-delete {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fee2e2;
          border-radius: 9px;
          padding: 0.6rem 1.2rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-bulk-delete:hover { background: #dc2626; color: #fff; }

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

        .action-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.35rem;
        }
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
        }
        .btn-icon.view  { color: #1d4ed8; }
        .btn-icon.edit  { color: #16a34a; }
        .btn-icon.del   { color: #94a3b8; }

        .btn-icon:hover.view  { background: #eff6ff; color: #1e40af; }
        .btn-icon:hover.edit  { background: #f0fdf4; color: #15803d; }
        .btn-icon:hover.del   { background: #fef2f2; color: #dc2626; }

        .action-divider {
          width: 1px;
          height: 16px;
          background: #f1f5f9;
        }

        .table-footer {
          padding: 0.9rem 1.6rem;
          border-top: 1px solid #f1f5f9;
          background: #fafbfe;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
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
          gap: 0.3rem;
        }
        .page-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
        }
        .page-btn:hover { background: #0f172a; color: #fff; border-color: #0f172a; }
        .page-btn.active { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }

        .checkbox-cell { width: 40px; padding-right: 0; }
        
        /* HOVER LOGIC FOR ROW CHECKBOXES */
        tbody .checkbox-cell input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #1d4ed8;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        /* HEADER CHECKBOX IS ALWAYS VISIBLE */
        thead .checkbox-cell input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #1d4ed8;
          cursor: pointer;
          opacity: 1;
        }

        tbody tr:hover .checkbox-cell input[type="checkbox"],
        tbody .checkbox-cell input[type="checkbox"]:checked {
          opacity: 1;
        }

        @media (max-width: 900px) {
          .stats-strip { grid-template-columns: 1fr; }
          .filter-body { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* INLINE SCRIPT FOR SELECT ALL LOGIC - Using ID to avoid React prop error */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('change', function(e) {
          if (e.target && e.target.id === 'master-checkbox') {
            const checkboxes = document.getElementsByClassName('row-checkbox');
            for (let i = 0; i < checkboxes.length; i++) {
              checkboxes[i].checked = e.target.checked;
            }
          }
        });
      `}} />

      <div>
        <div className="meetings-inner">
          <div className="header-block">
            <nav className="breadcrumb">
              <Link href="/">Home</Link>
              <span className="breadcrumb-sep">/</span>
              <span style={{ color: "#475569" }}>Meetings</span>
            </nav>
            <div className="header-row">
              <h1 className="page-title">
                Meeting Management
                <span>Oversee, search, and manage all recorded meetings</span>
              </h1>
            </div>
          </div>

          <div className="stats-strip">
            <div className="stat-card">
              <div className="stat-icon blue">
                <ClipboardList size={20} />
              </div>
              <div>
                <div className="stat-label">Total Meetings</div>
                <div className="stat-value">{rows.length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <Download size={20} />
              </div>
              <div>
                <div className="stat-label">With Documents</div>
                <div className="stat-value">{rows.filter((r: any) => r.DocumentPath).length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">
                <CalendarDays size={20} />
              </div>
              <div>
                <div className="stat-label">No Document</div>
                <div className="stat-value">{rows.filter((r: any) => !r.DocumentPath).length}</div>
              </div>
            </div>
          </div>

          <div className="filter-card">
            <div className="filter-header">
              <div className="filter-header-icon">
                <SlidersHorizontal size={16} />
              </div>
              <h2>Advanced Search & Filter</h2>
            </div>

            <div className="filter-body">
              <div className="form-group">
                <label className="form-label">Search Keyword</label>
                <div className="input-wrap">
                  <Search className="input-icon" size={15} />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    className="form-control has-icon"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meeting Venue</label>
                <div className="input-wrap">
                  <MapPin className="input-icon" size={14} />
                  <input
                    type="text"
                    placeholder="Search by venue..."
                    className="form-control has-icon"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Meeting Time</label>
                <div className="input-wrap">
                  <Clock className="input-icon" size={14} />
                  <input
                    type="time"
                    className="form-control has-icon"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Result Limit</label>
                <select className="form-control">
                  <option value="all">Show All Records</option>
                  <option value="10">Top 10 Recent</option>
                  <option value="25">Top 25 Recent</option>
                  <option value="50">Top 50 Recent</option>
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <div className="action-btns-group">
                <button className="btn-search">
                  <Search size={14} /> Search Records
                </button>
                <button className="btn-reset">
                  <RotateCcw size={14} /> Reset
                </button>
              </div>

              <button className="btn-bulk-delete">
                <Trash2 size={14} /> Delete Selected
              </button>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h3>Record List</h3>
              <span className="record-badge">{rows.length} Records</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th className="checkbox-cell">
                      {/* MASTER CHECKBOX - No event handler here to avoid Next.js error */}
                      <input 
                        type="checkbox" 
                        id="master-checkbox"
                        title="Select All" 
                      />
                    </th>
                    <th>Meeting Details</th>
                    <th className="center">Attachment</th>
                    <th className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m: any) => (
                    <tr key={m.MeetingID}>
                      <td className="checkbox-cell">
                        {/* ROW CHECKBOX */}
                        <input 
                          type="checkbox" 
                          className="row-checkbox" 
                          value={m.MeetingID} 
                        />
                      </td>
                      <td>
                        <div className="row-identity">
                          <div className="row-avatar">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="row-title">{m.MeetingDescription}</div>
                            <div className="row-meta">
                              <span className="meta-item">
                                <Clock size={12} />
                                {m.MeetingTime || "N/A"}
                              </span>
                              <span className="meta-item">
                                <MapPin size={12} />
                                {m.Venue || "Main Hall"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="center">
                        {m.DocumentPath ? (
                          <a href={m.DocumentPath} download className="btn-download">
                            <Download size={13} /> Download PDF
                          </a>
                        ) : (
                          <span className="no-doc">No attachment</span>
                        )}
                      </td>

                      <td className="right">
                        <div className="action-row">
                          <Link
                            href={`/dashboard/admin/meetings/${m.MeetingID}`}
                            className="btn-icon view"
                            title="View details"
                          >
                            <Eye size={17} />
                          </Link>
                          <div className="action-divider" />
                          <Link
                            href={`/dashboard/admin/meetings/edit/${m.MeetingID}`}
                            className="btn-icon edit"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </Link>
                          <div className="action-divider" />
                          <div className="btn-icon del" title="Delete">
                            <DeleteMeeting id={m.MeetingID} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <p className="page-info">Showing page 1 of 1</p>
              <div className="pagination">
                <button className="page-btn"><ChevronLeft size={15} /></button>
                <button className="page-btn active">1</button>
                <button className="page-btn"><ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}