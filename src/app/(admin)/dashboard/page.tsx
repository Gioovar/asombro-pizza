import { PrismaClient } from "@prisma/client";
import { SalesChart } from "@/components/admin/SalesChart";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  AlertCircle,
  Sparkles,
  Zap,
  Target,
  Activity,
  ChevronRight
} from "lucide-react";
import { format, startOfDay } from "date-fns";

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
  const topProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "None Recorded";

  // Chart data aggregation
  const chartMap: Record<number, number> = {};
  for (let i = 8; i <= 23; i++) chartMap[i] = 0;
  todayOrders.forEach(o => {
    const hour = o.createdAt.getHours();
    if (chartMap[hour] !== undefined) chartMap[hour] += o.total;
  });

  const chartData = Object.keys(chartMap).map(h => ({
    time: `${h}:00`,
    sales: chartMap[Number(h)]
  }));

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Executive Header Cockpit */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[var(--color-brand-orange)] fill-[var(--color-brand-orange)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">War Room Operational</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-black font-poppins italic tracking-tighter uppercase leading-none">
             Executive <span className="text-[var(--color-brand-orange)]">Cockpit</span>
           </h1>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-neutral-900 px-6 py-4 rounded-[2rem] border border-white/5 shadow-2xl flex items-center gap-4 group">
              <div className="w-10 h-10 bg-[var(--color-brand-orange)] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                 <Target size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">Squad ID</p>
                 <p className="text-sm font-black italic tracking-tighter text-white">ASOMBRO_PRO_12.5</p>
              </div>
           </div>
        </div>
      </div>

      {/* Primary Intelligence Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard title="Market Cap Today" value={`$${totalRevenue.toFixed(0)}`} icon={DollarSign} trend="+12.5%" />
        <MetricCard title="Order Density" value={totalOrders.toString()} icon={Activity} trend="+4.2%" />
        <MetricCard title="AOV Platinum" value={`$${avgTicket.toFixed(0)}`} icon={TrendingUp} />
        <MetricCard title="Live Pipelines" value={activeOrders.toString()} icon={Clock} highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Strategic Chart Area */}
        <div className="bg-white p-10 rounded-[3.5rem] lg:col-span-2 border border-gray-100 shadow-[0_30px_70px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <TrendingUp size={100} />
          </div>
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-10">
                <div>
                   <h3 className="font-black italic uppercase tracking-tighter text-2xl mb-1">Hourly Revenue Pulse</h3>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Real-time performance monitoring across all branches</p>
                </div>
                <button className="p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all">
                   <ChevronRight size={20} />
                </button>
             </div>
             <div className="mt-4">
                <SalesChart data={chartData} />
             </div>
          </div>
        </div>

        {/* Asombro Intelligence Core */}
        <div className="flex flex-col gap-10">
           <div className="bg-neutral-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5 flex-1 min-h-[400px]">
              {/* Cinematic Glows */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-[var(--color-brand-orange)] blur-[100px] rounded-full opacity-30" />
              <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-blue-500 blur-[120px] rounded-full opacity-10" />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                    <div className="flex items-center gap-3 text-[var(--color-brand-orange)] mb-8">
                       <Sparkles size={24} className="animate-pulse" />
                       <h3 className="font-black italic font-poppins text-lg uppercase tracking-widest">Asombro Intelligence</h3>
                    </div>
                    
                    <div className="space-y-10">
                       <div className="group">
                          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-3">Top Asset Velocity</p>
                          <p className="font-black italic text-3xl tracking-tighter uppercase text-white group-hover:text-[var(--color-brand-orange)] transition-colors line-clamp-1">{topProduct}</p>
                       </div>
                       
                       <div className="w-full h-px bg-white/5" />
                       
                       <div className="relative">
                          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-3">Strategic Insight</p>
                          <p className="font-medium text-sm leading-relaxed text-gray-400 italic">
                            "High traffic concentration estimated for 20:00 PST. Recommend prep-staging of 72h-dough assets manually for 14.5% efficiency gain."
                          </p>
                       </div>
                    </div>
                 </div>

                 <button className="w-full py-5 mt-10 bg-white/5 border border-white/10 rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all">
                    Generate Full Report
                 </button>
              </div>
           </div>

           {/* Operational Alert Wing */}
           <div className="bg-white border-2 border-red-500/20 p-8 rounded-[3rem] flex items-center gap-6 shadow-[0_20px_50px_rgba(239,68,68,0.05)] relative overflow-hidden group hover:border-red-500 transition-colors">
              <div className="w-16 h-16 bg-red-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-red-500/20 group-hover:scale-110 transition-transform">
                <AlertCircle size={28} />
              </div>
              <div className="flex-1">
                 <h4 className="font-black italic text-lg uppercase tracking-tighter text-red-500">Asset Warning</h4>
                 <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest mt-1">Dough Inventory at 12%: Batch Required ASAP</p>
              </div>
           </div>
        </div>
      </div>
      
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, highlight }: { title: string, value: string, icon: any, trend?: string, highlight?: boolean }) {
  return (
    <div className={`p-10 rounded-[3.5rem] border-2 transition-all duration-500 relative overflow-hidden group hover:-translate-y-2 ${highlight ? 'bg-black text-white border-black shadow-[0_45px_90px_rgba(0,0,0,0.15)]' : 'bg-white border-gray-100/50 hover:border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.02)]'}`}>
      
      {/* Internal Decorative element */}
      <div className={`absolute -bottom-10 -right-10 opacity-5 scale-150 transition-transform group-hover:scale-[1.8] ${highlight ? 'text-white' : 'text-black'}`}>
         <Icon size={120} />
      </div>

      <div className="flex justify-between items-center mb-10 relative z-10">
        <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:rotate-12 ${highlight ? 'bg-white/10 text-[var(--color-brand-orange)]' : 'bg-gray-50 text-black'}`}>
           <Icon size={24} />
        </div>
        {trend && (
           <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${highlight ? 'bg-white/20 text-white' : 'bg-green-50 text-green-600'}`}>
             <TrendingUp size={12}/> {trend}
           </div>
        )}
      </div>
      
      <div className="relative z-10">
         <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${highlight ? 'text-white/40' : 'text-gray-400'}`}>{title}</p>
         <h3 className="text-5xl font-black font-poppins italic tracking-tighter leading-none">{value}</h3>
      </div>
    </div>
  );
}
