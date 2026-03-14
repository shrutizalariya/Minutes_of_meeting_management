import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Bell, 
  Check, 
  Trash2, 
  Clock, 
  Inbox, 
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  XCircle
} from "lucide-react";
import { markAsRead, markAllAsRead, clearNotifications } from "@/app/actions/notification/NotificationActions";

export default async function StaffNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filterType = type || "all";

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) redirect("/");

  const payload: any = await verifyToken(tokenCookie.value);
  if (!payload || !payload.id) redirect("/");

  const userId = payload.id;

  // Fetch notifications
  const where: any = {
    OR: [
      { UserID: userId },
      { UserID: null }
    ]
  };

  if (filterType !== "all") {
    where.Type = filterType;
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { CreatedAt: 'desc' },
  });

  const unreadCount = notifications.filter(n => n.IsNew).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .notif-container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          font-family: 'Sora', sans-serif;
        }

        .header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .page-header h1 {
          font-size: 1.85rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .page-header p {
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .action-group {
          display: flex;
          gap: 0.75rem;
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.15rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.2s;
          cursor: pointer;
          border: 1.5px solid transparent;
          text-decoration: none;
        }

        .btn-mark {
          background: #eff6ff;
          color: #2563eb;
        }
        .btn-mark:hover {
          background: #2563eb;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .btn-clear {
          background: #fff;
          color: #94a3b8;
          border-color: #e2e8f0;
        }
        .btn-clear:hover {
          background: #fef2f2;
          color: #dc2626;
          border-color: #fecaca;
          transform: translateY(-2px);
        }

        /* Filter Strip */
        .filter-strip {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          overflow-x: auto;
        }

        .filter-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 10px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .filter-btn:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .filter-btn.active {
          background: #0f172a;
          color: #fff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        /* Grid */
        .notif-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .notif-card {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          gap: 1.25rem;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .notif-card:hover {
          border-color: #cbd5e1;
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }

        .notif-card.unread {
          border-color: #3b82f6;
          background: linear-gradient(to right, #fff, #f8faff);
        }

        .notif-card.unread::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #3b82f6;
        }

        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-box.meeting { background: #eff6ff; color: #3b82f6; }
        .icon-box.system { background: #f0fdf4; color: #10b981; }
        .icon-box.alert { background: #fff7ed; color: #f59e0b; }
        .icon-box.critical { background: #fef2f2; color: #ef4444; }

        .content-box {
          flex: 1;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .notif-type {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
          display: block;
          margin-bottom: 0.25rem;
        }

        .notif-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .notif-time {
          font-size: 0.7rem;
          font-weight: 600;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .notif-message {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.5;
          margin-top: 0.5rem;
        }

        .empty-state {
          padding: 5rem 2rem;
          text-align: center;
          background: #fff;
          border-radius: 24px;
          border: 2px dashed #e2e8f0;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #f8fafc;
          border-radius: 24px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cbd5e1;
        }

        @media (max-width: 640px) {
          .notif-card { flex-direction: column; align-items: flex-start; }
          .icon-box { width: 40px; height: 40px; }
        }
      `}</style>

      <div className="notif-container">
        
        {/* Header */}
        <div className="header-section">
          <div className="page-header">
            <h1>Notification Center</h1>
            <p>You have {unreadCount} unread messages targeting your account.</p>
          </div>

          <div className="action-group">
            <form action={async () => {
              "use server";
              await markAllAsRead(userId);
              redirect("/dashboard/staff/notifications");
            }}>
              <button type="submit" className="btn-action btn-mark">
                <CheckCircle2 size={16} /> Mark all read
              </button>
            </form>
            
            <form action={async () => {
              "use server";
              await clearNotifications();
              redirect("/dashboard/staff/notifications");
            }}>
              <button type="submit" className="btn-action btn-clear">
                <Trash2 size={16} /> Clear list
              </button>
            </form>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-strip">
          <Link href="/dashboard/staff/notifications?type=all" className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}>
            <Bell size={14} /> All Updates
          </Link>
          <Link href="/dashboard/staff/notifications?type=meeting" className={`filter-btn ${filterType === 'meeting' ? 'active' : ''}`}>
            <CalendarDays size={14} /> Meetings
          </Link>
          <Link href="/dashboard/staff/notifications?type=system" className={`filter-btn ${filterType === 'system' ? 'active' : ''}`}>
            <CheckCircle2 size={14} /> System
          </Link>
          <Link href="/dashboard/staff/notifications?type=alert" className={`filter-btn ${filterType === 'alert' ? 'active' : ''}`}>
            <AlertCircle size={14} /> Alerts
          </Link>
        </div>

        {/* Notifications Grid */}
        <div className="notif-grid">
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              let iconClass = "system";
              let icon = <CheckCircle2 size={24} />;

              if (notif.Type === "meeting") { iconClass = "meeting"; icon = <CalendarDays size={24} />; }
              if (notif.Color === "orange" || notif.Type === "alert") { iconClass = "alert"; icon = <AlertCircle size={24} />; }
              if (notif.Color === "red") { iconClass = "critical"; icon = <XCircle size={24} />; }

              return (
                <div key={notif.Id} className={`notif-card ${notif.IsNew ? 'unread' : ''}`}>
                  <div className={`icon-box ${iconClass}`}>
                    {icon}
                  </div>
                  
                  <div className="content-box">
                    <div className="content-header">
                      <div>
                        <span className="notif-type">{notif.Type || 'Update'}</span>
                        <h3 className="notif-title">{notif.Title}</h3>
                      </div>
                      <div className="notif-time">
                        <Clock size={12} />
                        {new Date(notif.CreatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="notif-message">{notif.Message}</p>
                    
                    {notif.IsNew && (
                      <form action={async () => {
                        "use server";
                        await markAsRead(notif.Id);
                        redirect("/dashboard/staff/notifications");
                      }} style={{ marginTop: '1rem' }}>
                        <button type="submit" className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer flex items-center gap-1">
                          <Check size={12} /> Mark as read
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Inbox size={40} />
              </div>
              <h2 className="text-slate-800 font-bold text-xl">Peace and quiet!</h2>
              <p className="text-slate-400 mt-2">No notifications found in this category.</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
