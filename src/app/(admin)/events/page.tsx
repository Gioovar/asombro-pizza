"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Calendar, DollarSign, Activity, Edit2, Trash2, MapPin, Sparkles } from "lucide-react";
import { EventEditorModal } from "@/components/admin/EventEditorModal";

export default function EventsAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de cancelar y eliminar este evento?")) return;
    await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
    fetchEvents();
  };

  const handleNew = () => {
    setEditingEvent(null);
    setIsEditorOpen(true);
  };

  // Metrics calculation
  const totalRevenue = events.reduce((acc, curr) => acc + (curr.tickets?.reduce((sum: number, tk: any) => sum + tk.price, 0) || 0), 0);
  const totalTickets = events.reduce((acc, curr) => acc + (curr.tickets?.length || 0), 0);
  const totalReservations = events.reduce((acc, curr) => acc + (curr.reservations?.length || 0), 0);
  const activeEvents = events.filter(e => e.status === 'ACTIVE').length;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-poppins tracking-tighter italic uppercase">Hospitalidad & Experiencias</h1>
          <p className="text-gray-500 font-medium tracking-tight">Gestiona la cartelera de entretenimiento, boletos y reservaciones VIP.</p>
        </div>
        <button 
          onClick={handleNew}
          className="bg-black text-white px-8 py-4 rounded-2xl font-black italic shadow-xl hover:bg-[var(--color-brand-orange)] transition-all flex items-center gap-2 uppercase active:scale-95"
        >
          <Plus size={20} /> Programar Show
        </button>
      </div>

      {/* Premium Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Corte de Caja (Boletos)" value={`$${totalRevenue}`} icon={DollarSign} color="text-green-600 bg-green-50" />
        <MetricCard title="Boletos Emitidos" value={totalTickets.toString()} icon={Activity} color="text-blue-600 bg-blue-50" />
        <MetricCard title="Mesas Reservadas" value={totalReservations.toString()} icon={Users} color="text-orange-600 bg-orange-50" />
        <MetricCard title="Shows Activos" value={activeEvents.toString()} icon={Calendar} color="text-purple-600 bg-purple-50" />
      </div>

      {/* Main Events Grid / Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-6">Experiencia</th>
                <th className="px-8 py-6">Fecha & Lugar</th>
                <th className="px-8 py-6 text-center">Aforo / Boletos</th>
                <th className="px-8 py-6 text-right">Recaudación</th>
                <th className="px-8 py-6 text-center">Estado</th>
                <th className="px-8 py-6 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <Sparkles size={40} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Aún no hay eventos programados en la cartelera</p>
                  </td>
                </tr>
              )}
              {events.map((evt) => {
                const ticketsSold = evt.tickets?.length || 0;
                const revenue = evt.tickets?.reduce((sum: number, tk: any) => sum + tk.price, 0) || 0;
                const occupancyRatio = (ticketsSold / evt.capacity) * 100;

                return (
                  <tr key={evt.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-14 rounded-2xl bg-neutral-900 border border-white/5 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                           <img src={evt.imageUrl} alt={evt.title} className="object-cover w-full h-full opacity-80" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                           <span className="absolute bottom-1 left-2 text-[8px] font-black text-white uppercase italic tracking-tighter">{evt.category}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight mb-0.5">{evt.title}</p>
                          <p className="text-xs font-bold text-gray-400 italic">{evt.price === 0 ? 'ACCESO LIBRE' : `$${evt.price} / BOLETO`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-black text-gray-900 italic uppercase">
                         {new Date(evt.date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}
                       </p>
                       <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                          <MapPin size={10} /> Main House (NYC Style)
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="inline-block text-center">
                          <p className="text-lg font-black font-poppins text-gray-900 leading-none mb-1">{ticketsSold} / {evt.capacity}</p>
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mx-auto">
                             <div 
                                className={`h-full transition-all duration-1000 ${occupancyRatio > 80 ? 'bg-red-500' : 'bg-[var(--color-brand-orange)]'}`}
                                style={{ width: `${Math.min(occupancyRatio, 100)}%` }}
                             ></div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-xl italic font-poppins text-gray-900">
                       ${revenue}
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black italic uppercase tracking-widest inline-flex items-center gap-1.5 ${evt.status==='ACTIVE' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-400'}`}>
                          {evt.status==='ACTIVE' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                          {evt.status === 'ACTIVE' ? 'ACTIVO' : evt.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(evt)}
                            className="p-3 text-gray-400 hover:text-black hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(evt.id)}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EventEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        event={editingEvent}
        onSave={fetchEvents}
      />
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.05)] transition-all">
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${color}`}>
          <Icon size={24} />
       </div>
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
       <h3 className="text-3xl font-black font-poppins italic tracking-tighter text-gray-900 uppercase">
         {value} <span className="text-xs text-gray-300 font-bold not-italic">Totales</span>
       </h3>
    </div>
  );
}
