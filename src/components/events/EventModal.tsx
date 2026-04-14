"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Ticket, Users, CheckCircle, CreditCard } from "lucide-react";
import Image from "next/image";
import { useUserStore } from "../../store/useUserStore";

export function EventModal({ event, onClose }: { event: any, onClose: () => void }) {
  const [mode, setMode] = useState<"SELECT" | "BUY_TICKET" | "RESERVE_TABLE" | "SUCCESS">("SELECT");
  const [partySize, setPartySize] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUserStore();

  const handleAction = async (actionStr: "TICKET" | "TABLE") => {
     setIsProcessing(true);
     
     try {
       await fetch("/api/client/events/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             actionType: actionStr,
             eventId: event.id,
             userId: user?.id,
             partySize: partySize,
             price: event.price
          })
       });
     } catch (error) {
       console.error("Booking failed:", error);
     }
     
     setIsProcessing(false);
     setMode("SUCCESS");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] flex items-center justify-center p-4 md:p-0"
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh]"
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/80 backdrop-blur-sm">
             <X size={20} />
          </button>

          {/* LEFT: Banner */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
             <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-end p-8">
                <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">{event.category}</span>
                <h2 className="text-3xl font-black text-white font-poppins">{event.title}</h2>
             </div>
          </div>

          {/* RIGHT: Interaction Area */}
          <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
             
             {mode === "SUCCESS" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center anime-in zoom-in">
                   <CheckCircle size={80} className="text-purple-600 mb-6" />
                   <h3 className="text-2xl font-black mb-2">¡Todo Listo!</h3>
                   <p className="text-gray-500 mb-8">
                     Hemos enviado el QR de acceso a tu perfil. Muestra este código en la entrada.
                   </p>
                   <div className="w-48 h-48 bg-white border border-gray-200 rounded-xl mb-6 flex items-center justify-center shadow-inner overflow-hidden">
                       <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ASOMBRO_TICKET_${event.id}_${Date.now()}`} 
                          alt="Tu Boleto Digital" 
                          className="w-40 h-40 object-cover mix-blend-multiply" 
                       />
                   </div>
                   <button onClick={onClose} className="w-full py-4 bg-black text-white rounded-xl font-bold">Cerrar Ventana</button>
                </div>
             )}

             {mode === "SELECT" && (
                <>
                   <div className="mb-8">
                      <p className="text-gray-600 leading-relaxed mb-4">{event.description}</p>
                      <div className="flex gap-4">
                         <div className="bg-gray-50 p-4 rounded-xl flex-1 border border-gray-100">
                            <CalendarDays size={20} className="text-purple-600 mb-2" />
                            <p className="font-bold text-sm">Fecha</p>
                            <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                         </div>
                         <div className="bg-gray-50 p-4 rounded-xl flex-1 border border-gray-100">
                            <Users size={20} className="text-purple-600 mb-2" />
                            <p className="font-bold text-sm">Aforo</p>
                            <p className="text-xs text-gray-500">{event.capacity} pers. max</p>
                         </div>
                      </div>
                   </div>

                   <div className="mt-auto space-y-3">
                      <button 
                        onClick={() => setMode("RESERVE_TABLE")}
                        className="w-full py-4 border-2 border-gray-200 text-black hover:border-black rounded-xl font-black flex items-center justify-center gap-2 transition-all"
                      >
                         <Users size={18} /> Reservar Mesa (Gratis)
                      </button>
                      <button 
                        onClick={() => setMode("BUY_TICKET")}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white shadow-[0_10px_20px_rgba(147,51,234,0.3)] rounded-xl font-black flex items-center justify-between px-6 transition-all"
                      >
                         <span className="flex items-center gap-2"><Ticket size={18}/> Comprar Acceso</span>
                         <span>{event.price === 0 ? "GRATIS" : `$${event.price} MXN`}</span>
                      </button>
                   </div>
                </>
             )}

             {mode === "RESERVE_TABLE" && (
                <div className="flex-1 flex flex-col">
                   <h3 className="text-2xl font-black mb-1">Tu Mesa</h3>
                   <p className="text-gray-500 text-sm mb-6">Confirma los lugares para evitar revendedores.</p>
                   
                   <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Lugares Requeridos</label>
                   <select 
                      value={partySize} 
                      onChange={e => setPartySize(Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl p-4 font-bold outline-none focus:border-purple-600 mb-6"
                   >
                     {[2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Personas</option>)}
                   </select>

                   <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Datos del Lead</label>
                   <input disabled value={user?.name || "Invitado (Auto-Registro)"} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-bold mb-auto" />

                   <button 
                      onClick={() => handleAction("TABLE")} 
                      disabled={isProcessing}
                      className="w-full mt-6 py-4 bg-black text-white rounded-xl font-black"
                   >
                      {isProcessing ? "Asegurando Mesa..." : "Confirmar Reservación"}
                   </button>
                </div>
             )}

             {mode === "BUY_TICKET" && (
                <div className="flex-1 flex flex-col">
                   <h3 className="text-2xl font-black mb-1">Ticket Checkout</h3>
                   <p className="text-gray-500 text-sm mb-6">Transacción Fintech encriptada.</p>

                   <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-6 flex justify-between items-center">
                      <div>
                         <p className="font-bold text-purple-900">Acceso General x1</p>
                         <p className="text-xs text-purple-600">ID de seguridad generado internamente</p>
                      </div>
                      <p className="font-black text-xl text-purple-900">${event.price} MXN</p>
                   </div>

                   <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Método de Pago</label>
                   {event.price > 0 ? (
                      <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                         <CreditCard className="text-gray-400" />
                         <div>
                            <p className="font-bold text-sm">Mastercard ...4444</p>
                            <p className="text-xs text-gray-500">Expira 12/26</p>
                         </div>
                      </div>
                   ) : (
                      <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                         <p className="font-bold text-green-700 text-sm">Cover cubierto al 100% (Invitación)</p>
                      </div>
                   )}

                   <button 
                      onClick={() => handleAction("TICKET")} 
                      disabled={isProcessing}
                      className="w-full mt-auto py-4 bg-purple-600 text-white rounded-xl font-black shadow-lg shadow-purple-600/30"
                   >
                      {isProcessing ? "Procesando Token..." : `Pagar $${event.price}`}
                   </button>
                </div>
             )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
