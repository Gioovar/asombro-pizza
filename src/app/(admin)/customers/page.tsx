import { PrismaClient } from "@prisma/client";
import { Users, TrendingUp, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const prisma = new PrismaClient();

export default async function CustomersPage() {
  // Aggregate clients directly from orders
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const customerMap: Record<string, { address: string, totalSpent: number, orderCount: number, lastOrderDate: Date, color: string }> = {};

  orders.forEach(o => {
    // If we have a connected User Fintech profile, prioritize that name, else fallback to traditional guest string name
    const custName = o.user?.name || o.customerName || "Anónimo";
    if (!customerMap[custName]) {
       customerMap[custName] = { 
          totalSpent: 0, 
          orderCount: 0, 
          lastOrderDate: o.createdAt, 
          address: o.address || "Digital Order",
          color: ['bg-pink-100 text-pink-600', 'bg-blue-100 text-blue-600', 'bg-orange-100 text-orange-600', 'bg-green-100 text-green-600'][Math.floor(Math.random()*4)]
       };
    }
    customerMap[custName].totalSpent += o.total;
    customerMap[custName].orderCount += 1;
  });

  const clients = Object.entries(customerMap).map(([name, data]) => ({ name, ...data }));
  clients.sort((a, b) => b.totalSpent - a.totalSpent); // Sort by LTV

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-poppins">CRM & Clientes 🤝</h1>
          <p className="text-gray-500">Historial de vida y retención de tus compradores.</p>
        </div>
        <div className="bg-white flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200">
           <Search size={18} className="text-gray-400" />
           <input type="text" placeholder="Buscar cliente..." className="outline-none text-sm w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-gradient-to-br from-[var(--color-brand-orange)] to-[#e65100] p-6 rounded-3xl text-white shadow-lg">
            <Users className="mb-4 opacity-80" size={24} />
            <p className="text-sm font-semibold opacity-90 uppercase tracking-widest mb-1">Total Clientes</p>
            <p className="text-4xl font-black font-poppins">{clients.length}</p>
         </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-semibold rounded-tl-3xl">Cliente</th>
                <th className="p-4 font-semibold">Dirección Principal</th>
                <th className="p-4 font-semibold text-center">Nº Pedidos</th>
                <th className="p-4 font-semibold text-right">LTV (Lifetime Value)</th>
                <th className="p-4 font-semibold text-right rounded-tr-3xl">Último Pedido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((client, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 shrink-0">
                         {client.name.charAt(0)}
                       </div>
                       <p className="font-bold text-gray-900">{client.name}</p>
                    </div>
                  </td>
                  <td className="p-4 max-w-[200px] truncate text-gray-500 text-sm">{client.address}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center bg-gray-100 w-8 h-8 rounded-full font-bold text-gray-600">
                      {client.orderCount}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-bold flex items-center justify-end gap-1 text-[var(--color-brand-orange)]">
                      <TrendingUp size={14} /> ${client.totalSpent.toFixed(2)}
                    </p>
                  </td>
                  <td className="p-4 text-right text-gray-500 text-sm">
                    {format(client.lastOrderDate, "dd MMM yyyy", { locale: es })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
