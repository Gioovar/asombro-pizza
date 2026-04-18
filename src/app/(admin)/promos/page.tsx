"use client";

import { useEffect, useState } from "react";
import { Plus, Tag, Percent, Banknote, Calendar, Trash2, Edit2, AlertCircle } from "lucide-react";
import { PromoEditorModal } from "@/components/admin/PromoEditorModal";

export default function PromosPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any | null>(null);

  const fetchPromos = async () => {
    try {
      const res = await fetch("/api/admin/promos");
      const data = await res.json();
      if (Array.isArray(data)) setPromos(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleEdit = (promo: any) => {
    setEditingPromo(promo);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta promoción?")) return;
    await fetch(`/api/admin/promos?id=${id}`, { method: "DELETE" });
    fetchPromos();
  };

  const handleNew = () => {
    setEditingPromo(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-poppins tracking-tighter italic uppercase">Cupones y Ofertas</h1>
          <p className="text-gray-500 font-medium">Gestiona estrategias de retención y activaciones comerciales Premium.</p>
        </div>
        <button 
          onClick={handleNew}
          className="bg-black text-white px-8 py-4 rounded-2xl font-black italic shadow-xl hover:bg-[var(--color-brand-orange)] transition-all flex items-center gap-2 uppercase active:scale-95"
        >
          <Plus size={20} /> Nueva Promo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {promos.length === 0 && !loading && (
            <div className="col-span-full bg-white p-20 text-center rounded-[3rem] border-2 border-dashed border-gray-100">
               <Tag size={48} className="mx-auto text-gray-200 mb-4" />
               <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No hay promociones activas todavía</p>
            </div>
         )}

         {promos.map(promo => (
            <div key={promo.id} className="group relative bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all">
               {/* Premium Glow Overlay */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[60px] opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:opacity-20 transition-opacity"></div>
               
               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="bg-black text-[var(--color-brand-orange)] px-5 py-2 rounded-2xl font-black tracking-widest uppercase flex items-center gap-2 text-xs shadow-xl border border-white/5">
                     <Tag size={14} /> {promo.code}
                  </div>
                  <div className="flex items-center gap-2">
                     <span className={`w-2.5 h-2.5 rounded-full ${promo.active ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`}></span>
                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">{promo.active ? 'Activo' : 'Pausado'}</span>
                  </div>
               </div>
               
               <div className="mb-6 relative z-10">
                  <h3 className="font-black text-4xl tracking-tighter italic mb-2 text-gray-900 flex items-baseline gap-2">
                    {promo.discount}
                    <span className="text-xl not-italic uppercase text-gray-400">{promo.type === "PERCENTAGE" ? "% OFF" : "MXN"}</span>
                  </h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{promo.description}</p>
               </div>
               
               <div className="pt-6 border-t border-gray-50 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300 italic">
                    <Calendar size={14} />
                    {promo.expiresAt ? `Expira: ${new Date(promo.expiresAt).toLocaleDateString()}` : "Ilimitado"}
                  </div>
                  
                  <div className="flex gap-1">
                     <button 
                        onClick={() => handleEdit(promo)}
                        className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                     >
                        <Edit2 size={16} />
                     </button>
                     <button 
                        onClick={() => handleDelete(promo.id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      <PromoEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        promo={editingPromo}
        onSave={fetchPromos}
      />
    </div>
  );
}
