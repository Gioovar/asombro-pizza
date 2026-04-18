"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, Users, Ticket, ArrowRight, Zap, Sparkles } from "lucide-react";
import { EventModal } from "./EventModal";
import { motion } from "framer-motion";

export function EventSlider() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/client/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      });
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="w-full py-24 bg-black text-white relative overflow-hidden" id="events">
      {/* Background brand glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-brand-orange)]/10 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
      
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 mb-12 relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="flex items-center gap-2 mb-3"
           >
              <Zap size={14} className="text-[var(--color-brand-orange)] fill-[var(--color-brand-orange)]" />
              <span className="text-[10px] font-black text-gray-400 tracking-[0.4em] uppercase">Hospitality & Entertainment</span>
           </motion.div>
           <h3 className="text-5xl md:text-6xl font-black font-poppins text-white italic tracking-tighter uppercase leading-none">
             Próximos <span className="text-[var(--color-brand-orange)]">Eventos</span>
           </h3>
        </div>
        <button className="hidden md:flex items-center gap-3 text-gray-400 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:bg-white/10 group">
           Ver cartelera completa <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Slider Snap Container */}
      <div className="flex gap-8 overflow-x-auto px-8 md:px-16 pb-12 snap-x snap-mandatory hide-scrollbar touch-pan-x">
        {events.map((evt, idx) => {
           const eventDate = new Date(evt.date);
           const formatter = new Intl.DateTimeFormat('es-MX', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' });
           
           return (
             <motion.div 
               key={evt.id} 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               onClick={() => setSelectedEvent(evt)}
               className="snap-start shrink-0 w-[340px] md:w-[460px] aspect-[4/5] bg-neutral-900 rounded-[3.5rem] overflow-hidden relative group cursor-pointer border border-white/5 shadow-2xl transition-all duration-500 hover:scale-[1.02]"
             >
               {/* Poster Image */}
               <div className="absolute inset-0 z-0">
                  <Image 
                    src={evt.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                    alt={evt.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
               </div>

               <div className="absolute inset-0 z-10 flex flex-col justify-end p-10">
                  
                  {/* Status Badge */}
                  <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-orange)] shadow-[0_0_8px_rgba(255,90,0,0.6)] animate-pulse"></span>
                     {evt.category}
                  </div>

                  {evt.capacity < 100 && (
                     <div className="absolute top-8 right-8 bg-[var(--color-brand-orange)] text-white px-4 py-2 rounded-2xl text-[10px] font-black italic shadow-2xl transform rotate-2">
                        Cupo VIP Limitado
                     </div>
                  )}

                  <div className="mb-8">
                     <p className="text-[var(--color-brand-orange)] text-[10px] font-black uppercase tracking-[0.3em] mb-2">{evt.price === 0 ? "ENTRY COMPLIMENTARY" : "TICKETS AVAILABLE"}</p>
                     <h4 className="text-4xl font-black font-poppins italic tracking-tighter uppercase leading-none group-hover:text-white transition-colors">{evt.title}</h4>
                  </div>

                  <div className="flex flex-col gap-3 text-xs text-gray-400 mb-8 font-black uppercase tracking-widest">
                     <span className="flex items-center gap-3"><CalendarDays size={18} className="text-white"/> {formatter.format(eventDate)}</span>
                     <span className="flex items-center gap-3"><Users size={18} className="text-white"/> Aforo: {evt.capacity} Pax</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-white/10 group-hover:border-white/20 transition-all">
                     <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Cover General</p>
                        <p className="text-3xl font-black italic tracking-tighter">{evt.price === 0 ? "FREE" : `$${evt.price}`}</p>
                     </div>
                     <button className="bg-white text-black p-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-[var(--color-brand-orange)] hover:text-white transition-all shadow-2xl active:scale-95">
                        Get Entry <ArrowRight size={16}/>
                     </button>
                  </div>
               </div>
               
               {/* Decorative Sparkle */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={200} className="text-white" />
               </div>
             </motion.div>
           );
        })}
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
