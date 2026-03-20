"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";

export default function MonthSelector({ 
  currentMonth, 
  currentYear 
}: { 
  currentMonth: number; 
  currentYear: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYearNum - i);

  const handleUpdate = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-slate-500">
        <Calendar size={16} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Filter Period</span>
      </div>
      
      <div className="flex items-center gap-3">
        <select
          value={currentMonth}
          onChange={(e) => handleUpdate("month", e.target.value)}
          className="bg-transparent border-none text-sm font-black text-slate-900 outline-none cursor-pointer focus:ring-0"
        >
          {months.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>

        <div className="h-4 w-[1px] bg-slate-200"></div>

        <select
          value={currentYear}
          onChange={(e) => handleUpdate("year", e.target.value)}
          className="bg-transparent border-none text-sm font-black text-slate-900 outline-none cursor-pointer focus:ring-0"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
