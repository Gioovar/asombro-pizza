"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, DollarSign, Package, PieChart, Sparkles, Filter } from "lucide-react";
import Image from "next/image";
import { ProductEditorModal } from "@/components/admin/ProductEditorModal";
import { motion } from "framer-motion";

export default function MenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/admin/menu");
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Deseas retirar permanentemente este producto del catálogo curado?")) return;
    await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
    fetchMenu();
  };

  const handleNew = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const avgMargin = products.length > 0 
    ? (products.reduce((acc, p) => acc + (((p.price - p.cost) / p.price) * 100), 0) / products.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-12 pb-24">
      {/* Header Studio */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-[var(--color-brand-orange)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Inventory Curation</span>
           </div>
           <h1 className="text-5xl font-black font-poppins italic tracking-tighter uppercase leading-none">
             Product <span className="text-[var(--color-brand-orange)]">Studio</span>
           </h1>
        </div>
        
        <div className="flex gap-4">
           <button 
             onClick={handleNew}
             className="bg-black text-white px-10 py-5 rounded-[2rem] font-black italic shadow-xl hover:bg-[var(--color-brand-orange)] transition-all flex items-center gap-3 uppercase text-xs tracking-widest active:scale-95 group"
           >
             <Plus size={20} className="group-hover:rotate-90 transition-transform" /> New Master SKU
           </button>
        </div>
      </div>

      {/* Metrics Studio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Package size={60} />
            </div>
            <div className="w-16 h-16 bg-black rounded-[1.5rem] text-[var(--color-brand-orange)] flex items-center justify-center shadow-xl">
               <Package size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Catálogo Total</p>
               <p className="text-3xl font-black font-poppins italic italic tracking-tighter">{products.length} <span className="text-xs not-italic text-gray-300">Items</span></p>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-green-500">
               <PieChart size={60} />
            </div>
            <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-[1.5rem] flex items-center justify-center shadow-lg border border-green-100">
               <TrendingUp size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Margen Promedio</p>
               <p className="text-3xl font-black font-poppins italic tracking-tighter text-green-600">+{avgMargin}<span className="text-xs font-bold">%</span></p>
            </div>
         </div>

         <div className="bg-neutral-900 p-8 rounded-[3rem] shadow-2xl flex items-center gap-6 relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-[var(--color-brand-orange)]">
               <DollarSign size={60} />
            </div>
            <div className="w-16 h-16 bg-[var(--color-brand-orange)] text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-orange-500/20">
               <DollarSign size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Valor Inventario</p>
               <p className="text-3xl font-black font-poppins italic tracking-tighter text-white">MXN Asset</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[4rem] border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
           <h3 className="font-black italic uppercase tracking-tighter text-xl text-black">Master Catalog</h3>
           <div className="flex gap-4">
              <button className="p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all"><Filter size={18}/></button>
              <button className="p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all"><DollarSign size={18}/></button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                <th className="px-10 py-8">Identity</th>
                <th className="px-10 py-8">Categoría Premium</th>
                <th className="px-10 py-8 text-right">PVP Estimado</th>
                <th className="px-10 py-8 text-center">Profit Index</th>
                <th className="px-10 py-8 text-center">Status</th>
                <th className="px-10 py-8 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {products.map((product) => {
                const margin = ((product.price - product.cost) / product.price) * 100;
                const health = margin >= 60 ? 'TOP' : margin >= 40 ? 'MID' : 'LOW';

                return (
                  <tr key={product.id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative w-16 h-16 bg-neutral-900 rounded-[1.5rem] overflow-hidden flex-shrink-0 border border-white/5 shadow-2xl p-1.5 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <Image src={product.image} alt={product.name} fill className="object-contain mix-blend-screen opacity-90 p-1" />
                        </div>
                        <div>
                          <p className="font-black italic text-lg tracking-tight uppercase text-black leading-tight mb-1">{product.name}</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">SKU: {product.id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="bg-white border border-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <p className="text-[10px] text-gray-300 font-bold mb-1 opacity-60">COSM: ${product.cost.toFixed(0)}</p>
                       <p className="text-2xl font-black font-poppins italic tracking-tighter text-black">${product.price.toFixed(0)}</p>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${
                        health === 'TOP' ? 'bg-green-50 text-green-600 border-green-100 shadow-xl shadow-green-500/5' : 
                        health === 'MID' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-red-50 text-red-600 border-red-100'
                       }`}>
                         {health === 'TOP' ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                         {margin.toFixed(0)}%
                       </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <div className="flex justify-center">
                          <div className={`w-3 h-3 rounded-full ${product.active ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-gray-200'}`}></div>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-black hover:bg-white rounded-[1rem] transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[1rem] transition-all group/trash"
                          >
                            <Trash2 size={18} className="group-hover/trash:scale-110 transition-transform" />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && !loading && (
            <div className="p-32 text-center flex flex-col items-center">
               <Package size={80} className="text-gray-100 mb-6" />
               <p className="text-gray-400 font-extrabold uppercase tracking-[0.3em] text-sm">Waiting for Creation</p>
            </div>
          )}
        </div>
      </div>

      <ProductEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        product={editingProduct}
        onSave={fetchMenu}
      />
    </div>
  );
}
