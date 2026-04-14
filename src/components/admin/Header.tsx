"use client";

import { useAdminStore } from "../../store/useAdminStore";
import { Menu, Bell, Store, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Header() {
  const { toggleSidebar, isStoreOpen, toggleStoreOpen, urgentOrdersCount } = useAdminStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
        >
           <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full text-gray-500 focus-within:ring-2 focus-within:ring-[var(--color-brand-orange)]/20 focus-within:bg-white transition-all border border-transparent focus-within:border-[var(--color-brand-orange)]/30 w-64 lg:w-96">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Buscar pedidos, clientes, productos..." 
            className="bg-transparent border-none outline-none text-sm w-full font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Global Store Status Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado de Tienda</span>
             <span className={`text-sm font-bold ${isStoreOpen ? 'text-green-600' : 'text-red-500'}`}>
                {isStoreOpen ? 'Abierto recibiendo pedidos' : 'Cerrado temporalmente'}
             </span>
          </div>
          <button 
            onClick={toggleStoreOpen}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] focus-visible:ring-opacity-75 ${
              isStoreOpen ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className="sr-only">Toggle Store Status</span>
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isStoreOpen ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Bell size={20} />
            {urgentOrdersCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          <AnimatePresence>
             {showNotifications && (
               <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 transition={{ duration: 0.15 }}
                 className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
               >
                 <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                   <h4 className="font-bold font-poppins text-sm">Notificaciones</h4>
                 </div>
                 <div className="p-2 max-h-64 overflow-y-auto">
                    {urgentOrdersCount > 0 ? (
                      <div className="p-3 bg-red-50 text-red-800 rounded-xl flex items-start gap-3">
                        <Store size={16} className="mt-0.5 shrink-0" />
                        <div>
                           <p className="text-sm font-bold">¡Tienes {urgentOrdersCount} pedidos nuevos!</p>
                           <p className="text-xs mt-1 text-red-600">Acéptalos pronto o serán asignados automáticamente.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-400">
                        <p className="text-sm font-medium">Todo está tranquilo por ahora 🍕</p>
                      </div>
                    )}
                 </div>
               </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black p-0.5 shadow-sm">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin+Asombro&background=random" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
