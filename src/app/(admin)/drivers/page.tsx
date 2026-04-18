import { PrismaClient } from "@prisma/client";
import { Bike, Navigation, MapPin, CheckCircle2, Navigation2, Zap, ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const prisma = new PrismaClient();

export default async function DriversPage() {
  const drivers = await prisma.driver.findMany({
    include: {
       orders: {
         where: { status: "ON_WAY" }
       }
    }
  });

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-5xl font-black font-poppins italic tracking-tighter uppercase leading-none mb-4">
             Squad <span className="text-[var(--color-brand-orange)]">Logistics</span>
           </h1>
           <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Monitoreo de Flota en Tiempo Real</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-black text-white px-6 py-4 rounded-[1.5rem] border border-white/10 shadow-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-[var(--color-brand-orange)] rounded-xl flex items-center justify-center">
                 <Zap size={20} className="fill-white" />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Squad</p>
                 <p className="text-xl font-black italic lreading-none">{drivers.length} Unidades</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {drivers.map(driver => {
           const isBusy = driver.status === "BUSY" || driver.orders.length > 0;
           return (
             <div key={driver.id} className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 w-full h-2 ${isBusy ? 'bg-[var(--color-brand-orange)] shadow-[0_0_15px_rgba(255,90,0,0.4)]' : 'bg-green-500/30'}`}></div>
                
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-neutral-900 rounded-[1.5rem] flex items-center justify-center text-[var(--color-brand-orange)] shadow-xl transform group-hover:rotate-12 transition-transform duration-500">
                    <Bike size={32} />
                  </div>
                  <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border ${isBusy ? 'bg-orange-50 border-orange-100 text-[var(--color-brand-orange)]' : 'bg-green-50 border-green-100 text-green-600'}`}>
                     <div className={`w-2 h-2 rounded-full ${isBusy ? 'bg-[var(--color-brand-orange)] animate-pulse' : 'bg-green-500'}`}></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">
                        {isBusy ? 'En Misión' : 'Disponible'}
                     </span>
                  </div>
                </div>
                
                <div className="mb-8">
                   <h3 className="font-black italic text-2xl tracking-tighter uppercase mb-1">{driver.name}</h3>
                   <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      <ShieldCheck size={12} />
                      {driver.vehicle} • ID #{driver.id.slice(-4).toUpperCase()}
                   </div>
                </div>
                
                {isBusy && driver.orders.length > 0 ? (
                  <div className="bg-neutral-900 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-3 opacity-20">
                        <Navigation2 size={40} className="text-[var(--color-brand-orange)]" />
                     </div>
                     <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Ruta de Entrega</p>
                     <p className="text-sm font-bold italic line-clamp-2 leading-relaxed mb-4">{driver.orders[0].address}</p>
                     <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-brand-orange)]">{driver.orders[0].customerName}</span>
                        <ArrowUpRight size={16} className="text-gray-600" />
                     </div>
                  </div>
                ) : (
                  <div className="bg-gray-50/50 border border-dashed border-gray-200 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-2">
                     <MapPin className="text-gray-300" size={24} />
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Esperando en Base</p>
                  </div>
                )}
                
                <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Performance</p>
                      <div className="flex items-center gap-1.5 font-black italic text-lg tracking-tighter">
                         <CheckCircle2 size={18} className="text-green-500" /> 100%
                         <span className="text-[10px] font-bold text-gray-300 not-italic uppercase ml-1">Daily</span>
                      </div>
                   </div>
                   <button className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-2xl transition-all">
                      <Navigation size={18} />
                   </button>
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}
