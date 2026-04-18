"use client";

import { useDriverStore } from "@/store/useDriverStore";
import { Banknote, TrendingUp, Calendar, ChevronRight, Zap, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function DriverEarnings() {
  const { driverId } = useDriverStore();
  
  // Simulated data for the premium UI
  const dailyGoal = 600;
  const currentDaily = 420;
  const progressPercent = (currentDaily / dailyGoal) * 100;

  return (
    <div className="h-full flex flex-col bg-black p-6 pb-32">
      <div className="mb-10 pt-10">
        <h1 className="text-4xl font-black font-poppins italic tracking-tighter uppercase text-white">Tus <span className="text-[var(--color-brand-orange)]">Ganancias</span></h1>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sigue así, tienes un desempeño excelente</p>
      </div>

      {/* Premium Weekly Card with Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-neutral-900 border border-white/10 p-8 rounded-[3rem] text-white shadow-[0_30px_60px_rgba(0,0,0,0.5)] mb-8 overflow-hidden group"
      >
         {/* Background Glow */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[80px] opacity-20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
         
         <div className="flex justify-between items-start mb-2">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">Balance Semanal</p>
            <Award className="text-[var(--color-brand-orange)]" size={20} />
         </div>
         <h2 className="text-5xl font-black font-poppins italic tracking-tighter mb-8">$3,450<span className="text-xl not-italic text-gray-500 ml-1">.00</span></h2>
         
         <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mt-2 relative z-10">
            <div>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1 leading-none">Viajes</p>
               <div className="flex items-center gap-2">
                  <p className="font-black text-2xl italic">98</p>
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-black uppercase">Exitosos</span>
               </div>
            </div>
            <div>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1 leading-none">Puntos SQUAD</p>
               <div className="flex items-center gap-2">
                  <p className="font-black text-2xl italic">1,240</p>
                  <zap size={16} className="text-[var(--color-brand-orange)]" />
               </div>
            </div>
         </div>
      </motion.div>

      {/* Daily Progress Goal Widget */}
      <div className="bg-neutral-900/50 p-6 rounded-[2.5rem] border border-white/5 mb-10">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
               <Target size={16} className="text-[var(--color-brand-orange)]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Meta Diaria</span>
            </div>
            <span className="text-[10px] font-black text-white italic">${currentDaily} / ${dailyGoal}</span>
         </div>
         <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden p-0.5">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progressPercent}%` }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className="h-full bg-gradient-to-r from-[var(--color-brand-orange)] to-orange-400 rounded-full shadow-[0_0_15px_rgba(255,90,0,0.5)]"
            ></motion.div>
         </div>
         <p className="text-[9px] text-gray-500 font-bold mt-4 uppercase tracking-[0.1em] text-center">Faltan $180 para tu bonus de combustible ⛽</p>
      </div>

      <div className="flex justify-between items-center mb-6 px-4">
         <h3 className="font-black italic text-lg text-white uppercase tracking-tight">Actividad Reciente</h3>
         <button className="text-[var(--color-brand-orange)] text-[10px] font-black uppercase tracking-widest flex items-center gap-1">Todo <ChevronRight size={14} /></button>
      </div>

      <div className="space-y-4">
         {[1,2,3,4].map((_, i) => (
           <motion.div 
             key={i} 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-neutral-900 p-5 rounded-[2rem] flex justify-between items-center border border-white/5 shadow-xl"
           >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-black flex items-center justify-center rounded-2xl text-[var(--color-brand-orange)] border border-white/5">
                    <Banknote size={24} />
                 </div>
                 <div>
                    <p className="font-black italic text-white uppercase tracking-tight">Orden Premium</p>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Sucursal Brooklyn • {14 + i}:30 hrs</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="font-black text-green-500 italic text-lg">+$35.00</p>
                 <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Base + Propina</p>
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}

function zap(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14.71 13 4l-1 8h8L11 20l1-8H4Z"/>
    </svg>
  );
}
