"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

type ChartData = {
  time: string;
  sales: number;
};

export function SalesChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-brand-orange)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-brand-orange)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <Tooltip 
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
             itemStyle={{ color: 'var(--color-brand-orange)', fontWeight: 'bold' }}
             formatter={(value: any) => [`$${value} MXN`, "Ventas"]}
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="var(--color-brand-orange)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSales)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
