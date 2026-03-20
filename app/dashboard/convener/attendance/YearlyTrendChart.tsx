"use client";

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function YearlyTrendChart({ data }: { data: { name: string; rate: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
          domain={[0, 100]} 
        />
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ 
            backgroundColor: '#fff', 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
          }}
        />
        <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
