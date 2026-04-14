"use client";

import { motion } from "framer-motion";
import { pizzasData, Pizza } from "../data/pizzas";
import { useCartStore } from "../store/useCartStore";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

export function Menu() {
  const { addItem } = useCartStore();

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto" id="menu">
      <div className="mb-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4 font-poppins"
        >
          Nuestro Menú Clásico
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 max-w-2xl mx-auto"
        >
          Elaboradas con masa madre, fermentada por 48 horas e ingredientes frescos importados.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {pizzasData.map((pizza, idx) => (
          <MenuCard key={pizza.id} pizza={pizza} addItem={addItem} idx={idx} />
        ))}
      </div>
    </section>
  );
}

function MenuCard({ pizza, addItem, idx }: { pizza: Pizza, addItem: (p: Pizza) => void, idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-3xl p-6 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
    >
      <div className="relative h-64 mb-6 w-full flex items-center justify-center bg-[var(--color-brand-marble)] rounded-2xl overflow-hidden">
        <motion.div
          className="w-full h-full relative"
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={pizza.image}
            alt={pizza.name}
            fill
            className="object-contain p-4 drop-shadow-2xl mix-blend-multiply"
          />
        </motion.div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-bold font-poppins">{pizza.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{pizza.description}</p>
        
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <span className="text-xl font-bold">${pizza.price} <span className="text-sm text-gray-400 font-normal">MXN</span></span>
          <button
            onClick={() => addItem(pizza)}
            className="flex items-center gap-2 bg-black hover:bg-[var(--color-brand-orange)] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
             <ShoppingCart size={16} />
             Agregar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
