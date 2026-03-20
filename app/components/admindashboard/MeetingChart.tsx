"use client";

import React from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

type Props = {
  data: { name: string; value: number }[];
};

export default function MeetingChart({ data }: Props) {
  // Ultra-modern enterprise color palette
  const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#f43f5e"];
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* Header with Glassmorphism Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Session Distribution
          </h2>
          <p className="text-[10px] text-slate-300 font-medium">Real-time status tracking</p>
        </div>
        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm animate-pulse">
           Live
        </div>
      </div>

      <div className="relative h-[240px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%" 
              startAngle={180}
              endAngle={0}
              innerRadius={90}
              outerRadius={140}
              paddingAngle={4}
              dataKey="value"
              cornerRadius={10}
              strokeWidth={0}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-90 transition-all cursor-pointer outline-none"
                />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-100 p-2.5 rounded-xl shadow-lg ring-1 ring-slate-900/5">
                      <div className="flex items-center gap-1.5 mb-0.5">
                         <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                         <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{payload[0].name}</span>
                      </div>
                      <p className="text-lg font-black text-slate-800 leading-none">{payload[0].value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-x-0 bottom-[15%] flex flex-col items-center pointer-events-none">
           <span className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
            {total}
          </span>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">
            Total Pulse
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        {data.map((entry, index) => (
          <div 
            key={entry.name}
            className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center text-center group hover:bg-white transition-all duration-300"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
               <div className={`h-1.5 w-1.5 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{entry.name}</span>
            </div>
            <p className="text-xl font-black text-slate-800 tracking-tight leading-none tabular-nums">
              {entry.value}
            </p>
            <p className="text-[8px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-md mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
               {Math.round((entry.value / (total || 1)) * 100)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}