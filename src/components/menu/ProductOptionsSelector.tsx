"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MenuItem, ProductConfig, OptionValue } from "../../data/menuData";
import { X, Check, ShoppingCart } from "lucide-react";
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
          alert(`Por favor selecciona: ${opt.name}`);
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
        {/* Product image header */}
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

          <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-2">
            {parsedConfig?.options?.map((group) => (
              <div key={group.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">
                    {group.name}{" "}
                    {group.required && <span className="text-[var(--color-brand-orange)]">*</span>}
                  </h3>
                  {group.required && !selectedOptions[group.name] && (
                    <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold">
                      Obligatorio
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
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
                        className={`flex flex-col items-center gap-0.5 px-5 py-3.5 rounded-2xl border-2 transition-all duration-200 text-sm font-black italic tracking-tight min-w-[4.5rem] ${
                          isSelected
                            ? "bg-black border-black text-white shadow-xl scale-[1.04]"
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {val.label}
                          {isSelected && (
                            <Check size={12} className="text-[var(--color-brand-orange)]" />
                          )}
                        </span>
                        {delta && (
                          <span
                            className={`text-[10px] font-bold not-italic ${
                              isSelected ? "text-[var(--color-brand-orange)]" : "text-gray-400"
                            }`}
                          >
                            {delta}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer with dynamic total */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                A pagar
              </span>
              <motion.span
                key={computedPrice}
                initial={{ scale: 1.1, color: "#FF5A00" }}
                animate={{ scale: 1, color: "#111111" }}
                transition={{ duration: 0.25 }}
                className="text-4xl font-black italic tracking-tighter"
              >
                ${computedPrice}
              </motion.span>
              {computedPrice !== product.price && (
                <span className="text-xs text-gray-400 line-through">
                  Base: ${product.price}
                </span>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={!!isRequiredMissing}
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
