"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDriverStore } from "@/store/useDriverStore";
import { Power, Navigation, BellRing, MapPin, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DriverHome() {
  const { isOnline, toggleOnline, driverId, setIncomingOrder } = useDriverStore();
  const router = useRouter();
  const [localIncoming, setLocalIncoming] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(10);

  // Poll for orders if online
  useEffect(() => {
    if (!isOnline) return;
    
    let interval = setInterval(async () => {
       try {
         const res = await fetch("/api/driver/ping");
         const data = await res.json();
         if (data.pending && data.order) {
            setLocalIncoming(data.order);
            // Play sound
            try {
              new Audio("https://cdn.pixabay.com/download/audio/2021/08/09/audio_8e1e72e19a.mp3?filename=bell-ringing-04-45070.mp3").play();
            } catch(e) {}
         }
       } catch (err) {
         console.error(err);
       }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline]);

  // Countdown timer when incoming order is caught
  useEffect(() => {
     if (localIncoming) {
        setTimeLeft(10);
        const timer = setInterval(() => {
           setTimeLeft(prev => {
             if (prev <= 1) {
                setLocalIncoming(null); // Timeout!
                return 0;
             }
             return prev - 1;
           });
        }, 1000);
        return () => clearInterval(timer);
     }
  }, [localIncoming]);

  const handleAccept = async () => {
      try {
        const res = await fetch("/api/driver/ping", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ action: "ACCEPT", orderId: localIncoming.id, driverId: driverId || "simulated-driver-1" })
        });
        const data = await res.json();
        if (data.success) {
           setIncomingOrder(null);
           setLocalIncoming(null);
           router.push("/driver/active-order?orderId=" + data.order.id);
        }
      } catch(e) {
        console.error(e);
      }
  };

  const handleReject = () => {
      setLocalIncoming(null);
  };

  return (
    <div className="h-full relative overflow-hidden bg-white flex flex-col">
       {/* Fake Map Background - more contrast and premium feeling */}
       <div 
         className="absolute inset-0 pointer-events-none transition-all duration-1000 grayscale filter brightness-[0.8] contrast-150" 
         style={{ 
            backgroundImage: "url('https://maps.wikimedia.org/osm-intl/14/3482/6659.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isOnline ? 0.6 : 0.15,
            transform: isOnline ? "scale(1.05)" : "scale(1)"
         }}
       ></div>

       {/* Top Header Glassmorphism */}
       <div className="relative z-10 px-8 pt-14 pb-6 flex justify-between items-center bg-white/40 backdrop-blur-xl border-b border-white/20">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black shadow-xl">
                {driverId?.charAt(0) || "D"}
             </div>
             <div className="leading-tight">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none mb-1">Repartidor</p>
                <p className="font-bold text-gray-900">{driverId || "Giovanni"}</p>
             </div>
          </div>
          <div className="bg-black/90 text-white px-5 py-2.5 rounded-2xl font-black shadow-2xl text-xs flex items-center gap-2 border border-white/10">
             Hoy <span className="text-[var(--color-brand-orange)]">$450.00</span>
          </div>
       </div>

       <div className="flex-1 flex flex-col justify-end p-10 relative z-10">
          <AnimatePresence>
            {!isOnline && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10 bg-white/90 p-6 rounded-[2.5rem] shadow-2xl backdrop-blur-md border border-gray-100 flex flex-col items-center gap-2"
              >
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                    <Power size={24} />
                 </div>
                 <h2 className="font-black text-xl text-gray-900">Estás Desconectado</h2>
                 <p className="text-sm text-gray-500 font-medium">Pulsa GO para empezar a recibir pedidos.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {isOnline && !localIncoming && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center mb-10 bg-black/95 text-white p-7 rounded-[2.5rem] shadow-2xl backdrop-blur-md relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
               <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                     <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                     </span>
                  </div>
                  <h2 className="font-black text-lg font-poppins mb-1 uppercase tracking-tighter">Buscando Pedidos...</h2>
                  <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest">Zona de alta demanda 🔥</p>
               </div>
            </motion.div>
          )}

          <div className="flex justify-center mt-auto mb-10">
             <button 
               onClick={toggleOnline}
               className={`w-32 h-32 rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 relative group active:scale-90 ${isOnline ? 'bg-white text-red-600' : 'bg-black text-white'}`}
             >
                {/* Ripple Effect Ring when Online */}
                {isOnline && (
                   <span className="absolute inset-0 rounded-full border border-red-500/30 animate-[ping_2s_linear_infinite]"></span>
                )}
                
                <div className="flex flex-col items-center">
                   <span className="font-black text-3xl tracking-tighter italic font-poppins">
                     {isOnline ? "OFF" : "GO"}
                   </span>
                   <Zap size={14} className={`mt-1 ${isOnline ? 'text-red-600' : 'text-[var(--color-brand-orange)] opacity-80'}`} fill="currentColor" />
                </div>
             </button>
          </div>
       </div>

       {/* INCOMING ORDER MODAL (UBER STYLE PING) */}
       <AnimatePresence>
         {localIncoming && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col justify-end pb-12 px-6"
           >
              <motion.div 
                initial={{ y: 100, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="bg-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden"
              >
                 {/* Visual urgency background effect */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-black text-white rounded-3xl flex items-center justify-center shadow-2xl">
                          <Zap size={32} className="text-[var(--color-brand-orange)]" fill="currentColor" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Nuevo Pedido Express</p>
                          <h3 className="font-black text-2xl font-poppins tracking-tighter">Asombro Pizza</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                + $35.00 MXN
                             </div>
                             <p className="text-xs text-gray-500 font-bold tracking-tight">2.4 km de ti</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="w-14 h-14 relative flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-100" />
                          <circle 
                             cx="28" cy="28" r="24" 
                             stroke="currentColor" 
                             strokeWidth="5" 
                             fill="transparent" 
                             strokeDasharray="150" 
                             strokeDashoffset={150 - (150 * (timeLeft / 10))}
                             className="text-black transition-all duration-1000 ease-linear" 
                             strokeLinecap="round"
                          />
                       </svg>
                       <span className="absolute font-black text-xl text-black font-poppins italic">{timeLeft}</span>
                    </div>
                 </div>

                 <div className="space-y-4 mb-10 relative z-10">
                    <div className="bg-gray-50 rounded-[2rem] p-5 border border-gray-100">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <MapPin size={12} /> Destino de entrega
                       </p>
                       <p className="font-bold text-[15px] leading-snug">
                         {localIncoming.address}
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-4 relative z-10">
                    <button 
                      onClick={handleReject}
                      className="w-20 h-20 rounded-[2rem] bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                    >
                       <span className="font-black text-lg">X</span>
                    </button>
                    <button 
                      onClick={handleAccept}
                      className="flex-1 bg-black text-white rounded-[2rem] font-black text-xl italic hover:bg-neutral-900 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95"
                    >
                       ACEPTAR
                    </button>
                 </div>
              </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
