import { PrismaClient } from "@prisma/client";
import { Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function MenuPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-poppins">Menú e Inventario 📋</h1>
          <p className="text-gray-500">Gestiona tus productos, costos y rentabilidad.</p>
        </div>
        <button className="bg-[var(--color-brand-orange)] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e65100] transition-colors">
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-semibold rounded-tl-3xl">Producto</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold text-right">Costo (Base)</th>
                <th className="p-4 font-semibold text-right">Precio Público</th>
                <th className="p-4 font-semibold text-right">Margen</th>
                <th className="p-4 font-semibold text-center">Estado</th>
                <th className="p-4 font-semibold text-center rounded-tr-3xl"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => {
                const margin = ((product.price - product.cost) / product.price) * 100;
                const isHealthyMargin = margin >= 60;

                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-[var(--color-brand-marble)] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <Image src={product.image} alt={product.name} fill className="object-contain p-1 mix-blend-multiply" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{product.category}</span>
                    </td>
                    <td className="p-4 text-right text-gray-500 font-medium">
                      ${product.cost.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-bold">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-semibold ${isHealthyMargin ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                         {margin.toFixed(0)}%
                       </span>
                    </td>
                    <td className="p-4 text-center">
                       <span className={`inline-block w-3 h-3 rounded-full ${product.active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-12 text-center text-gray-400">
               No hay productos en el menú todavía.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
