import { PrismaClient } from "@prisma/client";
import { Settings, Bot, Clock, Truck, ShieldAlert, Save } from "lucide-react";

const prisma = new PrismaClient();

export default async function SettingsPage() {
  // Try to find existing settings or mock default if none
  let settings = await prisma.storeSettings.findFirst();
  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: { id: "default" }
    });
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black font-poppins">Configuración Global ⚙️</h1>
          <p className="text-gray-500">Maneja el comportamiento del negocio y la IA Asistente.</p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
          <Save size={20} /> Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column - Forms */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* AI Agent Panel */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 p-6 flex justify-between items-center text-white">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <Bot size={24} className="text-indigo-200" />
                     </div>
                     <div>
                        <h3 className="font-bold text-lg leading-tight">AsombroBot (Agente IA)</h3>
                        <p className="text-indigo-200 text-sm">Gestiona consultas de la Landing Page</p>
                     </div>
                  </div>
                  {/* Fake UI Toggle */}
                  <div className={`w-14 h-8 rounded-full border-2 p-1 flex items-center transition-colors cursor-pointer ${settings.botEnabled ? 'bg-green-500 border-green-500 justify-end' : 'bg-gray-400 border-gray-400 justify-start'}`}>
                     <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                  </div>
               </div>
               <div className="p-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Comportamiento del Prompt (System Instruction)</label>
                  <textarea 
                     className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                     defaultValue={settings.botPrompt}
                  ></textarea>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><ShieldAlert size={14}/> Advierte al bot sobre ventas fuera de zona de entrega.</p>
               </div>
            </div>

            {/* Delivery Cost Panel */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
               <div className="flex items-center gap-3 mb-6">
                 <Truck className="text-gray-400" size={24} />
                 <h3 className="font-bold text-lg">Costos Operativos</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tarifa de Envío Fija (MXN)</label>
                    <input type="number" defaultValue={settings.deliveryFee} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-[var(--color-brand-orange)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pedido Mínimo (MXN)</label>
                    <input type="number" defaultValue={settings.minOrderTotal} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-[var(--color-brand-orange)]" />
                  </div>
               </div>
            </div>

         </div>

         {/* Right Column - Store Schedule */}
         <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
               <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                 <Clock className="text-gray-400" size={20} />
                 <h3 className="font-bold text-md">Horarios de Sucursal</h3>
               </div>
               
               <div className="space-y-4 text-sm font-medium">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, i) => (
                    <div key={day} className="flex justify-between items-center">
                       <span className={i === 6 ? "text-gray-400" : "text-gray-900"}>{day}</span>
                       {i === 6 ? (
                         <span className="text-red-500 font-bold text-xs uppercase bg-red-50 px-2 py-1 rounded">Cerrado</span>
                       ) : (
                         <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">11:00 AM - 11:00 PM</span>
                       )}
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">Modificar Horarios</button>
            </div>
         </div>
      </div>
    </div>
  );
}
