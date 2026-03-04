"use client";

export type Meeting = {
  MeetingID: number;
  MeetingDate: Date;
  MeetingDescription: string | null;
  Status: string;
  Location?: string | null;
};

export default function Modal({
  meeting,
  onClose,
}: {
  meeting: Meeting;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">{meeting.MeetingDescription}</h2>
        <p><strong>Date:</strong> {new Date(meeting.MeetingDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {meeting.Status}</p>
        <p><strong>Location:</strong> {meeting.Location || "Not Set"}</p>
      </div>
    </div>
  );
}