"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "../../data/menuData";
import { X, Check, ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";

interface ProductOptionsSelectorProps {
  product: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductOptionsSelector({ product, isOpen, onClose }: ProductOptionsSelectorProps) {
  const { addItem } = useCartStore();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [parsedConfig, setParsedConfig] = useState<any>(null);

  useEffect(() => {
    if (product.config) {
      try {
        setParsedConfig(JSON.parse(product.config));
      } catch (e) {
        console.error("Error parsing product config", e);
      }
    }
  }, [product.config]);

  const handleToggleOption = (groupName: string, value: string, isMultiple: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[groupName] || (isMultiple ? [] : "");
      
      if (isMultiple) {
        if (Array.isArray(current)) {
           return {
             ...prev,
             [groupName]: current.includes(value) 
               ? current.filter((v: string) => v !== value)
               : [...current, value]
           };
        }
      } else {
        return {
          ...prev,
          [groupName]: value
        };
      }
      return prev;
    });
  };

  const handleAdd = () => {
    // Basic validation for required options
    if (parsedConfig?.options) {
      for (const opt of parsedConfig.options) {
        if (opt.required && !selectedOptions[opt.name]) {
          alert(`Por favor selecciona: ${opt.name}`);
          return;
        }
      }
    }
    
    addItem(product, 1, selectedOptions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative h-48 bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover mix-blend-multiply opacity-90 p-8"
          />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">{product.name}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {parsedConfig?.options?.map((group: any) => (
              <div key={group.name} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">
                    {group.name} {group.required && <span className="text-[var(--color-brand-orange)]">*</span>}
                  </h3>
                  {group.required && !selectedOptions[group.name] && (
                    <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold">Obligatorio</span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {group.values.map((val: string) => {
                    const isSelected = group.type === "multiple" 
                      ? selectedOptions[group.name]?.includes(val)
                      : selectedOptions[group.name] === val;
                      
                    return (
                      <button
                        key={val}
                        onClick={() => handleToggleOption(group.name, val, group.type === "multiple")}
                        className={`group flex items-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all duration-300 text-sm font-black italic tracking-tight ${
                          isSelected 
                            ? "bg-black border-black text-white shadow-xl scale-[1.02]" 
                            : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                        }`}
                      >
                        {val}
                        {isSelected && <Check size={14} className="text-[var(--color-brand-orange)]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">A pagar</span>
              <span className="text-4xl font-black italic tracking-tighter">${product.price}</span>
            </div>
            
            <button
              onClick={handleAdd}
              disabled={parsedConfig?.options?.some((opt: any) => opt.required && !selectedOptions[opt.name])}
              className="flex items-center gap-3 bg-[var(--color-brand-orange)] hover:bg-black text-white px-10 py-5 rounded-2xl text-sm font-black italic tracking-tight transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed uppercase"
            >
              <ShoppingCart size={18} />
              Confirmar Selección
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
