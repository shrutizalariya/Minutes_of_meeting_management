"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type ChartData = {
  name: string;
  present: number;
  absent: number;
  total: number;
};

export default function ConvenerAttendanceChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        barGap={8}
      >
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
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ 
            backgroundColor: '#fff', 
            borderRadius: '16px', 
            border: 'none',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            padding: '12px'
          }}
          labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px', fontSize: '12px' }}
          itemStyle={{ fontSize: '11px', fontWeight: 600 }}
        />
        <Bar 
          dataKey="present" 
          name="Present" 
          fill="#3b82f6" 
          radius={[6, 6, 0, 0]} 
          barSize={24}
          animationDuration={1500}
        />
        <Bar 
          dataKey="absent" 
          name="Absent" 
          fill="#e2e8f0" 
          radius={[6, 6, 0, 0]} 
          barSize={24}
          animationDuration={1800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
