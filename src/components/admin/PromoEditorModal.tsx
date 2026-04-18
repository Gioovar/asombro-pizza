"use client";

import { useState, useEffect } from "react";
import { X, Save, Calendar, Tag, Percent, Banknote, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface PromoEditorModalProps {
  promo: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function PromoEditorModal({ promo, isOpen, onClose, onSave }: PromoEditorModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    discount: "",
    type: "PERCENTAGE",
    expiresAt: "",
    active: true,
    badgeText: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (promo) {
      setFormData({
        title: promo.title || "",
        code: promo.code || "",
        description: promo.description || "",
        discount: promo.discount?.toString() || "",
        type: promo.type || "PERCENTAGE",
        expiresAt: promo.expiresAt ? new Date(promo.expiresAt).toISOString().split('T')[0] : "",
        active: promo.active ?? true,
        badgeText: promo.badgeText || ""
      });
    } else {
      setFormData({
        title: "",
        code: "",
        description: "",
        discount: "",
        type: "PERCENTAGE",
        expiresAt: "",
        active: true,
        badgeText: ""
      });
    }
  }, [promo, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const url = "/api/admin/promos";
      const method = promo?.id ? "PATCH" : "POST";
      const data = promo?.id ? { ...formData, id: promo.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Error al guardar la promoción");

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
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black font-poppins italic tracking-tight uppercase">
              {promo ? "Editar Promoción" : "Nueva Promoción"}
            </h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Estrategia de fidelización y cupones</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Título de la Promo</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                placeholder="Ej: Descuento de Inauguración"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Código del Cupón</label>
              <div className="relative">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-black italic text-orange-600"
                  placeholder="ASOMBRO20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tipo de Descuento</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold appearance-none cursor-pointer"
              >
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FLAT">Monto Fijo ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Valor del Descuento</label>
              <div className="relative">
                {formData.type === "PERCENTAGE" ? (
                  <Percent className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                ) : (
                  <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                )}
                <input 
                  required
                  type="number"
                  value={formData.discount}
                  onChange={e => setFormData({...formData, discount: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-black italic"
                  placeholder="20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Fecha de Expiración</label>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="date"
                  value={formData.expiresAt}
                  onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Descripción (Para el cliente)</label>
              <textarea 
                required
                rows={2}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-sm"
                placeholder="Ej: 20% de descuento en tu primera pizza especial."
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-3">
                 <input 
                    type="checkbox"
                    id="promo-active"
                    checked={formData.active}
                    onChange={e => setFormData({...formData, active: e.target.checked})}
                    className="w-5 h-5 accent-[var(--color-brand-orange)] rounded-lg"
                 />
                 <label htmlFor="promo-active" className="text-sm font-bold text-gray-700">Promo Activa</label>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
               <AlertCircle size={18} /> {error}
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
              {isSaving ? "Guardando..." : "Guardar Promoción"}
              <Save size={18} />
           </button>
        </div>
      </motion.div>
    </div>
  );
}
