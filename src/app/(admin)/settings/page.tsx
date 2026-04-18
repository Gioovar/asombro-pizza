"use client";

import { useEffect, useState } from "react";
import { Settings, Bot, Clock, Truck, ShieldAlert, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black font-poppins tracking-tighter italic uppercase">Configuración Global</h1>
          <p className="text-gray-500 font-medium">Controla los parámetros operativos y el cerebro de tu asistente IA.</p>
        </div>
        
        <div className="flex items-center gap-4">
           {showSuccess && (
             <div className="flex items-center gap-2 text-green-600 font-black italic text-xs animate-in slide-in-from-right-4">
                <CheckCircle2 size={16} /> ¡CAMBIOS GUARDADOS!
             </div>
           )}
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="bg-black text-white px-10 py-4 rounded-2xl font-black italic shadow-xl hover:bg-[var(--color-brand-orange)] transition-all flex items-center gap-2 uppercase active:scale-95 disabled:opacity-50"
           >
             <Save size={20} /> {isSaving ? "Guardando..." : "Guardar Cambios"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Left Column - Forms */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* AI Agent Panel */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] overflow-hidden">
               <div className="bg-black p-8 flex justify-between items-center text-white relative">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[80px] rounded-full opacity-20 -translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                        <Bot size={28} className="text-[var(--color-brand-orange)]" />
                     </div>
                     <div>
                        <h3 className="font-black text-xl italic tracking-tight font-poppins">AsombroBot (Agente IA)</h3>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">IA Conversacional & Ventas en Vivo</p>
                     </div>
                  </div>
                  
                  {/* Functional Toggle */}
                  <div 
                    onClick={() => setSettings({...settings, botEnabled: !settings.botEnabled})}
                    className={`w-14 h-8 rounded-full p-1 flex items-center transition-all cursor-pointer ${settings.botEnabled ? 'bg-[var(--color-brand-orange)] justify-end' : 'bg-neutral-800 justify-start'}`}
                  >
                     <div className="w-6 h-6 bg-white rounded-full shadow-lg"></div>
                  </div>
               </div>
               <div className="p-8">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Instrucciones de Personalidad (System Prompt)</label>
                  <textarea 
                     className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm text-gray-600 focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-orange)]/5 h-48 resize-none font-medium leading-relaxed"
                     value={settings.botPrompt}
                     onChange={(e) => setSettings({...settings, botPrompt: e.target.value})}
                  ></textarea>
                  <div className="flex items-start gap-2 mt-4 text-orange-600/60 font-bold italic text-[11px]">
                    <ShieldAlert size={14} className="shrink-0"/> 
                    <span>Nota: Cambiar el prompt afectará inmediatamente el comportamiento de ventas y recomendaciones de la IA.</span>
                  </div>
               </div>
            </div>

            {/* Delivery Cost Panel */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] p-10">
               <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                 <div className="p-3 bg-orange-50 text-[var(--color-brand-orange)] rounded-2xl">
                    <Truck size={24} />
                 </div>
                 <h3 className="font-black text-xl italic tracking-tight font-poppins uppercase">Costos Operativos</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Tarifa de Envío Fija (MXN)</label>
                    <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black italic text-gray-400">$</span>
                       <input 
                         type="number" 
                         value={settings.deliveryFee} 
                         onChange={(e) => setSettings({...settings, deliveryFee: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-5 py-4 font-black italic text-xl focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-orange)]/5" 
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Pedido Mínimo (MXN)</label>
                    <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black italic text-gray-400">$</span>
                       <input 
                         type="number" 
                         value={settings.minOrderTotal} 
                         onChange={(e) => setSettings({...settings, minOrderTotal: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-5 py-4 font-black italic text-xl focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-orange)]/5" 
                       />
                    </div>
                  </div>
               </div>
            </div>

         </div>

         {/* Right Column - Store Schedule */}
         <div className="space-y-8">
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] p-8">
               <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-50">
                 <div className="p-3 bg-black text-white rounded-2xl shadow-xl">
                    <Clock size={20} />
                 </div>
                 <h3 className="font-black text-md tracking-tighter italic uppercase font-poppins">Horarios de Sucursal</h3>
               </div>
               
               <div className="space-y-5 px-2">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, i) => (
                    <div key={day} className="flex justify-between items-center group">
                       <span className={`text-sm font-black italic uppercase tracking-tighter ${i === 6 ? "text-gray-300" : "text-gray-900"}`}>{day}</span>
                       <div className="text-right">
                          {i === 6 ? (
                            <span className="text-red-500 font-black italic text-[10px] uppercase bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">Cerrado</span>
                          ) : (
                            <span className="text-gray-500 bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black italic group-hover:bg-black group-hover:text-white transition-colors cursor-pointer">13:00 - 23:00</span>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 bg-gray-900 border border-white/5 shadow-2xl rounded-[2rem] font-black italic text-[10px] uppercase tracking-widest text-white hover:bg-[var(--color-brand-orange)] transition-all active:scale-95">
                 Modificar Horarios
               </button>
            </div>
            
            {/* Quick Status */}
            <div className="bg-[var(--color-brand-orange)] p-8 rounded-[3rem] text-white shadow-[0_20px_40px_rgba(255,90,0,0.2)]">
               <h4 className="font-black text-lg italic tracking-tighter mb-2 font-poppins">Estado de Sucursal</h4>
               <p className="text-white/80 text-xs font-medium leading-relaxed mb-6">Un cambio aquí cerrará inmediatamente el módulo de pedidos en la web y app.</p>
               <button className="bg-white text-[var(--color-brand-orange)] w-full py-4 rounded-2xl font-black italic text-xs uppercase shadow-xl">
                  PAUSAR OPERACIÓN
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
