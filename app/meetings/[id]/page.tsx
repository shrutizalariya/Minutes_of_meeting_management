import { prisma } from '@/lib/prisma';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

async function GetById({params}:{params:Promise<{id:number}>}) {
    const {id} = await params;
    const data = await prisma.meetings.findFirst({
        where:{MeetingID:Number(id)},
        include: {
            meetingtype: true,
        },
    })
   if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Meeting Type not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Meeting Details
        </h2>

        <div className="space-y-4">
        <div>
            <p className="text-sm text-gray-500">Meeting ID</p>
            <p className="text-lg font-medium text-gray-800">
            {data.MeetingID}
            </p>
        </div>

        <div>
            <p className="text-sm text-gray-500">Meeting Date</p>
            <p className="text-gray-700">
            {new Date(data.MeetingDate).toLocaleDateString()}
            </p>
        </div>

        <div>
            <p className="text-sm text-gray-500">Meeting Type</p>
            <p className="text-gray-700 font-medium">
            {data.meetingtype?.MeetingTypeName ?? "—"}
            </p>
        </div>

        <div>
            <p className="text-sm text-gray-500">Meeting Description</p>
            <p className="text-gray-700">
            {data.MeetingDescription}
            </p>
        </div>

        <div>
            <p className="text-sm text-gray-500">Document</p>
            {data.DocumentPath ? (
            <a
                href={data.DocumentPath}
                target="_blank"
                className="text-blue-600 hover:underline"
            >
                View Document
            </a>
            ) : (
            <p className="text-gray-400">—</p>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-gray-700 text-sm">
            {data.Created
                ? new Date(data.Created).toLocaleString()
                : "—"}
            </p>
        </div>

            <div>
            <p className="text-sm text-gray-500">Modified</p>
            <p className="text-gray-700 text-sm">
                {data.Modified
                ? new Date(data.Modified).toLocaleString()
                : "—"}
            </p>
            </div>
        </div>

        <div>
            <p className="text-sm text-gray-500">Status</p>
            {data.IsCancelled ? (
            <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                Cancelled
            </span>
            ) : (
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Active
            </span>
            )}
        </div>

        {data.IsCancelled && (
            <>
            <div>
                <p className="text-sm text-gray-500">
                Cancellation Date & Time
                </p>
                <p className="text-gray-700">
                {data.CancellationDateTime
                    ? new Date(data.CancellationDateTime).toLocaleString()
                    : "—"}
                </p>
            </div>

            <div>
                <p className="text-sm text-gray-500">
                Cancellation Reason
                </p>
                <p className="text-gray-700">
                {data.CancellationReason || "—"}
                </p>
            </div>
            </>
        )}
        </div>


        <Link
          href="/meetings"
          className="inline-block mt-6 text-center w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          ← Back to Meetings 
        </Link>
      </div>
    </div>
  );
}

export default GetById;