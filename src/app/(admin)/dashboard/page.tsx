import { PrismaClient } from "@prisma/client";
import { SalesChart } from "@/components/admin/SalesChart";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const todayStart = startOfDay(new Date());
  
  // Real database metrics
  const todayOrders = await prisma.order.findMany({
    where: { createdAt: { gte: todayStart } },
    include: { items: { include: { product: true } } }
  });

  const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = todayOrders.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const activeOrders = todayOrders.filter(
    o => o.status === "NEW" || o.status === "PREPARING" || o.status === "READY" || o.status === "ON_WAY"
  ).length;

  // Most sold logic
  const productCount: Record<string, number> = {};
  todayOrders.forEach(o => o.items.forEach(i => {
    productCount[i.product.name] = (productCount[i.product.name] || 0) + i.quantity;
  }));
  const topProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "Ninguno hoy";

  // Chart data aggregation (hour by hour)
  const chartMap: Record<number, number> = {};
  for (let i = 8; i <= 23; i++) chartMap[i] = 0; // hours 8am to 11pm
  
  todayOrders.forEach(o => {
    const hour = o.createdAt.getHours();
    if (chartMap[hour] !== undefined) chartMap[hour] += o.total;
  });

  const chartData = Object.keys(chartMap).map(h => ({
    time: `${h}:00`,
    sales: chartMap[Number(h)]
  }));

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Snippet */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-poppins">Bienvenido al Admin 👋</h1>
          <p className="text-gray-500">Aquí tienes un resumen de la operación de hoy, {format(new Date(), "dd/MM/yyyy")}.</p>
        </div>
        <div className="bg-[var(--color-brand-marble)]/50 border border-[var(--color-brand-orange)]/20 text-[var(--color-brand-orange)] px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
          <Sparkles size={18} /> Asombro Pro Plan
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Ingresos del Día" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} trend="+12% vs ayer" />
        <MetricCard title="Pedidos Hoy" value={totalOrders.toString()} icon={ShoppingBag} trend="+4% vs ayer" />
        <MetricCard title="Ticket Promedio" value={`$${avgTicket.toFixed(2)}`} icon={TrendingUp} />
        <MetricCard title="Pedidos Activos" value={activeOrders.toString()} icon={Clock} highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="bg-white p-6 rounded-3xl lg:col-span-2 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-1 font-poppins">Ventas por Hora</h3>
          <p className="text-sm text-gray-500 mb-6">Comportamiento en vivo de la facturación</p>
          <SalesChart data={chartData} />
        </div>

        {/* AI Insights & Alerts */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-black to-gray-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] blur-[80px] rounded-full opacity-50 -translate-y-1/2 translate-x-1/2" />
             
             <div className="flex items-center gap-2 text-[var(--color-brand-orange)] mb-4">
               <Sparkles size={20} />
               <h3 className="font-bold font-poppins text-sm uppercase tracking-wider">AI Insights</h3>
             </div>
             
             <div className="space-y-4">
               <div>
                 <p className="text-gray-400 text-sm">Top Ventas Hoy</p>
                 <p className="font-semibold text-lg">{topProduct}</p>
               </div>
               <div className="h-px bg-gray-800" />
               <div>
                 <p className="text-gray-400 text-sm">Sugerencia Operativa</p>
                 <p className="font-medium text-sm leading-relaxed mt-1 text-gray-200">
                   El tráfico a las 20:00h subirá agresivamente. Anticipa la preparación de bases de masa para agilizar los tiempos.
                 </p>
               </div>
             </div>
           </div>

           <div className="bg-white border border-[var(--color-brand-orange)]/20 p-6 rounded-3xl flex items-start gap-4 shadow-[0_10px_30px_rgba(255,90,0,0.05)]">
             <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
               <AlertCircle size={24} />
             </div>
             <div>
                <h4 className="font-bold text-red-500">Masa baja en stock</h4>
                <p className="text-sm text-gray-600 mt-1">El inventario estimado para el cierre de hoy requerirá un último bache a las 18:00h.</p>
             </div>
           </div>
        </div>
      </div>
      
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, highlight }: { title: string, value: string, icon: any, trend?: string, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-3xl border transition-shadow hover:shadow-lg ${highlight ? 'bg-[var(--color-brand-orange)] text-white border-transparent shadow-[0_10px_30px_rgba(255,90,0,0.2)]' : 'bg-white border-gray-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${highlight ? 'bg-white/20' : 'bg-gray-50 text-gray-600'}`}>
           <Icon size={20} />
        </div>
        {trend && (
           <span className={`text-xs font-semibold px-2 py-1 rounded-full ${highlight ? 'bg-white/20 text-white' : 'bg-green-50 text-green-600'}`}>
             {trend}
           </span>
        )}
      </div>
      <p className={`text-sm font-medium ${highlight ? 'text-white/80' : 'text-gray-500'}`}>{title}</p>
      <h3 className="text-3xl font-black font-poppins mt-1">{value}</h3>
    </div>
  );
}
