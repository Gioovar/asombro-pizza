"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, Users, Ticket, ArrowRight, Info } from "lucide-react";
import { EventModal } from "./EventModal";

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
    <div className="w-full py-12 bg-black text-white relative overflow-hidden" id="events">
      {/* Background glow effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 mb-8 relative z-10 flex justify-between items-end">
        <div>
           <h2 className="text-sm font-black text-purple-400 tracking-widest uppercase mb-2">Hospitality & Entertainment</h2>
           <h3 className="text-4xl md:text-5xl font-black font-poppins text-white">Próximos Eventos</h3>
        </div>
        <button className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold">
           Ver cartelera <ArrowRight size={18}/>
        </button>
      </div>

      {/* Slider Snap Container */}
      <div className="flex gap-6 overflow-x-auto px-6 pb-8 snap-x snap-mandatory hide-scrollbar">
        {events.map((evt) => {
           const eventDate = new Date(evt.date);
           const formatter = new Intl.DateTimeFormat('es-MX', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' });
           
           return (
             <div 
               key={evt.id} 
               onClick={() => setSelectedEvent(evt)}
               className="snap-start shrink-0 w-[340px] md:w-[420px] aspect-[4/5] bg-gray-900 rounded-[2rem] overflow-hidden relative group cursor-pointer border border-white/10"
             >
               {/* Background Image Image */}
               <Image 
                 src={evt.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                 alt={evt.title}
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                 
                 <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    {evt.category}
                 </div>

                 {evt.capacity < 100 && (
                    <div className="absolute top-6 right-6 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-black rotate-3 shadow-lg">
                       ¡Casi agotado! 🔥
                    </div>
                 )}

                 <h4 className="text-2xl font-black font-poppins mb-2 group-hover:text-purple-300 transition-colors">{evt.title}</h4>
                 <div className="flex flex-col gap-2 text-sm text-gray-300 mb-6 font-medium">
                    <span className="flex items-center gap-2"><CalendarDays size={16}/> {formatter.format(eventDate)}</span>
                    <span className="flex items-center gap-2"><Users size={16}/> Capacidad: {evt.capacity} personas</span>
                 </div>
                 
                 <div className="flex items-center justify-between mt-auto">
                    <div>
                       <p className="text-xs text-gray-400 font-bold uppercase">Entrada</p>
                       <p className="text-xl font-black">{evt.price === 0 ? "Gratis" : `$${evt.price} MXN`}</p>
                    </div>
                    <button className="bg-white text-black pl-5 pr-4 py-3 rounded-full font-black text-sm flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all">
                       Ver Acceso <ArrowRight size={16}/>
                    </button>
                 </div>
               </div>
             </div>
           );
        })}
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
