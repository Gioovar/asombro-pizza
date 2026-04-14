"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import { Clock, CheckCircle2, ChevronRight, XCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const STATUSES = [
  { id: "NEW", title: "Nuevos", color: "bg-red-50 text-red-600 border-red-200" },
  { id: "PREPARING", title: "En Cocina", color: "bg-orange-50 text-orange-600 border-orange-200" },
  { id: "READY", title: "Listos / Esperando Repartidor", color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  { id: "ON_WAY", title: "En Camino", color: "bg-blue-50 text-blue-600 border-blue-200" },
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
        // Find newly pending orders for alert
        const newOrdersCount = data.filter(o => o.status === "NEW").length;
        
        setOrders(prev => {
          const prevNewCount = prev.filter(o => o.status === "NEW").length;
          // Play sound if we have more new orders than before!
          if (newOrdersCount > prevNewCount && prev.length > 0) {
             const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3");
             audio.play().catch(e => console.log("Audio play failed / user interacted needed"));
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
    fetchOrders(); // Initial fetch
    const interval = setInterval(fetchOrders, 5000); // Polling every 5s for "Real Time" simulate
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
    fetchOrders(); // Refresh
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-black font-poppins">Centro de Pedidos 🍕</h1>
        <p className="text-gray-500">Mueve los pedidos por los estados de preparación en tiempo real.</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
        {STATUSES.map(col => {
          const colOrders = orders.filter(o => o.status === col.id);
          
          return (
             <div key={col.id} className="min-w-[320px] max-w-[360px] flex-shrink-0 flex flex-col snap-start">
               {/* Column Header */}
               <div className={`p-4 rounded-t-2xl border-t border-l border-r font-bold flex justify-between items-center ${col.color}`}>
                 <span>{col.title}</span>
                 <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">{colOrders.length}</span>
               </div>
               
               {/* Column Body */}
               <div className="flex-1 bg-gray-50/50 border border-gray-200 rounded-b-2xl p-4 overflow-y-auto space-y-4 shadow-inner">
                 {loading && colOrders.length === 0 && <div className="animate-pulse h-24 bg-gray-200 rounded-xl" />}
                 
                 <AnimatePresence>
                   {colOrders.map(order => (
                     <motion.div
                       layout
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       key={order.id}
                       className={`bg-white p-5 rounded-2xl shadow-sm border ${order.status === 'NEW' ? 'border-red-500 shadow-red-500/20' : 'border-gray-100'}`}
                     >
                        <div className="flex justify-between items-start mb-3">
                           <span className="text-xs font-bold text-gray-400">#{order.id.slice(-6).toUpperCase()}</span>
                           <span className="text-xs text-gray-400 flex items-center gap-1">
                             <Clock size={12} /> {format(new Date(order.createdAt), "HH:mm")}
                           </span>
                        </div>
                        
                        <h3 className="font-bold text-lg leading-tight mb-2">{order.customerName}</h3>
                        
                        <div className="space-y-1 mb-4">
                          {order.items.map((item: any) => (
                            <p key={item.id} className="text-sm text-gray-600 flex justify-between">
                              <span><span className="font-bold">{item.quantity}x</span> {item.product.name}</span>
                            </p>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                           <span className="font-bold">${order.total}</span>
                           
                           {/* Actions based on current status */}
                           {order.status === "NEW" && (
                             <button onClick={() => updateStatus(order.id, "PREPARING")} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-red-600">
                               Aceptar <CheckCircle2 size={16} />
                             </button>
                           )}
                           {order.status === "PREPARING" && (
                             <button onClick={() => updateStatus(order.id, "READY")} className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-gray-800">
                               Listo <ChevronRight size={16} />
                             </button>
                           )}
                           {order.status === "READY" && (
                             <button onClick={() => updateStatus(order.id, "ON_WAY")} className="bg-[var(--color-brand-orange)] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1">
                               Despachar <Bike size={16} />
                             </button>
                           )}
                           {order.status === "ON_WAY" && (
                             <button onClick={() => updateStatus(order.id, "DELIVERED")} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1">
                               Entregado <CheckCircle2 size={16} />
                             </button>
                           )}
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
                 
                 {colOrders.length === 0 && !loading && (
                   <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                     Vacío
                   </div>
                 )}
               </div>
             </div>
          )
        })}
      </div>
    </div>
  );
}

// Inline Bike icon since it wasn't imported top level
function Bike(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
    </svg>
  );
}
