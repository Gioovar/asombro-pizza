import { PrismaClient } from "@prisma/client";
import { Users, TrendingUp, Search, Star, Award, Crown, Zap } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const prisma = new PrismaClient();

const getTierInfo = (ltv: number) => {
  if (ltv > 5000) return { label: "Diamond Elite", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Crown size={12} /> };
  if (ltv > 2000) return { label: "Platinum", color: "text-purple-600 bg-purple-50 border-purple-100", icon: <Award size={12} /> };
  if (ltv > 1000) return { label: "Gold", color: "text-amber-600 bg-amber-50 border-amber-100", icon: <Star size={12} /> };
  return { label: "Silver", color: "text-slate-500 bg-slate-50 border-slate-100", icon: <Zap size={12} /> };
};

export default async function CustomersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const customerMap: Record<string, { address: string, totalSpent: number, orderCount: number, lastOrderDate: Date, email?: string }> = {};

  orders.forEach(o => {
    const custName = o.user?.name || o.customerName || "Anónimo";
    if (!customerMap[custName]) {
       customerMap[custName] = { 
          totalSpent: 0, 
          orderCount: 0, 
          lastOrderDate: o.createdAt, 
          address: o.address || "Dirección de App",
          email: o.user?.email || "Sin correo"
       };
    }
    customerMap[custName].totalSpent += o.total;
    customerMap[custName].orderCount += 1;
  });

  const clients = Object.entries(customerMap).map(([name, data]) => ({ name, ...data }));
  clients.sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-poppins tracking-tighter italic">CRM & Experiencia de Cliente</h1>
          <p className="text-gray-500 font-medium">Analiza el valor de vida (LTV) y el comportamiento de tu comunidad.</p>
        </div>
        <div className="bg-white flex items-center gap-3 px-6 py-4 rounded-[2rem] border border-gray-100 shadow-sm w-full md:w-auto">
           <Search size={18} className="text-gray-300" />
           <input type="text" placeholder="Buscar por nombre o correo..." className="outline-none text-sm font-medium w-full md:w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <Users className="mb-4 text-[var(--color-brand-orange)]" size={24} />
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Total Clientes</p>
            <p className="text-4xl font-black font-poppins italic">{clients.length}</p>
         </div>
         
         {/* More stats could go here */}
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-6">Perfil del Cliente</th>
                <th className="px-8 py-6">Nivel / Tier</th>
                <th className="px-8 py-6 text-center">Frecuencia</th>
                <th className="px-8 py-6 text-right">LTV Histórico</th>
                <th className="px-8 py-6 text-right">Último Pedido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((client, idx) => {
                const tier = getTierInfo(client.totalSpent);
                return (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">
                           {client.name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-gray-900 leading-none mb-1">{client.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{client.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${tier.color}`}>
                          {tier.icon}
                          {tier.label}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center justify-center bg-gray-50 border border-gray-100 w-10 h-10 rounded-2xl font-black text-gray-900 text-sm">
                        {client.orderCount}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="font-black font-poppins text-lg flex items-center justify-end gap-1.5 text-gray-900">
                        ${client.totalSpent.toFixed(0)} <span className="text-[10px] text-gray-400 font-bold">MXN</span>
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="text-sm font-bold text-gray-500">
                          {format(client.lastOrderDate, "dd MMM yyyy", { locale: es })}
                       </div>
                       <p className="text-[10px] text-gray-400 font-medium uppercase truncate max-w-[150px] ml-auto">
                          {client.address}
                       </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
