import React from "react";
import MeetingCalendar from "@/app/components/admindashboard/MeetingCalendar";
import { getMeetingsForCalendar } from "@/lib/admin/meetingCalendar";
import { 
  FileText, Users, CheckCircle, Clock, 
  MoreVertical, Plus, Calendar as CalendarIcon, MapPin 
} from "lucide-react";


export default async function CalendarPage() {
  const meetings = await getMeetingsForCalendar();
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <MeetingCalendar meetings={meetings} />
    </div>
  );
}