import { prisma } from '@/lib/prisma' 
import React from 'react'
import { EditStaffAction } from '@/app/actions/staff/EditStaffAction';

async function EditStaff({params}:{params:Promise<{id:number}>}) { 
    const {id} = await params; 
    const data = await prisma.staff.findFirst({ 
        where:{StaffID:Number(id)}
    }) 

    
    if (!data) {
        return <p className="text-center mt-10">Staff Details not found</p>;
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
            action={EditStaffAction}
            className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-800">
                Edit Staff Details 
            </h2>

            {/* Hidden ID */}
            <input
                type="hidden"
                name="StaffID"
                value={data.StaffID}
            />

            {/* Staff Name */}
            <div>
            <label className="block text-sm text-gray-600 mb-1">
                Staff Name
            </label>
            <input
                type="text"
                name="StaffName"
                defaultValue={data.StaffName}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            </div>

             {/* MobileNo */}
            <div>
            <label className="block text-sm text-gray-600 mb-1">
                MobileNo.
            </label>
            <input
                type="text"
                name="MobileNo"
                defaultValue={data.MobileNo}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            </div>

            
             {/* Email Address */}
            <div>
            <label className="block text-sm text-gray-600 mb-1">
                Email Address
            </label>
            <input
                type="text"
                name="EmailAddress"
                defaultValue={data.EmailAddress}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Remarks */}
            <div>
            <label className="block text-sm text-gray-600 mb-1">
                Remarks
            </label>
            <input
                type="text"
                name="Remarks"
                defaultValue={data.Remarks ?? ""}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Submit */}
            <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
            Update
            </button>
        </form>
        </div>
    );
} 
 
export default EditStaff;