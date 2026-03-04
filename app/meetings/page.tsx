import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteMeeting from "../ui/DeleteButtonForMeetings";
import { 
  Plus, 
  Download, 
  Search, 
  Eye, 
  Edit,
  RotateCcw,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Hash
} from "lucide-react";

export default async function GetAll() {
  const rows = await prisma.meetings.findMany({
    orderBy: { MeetingID: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* BREADCRUMBS & HEADER */}
        <div className="flex flex-col gap-2">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-600">Meetings</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meeting Management</h1>
            <Link
              href="/meetings/add"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <Plus size={18} /> Add New Meeting
            </Link>
          </div>
        </div>

        {/* SEARCH & FILTER CARD (IMPROVED FROM SCREENSHOT) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Filter size={18} />
            </div>
            <h2 className="font-bold text-slate-800">Advanced Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level / Category</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
                <option>Select Level</option>
              </select>
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Enter meeting title or description..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting ID</label>
              <input 
                type="text"
                placeholder="Ex: 001" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">
              <Search size={16} /> Search Records
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all">
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* DATA TABLE CARD */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Record List</h3>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
              {rows.length} Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Title & Identity</th>
                  <th className="px-6 py-4 text-center">Attachment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((m: any) => (
                  <tr key={m.MeetingID} className="group hover:bg-blue-50/20 transition-all">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <FileText size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {m.MeetingDescription}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mt-1">
                            <Hash size={12} /> ID-{m.MeetingID.toString().padStart(3, '0')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        {m.DocumentPath ? (
                          <a
                            href={m.DocumentPath}
                            download
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all"
                          >
                            <Download size={14} /> Download PDF
                          </a>
                        ) : (
                          <span className="text-slate-300 text-[11px] font-medium italic">No document found</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/meetings/${m.MeetingID}`} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        
                        <Link 
                          href={`/meetings/edit/${m.MeetingID}`} 
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        
                        <div className="text-slate-300 hover:text-red-500 transition-colors p-1">
                          <DeleteMeeting id={m.MeetingID} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER / PAGINATION */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing page 1 of 10
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white hover:text-slate-900 transition-all">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white hover:text-slate-900 transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}