"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ChefHat, Bike, PackageCheck, Clock, MapPin, Phone, ChevronLeft, Star, Sparkles, MessageCircle } from "lucide-react";
import { useAuth } from "../store/useAuth";

interface OrderTrackingModalProps {
  orderId: string;
  onClose: () => void;
}

type OrderStatus = "NEW" | "PREPARING" | "READY" | "ON_WAY" | "DELIVERED" | "CANCELLED";

interface TrackingOrder {
  id: string;
  status: OrderStatus;
  total: number;
  tip: number;
  driverLat: number | null;
  driverLng: number | null;
  driver: { name: string; phone: string } | null;
  createdAt: string;
  items: { quantity: number; price: number; product: { name: string } }[];
}

const STEPS: { status: OrderStatus; label: string; sublabel: string; icon: any }[] = [
  {
    status: "NEW",
    label: "Orden Recibida",
    sublabel: "Experiencia Confirmada",
    icon: PackageCheck,
  },
  {
    status: "PREPARING",
    label: "En Horno de Piedra",
    sublabel: "Masa Madre en Proceso",
    icon: ChefHat,
  },
  {
    status: "ON_WAY",
    label: "En Ruta con el Squad",
    sublabel: "Tu repartidor va volando",
    icon: Bike,
  },
  {
    status: "DELIVERED",
    label: "¡Buen Provecho!",
    sublabel: "Disfruta el momento Asombro",
    icon: Sparkles,
  },
];

function getStepIndex(status: OrderStatus): number {
  if (status === "READY") return 1;
  const map: Record<OrderStatus, number> = {
    NEW: 0,
    PREPARING: 1,
    READY: 1,
    ON_WAY: 2,
    DELIVERED: 3,
    CANCELLED: -1,
  };
  return map[status] ?? 0;
}

const ETA: Record<OrderStatus, string> = {
  NEW: "~35-40 min",
  PREPARING: "~25 min",
  READY: "~15 min",
  ON_WAY: "~5-8 min",
  DELIVERED: "Llegó",
  CANCELLED: "Cancelado",
};

export function OrderTrackingModal({ orderId, onClose }: OrderTrackingModalProps) {
  const { token } = useAuth();
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  const fetchOrder = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/client/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.order) setOrder(data.order);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isOnWay = order?.status === "ON_WAY" || order?.status === "DELIVERED";
  const isDelivered = order?.status === "DELIVERED";

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 32, stiffness: 280 }}
        className="bg-[var(--color-brand-marble)] w-full sm:max-w-md rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col border border-white/20"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-all">
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              {order && (
                <div className="flex items-center gap-1.5 bg-black text-[var(--color-brand-orange)] px-4 py-2 rounded-2xl shadow-lg border border-white/5">
                  <Clock size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{ETA[order.status]}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-end">
             <div>
               <h2 className="text-2xl font-black font-poppins italic tracking-tighter uppercase leading-none mb-1">Tu Experiencia</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking Reference: #{orderId.slice(-6).toUpperCase()}</p>
             </div>
             <a href="tel:+525500000000" className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-black hover:text-[var(--color-brand-orange)] rounded-2xl transition-all shadow-sm">
               <Phone size={20} />
             </a>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-black border-t-[var(--color-brand-orange)] rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sincronizando Sistema...</p>
            </div>
          ) : order ? (
            <>
              {/* Live Map Display */}
              <AnimatePresence>
                {isOnWay && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 240, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden relative border-b border-gray-100"
                  >
                    {order.driverLat && order.driverLng ? (
                      <iframe
                        key={`${order.driverLat.toFixed(4)},${order.driverLng.toFixed(4)}`}
                        width="100%"
                        height="240"
                        src={`https://maps.google.com/maps?q=${order.driverLat},${order.driverLng}&z=16&output=embed`}
                        style={{ border: 0 }}
                        className="grayscale-[30%] opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center gap-3">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                           <Bike size={48} className="text-[var(--color-brand-orange)]" />
                        </motion.div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Localizando al Repartidor...</p>
                      </div>
                    )}
                    
                    {/* Floating Driver Info */}
                    {order.driver && (
                      <div className="absolute bottom-6 left-6 right-6">
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="bg-black/85 backdrop-blur-xl text-white p-4 rounded-3xl flex items-center gap-4 shadow-2xl border border-white/5"
                        >
                          <div className="w-12 h-12 bg-[var(--color-brand-orange)] text-white rounded-2xl flex items-center justify-center font-black italic text-lg flex-shrink-0 shadow-lg">
                            {order.driver.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black italic text-sm tracking-tight truncate">{order.driver.name}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">En su camino • ¡Viene volando!</p>
                          </div>
                          <button className="p-3 bg-white/10 hover:bg-[var(--color-brand-orange)] hover:text-white rounded-xl transition-all">
                             <MessageCircle size={18} />
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Timeline */}
              <div className="px-8 py-10">
                <div className="space-y-2">
                  {STEPS.map((step, idx) => {
                    const isDone = idx < currentStep;
                    const isActive = idx === currentStep;
                    const isPending = idx > currentStep;
                    const isLast = idx === STEPS.length - 1;
                    const Icon = step.icon;

                    return (
                      <div key={step.status} className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <motion.div
                            animate={{
                              backgroundColor: isDone || isActive ? "#000" : "#F3F4F6",
                              scale: isActive ? 1.1 : 1,
                              borderColor: isActive ? "#FF5A00" : "transparent"
                            }}
                            className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 shadow-lg border-2`}
                          >
                             <Icon 
                                size={22} 
                                className={isDone || isActive ? "text-[var(--color-brand-orange)]" : "text-gray-300"} 
                             />
                          </motion.div>
                          {!isLast && (
                            <div className="w-0.5 flex-1 my-1 bg-gray-100 overflow-hidden min-h-[40px]">
                              <motion.div
                                initial={{ height: "0%" }}
                                animate={{ height: isDone ? "100%" : "0%" }}
                                transition={{ duration: 0.8 }}
                                className="w-full bg-black shadow-[0_0_8px_rgba(255,90,0,0.4)]"
                              />
                            </div>
                          )}
                        </div>

                        <div className={`pb-10 flex-1 ${isLast ? "pb-0" : ""}`}>
                          <div className="flex items-center gap-3">
                            <h4 className={`font-black italic uppercase tracking-tighter text-lg ${isPending ? "text-gray-300" : "text-gray-900"}`}>
                              {step.label}
                            </h4>
                            {isActive && (
                              <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                  <motion.div
                                    key={i}
                                    animate={{ 
                                       scale: [1, 1.5, 1],
                                       opacity: [0.3, 1, 0.3],
                                       backgroundColor: ["#FF5A00", "#000", "#FF5A00"]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-1.5 h-1.5 rounded-full"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isPending ? "text-gray-200" : "text-gray-400"}`}>
                            {step.sublabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info Card */}
              <div className="px-8 pb-10">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Tu curaduría</p>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="font-bold text-gray-700">{item.quantity}× <span className="italic">{item.product.name}</span></span>
                          <span className="font-black italic tracking-tighter">${(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inversión Final</span>
                       <span className="font-black italic text-3xl tracking-tighter text-black">${order.total}</span>
                    </div>
                    {order.tip > 0 && <span className="text-[10px] font-black uppercase italic text-[var(--color-brand-orange)] pb-1">+${order.tip} Reward Incl.</span>}
                  </div>
                </div>
              </div>

              {/* Final Experience Rating (Only if Delivered) */}
              <AnimatePresence>
                {isDelivered && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="px-8 pb-10"
                   >
                      <div className="bg-black rounded-[2.5rem] p-8 text-center text-white relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[80px] rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                         <h4 className="font-black italic text-xl tracking-tighter mb-2 relative z-10 uppercase">¿Fue Asombroso?</h4>
                         <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-6 relative z-10">Tu calificación nos ayuda a perfeccionarnos</p>
                         
                         <div className="flex justify-center gap-3 relative z-10 mb-8">
                            {[1,2,3,4,5].map(star => (
                               <button 
                                 key={star} 
                                 onClick={() => setRating(star)}
                                 className={`p-3 rounded-2xl transition-all ${rating >= star ? 'bg-[var(--color-brand-orange)] scale-110 shadow-lg' : 'bg-neutral-800 text-gray-600 hover:text-white'}`}
                               >
                                  <Star size={24} fill={rating >= star ? "white" : "none"} strokeWidth={rating >= star ? 0 : 2} />
                               </button>
                            ))}
                         </div>
                         
                         <button 
                            onClick={onClose}
                            className="bg-white text-black w-full py-5 rounded-[2rem] font-black italic uppercase tracking-widest text-xs hover:bg-[var(--color-brand-orange)] hover:text-white transition-all shadow-xl"
                         >
                            Enviar & Finalizar
                         </button>
                      </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="py-24 text-center">
              <p className="text-gray-400 font-black italic uppercase tracking-widest text-xs">Sistema no disponible</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
