"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Zap } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useEffect, useState } from "react";

export function FloatingCart() {
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const [mounted, setMounted] = useState(false);
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (totalItems > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 400);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  if (!mounted) return null;

  return (
    <div className="fixed top-8 right-8 z-[60] flex flex-col items-center">
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            onClick={toggleCart}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center justify-center"
          >
             {/* Main Button Body with Glassmorphism */}
             <div className="bg-black/80 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.3)] flex items-center justify-center relative z-10 overflow-hidden">
                <motion.div
                  animate={isBumping ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative"
                >
                  <ShoppingBag size={28} className="text-[var(--color-brand-orange)]" />
                  
                  {/* Item Counter Shield */}
                  <motion.div
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-3 bg-[var(--color-brand-orange)] text-white text-[9px] font-black italic h-6 w-6 rounded-xl flex items-center justify-center shadow-lg border-2 border-black"
                  >
                    {totalItems}
                  </motion.div>
                </motion.div>
                
                {/* Internal Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>

             {/* External Pulse Ring */}
             {isBumping && (
                <motion.div 
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 border-4 border-[var(--color-brand-orange)] rounded-[2.5rem] z-0"
                />
             )}
             
             {/* Subtext Tooltip (Visible on large screens) */}
             <div className="absolute top-full mt-4 bg-black text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-2xl border border-white/5 whitespace-nowrap">
                Review My Cart <Zap size={8} className="inline ml-1 text-[var(--color-brand-orange)] fill-[var(--color-brand-orange)]" />
             </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
