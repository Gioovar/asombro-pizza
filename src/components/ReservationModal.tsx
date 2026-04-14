"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, Users, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Opening hours configuration (mock or fetched)
  const timeSlots = [
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"
  ];

  const isSunday = (dateStr: string) => {
    if (!dateStr) return false;
    const dateObj = new Date(dateStr);
    return dateObj.getUTCDay() === 0; // 0 is Sunday
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError("");
    
    try {
      const response = await fetch("/api/client/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          partySize,
          email: "webguest@asombropizza.com" // Use a logged in user in a real scenario
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Algo salió mal");
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setStep(1);
        setDate("");
        setTime("");
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="p-8 pb-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                <CalendarIcon className="text-white" size={24} />
             </div>
             <h2 className="text-3xl font-black text-white italic tracking-tight">Reserva tu Experiencia</h2>
             <p className="text-white/50 text-sm mt-1">Elige el momento perfecto para disfrutar de lo asombro.</p>
          </div>

          <div className="p-8 pt-0">
             {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                   <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                      <CheckCircle2 size={40} className="text-white" />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">¡Todo listo!</h3>
                   <p className="text-white/60">Tu mesa ha sido asegurada. Te hemos enviado un correo con los detalles.</p>
                </motion.div>
             ) : (
                <>
                   {/* Steps Indicators */}
                   <div className="flex gap-2 mb-8">
                      {[1, 2, 3].map((s) => (
                         <div 
                           key={s} 
                           className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-white" : "bg-white/10"}`}
                         ></div>
                      ))}
                   </div>

                   {/* Step 1: Date */}
                   {step === 1 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                         <label className="text-xs font-black text-white/40 uppercase tracking-widest mb-4 block">1. Selecciona el Día</label>
                         <input 
                           type="date" 
                           min={new Date().toISOString().split('T')[0]}
                           value={date}
                           onChange={(e) => setDate(e.target.value)}
                           className={`w-full bg-white/5 border rounded-2xl p-6 text-white text-lg outline-none transition-all appearance-none cursor-pointer ${isSunday(date) ? 'border-red-500/50' : 'border-white/10 focus:border-white/30'}`}
                           style={{ colorScheme: 'dark' }}
                         />
                         {isSunday(date) && (
                            <p className="text-red-400 text-xs mt-3 flex items-center gap-1 font-bold">
                               <AlertCircle size={14}/> Los domingos estamos cerrados.
                            </p>
                         )}
                         <button 
                            disabled={!date || isSunday(date)}
                            onClick={() => setStep(2)}
                            className="w-full mt-6 bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-neutral-200 disabled:opacity-30 transition-all font-poppins"
                         >
                            Siguiente <ChevronRight size={20} />
                         </button>
                      </motion.div>
                   )}

                   {/* Step 2: Time */}
                   {step === 2 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                         <label className="text-xs font-black text-white/40 uppercase tracking-widest mb-4 block">2. Horario Disponible</label>
                         <div className="grid grid-cols-4 gap-3">
                            {timeSlots.map((t) => (
                               <button 
                                 key={t}
                                 onClick={() => setTime(t)}
                                 className={`py-3 rounded-xl border text-sm font-bold transition-all ${time === t ? "bg-white text-black border-white" : "bg-transparent text-white/60 border-white/10 hover:border-white/30"}`}
                               >
                                  {t}
                               </button>
                            ))}
                         </div>
                         <div className="flex gap-4 mt-8">
                            <button onClick={() => setStep(1)} className="flex-1 border border-white/10 text-white py-5 rounded-2xl font-bold">Volver</button>
                            <button 
                               disabled={!time}
                               onClick={() => setStep(3)}
                               className="flex-[2] bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-2"
                            >
                               Siguiente <ChevronRight size={20} />
                            </button>
                         </div>
                      </motion.div>
                   )}

                   {/* Step 3: Details & Confirm */}
                   {step === 3 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                         <label className="text-xs font-black text-white/40 uppercase tracking-widest mb-4 block">3. Detalles Finales</label>
                         <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-6">
                            <div className="flex items-center gap-4 mb-4">
                               <Users className="text-white/40" />
                               <div className="flex-1">
                                  <p className="text-xs text-white/40 font-bold uppercase">Personas</p>
                                  <div className="flex items-center gap-4 mt-1">
                                     <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white">-</button>
                                     <span className="text-xl font-black text-white">{partySize}</span>
                                     <button onClick={() => setPartySize(Math.min(12, partySize + 1))} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white">+</button>
                                  </div>
                               </div>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex justify-between">
                               <div>
                                  <p className="text-xs text-white/40 font-bold uppercase">Fecha</p>
                                  <p className="font-bold text-white">{date}</p>
                               </div>
                               <div>
                                  <p className="text-xs text-white/40 font-bold uppercase text-right">Hora</p>
                                  <p className="font-bold text-white text-right">{time}</p>
                               </div>
                            </div>
                         </div>

                         {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 mb-6">
                               <AlertCircle size={20} />
                               <p className="text-sm font-bold">{error}</p>
                            </div>
                         )}

                         <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 border border-white/10 text-white py-5 rounded-2xl font-bold">Volver</button>
                            <button 
                               onClick={handleConfirm}
                               disabled={isProcessing}
                               className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-[0_10px_30px_rgba(79,70,229,0.4)] disabled:opacity-50"
                            >
                               {isProcessing ? "Procesando..." : "Confirmar Reserva"}
                            </button>
                         </div>
                      </motion.div>
                   )}
                </>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
