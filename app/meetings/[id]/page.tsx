
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import { Calendar, FileText, Info, Clock, XCircle, CheckCircle } from "lucide-react";

async function GetById({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;

  const data = await prisma.meetings.findFirst({
    where: { MeetingID: Number(id) },
    include: {
      meetingtype: true,
    },
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg font-medium">Meeting not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" /> Meeting Details
          </h1>
          <span
            className={`px-4 py-1 rounded-full font-semibold text-sm flex items-center gap-2 ${
              data.IsCancelled
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {data.IsCancelled ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {data.IsCancelled ? "Cancelled" : "Active"}
          </span>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Meeting ID</p>
              <p className="text-gray-800 font-medium">{data.MeetingID}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Meeting Date</p>
              <p className="text-gray-700">{new Date(data.MeetingDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Meeting Type</p>
              <p className="text-gray-700 font-medium">{data.meetingtype?.MeetingTypeName ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Document</p>
              {data.DocumentPath ? (
                <a
                  href={data.DocumentPath}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                  ⬇️ View Document
                </a>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-500" /> Description
          </p>
          <p className="text-gray-700 mt-1">{data.MeetingDescription}</p>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="text-gray-700 text-sm">{data.Created ? new Date(data.Created).toLocaleString() : "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Modified At</p>
              <p className="text-gray-700 text-sm">{data.Modified ? new Date(data.Modified).toLocaleString() : "—"}</p>
            </div>
          </div>
        </div>

        {/* Cancellation Info */}
        {data.IsCancelled && (
          <div className="bg-red-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Cancellation Date & Time: </span>
                {data.CancellationDateTime ? new Date(data.CancellationDateTime).toLocaleString() : "—"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Reason: </span>
                {data.CancellationReason || "—"}
              </p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <Link
          href="/meetings"
          className="inline-block w-full text-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition"
        >
          ← Back to Meetings
        </Link>
      </div>
    </div>
  );
}

export default GetById;
