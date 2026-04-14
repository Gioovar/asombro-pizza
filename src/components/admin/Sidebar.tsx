"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Pizza, 
  ShoppingBag, 
  Bike, 
  Users, 
  BarChart4, 
  Settings,
  LogOut,
  Ticket
} from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useAdminStore();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pedidos", href: "/orders", icon: ShoppingBag },
    { name: "Menú", href: "/menu", icon: Pizza },
    { name: "Eventos & Mesas", href: "/events", icon: Ticket },
    { name: "Repartidores", href: "/drivers", icon: Bike },
    { name: "Clientes", href: "/customers", icon: Users },
    { name: "Reportes", href: "/reports", icon: BarChart4 },
    { name: "Configuración", href: "/settings", icon: Settings },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isSidebarOpen ? 260 : 80,
        transition: { duration: 0.3, ease: "easeInOut" } 
      }}
      className="h-screen bg-black text-white flex flex-col sticky top-0 shrink-0 border-r border-gray-900 z-50 overflow-hidden"
    >
      <div className="h-20 flex items-center px-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-full bg-[var(--color-brand-orange)] flex items-center justify-center font-bold text-sm shrink-0">
            A.
          </div>
          <span className={`font-poppins font-bold text-lg whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            Asombro <span className="text-[var(--color-brand-orange)]">Admin</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors whitespace-nowrap group relative
                ${isActive ? 'bg-[var(--color-brand-orange)] text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}
              `}
              title={!isSidebarOpen ? link.name : undefined}
            >
              <Icon size={20} className="shrink-0" />
              <span className={`font-medium text-sm transition-all duration-300 ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute pointer-events-none'}`}>
                {link.name}
              </span>

              {!isSidebarOpen && isActive && (
                 <motion.div layoutId="activeDot" className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800/50">
        <button 
          className={`flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-white transition-colors whitespace-nowrap w-full ${!isSidebarOpen && 'justify-center'}`}
          title={!isSidebarOpen ? "Cerrar sesión" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          <span className={`font-medium text-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            Cerrar sesión
          </span>
        </button>
      </div>
    </motion.aside>
  );
}
