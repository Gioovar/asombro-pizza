"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, Percent } from "lucide-react";

import { useCartStore } from "@/store/useCartStore";

export function PromotionSlider() {
  const [promos, setPromos] = useState<any[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/client/promos")
      .then((res) => res.json())
      .then((data) => {
         if (Array.isArray(data)) {
           setPromos(data);
         } else {
           setPromos([]);
         }
      })
      .catch(console.error);
  }, []);

  if (promos.length === 0) return null;

  return (
    <>
      <div className="w-full mt-4 mb-12 overflow-hidden">
        <div className="px-6 md:px-12 mb-4 flex items-center justify-between">
           <h2 className="text-2xl font-black font-poppins text-gray-900">Ofertas de la Semana 🚀</h2>
           <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-[var(--color-brand-orange)]"></div>
             <div className="w-2 h-2 rounded-full bg-gray-300"></div>
           </div>
        </div>

        {/* Native CSS Snap Carousel */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-6 md:px-12 gap-6 touch-pan-x">
          {promos.map((promo, idx) => (
            <motion.div
              key={promo.id || idx}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPromo(promo)}
              className="snap-center shrink-0 w-[85vw] md:w-[400px] h-[220px] rounded-3xl relative overflow-hidden cursor-pointer shadow-[0_15px_30px_rgba(0,0,0,0.1)] group"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                style={{ backgroundImage: `url(${promo.imageUrl})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              {promo.badgeText && (
                 <div className="absolute top-4 left-4 bg-[var(--color-brand-orange)] text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
                   {promo.badgeText}
                 </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-black text-2xl mb-1 font-poppins">{promo.title}</h3>
                <p className="text-gray-300 text-sm line-clamp-1">{promo.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
         {selectedPromo && (
           <PromotionModal promo={selectedPromo} onClose={() => setSelectedPromo(null)} />
         )}
      </AnimatePresence>
    </>
  );
}

function PromotionModal({ promo, onClose }: { promo: any, onClose: () => void }) {
   const [applying, setApplying] = useState(false);
   const applyPromo = useCartStore(s => s.applyPromo);
   
   const handleApply = () => {
      setApplying(true);
      applyPromo(promo);
      setTimeout(() => {
         alert(`¡${promo.code} aplicado al carrito! Se descontará al pagar.`);
         setApplying(false);
         onClose();
      }, 800);
   };

   return (
     <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
        ></motion.div>

        {/* Modal Content */}
        <motion.div 
          initial={{ y: "100%", scale: 0.9 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
        >
           <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 hover:bg-black text-white rounded-full flex flex-col items-center justify-center transition-colors">✕</button>

           <div className="h-48 relative w-full">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${promo.imageUrl})` }}></div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
           </div>

           <div className="p-6 relative -mt-6">
              <div className="flex gap-2 mb-3">
                 <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><Clock size={12}/> Vence pronto</span>
                 <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Cód: {promo.code}</span>
              </div>
              <h2 className="text-3xl font-black font-poppins mb-2">{promo.title}</h2>
              <p className="text-gray-500 mb-6">{promo.description}</p>
              
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl mb-8 flex items-center gap-4">
                 <div className="w-12 h-12 bg-[var(--color-brand-orange)] rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/30">
                    <Percent size={24} />
                 </div>
                 <div>
                    <p className="font-bold text-sm text-orange-900">Beneficio Directo</p>
                    <p className="text-xs text-orange-700">Se aplicará automáticamente a tu cuenta final al proceder al pago.</p>
                 </div>
              </div>

              <button 
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {applying ? <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Aprovechar Promoción"}
              </button>
           </div>
        </motion.div>
     </div>
   );
}
