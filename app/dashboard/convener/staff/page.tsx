import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, 
  Search, 
  RotateCcw, 
  Mail, 
  Phone, 
  Shield, 
  User as UserIcon,
  Filter,
  ArrowLeft
} from "lucide-react";

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
  const { q, role, page } = await searchParams;
  const keyword = q || "";
  const currentRole = role || "all";
  const currentPage = parseInt(page || "1");
  const pageSize = 12;

  const where: any = {
    AND: [
      keyword ? {
        OR: [
          { StaffName: { contains: keyword } },
          { EmailAddress: { contains: keyword } }
        ]
      } : {},
      currentRole !== "all" ? { user: { Role: currentRole } } : {}
    ]
  };

  const [staffList, totalRecords] = await Promise.all([
    prisma.staff.findMany({
      where,
      include: { user: true },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: { StaffName: "asc" }
    }),
    prisma.staff.count({ where })
  ]);

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="space-y-10" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/convener" className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 no-underline hover:text-blue-700 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Personnel Directory</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium">Browse and search for organizational members to include in your facilitations.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/10">
              <Users size={24} />
           </div>
           <div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Total Pool</div>
              <div className="text-2xl font-black text-slate-900">{totalRecords}</div>
           </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <form method="GET" className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Search Personnel</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                name="q" 
                placeholder="Search by name or email address..." 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                defaultValue={keyword}
              />
            </div>
          </div>
          <div className="w-full md:w-64 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Operational Role</label>
            <select 
              name="role" 
              className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              defaultValue={currentRole}
            >
              <option value="all">Every Account</option>
              <option value="Admin">Administrators</option>
              <option value="Meeting Convener">Conveners</option>
              <option value="Staff">Regular Staff</option>
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button type="submit" className="flex-1 md:flex-none bg-[#0B1324] text-white px-10 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] hover:bg-slate-800 transition-all shadow-md">
              Apply
            </button>
            <Link href="/dashboard/convener/staff" className="p-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all border border-slate-100">
              <RotateCcw size={22} />
            </Link>
          </div>
        </form>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {staffList.map((s) => (
          <div key={s.StaffID} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 hover:shadow-[0_20px_60px_rgb(0,0,0,0.05)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden relative">
            {/* Top Badge */}
            <div className="absolute top-0 right-0 px-6 py-4">
               <span className="text-[9px] font-black text-blue-600/40 uppercase tracking-widest">ID #{s.StaffID}</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <UserIcon size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{s.StaffName}</h3>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-wider mt-2 border border-slate-100">
                 <Shield size={10} /> {s.user?.Role || "Unassigned"}
              </div>

              <div className="w-full h-[1px] bg-slate-50 my-6"></div>

              <div className="w-full space-y-3">
                 <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                    <Mail size={14} className="text-blue-500/50" />
                    <span className="truncate">{s.EmailAddress}</span>
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                    <Phone size={14} className="text-blue-500/50" />
                    {s.MobileNo || "No Contact"}
                 </div>
              </div>

              <button className="w-full mt-8 py-3.5 bg-slate-50 text-slate-400 group-hover:bg-[#0B1324] group-hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300">
                 Invite to Meeting
              </button>
            </div>
          </div>
        ))}
        {staffList.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="h-20 w-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto mb-4">
                <Search size={40} />
             </div>
             <p className="text-slate-400 font-bold text-lg italic">No members found matching your search.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
           <Link 
             href={`?q=${keyword}&role=${currentRole}&page=${currentPage - 1}`}
             className={`h-12 w-12 rounded-2xl flex items-center justify-center border border-slate-100 transition-all ${currentPage <= 1 ? "bg-slate-50 text-slate-200 pointer-events-none" : "bg-white text-slate-400 hover:bg-blue-600 hover:text-white shadow-md"}`}
           >
              <ArrowLeft size={18} />
           </Link>
           <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <Link
                  key={i + 1}
                  href={`?q=${keyword}&role=${currentRole}&page=${i + 1}`}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${currentPage === i + 1 ? "bg-[#0B1324] text-white shadow-xl scale-110" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"}`}
                >
                  {i + 1}
                </Link>
              ))}
           </div>
           <Link 
             href={`?q=${keyword}&role=${currentRole}&page=${currentPage + 1}`}
             className={`h-12 w-12 rounded-2xl flex items-center justify-center border border-slate-100 transition-all ${currentPage >= totalPages ? "bg-slate-50 text-slate-200 pointer-events-none" : "bg-white text-slate-400 hover:bg-blue-600 hover:text-white shadow-md"}`}
           >
              <Search size={18} className="rotate-90 transform" />
           </Link>
        </div>
      )}
    </div>
  );
}
