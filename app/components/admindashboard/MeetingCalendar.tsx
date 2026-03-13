"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useState, useEffect } from "react";
import Modal from "./MeetingModal";

export type Meeting = {
  MeetingID: number;
  MeetingDate: Date;
  MeetingDescription: string | null;
  Status: string;
  Location?: string | null;
};

export default function MeetingCalendar({ meetings }: { meetings: Meeting[] }) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isNewMeeting, setIsNewMeeting] = useState(false);
  const [newDate, setNewDate] = useState<string>("");

  useEffect(() => {
    const mapped = meetings.map((m) => ({
      id: m.MeetingID.toString(),
      title: m.MeetingDescription || "No Description",
      start: m.MeetingDate,
      allDay: false,
      extendedProps: { ...m },
      color:
        m.Status === "Completed" ? "#10b981" : // emerald-500
          m.Status === "Scheduled" ? "#3b82f6" : // blue-500
            "#f59e0b", // amber-500
    }));
    setEvents(mapped);
  }, [meetings]);

  const handleDateClick = (arg: any) => {
    setNewDate(arg.dateStr);
    setIsNewMeeting(true);
    setSelectedMeeting(null);
  };

  const handleEventClick = (info: any) => {
    const meeting = info.event.extendedProps as Meeting;
    setSelectedMeeting(meeting);
    setIsNewMeeting(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-auto">
      <style>{`
        .fc { --fc-border-color: #f1f5f9; --fc-today-bg-color: #eff6ff; }
        .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.025em; }
        .fc .fc-button-primary { background-color: #3b82f6; border-color: #3b82f6; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; padding: 0.6rem 1.2rem; border-radius: 0.75rem; transition: all 0.2s; }
        .fc .fc-button-primary:hover { background-color: #2563eb; border-color: #2563eb; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
        .fc .fc-button-primary:disabled { background-color: #94a3b8; border-color: #94a3b8; }
        .fc .fc-daygrid-day-number { font-weight: 700; color: #64748b; font-size: 0.85rem; padding: 8px; }
        .fc .fc-col-header-cell-cushion { font-weight: 800; color: #94a3b8; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 12px 0; }
        .fc-event { border: none !important; padding: 4px 8px !important; border-radius: 8px !important; font-weight: 600 !important; font-size: 0.75rem !important; cursor: pointer !important; transition: all 0.2s !important; border-left: 4px solid rgba(0,0,0,0.1) !important; }
        .fc-event:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; z-index: 10; }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,listWeek",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEvents={3}
        stickyHeaderDates={true}
      />

      {(selectedMeeting || isNewMeeting) && (
        <Modal
          meeting={selectedMeeting as any}
          isNew={isNewMeeting}
          date={newDate}
          onClose={() => {
            setSelectedMeeting(null);
            setIsNewMeeting(false);
          }}
        />
      )}
    </div>
  );
}