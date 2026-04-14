"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDriverStore } from "@/store/useDriverStore";
import { Navigation2, Phone, MessageCircle, MapPin, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { Suspense } from "react";

function ActiveOrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();
  const { driverId } = useDriverStore();
  
  const [orderState, setOrderState] = useState<"TO_RESTAURANT" | "TO_CUSTOMER">("TO_RESTAURANT");

  const handleAction = async () => {
     if (orderState === "TO_RESTAURANT") {
        setOrderState("TO_CUSTOMER");
        // Opt: We could send a patch API to update status to "PICKED_UP"
     } else {
        // Complete the delivery
        try {
           await fetch("/api/driver/ping", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "DELIVERED", orderId, driverId })
           });
           alert("¡Entrega exitosa! Ganaste $35.00 MXN.");
           router.push("/driver/home");
        } catch(e) { console.error(e) }
     }
  };

  return (
    <div className="h-full flex flex-col relative w-full bg-gray-100">
      {/* MAPA SIMULADO - Vista cenital con ruta SVG */}
      <div className="flex-1 relative bg-[url('https://maps.wikimedia.org/osm-intl/16/16388/31535.png')] bg-cover bg-center grayscale filter contrast-125 brightness-110">
         {/* Ruta simulada svg polyline */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polyline 
               points="20,80 40,60 40,40 70,30 80,10" 
               fill="none" 
               stroke="var(--color-blue-600, #2563eb)" 
               strokeWidth="2" 
               strokeDasharray="4"
               className="animate-[dash_1s_linear_infinite]"
            />
         </svg>

         {/* Marcador Origen */}
         <div className="absolute top-[80%] left-[20%] w-6 h-6 bg-black rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 shadow-lg">
           <MapPin size={12} className="text-white" />
         </div>

         {/* Animación del Biker (Moving) */}
         <motion.div 
            initial={{ top: "80%", left: "20%" }}
            animate={{ top: orderState === "TO_CUSTOMER" ? "10%" : "30%", left: orderState === "TO_CUSTOMER" ? "80%" : "70%" }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute w-8 h-8 bg-blue-600 rounded-full border-4 border-white -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(37,99,235,0.6)]"
         >
           <Navigation2 size={16} className="text-white fill-current transform rotate-45" />
         </motion.div>

         {/* Marcador Destino */}
         <div className="absolute top-[10%] left-[80%] w-6 h-6 bg-red-500 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 shadow-lg"></div>
         
         <div className="absolute top-safe mt-6 inset-x-4">
            <div className="bg-black text-white px-6 py-4 rounded-3xl shadow-xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Navigation2 size={24} className="text-blue-500" />
                  <div>
                    <p className="font-bold text-lg leading-none">{orderState === "TO_RESTAURANT" ? "2.4 km" : "1.8 km"}</p>
                    <p className="text-xs text-gray-400">hacia {orderState === "TO_RESTAURANT" ? "Asombro Pizza" : "el cliente"}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="font-bold text-lg leading-none">{orderState === "TO_RESTAURANT" ? "8 min" : "6 min"}</p>
               </div>
            </div>
         </div>
      </div>

      {/* BOTTOM SHEET ORDER VIEW */}
      <motion.div 
         initial={{ y: "100%" }}
         animate={{ y: 0 }}
         transition={{ type: "spring", stiffness: 200, damping: 25 }}
         className="bg-white rounded-t-[32px] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-30"
      >
         <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

         <div className="flex justify-between items-center mb-6">
            <div>
               <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                 {orderState === "TO_RESTAURANT" ? "Recoger en" : "Entregar a"}
               </p>
               <h3 className="font-black text-2xl font-poppins">
                 {orderState === "TO_RESTAURANT" ? "Asombro Pizzería" : "Cliente Web"}
               </h3>
               <p className="text-gray-500 text-sm mt-1 mb-2">Av Central 123, Puerta A</p>
            </div>
            {orderState === "TO_CUSTOMER" && (
              <div className="flex gap-2">
                 <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><MessageCircle size={20} /></button>
                 <button className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Phone size={20} /></button>
              </div>
            )}
         </div>

         <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-3">
            <h4 className="font-bold text-sm mb-2">Nota del pedido:</h4>
            <p className="text-gray-600 text-sm">"Tocar el timbre por favor, no funciona el citófono."</p>
         </div>
         
         {orderState === "TO_CUSTOMER" && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
               <div>
                  <h4 className="font-bold text-green-900 text-sm">Propina Asegurada</h4>
                  <p className="text-green-700 text-xs">El cliente incluyó propina en su pago con tarjeta.</p>
               </div>
               <span className="font-black text-xl text-green-600">+$25.00</span>
            </div>
         )}

         <button 
            onClick={handleAction}
            className={`w-full py-5 rounded-3xl font-black text-lg text-white shadow-xl transition-all hover:scale-[0.98] ${orderState === "TO_RESTAURANT" ? 'bg-black shadow-black/20' : 'bg-green-500 shadow-green-500/30'}`}
         >
            {orderState === "TO_RESTAURANT" ? "Llegué a la Tienda ->" : "Deslizar para Entregar"}
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
