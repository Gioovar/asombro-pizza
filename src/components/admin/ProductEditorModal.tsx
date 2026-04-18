"use client";

import { useState, useEffect } from "react";
import { X, Save, Trash2, AlertCircle, Info, Zap, Sparkles, Code, DollarSign, Image as ImageIcon, PieChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductEditorModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ProductEditorModal({ product, isOpen, onClose, onSave }: ProductEditorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    category: "Pizzas — Especialidades",
    price: "",
    cost: "",
    config: "",
    active: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        image: product.image || "",
        category: product.category || "Pizzas — Especialidades",
        price: product.price?.toString() || "",
        cost: product.cost?.toString() || "",
        config: product.config || "",
        active: product.active ?? true
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
        category: "Pizzas — Especialidades",
        price: "",
        cost: "",
        config: "",
        active: true
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const url = "/api/admin/menu";
      const method = product?.id ? "PATCH" : "POST";
      const data = product?.id ? { ...formData, id: product.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Error al guardar el producto");

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateMargin = () => {
    const price = parseFloat(formData.price || "0");
    const cost = parseFloat(formData.cost || "0");
    if (!price || !cost || price <= 0) return 0;
    return ((price - cost) / price) * 100;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/10"
      >
        <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <Sparkles size={80} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Zap size={14} className="text-[var(--color-brand-orange)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">SKU Editor Pro</span>
            </div>
            <h2 className="text-3xl font-black font-poppins italic tracking-tighter uppercase leading-none">
               {product ? "Edit Master SKU" : "Register New Asset"}
            </h2>
          </div>
          <button onClick={onClose} className="p-3 bg-white text-gray-400 hover:text-black rounded-2xl transition-all shadow-xl hover:scale-110 active:scale-95">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Column: Visual & Commercial */}
            <div className="space-y-10">
              <div className="relative group">
                 <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-3 ml-2">Product Name</label>
                 <input 
                   required
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full px-8 py-6 bg-gray-50/80 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-[var(--color-brand-orange)]/5 focus:border-[var(--color-brand-orange)] outline-none font-black italic text-xl tracking-tight transition-all placeholder:text-gray-200"
                   placeholder="Ex: Brooklyn Double Meat"
                 />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-3 ml-2">Gourmet Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-8 py-6 bg-gray-50/80 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-[var(--color-brand-orange)]/5 focus:border-[var(--color-brand-orange)] outline-none font-medium text-sm leading-relaxed transition-all placeholder:text-gray-200"
                  placeholder="Describe the artisan process..."
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="bg-neutral-900 rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-white/40 mb-4">Retail Price ($)</label>
                    <div className="flex items-center gap-2">
                       <DollarSign size={20} className="text-[var(--color-brand-orange)]" />
                       <input 
                        required
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="bg-transparent text-white w-full outline-none font-black italic text-3xl tracking-tighter"
                      />
                    </div>
                 </div>
                 <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 relative group">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Base Cost ($)</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={e => setFormData({...formData, cost: e.target.value})}
                      className="bg-transparent text-black w-full outline-none font-black italic text-3xl tracking-tighter"
                    />
                 </div>
              </div>

              <div className="flex items-center justify-between px-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                       <PieChart size={18} className="text-[var(--color-brand-orange)]" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Expected Asset Margin</p>
                       <p className="text-sm font-black italic">Profitability Index</p>
                    </div>
                 </div>
                 <span className={`text-4xl font-black italic tracking-tighter ${calculateMargin() > 60 ? 'text-green-600' : 'text-orange-600'}`}>
                    {calculateMargin().toFixed(1)}%
                 </span>
              </div>
            </div>

            {/* Right Column: Assets & Configuration */}
            <div className="space-y-10">
              <div className="space-y-4">
                 <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 ml-2">Visual Asset</label>
                 <div className="flex gap-4">
                    <div className="flex-1">
                       <input 
                         required
                         value={formData.image}
                         onChange={e => setFormData({...formData, image: e.target.value})}
                         className="w-full px-8 py-5 bg-gray-50/80 border border-gray-100 rounded-[1.5rem] outline-none font-medium text-xs truncate"
                         placeholder="https://image-cloud..."
                       />
                    </div>
                    <div className="w-20 h-[58px] bg-black rounded-[1.5rem] overflow-hidden border border-white/5 flex items-center justify-center p-1 shadow-2xl">
                       {formData.image ? <img src={formData.image} className="w-full h-full object-contain mix-blend-screen opacity-90" alt="UI Prep" /> : <ImageIcon size={20} className="text-white/20"/>}
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center ml-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Technical Config (JSON)</label>
                    <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1 rounded-full border border-white/5">
                       <Code size={12} className="text-green-400" />
                       <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Compiler Mode</span>
                    </div>
                 </div>
                 <textarea 
                   rows={10}
                   value={formData.config}
                   onChange={e => setFormData({...formData, config: e.target.value})}
                   className="w-full px-8 py-6 bg-neutral-900 text-green-400 font-mono text-xs rounded-[2rem] outline-none focus:ring-4 focus:ring-green-500/5 shadow-2xl border border-white/5 border-l-4 border-l-green-500/50"
                   placeholder='{"options": [...] }'
                 />
              </div>

              <div className="flex items-center justify-between bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                 <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full transition-all duration-500 ${formData.active ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-700">Visibilidad del Catálogo</span>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                       type="checkbox"
                       checked={formData.active}
                       onChange={e => setFormData({...formData, active: e.target.checked})}
                       className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--color-brand-orange)] shadow-inner"></div>
                 </label>
              </div>
            </div>
          </div>

          {error && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-12 p-6 bg-red-50 text-red-600 rounded-[2rem] flex items-center gap-4 text-sm font-black italic tracking-tight border border-red-100"
            >
               <AlertCircle size={24} /> {error}
            </motion.div>
          )}
        </form>

        <div className="p-10 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-6">
           <button 
             onClick={onClose}
             className="px-8 py-5 rounded-[1.5rem] text-xs font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-[0.2em]"
           >
              Cancelar
           </button>
           <button 
             onClick={handleSubmit}
             disabled={isSaving}
             className="bg-black text-white px-14 py-5 rounded-[2rem] text-xs font-black italic shadow-2xl hover:bg-[var(--color-brand-orange)] transition-all flex items-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em] group"
           >
              {isSaving ? "Publishing Catalog..." : "Save Master SKU"}
              <Save size={20} className="group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </motion.div>
    </div>
  );
}
