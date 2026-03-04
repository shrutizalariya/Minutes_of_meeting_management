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

  useEffect(() => {
    const mapped = meetings.map((m) => ({
      id: m.MeetingID,
      title: m.MeetingDescription || "No Description",
      start: m.MeetingDate,
      color:
        m.Status === "Completed" ? "#34D399" : // green
        m.Status === "Scheduled" ? "#3B82F6" : // blue
        "#FBBF24", // yellow
    }));
    setEvents(mapped);
  }, [meetings]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 overflow-auto">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={events}
        eventClick={(info) => {
          const meeting = meetings.find((m) => m.MeetingID === Number(info.event.id));
          setSelectedMeeting(meeting || null);
        }}
        height="auto"
        contentHeight="auto"
        dayMaxEvents={true}
      />

      {selectedMeeting && (
        <Modal meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />
      )}
    </div>
  );
}