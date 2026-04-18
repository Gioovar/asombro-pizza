"use client";

import { motion } from "framer-motion";
import { Zap, Clock, ShieldCheck, Heart } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
  const features = [
    {
      icon: <Clock className="text-[var(--color-brand-orange)]" />,
      title: "Paciencia Pura",
      description: "Nuestra masa madre fermenta por 72 horas para lograr una ligereza y crunch inigualable."
    },
    {
      icon: <ShieldCheck className="text-[var(--color-brand-orange)]" />,
      title: "Curaduría Squad",
      description: "Ingredientes importados directamente y selección artesanal en cada proceso."
    },
    {
      icon: <Zap className="text-[var(--color-brand-orange)]" />,
      title: "Cultura Brooklyn",
      description: "Traemos el alma de las mejores pizzerías de Nueva York directamente a tu mesa."
    }
  ];

  return (
    <section id="nosotros" className="py-32 px-8 md:px-16 bg-white overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Visual Narrative Grid */}
          <div className="relative">
             <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-2xl mt-12"
                >
                   <Image 
                     src="https://images.unsplash.com/photo-1556910103-1c02745aae4d" 
                     alt="Masa Madre Artesanal" 
                     fill 
                     className="object-cover"
                   />
                </motion.div>
                <div className="space-y-4">
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="aspect-square relative rounded-[2rem] overflow-hidden shadow-xl"
                   >
                      <Image 
                        src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c" 
                        alt="Pizza al Horno" 
                        fill 
                        className="object-cover"
                      />
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.2 }}
                     className="aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-xl bg-black flex flex-col items-center justify-center p-8 text-center"
                   >
                      <div className="text-[var(--color-brand-orange)] mb-4">
                         <Heart size={48} className="fill-[var(--color-brand-orange)]" />
                      </div>
                      <p className="text-white text-xs font-black uppercase tracking-[0.2em]">Más que pizza, es pasión</p>
                   </motion.div>
                </div>
             </div>
             
             {/* Dynamic Badge */}
             <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-4">
                   <div className="text-5xl font-black italic tracking-tighter text-black">72<span className="text-[var(--color-brand-orange)]">H</span></div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-tight">Proceso de<br/>Fermentación</div>
                </div>
             </div>
          </div>

          {/* Text Content */}
          <div className="space-y-12">
             <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-[var(--color-brand-orange)] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block"
                >
                  Nuestra Filosofía
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-7xl font-black font-poppins italic tracking-tighter uppercase leading-none mb-6"
                >
                  El Arte de lo <span className="text-neutral-300">Inimitable</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-gray-500 text-lg leading-relaxed font-normal"
                >
                  En Asombro Pizza no solo horneamos; creamos experiencias. Inspirados en la técnica clásica de Brooklyn y la precisión de la panadería europea, nuestra masa madre es el alma de cada bocado.
                </motion.p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {features.map((f, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-3"
                  >
                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        {f.icon}
                     </div>
                     <h4 className="font-black italic uppercase tracking-tight text-lg">{f.title}</h4>
                     <p className="text-gray-400 text-xs font-medium leading-relaxed">{f.description}</p>
                  </motion.div>
                ))}
             </div>

             <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="pt-8"
             >
                <button className="bg-black text-white px-10 py-5 rounded-2xl font-black italic uppercase text-xs tracking-widest hover:bg-[var(--color-brand-orange)] transition-all shadow-xl active:scale-95">
                  Conoce nuestra historia
                </button>
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
