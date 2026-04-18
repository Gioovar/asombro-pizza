"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Ticket, Users, CheckCircle, CreditCard, ShieldCheck, Zap, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../../store/useAuth";
import { AuthModal } from "../auth/AuthModal";

export function EventModal({ event, onClose }: { event: any, onClose: () => void }) {
  const [mode, setMode] = useState<"SELECT" | "BUY_TICKET" | "RESERVE_TABLE" | "SUCCESS">("SELECT");
  const [partySize, setPartySize] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, token, isAuthenticated } = useAuth();

  const handleAction = async (actionStr: "TICKET" | "TABLE") => {
     setIsProcessing(true);
     
     if (!isAuthenticated()) {
        setIsAuthOpen(true);
        setIsProcessing(false);
        return;
     }
     
     try {
       const res = await fetch("/api/client/events/book", {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
             eventId: event.id,
             type: actionStr === "TABLE" ? "TABLE_RESERVATION" : "GENERAL",
             partySize: actionStr === "TABLE" ? partySize : 1
          })
       });
       if (!res.ok) throw new Error("Booking failed");
     } catch (error) {
       console.error("Booking failed:", error);
     }
     
     setIsProcessing(false);
     setMode("SUCCESS");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        {/* Backdrop trigger */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="bg-white w-full max-w-5xl rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh] border border-white/20"
        >
          {/* Decorative Internal Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-brand-orange)]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 z-20 bg-black/40 text-white p-3 rounded-2xl hover:bg-black transition-all backdrop-blur-md active:scale-95"
          >
             <X size={20} />
          </button>

          {/* LEFT: Cinematic Banner */}
          <div className="w-full md:w-[45%] h-64 md:h-auto relative">
             <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
             <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12">
                <span className="bg-black/60 backdrop-blur-md text-[var(--color-brand-orange)] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full w-fit mb-5 border border-[var(--color-brand-orange)]/20 shadow-lg">
                   {event.category}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white font-poppins italic tracking-tighter uppercase leading-tight mb-2">
                   {event.title}
                </h2>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Asombro Private Experience</p>
             </div>
          </div>

          {/* RIGHT: High-End Interaction Area */}
          <div className="w-full md:w-[55%] p-12 flex flex-col overflow-y-auto bg-white relative">
             
             {mode === "SUCCESS" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                   <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-green-500/20">
                      <CheckCircle size={48} className="text-white" />
                   </div>
                   <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-4 leading-none">Access <span className="text-[var(--color-brand-orange)]">Granted</span></h3>
                   <p className="text-gray-500 text-sm font-medium mb-10 max-w-xs mx-auto leading-relaxed">
                     Hemos generado tu credencial digital. Su QR único es su pase de entrada a la zona VIP.
                   </p>
                   
                   <div className="bg-black p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden group mb-10 border border-white/10">
                       <div className="absolute top-0 right-0 p-4 opacity-20">
                          <Sparkles size={40} className="text-[var(--color-brand-orange)]" />
                       </div>
                       <div className="bg-white p-6 rounded-[2.5rem] flex items-center justify-center shadow-inner overflow-hidden border border-white/5">
                           <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ASOMBRO_VIP_${event.id}_${Date.now()}`} 
                              alt="Ticket VIP Digital" 
                              className="w-44 h-44 object-cover mix-blend-multiply" 
                           />
                       </div>
                       <div className="mt-6 flex flex-col items-center gap-1">
                          <p className="text-[var(--color-brand-orange)] text-[9px] font-black uppercase tracking-[0.4em]">SQUAD ACCESS PASS</p>
                          <p className="text-white/40 text-[8px] font-medium tracking-widest">{event.id.toUpperCase()}</p>
                       </div>
                   </div>
                   
                   <button onClick={onClose} className="w-full py-6 bg-black text-white rounded-[2rem] font-black italic uppercase tracking-widest text-xs hover:bg-[var(--color-brand-orange)] transition-all shadow-xl active:scale-95">
                      Finalizar Reserva
                   </button>
                </motion.div>
             )}

             {mode === "SELECT" && (
                <div className="flex flex-col h-full">
                   <div className="mb-10">
                      <div className="flex items-center gap-2 mb-4">
                         <Zap size={16} className="text-[var(--color-brand-orange)]" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Curaduría de Evento</span>
                      </div>
                      <p className="text-gray-500 text-base leading-relaxed mb-10 italic font-medium">"{event.description}"</p>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100/50 group hover:border-[var(--color-brand-orange)]/30 transition-colors">
                            <CalendarDays size={24} className="text-[var(--color-brand-orange)] mb-3" />
                            <p className="font-black italic uppercase text-xs tracking-tighter text-black">Programación</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{new Date(event.date).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                         </div>
                         <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100/50 group hover:border-[var(--color-brand-orange)]/30 transition-colors">
                            <Users size={24} className="text-[var(--color-brand-orange)] mb-3" />
                            <p className="font-black italic uppercase text-xs tracking-tighter text-black">Aforo Seguro</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{event.capacity} Usuarios</p>
                         </div>
                      </div>
                   </div>

                   <div className="mt-auto space-y-4">
                      <button 
                        onClick={() => setMode("RESERVE_TABLE")}
                        className="w-full py-6 border-2 border-gray-100 text-gray-500 hover:text-black hover:border-black rounded-[2rem] font-black italic uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all"
                      >
                         <Users size={18} /> Asegurar Mesa del Squad
                      </button>
                      <button 
                        onClick={() => setMode("BUY_TICKET")}
                        className="w-full py-6 bg-black text-white hover:bg-[var(--color-brand-orange)] rounded-[2rem] font-black italic uppercase tracking-widest text-xs flex items-center justify-between px-10 transition-all shadow-xl shadow-black/10 hover:shadow-[var(--color-brand-orange)]/20 group"
                      >
                         <span className="flex items-center gap-3"><Ticket size={18} className="group-hover:rotate-12 transition-transform" /> {event.price === 0 ? "Get Early Entry" : "Comprar Ticket VIP"}</span>
                         <span className="text-sm tracking-tighter">{event.price === 0 ? "FREE" : `$${event.price}`}</span>
                      </button>
                   </div>
                </div>
             )}

             {mode === "RESERVE_TABLE" && (
                <div className="flex-1 flex flex-col">
                   <div className="mb-10">
                      <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-2 leading-none">Table <span className="text-[var(--color-brand-orange)]">Registry</span></h3>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Configura el espacio de tu grupo</p>
                   </div>
                   
                   <div className="space-y-8 mb-12 flex-1">
                      <div>
                         <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 block">1. Lugares Requeridos</label>
                         <div className="grid grid-cols-4 gap-3">
                            {[2, 4, 6, 8].map(n => (
                               <button 
                                 key={n}
                                 onClick={() => setPartySize(n)}
                                 className={`py-4 rounded-2xl border-2 font-black italic text-sm transition-all ${partySize === n ? "bg-black text-white border-black shadow-lg" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"}`}
                               >
                                  {n}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div>
                         <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 block">2. Titular de la Reserva</label>
                         <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
                            <ShieldCheck className="text-[var(--color-brand-orange)]" />
                            <span className="font-black italic text-gray-800 tracking-tight">{user?.name || "Asombro Global Guest"}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button onClick={() => setMode("SELECT")} className="flex-1 border-2 border-gray-100 text-gray-400 py-6 rounded-[2rem] font-black italic uppercase text-[10px] tracking-widest">Atrás</button>
                      <button 
                         onClick={() => handleAction("TABLE")} 
                         disabled={isProcessing}
                         className="flex-[2] bg-black text-white hover:bg-[var(--color-brand-orange)] py-6 rounded-[2rem] font-black italic uppercase text-xs tracking-widest shadow-xl transition-all"
                      >
                         {isProcessing ? "Validando..." : "Confirmar Mesa"}
                      </button>
                   </div>
                </div>
             )}

             {mode === "BUY_TICKET" && (
                <div className="flex-1 flex flex-col">
                   <div className="mb-10">
                      <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-2 leading-none">Access <span className="text-[var(--color-brand-orange)]">Checkout</span></h3>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Cifrado de grado militar Asombro</p>
                   </div>

                   <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 mb-8 flex justify-between items-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Zap size={40} className="text-white" />
                      </div>
                      <div className="relative z-10">
                         <p className="font-black italic text-white uppercase tracking-tight text-lg">General Pass VIP</p>
                         <p className="text-[9px] text-[var(--color-brand-orange)] font-black uppercase tracking-[0.3em]">Identity Validated</p>
                      </div>
                      <p className="font-black text-3xl text-white italic tracking-tighter">${event.price}</p>
                   </div>

                   <div className="space-y-4 mb-auto">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Método de Validación Digital</label>
                      {event.price > 0 ? (
                         <div className="border-2 border-gray-100 rounded-[2rem] p-6 flex items-center gap-4 hover:border-black transition-colors">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-black">
                               <CreditCard size={24} />
                            </div>
                            <div>
                               <p className="font-black italic text-sm tracking-tight text-gray-800">Mastercard Elite ...4444</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Exp: 12/26</p>
                            </div>
                         </div>
                      ) : (
                         <div className="border-2 border-green-100 bg-green-50/50 rounded-[2rem] p-6 flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                               <CheckCircle size={24} />
                            </div>
                            <div>
                               <p className="font-black italic text-sm tracking-tight text-green-800">Cortesía de la Casa</p>
                               <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Entry Complimentary</p>
                            </div>
                         </div>
                      )}
                   </div>

                   <div className="flex gap-4 mt-10">
                      <button onClick={() => setMode("SELECT")} className="flex-1 border-2 border-gray-100 text-gray-400 py-6 rounded-[2rem] font-black italic uppercase text-[10px] tracking-widest">Atrás</button>
                      <button 
                         onClick={() => handleAction("TICKET")} 
                         disabled={isProcessing}
                         className="flex-[2] bg-black text-white hover:bg-[var(--color-brand-orange)] py-6 rounded-[2rem] font-black italic uppercase text-xs tracking-widest shadow-xl transition-all"
                      >
                         {isProcessing ? "Validando Token..." : `Autorizar $${event.price}`}
                      </button>
                   </div>
                </div>
             )}

          </div>
        </motion.div>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </AnimatePresence>
  );
}
