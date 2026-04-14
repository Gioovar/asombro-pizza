import { PrismaClient } from "@prisma/client";
import { Plus, Users, Calendar, DollarSign, Activity } from "lucide-react";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export default async function EventsAdminPage() {
  const events = await prisma.event.findMany({
     orderBy: { date: "desc" },
     include: { tickets: true, reservations: true }
  });

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-10">
        <div>
           <h1 className="text-4xl font-extrabold font-poppins text-gray-900 tracking-tight">Cartelera SaaS</h1>
           <p className="text-gray-500 mt-2 text-lg">Hospitalidad y Entretenimiento (Fase 5)</p>
        </div>
        <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-xl shadow-black/20">
          <Plus size={20} /> Crear Evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
           <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4"><Calendar size={20} /></div>
           <p className="text-gray-500 text-sm font-semibold mb-1">Eventos Activos</p>
           <h3 className="text-3xl font-black">{events.filter(e => e.status === 'ACTIVE').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
           <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><Activity size={20} /></div>
           <p className="text-gray-500 text-sm font-semibold mb-1">Boletos Emitidos</p>
           <h3 className="text-3xl font-black">{events.reduce((acc, curr) => acc + curr.tickets.length, 0)}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
           <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4"><Users size={20} /></div>
           <p className="text-gray-500 text-sm font-semibold mb-1">Mesas Reservadas</p>
           <h3 className="text-3xl font-black">{events.reduce((acc, curr) => acc + curr.reservations.length, 0)}</h3>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-500 p-6 rounded-3xl shadow-lg border border-green-400 flex flex-col justify-between text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
           <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-4"><DollarSign size={20} /></div>
           <p className="text-green-100 text-sm font-semibold mb-1 relative z-10">Ingresos Ticketing</p>
           <h3 className="text-3xl font-black relative z-10">${events.reduce((acc, curr) => acc + curr.tickets.reduce((sum, tk)=>sum+tk.price, 0), 0)} MXN</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-widest">
              <th className="p-6 font-bold">Evento</th>
              <th className="p-6 font-bold">Fecha</th>
              <th className="p-6 font-bold text-center">Boletos (Aforo)</th>
              <th className="p-6 font-bold text-center">Mesas (Resv)</th>
              <th className="p-6 font-bold text-right">Recaudación</th>
              <th className="p-6 font-bold text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {events.length === 0 ? (
               <tr><td colSpan={6} className="p-10 text-center text-gray-400">Sin eventos en la base de datos (La PWA mostrará los Mock-ups simulados hasta crear uno aquí)</td></tr>
            ) : (
               events.map((evt) => {
                  const ticketsSold = evt.tickets.length;
                  const revenue = evt.tickets.reduce((sum, tk)=>sum+tk.price, 0);
                  const occupancyRatio = (ticketsSold / evt.capacity) * 100;
                  
                  return (
                     <tr key={evt.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                        <td className="p-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative flex-shrink-0">
                                 {/* eslint-disable-next-line @next/next/no-img-element */}
                                 <img src={evt.imageUrl} alt={evt.title} className="object-cover w-full h-full" />
                              </div>
                              <div>
                                 <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{evt.title}</p>
                                 <p className="text-xs text-gray-500 max-w-[200px] truncate">{evt.category} - {evt.price === 0 ? 'GRATIS' : `$${evt.price} c/u`}</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-6 text-gray-600 font-medium">
                           {evt.date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric'})}
                        </td>
                        <td className="p-6 text-center">
                           <p className="font-black text-gray-900">{ticketsSold}</p>
                           <p className={`text-xs font-bold ${occupancyRatio > 80 ? 'text-red-500' : 'text-green-500'}`}>{occupancyRatio.toFixed(0)}% ocup.</p>
                        </td>
                        <td className="p-6 text-center text-gray-600 font-bold">
                           {evt.reservations.length}
                        </td>
                        <td className="p-6 text-right font-black text-green-600">
                           ${revenue} MXN
                        </td>
                        <td className="p-6 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${evt.status==='ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {evt.status==='ACTIVE' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                              {evt.status}
                           </span>
                        </td>
                     </tr>
                  )
               })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
