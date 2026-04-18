"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle, MapPin, CreditCard, UserCircle, DollarSign, ChevronLeft } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useUserStore } from "../store/useUserStore";
import { useAuth } from "../store/useAuth";
import { useAuthGuardStore } from "../store/useAuthGuardStore";
import { OrderTrackingModal } from "./OrderTrackingModal";
import Image from "next/image";

export function CheckoutModal() {
  const { isCartOpen, toggleCart, items, updateQuantity, removeItem, getTotalPrice, appliedPromo } = useCartStore();
  const { user } = useUserStore();
  const { isAuthenticated, user: authUser, token: authToken } = useAuth();
  const { openModal } = useAuthGuardStore();
  const clearCart = () => items.forEach(i => removeItem(i.cartItemId));

  // Flow State
  // 1: Cart Items | 2: Identity & Dispatch | 3: Financial & Tip
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
      setGpsError("Tu navegador no soporta geolocalización.");
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
          const addr =
            data.display_name ||
            `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setTempAddress(addr);
        } catch {
          setTempAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED)
          setGpsError("Permiso de ubicación denegado. Escribe tu dirección.");
        else
          setGpsError("No se pudo obtener la ubicación. Escribe tu dirección.");
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

      clearCart();
      setOrderSuccess(true);
      if (data.orderId) setTrackingOrderId(data.orderId);
    } catch(e) {
      console.log(e);
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[460px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white relative z-10">
              <div className="flex items-center gap-3">
                 {step > 1 && !orderSuccess && (
                    <button onClick={() => setStep(step - 1 as any)} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-1">
                       <ChevronLeft size={20} />
                    </button>
                 )}
                 <h2 className="text-2xl font-bold font-poppins flex items-center gap-3">
                   {step === 1 && <><ShoppingBag /> Mi Pedido</>}
                   {step === 2 && <><MapPin /> Entrega</>}
                   {step === 3 && <><CreditCard /> Pago Final</>}
                 </h2>
              </div>
              <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Stepper Progress */}
            {!orderSuccess && (
               <div className="w-full h-1 bg-gray-100">
                  <div className={`h-full bg-indigo-600 transition-all duration-500`} style={{ width: `${(step/3)*100}%` }}></div>
               </div>
            )}

            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              {orderSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <CheckCircle size={72} className="text-green-500 mb-5" />
                  <h3 className="text-2xl font-black font-poppins mb-2">¡Pedido confirmado!</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Tu orden está siendo procesada. Puedes seguirla en tiempo real.
                  </p>
                  {trackingOrderId && (
                    <button
                      onClick={() => { toggleCart(); }}
                      className="w-full py-4 bg-[var(--color-brand-orange)] text-white rounded-2xl font-black text-base mb-3"
                    >
                      Ver seguimiento en vivo →
                    </button>
                  )}
                  <button
                    onClick={() => { setOrderSuccess(false); setStep(1); setTrackingOrderId(null); toggleCart(); }}
                    className="w-full py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm"
                  >
                    Volver al inicio
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <ShoppingBag size={64} className="opacity-20" />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="p-6">
                   {/* STEP 1: CART */}
                   {step === 1 && (
                     <div className="space-y-4">
                       {items.map((item) => (
                         <div key={item.cartItemId} className="flex gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                           <div className="relative w-20 h-20 bg-[var(--color-brand-marble)] rounded-2xl flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-contain mix-blend-multiply p-2"/>
                           </div>
                           <div className="flex-1">
                             <h4 className="font-bold text-gray-800">{item.name}</h4>
                             
                             {/* Selected Options Display */}
                             {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                               <div className="flex flex-wrap gap-1 mt-1">
                                 {Object.entries(item.selectedOptions).map(([key, value]) => (
                                   <span key={key} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                     {key}: {Array.isArray(value) ? value.join(", ") : value}
                                   </span>
                                 ))}
                               </div>
                             )}

                             <p className="text-sm font-black mt-1 text-[var(--color-brand-orange)]">${item.price * item.quantity}</p>
                             <div className="flex items-center gap-4 mt-3 bg-gray-50 w-fit rounded-full border border-gray-100 p-1">
                               <button onClick={() => item.quantity === 1 ? removeItem(item.cartItemId) : updateQuantity(item.cartItemId, item.quantity - 1)} className="w-6 h-6 rounded-full hover:bg-gray-200 text-gray-600 flex items-center justify-center"><Minus size={14}/></button>
                               <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                               <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-6 h-6 rounded-full hover:bg-gray-200 text-gray-600 flex items-center justify-center"><Plus size={14}/></button>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}

                   {/* STEP 2: USER IDENTITY & ADDRESS */}
                   {step === 2 && (
                     <div className="space-y-8 anime-in fade-in">
                        {/* Identidad */}
                        <div>
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-2"><UserCircle size={16}/> Tus Datos</label>
                           {authUser ? (
                              <div className="bg-[var(--color-brand-marble)] border border-gray-200 p-4 rounded-2xl flex items-center gap-3">
                                 <div className="w-11 h-11 bg-[var(--color-brand-orange)] text-white rounded-full flex items-center justify-center font-black text-lg flex-shrink-0">
                                   {authUser.name.charAt(0).toUpperCase()}
                                 </div>
                                 <div className="min-w-0">
                                   <p className="font-bold text-gray-900 truncate">{authUser.name}</p>
                                   <p className="text-xs text-gray-500 truncate">{authUser.email}</p>
                                 </div>
                              </div>
                           ) : null}
                        </div>

                        {/* Coordenadas Geográficas UI Simulator */}
                        <div>
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-2"><MapPin size={16}/> ¿A dónde entregamos?</label>
                           <div className="relative">
                              <input placeholder="Buscar en maps... ej: Calle 5, Reforma" value={tempAddress} onChange={e=>setTempAddress(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:border-black outline-none font-medium" />
                              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <button onClick={handleUseGPS} disabled={gpsLoading} className="bg-black text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors font-bold disabled:opacity-60">
                                {gpsLoading ? "Localizando..." : "Usar GPS"}
                              </button>
                              </div>
                           </div>
                           {gpsError && <p className="mt-2 text-xs text-red-500 font-medium">{gpsError}</p>}
                           {/* Map Frame — updates with GPS or defaults to CDMX */}
                           <div className="mt-3 w-full h-32 bg-gray-200 rounded-2xl overflow-hidden relative border border-gray-200 grayscale opacity-80">
                              <iframe
                                key={mapCoords ? `${mapCoords.lat},${mapCoords.lng}` : "default"}
                                width="100%"
                                height="100%"
                                src={mapCoords
                                  ? `https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=16&output=embed`
                                  : "https://maps.google.com/maps?q=CDMX&z=14&output=embed"
                                }
                                style={{ border: 0 }}
                              />
                           </div>
                        </div>
                     </div>
                   )}

                   {/* STEP 3: FINTECH, TIPS & PAYMENT */}
                   {step === 3 && (
                     <div className="space-y-8 anime-in fade-in">
                        {/* Tips UI Simulator */}
                        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                           <h3 className="font-black text-lg mb-1 relative z-10 flex items-center gap-2">Gratificar a tu Repartidor <DollarSign size={18} className="text-green-400"/></h3>
                           <p className="text-indigo-200 text-sm mb-5 relative z-10">El 100% es para quien entrega tu comida.</p>
                           
                           <div className="flex justify-between items-center gap-2 relative z-10">
                              {[0, 5, 10, 15].map((tip) => (
                                <button 
                                   key={tip}
                                   onClick={() => setSelectedTip(tip)}
                                   className={`flex-1 py-3 rounded-xl font-bold transition-all ${selectedTip === tip ? 'bg-white text-indigo-900 scale-105 shadow-md' : 'bg-indigo-800/50 hover:bg-indigo-600 text-indigo-100 hover:scale-105'}`}
                                >
                                   {tip === 0 ? "Sin propina" : `${tip}%`}
                                </button>
                              ))}
                           </div>
                        </div>

                        {/* Tarjeta UI Tokenizada */}
                        <div>
                           <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-2"><CreditCard size={16}/> Método de Pago Segurizado</label>
                           
                           <div className="space-y-3">
                              <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${tempPayment === 'CASH' ? 'border-2 border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                 <input type="radio" name="paymentType" value="CASH" checked={tempPayment === 'CASH'} onChange={() => setTempPayment('CASH')} className="w-5 h-5 accent-black" />
                                 <span className="font-bold text-gray-800">Efectivo al recibir</span>
                              </label>

                              <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${tempPayment === 'CARD' ? 'border-2 border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                 <input type="radio" name="paymentType" value="CARD" checked={tempPayment === 'CARD'} onChange={() => setTempPayment('CARD')} className="w-5 h-5 accent-indigo-600" />
                                 <div className="flex-1 flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Mastercard terminada en 4444</span>
                                    <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center text-[8px] text-white font-black">MC</div>
                                 </div>
                              </label>

                              <button className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">+ Agregar nueva tarjeta</button>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              )}
            </div>

            {/* Bottom Sticky Action Bar */}
            {!orderSuccess && items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-15px_30px_rgba(0,0,0,0.04)] relative z-20">
                <div className="flex flex-col mb-4">
                  {appliedPromo && (
                     <div className="flex justify-between items-center text-sm font-bold text-green-600 mb-2">
                        <span>Desc. {appliedPromo.code} ✅</span>
                     </div>
                  )}
                  {selectedTip > 0 && step === 3 && (
                     <div className="flex justify-between items-center text-sm font-bold text-gray-600 mb-1">
                        <span>Propina ({selectedTip}%)</span>
                        <span>+ ${Math.round(getTotalPrice() * (selectedTip / 100))}</span>
                     </div>
                  )}
                  <div className="flex justify-between items-end w-full mt-2">
                    <span className="font-medium text-gray-500">Total Final</span>
                    <span className="font-black text-4xl font-poppins text-gray-900">
                       ${getTotalPrice() + (step === 3 ? Math.round(getTotalPrice() * (selectedTip / 100)) : 0)} <span className="text-lg">MXN</span>
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={step === 3 ? handleCheckoutFinished : handleNextStep}
                  disabled={isCheckingOut || (step === 2 && !tempAddress && !user?.addresses.length) || (step === 3 && !tempPayment)}
                  className="w-full py-5 bg-[var(--color-brand-orange)] hover:bg-[#e65100] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all hover:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center gap-2">
                       <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Procesando Fintech...
                    </span>
                  ) : (
                    <>{step === 3 ? 'Confirmar Pago Seguro' : 'Continuar'} <ArrowRight size={20} /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Order tracking — rendered outside the cart panel, over everything */}
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
