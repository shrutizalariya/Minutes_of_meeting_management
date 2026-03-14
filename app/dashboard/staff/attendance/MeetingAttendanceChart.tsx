"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonthlyData = {
  name: string;
  meetingPresent: number;
  meetingTotal: number;
};

export default function MeetingAttendanceChart({ data }: { data: MonthlyData[] }) {
  return (
    <div className="h-[300px] w-full bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Meeting Attendance Trend</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-200"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Meetings</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorMeeting" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '16px', 
              border: '1px solid #f1f5f9',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px', fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="meetingTotal" 
            name="Total Meetings"
            stroke="#e2e8f0" 
            strokeWidth={2}
            fill="#f8fafc" 
            fillOpacity={1}
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="meetingPresent" 
            name="Present"
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMeeting)" 
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
