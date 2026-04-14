"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
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
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggleCart}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed top-6 right-6 md:top-8 md:right-8 z-50 bg-[var(--color-brand-orange)] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(255,90,0,0.4)] transition-shadow duration-300 flex items-center justify-center cursor-pointer mix-blend-normal"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={isBumping ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <ShoppingBag size={24} />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center"
            >
              {totalItems}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
