import { PrismaClient } from "@prisma/client";
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, ArrowUpRight } from "lucide-react";
import { SalesChart } from "@/components/admin/SalesChart";

const prisma = new PrismaClient();

export default async function ReportsPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } }
  });

  // Aggregate mock gross for a "Monthly" view shape
  const chartMap: Record<string, number> = {
     "Lun": 0, "Mar": 0, "Mié": 0, "Jue": 0, "Vie": 0, "Sáb": 0, "Dom": 0
  };

  const days = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  
  let gross = 0;
  let netProfit = 0;
  
  orders.forEach(o => {
     chartMap[days[o.createdAt.getDay()]] += o.total;
     gross += o.total;
     
     // Calculate net profit based on cost
     let orderCost = 0;
     o.items.forEach(i => {
       orderCost += (i.product.cost * i.quantity);
     });
     netProfit += (o.total - orderCost);
  });

  const chartData = Object.keys(chartMap).map(k => ({
    time: k,
    sales: chartMap[k]
  }));

  // Top products
  const productCount: Record<string, number> = {};
  orders.forEach(o => o.items.forEach(i => {
    productCount[i.product.name] = (productCount[i.product.name] || 0) + i.quantity;
  }));
  const topProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-poppins">Reportes y Analítica 📈</h1>
        <p className="text-gray-500">Métricas avanzadas de crecimiento e histórico de operaciones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-black p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-brand-orange)] blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3 rounded-full"></div>
            <p className="text-gray-400 font-medium mb-1 flex items-center gap-2"><BarChart3 size={16}/> Facturación Bruta (Gross)</p>
            <h2 className="text-4xl font-black font-poppins mb-2">${gross.toFixed(2)}</h2>
            <p className="text-sm text-green-400 flex items-center gap-1"><ArrowUpRight size={16} /> +15.3% vs Semana pasada</p>
         </div>
         
         <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2 rounded-full"></div>
            <p className="text-gray-500 font-medium mb-1 flex items-center gap-2"><PieIcon size={16}/> Ganancia Neta Estimada (Net)</p>
            <h2 className="text-4xl font-black font-poppins mb-2">${netProfit.toFixed(2)}</h2>
            <p className="text-sm text-green-600 flex items-center gap-1"><ArrowUpRight size={16} /> Margen general saludable</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Chart Area */}
         <div className="bg-white p-6 rounded-3xl lg:col-span-2 border border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-lg font-poppins">Tendencia Semanal</h3>
               <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none">
                 <option>Esta semana</option>
                 <option>Mes pasado</option>
                 <option>Este año</option>
               </select>
            </div>
            
            <SalesChart data={chartData} />
         </div>

         {/* Top Sellers Panel */}
         <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.03)] p-6">
            <h3 className="font-bold text-lg mb-6 font-poppins flex items-center gap-2">
               <LineIcon className="text-[var(--color-brand-orange)]" size={20} /> Top Productos Vendidos
            </h3>
            
            <div className="space-y-4">
               {topProducts.map(([name, qty], idx) => (
                 <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-[var(--color-brand-orange)] text-white' : 'bg-gray-100 text-gray-500'}`}>
                         {idx + 1}
                       </span>
                       <p className="font-semibold text-sm max-w-[150px] truncate">{name}</p>
                    </div>
                    <span className="font-bold bg-gray-50 text-gray-600 px-2 py-1 rounded text-sm">{qty} pts</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
