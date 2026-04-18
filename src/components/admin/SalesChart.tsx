"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { format } from "date-fns";

type ChartData = {
  time: string;
  sales: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-xl p-4 border border-white/20 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-xl font-black italic text-black">
          ${payload[0].value.toFixed(2)} <span className="text-[10px] uppercase not-italic">mxn</span>
        </p>
      </div>
    );
  }
  return null;
};

export function SalesChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[340px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5A00" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#FF5A00" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} 
            dy={15}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FF5A00', strokeWidth: 1, strokeDasharray: '5 5' }} />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#FF5A00" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorSales)"
            animationDuration={2000}
            dot={{ r: 4, fill: '#FF5A00', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8, fill: '#FF5A00', strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
