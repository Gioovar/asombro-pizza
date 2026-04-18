"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle, MapPin, CreditCard, UserCircle, DollarSign, ChevronLeft, Zap, Sparkles } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useUserStore } from "../store/useUserStore";
import { useAuth } from "../store/useAuth";
import { useAuthGuardStore } from "../store/useAuthGuardStore";
import { OrderTrackingModal } from "./OrderTrackingModal";
import Image from "next/image";
import { AddressAutocomplete } from "./common/AddressAutocomplete";


export function CheckoutModal() {
  const { isCartOpen, toggleCart, items, updateQuantity, removeItem, getTotalPrice, appliedPromo } = useCartStore();
  const { user } = useUserStore();
  const { isAuthenticated, user: authUser, token: authToken } = useAuth();
  const { openModal } = useAuthGuardStore();
  const clearCart = () => items.forEach(i => removeItem(i.cartItemId));

  // Flow State
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Forms State
  const [selectedTip, setSelectedTip] = useState<number>(0); // percentage
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Sub-forms
  const [tempAddress, setTempAddress] = useState("");
  const [tempPayment, setTempPayment] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setMapCoords({ lat, lng });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "es" } }
          );
          const data = await res.json();
          setTempAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
          setTempAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        setGpsError("Permission denied or location unavailable.");
      },
      { timeout: 10000 }
    );
  };

  const handleNextStep = () => {
    if (step === 1 && items.length > 0) {
      if (!isAuthenticated()) {
        openModal(() => setStep(2), "Inicia sesión para continuar con tu pedido.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleCheckoutFinished = async () => {
    setIsCheckingOut(true);
    try {
      const tipAmount = Math.round(getTotalPrice() * (selectedTip / 100));

      const res = await fetch("/api/client/checkout", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
         },
         body: JSON.stringify({
            items,
            total: getTotalPrice(),
            userId: authUser?.id,
            address: tempAddress || "Dirección Web",
            tip: tipAmount,
            paymentType: tempPayment
         })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Operación fallida.");
      }

      clearCart();
      setOrderSuccess(true);
      if (data.orderId) setTrackingOrderId(data.orderId);
    } catch(e: any) {
      console.error(e);
      alert(e.message || "Error al procesar el pedido.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-[var(--color-brand-marble)] z-[70] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 bg-white border-b border-gray-100 relative z-10 shadow-sm">
              <div className="flex items-center gap-4">
                 {step > 1 && !orderSuccess && (
                    <button onClick={() => setStep(step - 1 as any)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                       <ChevronLeft size={24} />
                    </button>
                 )}
                 <div>
                    <h2 className="text-2xl font-black font-poppins italic tracking-tighter flex items-center gap-3 uppercase">
                      {step === 1 && "Canasta"}
                      {step === 2 && "Zona de Drop"}
                      {step === 3 && "Pago Táctico"}
                    </h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Fase {step} de 3 • Despliegue Táctico</p>
                 </div>
              </div>
              <button onClick={toggleCart} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all active:scale-95">
                <X size={24} />
              </button>
            </div>

            {/* Premium Stepper Progress */}
            {!orderSuccess && (
               <div className="w-full h-1 bg-gray-100 flex">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(step/3)*100}%` }}
                    className="h-full bg-[var(--color-brand-orange)] shadow-[0_0_10px_rgba(255,90,0,0.5)]" 
                  />
               </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {orderSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-green-500/20"
                  >
                    <CheckCircle size={48} />
                  </motion.div>
                  <h3 className="text-3xl font-black font-poppins italic tracking-tighter uppercase mb-2">¡Orden Confirmada!</h3>
                  <p className="text-gray-500 text-sm mb-10 font-medium px-4">
                    Estamos preparando tu masa madre de 72h. Tu experiencia gourmet está en camino.
                  </p>
                  <div className="w-full space-y-3">
                    {trackingOrderId && (
                      <button
                        onClick={() => { toggleCart(); }}
                        className="w-full py-5 bg-black text-white rounded-2xl font-black italic text-base shadow-xl hover:bg-[var(--color-brand-orange)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
                      >
                        Seguir en Tiempo Real <ArrowRight size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => { setOrderSuccess(false); setStep(1); setTrackingOrderId(null); toggleCart(); }}
                      className="w-full py-4 border-2 border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all"
                    >
                      Volver a la Galería
                    </button>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={48} className="opacity-20" />
                  </div>
                  <p className="font-black italic uppercase tracking-widest text-xs">Tu Canastilla está vacía</p>
                </div>
              ) : (
                <div className="p-8 space-y-8">
                   {/* STEP 1: CART */}
                   {step === 1 && (
                     <div className="space-y-4">
                       {items.map((item) => (
                         <motion.div 
                           key={item.cartItemId} 
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           className="flex gap-5 items-center bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                         >
                           <div className="relative w-24 h-24 bg-[var(--color-brand-marble)] rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                              <Image src={item.image} alt={item.name} fill className="object-contain mix-blend-multiply p-2"/>
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="font-black text-lg italic tracking-tight text-gray-900 truncate">{item.name}</h4>
                             
                             {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                               <div className="flex flex-wrap gap-1 mt-1.5 opacity-60">
                                 {Object.entries(item.selectedOptions).map(([key, value]) => (
                                   <span key={key} className="text-[9px] font-black uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-lg">
                                     {key}: {Array.isArray(value) ? value.join(", ") : value}
                                   </span>
                                 ))}
                               </div>
                             )}

                             <div className="flex items-center justify-between mt-4">
                               <p className="text-base font-black italic text-[var(--color-brand-orange)]">${item.price * item.quantity}</p>
                               <div className="flex items-center gap-3 bg-black/5 rounded-full p-1 border border-black/5">
                                 <button onClick={() => item.quantity === 1 ? removeItem(item.cartItemId) : updateQuantity(item.cartItemId, item.quantity - 1)} className="w-7 h-7 bg-white rounded-full shadow-sm flex items-center justify-center transition-all hover:bg-red-50 hover:text-red-500"><Minus size={14}/></button>
                                 <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                 <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-7 h-7 bg-white rounded-full shadow-sm flex items-center justify-center transition-all hover:bg-green-50 hover:text-green-500"><Plus size={14}/></button>
                               </div>
                             </div>
                           </div>
                         </motion.div>
                       ))}
                     </div>
                   )}

                   {/* STEP 2: USER IDENTITY & ADDRESS */}
                   {step === 2 && (
                     <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
                        {/* Identidad */}
                        <div>
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2"><UserCircle size={16}/> Tu cuenta registrada</label>
                           {authUser ? (
                              <div className="bg-black text-white p-6 rounded-[2rem] flex items-center gap-4 shadow-xl relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-orange)] blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                                 <div className="w-14 h-14 bg-[var(--color-brand-orange)] text-white rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg italic">
                                   {authUser.name.charAt(0).toUpperCase()}
                                 </div>
                                 <div className="min-w-0 relative z-10">
                                   <p className="font-black italic text-lg tracking-tight truncate">{authUser.name}</p>
                                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{authUser.email}</p>
                                 </div>
                              </div>
                           ) : null}
                        </div>

                        {/* Coordenadas */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2"><MapPin size={16}/> Resolución de Zona (Drop Zone)</label>
                           <div className="relative group">
                              <AddressAutocomplete
                                value={tempAddress}
                                onChange={setTempAddress}
                                onSelect={(s) => {
                                  setTempAddress(s.fullPath);
                                  setMapCoords({ lat: s.lat, lng: s.lng });
                                }}
                                placeholder="Escribe tu dirección..."
                                className="w-full bg-white border-2 border-gray-100 rounded-3xl px-6 py-5 outline-none focus:border-[var(--color-brand-orange)] transition-all font-bold text-sm"
                              />
                              <div className="absolute right-3 top-[10px] z-10">
                                <button 
                                  onClick={handleUseGPS} 
                                  disabled={gpsLoading} 
                                  className="bg-black text-[10px] text-white px-4 py-2.5 rounded-2xl hover:bg-[var(--color-brand-orange)] transition-all font-black uppercase tracking-widest disabled:opacity-50 active:scale-95 italic"
                                >
                                  {gpsLoading ? "..." : "GPS"}
                                </button>
                              </div>
                           </div>
                           
                           <div className="w-full h-48 bg-white rounded-[2rem] overflow-hidden relative border-4 border-white shadow-lg grayscale focus-within:grayscale-0 transition-all duration-700">
                              <iframe
                                key={mapCoords ? `${mapCoords.lat},${mapCoords.lng}` : "default"}
                                width="100%"
                                height="100%"
                                src={mapCoords
                                  ? `https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=16&output=embed`
                                  : "https://maps.google.com/maps?q=Brooklyn+Bridge&z=14&output=embed"
                                }
                                style={{ border: 0 }}
                                className="opacity-80"
                              />
                              <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 rounded-[2rem]"></div>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* STEP 3: FINTECH, TIPS & PAYMENT */}
                   {step === 3 && (
                     <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
                        {/* Tips */}
                        <div className="bg-black/95 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative border border-white/5">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[80px] rounded-full opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                           <h3 className="font-black text-xl italic tracking-tighter mb-1 relative z-10 flex items-center gap-2">Gratifica al Repartidor <Zap size={20} className="text-[var(--color-brand-orange)] fill-[var(--color-brand-orange)]"/></h3>
                           <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-6 relative z-10">El 100% de la propina es para el SQUAD.</p>
                           
                           <div className="grid grid-cols-4 gap-3 relative z-10">
                              {[0, 5, 10, 15].map((tip) => (
                                <button 
                                   key={tip}
                                   onClick={() => setSelectedTip(tip)}
                                   className={`py-4 rounded-2xl font-black italic tracking-tighter transition-all text-sm border ${selectedTip === tip ? 'bg-[var(--color-brand-orange)] text-white border-[var(--color-brand-orange)] shadow-lg scale-105' : 'bg-neutral-800/50 border-white/5 text-gray-400 hover:text-white hover:border-white/20'}`}
                                >
                                   {tip === 0 ? "0%" : `${tip}%`}
                                </button>
                              ))}
                           </div>
                        </div>

                        {/* Pago */}
                        <div>
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block flex items-center gap-2 text-center justify-center italic">Método de Pago Segurizado</label>
                           
                           <div className="space-y-4">
                              <label className={`flex items-center gap-5 p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${tempPayment === 'CASH' ? 'border-black bg-white shadow-lg' : 'border-gray-100 bg-white/50 grayscale hover:grayscale-0'}`}>
                                 <input type="radio" name="paymentType" value="CASH" checked={tempPayment === 'CASH'} onChange={() => setTempPayment('CASH')} className="w-6 h-6 accent-black" />
                                 <div>
                                    <span className="font-black italic text-lg tracking-tight block leading-none">Efectivo al recibir</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pago Físico</span>
                                 </div>
                              </label>

                              <label className={`flex items-center gap-5 p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${tempPayment === 'CARD' ? 'border-[var(--color-brand-orange)] bg-white shadow-lg' : 'border-gray-100 bg-white/50 grayscale hover:grayscale-0'}`}>
                                 <input type="radio" name="paymentType" value="CARD" checked={tempPayment === 'CARD'} onChange={() => setTempPayment('CARD')} className="w-6 h-6 accent-[var(--color-brand-orange)]" />
                                 <div className="flex-1 flex justify-between items-center">
                                    <div>
                                       <span className="font-black italic text-lg tracking-tight block leading-none">Terminada en 4444</span>
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mastercard Digital</span>
                                    </div>
                                    <div className="w-10 h-6 bg-black rounded-lg flex items-center justify-center text-[9px] text-white font-black italic border border-white/10">MC</div>
                                 </div>
                              </label>

                              <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-black italic text-xs uppercase tracking-widest hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-all">+ Añadir nueva tarjeta</button>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            {!orderSuccess && items.length > 0 && (
              <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-20px_60px_rgba(0,0,0,0.06)] relative z-20">
                <div className="flex flex-col mb-6">
                  {appliedPromo && (
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 italic px-3 py-1 bg-green-50 rounded-full border border-green-100">CÓDIGO: {appliedPromo.code} APLICADO ✅</span>
                     </div>
                  )}
                  {selectedTip > 0 && step === 3 && (
                     <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Propina SQUAD</span>
                        <span className="font-black italic text-sm text-gray-600">+${Math.round(getTotalPrice() * (selectedTip / 100))}</span>
                     </div>
                  )}
                  <div className="flex justify-between items-end w-full pt-4 border-t border-gray-50">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Carga Táctica Total</span>
                        <span className="font-black text-5xl font-poppins text-black italic tracking-tighter">
                          ${getTotalPrice() + (step === 3 ? Math.round(getTotalPrice() * (selectedTip / 100)) : 0)}
                       </span>
                    </div>
                    <span className="font-black italic text-gray-300 text-lg mb-1">MXN</span>
                  </div>
                </div>
                
                <button 
                  onClick={step === 3 ? handleCheckoutFinished : handleNextStep}
                  disabled={isCheckingOut || (step === 2 && !tempAddress && !authUser?.addresses?.length) || (step === 3 && !tempPayment)}
                  className="group relative w-full py-6 bg-black hover:bg-[var(--color-brand-orange)] text-white rounded-[2rem] font-black italic text-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-30 disabled:hover:bg-black shadow-xl overflow-hidden uppercase tracking-widest"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center gap-3">
                       <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span> Validando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 relative z-10">
                       {step === 3 ? 'Autorizar Misión Gastronómica' : 'Iniciar Fase Operativa'} 
                       <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {trackingOrderId && !isCartOpen && (
        <OrderTrackingModal
          orderId={trackingOrderId}
          onClose={() => {
            setTrackingOrderId(null);
            setOrderSuccess(false);
            setStep(1);
          }}
        />
      )}
    </AnimatePresence>
    </>
  );
}
