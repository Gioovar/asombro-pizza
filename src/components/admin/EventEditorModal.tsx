"use client";

import { useState, useEffect } from "react";
import { X, Save, Calendar, Users, DollarSign, Camera, Music, PartyPopper, Mic2 } from "lucide-react";
import { motion } from "framer-motion";

interface EventEditorModalProps {
  event: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EventEditorModal({ event, isOpen, onClose, onSave }: EventEditorModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    date: "",
    capacity: "",
    price: "",
    category: "Fiesta",
    status: "ACTIVE"
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        imageUrl: event.imageUrl || "",
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
        capacity: event.capacity?.toString() || "",
        price: event.price?.toString() || "",
        category: event.category || "Fiesta",
        status: event.status || "ACTIVE"
      });
    } else {
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        date: "",
        capacity: "",
        price: "",
        category: "Fiesta",
        status: "ACTIVE"
      });
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const url = "/api/admin/events";
      const method = event?.id ? "PATCH" : "POST";
      const data = event?.id ? { ...formData, id: event.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Error al guardar el evento");

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black font-poppins italic tracking-tight uppercase">
              {event ? "Editar Evento" : "Nueva Experiencia"}
            </h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Gestión de Hospitalidad y Entretenimiento</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Título del Evento / Show</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold placeholder:text-gray-300"
                placeholder="Ej: Noche de Jazz & Pizza"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Categoría</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer"
              >
                <option value="Fiesta">🎸 Música en Vivo</option>
                <option value="Fiesta">🔥 Fiesta / DJ Set</option>
                <option value="Stand-up">🎤 Stand-up Comedy</option>
                <option value="Gastronomía">🍕 Cata / Gastronomía</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Fecha del Evento</label>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Aforo Máximo (Personas)</label>
              <div className="relative">
                <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-black italic"
                  placeholder="50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Precio de Boleto ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-black italic text-green-600"
                  placeholder="0 (Si es entrada libre)"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">URL del Banner / Cartelera</label>
              <div className="relative">
                 <Camera className="absolute left-5 top-9 text-gray-400" size={18} />
                 <input 
                    required
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-xs mt-2"
                    placeholder="https://images.unsplash.com/..."
                 />
              </div>
              {formData.imageUrl && (
                 <div className="mt-4 h-40 bg-gray-100 rounded-[2rem] overflow-hidden border border-gray-100 group relative">
                    <img src={formData.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                    <div className="absolute inset-0 bg-black/10"></div>
                 </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Descripción de la Experiencia</label>
              <textarea 
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
                placeholder="Cuéntale al cliente de qué trata el evento..."
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
               <X size={18} /> {error}
            </div>
          )}
        </form>

        <div className="p-8 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-4">
           <button onClick={onClose} className="px-8 py-4 rounded-2xl text-sm font-black text-gray-400 uppercase">Cancelar</button>
           <button 
             onClick={handleSubmit} 
             disabled={isSaving}
             className="bg-black text-white px-10 py-4 rounded-2xl text-sm font-black italic shadow-xl hover:bg-[var(--color-brand-orange)] transition-all flex items-center gap-2 disabled:opacity-50 uppercase"
           >
              {isSaving ? "Programando..." : "Guardar Evento"}
              <Save size={18} />
           </button>
        </div>
      </motion.div>
    </div>
  );
}
