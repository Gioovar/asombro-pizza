"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import { Clock, CheckCircle2, ChevronRight, XCircle, AlertTriangle, Bike, Pizza, Timer, Truck, Zap, ChefHat, User } from "lucide-react";
import { format } from "date-fns";

const STATUSES = [
  { id: "NEW", title: "Entrada", color: "text-red-500 bg-red-500/10", icon: <AlertTriangle size={18} /> },
  { id: "PREPARING", title: "Cocina", color: "text-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/10", icon: <ChefHat size={18} /> },
  { id: "READY", title: "Control", color: "text-amber-500 bg-amber-500/10", icon: <Timer size={18} /> },
  { id: "ON_WAY", title: "Ruta", color: "text-blue-500 bg-blue-500/10", icon: <Truck size={18} /> },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setUrgentOrdersCount } = useAdminStore();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const newOrdersCount = data.filter(o => o.status === "NEW").length;
        
        setOrders(prev => {
          const prevNewCount = prev.filter(o => o.status === "NEW").length;
          if (newOrdersCount > prevNewCount && prev.length > 0) {
             const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3");
             audio.play().catch(e => console.log("Audio notify interaction required"));
          }
          return data;
        });

        setUrgentOrdersCount(newOrdersCount);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus })
    });
    fetchOrders();
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col pt-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[var(--color-brand-orange)] fill-[var(--color-brand-orange)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Panel de Control</span>
           </div>
           <h1 className="text-5xl font-black font-poppins tracking-tighter italic uppercase leading-none">
             Logística <span className="text-[var(--color-brand-orange)]">Operativa</span>
           </h1>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-tight">Estado Síncrono</p>
                 <p className="text-sm font-black italic tracking-tighter">Sincronización en Vivo</p>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-10 overflow-x-auto pb-10 custom-scrollbar px-2">
        {STATUSES.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          
          return (
             <div key={col.id} className="min-w-[360px] max-w-[400px] flex-shrink-0 flex flex-col group">
                {/* Column Header */}
                <div className={`p-8 rounded-t-[3rem] border-t border-l border-r border-gray-100 flex justify-between items-center transition-all bg-white shadow-2xl relative overflow-hidden`}>
                  <div className={`absolute top-0 left-0 w-full h-1.5 ${col.color.replace('bg-', 'bg-').split(' ')[1]}`}></div>
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${col.color} shadow-lg shadow-gray-100`}>
                        {col.icon}
                     </div>
                     <span className="font-black italic text-xl tracking-tighter uppercase">{col.title}</span>
                  </div>
                  <div className="bg-neutral-900 text-white px-4 py-2 rounded-2xl text-xs font-black italic shadow-xl">
                     {colOrders.length}
                  </div>
                </div>
                
                {/* Scrollable Column Content */}
                <div className="flex-1 bg-gray-50/30 backdrop-blur-3xl border border-gray-100 rounded-b-[3rem] p-6 overflow-y-auto space-y-6 shadow-inner custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {colOrders.map(order => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: 50 }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        key={order.id}
                        className={`relative bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border-2 transition-all group/card ${
                          order.status === 'NEW' 
                            ? 'border-red-500/30 shadow-[0_30px_60px_rgba(239,68,68,0.1)] ring-8 ring-red-500/5' 
                            : 'border-white hover:border-gray-200'
                        }`}
                      >
                         <div className="flex justify-between items-start mb-6">
                            <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                               <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none mb-1">Ticket Squad</p>
                               <span className="text-[10px] font-black text-gray-500 italic uppercase">#{order.id.slice(-6).toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-xl text-white shadow-xl translate-y-[-10px]">
                               <Clock size={12} className="text-[var(--color-brand-orange)]" /> 
                               <span className="text-[10px] font-black italic uppercase tracking-widest">{format(new Date(order.createdAt), "HH:mm")}</span>
                            </div>
                         </div>
                         
                         <div className="mb-6">
                            <h3 className="font-black italic text-3xl tracking-tighter uppercase leading-none mb-2 text-black">{order.customerName}</h3>
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                               <User size={12} /> Cliente VIP Asombro
                            </div>
                         </div>
                         
                         <div className="space-y-3 mb-8">
                           {order.items.map((item: any) => (
                             <div key={item.id} className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex flex-col">
                                <div className="flex justify-between items-center mb-1">
                                   <span className="text-gray-900 text-sm font-black italic uppercase tracking-tight line-clamp-1">{item.product.name}</span>
                                   <span className="bg-black text-white px-2 py-0.5 rounded-lg text-xs font-black italic">x{item.quantity}</span>
                                </div>
                                {item.options && Object.keys(item.options).length > 0 && (
                                   <div className="flex flex-wrap gap-1 mt-2">
                                      {Object.entries(item.options).map(([key, val]: [string, any]) => (
                                         <span key={key} className="text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-0.5 rounded-full">
                                            {Array.isArray(val) ? val.join(", ") : val}
                                         </span>
                                      ))}
                                   </div>
                                )}
                             </div>
                           ))}
                         </div>

                         <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                            <div>
                               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Valor de Misión</p>
                               <span className="font-black text-2xl italic tracking-tighter text-black">${order.total}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                               {order.status === "NEW" && (
                                 <button onClick={() => updateStatus(order.id, "PREPARING")} className="bg-red-500 text-white px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-500/20 flex items-center gap-2 group/btn">
                                   ACEPTAR <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><Zap size={14} /></motion.div>
                                 </button>
                               )}
                               {order.status === "PREPARING" && (
                                 <button onClick={() => updateStatus(order.id, "READY")} className="bg-black text-white px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[var(--color-brand-orange)] transition-all shadow-xl flex items-center gap-2 group/btn">
                                   LISTO <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                 </button>
                               )}
                               {order.status === "READY" && (
                                 <button onClick={() => updateStatus(order.id, "ON_WAY")} className="bg-[var(--color-brand-orange)] text-white px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group/btn">
                                   DESPACHAR <Truck size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                 </button>
                               )}
                               {order.status === "ON_WAY" && (
                                 <button onClick={() => updateStatus(order.id, "DELIVERED")} className="bg-green-600 text-white px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-green-600/20 flex items-center gap-2">
                                   ENTREGADO <CheckCircle2 size={14} />
                                 </button>
                               )}
                            </div>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {colOrders.length === 0 && !loading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-48 border-2 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center text-gray-300 gap-4"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                         {col.icon}
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-widest">Columna despejada</p>
                    </motion.div>
                  )}
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
}
