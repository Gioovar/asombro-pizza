"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, Users, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "../store/useAuth";
import { useAuthGuardStore } from "../store/useAuthGuardStore";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const { token, isAuthenticated } = useAuth();
  const { openModal } = useAuthGuardStore();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Opening hours configuration
  const timeSlots = [
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", 
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", 
    "22:00", "22:30"
  ];

  const isSunday = (dateStr: string) => {
    if (!dateStr) return false;
    const dateObj = new Date(dateStr);
    return dateObj.getUTCDay() === 0;
  };

  const handleConfirm = async () => {
    if (!isAuthenticated()) {
      openModal(handleConfirm, "Inicia sesión para confirmar tu reservación.");
      return;
    }
    setIsProcessing(true);
    setError("");
    
    try {
      const response = await fetch("/api/client/reservations", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          date,
          time,
          partySize,
          email: "guest@asombropizza.com"
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
      }, 3500);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
          className="bg-black border border-white/10 w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl relative"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[80px] rounded-full opacity-20 -translate-y-1/2 translate-x-1/2" />
          
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-white/30 hover:text-white transition-all z-20 bg-white/5 hover:bg-white/10 p-2 rounded-2xl"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="p-10 pb-6 relative z-10">
             <div className="w-14 h-14 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] rounded-2xl flex items-center justify-center mb-6 border border-[var(--color-brand-orange)]/20 shadow-lg">
                <CalendarIcon size={28} />
             </div>
             <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">Hospitality</h2>
             <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Reserva tu mesa • Asombro Experience</p>
          </div>

          <div className="p-10 pt-0 relative z-10">
             {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 flex flex-col items-center text-center"
                >
                   <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-green-500/20">
                      <CheckCircle2 size={48} className="text-white" />
                   </div>
                   <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">¡Todo asegurado!</h3>
                   <p className="text-gray-500 text-sm font-medium px-8 leading-relaxed">
                     Tu mesa ha sido reservada con éxito. Te esperamos para vivir la experiencia gastronómica definitiva.
                   </p>
                </motion.div>
             ) : (
                <>
                   {/* Steps Progress */}
                   <div className="flex gap-2 mb-10">
                      {[1, 2, 3].map((s) => (
                         <div 
                           key={s} 
                           className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= s ? "bg-[var(--color-brand-orange)] shadow-[0_0_8px_rgba(255,90,0,0.4)]" : "bg-white/5"}`}
                         ></div>
                      ))}
                   </div>

                   {/* Step 1: Date */}
                   {step === 1 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">1. Selecciona la Fecha</label>
                         <input 
                           type="date" 
                           min={new Date().toISOString().split('T')[0]}
                           value={date}
                           onChange={(e) => setDate(e.target.value)}
                           className={`w-full bg-white/5 border-2 rounded-3xl p-6 text-white text-xl font-black italic outline-none transition-all appearance-none cursor-pointer ${isSunday(date) ? 'border-red-500/30' : 'border-white/5 focus:border-[var(--color-brand-orange)]/50'}`}
                           style={{ colorScheme: 'dark' }}
                         />
                         {isSunday(date) && (
                            <p className="text-red-500 text-[10px] mt-4 flex items-center gap-2 font-black uppercase tracking-widest">
                               <AlertCircle size={14}/> Los domingos estamos cerrados por descanso del Squad.
                            </p>
                         )}
                         <button 
                            disabled={!date || isSunday(date)}
                            onClick={() => setStep(2)}
                            className="group w-full mt-10 bg-white text-black py-6 rounded-[2rem] font-black italic text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[var(--color-brand-orange)] hover:text-white transition-all active:scale-95 disabled:opacity-30"
                         >
                            Siguiente Paso <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                         </button>
                      </motion.div>
                   )}

                   {/* Step 2: Time */}
                   {step === 2 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">2. Horario Curado</label>
                         <div className="grid grid-cols-4 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                            {timeSlots.map((t) => (
                               <button 
                                 key={t}
                                 onClick={() => setTime(t)}
                                 className={`py-4 rounded-2xl border-2 font-black italic tracking-tighter transition-all text-sm ${time === t ? "bg-[var(--color-brand-orange)] text-white border-[var(--color-brand-orange)] shadow-lg" : "bg-transparent text-gray-400 border-white/5 hover:border-white/20"}`}
                               >
                                  {t}
                               </button>
                            ))}
                         </div>
                         <div className="flex gap-4 mt-10">
                            <button onClick={() => setStep(1)} className="flex-1 border-2 border-white/5 text-gray-500 hover:text-white py-6 rounded-3xl font-black italic text-[10px] uppercase tracking-widest">Volver</button>
                            <button 
                               disabled={!time}
                               onClick={() => setStep(3)}
                               className="flex-[2] bg-white text-black py-6 rounded-3xl font-black italic uppercase text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-brand-orange)] hover:text-white transition-all tracking-widest"
                            >
                               Continuar <ChevronRight size={18} />
                            </button>
                         </div>
                      </motion.div>
                   )}

                   {/* Step 3: Confirmation */}
                   {step === 3 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">3. Confirmar Reservación</label>
                         <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                               <Sparkles size={48} className="text-white" />
                            </div>
                            <div className="flex items-center gap-5 mb-8">
                               <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-white/10 text-white">
                                  <Users size={24} />
                               </div>
                               <div className="flex-1">
                                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Mesa para</p>
                                  <div className="flex items-center gap-6">
                                     <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-[var(--color-brand-orange)] transition-colors">-</button>
                                     <span className="text-2xl font-black text-white italic tracking-tighter">{partySize} <span className="text-[10px] not-italic text-gray-500 uppercase">Pax</span></span>
                                     <button onClick={() => setPartySize(Math.min(12, partySize + 1))} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-[var(--color-brand-orange)] transition-colors">+</button>
                                  </div>
                               </div>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex justify-between">
                               <div>
                                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Fecha Programada</p>
                                  <p className="font-black text-white italic tracking-tight">{new Date(date).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}</p>
                                </div>
                               <div className="text-right">
                                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 text-right">Horario VIP</p>
                                  <p className="font-black text-white italic tracking-tight text-right">{time} <span className="text-[10px] not-italic uppercase">HRS</span></p>
                               </div>
                            </div>
                         </div>

                         {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 mb-8 font-black italic text-[10px] uppercase">
                               <AlertCircle size={18} /> {error}
                            </div>
                         )}

                         <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 border-2 border-white/5 text-gray-500 py-6 rounded-3xl font-black italic uppercase text-[10px] tracking-widest">Volver</button>
                            <button 
                               onClick={handleConfirm}
                               disabled={isProcessing}
                               className="flex-[2] bg-[var(--color-brand-orange)] text-white py-6 rounded-3xl font-black italic uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(255,90,0,0.2)] disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                            >
                               {isProcessing ? "Procesando VIP..." : "Confirmar Mesa"}
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
