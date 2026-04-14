"use client";

import { useDriverStore } from "@/store/useDriverStore";
import { Banknote, TrendingUp, Calendar, ChevronRight } from "lucide-react";

export default function DriverEarnings() {
  const { driverId } = useDriverStore();
  
  return (
    <div className="h-full flex flex-col bg-gray-50 p-6">
      <div className="mb-8 pt-8">
        <h1 className="text-3xl font-black font-poppins">Tus Ganancias 💰</h1>
        <p className="text-gray-500">Mantén el ritmo, estás en el Top 10% de repartidores.</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl text-white shadow-[0_15px_30px_rgba(37,99,235,0.3)] mb-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-3xl opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
         
         <p className="text-blue-200 font-medium mb-1">Balance Semanal</p>
         <h2 className="text-5xl font-black font-poppins mb-6">$3,450.00</h2>
         
         <div className="flex gap-4 border-t border-blue-500/50 pt-4 mt-2">
            <div>
               <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Viajes</p>
               <p className="font-bold text-lg">98</p>
            </div>
            <div className="w-px bg-blue-500/50"></div>
            <div>
               <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Horas</p>
               <p className="font-bold text-lg">34.5</p>
            </div>
         </div>
      </div>

      <div className="flex justify-between items-center mb-4 px-2">
         <h3 className="font-bold text-lg">Actividad Reciente</h3>
         <button className="text-blue-600 text-sm font-bold flex items-center">Ver todo <ChevronRight size={16} /></button>
      </div>

      <div className="space-y-3">
         {[1,2,3,4,5].map((_, i) => (
           <div key={i} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-xl text-gray-400">
                    <Banknote size={20} />
                 </div>
                 <div>
                    <p className="font-bold">Asombro Pizza</p>
                    <p className="text-xs text-gray-400">Hoy, {14 + i}:30 hrs</p>
                 </div>
              </div>
              <p className="font-bold text-green-600">+$35.00</p>
           </div>
         ))}
      </div>
    </div>
  );
}
