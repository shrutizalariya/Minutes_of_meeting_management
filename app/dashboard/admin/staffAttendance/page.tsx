import React from "react";
import StaffAttendanceSummary from "@/app/components/admindashboard/StaffAttendanceSummary";

export default function StaffAttendance() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Staff Attendance</h1>
      <StaffAttendanceSummary />
      {/* <StaffAttendanceTable /> */}
    </div>
  );
}