"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuData, MenuItem } from "../data/menuData";
import { useCartStore } from "../store/useCartStore";
import { useAuth } from "../store/useAuth";
import { useAuthGuardStore } from "../store/useAuthGuardStore";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { ProductOptionsSelector } from "./menu/ProductOptionsSelector";

export function Menu() {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthGuardStore();
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const [selectingProduct, setSelectingProduct] = useState<MenuItem | null>(null);

  const handleSelectProduct = (item: MenuItem) => {
    const doIt = () => setSelectingProduct(item);
    if (isAuthenticated()) doIt();
    else openModal(doIt, "Inicia sesión para personalizar y ordenar este producto.");
  };

  const categories = [
    "Todas", 
    "Pizzas — Especialidades", 
    "Pizzas — Clásicas", 
    "Burgers", 
    "Alitas & Boneless", 
    "Entradas / Snacks", 
    "Bebidas", 
    "Cerveza"
  ];

  const filteredItems = activeCategory === "Todas" 
    ? menuData 
    : menuData.filter(item => item.category === activeCategory);

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto" id="menu">
      <div className="mb-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-4 font-poppins italic tracking-tight"
        >
          NUESTRO MENÚ <span className="text-[var(--color-brand-orange)]">ASOMBRO</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 max-w-2xl mx-auto"
        >
          Desde nuestras famosas pizzas de masa madre hasta snacks crujientes y postres irresistibles.
        </motion.p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 relative overflow-hidden ${
              activeCategory === cat 
                ? "bg-black text-white shadow-xl scale-105" 
                : "bg-white text-gray-400 hover:text-black border border-gray-100 hover:border-gray-300"
            }`}
          >
            {activeCategory === cat && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-[var(--color-brand-orange)] -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <MenuCard
              key={item.id}
              item={item}
              addItem={(p) => {
                if (isAuthenticated()) addItem(p);
                else openModal(() => addItem(p), "Inicia sesión para agregar productos a tu carrito.");
              }}
              onSelect={() => handleSelectProduct(item)}
              idx={idx}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Options Selector Modal */}
      {selectingProduct && (
        <ProductOptionsSelector 
          product={selectingProduct}
          isOpen={!!selectingProduct}
          onClose={() => setSelectingProduct(null)}
        />
      )}
    </section>
  );
}

function MenuCard({ 
  item, 
  addItem, 
  onSelect, 
  idx 
}: { 
  item: MenuItem, 
  addItem: (p: any) => void, 
  onSelect: () => void,
  idx: number 
}) {
  const handleAdd = () => {
    if (item.config) {
      onSelect();
    } else {
      addItem(item);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-3xl p-6 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden ring-1 ring-black/5"
    >
      <div className="relative h-64 mb-6 w-full flex items-center justify-center bg-[var(--color-brand-marble)] rounded-3xl overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
            {item.category}
          </span>
        </div>
        <motion.div
          className="w-full h-full relative"
          whileHover={{ scale: 1.1, rotate: 2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="flex-1 object-contain p-4 drop-shadow-2xl mix-blend-multiply"
          />
        </motion.div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-black font-poppins italic tracking-tight uppercase line-clamp-1">{item.name}</h3>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">{item.description}</p>
        
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Base</span>
            <span className="text-2xl font-black italic tracking-tighter">${item.price}</span>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-black hover:bg-[var(--color-brand-orange)] text-white px-8 py-4 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-lg hover:shadow-[var(--color-brand-orange-soft)] uppercase"
          >
             {item.config ? "Opciones" : "Añadir"}
             <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
