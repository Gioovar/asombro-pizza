import { PrismaClient } from "@prisma/client";
import { Bike, Navigation, MapPin, CheckCircle2, Navigation2 } from "lucide-react";

const prisma = new PrismaClient();

export default async function DriversPage() {
  const drivers = await prisma.driver.findMany({
    include: {
       orders: {
         where: { status: "ON_WAY" }
       }
    }
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black font-poppins">Flota de Repartición 🛵</h1>
        <p className="text-gray-500">Supervisa en tiempo real la disponibilidad y envíos de tus repartidores.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(driver => {
           const isBusy = driver.status === "BUSY" || driver.orders.length > 0;
           return (
             <div key={driver.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500">
                    <Bike size={28} />
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${isBusy ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {isBusy ? 'En Ruta' : 'Disponible'}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl">{driver.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{driver.vehicle} • {driver.phone}</p>
                
                {isBusy && driver.orders.length > 0 ? (
                  <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                     <Navigation2 className="text-blue-500 shrink-0" size={18} />
                     <div>
                        <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Entrega Actual</p>
                        <p className="text-sm text-blue-900 mt-1 font-medium">{driver.orders[0].address}</p>
                        <p className="text-xs text-blue-600 mt-1 font-semibold">{driver.orders[0].customerName}</p>
                     </div>
                  </div>
                ) : (
                  <div className="bg-green-50/50 border border-green-100 p-4 rounded-2xl flex items-center gap-3">
                     <MapPin className="text-green-500 shrink-0" size={18} />
                     <p className="text-sm font-medium text-green-800">Esperando en sucursal</p>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center text-sm font-medium">
                   <div className="text-gray-400">Eficiencia diaria</div>
                   <div className="flex items-center gap-1 text-black">
                     <CheckCircle2 size={16} className="text-green-500" /> 100%
                   </div>
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}
