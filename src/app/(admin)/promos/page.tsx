import { PrismaClient } from "@prisma/client";
import { Plus, Tag, Percent, Banknote, Calendar } from "lucide-react";

const prisma = new PrismaClient();

export default async function PromosPage() {
  const promos = await prisma.promo.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-poppins">Cupones y Promociones 🎟️</h1>
          <p className="text-gray-500">Crea estrategias de retención y descuentos para tus clientes.</p>
        </div>
        <button className="bg-[var(--color-brand-orange)] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e65100] transition-colors shadow-lg shadow-orange-500/20">
          <Plus size={20} /> Nuevo Cupón
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Static default promo card layout for aesthetics */}
         {promos.length === 0 && (
           <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-dashed border-gray-300">
              <Tag size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-bold text-gray-500 mb-1">No hay promociones activas</h3>
              <p className="text-sm text-gray-400">Lanza un cupón de 20% OFF para reactivar a tus clientes.</p>
           </div>
         )}

         {promos.map(promo => (
            <div key={promo.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_5px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
               {/* Decorative Circle */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[80px] opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:opacity-20 transition-opacity"></div>
               
               <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="bg-orange-50 border border-orange-100 text-orange-600 px-4 py-1.5 rounded-full font-black tracking-widest uppercase flex items-center gap-2 text-sm shadow-sm">
                     <Tag size={14} /> {promo.code}
                  </div>
                  <span className={`w-3 h-3 rounded-full ${promo.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
               </div>
               
               <h3 className="font-bold text-2xl mb-1 relative z-10 flex items-center gap-2">
                 {promo.type === "PERCENTAGE" ? <Percent size={20} className="text-gray-400" /> : <Banknote size={20} className="text-gray-400" />}
                 {promo.type === "PERCENTAGE" ? `${promo.discount}% OFF` : `-$${promo.discount} MXN`}
               </h3>
               
               <p className="text-gray-500 text-sm mb-6 relative z-10">{promo.description}</p>
               
               <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-semibold text-gray-400 relative z-10">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {promo.expiresAt ? `Expira: ${new Date(promo.expiresAt).toLocaleDateString()}` : "Sin caducidad"}
                  </div>
                  <button className="text-[var(--color-brand-orange)] hover:underline">Editar</button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
