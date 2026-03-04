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
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Session Distribution
        </h2>
        <div className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500">
          Live Sync
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center -mt-6">
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="70%" 
                startAngle={180}
                endAngle={0}
                innerRadius={85}
                outerRadius={115}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
                cornerRadius={12} // Smooth rounded caps
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-all cursor-pointer outline-none"
                    style={{
                        filter: `drop-shadow(0px 4px 6px ${COLORS[index % COLORS.length]}33)`
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-2 rounded-xl shadow-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {payload[0].name}
                        </p>
                        <p className="text-lg font-black text-slate-900 leading-none">
                          {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* CENTRAL STATS */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 pointer-events-none">
            <span className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">
              {total}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Total Meetings
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING STATUS CARDS */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((entry, index) => (
          <div 
            key={entry.name} 
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group"
          >
            <div 
              className="h-2 w-2 rounded-full shrink-0 group-hover:scale-125 transition-transform" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                {entry.name}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-800">{entry.value}</span>
                <span className="text-[10px] font-bold text-slate-400">
                   ({Math.round((entry.value / total) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}