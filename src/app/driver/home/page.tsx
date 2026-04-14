"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDriverStore } from "@/store/useDriverStore";
import { Power, Navigation, BellRing, MapPin } from "lucide-react";
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
                setLocalIncoming(null); // Timeout! Missed order.
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
    <div className="h-full relative overflow-hidden bg-gray-50 flex flex-col">
       {/* Fake Map Background */}
       <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('https://maps.wikimedia.org/osm-intl/14/3482/6659.png')] bg-cover bg-center filter grayscale contrast-125 mix-blend-multiply transition-all duration-1000" style={{ opacity: isOnline ? 0.8 : 0.2 }}></div>

       {/* Map Overlay darkner when online */}
       {isOnline && <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>}

       <div className="relative z-10 px-6 pt-12 pb-6 flex justify-between items-center shadow-sm bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 shadow-inner">
             {driverId ? "DR" : "X"}
          </div>
          <div className="bg-white px-4 py-2 rounded-full font-bold shadow-md text-sm whitespace-nowrap flex items-center gap-2">
             Hoy: <span className="text-green-600">$450.00</span>
          </div>
       </div>

       <div className="flex-1 flex flex-col justify-end p-8 relative z-10">
          {!isOnline && (
            <div className="text-center mb-8 bg-white/90 p-4 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200">
               <h2 className="font-bold text-gray-800">Estás Desconectado</h2>
               <p className="text-sm text-gray-500 mt-1">Toca GO para buscar viajes.</p>
            </div>
          )}

          {isOnline && !localIncoming && (
            <div className="text-center mb-8 bg-blue-600/90 text-white p-4 rounded-2xl shadow-lg backdrop-blur-md animate-pulse">
               <h2 className="font-bold">Buscando viajes...</h2>
               <p className="text-sm text-blue-200 mt-1">Estás en zona de alta demanda.</p>
            </div>
          )}

          <div className="flex justify-center mt-auto mb-10">
             <button 
               onClick={toggleOnline}
               className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative ${isOnline ? 'bg-red-500 shadow-red-500/40 hover:bg-red-600 hover:scale-95' : 'bg-blue-600 shadow-blue-500/40 hover:bg-blue-700 hover:scale-105'}`}
             >
                {/* Ripple Effect Ring */}
                {isOnline && (
                   <span className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-20"></span>
                )}
                
                <span className="font-black text-white text-2xl tracking-widest font-poppins">
                  {isOnline ? "STOP" : "GO"}
                </span>
             </button>
          </div>
       </div>

       {/* INCOMING ORDER MODAL (UBER STYLE PING) */}
       <AnimatePresence>
         {localIncoming && (
           <motion.div 
             initial={{ y: "100%" }}
             animate={{ y: 0 }}
             exit={{ y: "100%" }}
             transition={{ type: "spring", damping: 20, stiffness: 100 }}
             className="absolute inset-x-0 bottom-0 top-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end pb-32 pt-20 px-4"
           >
              <div className="bg-white rounded-[32px] p-6 shadow-2xl overflow-hidden relative">
                 {/* Sonar animation ring */}
                 <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <BellRing size={24} />
                       </div>
                       <div>
                          <h3 className="font-black text-xl leading-none">Asombro Pizza</h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><Navigation size={12} /> 2.4 km de ti</p>
                       </div>
                    </div>
                    
                    <div className="w-12 h-12 relative flex items-center justify-center">
                       {/* SVG Circular Countdown */}
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" />
                          <circle 
                             cx="24" cy="24" r="20" 
                             stroke="currentColor" 
                             strokeWidth="4" 
                             fill="transparent" 
                             strokeDasharray="125" 
                             strokeDashoffset={125 - (125 * (timeLeft / 10))}
                             className="text-blue-600 transition-all duration-1000 ease-linear" 
                          />
                       </svg>
                       <span className="absolute font-bold text-sm text-blue-600">{timeLeft}</span>
                    </div>
                 </div>

                 <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <p className="text-sm text-gray-500 font-medium mb-1">Destino sugerido</p>
                    <p className="font-bold flex items-start gap-2">
                      <MapPin size={18} className="text-red-500 mt-0.5 shrink-0" />
                      {localIncoming.address}
                    </p>
                 </div>

                 <div className="flex gap-4">
                    <button 
                      onClick={handleReject}
                      className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 shrink-0 font-bold"
                    >
                       X
                    </button>
                    <button 
                      onClick={handleAccept}
                      className="flex-1 bg-blue-600 text-white rounded-[24px] font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
                    >
                       Aceptar Viaje
                    </button>
                 </div>
              </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
