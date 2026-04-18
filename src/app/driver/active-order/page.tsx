"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDriverStore } from "@/store/useDriverStore";
import { Navigation2, Phone, MessageCircle, MapPin, ChevronLeft, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";

function ActiveOrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();
  const { driverId } = useDriverStore();
  
  const [orderState, setOrderState] = useState<"TO_RESTAURANT" | "TO_CUSTOMER">("TO_RESTAURANT");

  // Broadcast real GPS to API so customer can track live
  useEffect(() => {
    if (!orderId) return;
    const watchId = navigator.geolocation?.watchPosition(
      (pos) => {
        fetch("/api/driver/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, lat: pos.coords.latitude, lng: pos.coords.longitude }),
        }).catch(() => {});
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => { if (watchId !== undefined) navigator.geolocation?.clearWatch(watchId); };
  }, [orderId]);

  const handleAction = async () => {
     if (orderState === "TO_RESTAURANT") {
        setOrderState("TO_CUSTOMER");
     } else {
        // Complete the delivery
        try {
           await fetch("/api/driver/ping", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "DELIVERED", orderId, driverId })
           });
           router.push("/driver/home");
        } catch(e) { console.error(e) }
     }
  };

  return (
    <div className="h-full flex flex-col relative w-full bg-neutral-900">
      {/* HEADER NAV AREA (Floating) */}
      <div className="absolute top-0 inset-x-0 z-40 p-6 pt-14 flex items-center justify-between pointer-events-none">
         <button 
           onClick={() => router.push("/driver/home")} 
           className="w-12 h-12 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white pointer-events-auto shadow-2xl active:scale-90 transition-transform"
         >
            <ChevronLeft size={24} />
         </button>

         <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto">
            <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">En Misión Activa</p>
         </div>
      </div>

      {/* MAPA SIMULADO - Vista Premium */}
      <div className="flex-1 relative bg-neutral-800">
         <div 
           className="absolute inset-0 grayscale filter brightness-[0.7] contrast-125 opacity-60" 
           style={{ 
             backgroundImage: "url('https://maps.wikimedia.org/osm-intl/16/16388/31535.png')", 
             backgroundSize: "cover",
             backgroundPosition: "center"
           }}
         />

         {/* Animación del Biker (Moving) */}
         <motion.div 
            initial={{ top: "80%", left: "20%" }}
            animate={{ 
               top: orderState === "TO_CUSTOMER" ? "15%" : "35%", 
               left: orderState === "TO_CUSTOMER" ? "80%" : "70%",
               rotate: orderState === "TO_CUSTOMER" ? -30 : 15
            }}
            transition={{ duration: 15, ease: "linear" }}
            className="absolute w-12 h-12 bg-black rounded-full border-4 border-[var(--color-brand-orange)] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(255,90,0,0.5)]"
         >
           <Navigation2 size={24} className="text-white fill-current" />
         </motion.div>

         {/* Marcador Destino */}
         <div className="absolute top-[12%] left-[82%] w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 transition-all">
            <div className="w-8 h-8 bg-red-600 rounded-full border-4 border-white animate-pulse shadow-lg"></div>
            <div className="absolute -top-10 bg-black text-white px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-xl">
               {orderState === "TO_RESTAURANT" ? "Restaurante" : "Cliente"}
            </div>
         </div>
         
         {/* Navigation Instruction Overlay */}
         <div className="absolute top-32 inset-x-6 z-10">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-black/95 backdrop-blur-xl text-white p-5 rounded-[2.5rem] shadow-2xl border border-white/5 flex items-center justify-between"
            >
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[var(--color-brand-orange)] rounded-2xl flex items-center justify-center shadow-xl">
                     <Navigation2 size={28} className="text-white transform -rotate-45" />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl tracking-tighter leading-none italic font-poppins">
                       {orderState === "TO_RESTAURANT" ? "2.4 km" : "1.8 km"}
                    </h4>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">
                       Gira a la derecha en 200m
                    </p>
                  </div>
               </div>
               <div className="text-right pr-2">
                  <p className="font-black text-lg text-[var(--color-brand-orange)] italic leading-none">
                     {orderState === "TO_RESTAURANT" ? "8 min" : "6 min"}
                  </p>
               </div>
            </motion.div>
         </div>
      </div>

      {/* BOTTOM SHEET ORDER VIEW */}
      <motion.div 
         initial={{ y: "100%" }}
         animate={{ y: 0 }}
         transition={{ type: "spring", stiffness: 200, damping: 25 }}
         className="bg-white rounded-t-[3rem] p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.2)] relative z-30"
      >
         <div className="w-16 h-1.5 bg-gray-100 rounded-full mx-auto mb-8 shadow-inner"></div>

         <div className="flex justify-between items-start mb-8">
            <div>
               <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${orderState === 'TO_RESTAURANT' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {orderState === "TO_RESTAURANT" ? "Pickup" : "Entrega"}
                  </span>
               </div>
               <h3 className="font-black text-3xl font-poppins tracking-tighter italic italic">
                 {orderState === "TO_RESTAURANT" ? "Asombro Pizzería" : "Casa del Cliente"}
               </h3>
               <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <MapPin size={14} className="text-red-500" />
                  <p className="text-sm font-medium">Av Central 123, Puerta A</p>
               </div>
            </div>
            
            <div className="flex gap-3">
               <button className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-colors shadow-sm">
                  <MessageCircle size={22} />
               </button>
               <button className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-xl shadow-green-200">
                  <Phone size={22} />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tu Ganancia</p>
               <p className="text-2xl font-black text-gray-900">$35.00 <span className="text-gray-400 text-xs font-bold">MXN</span></p>
            </div>
            <div className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
               <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Propina</p>
               <p className="text-2xl font-black text-[var(--color-brand-orange)]">+$25.00 <span className="text-orange-300 text-xs font-bold">★</span></p>
            </div>
         </div>

         <button 
            onClick={handleAction}
            className={`w-full py-6 rounded-[2rem] font-black text-xl italic text-white shadow-2xl transition-all hover:scale-[0.98] active:scale-95 flex items-center justify-center gap-3 ${orderState === "TO_RESTAURANT" ? 'bg-black' : 'bg-green-600 shadow-green-200'}`}
         >
            {orderState === "TO_RESTAURANT" ? (
               <>LLEGUÉ A LA TIENDA <Navigation2 size={24} className="rotate-90" /></>
            ) : (
               <>MARCAR COMO ENTREGADO <CheckCircle2 size={24} /></>
            )}
         </button>
      </motion.div>
    </div>
  );
}

export default function ActiveOrder() {
  return (
    <Suspense fallback={<div className="p-8 text-center bg-black text-white h-full grid place-items-center"><span className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"></span></div>}>
       <ActiveOrderContent />
    </Suspense>
  );
}
