"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, Percent, Zap, ChevronRight, X } from "lucide-react";
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
      <div className="w-full mt-10 mb-20 overflow-hidden">
        <div className="px-8 md:px-16 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <h2 className="text-4xl font-black font-poppins italic tracking-tighter uppercase leading-none mb-2">
                Asombro <span className="text-[var(--color-brand-orange)]">Squad Deals</span>
              </h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Curaduría de Beneficios Exclusivos</p>
           </div>
           <div className="flex gap-2">
             <div className="w-8 h-1 bg-[var(--color-brand-orange)] rounded-full"></div>
             <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
           </div>
        </div>

        {/* Native CSS Snap Carousel with Premium Styling */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10 px-8 md:px-16 gap-8 touch-pan-x">
          {promos.map((promo, idx) => (
            <motion.div
              key={promo.id || idx}
              whileHover={{ scale: 1.02, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPromo(promo)}
              className="snap-center shrink-0 w-[85vw] md:w-[420px] h-[260px] rounded-[3rem] relative overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.1)] group border border-white/10"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                style={{ backgroundImage: `url(${promo.imageUrl})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
              
              {promo.badgeText && (
                 <div className="absolute top-6 left-6 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/20">
                   {promo.badgeText}
                 </div>
              )}

              <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <p className="text-[var(--color-brand-orange)] text-[10px] font-black uppercase tracking-[0.3em] mb-2">{promo.code}</p>
                <h3 className="font-black text-3xl mb-1 font-poppins italic tracking-tighter uppercase leading-none">{promo.title}</h3>
                <p className="text-gray-400 text-xs font-medium line-clamp-1">{promo.description}</p>
              </div>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-brand-orange)] p-3 rounded-2xl shadow-xl">
                 <Zap size={20} className="text-white fill-white" />
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
         setApplying(false);
         onClose();
      }, 1200);
   };

   return (
     <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        {/* Backdrop Trigger */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Content */}
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md bg-white rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col border border-white/10"
        >
           <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-black/50 hover:bg-black text-white rounded-2xl transition-all active:scale-95">
              <X size={20} />
           </button>

           <div className="h-64 relative w-full overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${promo.imageUrl})` }}></div>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
           </div>

           <div className="p-10 relative -mt-16 bg-white rounded-[3rem]">
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="bg-black text-[var(--color-brand-orange)] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Clock size={12}/> VENCE PRONTO
                 </span>
                 <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-200">
                    Cód: {promo.code}
                 </span>
              </div>
              
              <h2 className="text-4xl font-black font-poppins italic tracking-tighter uppercase mb-3 leading-none">{promo.title}</h2>
              <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed italic">{promo.description}</p>
              
              <div className="bg-neutral-900 p-6 rounded-[2.5rem] mb-10 border border-white/5 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={40} className="text-white" />
                 </div>
                 <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 bg-[var(--color-brand-orange)] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                       <Percent size={28} />
                    </div>
                    <div>
                       <p className="font-black italic text-lg text-white uppercase tracking-tight">Beneficio VIP</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aplicación automática al pagar</p>
                    </div>
                 </div>
              </div>

              <button 
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-black text-white py-6 rounded-3xl font-black italic uppercase tracking-widest text-sm shadow-xl hover:bg-[var(--color-brand-orange)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {applying ? (
                   <span className="flex items-center gap-3">
                      <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span> Validando...
                   </span>
                ) : (
                   <>Aprovechar Oferta <ChevronRight size={18} /></>
                )}
              </button>
           </div>
        </motion.div>
     </div>
   );
}
