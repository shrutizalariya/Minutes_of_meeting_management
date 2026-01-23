import { prisma } from '@/lib/prisma';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

async function GetById({params}:{params:Promise<{id:number}>}) {
    const {id} = await params;
    const data = await prisma.meetingtype.findFirst({
        where:{MeetingTypeID:Number(id)}
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
          Meeting Type Details
        </h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Meeting Type Name</p>
            <p className="text-lg font-medium text-gray-800">
              {data.MeetingTypeName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Remarks</p>
            <p className="text-gray-700">
              {data.Remarks || "—"}
            </p>
          </div>
        </div>

        <Link
          href="/meetingtype"
          className="inline-block mt-6 text-center w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          ← Back to Meeting Types
        </Link>
      </div>
    </div>
  );
}

export default GetById;