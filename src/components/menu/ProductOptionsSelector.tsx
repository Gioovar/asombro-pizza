"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem, ProductConfig, OptionValue } from "../../data/menuData";
import { X, Check, ShoppingCart, PlusCircle } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";

interface ProductOptionsSelectorProps {
  product: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductOptionsSelector({ product, isOpen, onClose }: ProductOptionsSelectorProps) {
  const { addItem } = useCartStore();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});
  const [parsedConfig, setParsedConfig] = useState<ProductConfig | null>(null);

  useEffect(() => {
    if (product.config) {
      try {
        setParsedConfig(JSON.parse(product.config));
      } catch (e) {
        console.error("Error parsing product config", e);
      }
    }
    setSelectedOptions({});
  }, [product.config]);

  // ── Price calculation ──────────────────────────────────────────
  const computedPrice = (() => {
    if (!parsedConfig) return product.price;
    let total = product.price;
    for (const group of parsedConfig.options) {
      const sel = selectedOptions[group.name];
      if (!sel) continue;
      if (group.type === "selection" && typeof sel === "string") {
        const opt = group.values.find(v => v.label === sel);
        if (opt) total += opt.price;
      } else if (group.type === "multiple" && Array.isArray(sel)) {
        for (const label of sel) {
          const opt = group.values.find(v => v.label === label);
          if (opt) total += opt.price;
        }
      }
    }
    return total;
  })();

  const handleToggleOption = (groupName: string, value: string, isMultiple: boolean) => {
    setSelectedOptions((prev) => {
      if (isMultiple) {
        const current = (prev[groupName] as string[]) || [];
        return {
          ...prev,
          [groupName]: current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [groupName]: value };
    });
  };

  const handleAdd = () => {
    if (parsedConfig?.options) {
      for (const opt of parsedConfig.options) {
        if (opt.required && !selectedOptions[opt.name]) {
          // Highlight needed option logically
          return;
        }
      }
    }
    addItem(product, 1, selectedOptions as Record<string, any>, computedPrice);
    onClose();
  };

  const isRequiredMissing = parsedConfig?.options?.some(
    opt => opt.required && !selectedOptions[opt.name]
  );

  const formatDelta = (v: OptionValue) => {
    if (v.price === 0) return null;
    return v.price > 0 ? `+$${v.price}` : `-$${Math.abs(v.price)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative bg-white w-full sm:max-w-2xl rounded-t-[3rem] sm:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]"
          >
            {/* Header / Image with gradient overlay */}
            <div className="relative h-56 sm:h-64 bg-neutral-900 overflow-hidden flex-shrink-0">
               <motion.img
                 layoutId={`img-${product.id}`}
                 src={product.image}
                 alt={product.name}
                 className="w-full h-full object-cover mix-blend-screen opacity-90 scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
               
               <button
                 onClick={onClose}
                 className="absolute top-8 right-8 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full text-white shadow-2xl transition-all active:scale-90"
               >
                 <X size={24} />
               </button>

               <div className="absolute bottom-6 inset-x-10">
                  <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase text-black leading-none">{product.name}</h2>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mt-2 max-w-sm line-clamp-2 md:line-clamp-none">{product.description}</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 sm:px-12 py-6 space-y-10 custom-scrollbar pb-32">
              {parsedConfig?.options?.map((group) => (
                <div key={group.name} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">
                      {group.name}
                    </h3>
                    {group.required && (
                      <span className="text-[10px] font-black italic text-[var(--color-brand-orange)] uppercase tracking-widest">
                        * Selección Obligatoria
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {group.values.map((val) => {
                      const sel = selectedOptions[group.name];
                      const isSelected =
                        group.type === "multiple"
                          ? Array.isArray(sel) && sel.includes(val.label)
                          : sel === val.label;
                      const delta = formatDelta(val);

                      return (
                        <button
                          key={val.label}
                          onClick={() =>
                            handleToggleOption(group.name, val.label, group.type === "multiple")
                          }
                          className={`relative flex flex-col items-center justify-center p-5 rounded-[2.5rem] border-2 transition-all duration-300 text-sm font-black italic tracking-tight overflow-hidden ${
                            isSelected
                              ? "bg-black border-black text-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] scale-[1.02] z-10"
                              : "bg-gray-50/50 border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-white"
                          }`}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                             {val.label}
                             {isSelected && <Check size={14} className="text-[var(--color-brand-orange)]" />}
                          </span>
                          
                          {delta && (
                            <span className={`relative z-10 text-[9px] font-black not-italic mt-1 uppercase ${isSelected ? 'text-[var(--color-brand-orange)]' : 'text-gray-400'}`}>
                              {delta}
                            </span>
                          )}

                          {/* Subtle glow for selected items */}
                          {isSelected && (
                             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Action Footer */}
            <div className="absolute bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl p-8 sm:px-12 border-t border-gray-100 flex items-center justify-between z-20">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">
                  Total Estimado
                </span>
                <div className="flex items-baseline gap-2">
                   <motion.span
                     key={computedPrice}
                     initial={{ scale: 1.2, color: "#FF5A00" }}
                     animate={{ scale: 1, color: "#000000" }}
                     className="text-4xl sm:text-5xl font-black italic tracking-tighter"
                   >
                     ${computedPrice}
                   </motion.span>
                   <span className="text-xs font-bold text-gray-300 uppercase italic">MXN</span>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={!!isRequiredMissing}
                className={`relative overflow-hidden group flex items-center gap-3 bg-[var(--color-brand-orange)] text-white px-10 sm:px-14 py-5 sm:py-6 rounded-[2.5rem] text-sm font-black italic tracking-tighter transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,90,0,0.2)] disabled:grayscale disabled:opacity-40 uppercase`}
              >
                <ShoppingCart size={18} className="translate-y-[-1px]" />
                <span className="relative z-10 whitespace-nowrap">Confirmar Pedido</span>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
