"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Car, Map, Banknote } from "lucide-react";
import { useDriverStore } from "../../store/useDriverStore";

export function BottomTabs() {
  const pathname = usePathname();
  const { activeOrder } = useDriverStore();

  // Hide tabs on Login screen
  if (pathname === "/driver/login") return null;

  return (
    <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-20 text-gray-400 z-50 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
      <Link href="/driver/home" className={`flex flex-col items-center gap-1 w-1/3 py-2 ${pathname === "/driver/home" ? "text-blue-600" : "hover:text-gray-900"}`}>
        <Car size={24} className={pathname === "/driver/home" ? "fill-blue-100" : ""} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Inicio</span>
      </Link>
      
      <Link href="/driver/active-order" className={`flex flex-col items-center gap-1 w-1/3 py-2 relative ${pathname === "/driver/active-order" ? "text-blue-600" : "hover:text-gray-900"}`}>
        <div className="relative">
           <Map size={24} className={pathname === "/driver/active-order" ? "fill-blue-100" : ""} />
           {activeOrder && (
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
           )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">Misión</span>
      </Link>
      
      <Link href="/driver/earnings" className={`flex flex-col items-center gap-1 w-1/3 py-2 ${pathname === "/driver/earnings" ? "text-blue-600" : "hover:text-gray-900"}`}>
        <Banknote size={24} className={pathname === "/driver/earnings" ? "fill-blue-100" : ""} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Ganancias</span>
      </Link>
    </nav>
  );
}
